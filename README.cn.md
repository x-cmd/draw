# draw

> [English](README.md) | 中文

AI 时代的 SVG 图表生成服务(狗粮原型)。单端点 `/draw?type=...`,数据在 URL 里、输出带机器可读 `<metadata>`、Cloudflare Workers + TypeScript 直生成 SVG。风格体系对齐设计师规范(13 张 SVG),每图种多风格变体。

## 三种使用方式(同一份渲染核心)

**托管服务**(零安装):直接拼 URL — `https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2`

**npm 库**(离线/嵌入,同步无网络,参数与 URL 完全一致):

```sh
npm install @x-cmd/draw
```
```ts
import { draw } from '@x-cmd/draw';
const { svg } = draw({ type: 'pie', labels: 'A,B', values: '3,2', t: 'evil', scheme: 'dark' });
// 也接受查询串: draw('?type=bar&labels=Mon,Tue&values=3,5')
// 数组值 = 重复参数(labels 含逗号时): draw({ type: 'bar', labels: ['Q1, 2024', 'Q2'], values: [1, 2] })
```

**CLI**(`npm i -g @x-cmd/draw` 后可用,或 `npx`):

```sh
draw --type pie --labels "TypeScript,Python,Go" --values "4821,2312,980" --out pie.svg
draw --type hbar --labels a,b,c --values 3,2,1 --theme xcmd              # 长参数(--theme/--width/--height)
draw "?type=hbar&labels=a,b,c&values=3,2,1&t=xcmd"   # 裸查询串,与 URL 同参
```

**自托管**:三种入口任选 —

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve                    # Node 本地服务(默认 http://localhost:8787/draw,含演示页)
npm run dev                      # Cloudflare wrangler 本地开发
bash scripts/setup.sh            # 一键部署到你自己的 Cloudflare 账号
```

环境变量(Node 服务):`PORT`(默认 8787)· `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN`(配置后 POST 短链同样可用,未配置时与线上自部署一样优雅降级)。

**Deno**(原生 TS;渲染核心是纯函数 — 不碰网络/文件,零权限沙盒即安全边界):

```ts
import { draw } from "jsr:@x-cmd/draw";   // JSR(Deno 原生注册表)
// 或 npm:import { draw } from "npm:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

```sh
deno add jsr:@x-cmd/draw
# 仓库内直跑源码(免构建):
deno task cli --type pie --labels A,B --values 3,2 --out pie.svg   # 仅需 --allow-write
deno task serve                                                    # 本地服务(同 npm run serve)
# 渲染零权限可证:deno eval 默认无任何授权,直接 import 即渲染成功
```

## 端点

**`GET /draw?type=<pie|bar|hbar|line|area|radar|gauge|scatter|combo|sankey|qr>`** — 渲染图表

| type | 图表 | 限制 |
|---|---|---|
| `pie` | 环形图;`donut=0` 变实心饼 | ≤100 类(>9 自动合并 Other) |
| `bar` | 柱状图/分组并排;多系列加 `stack=1` 变堆叠柱 | ≤30 组 |
| `hbar` | 水平柱状图(排行场景,标签左值右) | ≤30 条,单系列(部分风格双系列) |
| `line` | 折线图(平滑+渐变面积)/多折线 | ≤60 点 |
| `area` | 面积图/多系列面积(渐变填充) | ≤60 点 |
| `radar` | 雷达图 | 3-12 维 |
| `gauge` | 仪表盘(240° 弧+中心数值) | `value`+`max`(默认100),value≤max;多环 ≤8 |
| `scatter` | 散点图(双数值轴,支持负值;默认不标数值) | `x=&y=`,≤200 点 |
| `combo` | 混合图:柱(`series=`)+线(`line=`)同图,`stack=1` 变堆叠柱 | ≤30 组,共 ≤6 系列 |
| `sankey` | 桑基图(流向带宽) | `labels=`+`links=A>B:30`,≤24 节点/60 链接 |
| `qr` | 二维码 | `d`=文本(≤1000 字符),`fg`/`bg` 配色,`title`/`unit` 标注 |

**`GET /draw`**(无参数)或 `?tab=pie` — 演示页(11 图种分类、全部风格变体、URL 双形态面板)
**`POST /draw?type=...`** — 提交 JSON/CSV body 创建永久短链
**`GET /draw/c/<hash>`** — 短链渲染(immutable)

通用参数:

- `t` 风格家族(见下节,按图种取用;该图种未做时回退默认)
- `scheme` 明暗:`auto`(默认,跟随系统)/ `dark` / `light`
- `v` 钉住版本;`w`/`h` 尺寸(200–1600 / 140–1200,qr 为 120–1000 / 140–1000)
- `num` 数值标注:`all` / `peak`(仅最高)/ `none`。默认跟随风格(设计规范变体多为 `none`,`?num=all` 显式全标)。适用于 pie/bar/hbar/line/area/scatter/combo;radar/gauge/sankey/qr 忽略
- `subtitle` 编辑式副标题(仅 area 的编辑式标题风格 `t=opendata` 渲染)、`source` 数据来源脚注(仅 area 渲染,任意 `t`);其余图种解析但忽略

