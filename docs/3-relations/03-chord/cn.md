---
x-title: 和弦图 —— 一圈弧,弧与弧之间的带子
x-desc: 'x-cmd/draw 和弦图(`/draw/chord`):`links=源,目标,值;…` 一串就够,节点从连接里长出来,各占一段弧(弧长 ∝ 总流量),连接拉成弧间的带子。参数:`links=`、`title=`、`w=`/`h=`。'
x-sidebar: draw 和弦图
x-keywords: 和弦图, chord diagram, draw, svg, 关系, 流量, 双向关系, 占比
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 和弦图'
      inLanguage: 'cn'
      about: 'x-cmd/draw 03-chord'
---

# 和弦图 —— 一圈弧,弧与弧之间的带子

和弦图画的是**一群实体两两之间的流量**。每个实体占一段圆弧,弧长 ∝ 它的
总流量(进 + 出);每条连接从源弧上切一段、在目标弧上切一段,两段之间拉一条
带子。带子多宽,流量就多大 —— 谁和谁都来往、来往多少,一眼扫完。

这张图是 draw 自己画的:ECharts 的和弦图要靠自定义系列(`renderItem` 函数),
URL 里能带的只有纯 JSON,带不了函数;桑基的圆形摆法 SSR 也不认。所以和弦图
是独立实现的一个图种。

**典型场合**:音乐流派互相影响、团队之间互相评审、模块之间互相调用、
城市之间客运来往 —— 「两两之间都有往来」的关系,比桑基图更对称的场合。

## 参数

| 参数 | 意思 | 默认 |
|---|---|---|
| `links=` | 连接:`源,目标,值;源,目标,值;…`(分号分条,值必须 > 0) | — |
| `title=` | 标题(画在左上) | — |
| `w=` / `h=` | 画布尺寸 | 560×460 |

**节点不用写**:`links=` 里出现过的名字自动成为节点,按总流量排序上圈,
颜色从 8 色盘里轮流取。

## 例子

### 音乐流派互相影响

```text
https://x-cmd.com/draw/chord?links=Rock,Pop,28;Rock,Metal,34;Rock,Folk,12;Rock,Jazz,9;Pop,Electronic,31;Pop,Hip%20hop,22;Jazz,Classical,16;Classical,Folk,9;Hip%20hop,Electronic,26;Electronic,Metal,13;Metal,Classical,21&w=560&h=460
```

[![和弦图 · 流派](https://x-cmd.com/draw/chord?links=Rock,Pop,28;Rock,Metal,34;Rock,Folk,12;Rock,Jazz,9;Pop,Electronic,31;Pop,Hip%20hop,22;Jazz,Classical,16;Classical,Folk,9;Hip%20hop,Electronic,26;Electronic,Metal,13;Metal,Classical,21&w=560&h=460)](https://x-cmd.com/draw/explore/chord?links=Rock,Pop,28;Rock,Metal,34;Rock,Folk,12;Rock,Jazz,9;Pop,Electronic,31;Pop,Hip%20hop,22;Jazz,Classical,16;Classical,Folk,9;Hip%20hop,Electronic,26;Electronic,Metal,13;Metal,Classical,21&w=560&h=460)

Rock → Metal 那根带子最粗(34),Classical 的弧上三根带子(Metal 21、Jazz 16、
Folk 9)进得多、出得少 —— 谁影响谁,看带子就知道。

### 带标题、换尺寸

同一个数据,加 `title=`、把画布放大到 760×620:

```text
https://x-cmd.com/draw/chord?links=Rock,Pop,28;Rock,Metal,34;Rock,Folk,12;Rock,Jazz,9;Pop,Electronic,31;Pop,Hip%20hop,22;Jazz,Classical,16;Classical,Folk,9;Hip%20hop,Electronic,26;Electronic,Metal,13;Metal,Classical,21&title=Music%20genres&w=760&h=620
```

[![和弦图 · 流派(带标题)](https://x-cmd.com/draw/chord?links=Rock,Pop,28;Rock,Metal,34;Rock,Folk,12;Rock,Jazz,9;Pop,Electronic,31;Pop,Hip%20hop,22;Jazz,Classical,16;Classical,Folk,9;Hip%20hop,Electronic,26;Electronic,Metal,13;Metal,Classical,21&title=Music%20genres&w=760&h=620)](https://x-cmd.com/draw/explore/chord?links=Rock,Pop,28;Rock,Metal,34;Rock,Folk,12;Rock,Jazz,9;Pop,Electronic,31;Pop,Hip%20hop,22;Jazz,Classical,16;Classical,Folk,9;Hip%20hop,Electronic,26;Electronic,Metal,13;Metal,Classical,21&title=Music%20genres&w=760&h=620)

## 限制

- **值必须 > 0**,≤ 0 或不是数字的条会被直接丢掉(不写报错,只静默跳过)。
- **节点数 ≤ 20 看着舒服。** 圈上名字从 `links=` 里收集,超过 20 个弧就变窄、
  字开始挤;再多的关系考虑换桑基图(左右结构更适合多节点)。
- **方向感弱于桑基。** 带子是双向的观感,要讲「从 A 到 B 的转化」,
  桑基图(`type=sankey`)的左右流向更清楚;和弦图讲的是「A 和 B 之间」。
- **名字里的逗号不行** —— 逗号是分隔符,名字带逗号会被切开。

## 跟别的图种的区别

- **`type=sankey`**:有向、从左到右、中间步骤清清楚楚 —— 漏斗、转化、
  能源流那种「有上下游」的场合。和弦图是圆的、对称的,讲两两关系。
- **`type=pie`**:饼图讲一个整体怎么分;和弦图讲一群个体怎么互相来往。

图库里还有更多:[/draw/demo/sankey](https://x-cmd.com/draw/demo/sankey)。
