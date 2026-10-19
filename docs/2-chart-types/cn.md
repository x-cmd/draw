---
x-title: 图表类型大全 —— 11 种图型一篇读完
x-desc: x-cmd/draw 全部图表类型用法长文:pie / bar / hbar / line / area / radar / gauge / scatter / combo / sankey / qr 的参数表、风格、curl 示例与踩坑,合并为一篇。
x-sidebar: draw 图表类型
x-keywords: pie chart, 饼图, draw, svg, opendata, evil, market-mono, progress, revenue, donut, bar chart, 柱状图, 分组柱, 堆叠柱, hbar, 水平柱状图, horizontal bar chart, line chart, 折线图, 时间序列, time series, area chart, 面积图, radar chart, 雷达图, 多维对比, gauge, 仪表盘, gauge dial, 单值监控, scatter plot, 散点图, 关联分析, combo chart, 混合图, bar + line, sankey diagram, 桑基图, 流量, 转化路径, qr code, 二维码, wifi qr, vcard qr
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 图表类型大全'
      inLanguage: 'zh-CN'
      about: 'x-cmd/draw 全部图表类型用法'
---

# 图表类型大全 —— 11 种图型一篇读完

一篇长文覆盖 11 种图表类型;通用参数(`scheme`/`num`/`w`/`h`/`v`)与风格体系、数据格式见各专文。
## pie 饼图 —— 6 种风格（opendata / evil / evil-mono / market-mono / progress / revenue）

---

### 一、参数

| 参数 | 含义 | 必填 |
| --- | --- | --- |
| `labels=` | 各扇区标签，逗号分隔 | ✓ |
| `values=` | 各扇区数值，逗号分隔 | ✓ |
| `title=` | 图表标题 | ✗ |
| `unit=` | 数值单位（如 `B`、`responses`、`%`） | ✗ |
| `donut=` | `0` 实心 / `>0` 圆环宽度 | ✗ |
| `t=` | 风格（见下表） | ✗ |

通用参数（`scheme` / `num` / `w/h` / `v`）见 [0-draw-overview](../1-overview/cn.md) §二。

---

### 二、6 种风格（`t=`）

| 风格 (`t=`) | 视觉 | 适用 |
| --- | --- | --- |
| `opendata`（默认）| 标签圈外、编辑式标题 | 通用、浏览器市场类 |
| `evil` | 圆角扇区、白缝分隔、数值内标 | 营收 / 市场份额 |
| `evil-mono` | 实心 + 引线外标、名称灰数值墨 | 黑白印刷 |
| `market-mono` | 灰阶按份额深浅、环心总计、两列图例 | 商业报告 |
| `progress` | 点状进度环、环心大百分比 | 调研 / 调查 |
| `revenue` | 对角渐变、虚线内圈、右图例带数值 | 营收分析 |

#### 示例

```sh
## OpenData（默认）
curl "https://x-cmd.com/draw?type=pie&t=opendata&title=Chrome%20holds&labels=Chrome,Safari,Firefox,Edge,Other&values=65,18,7,6,4"

## Evil
curl "https://x-cmd.com/draw?type=pie&t=evil&title=Browser%20market&labels=Chrome,Safari,Firefox,Edge,Other&values=275,200,187,173,90"

## Evil 外标
curl "https://x-cmd.com/draw?type=pie&t=evil-mono&title=Browser%20market&labels=Chrome,Safari,Firefox,Edge,Other&values=275,200,187,173,90"

## Market Mono（带单位）
curl "https://x-cmd.com/draw?type=pie&t=market-mono&unit=B&title=Market%20share&labels=Skyline,Datawell,Cloudpeak,Taskbridge,Streamforge&values=27,21,13,21,12"

## Progress（点状环）
curl "https://x-cmd.com/draw?type=pie&t=progress&unit=responses&title=Where%20the%20workday%20leaks&labels=Additional%20support%20requests,Inaccurate%20forecasts&values=48,67"

## Revenue（渐变）
curl "https://x-cmd.com/draw?type=pie&t=revenue&unit=orders&title=Revenue&labels=Direct,Marketplace,Wholesale,Affiliate&values=52400,38900,24150,16300"
```