## 风格(`?t=`)

按图种提供变体,明暗双配色自动切换:

| type | 可用家族 |
|---|---|
| `pie` | `opendata`(默认,标签全外)、`evil`(圆角环+内标值)、`evil-mono`(实心饼+引线外标)、`market-mono`(灰阶+环心总计)、`progress`(点状进度环)、`revenue`(渐变扇区+虚线内圈) |
| `bar` | `evil`(默认,分组柱)、`base`(卡片柱)、`grid`(表格柱) |
| `hbar` | `base`(默认)、`opendata`(支持 `ref=`/`reflabel=` 参考线)、`xcmd`(像素条,值为 %)、`xcmd-issue`(双系列蝴蝶)、`rank`(双系列实底+斜纹) |
| `line` | `shadcn`(默认)、`evil`、`evil-glow`(发光)、`evil-mono`、`opendata`(线端标签) |
| `area` | `evil`(默认,双系列虚线面积)、`star`(手绘风)、`opendata`(浓渐变+编辑标题)、`pixel`、`polka` |
| `radar` | `base`(默认)、`evil`(多系列)、`xcmd` |
| `sankey` | `base`(默认)、`fund`、`pipeline` |
| `gauge` | `base`(默认)、`gradient`、`reliability`(分区环仪表) |
| `scatter` / `combo` / `qr` | `base`(combo 另有 `evil`) |

## 传数据的两种方式

**扁平参数(URL 永远可读,推荐)**:

```
/draw?type=pie&title=Stars by language&unit=stars&labels=TypeScript,Python,Go,Rust&values=4821,2312,980,645
/draw?type=bar&title=Weekly downloads&labels=Mon,Tue&values=1200,1800
```

标签含逗号时用重复参数:`labels=Q1, 2024&labels=Q2&values=1&values=2`

**多系列对比**(type=bar 分组/堆叠、type=line 多折线、type=area 多面积,≤6 系列):

```
/draw?type=area&labels=Mon,Tue,Wed&series=Desktop:120,180,150&series=Mobile:80,90,85
```

**JSON 形态(复杂数据)**:`?d=` + URL 编码的 JSON:

```json
{"title":"Stars by language","unit":"stars","data":[{"label":"TypeScript","value":4821},{"label":"Python","value":2312}]}
```

多系列 JSON:`{"labels":["Mon","Tue"],"series":[{"name":"draw","values":[120,180]},{"name":"qc","values":[80,90]}]}`

二维码:`/draw?type=qr&d=https://github.com/tzw&fg=%236366f1`

仪表盘:`/draw?type=gauge&title=Build pass rate&value=87&max=100`

散点图:`/draw?type=scatter&x=10,20,30&y=5,8,7`

混合图:`/draw?type=combo&labels=Mon,Tue&series=dl:120,180&line=growth:5,8`(柱与线量级差 >5 倍时自动启用双 y 轴)

## 短链接(数据存 GitHub 仓库,内容寻址、永不过期)

```
POST /draw?type=pie                body = 图表 spec JSON
POST /draw?type=bar&t=evil         body = CSV(text/csv,首行表头)
→ 201 {"hash":"a3f9c2d4e5f60718","url":"https://x-cmd.com/draw/c/a3f9c2d4e5f60718"}

GET /draw/c/<hash>                 → SVG,永久 immutable 缓存
```

- 指纹 = 规范化数据(template+theme+spec,递归排序 key)的 SHA-256 前 16 位;相同数据 → 相同短链(自动去重、幂等);读取时复核指纹,存档被改即拒绝
- 多系列支持 bar/line/area/radar,以及 hbar(仅 `t=xcmd-issue`/`t=rank`,恰好 2 系列);其余 type 提交多系列会被 400 拒绝;POST 限 30 次/分钟/IP
- 服务端配置:`DATA_REPO`(公开仓,`owner/name`,wrangler.jsonc)、`GITHUB_TOKEN`(secret,fine-grained PAT 仅授该仓 **Contents 写**;读取走 raw 免 token);数据文件存于 `charts/<hash>.json`
- 可见性:数据仓是公开的,任何人可浏览目录——**请勿创建含敏感数据的短链**(私有存储方案规划中,将收费提供)
- 对比 quickchart:短链会过期(6个月/数天),我们的永不过期

## 版本语义

- 不带 `v`:渲染**最新版**,`Cache-Control: max-age=300`(链接随升级变化)
- `?v=1`:钉住版本,`Cache-Control: max-age=86400`(1 天;渲染仍随部署演进,不承诺永久冻结)。`v` 取值 1..当前版本,超出报 400
- `immutable` 仅用于短链 `/c/<hash>`(内容寻址,输出真正永不变化;短链忽略 `v` 参数)

