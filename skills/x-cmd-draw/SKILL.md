---
name: x-cmd-draw
description: Generate charts and diagrams as SVG by building x-cmd Draw URLs. Covers pie, bar, line, radar and sankey charts, architecture, sequence, ER, class and flow diagrams, Gantt charts, mind maps, QR codes and code statistics (tokei). Use when the user wants to visualize data, draw a diagram, or add graphics to a README or doc. 
---

# 用 x-cmd Draw 生成图表

Draw 是一个在线服务：把图的全部内容写进 URL，GET 它就返回 SVG，无需安装。数据和参数都在 URL 里，所以改参数就是改图，URL 也可以直接放进文档或版本库。SVG 内嵌 `<metadata>`，保存了生成它的原始 spec。

最简形式：

```
https://x-cmd.com/draw?type=pie&labels=TS,Py,Go&values=4821,2312,980
```

## 工作流程

1. **理解数据**：保留原始数值、单位、时间范围和来源，不把估算当实测。只有文字描述时，先提取实体、关系和顺序。先判断数据是否敏感（见"边界"），敏感数据走本地渲染（`npx @x-cmd/draw`，详见 parameters.md）。
2. **选 endpoint**：查"任务路由"。有专用 endpoint 就用专用的，ECharts 只补专用图没覆盖的类型。
3. **拼 URL**：规则见"URL 规则"。只有 `labels` + `values` 的简单图，照"示例"直接拼；用到示例之外的参数（多系列以外的 `series`、`t=` 风格、`?d=` JSON、POST、结构图、地图）时，先读对应 reference，不凭记忆拼。
4. **取回并检查**：能联网就实际请求，确认返回 200，SVG 里有 `<svg>`，标签数等于数值数，口径一致。不能访问就说明"未验证渲染结果"。
5. **交付**：见"交付"。

**复用或修改一张已有的图**（用户给了 draw 链接或 SVG）：先读 `<metadata>` 里的 spec，改 spec 后重新生成，不在 SVG 上打补丁，也不从图形几何或标注反推数据。spec 不完整就回到原始数据源。tokei 图不内嵌原始统计 JSON，需要重新运行统计命令。

## URL 规则

- 数据值含 `& # % + 空格 < >`：用环境的编码函数对每个参数值编码，不手写百分号，不二次编码。
- 数据值含 `, ; : = / > @`：编码无效，因为 Draw 在 URL 解码之后才切分。列表参数改用重复参数，例如 `labels=Q1, 2024&labels=Q2`；数据复杂就改用 `?d=` + JSON，整个 JSON 只编码一次。
- 结构图的 `n=` / `e=` / `b=` 标签里不能出现 `;` 和 `:`，换行用 `%0A`。
- `type=qr` 的 `d=` 是纯文本，不是 JSON。
- 返回 4xx 时，响应正文带有修正示例，按提示重拼，最多重试 2 次，仍失败就把错误和 URL 告诉用户。
- URL 过长时，改用 POST 短链或本地渲染；ECharts 的 `?d=` 超过 16000 字符时走本地渲染。其他通用长度阈值需人工核对。
- references 与线上响应冲突时，以线上响应为准。

## 任务路由

所有专用 endpoint 都是 `https://x-cmd.com/draw/<name>`；数据图表是 `https://x-cmd.com/draw?type=<图种>`。

