---
name: x-cmd-draw
description: Create charts, data visualizations, architecture diagrams, flowcharts, mind maps, UML diagrams, and project statistics using x-cmd Draw. Use when visualizing structured data, analyzing code repositories, creating README graphics, technical documentation, reports, system architectures, or workflows. Supports URL-based SVG generation, Mermaid, ECharts, and local rendering.
---

# 用 draw 生成图表

```
https://x-cmd.com/draw?type=<图种>&labels=A,B,C&values=1,2,3
```

拼 URL 即得可嵌入的 SVG,无需安装。图的全部内容与参数都在 URL 里——可预览、可 diff、可进版本库。SVG 内嵌原始数据(`<metadata>`),缓存可控(`v=N` 指定渲染器版本参数,短链内容寻址永久 immutable)。

README 嵌入推荐形态 = 图预览 + 点击进 explore(悬停看数、调参数、直接改数据):

```
[![](https://x-cmd.com/draw?type=pie&labels=TS,Py,Go&values=4821,2312,980)](https://x-cmd.com/draw/explore?type=pie&labels=TS,Py,Go&values=4821,2312,980)
```

## 1. 核心理念

**一个链接,两类读者。** 同一张图:人在浏览器/文档里看 SVG;Agent 从 `<metadata>` 读出原始 spec,继续计算和推理。

**URL 即 API。** 内容在 URL 里,不是画死的——改参数即改图。

**数据不因渲染而丢失(读 spec,不猜图):**

- 复用或分析图表时,优先读 SVG 内嵌的原始 specification(数据、标签、单位、参数)。
- 原始 spec 存在时,不要从 SVG 几何、颜色、位置或取整后的标注反推数据。
- 修改图表 = 修改原始 spec 重新生成,不在 SVG 上打补丁。

标准动作:① 取回 SVG → ② 定位 `<metadata>` → ③ 解析其中的 spec → ④ 核对数据是否完整(标签、数值、单位、系列都在)→ ⑤ 不完整就回到原始数据源,不从图形反推。注意各 endpoint 内嵌粒度不一(如 tokei 不内嵌原始统计 JSON):第 ④ 步发现缺失就走第 ⑤ 步。

## 2. 什么时候用 / 不用

**用**:README/文档/报告配图;结构化数据可视化;把文字描述的结构(架构、流程、状态机、排期)画成图;项目代码统计。

**不用**:需要复杂交互(图是静态 SVG,交互在 explore webapp);海报级自由排版。

需要长期固定的分享:POST 短链(内容寻址、永久 immutable)是唯一保证;`v=N` 只是指定渲染器版本参数——渲染仍随部署演进,不承诺输出永久不变。

## 3. 工作流程

1. **理解需求**:用户给了数据 → 忠实原始数值,不擅自修改;只有文字描述 → 提取实体、关系、分类、时间顺序。
2. **收集与准备数据**:优先从真实来源取数——文件、命令输出(tokei/cloc/git log)、CSV/JSON、API。可以做统计、聚合、计算,但必须保留口径:单位、时间范围、聚合规则写清楚;不把估算伪装成实测;不混用不同单位、不同口径的数据。例:统计项目语言占比,先跑真实统计命令,别凭 README 描述估。
3. **选择可视化**:见第 4 节目录。原则:图服务信息表达,不为用某种图改变数据含义;已有专用 endpoint 的图优先用专用 endpoint,ECharts 只补专用 endpoint 没覆盖的图;不拿 ECharts 重复实现原生图种;复杂图先找 demo 里的同类案例参考。
4. **生成 URL**:简单数据用扁平参数(AI 可读、免转义);含特殊字符或结构复杂用 `?d=` + **整体编码后的 JSON**(见 §6.2)。用运行环境提供的 URL 编码函数处理数据值,不手写百分号。
5. **验证**:见第 7 节。能访问渲染结果就实际取回 SVG 检查,不只凭 URL 推断;不能访问就如实说明未做视觉验证。
6. **交付**:见第 5 节,按场景给输出形态。