---

### 三、实心 vs 圆环

`donut=0` 强制实心饼（无环心）：

```sh
curl "https://x-cmd.com/draw?type=pie&donut=0&title=Share&labels=TS,Py,Go&values=48,23,9"
```

> **同一模板，一个参数切换形态**——这是 x-cmd/draw 的核心设计：风格由参数控制，不换模板。

---

### 四、踩坑

- **标签数 ≤ 100**，> 9 自动合并 Other
- 实心 vs 圆环只是 `donut=` 的差别，不要为了"实心"换风格
- 配色方案：`scheme=dark\|light`，dark 模式下有些风格的对比度会变化
- 标题里有空格要 URL-encode：`%20` 代替

---

## bar 柱状图 —— 分组柱 / 堆叠柱 / 单系列

---

### 一、参数

| 参数 | 含义 | 必填 |
| --- | --- | --- |
| `labels=` | X 轴标签，逗号分隔 | ✓ |
| `values=` | 单系列数值（Y 轴） | 单系列 ✓ |
| `series=A:v1,v2,...&series=B:v1,v2,...` | 多系列（分组或堆叠） | 分组多系列 ✓ |
| `title=` | 图表标题 | ✗ |
| `unit=` | 数值单位 | ✗ |
| `t=` | 风格（默认 `evil`） | — |

---

### 二、三种用法

#### 单系列柱状图

`values=` 一个系列：

```sh
curl "https://x-cmd.com/draw?type=bar&labels=Jan,Feb,Mar,Apr,May&values=100,150,120,180,200"
```

#### 分组柱（多系列并排）

多个 `series=A:...,B:...,C:...`：

```sh
curl "https://x-cmd.com/draw?type=bar&t=evil&labels=Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec&series=Desktop:34,87,51,63,45,78,39,92,65,53,80,27&series=Mobile:18,49,29,39,31,45,23,56,37,36,51,14"
```

#### 堆叠柱（多系列叠加）

加 `stack=1`：

```sh
curl "https://x-cmd.com/draw?type=bar&stack=1&labels=Jan,Feb,Mar&series=A:10,20,30&series=B:5,15,25"
```

---

### 三、踩坑

- **分组 vs 堆叠**：默认分组；想堆叠加 `stack=1`
- **X 轴标签数**：≤ 50 比较清晰
- **多系列命名**：`series=A:...` 中的 `A` 是图例名，可以是中文
- **数值 0**：0 会被跳过（柱子高度为 0 时不画），这是设计行为

---

## hbar 水平柱状图 —— 长 label 友好

水平柱状图，柱子是横向的。**适合 label 文字很长**的场景（如人名 / 项目名 / 长分类名）。

---

### 参数

与 `bar` 完全相同：

| 参数 | 含义 | 必填 |
| --- | --- | --- |
| `labels=` | Y 轴标签（横向） | ✓ |
| `values=` | 单系列数值 | 单系列 ✓ |
| `series=A:...,B:...` | 多系列 | 多系列 ✓ |
| `title=` | 标题 | ✗ |
| `unit=` | 单位 | ✗ |
| `t=` | 风格 | — |

---

### 示例

```sh
## 单系列
curl "https://x-cmd.com/draw?type=hbar&labels=Alice,Bob,Charlie,Diana,Edward&values=120,98,150,76,135&title=Score%20by%20person"

## 多系列分组
curl "https://x-cmd.com/draw?type=hbar&labels=Project%20Alpha,Project%20Beta,Project%20Gamma&series=Q1:80,60,90&series=Q2:95,75,110&series=Q3:110,85,120"

## 堆叠
curl "https://x-cmd.com/draw?type=hbar&stack=1&labels=Region%20A,Region%20B,Region%20C&series=Desktop:300,250,400&series=Mobile:200,180,350&series=Tablet:50,30,80"
```

---

### 何时用 hbar vs bar

