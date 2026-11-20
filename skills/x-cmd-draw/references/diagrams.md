# 结构图与专用文本图语法

需要编写架构、时序、UML、项目统计、甘特、Mermaid 或思维导图时读取。

## 最小可运行示例

以下示例取自仓库现有文档与配方，均已实测返回 200 且包含 `<svg>`。

### seq

```text
https://x-cmd.com/draw/seq?n=client;fe;Client;;r0c0&n=worker;be;Worker;;r0c1&n=origin;svc;Origin;;r0c2&e=client;worker;GET&e=worker;origin;Fetch&e=origin;worker;SVG;dash&e=worker;client;SVG;dash&title=Sequence
```

### erd

```text
https://x-cmd.com/draw/erd?n=users;table;users;;r0c0&n=orders;table;orders;;r1c0&n=items;table;order_items;;r2c0&e=users;orders;1:N&e=orders;items;1:N&title=Schema%20map&w=760
```

### class

```text
https://x-cmd.com/draw/class?n=draw;class;draw;spec:%20object%0Areturns:%20DrawResult;r0c0&n=arch;class;renderArch;url:%20URL%0Areturns:%20DrawResult;r1c0&n=result;class;DrawResult;svg:%20string%0Aversion:%20number%0AcacheControl:%20string;r1c1&e=draw;result&e=arch;result
```

### mermaid

```text
https://x-cmd.com/draw/mermaid?m=graph%20TD%0A%20%20subgraph%20Edge%0A%20%20%20%20CDN%5BCDN%5D%20--%3E%20GW%5BGateway%5D%0A%20%20end%0A%20%20GW%20--%3E%20API%5BAPI%5D&w=560
```

### gantt

```text
https://x-cmd.com/draw/gantt?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Sprint%20plan&w=560
```

### mindmap

```text
https://x-cmd.com/draw/mindmap?n=draw/Charts/Pie&n=draw/Charts/Bar%20and%20Line&n=draw/Charts/Sankey&n=draw/Arch/Archmap&n=draw/Arch/Mindmap&n=draw/Ecosystem/Skill&n=draw/Ecosystem/Data%20link&w=560
```

## 1. 结构图：统一节点与连线语法

架构图（arch2 / archmap）、时序图（seq）、用例图（uc）、数据流（dataflow）、生命周期（lifecycle）、ERD、类图（class）读同样三组参数：

```
n=id;type;label[;sub][;pos]     节点（可重复）
e=from;to[;label][;variant]      边（可重复）
b=label;id id …                  分组/边界（可重复）
```

- **id**：字母数字点横线下划线，不能以标点开头；`e=`、`b=` 里用它指代。
- **type**：每种图各一套词汇，决定颜色、角标和形状；用错了是 400，错误里带着它认识的那几个。
- **label**：大字；**sub**：小字，`%0A` 断行，ERD 字段表、类图成员表靠它。
- **pos**：可省。格子 `r0c1`、跨格 `r0c1w2` / `r1c0h2`；像素 `p40,80[,120x48]`。不写就由引擎按书写顺序布局。
- **variant**：archmap/arch2 与四种新图种用 `main`（主流程）/ `dash`（次要）；seq 用结尾一段 `dash` 表示回信；uc 用 `<<include>>` 标签表示虚线依赖。
- **b=**：把已有 id 框成一组（系统边界、泳道），可写多次；它不替你建节点。

| 路径 | 节点类型 |
|---|---|
| `/draw/arch2` `/draw/archmap` `/draw/seq` | `fe` `be` `db` `cloud` `sec` `bus` `svc` `ext` |
| `/draw/uc` | `actor` `uc` |
| `/draw/dataflow` | `process` `store` `source` `sink` |
| `/draw/lifecycle` | `state` `decision` `terminal` |
| `/draw/erd` | `table` `view` |
| `/draw/class` | `class` `iface` `enum` |

架构图词汇：`fe` 前端、`be` 后端、`db` 数据库、`cloud` 云服务、`sec` 安全、`bus` 消息、`svc` 通用服务、`ext` 外部系统。

```
https://x-cmd.com/draw/arch2?n=web;fe;Web app;your browser;r0c0&n=api;be;API;Cloudflare Worker;r0c1&e=web;api;GET /draw?type=pie
```

各图种的关键差异：

- **seq**：参与方按 `n=` 出现顺序从左到右排；`e=from;to` 按时间先后写，回信在 label 尾段加 `;dash`。
- **erd**：字段表写在 `sub` 里，`%0A` 分行；每行 `名字:类型 (pk|fk|uk)` 标键，例 `id:int (pk)`；边标签写 `1:N` 自动画鱼尾记号。
- **class**：成员行 `+ name: Type`（`+` 公有 / `-` 私有 / `#` 保护），方法 `greet(): void`；边标签写 `extends` / `implements` 画 UML 空心三角。
- **dataflow**：`store` 画圆柱、`source` / `sink` 画圆角；按“谁读谁写”的方向连边。

其余细节以各图种的 explore 编辑页与文档站为准。

派生形态：`/draw/cloud` 使用同一套 `n=` / `e=` 模型，节点画成大图标（diagrams.net 风格的云架构海报）。

## 2. 项目统计：`/draw/tokei`

把 `tokei --output json` 的结果直接成图：GET `?d=<tokei json>` 或 POST body（亦可 `langs=` 收 property 短形态）。画“代码 / 注释 / 空行”三段堆叠柱（含文件数）。

AI 分析代码库时的首选入口：先跑真实统计，再成图。tokei 不内嵌原始统计 JSON，校验时对照原始统计，不从图形反推。

## 3. 排期：`/draw/gantt` 与 `/draw/gantt2`

同一份 Mermaid 甘特源码（`m=`，首行 `gantt` 关键字可省），两张脸：`/draw/gantt` 是甘特本命脸；`/draw/gantt2` 换成架构图 v2 风格。

## 4. Mermaid 流图：`/draw/mermaid`

`m=<flowchart 源码>`，线上有 Flow / Mono 两种形态（demo 可见）。v1 子集：`graph` / `flowchart` 的节点形状、边样式/标签、subgraph（转分组）；首行是 `gantt` 时分派到甘特渲染。

## 5. 思维导图：`/draw/mindmap`

`n=根/子/孙` 路径树，树 → 自动布局。
