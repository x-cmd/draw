---
name: x-cmd-draw
description: 把结构化数据或文字描述变成可嵌入的 SVG 图表/架构图/时序图 URL——拼 URL 即得图,无需安装。为 README、技术文档、报告、项目分析、网页配图时使用;SVG 内嵌完整数据(<metadata>),可解析还原。
---

# 用 draw 生成图表

```
https://x-cmd.com/draw?type=<图种>&labels=A,B,C&values=1,2,3
```

图表既是给人看的图,也是机器可读的数据载体:SVG 内嵌完整数据(`<metadata>`),下游 Agent 可解析还原、继续处理。输出可缓存(`v=N` 钉版本,短链永久 immutable)。

嵌入推荐形态 = 图预览 + 点击进 explore(explore 是 webapp:悬停看数、调参数、直接改数据),explore 与 `/draw` 同参数(echarts 层为 `/draw/explore/echarts?d=<option>`):

```
[![](https://x-cmd.com/draw?type=pie&labels=TS,Py,Go&values=4821,2312,980)](https://x-cmd.com/draw/explore?type=pie&labels=TS,Py,Go&values=4821,2312,980)
```

## 什么时候用 / 不用

**用**:README/文档/报告需要数据图、架构图、时序图、ERD 等;把已有数据(统计、CSV、JSON、git 历史)可视化;把文字描述的结构(架构、流程、状态机、排期)画成图。

**不用**:需要复杂交互(图是静态 SVG,交互只在 explore 页);海报级自由排版;要求渲染结果永久冻结的场景(渲染随部署演进,只有短链内容寻址永久 immutable)。

## 工作流程

1. **理解需求**:用户给了数据 → 数值必须忠实原始数据,不擅自修改;只有文字描述 → 先提取实体、关系、分类、时间顺序。
2. **选图**:见下表。图服务信息表达,不为用某种图而改变数据含义:占比类别 >9 时 pie 会并入 Other(要每类可见选 hbar);时间序列用 line/area,不用饼图;没有真实流量数据不凭空造 sankey;结构性描述(架构/时序/数据流/ERD)用原生图种,不拿 echarts 硬画。
3. **生成 URL**:简单数据用扁平参数(AI 可读、免转义);含特殊字符或复杂结构用 `?d=` + **整体** URL 编码的 JSON(先构造合法 JSON,再编码,不要手写百分号)。
4. **验证**:能访问渲染结果就实际取回 SVG 检查,不只凭 URL 推断正确;不能访问就如实说明未做视觉验证。
5. **交付**:按场景给输出形态(下表),README 默认给「预览图 + explore 链接」。

## 按场景交付

| 场景 | 输出 |
|---|---|
| GitHub README / 项目文档 | `[![](渲染URL)](explore URL)`(预览 + 可点进 explore 改数据) |
| 技术文章 | Markdown 图片 `![](渲染URL)` |
| 网页 | `<img>` 或裸 SVG URL |
| 动态数据(随源更新) | 不钉 `v`,缓存 300s |
| 报告定稿(渲染稳定优先) | `v=N` 钉版本,缓存 1 天 |
| 长期分享/怕他改参数 | POST 建短链(永久 immutable) |
| 离线/内网 | `npm i @x-cmd/draw` 本地渲染(见文末) |

## 生成后检查

| 检查 | 内容 |
|---|---|
| 数据 | 标签数 = 数值数(不符会 400 并提示);数值 ≥0(scatter 可负);单位、量级与原始数据一致 |
| 结构 | sankey 的 `links=` 引用的节点都已 `n=` 定义;`b=` 只框已有 id,不替你建节点 |
| 编码 | 空格 `%20`、真的加号 `%2B`、`&` `%26`、`#` `%23`、换行 `%0A`;`?d=` 是整个 JSON 编码后的串 |
| 渲染 | 取回 SVG 确认 200 且含 `<svg`;4xx 错误体带修正示例,按提示重拼 |
| 可读性 | 标注放不下会**整层省略**(数据仍完整,图上信息可能不全)——类别太多先聚合再画,别指望引擎替你兜 |

## 按数据形状选图

