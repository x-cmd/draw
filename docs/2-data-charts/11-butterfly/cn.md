---
x-title: 双翼条形图 —— 两个系列,背靠背
x-desc: 'x-cmd/draw 双翼条形图(`/draw?type=butterfly`)。两个柱系列共用一根中轴、往两侧长,两侧各自可堆叠,任意一侧可叠一条自己标尺的折线。参数:`labels=`、`left=`、`right=`、`line=`、`lineside=`、`dir=lr|tb`、`title=`、`unit=`、`w=/h=`。'
x-sidebar: draw 双翼条形图
x-keywords: 双翼条形图, butterfly chart, 龙卷风图, tornado chart, 人口金字塔, population pyramid, draw, svg
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 双翼条形图'
      inLanguage: 'cn'
      about: 'x-cmd/draw 11-butterfly'
---

# 双翼条形图 —— 两个系列,背靠背

横向条形图只能回答「谁更长」。要比较两样东西,就得画两张图。**双翼条形图**
把两个系列背靠背放在同一根中轴两侧:长度直接可比,还只占一半地方。

同一个形状在业界还有别的名字:类别按大小排序时叫**龙卷风图**(tornado chart),
年龄 × 性别时叫**人口金字塔**(population pyramid),更宽泛的说法是**双向柱状图**
(diverging bar chart)。draw 叫它双翼条形图。

## 例子(看到的就是 URL 给的;点击进交互页)

### 按时长分:开了 vs 关了

```text
https://x-cmd.com/draw?type=butterfly&title=Issues%20opened%20vs%20closed&labels=0-30d,30-60d,60-90d,90-180d,180-360d,360-720d&left=Opened:7,8,2,7,6,7&right=Closed:5,6,2,7,5,6&w=760&h=440
```