- **bar**（垂直）：时间序列（X 轴是时间，从左到右有"时间流动"的暗示）
- **hbar**（水平）：分类对比（Y 轴是分类，标签文字长）

例：项目名是中文 → hbar；月份 → bar。

---

## line 折线图 —— 时间序列标配

---

### 参数

| 参数 | 含义 | 必填 |
| --- | --- | --- |
| `x=` | X 轴标签（时间 / 类别） | ✓ |
| `y=` | 单系列数值 | 单系列 ✓ |
| `series=A:v1,v2,...&series=B:v1,v2,...` | 多系列 | 多系列 ✓ |
| `title=` / `unit=` | 标题 / 单位 | ✗ |
| `t=` | 风格 | — |

---

### 示例

```sh
## 单系列
curl "https://x-cmd.com/draw?type=line&x=Jan,Feb,Mar,Apr,May,Jul&y=10,20,15,30,25,40&title=Monthly%20growth"

## 多系列
curl "https://x-cmd.com/draw?type=line&x=Mon,Tue,Wed,Thu,Fri,Sat,Sun&series=Daytime:120,140,135,150,180,200,170&series=Nighttime:80,75,90,85,95,110,100"

## 带单位
curl "https://x-cmd.com/draw?type=line&x=Q1,Q2,Q3,Q4&series=Revenue:52400,38900,24150,16300&series=Cost:31200,28700,19800,14500&unit=USD&title=Quarterly%20P&L"
```

---

### 踩坑

- **点数 vs X 轴标签数**：X 标签 ≥ 数据点数，否则缺值；X 标签 < 数据点数则取前 N 个
- **多系列对齐**：所有系列必须长度相同，否则只画到最短的为止
- **极值**：Y 轴自动适配；如需固定范围，用 `ymin=` / `ymax=`

---

## area 面积图 —— 折线 + 填充

---

折线 + 下方填充，**强调累积 / 总量**（区别于 line 的"瞬时值"）。

参数与 `line` 完全相同：x / y / series / title / unit。

---

### 示例

```sh
## 单系列
curl "https://x-cmd.com/draw?type=area&x=Jan,Feb,Mar,Apr,May,Jun&y=10,30,25,50,40,70&title=Cumulative%20users"

## 多系列堆叠
curl "https://x-cmd.com/draw?type=area&x=2019,2020,2021,2022,2023,2024&series=Mobile:100,150,220,300,400,520&series=Desktop:200,180,160,140,120,90"
```

---

### area vs line

- **line**：突出每个时间点的**值**
- **area**：突出**累积**或**整体规模**

堆叠 area 特别适合看"占比随时间的变化"。

---

## radar 雷达图 —— 多维对比

多维对比的标配。**典型用法**：产品 / 候选人 / 方案 在多个维度上的评分。

---

### 参数

| 参数 | 含义 | 必填 |
| --- | --- | --- |
| `labels=` | 维度名（轴标签） | ✓ |
| `values=` | 单对象各维度分数 | 单对象 ✓ |
| `series=A:v1,v2,...&series=B:v1,v2,...` | 多对象（叠放对比） | 多对象 ✓ |
| `title=` | 标题 | ✗ |

值域通常是 0-100（或 0-10）。**所有维度用同一个值域**才能公平对比。

---

### 示例

```sh
## 单对象
curl "https://x-cmd.com/draw?type=radar&labels=Speed,Quality,Price,Support,UX&values=85,90,70,80,95&title=Product%20A"

## 多对象对比
curl "https://x-cmd.com/draw?type=radar&labels=Speed,Quality,Price,Support,UX&series=A:85,90,70,80,95&series=B:75,85,90,70,80&series=C:90,80,60,85,75&title=Product%20comparison"
```

---

### 踩坑

- **维度数 3-7 最佳**：< 3 看不出形状；> 7 太密
- **所有维度同值域**：混用 0-100 和 0-10 会失真
- **多对象时图例用 series 名**：A/B/C 是 series 标识，可以改成有意义的名字

---

## gauge 仪表盘 —— 单值监控

