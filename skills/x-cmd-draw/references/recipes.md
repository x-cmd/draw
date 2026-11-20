# 完整任务配方

这些配方不是自动化脚本。直接阅读并修改参数或 JSON；需要编码时，用当前运行环境的 URL 编码函数处理。每组交付 Markdown 中，图片地址就是渲染 URL，外层链接就是同参数的 explore URL。

示例数值只演示任务结构，实际使用必须换成真实数据，并保留来源、单位、时间范围和聚合口径。

## 1. 性能对比：优化前后 P95 延迟

**任务与输入**：cart、checkout、search 三个接口的优化前后 P95，单位都是 ms；示例为 180/240/120 和 140/190/95。

**endpoint 与边界**：`type=bar` 比较同一分类的 before/after；长接口名很多时改 `hbar`，时间趋势不用此配方。

```text
type=bar&labels=cart,checkout,search&series=before:180,240,120&series=after:140,190,95&unit=ms&title=P95
```

**校验**：三组标签和数值一一对应，全部是相同测量环境下的 P95 和 ms；优化比例从原值计算，不从柱高估计。交付正文注明样本量、测量环境和时间范围。

**渲染与交付**：

```markdown
[![优化前后 P95 延迟对比](https://x-cmd.com/draw?type=bar&labels=cart,checkout,search&series=before:180,240,120&series=after:140,190,95&unit=ms&title=P95)](https://x-cmd.com/draw/explore?type=bar&labels=cart,checkout,search&series=before:180,240,120&series=after:140,190,95&unit=ms&title=P95)
```

## 2. 趋势报告：每周错误率

**任务与输入**：连续六周错误率，日期 2026-10-05 至 2026-11-09，数值 2.4%、2.1%、2.3%、1.8%、1.6%、1.5%。

**endpoint 与边界**：`type=line` 表达时间顺序；无连续时间或顺序的数据不使用，分类占比不要折线化。

```text
type=line&labels=2026-10-05,2026-10-12,2026-10-19,2026-10-26,2026-11-02,2026-11-09&series=error-rate:2.4,2.1,2.3,1.8,1.6,1.5&unit=%&title=ErrorRate
```

**校验**：日期严格递增，每个点属于正确周，错误率的分子、分母和时区一致；相邻点连线不代表未采集日期的实测值。URL 中 `%` 写成 `%25`。

**渲染与交付**：

```markdown
[![每周错误率趋势](https://x-cmd.com/draw?type=line&labels=2026-10-05,2026-10-12,2026-10-19,2026-10-26,2026-11-02,2026-11-09&series=error-rate:2.4,2.1,2.3,1.8,1.6,1.5&unit=%25&title=ErrorRate)](https://x-cmd.com/draw/explore?type=line&labels=2026-10-05,2026-10-12,2026-10-19,2026-10-26,2026-11-02,2026-11-09&series=error-rate:2.4,2.1,2.3,1.8,1.6,1.5&unit=%25&title=ErrorRate)
```

## 3. 系统架构：Browser → API → Cache / DB

**任务与输入**：已确认 Browser 调 API，API 读写 Cache 并访问 DB；API 与 Cache 属于 Application 边界。

**endpoint 与边界**：`/draw/arch2` 表达静态节点、边界和调用；请求响应的时间顺序改用 seq，不补画未确认的连接。

```text
n=browser;fe;Browser;;r0c0
n=api;be;API;;r0c1
n=cache;svc;Cache;;r1c1
n=db;db;Database;;r2c1
e=browser;api;HTTPS
e=api;cache;read/write
e=api;db;SQL
b=Application;api cache
```

**校验**：每个 `e=` 引用的 id 都存在，`b=` 只包含 api/cache，方向与真实调用一致；交付文字区分逻辑架构与实际部署拓扑。

**渲染与交付**：

```markdown
[![Browser、API、Cache 与数据库架构](https://x-cmd.com/draw/arch2?n=browser;fe;Browser;;r0c0&n=api;be;API;;r0c1&n=cache;svc;Cache;;r1c1&n=db;db;Database;;r2c1&e=browser;api;HTTPS&e=api;cache;read/write&e=api;db;SQL&b=Application;api%20cache&title=Architecture)](https://x-cmd.com/draw/explore/arch2?n=browser;fe;Browser;;r0c0&n=api;be;API;;r0c1&n=cache;svc;Cache;;r1c1&n=db;db;Database;;r2c1&e=browser;api;HTTPS&e=api;cache;read/write&e=api;db;SQL&b=Application;api%20cache&title=Architecture)
```

## 4. 请求时序：Client → Worker → Origin

**任务与输入**：Client 请求 Worker，Worker 请求 Origin；Origin 返回 SVG，Worker 再把 SVG 返回 Client。