## AI 可读

每个 SVG 内嵌 `<metadata>`(转义 JSON):`{generator, template, version, spec}`,数据与参数可直接 round-trip。文字全部用 `<text>`(真文本)。

## 项目结构

一次请求的路径:**handler.ts(HTTP 路由)→ render/query.ts(参数→渲染核心)→ specs/(解析)→ styles/(选皮肤)→ render/(算几何出 SVG)**。渲染核心是纯函数,三个运行时共享:Cloudflare Worker(index.ts 薄壳)、Node 服务(node/server.ts)、npm/JSR 库与 CLI(lib.ts + node/cli.ts)。

```
src/
├── index.ts        Cloudflare Workers 入口(薄壳:边缘缓存、限流 binding、waitUntil)
├── handler.ts      共享 HTTP 层:路由、POST 短链创建、短链渲染、演示页、错误包装
├── lib.ts          npm/JSR 库入口(barrel + 高层 draw() 同步 API)
├── demo.ts         演示页(图种 tab、风格变体、URL 双形态面板)
├── theme.ts        皮肤 → CSS 变量(:root + 暗色媒体查询)
├── store.ts        短链存储(GitHub repo 读写、指纹、幂等)
├── version.ts      版本号与缓存语义
├── types.ts        跨运行时结构类型(DrawEnv/Platform)
│
├── specs/          【解析层】URL 参数 → 强类型 spec(校验、截断、上限)
│   ├── base.ts       ChartSpec + 扁平参数/JSON 双形态解析
│   ├── multi.ts      多系列(series=)解析
│   └── gauge/scatter/combo/csv.ts  图种专属解析
│
├── render/         【渲染层】spec + 皮肤 → SVG 字符串(纯计算,无布局引擎)
│   ├── svg.ts        公共构造:布局几何、刻度、网格、图例、标签防碰撞、文字测量
│   ├── query.ts      参数→SVG 同步核心(drawHandler/短链渲染段,库与 HTTP 共用)
│   ├── dispatch.ts   短链存档 → 渲染器的模板分发
│   ├── pie/line/line-multi/area/…  每图种一个渲染文件(bar 拆 3、line 拆 2)
│   └── qr.ts         二维码
│
├── styles/         【风格层】设计师规范 SVG 的规则化
│   ├── types.ts      Rules 词汇表 + 默认值(方向/圆角/图例/虚线/标注…)
│   ├── pie/line/area/…  每图种变体定义(色板明暗双值 + 规则差异 + 规范画布尺寸)
│   ├── common.ts     规范色板常量
│   ├── handlee.ts    手绘字体 base64(star 风格)
│   └── index.ts      resolveSkin:图种 + ?t= + 明暗 → 皮肤
│
└── node/           【Node 入口】server.ts 本地服务 · cli.ts draw CLI

test/               vitest(解析 + 渲染 + 共享 HTTP 层 + 库 API)
wrangler.jsonc      部署配置(路由 x-cmd.com/draw*)
deno.json           JSR 发布 + Deno 任务
```

加新图种 = `specs/xxx.ts` + `render/xxx.ts` + `styles/xxx.ts` 各一个文件,再在 `render/dispatch.ts` 与 `render/query.ts` 各注册一行。

## 自部署(一键)

部署一套自己的 draw 到你的 Cloudflare 账号(免费计划即可,只需 CF 账号):

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

脚本流程:克隆仓库 → wrangler 浏览器登录 → 部署 → 冒烟测试,结束打印你的 `*.workers.dev` 地址。GET 渲染全家桶(11 图种、全部风格)开箱即用。

- **短链(POST)第一阶段未默认启用**,调用会返回"未配置"提示。启用方法:建一个公开仓存数据 → 本地 wrangler.jsonc 的 vars 设 `DATA_REPO=owner/name` → `npx wrangler secret put GITHUB_TOKEN`(fine-grained PAT 仅授该仓 Contents 写)→ 重新部署
- 已 clone 仓库的,在仓库目录里跑 `npm run setup` 即可(跳过克隆)
- 路径前缀自动适配:workers.dev 根路径与 `/draw` 子路由都能用,无需改代码;也可用 `BASE_PATH` var 显式钉死
- 绑自有域名:dashboard → Workers → Settings → Domains & Routes 加 route(任意路径前缀)
- Windows 请用 WSL 或 Git Bash 运行

## 开发

```sh
npm install
npm run dev      # wrangler dev 本地起服
npm test         # vitest
npm run check    # tsc --noEmit × 3(worker / node / build)
npm run build    # 产 dist/(npm 库 + CLI)
npm run deploy   # wrangler deploy
```

## 许可

代码 [Apache-2.0](LICENSE)。内嵌字体遵循各自许可:Inter(OFL,全文见 `src/styles/inter-OFL.txt`)、Handlee(OFL)。
