# 参数、交付与验证

本文件搬自主 Skill 原有的可视化目录、输出、URL、验证和 API 参数部分。任务选型见 `../SKILL.md`；JSON 与 POST 见 `json-schemas.md`；完整任务见 `recipes.md`。

## 1. 原生数据图表（`?type=…`）

| 数据形状 / 任务 | type | 示例 |
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
| 表格 / 清单 | `table` | `type=table&cols=Service,Errors&rows=api:12;worker:9` |

原则：图服务信息表达，不为使用某张图改变数据含义。已有专用 endpoint 时优先使用，ECharts 只补未覆盖的图；复杂图可先找 demo 的同类案例。

## 2. 按场景交付

| 场景 | 方式 |
|---|---|
| GitHub README / 项目文档 | `[![代码行数占比](渲染URL)](explore URL)`：预览 + 点进 explore 改数据 |
| 技术文章 | Markdown 图片 `![](渲染URL)` |
| 网页 | `<img>` 或裸 SVG URL |
| 固定数据，要最新渲染 | 不指定 `v`，缓存 300 秒 |
| 固定数据，要指定渲染器版本 | `v=N`，缓存 1 天；不承诺部署演进后输出不变 |
| 定期更新的数据 | 重新取数、重新生成 URL；不带 `v` 不会让 URL 中的数据自动更新 |
| 长期固定分享 | POST 短链 `/draw/c/<hash>`，内容寻址、唯一 immutable 形态 |

URL 决定数据与参数；`v=N` 指定渲染器版本参数；短链把“数据 + 风格”固化成不可变链接。三者不能互相替代。

## 3. 本地 vs 远程渲染

| 场景 | 方式 |
|---|---|
| README、公开文档、临时图 | 在线 URL |
| CI 里自动生成 SVG | npm CLI |
| 内网、离线、敏感数据 | 本地渲染 |
| 大体积 ECharts JSON（超 16000 字符） | 本地渲染，无 URL 长度限制 |
| 自建图表服务 | Cloudflare 自托管 |

CLI 只有 npm 版：`npm i -g @x-cmd/draw` 后直接用 `draw`，或免安装 `npx @x-cmd/draw`。Deno 作库导入：`deno add jsr:@x-cmd/draw`，JSR 版无 CLI。

## 4. URL 编码：先分清两类字符

**URL 层字符——编码有效。** URL 先按 `&` 切参数、按 `#` 断片段，再百分号解码；数据里的这些字符不编码会破坏 URL 本身：

| 字符 | 编码 | 字符 | 编码 |
|---|---|---|---|
| 空格 | `%20`（裸 `+` 也是空格） | `#` | `%23` |
| `+` | `%2B` | `%` | `%25` |
| `&` | `%26` | `<` / `>` | `%3C` / `%3E` |

**Draw 结构字符——编码无效。** URL 解码发生在 Draw 切分之前：`%2C` 先解码成 `,` 再被当分隔符，编码救不了。数据里出现 `,` `;` `:` `=` `/` `@` `>` 时按对策处理：

- 列表参数（`labels` / `series` / `x` / `y` / `mark`）：用重复参数形态，引擎对重复参数不再按逗号切分。例：`labels=Q1, 2024&labels=Q2`，首标签原样含逗号。
- 结构图（`n=` / `e=` / `b=`）：标签里避免出现 `;` `:`，多行内容用 `%0A`。
- 特殊字符多的数据：改用 `?d=` JSON，JSON 字符串内部的这些字符天然安全，整体编码一次即可。

纪律：用当前运行环境提供的编码函数处理数据值，不手写百分号；已编码的串不要二次编码。

`?d=` 的两种含义不能混淆：`type=qr` 时是二维码承载的纯文本（≤1000 字符），不要包成 JSON；其他支持 JSON 的图种是 URL 编码后的 JSON。详见 `json-schemas.md`。

## 5. 交互入口（explore）

优先找对应图种的 explore 编辑页：