## 4. 可视化目录

### 4.1 原生数据图表(`?type=…`)

| 数据形状 / 任务 | type | 示例(可直接复制) |
|---|---|---|
| 占比 | `pie` | `type=pie&labels=TS,Py,Go&values=4821,2312,980` |
| 分类对比 | `bar` | `type=bar&labels=Mon,Tue&values=120,180` |
| 多系列对比 | `bar` | `type=bar&labels=Mon,Tue&series=a:12,18&series=b:9,10` |
| 排行 / 长标签 | `hbar` | `type=hbar&labels=TS,Py,Go&values=4821,2312,980` |
| 趋势 | `line` / `area` | `type=line&labels=Jan,Feb&series=a:120,180&series=b:80,90` |
| 多维评估 | `radar` | `type=radar&t=evil&labels=速度,稳定,生态&series=a:8,9,7&series=b:6,7,8` |
| 完成度 / 得分 | `gauge` | `type=gauge&title=Pass rate&value=87&max=100` |
| 相关性 / 分布 | `scatter` | `type=scatter&x=1,2,3&y=4,5,6` |
| 柱 + 线混合 | `combo` | `type=combo&labels=Mon,Tue&series=dl:120,180&line=growth:5,8` |
| 流向 | `sankey` | `type=sankey&labels=Ads,Web,Buy&links=Ads>Buy:30;Web>Buy:20` |
| 优先级 / 决策矩阵 | `quadrant` | `type=quadrant&quadrants=快赢,战略,填坑,放弃` |
| 四向模型 | `compass` | `type=compass&center=成长&up=自己&right=他人&down=组织&left=环境` |
| 两个系列背靠背 | `butterfly` | `type=butterfly&labels=A,B&left=Opened:7,8&right=Closed:5,6` |
| 日历 / 课程表 / 排期 | `calendar` | `type=calendar&layout=month&start=2026-11-02&ev=2026-11-03;meeting;需求评审;14:00` |
| 二维码 | `qr` | `type=qr&d=https://x-cmd.com` |

### 4.2 结构图:统一节点与连线语法

架构图(arch2 / archmap)、时序图(seq)、用例图(uc)、数据流(dataflow)、生命周期(lifecycle)、ERD、类图(class)读的是**同样三行参数** —— 通用语法只需学一遍,各图种的类型词汇与特殊规则见本节末尾:

```
n=id;type;label[;sub][;pos]     节点(可重复)
e=from;to[;label][;variant]      边(可重复)
b=label;id id …                  分组/边界(可重复)
```

- **id** —— 字母数字点横线下划线,不能以标点开头;`e=`、`b=` 里用它指代
- **type** —— 每种图各一套词汇(下表),决定颜色、角标和形状;用错了是 400,错误里带着它认识的那几个
- **label** —— 大字;**sub** —— 小字,`%0A` 断行(ERD 字段表、类图成员表靠它)
- **pos** —— 可省。格子 `r0c1`、跨格 `r0c1w2` / `r1c0h2`;像素 `p40,80[,120x48]`。不写就由引擎按你写的顺序自己排
- **variant** —— archmap/arch2 与四种新图种用 `main`(主流程)/`dash`(次要);seq 用结尾一段 `dash` 表示回信;uc 用 `<<include>>` 标签表示虚线依赖
- **b=** 把已有的 id 框成一组(系统边界、泳道),可写多次;它不替你建节点

| 路径 | 节点类型 |
|---|---|
| `/draw/arch2` `/draw/archmap` `/draw/seq` | `fe` `be` `db` `cloud` `sec` `bus` `svc` `ext` |
| `/draw/uc` | `actor` `uc` |
| `/draw/dataflow` | `process` `store` `source` `sink` |
| `/draw/lifecycle` | `state` `decision` `terminal` |
| `/draw/erd` | `table` `view` |
| `/draw/class` | `class` `iface` `enum` |

