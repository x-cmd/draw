# Skill: 部署 draw 到 Cloudflare Workers

把 x-cmd/draw 部署成用户自己的 Cloudflare Worker:GET 渲染立即可用(11 种核心图 + `/draw/echarts` 覆盖层),短链(POST)按需开启。agent 的职责:前置检查 → 选路径与工具 → 执行 → 冒烟验收 → 按需开短链/自定义域名。

两条工具路径,按用户环境选:

| | wrangler(稳定) | cf CLI(beta,`npm i -g cf`) |
|---|---|---|
| 配置 | wrangler.jsonc(JSON) | cloudflare.config.ts(TS,`defineConfig`) |
| 部署 | `npx wrangler deploy [-c <file>]` | `cf deploy` |
| 建 DNS 记录 | ❌ 只能去 dashboard | ✅ `cf dns records create` |
| 路由 | routes `[{pattern, zone_name}]` | `triggers.fetch({pattern, zone})` |
| 备注 | 仓库脚本/CI 全绑它 | 底层 build 仍委托 Wrangler |

## 前置检查

| 项 | 要求 | 检查命令 |
|---|---|---|
| Cloudflare 账号 | 需要(免费计划即可) | wrangler: `npx wrangler whoami`;cf: `cf auth whoami` |
| 域名(zone) | 要挂路径路由必须 zone 在账号内 | cf: `cf zones list`;wrangler 无此命令 |
| Node | ≥18(wrangler)/ ≥22.18(读 cloudflare.config.ts) | `node -p 'process.versions.node'` |
| DNS 记录 | 目标主机名要有** proxied** 记录,route 才有流量 | `dig +short <domain>` 为空 → cf 建(见下) |

登录:wrangler `npx wrangler login` / cf `cf auth login`(浏览器 OAuth;cf 用 device 码流程)。

## 路径 A:wrangler + 一键脚本(workers.dev 入口,推荐起步)

```sh
bash scripts/setup.sh        # 仓内运行(跳过克隆)
# 任意位置(交互走 /dev/tty,curl 管道下照常提问):
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

脚本自动:克隆 → `npm install` → wrangler 登录 → 改写 wrangler.jsonc(写 name;删 routes/vars → workers.dev 根路径入口)→ `npx wrangler deploy` → 冒烟测试 → 打印 URL 与后续指引。

## 路径 B:cf CLI 挂自有域名路径路由(实测:po6.sh/draw)

```sh
npm i -g cf && cf auth login
npm i --no-save --no-package-lock cf        # 仓内:让 cloudflare.config.ts 的 cf/config 可解析
```

`cloudflare.config.ts`(仓根,示例):

```ts
import { defineConfig, triggers } from 'cf/config';
import * as entrypoint from './src/index.ts' with { type: 'cf-worker' };

export default defineConfig({
  worker: {
    name: 'draw-po6',
    entrypoint,
    compatibilityDate: '2026-09-01',
    compatibilityFlags: ['nodejs_compat'],
    workersDev: true,                        // 保留 workers.dev 直连(冒烟/备通道)
    triggers: [triggers.fetch({ pattern: 'po6.sh/draw*', zone: 'po6.sh' })],
  },
});
```

空域名(无 DNS 记录)先建 proxied 占位记录——Worker 拦截全部流量,永不回源,内容随便:

```sh
cf dns records create --zone po6.sh --body \
  '{"type":"AAAA","name":"po6.sh","content":"100::","proxied":true,"comment":"draw worker placeholder"}'