| 任务 | 图种 / endpoint | 注意 | 参考 |
|---|---|---|---|
| 占比 | `pie` | | parameters.md |
| 分类对比、排行 | `bar` / `hbar` | 标签长用 `hbar` | parameters.md |
| 趋势 | `line` / `area` | | parameters.md |
| 多维评估、单值得分 | `radar` / `gauge` | radar 多系列需 `t=evil` | parameters.md |
| 相关性、柱线混合 | `scatter` / `combo` | | parameters.md |
| 流向 | `sankey` | 没有真实流量数据不画 | parameters.md |
| 背靠背对比 | `butterfly` | | parameters.md |
| 优先级矩阵、四向模型 | `quadrant` / `compass` | | parameters.md |
| 日历、表格、二维码 | `calendar` / `table` / `qr` | | parameters.md |
| 系统架构 | `/draw/arch2` `/draw/archmap`，云图标用 `/draw/cloud` | 没有事实依据不连线 | diagrams.md |
| UML、数据流、状态、ER、类图 | `/draw/uc` `/draw/dataflow` `/draw/lifecycle` `/draw/erd` `/draw/class` | 同上 | diagrams.md |
| 时序图 | `/draw/seq` | | diagrams.md |
| 甘特图 | `/draw/gantt` `/draw/gantt2` | | diagrams.md |
| 思维导图、Mermaid 流程图 | `/draw/mindmap` `/draw/mermaid` | | diagrams.md |
| 项目代码统计 | `/draw/tokei` | 先运行 `tokei --output json`，不估数 | json-schemas.md、recipes.md |
| 热力图、箱线、烛台、旭日、漏斗、关系图、美国各州地图 | `/draw/echarts` | 仅用于专用图没覆盖的类型 | json-schemas.md |

链接都在文末"参考文件"一节。

## 示例

```text
https://x-cmd.com/draw?type=pie&labels=TS,Py,Go&values=4821,2312,980
https://x-cmd.com/draw?type=bar&labels=Mon,Tue&series=a:12,18&series=b:9,10
https://x-cmd.com/draw/arch2?n=web;fe;Web%20app;your%20browser;r0c0&n=api;be;API;Cloudflare%20Worker;r0c1&e=web;api;GET%20/draw?type=pie
```

## 交付

- **README**：`[![alt](渲染URL)](explore URL)`，读者点图进入 explore，可以悬停看数、调参数、改数据。alt 要写有意义的描述。
- **explore 链接**：数据图表把 `/draw` 换成 `/draw/explore`，参数不变；ECharts 用 `/draw/explore/echarts?d=`。其他图种拿不准就只给渲染 URL，不编造 explore 地址。
- **Markdown / 网页**：`![alt](渲染URL)` 或 `<img>`。
- **不支持 SVG 的场景**（邮件、IM、PPT、Word）：加 `format=png&scale=2`。
- **重要文档**：托管服务不可用时图会裂，建议把渲染好的 SVG 存进仓库（或用 CLI 在 CI 里生成），再引用本地文件。
- **长期固定的分享**：用 POST 短链（内容寻址，永久不变）。`v=N` 只固定渲染器版本参数，不保证输出永久不变。
- **定期更新的数据**：数据在 URL 里，图不会自动更新，需要重新取数、重新生成 URL。

## 边界

- **不适用**：需要复杂交互的图（SVG 是静态的，交互只在 explore 里）；海报级自由排版。遇到时直接说明，需要交互时给 explore 链接。
- **用户指定了其他工具或格式**（Mermaid 代码块、matplotlib、Excel、ASCII 图等）：按用户要求做，不改用 draw。
- **隐私**：托管 URL 视同公开，不放密码、令牌、个人敏感信息，也不放未授权公开的内部架构、内网地址和敏感统计。这类数据走本地渲染。
- **忠实表达**：不混用单位或口径，一个图只回答一个问题。200 不等于正确，还要检查：pie 超过 9 类会并入 Other、标注放不下会被省略、多系列是否混了单位、sankey 是否漏了流向、甘特图是否把未定日期当成了确定日期。

## 参考文件

| 需要 | 读取 |
|---|---|
| 扁平参数、各图种限制、编码细节、缓存、短链、离线渲染、排错 | [parameters.md](references/parameters.md) |
| `?d=` JSON、POST、CSV、tokei、ECharts、地图 | [json-schemas.md](references/json-schemas.md) |
| 风格 `t=`、明暗、尺寸、标注层、多图组合 | [styles.md](references/styles.md) |
| 结构图 `n=/e=/b=`、时序、甘特、Mermaid、脑图 | [diagrams.md](references/diagrams.md) |
| 完整任务模板 | [recipes.md](references/recipes.md) |