架构图那八种词汇:`fe` 前端、`be` 后端、`db` 数据库、`cloud` 云服务、`sec` 安全、`bus` 消息、`svc` 通用服务、`ext` 外部系统。

```
https://x-cmd.com/draw/arch2?n=web;fe;Web app;your browser;r0c0&n=api;be;API;Cloudflare Worker;r0c1&e=web;api;GET /draw?type=pie
```

各图种的特殊规则(语法统一,语义不统一,这里只列关键差异):

- **seq**:参与方按 `n=` 出现顺序从左到右排;`e=from;to` 按时间先后写,回信在 label 尾段加 `;dash`。
- **erd**:字段表写在 `sub` 里,`%0A` 分行;每行 `名字:类型 (pk|fk|uk)` 标键,例 `id:int (pk)`;边标签写 `1:N` 自动画鱼尾记号(一/多)。
- **class**:成员行 `+ name: Type`(`+` 公有 / `-` 私有 / `#` 保护),方法 `greet(): void`;边标签写 `extends` / `implements` 画 UML 空心三角。
- **dataflow**:`store` 画圆柱、`source`/`sink` 画圆角;按「谁读谁写」的方向连边。

其余细节以各图种的 explore 编辑页与文档站为准,不在此堆砌。

派生形态:`/draw/cloud` 同一套 `n=`/`e=` 模型,节点画成大图标(diagrams.net 那种云架构海报)。

### 4.3 项目统计:/draw/tokei

把 `tokei --output json` 的结果直接成图:GET `?d=<tokei json>` 或 POST body(亦可 `langs=` 收 property 短形态)。画「代码 / 注释 / 空行」三段堆叠柱(含文件数)。AI 分析代码库时的首选入口——先跑真实统计,再成图。

### 4.4 排期:/draw/gantt 与 /draw/gantt2

同一份 mermaid 甘特源码(`m=`,首行 `gantt` 关键字可省),两张脸:`/draw/gantt` 是甘特本命脸;`/draw/gantt2` 换成架构图 v2 那张脸。

### 4.5 Mermaid 流图:/draw/mermaid

`m=<flowchart 源码>`,线上有 Flow / Mono 两种形态(demo 可见)。v1 子集:`graph`/`flowchart` 的节点形状、边样式/标签、subgraph(→ 分组);首行是 `gantt` 时分派到甘特渲染。

### 4.6 思维导图:/draw/mindmap

`n=根/子/孙` 路径树,树 → 自动布局。

### 4.7 扩展:ECharts(`/draw/echarts`)

原生图表与专用 endpoint 没覆盖的图(热力图/箱线/烛台/旭日/漏斗/关系图/美国各州地图…),把 echarts option 放进 `?d=`(整体编码 JSON):

```
https://x-cmd.com/draw/echarts?d=%7B%22xAxis%22%3A%7B%22type%22%3A%22category%22%2C%22data%22%3A%5B%22A%22%2C%22B%22%5D%7D%2C%22yAxis%22%3A%7B%22type%22%3A%22value%22%7D%2C%22series%22%3A%5B%7B%22type%22%3A%22bar%22%2C%22data%22%3A%5B1%2C2%5D%7D%5D%7D
```

- 最简 option 即可出图(bar/line/scatter/boxplot 裸 option 自动补轴);`?d=` 之外共用 `w/h/t/scheme/v`
- 风格自动注入(系列色板/轴中性色/Inter 字体/明暗 auto),option 里显式写的样式恒优先;`?d=` ≤16000 字符
- 输出同嵌 `<metadata>`(option 原文,可解析还原)
- 地图:随包带 US 各州 GeoJSON(50 州 + DC,Albers 投影),`"type":"map","map":"USA"` 即得 choropleth;`data[].name` 用州全名(California / New York / …),配 `visualMap` 上色;州上写数字:`series.label.show` + `series.labelLayout.hideOverlap`(浅底深字、深底白字)