[![Issues opened vs closed](https://x-cmd.com/draw?type=butterfly&title=Issues%20opened%20vs%20closed&labels=0-30d,30-60d,60-90d,90-180d,180-360d,360-720d&left=Opened:7,8,2,7,6,7&right=Closed:5,6,2,7,5,6&w=760&h=440)](https://x-cmd.com/draw/explore?type=butterfly&title=Issues%20opened%20vs%20closed&labels=0-30d,30-60d,60-90d,90-180d,180-360d,360-720d&left=Opened:7,8,2,7,6,7&right=Closed:5,6,2,7,5,6)

### 两个引擎:峰值内存 vs 磁盘上的数据

```text
https://x-cmd.com/draw?type=butterfly&title=Memory%20vs%20disk%20per%20engine&labels=duckdb,sqlite&left=peak%20memory%20(GB):0.32,0.04&right=data%20on%20disk%20(GB):0.37,3.08&w=760&h=440
```

[![Memory vs disk](https://x-cmd.com/draw?type=butterfly&title=Memory%20vs%20disk%20per%20engine&labels=duckdb,sqlite&left=peak%20memory%20(GB):0.32,0.04&right=data%20on%20disk%20(GB):0.37,3.08&w=760&h=440)](https://x-cmd.com/draw/explore?type=butterfly&title=Memory%20vs%20disk%20per%20engine&labels=duckdb,sqlite&left=peak%20memory%20(GB):0.32,0.04&right=data%20on%20disk%20(GB):0.37,3.08)

### 人口的年龄结构 —— 同一张图站起来

```text
https://x-cmd.com/draw?type=butterfly&dir=tb&title=Population%20by%20age&labels=0-19,20-39,40-59,60-79&left=Male:51,48,42,35&right=Female:49,52,58,65&w=760&h=440
```

[![Population by age](https://x-cmd.com/draw?type=butterfly&dir=tb&title=Population%20by%20age&labels=0-19,20-39,40-59,60-79&left=Male:51,48,42,35&right=Female:49,52,58,65&w=760&h=440)](https://x-cmd.com/draw/explore?type=butterfly&dir=tb&title=Population%20by%20age&labels=0-19,20-39,40-59,60-79&left=Male:51,48,42,35&right=Female:49,52,58,65)

### 柱对线 —— 单位不同,标尺也不同

```text
https://x-cmd.com/draw?type=butterfly&title=Memory,%20disk%20and%20report%20time&labels=duckdb,sqlite&left=peak%20memory%20(GB):0.32,0.04&right=data%20on%20disk%20(GB):0.37,3.08&line=report%20time%20(ms):536,49178&lineside=right&w=760&h=440
```

[![Memory, disk and report time](https://x-cmd.com/draw?type=butterfly&title=Memory,%20disk%20and%20report%20time&labels=duckdb,sqlite&left=peak%20memory%20(GB):0.32,0.04&right=data%20on%20disk%20(GB):0.37,3.08&line=report%20time%20(ms):536,49178&lineside=right&w=760&h=440)](https://x-cmd.com/draw/explore?type=butterfly&title=Memory,%20disk%20and%20report%20time&labels=duckdb,sqlite&left=peak%20memory%20(GB):0.32,0.04&right=data%20on%20disk%20(GB):0.37,3.08&line=report%20time%20(ms):536,49178&lineside=right)

### 同一张图,四种风格 —— 干净 / 有底纹 / 有竖线 / 两个都有

```text
https://x-cmd.com/draw?type=butterfly&title=Issues%20opened%20vs%20closed&labels=0-30d,30-60d,60-90d,90-180d,180-360d,360-720d&left=Opened:7,8,2,7,6,7&right=Closed:5,6,2,7,5,6&w=760&h=440
```

[![Issues opened vs closed](https://x-cmd.com/draw?type=butterfly&title=Issues%20opened%20vs%20closed&labels=0-30d,30-60d,60-90d,90-180d,180-360d,360-720d&left=Opened:7,8,2,7,6,7&right=Closed:5,6,2,7,5,6&w=760&h=440)](https://x-cmd.com/draw/explore?type=butterfly&title=Issues%20opened%20vs%20closed&labels=0-30d,30-60d,60-90d,90-180d,180-360d,360-720d&left=Opened:7,8,2,7,6,7&right=Closed:5,6,2,7,5,6)

```text
https://x-cmd.com/draw?type=butterfly&t=scale&title=Issues%20opened%20vs%20closed&labels=0-30d,30-60d,60-90d,90-180d,180-360d,360-720d&left=Opened:7,8,2,7,6,7&right=Closed:5,6,2,7,5,6&w=760&h=440
```

[![Issues opened vs closed, with scale](https://x-cmd.com/draw?type=butterfly&t=scale&title=Issues%20opened%20vs%20closed&labels=0-30d,30-60d,60-90d,90-180d,180-360d,360-720d&left=Opened:7,8,2,7,6,7&right=Closed:5,6,2,7,5,6&w=760&h=440)](https://x-cmd.com/draw/explore?type=butterfly&t=scale&title=Issues%20opened%20vs%20closed&labels=0-30d,30-60d,60-90d,90-180d,180-360d,360-720d&left=Opened:7,8,2,7,6,7&right=Closed:5,6,2,7,5,6)

## 1. 参数

| 参数 | 意思 | 缺省 |
|---|---|---|
| `labels=` | 类别 —— `lr` 时是行,`tb` 时是列 | — |
| `left=` | 一侧:`名字:v,v,v`;堆叠写 `名字:v,v;名字:v,v` | — |
| `right=` | 另一侧,写法同上 | — |
| `line=` | 一条自己标尺的折线:`名字:v,v,v` | — |
| `lineside=` | 折线在哪一侧:`left` / `right` | `right` |
| `dir=` | `lr`(往左右长)或 `tb`(往上下长) | `lr` |
| `title=` | 标题 | — |
| `unit=` | 单位,显示在图例里 | — |
| `w=` / `h=` | 画布尺寸 | 640 × 420 |
| `scheme=` | `dark` / `light` | auto |
| `t=` | 风格家族:`base`(缺省 —— 干净:无底纹、无竖线)、`track`(加一层淡底纹轨道)、`grid`(加两侧的竖线刻度)、`scale`(两个都加) | `base` |
| `d=` | JSON 形态(见下) | — |

**JSON 形态** —— 短形态说不清的时候用:

```text
https://x-cmd.com/draw?type=butterfly&d={"labels":["duckdb","sqlite"],"left":{"name":"peak memory (GB)","values":[0.32,0.04]},"right":{"name":"on disk (GB)","values":[0.37,3.08]},"line":{"name":"report (ms)","values":[536,49178],"side":"right"}}
```

```json
{
  "labels": ["duckdb", "sqlite"],
  "left":  { "name": "peak memory (GB)", "values": [0.32, 0.04] },
  "right": { "name": "on disk (GB)", "values": [0.37, 3.08] },
  "line":  { "name": "report (ms)", "values": [536, 49178], "side": "right" },
  "dir": "lr"
}
```

一侧要堆叠就写 `"segments": [{"name": "code", "values": [...]}, …]` —— 自中轴往外堆。

## 2. 四种变体

一套数据形状就能覆盖:

| 变体 | 怎么要 |
|---|---|
| **基础** —— 两个系列背靠背 | `left=` + `right=` |
| **堆叠** —— 两侧各自堆几段 | `left=code:1,2;comments:3,4`(段与段之间用分号) |
| **站起来** —— 类别变成列 | `dir=tb` |
| **柱对线** —— 一侧改成折线 | `line=名字:v,v,v&lineside=right`(那一侧就别给柱了) |
| **柱上叠线** —— 折线有自己的标尺 | `line=…` 和 `left=`/`right=` 一起给 |

两侧的柱**共用一把标尺** —— 这正是双翼图的意义:长度可比。折线永远是**自己的
标尺**,因为它的单位通常不一样。

## 3. 四种长相(`t=`)

底纹和刻度线都是「空的东西」:底纹没被柱填满的那截是灰的,刻度线又没有数字。
读者容易把灰当成数据的一部分,把没数字的竖线当成多余的骨架。所以**缺省是干净的**
—— 只有柱、柱端的数值和图例:

| `t=` | 长相 | 什么时候用 |
|---|---|---|
| `base`(缺省) | 无底纹、无竖线 | 平时就用这个 |
| `track` | 加一层淡底纹轨道 | 想看出「这一侧最长能到哪」 |
| `grid` | 加两侧等距的竖线刻度 | 想看出标尺的间隔 |
| `scale` | 底纹 + 刻度 | 完整的标尺感 |

数值本来就写在柱端,所以去掉底纹和刻度**不丢信息** —— 只剩柱也读得懂。

## 4. 在交互页里

`/draw/explore?type=butterfly&…` 左边是图,右边是参数的表格:一行一个类别,
一列一段。改一格图立刻重画,URL 跟着变。

## 5. 坑

- **单位进图例,不要放轴上。** 写 `left=peak memory (GB):…`,别用 `unit=GB`:
  读者在轴上看到「1k」根本不知道那是 MB。图例是他唯一会看的地方。
- **两侧共用柱的标尺。** 一侧是 GB、另一侧是字节,图就在骗人 —— 先换算,
  或者把第二个数放到折线上。
- **URL 里的 `+` 是空格。** 名字以加号开头,得写成 `%2B`。
- **名字是读者要比的东西。** `Opened` / `Closed` 比 `系列 A` / `系列 B` 好得多。