- 数据图表：`/draw/explore?<同参数>`，右边参数表改一格立即重画，复制按钮给改完的 URL。
- ECharts：`/draw/explore/echarts?d=<option>`。
- 专用图形各有编辑页，以 demo / 站点导航为准。

SVG 本身只管静态展示；悬停看数、调参、改数据都发生在 explore webapp。

## 6. 验证与排错

| 检查 | 内容 |
|---|---|
| 数据 | 标签数 = 数值数；数值 ≥0（scatter 可负）；口径、单位与来源一致 |
| 结构 | sankey 的 `links=` 引用已定义节点；`b=` 只框已有 id；系列 ≤6；类别数在上限内 |
| 编码 | 按 URL 层与结构字符规则处理；`?d=` 是整个 JSON 编码后的串 |
| 渲染 | 实际取回 SVG，确认 200 且含 `<svg>`；能访问就别只凭 URL 推断 |
| 可读性 | 标注放不下会整层省略；类别太多先聚合再画 |

语义与忠实性检查比 200 更重要：

- 桑基流向符合真实业务方向；没有真实流量数据就不凭空造桑基。
- 时序图的请求/响应、分支与实际调用一致。
- ERD 的主外键关系真实存在；架构图的服务调用关系有事实依据，不凭空连线。
- 甘特图的依赖与时间关系合理，不把未定日期当成确定日期。
- 时间序列用 line/area 不用饼图；占比类别 >9 考虑 hbar 排行。
- 核对 pie >9 类自动并入 Other、桑基遗漏流向、多系列不同单位共轴等展示口径变化。

复用或分析图表时，优先读 SVG 内嵌的原始 specification，核对标签、数值、单位和系列。各 endpoint 内嵌粒度不一，tokei 不内嵌原始统计 JSON；spec 缺失时回原始数据源，不从 SVG 几何、颜色、位置或取整标注反推。

错误返回 4xx 纯文本并附修正示例，按提示重拼即可。POST 限 30 次/分钟/IP。

## 7. 隐私

托管图表 URL 视同公开。不要放入密码、API key、访问令牌、个人敏感信息；未授权公开前，内部架构、内网地址、敏感统计也别放进托管 URL。Agent 分析私有代码库时尤其注意，敏感数据集走本地渲染。

## 8. 能力一览（GET / JSON / POST）

| 能力 | 范围 |
|---|---|
| GET 扁平参数 | 15 种数据图表（`?type=…`）+ 结构图（`n=` / `e=` / `b=`）+ mindmap（`n=`）+ gantt/gantt2（`m=`）+ mermaid（`m=`）+ tokei（`d=`）+ echarts（`d=`） |
| GET `?d=` JSON | 15 种数据图表的 JSON schema，QR 除外 |
| POST | `POST /draw?type=<15 种之一>`，body 收 JSON 或 CSV；`POST /draw/tokei` 收 tokei JSON body |

GET 的 JSON 支持范围不等于 POST 的必然支持范围；按公开实现核对，线上以实际响应为准。

## 9. 通用参数

- `t` 风格，见 `styles.md`；`scheme=light|dark|auto`，auto 跟随查看者系统。
- `title=` / `unit=` / `subtitle=` / `source=`，后两者仅部分风格使用。
- `w=` / `h=` 尺寸：缺省用该风格规范画布，数据密集时自动微调；范围 200–1600 / 140–1200，短链 w 可至 120，QR 为 120–1000。
- `num=all|peak|none` 数值标注：pie/bar/hbar/line/area/scatter/combo；radar/gauge/sankey/qr 忽略。
- `v=N` 指定渲染器版本参数，缓存 1 天（N 为 1..当前版本）；不带是最新版，短缓存 300 秒。永久 immutable 只有内容寻址短链。
- `format=png` 输出位图，配 `scale=1–3` 倍率；scheme 固化，缺省 light。中文内置 Noto Sans SC 子集（GB2312 一级 3755 字 + 中文标点），SVG 里出现中文才挂载；子集外生僻字仍无字形。