单值的"进度仪表"。**典型用法**：CPU / 内存 / SLA / 完成率 / 当前值 vs 目标。

---

### 参数

| 参数 | 含义 | 默认 |
| --- | --- | --- |
| `value=` | 当前值 | ✓ |
| `max=` | 最大值（满量程） | 100 |
| `label=` | 表盘名称 | — |
| `t=` | 风格（默认带颜色变化） | — |
| `unit=` | 单位 | — |

---

### 示例

```sh
## CPU 使用率
curl "https://x-cmd.com/draw?type=gauge&value=72&max=100&label=CPU%25&title=Server%20load"

## 内存
curl "https://x-cmd.com/draw?type=gauge&value=4.2&max=8&label=Memory%20(GB)&title=Memory%20usage"

## 进度
curl "https://x-cmd.com/draw?type=gauge&value=340&max=500&label=Tickets%20resolved&title=Sprint%20progress"

## SLA
curl "https://x-cmd.com/draw?type=gauge&value=99.95&max=100&label=SLA%25&unit=%25"
```

---

### 踩坑

- **不要画多个 gauge**：一次只画一个；多对象用 [9-combo](#combo) 或 [4-line](#line)
- **`max` 别太小**：会让指针冲到顶，丢失精度
- **配合暗色主题**：仪表盘在暗色下颜色变化更明显

---

## scatter 散点图 —— 关联分析

两维关联分析。**典型用法**：身高 vs 体重 / 价格 vs 销量 / 年龄 vs 收入。

---

### 参数

| 参数 | 含义 | 必填 |
| --- | --- | --- |
| `points=x1,y1;x2,y2;...` | 单组散点（分号分隔点，逗号分隔坐标） | 单组 ✓ |
| `series=A:x1,y1;x2,y2;...&series=B:...` | 多组 | 多组 ✓ |
| `xlabel=` / `ylabel=` | 轴标签 | ✗ |
| `title=` | 标题 | ✗ |

---

### 示例

```sh
## 单组
curl "https://x-cmd.com/draw?type=scatter&points=1.5,60;1.7,65;1.8,72;1.6,58;1.75,68&xlabel=Height%20(m)&ylabel=Weight%20(kg)&title=Sample%20population"

## 多组
curl "https://x-cmd.com/draw?type=scatter&series=A:1.5,60;1.7,65;1.8,72&series=B:1.8,75;1.9,80;1.85,78&xlabel=H&ylabel=W&title=A%20vs%20B%20population"
```

---

### 踩坑

- **数据格式**：`x1,y1;x2,y2;...` —— 分号隔点，逗号隔坐标。容易搞混
- **点数 ≤ 200** 比较清楚
- **加趋势线 / 拟合**：当前不支持，只画点
- **多组**：每组建议 ≥ 5 个点

---

## combo 混合图 —— 柱 + 折线

柱状图 + 折线图叠加。**典型用法**：柱=绝对值（销量），线=比率（转化率）。

---

### 参数

| 参数 | 含义 | 必填 |
| --- | --- | --- |
| `labels=` | X 轴 | ✓ |
| `series=A:v1,v2,...&kind=bar` | bar 系列 | ✓ |
| `series=B:v1,v2,...&kind=line` | line 系列（可多个） | ✓ |
| `title=` | 标题 | ✗ |
| `unit=` | 单位 | ✗ |

`kind` 区分柱 / 线：`bar` / `line`。每个 series 都可以独立指定 kind。

---

### 示例

```sh
## 柱（销量）+ 线（转化率）
curl "https://x-cmd.com/draw?type=combo&labels=Jan,Feb,Mar,Apr,May&series=Sales:100,150,120,180,200&kind=bar&series=Conversion%20rate:3.2,4.1,3.8,4.5,5.2&kind=line"

## 多柱 + 多线
curl "https://x-cmd.com/draw?type=combo&labels=Q1,Q2,Q3,Q4&series=Revenue:52400,38900,24150,16300&kind=bar&series=Cost:31200,28700,19800,14500&kind=bar&series=Margin:39,26,18,11&kind=line&unit=%25"
```

---

### 踩坑

- **bar / line 配对**：双 Y 轴自动适配，但注意量纲差异（如百分比 vs 美元）
- **多 series 时，每个都加 `kind`**：缺了会按默认（柱）
- **不是所有风格都支持 combo**：风格 `t=` 兼容性以单柱为准

---

## sankey 桑基图 —— 流量 / 转化路径

**典型用法**：流量从来源 → 中间步骤 → 终点 的转化路径（如：用户从搜索 → 落地 → 注册 → 付费）。

---

### 参数

| 参数 | 含义 | 必填 |
| --- | --- | --- |
| `nodes=` | 节点列表，逗号分隔 | ✓ |
| `links=source,target,value;...` | 连接：源 → 目标 → 值；分号分隔多条 | ✓ |
| `title=` | 标题 | ✗ |

---

### 示例

```sh
## 用户转化漏斗
curl "https://x-cmd.com/draw?type=sankey&nodes=Visitor,Signup,Active,Paid,Churn&links=Visitor,Signup,1000;Signup,Active,600;Active,Paid,200;Active,Churn,300&title=User%20conversion"

## 能源流（多源 → 多汇）
curl "https://x-cmd.com/draw?type=sankey&nodes=Solar,Wind,Nuclear,Grid,Home,Industry&links=Solar,Grid,500;Wind,Grid,800;Nuclear,Grid,300;Grid,Home,400;Grid,Industry,1200&title=Energy%20flow"
```

---

### 踩坑

- **节点名引用**：links 里的 `source`/`target` 必须**精确匹配** nodes 里的字符串
- **节点数 ≤ 20**：图变密集；超过考虑分组
- **值为 0 的 link 不画**：用于隐藏不需要强调的路径
- **JSON 写法更适合**：节点多、连接复杂时用 `?d=` JSON

---

## qr 二维码 —— URL / WiFi / 联系人

生成任何内容（URL、文本、WiFi 配置、vCard）的二维码。返回的 SVG 可以直接 print / embed。

---

### 参数

| 参数 | 含义 | 默认 |
| --- | --- | --- |
| `data=` | 内容（必填） | — |
| `size=` | QR 模块像素大小 | — |
| `ec=` | 纠错级别 L/M/Q/H | M |

纠错级别决定二维码损坏多少仍可识别：L ~7% / M ~15% / Q ~25% / H ~30%。

---

### 示例

```sh
## URL
curl "https://x-cmd.com/draw?type=qr&data=https://x-cmd.com/draw"

## WiFi 配置（手机扫就连 WiFi）
curl "https://x-cmd.com/draw?type=qr&data=WIFI:S:MyWiFi;T:WPA;P:password123;;"

## vCard（联系人）
curl "https://x-cmd.com/draw?type=qr&data=BEGIN:VCARD%0AVERSION:3.0%0AFN:Alice%0AORG:x-cmd%0AEMAIL:alice@example.com%0AEND:VCARD"

## 普通文本
curl "https://x-cmd.com/draw?type=qr&data=Hello%20from%20x-cmd"

## 高纠错（带 logo 也可识别）
curl "https://x-cmd.com/draw?type=qr&data=https://x-cmd.com&ec=H&size=10"
```

---

### 内容格式

#### URL
直接传：`data=https://...`

#### WiFi
```
WIFI:S:<SSID>;T:<WPA|WEP|>;H:<true|false|>;P:<password>;;
```

#### vCard
完整 vCard 格式（注意 URL-encode 换行 `\n%0A`）。

---

### 踩坑

- **内容长度**：QR 标准上限 ~2953 字节（版本 40 + 低纠错），URL-encode 后中文也只占 3 字节/字符
- **`data=` 必须 URL-encode**：特别是 `:`、`;`、`#`、`%`
- **暗色 QR**：默认黑底白图案；可调 `invert=1` 反色（适合深色背景）
- **嵌入 logo**：把 logo 放在 SVG 中央会被 QR 引擎自动识别为"中间 logo"；纠错级别建议 H