| 数据形状 | type | 示例(可直接复制) |
|---|---|---|
| 占比 | `pie` | `type=pie&labels=TS,Py,Go&values=4821,2312,980` |
| 分类对比 | `bar` | `type=bar&labels=Mon,Tue&values=120,180` |
| 多系列对比 | `bar` | `type=bar&labels=Mon,Tue&series=a:12,18&series=b:9,10` |
| 排行/长标签 | `hbar` | `type=hbar&labels=TS,Py,Go&values=4821,2312,980` |
| 趋势 | `line` / `area` | `type=line&labels=Jan,Feb&series=a:120,180&series=b:80,90` |
| 多维评估 | `radar` | `type=radar&t=evil&labels=速度,稳定,生态&series=a:8,9,7&series=b:6,7,8` |
| 完成度/得分 | `gauge` | `type=gauge&title=Pass rate&value=87&max=100` |
| 相关性/分布 | `scatter` | `type=scatter&x=1,2,3&y=4,5,6` |
| 柱+线混合 | `combo` | `type=combo&labels=Mon,Tue&series=dl:120,180&line=growth:5,8` |
| 流向 | `sankey` | `type=sankey&labels=Ads,Web,Buy&links=Ads>Buy:30;Web>Buy:20` |
| 二维码 | `qr` | `type=qr&d=https://x-cmd.com` |
| 两个系列背靠背 | `butterfly` | `type=butterfly&labels=A,B&left=Opened:7,8&right=Closed:5,6` |
| 日历 / 课程表 / 排期表 | `calendar` | `type=calendar&layout=month&start=2026-11-02&ev=2026-11-03;meeting;需求评审;14:00` |
| 决策矩阵(价值/优先级) | `quadrant` | `type=quadrant&quadrants=快赢,战略,填坑,放弃` |
| 四向模型(中心+四方向) | `compass` | `type=compass&center=成长&up=自己&right=他人&down=组织&left=环境` |

## 每图种要点

- **pie**:≤100 类(>9 自动并入 Other);`donut=0` 实心饼
- **bar**:≤30 组、≤6 系列;`stack=1` 堆叠;量级差悬殊时自动切百分比堆叠
- **hbar**:≤30 条;默认单系列,仅 `t=xcmd-issue`/`t=rank` 支持双系列(恰好 2 系列);`t=opendata` 支持 `ref=`/`reflabel=` 参考线
- **line / area**:≤60 点;多系列折线数值只标各线峰值(防拥挤)
- **radar**:3–12 维;多系列需 `t=evil`
- **gauge**:单值 `value=&max=`;多环 `labels=&values=`(值为百分比,≤8 环)
- **scatter**:≤200 点/系列,支持负值;重复 `x=`/`y=` 参数各成一系列
- **combo**:柱用 `series=`(单系列可 `values=`)、线用 `line=`;量级差 >5× 自动双 y 轴;支持 `stack=1`
- **sankey**:≤24 节点/60 链接,`links=A>B:30` 分号分隔,禁止环
- **qr**:`d=` 文本 ≤1000 字符;`fg`/`bg` 六位 hex(`#` 写成 `%23`);`title`/`unit` 为码下标注
- **butterfly**:`labels=` + `left=`/`right=`(可 `名:值`,分号分段自中轴往外堆叠);可叠 `line=`(独立标尺);`dir=tb` 上下翻转
- **calendar**:`layout=month|week|year|bimonth|quarter|course|plan`;`ev=日期;类别;标签;时间` / `day=日期;性质;标签` / `note=日期;文字` 均可重复;事件 ≤60 条
- **quadrant**:`quadrants=` 逗号四格名(左上,右上,左下,右下);`quaddescs=` 分号四格说明;`items=名称@x,y` 落点散点(x/y 为 0..1);`frame=cross` 只要十字轴
- **compass**:`up=`/`right=`/`down=`/`left=` 各方向标签(可 `标签:副说明`),`center=` 中心字

## 图:一套语法,八种图

架构图、时序图、用例图、数据流、生命周期、ERD、类图读的是**同样三行参数** —— 只需学一遍:

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

架构图那八种:`fe` 前端、`be` 后端、`db` 数据库、`cloud` 云服务、`sec` 安全、`bus` 消息、`svc` 通用服务、`ext` 外部系统。

```
https://x-cmd.com/draw/arch2?n=web;fe;Web app;your browser;r0c0&n=api;be;API;Cloudflare Worker;r0c1&e=web;api;GET /draw?type=pie
```

转义:空格 `%20`(裸 `+` 会被当成空格)、真的加号 `%2B`、`&` `%26`、`#` `%23`、`<` `>` `%3C` `%3E`、换行 `%0A`;分隔符 `;` `=` `,` `:` `/` `@` 保持原样。

另外:`/draw/cloud`(同套 `n=`/`e=` 模型,大图标云架构海报)、`/draw/mindmap`(`n=根/子/孙` 路径树)、`/draw/gantt` 与 `/draw/gantt2`(`m=` 甘特源码,两张脸)。注意:**线上没有 `/draw/mermaid` 入口**,mermaid 流图源码仅离线库导出(`renderMermaidFromUrl`)。

**在浏览器里试**:每种图都有交互页 `/draw/explore/<图种>?n=…`,右边是可改的参数表 —— 改一格图立刻重画,加行/删行就是加节点/删节点,复制按钮给的是改完的 URL。

## 通用参数