## 5. 输出形态与组合

### 5.1 按场景交付

| 场景 | 方式 |
|---|---|
| GitHub README / 项目文档 | `[![](渲染URL)](explore URL)`(预览 + 点进 explore 改数据) |
| 技术文章 | Markdown 图片 `![](渲染URL)` |
| 网页 | `<img>` 或裸 SVG URL |
| 固定数据,要最新渲染 | 不指定 `v`(缓存 300s) |
| 固定数据,要指定渲染器版本 | `v=N`(缓存 1 天;不承诺部署演进后输出不变) |
| 定期更新的数据 | 重新取数、重新生成 URL —— 不指定 `v` 只代表用最新渲染器,**不会让图自动更新**(数据在 URL 里) |
| 长期固定分享 | POST 短链 `/draw/c/<hash>`(内容寻址、唯一 immutable 形态) |

三个机制各管一件事:URL 决定数据与参数;`v=N` 指定渲染器版本参数;短链把「数据 + 风格」固化成不可变链接。

### 5.2 本地 vs 远程渲染

| 场景 | 方式 |
|---|---|
| README、公开文档、临时图 | 在线 URL |
| CI 里自动生成 SVG | npm CLI |
| 内网、离线、敏感数据 | 本地渲染 |
| 大体积 ECharts JSON(超 16000 字符) | 本地渲染(无 URL 长度限制) |
| 自建图表服务 | Cloudflare 自托管(见仓库 README) |

CLI 只有 npm 版:`npm i -g @x-cmd/draw` 后直接用 `draw`,或免安装 `npx @x-cmd/draw`(包内 bin 名 `draw`)。Deno 作库导入:`deno add jsr:@x-cmd/draw`(JSR 版无 CLI)。

### 5.3 README 图表设计原则

- 信息清晰优先于装饰复杂;尺寸可读、标签简短。
- 同一份报告里的图保持单位、颜色、命名一致。
- 表格已说清的,别再用图重复一遍。
- 写有意义的图片 alt 文本;有 explore 入口的,把图链接到编辑器。
- 优先选能用项目真实数据重新生成的图——别把一次性数字永久写死。

### 5.4 多图组合

一个任务需要多张图时:不同问题拆成不同图,一张图说一件事;共享单位/颜色/命名;同一份数据别在多张图里重复;按有意义的阅读顺序排;图之间用说明文字衔接。

## 6. 数据与 URL 规则

### 6.1 URL 编码:先分清两类字符

**URL 层字符——编码有效。** URL 先按 `&` 切参数、按 `#` 断片段,再百分号解码;数据里的这些字符不编码会破坏 URL 本身:

| 字符 | 编码 | 字符 | 编码 |
|---|---|---|---|
| 空格 | `%20`(裸 `+` 也是空格) | `#` | `%23` |
| `+` | `%2B` | `%` | `%25` |
| `&` | `%26` | `<` / `>` | `%3C` / `%3E` |

**Draw 结构字符——编码无效。** URL 解码发生在 Draw 切分**之前**:`%2C` 先解码成 `,` 再被当分隔符,编码救不了。数据里出现 `,` `;` `:` `=` `/` `@` `>` 时按对策处理:

- 列表参数(`labels` / `series` / `x` / `y` / `mark`):用**重复参数**形态——引擎对重复参数不再按逗号切分。例:`labels=Q1, 2024&labels=Q2`(首标签原样含逗号)。
- 结构图(`n=`/`e=`/`b=`):标签里避免出现 `;` `:`(无法转义);多行内容用 `%0A`。
- 特殊字符多的数据:改用 `?d=` JSON——JSON 字符串内部的这些字符天然安全(整体编码一次即可)。

