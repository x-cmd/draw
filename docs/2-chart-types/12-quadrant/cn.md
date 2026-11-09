---
x-title: 四象限图 —— 2×2 决策矩阵
x-desc: x-cmd/draw `type=quadrant` 用法速查。一族决策图：矩阵式(2×2,艾森豪威尔 / BCG / 价值网)与十字式(只有两条轴,审美鸿沟 / 用户体验变革)。参数：`quadrants=` 四个象限名,`quaddescs=` 四条说明,`quadlabels=` 每格并列的小标签,`frame=box|cross`,`xlabel=`/`ylabel=` 轴标题,`xlow=`/`xhigh=`/`ylow=`/`yhigh=` 轴两端,`items=` 散点(`名称@x,y`,0..1)。
x-sidebar: draw 四象限图
x-keywords: 四象限图, quadrant chart, draw, svg, 艾森豪威尔矩阵, BCG 矩阵, 决策矩阵, 2x2, 十字轴
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 四象限图'
      inLanguage: 'zh-CN'
      about: 'x-cmd/draw 四象限图'
---

# 四象限图 —— 2×2 决策矩阵

一个图种,两种框。

**矩阵式**(`frame=box`,给了格子时的缺省)—— 2×2 的框、四格各一个标签、两条带箭头的轴。

```text
https://x-cmd.com/draw?type=quadrant&title=%E4%BB%B7%E5%80%BC%E7%BD%91%E7%9F%A9%E9%98%B5%E6%A0%BC%E5%9B%BE&quadrants=Q3.%E6%96%B0%E5%B8%82%E5%9C%BA%E5%88%9B%E6%96%B0%2CQ4.%E8%A7%84%E6%A8%A1%E5%BC%8F%E5%88%9B%E6%96%B0%2CQ2.%E9%80%89%E6%8B%A9%E6%80%A7%E6%8A%80%E6%9C%AF%2CQ1.%E7%AA%81%E7%A0%B4%E6%80%A7%E6%8A%80%E6%9C%AF&xlabel=%E6%8A%80%E6%9C%AF%2F%E4%BA%A7%E5%93%81&ylabel=%E5%B8%82%E5%9C%BA%2F%E5%AE%A2%E6%88%B7&xlow=%E6%88%90%E7%86%9F%E6%8A%80%E6%9C%AF%E4%BA%A7%E5%93%81&xhigh=%E6%96%B0%E6%8A%80%E6%9C%AF%E4%BA%A7%E5%93%81&ylow=%E4%B8%BB%E6%B5%81%E5%B8%82%E5%9C%BA&yhigh=%E6%96%B0%E5%85%B4%E5%B8%82%E5%9C%BA
```