### 通用标注层

在画好的图上面再叠一层，图本身不动。坐标都是画布百分比（0–100），换尺寸换主题仍在原地；每个参数都能重复写，可跟 `,#六位hex` 换颜色（`#` 写成 `%23`）。

| 参数 | 用途 |
|---|---|
| `_oval=圆心x,圆心y,半径x,半径y` | 圈一个点 |
| `_text=x,y;文字` | 一句话 |
| `_hl=x,y,w,h` | 高亮一块区域 |
| `_note=x,y;评论` | 一条评论，带引线 |
| `_arrow=x1,y1,x2,y2` | 一支箭头 |
| `_path=x1,y1,x2,y2,…` | 手绘的一笔 |

通用扩展一律用 `_` 开头，避免与图种自己的参数冲突；老写法 `oval=` / `text=` 仍能跑，正式名是 `_oval=` / `_text=`。

## 10. 每图种要点

- **pie**：≤100 类（>9 自动并入 Other）；`donut=0` 实心饼。
- **bar**：≤30 组、≤6 系列；`stack=1` 堆叠；量级差悬殊时自动切百分比堆叠。
- **hbar**：≤30 条；默认单系列，仅 `t=xcmd-issue` / `t=rank` 支持恰好 2 系列；`t=opendata` 支持 `ref=` / `reflabel=` 参考线。
- **line / area**：≤60 点；多系列折线数值只标各线峰值。
- **radar**：3–12 维；多系列需 `t=evil`。
- **gauge**：单值 `value=&max=`；多环 `labels=&values=`，值为百分比，≤8 环。
- **scatter**：≤200 点/系列，支持负值；重复 `x=` / `y=` 参数各成一系列。
- **combo**：柱用 `series=`（单系列可 `values=`）、线用 `line=`；量级差 >5× 自动双 y 轴；支持 `stack=1`。
- **sankey**：≤24 节点/60 链接，`links=A>B:30` 分号分隔，禁止环。
- **qr**：`d=` 是纯文本 ≤1000 字符；`fg` / `bg` 六位 hex，`title` / `unit` 为码下标注。
- **butterfly**：`labels=` + `left=` / `right=`，可 `名:值`，分号分段自中轴往外堆叠；可叠 `line=` 独立标尺；`dir=tb` 上下翻转。
- **calendar**：`layout=month|week|year|bimonth|quarter|course|plan`；`ev=日期;类别;标签;时间` / `day=日期;性质;标签` / `note=日期;文字` 均可重复；事件 ≤60 条。
- **quadrant**：`quadrants=` 逗号四格名（左上、右上、左下、右下）；`quaddescs=` 分号四格说明；`items=名称@x,y` 落点散点（x/y 为 0..1）；`frame=cross` 只要十字轴。
- **compass**：`up=` / `right=` / `down=` / `left=` 各方向标签（可 `标签:副说明`），`center=` 中心字。
- **table**：`cols=` 逗号分隔列名；`rows=` 分号分隔行，行内冒号分隔单元格（`api:12;worker:9`）；也接受 `?d=` 的 `{"cols":[…],"rows":[[…]]}`。单元格含 `:` `;` `,` 时改用 JSON。规格解析在 x-cmd/table，这边只转发。
- **结构图**：arch2/archmap/seq/uc/dataflow/lifecycle/erd/class 语法见 `diagrams.md`；类型词汇错了会 400 并列出有效值。

## 11. 离线渲染

```sh
npx @x-cmd/draw --type pie --labels A,B --values 3,2 --out pie.svg
npx @x-cmd/draw echarts '<option json>'
```

文件缺省出 SVG，`--out x.png` 出 PNG；ECharts 层接受内联 JSON、文件或 stdin，无 URL 长度限制。npm 安装后可同步调用库 `draw(params)`，参数与 URL 完全一致；Deno 用 JSR 库，无 CLI。自托管可用 `npm run serve` 起本地服务，或 `scripts/setup.sh` 部署 Cloudflare。
