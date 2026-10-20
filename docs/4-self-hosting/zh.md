---
x-title: draw 自托管 —— Cloudflare 一键部署 / Node 本地服务
x-desc: 把 x-cmd/draw 部署成自己的服务:Cloudflare Workers 一键脚本(setup.sh)、wrangler dev 本地开发、Node serve 零依赖起服;含短链存储(DATA_REPO/GITHUB_TOKEN)与 BASE_PATH/域名配置。
x-sidebar: draw 自托管
x-keywords: draw, self-hosted, 自托管, cloudflare, workers, wrangler, node, setup
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 自托管'
      inLanguage: 'zh-CN'
      about: 'x-cmd/draw 自托管部署'
---

# draw 自托管

同一份渲染核心,三种部署形态,任选其一。

## 一、Cloudflare Workers(推荐,免费计划即可)

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

脚本流程:克隆仓库 → wrangler 浏览器登录 → 部署 → 冒烟测试 → 打印你的 `*.workers.dev` 地址。GET 渲染全家桶(11 图种、全部风格)开箱即用。

已 clone 仓库的,在仓库目录里跑 `npm run setup` 即可(跳过克隆)。

- 路径前缀自动适配:workers.dev 根路径与 `/draw` 子路由都能用,无需改代码;也可用 `BASE_PATH` var 显式钉死
- 绑自有域名:dashboard → Workers → Settings → Domains & Routes 加 route(任意路径前缀)
- Windows 请用 WSL 或 Git Bash 运行
- 本地开发:`npm run dev`(wrangler dev)

## 二、Node 本地服务

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve        # http://localhost:8787/draw(含演示页)
```

环境变量:`PORT`(默认 8787)· `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN`(配置后 POST 短链同样可用,未配置时优雅降级)。Deno 亦可:`deno task serve`。

## 三、短链存储(POST /draw)启用

自部署第一阶段未默认启用,调用会返回"未配置"提示。启用步骤:

1. 建一个公开仓库存数据(短链数据 = 公开的,请勿存敏感数据)
2. wrangler.jsonc 的 vars 设 `DATA_REPO=owner/name`(`DATA_BRANCH` 可选,默认 main)
3. `npx wrangler secret put GITHUB_TOKEN`(fine-grained PAT 仅授该仓 Contents 写)
4. 重新部署

数据文件存于 `charts/<hash>.json`,内容寻址、永不过期;读取走 raw 免 token,配额消耗仅在创建时。

## 四、库内嵌(零部署)

不想要服务?`npm install @x-cmd/draw` 或 `jsr:@x-cmd/draw`,直接 `draw(params)` 同步渲染 —— 见 [快速使用](../1-quick-start/zh.md)。