**endpoint 与边界**：`/draw/seq` 的 `e=` 顺序就是时间顺序，响应用 `dash`；静态服务关系改用 arch2。

```text
n=client;fe;Client;;r0c0
n=worker;be;Worker;;r0c1
n=origin;svc;Origin;;r0c2
e=client;worker;GET
e=worker;origin;Fetch
e=origin;worker;SVG;dash
e=worker;client;SVG;dash
```

**校验**：参与方位置不重叠，消息按真实发生顺序排列，两条响应都是虚线，请求与响应没有交换。

**渲染与交付**：

```markdown
[![Client、Worker、Origin 请求时序](https://x-cmd.com/draw/seq?n=client;fe;Client;;r0c0&n=worker;be;Worker;;r0c1&n=origin;svc;Origin;;r0c2&e=client;worker;GET&e=worker;origin;Fetch&e=origin;worker;SVG;dash&e=worker;client;SVG;dash&title=Sequence)](https://x-cmd.com/draw/explore/seq?n=client;fe;Client;;r0c0&n=worker;be;Worker;;r0c1&n=origin;svc;Origin;;r0c2&e=client;worker;GET&e=worker;origin;Fetch&e=origin;worker;SVG;dash&e=worker;client;SVG;dash&title=Sequence)
```

## 5. 发布排期：设计、开发、发布与回归

**任务与输入**：Design 从 2026-11-01 开始 3 天；Build 在 Design 后 5 天；Ship 是 2026-11-10 里程碑；Regression 在 Build 后 3 天。

**endpoint 与边界**：`/draw/gantt` 表达日期和依赖；普通日历事件用 calendar，未定日期不要伪装成确定排期。

```text
dateFormat YYYY-MM-DD
  section Dev
  Design :done, a1, 2026-11-01, 3d
  Build :active, a2, after a1, 5d
  Ship :milestone, m1, 2026-11-10, 0d
  section QA
  Regression :crit, b1, after a2, 3d
```

**校验**：a1/a2/b1 唯一，after 指向已定义任务，Ship 为 0d，日期使用 YYYY-MM-DD；交付注明时区和非工作日规则。完整 `m=` 源码由当前环境的编码函数整体编码一次。

**渲染与交付**：

```markdown
[![设计、开发、发布与回归排期](https://x-cmd.com/draw/gantt?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Release&scale=day)](https://x-cmd.com/draw/explore/gantt?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Release&scale=day)
```

## 6. 美国州级地图：示例指标分布

**任务与输入**：California 103、New York 117、Texas 89、Florida 74，单位统一为千美元；这些只是格式示例，不代表当前统计值。

**endpoint 与边界**：`/draw/echarts` 的 `map: "USA"` 和 `visualMap`；州名必须与 GeoJSON 一致，非地域数据不要地图化，缺失州不等于零值。

```json
{"title":{"text":"State metric · thousand USD"},"visualMap":{"min":50,"max":120,"left":"center","bottom":8,"inRange":{"color":["#dbeafe","#3b82f6","#1d4ed8"]}},"series":[{"type":"map","map":"USA","roam":false,"label":{"show":true,"fontSize":9},"labelLayout":{"hideOverlap":true},"data":[{"name":"California","value":103},{"name":"New York","value":117},{"name":"Texas","value":89},{"name":"Florida","value":74}]}]}
```

**校验**：解析 `<metadata>` 中的 option，核对四个州全名、数值、单位和色带范围；正文标注示例或真实来源。完整 option 用当前环境的编码函数整体编码一次后放入 `d=`。

**渲染与交付**：

