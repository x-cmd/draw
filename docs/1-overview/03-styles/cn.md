---
x-title: styles 风格速查 —— 各图表的 `t=` 清单
x-desc: x-cmd/draw 风格（`t=`）跨图表速查。同名风格在不同图表上有不同视觉效果（如 `evil` 在 pie 是圆角扇区、在 line 是粗线）。每个图表自己专门文章里有完整示例，这里是跨图表索引。
x-sidebar: 风格速查
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
| `pie` | `opendata` | `evil` `evil-mono` `market-mono` `progress` `revenue` `macaron` `wabi-sabi` `primer` `morandi` `nordic` `salmon` `neon` | [pie](../../2-data-charts/01-pie/cn.md) |
| `bar` | `evil` | `macaron` `wabi-sabi` `primer` `morandi` `nordic` `salmon` `neon` | [bar](../../2-data-charts/02-bar/cn.md) |
| `hbar` | `evil` | `macaron` `wabi-sabi` `primer` `morandi` `nordic` `salmon` `neon` | [hbar](../../2-data-charts/03-hbar/cn.md) |
| `line` | `evil` | `macaron` `wabi-sabi` `primer` `morandi` `nordic` `salmon` `neon` | [line](../../2-data-charts/04-line/cn.md) |
| `area` | `evil` | — | [area](../../2-data-charts/05-area/cn.md) |
| `radar` | `evil` | — | [radar](../../2-data-charts/06-radar/cn.md) |
| `gauge` | 默认带颜色变化 | — | [gauge](../../2-data-charts/07-gauge/cn.md) |
| `scatter` | `evil` | — | [scatter](../../2-data-charts/08-scatter/cn.md) |
| `combo` | `evil` | — | [combo](../../2-data-charts/09-combo/cn.md) |
| `sankey` | `evil` | `macaron` `wabi-sabi` `primer` `morandi` `nordic` `salmon` `neon` | [sankey](../../3-relations/01-sankey/cn.md) |
| `butterfly` | `base`(干净:无底纹、无竖线) | `track`(加底纹)`grid`(加竖线刻度)`scale`(两个都加) | [butterfly](../../2-data-charts/11-butterfly/cn.md) |
| `calendar` | `base`(苹果风:白底、细线、今天是红底白字) | `mono`(墨水风,适合印) | [calendar](../../2-data-charts/12-calendar/cn.md) |
| `qr` | 默认黑底白图案 | `invert=1` 反色 | [qr](../../7-infographics/01-qr/cn.md) |

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
| `macaron` | 糖果色相钉了明度阶梯、奶油卡、大圆角、无网格 | 消费级应用、餐饮、童品、引导页 |
| `wabi-sabi` | 苔/树皮/陶土/沙的土色、石灰墙卡、近直角 | 手作、室内、慢生活、食品品牌 |
| `primer` | GitHub Primer 功能八色、透明底、细实线网格 | README、issue、PR —— 嵌在 github.com 里的一切 |
| `morandi` | 每个色相都往灰里拉、纸面卡、鼠尾草/雾蓝/灰紫红 | 内敛的内容产品、文化、读物 |
| `nordic` | 雪/霜/峡湾的冷调 + 陶与芥末的暖点缀 | 极简产品、家居、北欧风品牌 |
| `salmon` | 三文鱼粉纸 + 波尔多红/牛津蓝/茶青、编辑式标题 | 财报、研究简报、金融类内容 |
| `neon` | 近黑虚空底 + 荧光青/品红/酸柠、折线发光 | 开发者工具、终端、赛博感页面 |

> 这七张是**跨图表皮肤**：同一个家族名在 pie/bar/hbar/line 上共享色板与中性色（墨/卡底/网格），暗色自动翻转对应的一套；架构图（`/draw/arch2`、`/draw/cloud`）也吃这些 `t=`。色板数据源：[x-cmd/color](https://www.x-cmd.com/color/)。图表未做该家族时静默回退默认（不报错）。

---

## 二点五、语义色（`colors=` 槽位 + `highlight=`）

颜色决策分三层：结构色（轴/网格/墨，系统定）、系列色（缺省按位置，系统定）、**语义色（数据方点名，系统按当前 `t=` 解析）**。`colors=` 每项三种写法，可混用：

| 写法 | 含义 | 例 |
| --- | --- | --- |
| 角色槽 | `primary` `success` `warning` `danger` `info` `accent` —— 按当前 `t=` 解析 | `colors=success,info,danger` |
| 位置槽 | `s1`..`s10` —— 家族色板第 N 色 | `colors=s3,s1,s2` |
| hex | `#RRGGBB` 直写（人的逃生舱，退出主题） | `colors=%23FF0000` |

**换皮不改义**：`danger` 在 `t=primer` 是 GitHub 红 `#CF222E`，在 `t=macaron` 是深珊瑚。空项占位（`colors=primary,,info`）保位置对齐。多系列图（bar/line）的 `colors=` 按列平行；pie/hbar 按类目平行。未配角色表的老家族（evil 等）用槽位名会 400 并列出支持的家族 —— 不静默。

```sh
curl "https://www.x-cmd.com/draw?type=hbar&t=primer&labels=Stable,Beta,EOL&values=80,15,5&colors=success,info,danger"
```

`highlight=<标签>`（可逗号多点名）：被点名的保色，其余压成家族自己的灰阶 —— 单点信号，不引入新色。

```sh
curl "https://www.x-cmd.com/draw?type=pie&t=macaron&labels=...&highlight=Chrome"
```

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