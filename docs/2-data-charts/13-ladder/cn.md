---
x-title: 天梯图与双翼天梯图 —— 一行两个型号
x-desc: 'x-cmd/draw 的天梯图(ladder)与双翼天梯图(butterfly-ladder):一行两个型号,档位(S/A/B/C)把相邻的行连成一层。数据可以放在文件里(src=),上千行也不怕 URL 超长。'
x-sidebar: 天梯图
x-keywords: 天梯图, 双翼天梯图, ladder, butterfly-ladder, 档位, tier, src, draw, svg
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: '天梯图与双翼天梯图 —— 一行两个型号'
      inLanguage: 'zh-CN'
      about: 'x-cmd/draw 2-data-charts 12-ladder'
---

# 天梯图与双翼天梯图 —— 一行两个型号

## 两种图

| 图 | 形态 | 什么时候用 |
|---|---|---|
| **天梯图** `type=ladder` | 一边,按强弱排成梯子 | 一家的排名(显卡榜、CPU 榜) |
| **双翼天梯图** `type=butterfly-ladder` | 两翼合成一条梯子,整体排序 | 两家正面对打(NVIDIA 对 AMD/Intel) |

跟 `type=butterfly` 的区别:butterfly 是**通用**的双系列图(人口金字塔、
「开了 vs 关了」的按龄分布),两侧**共用一套**行标签;天梯图要的是
**整体排序、两翼分开**,而且能**分档** —— 那是另一套语义、另一套读法。

## 数据模型:每边是「名 + 值」的列表

名字和值不再分家(早先的 `labels=` 是平行数组,一行只能显示一个名字):

```json
{
  "type": "butterfly-ladder",
  "title": "NVIDIA vs AMD/Intel · 显卡指数",
  "left":  {"name": "NVIDIA",    "items": [{"label": "GeForce RTX 5090", "value": 3264, "tier": "S"}]},
  "right": {"name": "AMD/Intel", "items": [{"label": "Radeon RX 7900 XTX", "value": 2095, "tier": "S"}]}
}
```

- `items[]` 里 `label` / `value` 必备,`tier`(档位)可选
- 短形态也有(名字和值用逗号分,名字里的逗号要自己避开):

```
?type=butterfly-ladder
&left=NVIDIA:3264,2851&right=AMD/Intel:2095,1875
&llabels=GeForce RTX 5090,GeForce RTX 4090
&rlabels=Radeon RX 7900 XTX,Radeon RX 7900 XT
&ltiers=S,S&rtiers=S,S
```

## 档位:行的一组属性

`tier` 不是名字的一部分 —— 同一档的行**连在一起**,档与档之间一条分隔线,
档名标在左边那一列(S / A / B / C)。

这样读图是「先看档,再看档内谁强」。

## 排序是整体的,但分成两大类

两翼的卡合成**一条**梯子 —— **整体按强弱排**,不是各排各的:

| `match=` | 怎么排 | 读法 |
|---|---|---|
| `rank`(缺省) | **完全错位**:合成一条梯子,谁强谁在前;**每一行只有一张卡**,在它自己那一侧,另一边空着 | 一条梯子扫下去,谁在谁前面 |
| `value` | **匹配排序**:右边每张卡**抬**到左边那张刚好更强的行上(`左n >= 右 > 左n+1` ✓);右边顺序不变 ✓ | 「这两张差不多,谁快一点」 |
| `tier` | **按档分块**:先**全排序**,再把右边**一块一块地抬起来** —— 同一档的卡排在同一行;一块的行数取两边多的那个 ⇒ **两边都可能空档** ✓ | 「同档的两张摆一起;一边没有,那一行就空着」 |

| `ticks=` | 画哪些标度线(`1000,2000,3000`);不给就自动挑 ✓ | 「数字站在哪儿」 |
| `stripbrand=1` | 把名字前面的牌子去掉(`GeForce RTX 5090` → `RTX 5090`)—— 颜色已经说明了 ✓ | 名字短一点 |
| `color=` | 某一侧(或某一张卡)的颜色;缺省看名字认:**NVIDIA 绿 / AMD 红 / Intel 蓝** ✓ | 品牌色 |

`rank` 那种排法下两翼**共用一把标尺** —— 不然跨翼的长度没法比。

## 数据放文件里:`src=`

天梯图会有上千行 —— 塞进 URL 会超长(浏览器几千字符、代理几 KB 都有上限)。
所以规格可以放在一个 JSON 文件里,URL 只给链接:

```
?type=butterfly-ladder&src=https://raw.githubusercontent.com/x-cmd/draw/main/examples/ladder-gpu.json
```

跟 onepage 的 `?src=` 一个规矩:github blob 链接自动转 raw;不许取回环和私网地址;
体积上限 1MB。

## 相关

- [双翼条形图](../11-butterfly/cn.md) —— 通用双系列图(共用一套行标签)
- [水平柱状图](../03-hbar/cn.md) —— 一边的排名