```markdown
[![美国四州示例指标分布](https://x-cmd.com/draw/echarts?d=%7B%22title%22%3A%7B%22text%22%3A%22State%20metric%20%C2%B7%20thousand%20USD%22%7D%2C%22visualMap%22%3A%7B%22min%22%3A50%2C%22max%22%3A120%2C%22left%22%3A%22center%22%2C%22bottom%22%3A8%2C%22inRange%22%3A%7B%22color%22%3A%5B%22%23dbeafe%22%2C%22%233b82f6%22%2C%22%231d4ed8%22%5D%7D%7D%2C%22series%22%3A%5B%7B%22type%22%3A%22map%22%2C%22map%22%3A%22USA%22%2C%22roam%22%3Afalse%2C%22label%22%3A%7B%22show%22%3Atrue%2C%22fontSize%22%3A9%7D%2C%22labelLayout%22%3A%7B%22hideOverlap%22%3Atrue%7D%2C%22data%22%3A%5B%7B%22name%22%3A%22California%22%2C%22value%22%3A103%7D%2C%7B%22name%22%3A%22New%20York%22%2C%22value%22%3A117%7D%2C%7B%22name%22%3A%22Texas%22%2C%22value%22%3A89%7D%2C%7B%22name%22%3A%22Florida%22%2C%22value%22%3A74%7D%5D%7D%5D%7D&w=760&h=520)](https://x-cmd.com/draw/explore/echarts?d=%7B%22title%22%3A%7B%22text%22%3A%22State%20metric%20%C2%B7%20thousand%20USD%22%7D%2C%22visualMap%22%3A%7B%22min%22%3A50%2C%22max%22%3A120%2C%22left%22%3A%22center%22%2C%22bottom%22%3A8%2C%22inRange%22%3A%7B%22color%22%3A%5B%22%23dbeafe%22%2C%22%233b82f6%22%2C%22%231d4ed8%22%5D%7D%7D%2C%22series%22%3A%5B%7B%22type%22%3A%22map%22%2C%22map%22%3A%22USA%22%2C%22roam%22%3Afalse%2C%22label%22%3A%7B%22show%22%3Atrue%2C%22fontSize%22%3A9%7D%2C%22labelLayout%22%3A%7B%22hideOverlap%22%3Atrue%7D%2C%22data%22%3A%5B%7B%22name%22%3A%22California%22%2C%22value%22%3A103%7D%2C%7B%22name%22%3A%22New%20York%22%2C%22value%22%3A117%7D%2C%7B%22name%22%3A%22Texas%22%2C%22value%22%3A89%7D%2C%7B%22name%22%3A%22Florida%22%2C%22value%22%3A74%7D%5D%7D%5D%7D&w=760&h=520)
```

## 7. 代码构成：从真实 tokei 统计生成

**任务与输入**：在目标仓库运行 `tokei --output json` 获取真实语言统计，不根据 README 或文件数量猜占比。下面 JSON 仅演示输入形状。

```sh
tokei --output json
```

```json
{"TypeScript":{"code":1200,"comments":300,"blanks":150},"JavaScript":{"code":400,"comments":80,"blanks":40},"Shell":{"code":160,"comments":40,"blanks":20}}
```

**endpoint 与边界**：`/draw/tokei` 画代码、注释、空行三段堆叠柱；统计单位是行数，不是字节。公开仓库可交付 URL，私有仓库用本地渲染，避免公开敏感统计。

**校验**：用原始 tokei JSON 对照语言排序和三项数值；tokei 不内嵌完整原始统计，不能从 SVG 几何反推。精简 JSON 用当前环境的编码函数整体编码一次后放入 `d=`。

**渲染与交付**：

```markdown
[![真实代码构成统计](https://x-cmd.com/draw/tokei?d=%7B%22TypeScript%22%3A%7B%22code%22%3A1200%2C%22comments%22%3A300%2C%22blanks%22%3A150%7D%2C%22JavaScript%22%3A%7B%22code%22%3A400%2C%22comments%22%3A80%2C%22blanks%22%3A40%7D%2C%22Shell%22%3A%7B%22code%22%3A160%2C%22comments%22%3A40%2C%22blanks%22%3A20%7D%7D&title=Code)](https://x-cmd.com/draw/explore/tokei?d=%7B%22TypeScript%22%3A%7B%22code%22%3A1200%2C%22comments%22%3A300%2C%22blanks%22%3A150%7D%2C%22JavaScript%22%3A%7B%22code%22%3A400%2C%22comments%22%3A80%2C%22blanks%22%3A40%7D%2C%22Shell%22%3A%7B%22code%22%3A160%2C%22comments%22%3A40%2C%22blanks%22%3A20%7D%7D&title=Code)
```

## 8. 业务流向：访问 → 注册 → 付费

**任务与输入**：同一统计周期内 Ads→Web 1000 次、Web→Signup 240 次、Signup→Paid 60 次，均为已核实流量。

**endpoint 与边界**：`type=sankey` 表达真实数量流向；没有流量数据或存在循环依赖时不用桑基图。

```text
type=sankey&labels=Ads,Web,Signup,Paid&links=Ads>Web:1000;Web>Signup:240;Signup>Paid:60&title=Conversion
```

**校验**：所有链接引用已定义节点、无环，方向和数值与原始漏斗一致；检查未画出的退出或其他路径，不把所列流量解释为未提供的总体转化率。正文注明周期、去重规则和漏斗定义。

**渲染与交付**：

```markdown
[![访问、注册、付费业务流向](https://x-cmd.com/draw?type=sankey&labels=Ads,Web,Signup,Paid&links=Ads>Web:1000;Web>Signup:240;Signup>Paid:60&title=Conversion)](https://x-cmd.com/draw/explore?type=sankey&labels=Ads,Web,Signup,Paid&links=Ads>Web:1000;Web>Signup:240;Signup>Paid:60&title=Conversion)
```