```

然后 `cf deploy`。路径前缀自动适配:route `po6.sh/draw*` → 服务在 `/draw`(`/draw` 子路径与根路径入口同一份代码,无需改)。

## 路径 B':wrangler 挂路径路由(不想装 cf)

写独立配置 `wrangler.<name>.jsonc`(不动仓库主配置):name + `routes:[{pattern:"<host>/draw*",zone_name:"<host>"}]` + `workers_dev:true`,然后 `npx wrangler deploy -c wrangler.<name>.jsonc`。DNS 记录仍需 dashboard 手建(wrangler 无 DNS 命令)。

## 验收标准(全部通过才算部署完成)

```sh
# workers.dev 根路径入口:
curl -fsS "$URL/?type=pie&labels=A,B&values=2,3" | head -c 300 | grep -q '<svg'   # 核心渲染
# 域名路径路由入口:
curl -fsS "https://<host>/draw?type=pie&labels=A,B&values=2,3" | head -c 300 | grep -q '<svg'
curl -fsS -o /dev/null -w '%{http_code}\n' "https://<host>/draw/echarts?d=%7B%22series%22%3A%5B%7B%22type%22%3A%22bar%22%2C%22data%22%3A%5B1%2C2%5D%7D%5D%7D"   # echarts = 200
curl -fsS "https://<host>/draw" | grep -q '<title>draw'                           # 演示页
```

刚部署冒烟失败多为传播延迟,等 1 分钟重试;若本机 `*.workers.dev` 解析到非 CF IP(如 128.121.x.x)是本地网络 DNS 污染,换网络或以域名路由入口验收,不是部署问题。

## ⚠️ 谁接流量:DNS 三态模型(必读)

同主机上"静态站 + /draw 共存"能否成立,由该主机 DNS 记录的代理状态决定:

| DNS 状态 | 流量路径 | path route(`/draw*`)结局 |
|---|---|---|
| **橙云 proxied**(源站随意:占位 IP / GitHub Pages / 任意源) | 浏览器 → CF edge → route 匹配的路径进 Worker,其余回源站 | ✅ 共成:route 优先于回源,静态站与 /draw 互不干扰 |
| **灰云 DNS-only**(GitHub Pages 官方推荐) | 浏览器直连源站,**不过 CF** | ❌ Worker 无从生效,`/draw` 回源站 404(不是被抢,是流量根本不来) |
| 主机被 Worker **Custom Domain** 绑定 | 整主机流量归该 Worker | ❌ route 挂载成功但永远抢不到(CF 内部优先级:Custom Domain > route) |

**Custom Domain 占用的识别**(实测:ljh.sh 整站任意路径回同一 SPA、响应头带 `x-deployment-id`)与处置:

- **不要动现站**(把现站 Custom Domain 改成 route 可解,但影响整站,必须 owner 决策)
- 正确做法:给 draw 换**子域**(如 `draw.ljh.sh`:cf 建 proxied 记录 + route `draw.ljh.sh/*`)

**静态站(GitHub Pages 等)共存的推荐姿势 = 子域拆分**:静态站占主域(灰云直连 GitHub,HTTPS 干净),draw 挂 `draw.<domain>`(橙云 + route)。同主机全橙云也能共存(route 优先),但 GitHub Pages + 橙云有回源 HTTPS 证书坑(GitHub 签 Let's Encrypt,SNI 对不上,需 Full 模式折腾),不推荐。

诊断命令:`dig +short <host>` 看是否 CF IP(橙云);`curl -sI https://<host>/ | grep x-deployment-id`(是 Worker);`curl https://<host>/whatever` 回同一 HTML = SPA 占位。

## 部署后

- **更新**:仓内 `git pull` 后 `npx wrangler deploy`(或 `cf deploy`)
- **本地调试**:`npm run dev`(workerd 沙盒)
- **自定义域名/dashboard 方式**:Workers → <name> → Settings → Domains & Routes
- **workers.dev 噪音**:wrangler 会警告 preview_urls 未设置,无关紧要;可在配置显式 `"preview_urls": false` / `previewUrls: false` 消除

## 开启短链(可选,默认关)

1. 建一个公开 GitHub 仓(或专用分支)存图表数据
2. 配置 vars:wrangler `"vars":{"DATA_REPO":"owner/name","DATA_BRANCH":"charts"}`;cf 用 `bindings.vars(...)` 或 env
3. `npx wrangler secret put GITHUB_TOKEN`(fine-grained PAT,仅授该仓 Contents 写;cf:`cf workers secret put ...`)
4. 重新部署

## 常见问题

| 症状 | 处置 |
|---|---|
| 部署报 ratelimit binding 不支持(部分计划) | 删配置的 `ratelimits` 段重试(POST 不限流,GET 渲染不受影响) |
| curl\|bash 报 `./draw 已存在` | 换目录或先删再跑 |
| POST /draw 返回 "not configured" | 正常——短链未开启,按上节配置 |
| route 挂上但 URL 回 HTML/SPA | 见「DNS 三态」:主机被 Custom Domain 占用,换子域 |
| 挂了静态站(GitHub Pages 等)后 /draw 404 | 灰云直连源站、流量不过 CF:改橙云或按「子域拆分」重构 |
| 域名 522/超时 | 该主机名无 proxied DNS 记录:cf 建(路径 B)或 dashboard 手建 |
| `cf` 读配置报 Node 版本错 | cloudflare.config.ts 需 Node ≥22.18 |