- `t` 风格(见下)/ `scheme=light|dark|auto` / `title=` / `unit=` / `subtitle=` / `source=`(area 的 opendata 等风格用)
- `w=` / `h=` 尺寸(缺省用该风格规范画布,数据密集时自动微调;范围 200–1600 / 140–1200,短链 w 可至 120,qr 为 120–1000)
- `num=all|peak|none` 数值标注(pie/bar/hbar/line/area/scatter/combo;radar/gauge/sankey/qr 忽略)
- `v=N` 钉住版本,缓存 1 天(N 为 1..当前版本);不带 = 最新版(短缓存 300s)
- `format=png` 输出位图(配 `scale=1–3` 倍率;scheme 固化,缺省 light;中文已内置 Noto Sans SC 子集(GB2312 一级 3755 字 + 中文标点),SVG 里出现中文才挂载,常用字都能显示;子集外的生僻字仍无字形)

## 风格家族(可选 `t=`)

默认 = 各家族表第一个;`t=` 拼错报 400 并列出有效家族,家族存在但该图种未做则静默回退默认。

| 图种 | 可选家族(默认标 ⭐) |
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

## 长尾图种:`/draw/echarts`(echarts option 直渲)

核心 15 种外的图(热力图/箱线/烛台/旭日/漏斗/关系图/仪表盘…)直接把 echarts option 放进 `?d=`(URL 编码 JSON):

```
https://x-cmd.com/draw/echarts?d=%7B%22xAxis%22%3A%7B%22type%22%3A%22category%22%2C%22data%22%3A%5B%22A%22%2C%22B%22%5D%7D%2C%22yAxis%22%3A%7B%22type%22%3A%22value%22%7D%2C%22series%22%3A%5B%7B%22type%22%3A%22bar%22%2C%22data%22%3A%5B1%2C2%5D%7D%5D%7D
```

- 最简 option 即可出图(bar/line/scatter/boxplot 裸 option 自动补轴);`?d=` 之外共用 `w/h/t/scheme/v`
- 风格自动注入(系列色板/轴中性色/Inter 字体/明暗 auto),option 里显式写的样式恒优先;`?d=` ≤16000 字符
- 输出同嵌 `<metadata>`(option 原文,可解析还原);离线等价:`draw echarts '<option json>'`(文件/stdin 亦可,无 URL 长度限制)
- 地图:随包带 US 各州 GeoJSON(50 州 + DC,Albers 投影),option 里 `"type":"map","map":"USA"` 即得 choropleth;`data[].name` 用州全名(California / New York / …),配 `visualMap` 上色;地图布局缺省铺满画布(要改写 `layoutCenter`/`layoutSize`/`zoom`);州上写数字:`series.label.show` + `series.labelLayout.hideOverlap`,单个州可覆盖 `label.formatter` 与 `label.color`(浅底深字、深底白字)

## JSON 形态(`?d=`,URL 编码)

| 适用 | 结构 |
|---|---|
| 单系列(pie/bar/hbar/line/area/radar) | `{"title":"","data":[{"label":"A","value":1}]}` |
| 多系列(bar/line/area/radar) | `{"labels":["A","B"],"series":[{"name":"x","values":[1,2]}]}` |
| gauge 单值 | `{"value":87,"max":100}` |
| gauge 多环 | `{"max":100,"data":[{"label":"A","value":86}]}` |
| scatter | `{"points":[[1,4]]}` 或 `{"series":[{"name":"","points":[[1,4]]}]}` |
| combo | `{"labels":[],"series":[{"name":"","values":[]},{"name":"","values":[],"type":"line"}]}` |
| sankey | `{"labels":[],"links":[{"from":"A","to":"B","value":30}]}` |
| qr | `{"text":"https://...","fg":"#333333","bg":"#ffffff"}` |
| butterfly | `{"labels":["A"],"left":{"name":"","values":[7]},"right":{"name":"","values":[5]}}` |
| quadrant | `{"groups":[{"name":"A"},{"name":"B"},{"name":"C"},{"name":"D"}]}` 或 `{"items":[{"name":"A","x":0.2,"y":0.8}]}` |
| compass | `{"up":"自己","right":"他人","down":"组织","left":"环境"}` |

## 创建短链(POST /draw?type=...)

15 种核心图种都收 POST;body 用与 `?d=` 同一套 JSON(上表);`type`/`t`/`scheme`/`w`/`h`/`num` 放 URL,不进 body:

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

同数据重复 POST 返回同 hash(幂等,不重复存储)。

## 其他

- 错误返回 4xx 纯文本并附修正示例,按提示重拼即可
- POST 限 30 次/分钟/IP
- 数值必须 ≥0(scatter 可负);标签放不下会整层省略(数据不丢,图上信息可能不全)
- 无网络/离线场景:`npm install @x-cmd/draw` 后用 `draw(params)` 同步渲染(参数与 URL 完全一致),或 `npx @x-cmd/draw --type pie --labels A,B --values 3,2`(echarts 层:`npx @x-cmd/draw echarts '<option json>'`);自托管见仓库 README(`npm run serve` 起本地服务,`scripts/setup.sh` 一键部署 Cloudflare)