纪律:用运行环境提供的编码函数(`encodeURIComponent`、`URLSearchParams`、curl `--data-urlencode`)生成 URL;不要手写百分号;已编码的串不要二次编码。

### 6.2 `?d=` 的两种含义(别混)

- `type=qr`:`d=` 是二维码承载的**纯文本**(≤1000 字符)——别包成 JSON;颜色用独立参数 `fg`/`bg`。
- 其他支持 JSON 的图种:`d=` 是 **URL 编码后的 JSON**——先构造合法 JSON,再整体编码。

### 6.3 交互入口(explore)

优先找对应图种的 explore 编辑页:数据图表 `/draw/explore?<同参数>`(右边参数表改一格立即重画,复制按钮给改完的 URL);ECharts `/draw/explore/echarts?d=<option>`;专用图形各有编辑页(以 demo / 站点导航为准)。SVG 本身只管静态展示——悬停看数、调参、改数据都发生在 explore webapp。

## 7. 验证与排错

### 7.1 结构与渲染检查

| 检查 | 内容 |
|---|---|
| 数据 | 标签数 = 数值数(不符会 400 并提示);数值 ≥0(scatter 可负);口径、单位与来源一致 |
| 结构 | sankey 的 `links=` 引用的节点都已 `n=` 定义;`b=` 只框已有 id;系列 ≤6;各类别数在上限内 |
| 编码 | 按 §6.1;`?d=` 是整个 JSON 编码后的串 |
| 渲染 | 取回 SVG 确认 200 且含 `<svg>`;能访问就别只凭 URL 推断 |
| 可读性 | 标注放不下会**整层省略**(数据仍完整,图上信息可能不全)——类别太多先聚合再画 |

### 7.2 语义与忠实性检查(比 200 更重要)

- 桑基流向符合真实业务方向;没有真实流量数据就不凭空造桑基。
- 时序图的请求/响应、分支与实际调用一致。
- ERD 的主外键关系真实存在;架构图的服务调用关系有事实依据,不凭空连线。
- 甘特图的依赖与时间关系合理。
- 时间序列用 line/area 不用饼图;占比类别 >9 考虑 hbar 排行。
- **图忠实表达了原始数据**:pie >9 类自动并入 Other,是否改变了展示口径;桑基是否遗漏了部分流向;多系列是否把不同单位的数据画进同一坐标轴;甘特是否把未定日期当成确定日期。

### 7.3 排错

- 错误返回 4xx 纯文本并附修正示例,按提示重拼即可。
- POST 限 30 次/分钟/IP。

## 8. 隐私

托管图表 URL 视同公开。不要在图数据里放:密码、API key、访问令牌、个人敏感信息;未授权公开前,内部架构、内网地址、敏感统计也别放进托管 URL——Agent 分析私有代码库时尤其注意。敏感数据集走本地渲染(§5.2),别把私有数据发给托管服务。

## 9. API 参考

### 9.0 能力一览(GET / JSON / POST)

| 能力 | 范围 |
|---|---|
| GET 扁平参数 | 15 种数据图表(`?type=…`)+ 结构图(`n=`/`e=`/`b=`)+ mindmap(`n=`)+ gantt/gantt2(`m=`)+ mermaid(`m=`)+ tokei(`d=`)+ echarts(`d=`) |
| GET `?d=` JSON | 15 种数据图表的 JSON schema(见 9.4;**qr 除外**——qr 的 `d=` 是纯文本,见 §6.2) |
| POST | `POST /draw?type=<15 种之一>`,body 收 JSON 或 CSV;`POST /draw/tokei` 收 tokei JSON body |

按公开实现(仓库源码)核对;线上以实际响应为准。GET 的 JSON 支持范围 ≠ POST 的必然支持范围——两者各自以上表为准。

### 9.1 通用参数