[![四象限矩阵](https://x-cmd.com/draw?type=quadrant&title=%E4%BB%B7%E5%80%BC%E7%BD%91%E7%9F%A9%E9%98%B5%E6%A0%BC%E5%9B%BE&quadrants=Q3.%E6%96%B0%E5%B8%82%E5%9C%BA%E5%88%9B%E6%96%B0%2CQ4.%E8%A7%84%E6%A8%A1%E5%BC%8F%E5%88%9B%E6%96%B0%2CQ2.%E9%80%89%E6%8B%A9%E6%80%A7%E6%8A%80%E6%9C%AF%2CQ1.%E7%AA%81%E7%A0%B4%E6%80%A7%E6%8A%80%E6%9C%AF&xlabel=%E6%8A%80%E6%9C%AF%2F%E4%BA%A7%E5%93%81&ylabel=%E5%B8%82%E5%9C%BA%2F%E5%AE%A2%E6%88%B7&xlow=%E6%88%90%E7%86%9F%E6%8A%80%E6%9C%AF%E4%BA%A7%E5%93%81&xhigh=%E6%96%B0%E6%8A%80%E6%9C%AF%E4%BA%A7%E5%93%81&ylow=%E4%B8%BB%E6%B5%81%E5%B8%82%E5%9C%BA&yhigh=%E6%96%B0%E5%85%B4%E5%B8%82%E5%9C%BA)](https://x-cmd.com/draw/explore?type=quadrant&title=%E4%BB%B7%E5%80%BC%E7%BD%91%E7%9F%A9%E9%98%B5%E6%A0%BC%E5%9B%BE&quadrants=Q3.%E6%96%B0%E5%B8%82%E5%9C%BA%E5%88%9B%E6%96%B0%2CQ4.%E8%A7%84%E6%A8%A1%E5%BC%8F%E5%88%9B%E6%96%B0%2CQ2.%E9%80%89%E6%8B%A9%E6%80%A7%E6%8A%80%E6%9C%AF%2CQ1.%E7%AA%81%E7%A0%B4%E6%80%A7%E6%8A%80%E6%9C%AF&xlabel=%E6%8A%80%E6%9C%AF%2F%E4%BA%A7%E5%93%81&ylabel=%E5%B8%82%E5%9C%BA%2F%E5%AE%A2%E6%88%B7&xlow=%E6%88%90%E7%86%9F%E6%8A%80%E6%9C%AF%E4%BA%A7%E5%93%81&xhigh=%E6%96%B0%E6%8A%80%E6%9C%AF%E4%BA%A7%E5%93%81&ylow=%E4%B8%BB%E6%B5%81%E5%B8%82%E5%9C%BA&yhigh=%E6%96%B0%E5%85%B4%E5%B8%82%E5%9C%BA)

**十字式**(`frame=cross`)—— 只有两条带箭头的轴在正中交叉,四个端点挂标签。
没有格子、只有轴与旁注时用这个。

```text
https://x-cmd.com/draw?type=quadrant&frame=cross&title=%E5%AE%A1%E7%BE%8E%E9%B8%BF%E6%B2%9F%E6%A8%A1%E5%9E%8B&ylabel=%E6%B3%A8%E6%84%8F%E5%8A%9B&xlabel=%E7%86%9F%E6%82%89%E5%BA%A6&ylow=%E4%B8%8D%E5%85%B3%E6%B3%A8&yhigh=%E5%85%B3%E6%B3%A8&xlow=%E9%99%8C%E7%94%9F&xhigh=%E7%86%9F%E6%82%89
```

[![十字轴](https://x-cmd.com/draw?type=quadrant&frame=cross&title=%E5%AE%A1%E7%BE%8E%E9%B8%BF%E6%B2%9F%E6%A8%A1%E5%9E%8B&ylabel=%E6%B3%A8%E6%84%8F%E5%8A%9B&xlabel=%E7%86%9F%E6%82%89%E5%BA%A6&ylow=%E4%B8%8D%E5%85%B3%E6%B3%A8&yhigh=%E5%85%B3%E6%B3%A8&xlow=%E9%99%8C%E7%94%9F&xhigh=%E7%86%9F%E6%82%89)](https://x-cmd.com/draw/explore?type=quadrant&frame=cross&title=%E5%AE%A1%E7%BE%8E%E9%B8%BF%E6%B2%9F%E6%A8%A1%E5%9E%8B&ylabel=%E6%B3%A8%E6%84%8F%E5%8A%9B&xlabel=%E7%86%9F%E6%82%89%E5%BA%A6&ylow=%E4%B8%8D%E5%85%B3%E6%B3%A8&yhigh=%E5%85%B3%E6%B3%A8&xlow=%E9%99%8C%E7%94%9F&xhigh=%E7%86%9F%E6%82%89)

---

## 参数

| 参数 | 含义 | 缺省 |
| --- | --- | --- |
| `quadrants=` | 四个象限名,逗号分隔 —— **左上、右上、左下、右下** | — |
| `quaddescs=` | 四条象限说明,逗号分隔(同序) | — |
| `quadlabels=` | 每格的并列小标签:四组用 `;` 分,组内用 `\|` 分 | — |
| `frame=` | `box`(矩阵)或 `cross`(只有轴) | 给了格子是 `box`,否则 `cross` |
| `xlabel=` / `ylabel=` | 轴标题,横排贴在正端旁 | — |
| `xlow=` / `xhigh=` | 横轴两端标签 | `低` / `高` |
| `ylow=` / `yhigh=` | 纵轴两端标签 | `低` / `高` |
| `items=` | 散点:`名称@x,y`,分号分隔;`x`/`y` 取 0..1 | — |
| `d=` | 完整 spec 的 JSON | — |
| `title=` | 图标题 | — |

格子是**可选**的:只给轴的两端标签 → 画十字式;只给 `items=` → 画轴加点。

## `d=` 形式

```json
{
  "title": "价值网矩阵格图",
  "frame": "box",
  "xlabel": "技术/产品", "ylabel": "市场/客户",
  "xlow": "成熟技术产品", "xhigh": "新技术产品",
  "ylow": "主流市场", "yhigh": "新兴市场",
  "groups": [
    { "name": "Q3.新市场创新" },
    { "name": "Q4.规模式创新" },
    { "name": "Q2.选择性技术" },
    { "name": "Q1.突破性技术" }
  ],
  "items": [{ "name": "新业务", "x": 0.82, "y": 0.86 }]
}
```

一格可以有主标签、副说明和并列的小标签:

```json
{ "name": "Q3.新市场创新", "note": "新兴市场", "labels": ["新兴市场", "早期采用者"] }
```

---

## 坑

- **象限顺序是固定的**:左上、右上、左下、右下(读图顺序)。写错不报错,只是另一张图。
- **给了格子就必须正好四格**:多一个少一个都 400;一个都不给就画十字式(只有轴)。
- **散点坐标取 0..1**(0 = 轴的低端,1 = 高端);出界的值会被夹住,不会报错。
- **轴两端默认「低/高」**:给英文读者看要自己设 `xlow`/`xhigh`/`ylow`/`yhigh`。
