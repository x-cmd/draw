---
x-title: pie 饼图 —— 6 种风格（opendata / evil / evil-mono / market-mono / progress / revenue）
x-desc: x-cmd/draw `type=pie` 用法速查。6 种风格：opendata（标签圈外+编辑式标题）、evil（圆角扇区+数值内标）、evil-mono（引线外标）、market-mono（灰阶+环心总计）、progress（点状进度环）、revenue（渐变扇区+右图例）。完整参数：labels / values / title / unit / donut / t / scheme / num / w/h。
x-sidebar: draw 饼图
x-keywords: pie chart, 饼图, draw, svg, opendata, evil, market-mono, progress, revenue, donut
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw pie 饼图'
      inLanguage: 'zh-CN'
      about: 'x-cmd/draw 饼图类型用法'
---

# pie 饼图 —— 6 种风格（opendata / evil / evil-mono / market-mono / progress / revenue）

---

## 一、参数

| 参数 | 含义 | 必填 |
| --- | --- | --- |
| `labels=` | 各扇区标签，逗号分隔 | ✓ |
| `values=` | 各扇区数值，逗号分隔 | ✓ |
| `title=` | 图表标题 | ✗ |
| `unit=` | 数值单位（如 `B`、`responses`、`%`） | ✗ |
| `donut=` | `0` 实心 / `>0` 圆环宽度 | ✗ |
| `t=` | 风格（见下表） | ✗ |

通用参数（`scheme` / `num` / `w/h` / `v`）见 [0-draw-overview](0-draw-overview) §二。

---

## 二、6 种风格（`t=`）

| 风格 (`t=`) | 视觉 | 适用 |
| --- | --- | --- |
| `opendata`（默认）| 标签圈外、编辑式标题 | 通用、浏览器市场类 |
| `evil` | 圆角扇区、白缝分隔、数值内标 | 营收 / 市场份额 |
| `evil-mono` | 实心 + 引线外标、名称灰数值墨 | 黑白印刷 |
| `market-mono` | 灰阶按份额深浅、环心总计、两列图例 | 商业报告 |
| `progress` | 点状进度环、环心大百分比 | 调研 / 调查 |
| `revenue` | 对角渐变、虚线内圈、右图例带数值 | 营收分析 |

### 示例

```sh
# OpenData（默认）
curl "https://x-cmd.com/draw?type=pie&t=opendata&title=Chrome%20holds&labels=Chrome,Safari,Firefox,Edge,Other&values=65,18,7,6,4"

# Evil
curl "https://x-cmd.com/draw?type=pie&t=evil&title=Browser%20market&labels=Chrome,Safari,Firefox,Edge,Other&values=275,200,187,173,90"

# Evil 外标
curl "https://x-cmd.com/draw?type=pie&t=evil-mono&title=Browser%20market&labels=Chrome,Safari,Firefox,Edge,Other&values=275,200,187,173,90"

# Market Mono（带单位）
curl "https://x-cmd.com/draw?type=pie&t=market-mono&unit=B&title=Market%20share&labels=Skyline,Datawell,Cloudpeak,Taskbridge,Streamforge&values=27,21,13,21,12"

# Progress（点状环）
curl "https://x-cmd.com/draw?type=pie&t=progress&unit=responses&title=Where%20the%20workday%20leaks&labels=Additional%20support%20requests,Inaccurate%20forecasts&values=48,67"

# Revenue（渐变）
curl "https://x-cmd.com/draw?type=pie&t=revenue&unit=orders&title=Revenue&labels=Direct,Marketplace,Wholesale,Affiliate&values=52400,38900,24150,16300"
```

---

## 三、实心 vs 圆环

`donut=0` 强制实心饼（无环心）：

```sh
curl "https://x-cmd.com/draw?type=pie&donut=0&title=Share&labels=TS,Py,Go&values=48,23,9"
```

> **同一模板，一个参数切换形态**——这是 x-cmd/draw 的核心设计：风格由参数控制，不换模板。

---

## 四、踩坑

- **标签数 ≤ 100**，> 9 自动合并 Other
- 实心 vs 圆环只是 `donut=` 的差别，不要为了"实心"换风格
- 配色方案：`scheme=dark\|light`，dark 模式下有些风格的对比度会变化
- 标题里有空格要 URL-encode：`%20` 代替