- `t` 风格(见 9.3)/ `scheme=light|dark|auto` / `title=` / `unit=` / `subtitle=` / `source=`(部分风格用)
- `w=` / `h=` 尺寸(缺省用该风格规范画布,数据密集时自动微调;范围 200–1600 / 140–1200,短链 w 可至 120,qr 为 120–1000)
- `num=all|peak|none` 数值标注(pie/bar/hbar/line/area/scatter/combo;radar/gauge/sankey/qr 忽略)
- `v=N` 指定渲染器版本参数,缓存 1 天(N 为 1..当前版本);不带 = 最新版(短缓存 300s)。渲染仍随部署演进,不承诺输出永久冻结——永久 immutable 只有内容寻址短链
- `format=png` 输出位图(配 `scale=1–3` 倍率;scheme 固化,缺省 light;中文已内置 Noto Sans SC 子集(GB2312 一级 3755 字 + 中文标点),SVG 里出现中文才挂载,常用字都能显示;子集外的生僻字仍无字形)

### 9.2 每图种要点

- **pie**:≤100 类(>9 自动并入 Other);`donut=0` 实心饼
- **bar**:≤30 组、≤6 系列;`stack=1` 堆叠;量级差悬殊时自动切百分比堆叠
- **hbar**:≤30 条;默认单系列,仅 `t=xcmd-issue`/`t=rank` 支持双系列(恰好 2 系列);`t=opendata` 支持 `ref=`/`reflabel=` 参考线
- **line / area**:≤60 点;多系列折线数值只标各线峰值(防拥挤)
- **radar**:3–12 维;多系列需 `t=evil`
- **gauge**:单值 `value=&max=`;多环 `labels=&values=`(值为百分比,≤8 环)
- **scatter**:≤200 点/系列,支持负值;重复 `x=`/`y=` 参数各成一系列
- **combo**:柱用 `series=`(单系列可 `values=`)、线用 `line=`;量级差 >5× 自动双 y 轴;支持 `stack=1`
- **sankey**:≤24 节点/60 链接,`links=A>B:30` 分号分隔,禁止环
- **qr**:`d=` 是二维码**纯文本** ≤1000 字符(见 §6.2,无 JSON 形态);`fg`/`bg` 六位 hex(`#` 写成 `%23`);`title`/`unit` 为码下标注
- **butterfly**:`labels=` + `left=`/`right=`(可 `名:值`,分号分段自中轴往外堆叠);可叠 `line=`(独立标尺);`dir=tb` 上下翻转
- **calendar**:`layout=month|week|year|bimonth|quarter|course|plan`;`ev=日期;类别;标签;时间` / `day=日期;性质;标签` / `note=日期;文字` 均可重复;事件 ≤60 条
- **quadrant**:`quadrants=` 逗号四格名(左上,右上,左下,右下);`quaddescs=` 分号四格说明;`items=名称@x,y` 落点散点(x/y 为 0..1);`frame=cross` 只要十字轴
- **compass**:`up=`/`right=`/`down=`/`left=` 各方向标签(可 `标签:副说明`),`center=` 中心字
- **结构图**(arch2/archmap/seq/uc/dataflow/lifecycle/erd/class):语法见 §4.2;类型词汇错了会 400 并列出有效值

### 9.3 风格家族(可选 `t=`)

默认 = 各家族表第一个(标 ⭐);`t=` 拼错报 400 并列出有效家族,家族存在但该图种未做则静默回退默认。

