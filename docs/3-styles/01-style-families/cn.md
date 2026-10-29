---
x-title: styles 风格速查 —— 各图表的 `t=` 清单
x-desc: x-cmd/draw 风格（`t=`）跨图表速查。同名风格在不同图表上有不同视觉效果（如 `evil` 在 pie 是圆角扇区、在 line 是粗线）。每个图表自己专门文章里有完整示例，这里是跨图表索引。
x-sidebar: draw 风格速查
x-keywords: draw styles, t=, evil, opendata, market-mono, progress, revenue, 风格, 主题
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw styles 风格速查'
      inLanguage: 'zh-CN'
      about: 'x-cmd/draw t= 风格跨图表索引'
---

# styles 风格速查 —— 各图表的 `t=` 清单

---

风格（`t=`）控制图表的视觉。**同名风格在不同图表上有不同效果**——`evil` 在 pie 是圆角扇区，在 line 是粗黑线。

---

## 一、按图表速查

每种图表都有自己的默认风格和可用 `t=` 列表。完整示例见各自专门文章。

| 图表 | 默认 `t=` | 其他可选 | 专门文章 |
| --- | --- | --- | --- |
| `pie` | `opendata` | `evil` `evil-mono` `market-mono` `progress` `revenue` | [10-pie](../../2-chart-types/01-pie/cn.md) |
| `bar` | `evil` | — | [11-bar](../../2-chart-types/02-bar/cn.md) |
| `hbar` | `evil` | — | [12-hbar](../../2-chart-types/03-hbar/cn.md) |
| `line` | `evil` | — | [13-line](../../2-chart-types/04-line/cn.md) |
| `area` | `evil` | — | [14-area](../../2-chart-types/05-area/cn.md) |
| `radar` | `evil` | — | [15-radar](../../2-chart-types/06-radar/cn.md) |
| `gauge` | 默认带颜色变化 | — | [16-gauge](../../2-chart-types/07-gauge/cn.md) |
| `scatter` | `evil` | — | [17-scatter](../../2-chart-types/08-scatter/cn.md) |
| `combo` | `evil` | — | [18-combo](../../2-chart-types/09-combo/cn.md) |
| `sankey` | `evil` | — | [19-sankey](../../2-chart-types/10-sankey/cn.md) |
| `qr` | 默认黑底白图案 | `invert=1` 反色 | [20-qr](../../2-chart-types/11-qr/cn.md) |

---

## 二、风格一览（按视觉特征）

| `t=` | 视觉 | 适用场景 |
| --- | --- | --- |
| `opendata` | 标签圈外、编辑式标题、彩色 | 通用、市场份额、报告 |
| `evil` | 圆角、对比色、白缝分隔 | 现代风格、强视觉冲击 |
| `evil-mono` | 实心 + 引线外标、单色 | B&W 印刷、单色文档 |
| `market-mono` | 灰阶按份额深浅 | 商业报告、正式场合 |
| `progress` | 点状进度环、环心百分比 | 调研、调查、投票 |
| `revenue` | 对角渐变、右图例 | 营收分析、多色场景 |

---

## 三、暗色 / 亮色

主题由 `scheme=dark|light` 控制，**所有图表都支持**。

```sh
# 强制暗色
curl "https://x-cmd.com/draw?type=pie&scheme=dark&labels=A,B,C&values=10,20,30"

# 默认跟随系统
curl "https://x-cmd.com/draw?type=pie&labels=A,B,C&values=10,20,30"
```

`scheme=dark` 时：
- 背景变深
- 文字反色
- 部分风格（evil、revenue）的颜色饱和度自动调整

---

## 四、踩坑

- **风格不通用**：不是每个图表都支持所有 `t=`，看各自文章
- **同 `t=` 不同图表视觉差很多**：`evil` 在 pie 是圆角扇区，在 line 是粗黑线
- **`scheme` 影响配色但不改结构**