| 图种 | 可选家族 |
|---|---|
| pie | ⭐`opendata` `evil` `evil-mono` `market-mono` `progress` `revenue` |
| bar | ⭐`evil` `base` `grid` |
| hbar | ⭐`base` `opendata`(支持 `ref=`/`reflabel=`) `xcmd`(像素条,值为 %) `xcmd-issue`(双系列蝴蝶) `rank`(双系列实底+斜纹) |
| line | ⭐`shadcn` `evil` `evil-glow`(发光) `evil-mono` `opendata`(线端标签) |
| area | ⭐`evil` `star`(手绘) `pixel` `polka` `opendata`(支持 `subtitle=` `source=`) |
| radar | ⭐`base` `evil`(支持多系列) `xcmd` |
| gauge | ⭐`base` `gradient` `reliability` |
| sankey | ⭐`base` `fund` `pipeline` |
| combo | ⭐`base` `evil` |
| butterfly | ⭐`base` `track` `grid` `scale` |
| calendar | ⭐`base` `mono`(墨水风) |
| scatter / qr / quadrant / compass | ⭐`base`(仅此) |

### 9.4 JSON 形态(`?d=`,URL 编码;15 种数据图表)

| 适用 | 结构 |
|---|---|
| 单系列(pie/bar/hbar/line/area/radar) | `{"title":"","data":[{"label":"A","value":1}]}` |
| 多系列(bar/line/area/radar) | `{"labels":["A","B"],"series":[{"name":"x","values":[1,2]}]}` |
| gauge 单值 | `{"value":87,"max":100}` |
| gauge 多环 | `{"max":100,"data":[{"label":"A","value":86}]}` |
| scatter | `{"points":[[1,4]]}` 或 `{"series":[{"name":"","points":[[1,4]]}]}` |
| combo | `{"labels":[],"series":[{"name":"","values":[]},{"name":"","values":[],"type":"line"}]}` |
| sankey | `{"labels":[],"links":[{"from":"A","to":"B","value":30}]}` |
| butterfly | `{"labels":["A"],"left":{"name":"","values":[7]},"right":{"name":"","values":[5]}}` |
| quadrant | `{"groups":[{"name":"A"},{"name":"B"},{"name":"C"},{"name":"D"}]}` 或 `{"items":[{"name":"A","x":0.2,"y":0.8}]}` |
| compass | `{"up":"自己","right":"他人","down":"组织","left":"环境"}` |

qr 没有 JSON 形态:`d=` 只收纯文本;要传颜色用 `fg`/`bg` 参数,或 POST body `{"text":"…","fg":"#333333","bg":"#ffffff"}`(见 9.5)。

### 9.5 创建短链(POST)

`POST /draw?type=<数据图种>`,body 与 `?d=` 同一套结构(JSON 或 CSV);`type`/`t`/`scheme`/`w`/`h`/`num` 放 URL,不进 body:

```sh
curl -X POST 'https://x-cmd.com/draw?type=pie&title=Stars' \
  -H 'content-type: application/json' \
  --data '{"data":[{"label":"TypeScript","value":4821},{"label":"Python","value":2312}]}'
# → 201 {"hash":"5168...","url":"https://x-cmd.com/draw/c/5168...","template":"pie"}
```

也接受 CSV(`text/csv`,首行表头,表头即系列名):

```
label,Desktop,Mobile
Mon,120,80
Tue,180,90
```

qr 的 POST body 是 `{"text":"https://…","fg":"#333333","bg":"#ffffff"}`。同数据重复 POST 返回同 hash(幂等,不重复存储);创建时即校验,坏风格/坏结构不会入库成永久坏链。

### 9.6 离线渲染

npm:`npm i -g @x-cmd/draw` 后用 CLI(bin 名 `draw`),或免安装 `npx @x-cmd/draw`:

```sh
npx @x-cmd/draw --type pie --labels A,B --values 3,2 --out pie.svg   # 文件缺省出 SVG,--out x.png 出 PNG
npx @x-cmd/draw echarts '<option json>'                              # echarts 层;文件/stdin 亦可,无 URL 长度限制
```

库里同步渲染:`draw(params)`(参数与 URL 完全一致;npm 安装后 import)。Deno 作库导入:`deno add jsr:@x-cmd/draw`(JSR 版无 CLI)。自托管见仓库 README(`npm run serve` 起本地服务,`scripts/setup.sh` 一键部署 Cloudflare)。
