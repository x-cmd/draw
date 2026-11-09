---
x-title: 四象限图 —— 2×2 决策矩阵
x-desc: x-cmd/draw `type=quadrant` 用法速查。2×2 矩阵决策图：艾森豪威尔矩阵 / BCG 矩阵 / Atlassian 4Ls 回顾。参数：`quadrants=` 四个象限名（左上、右上、左下、右下），`quaddescs=` 四条说明，`xlabel=`/`ylabel=` 轴标题，`xlow=`/`xhigh=`/`ylow=`/`yhigh=` 轴两端，`items=` 散点（`名称@x,y`，0..1）。
x-sidebar: draw 四象限图
x-keywords: 四象限图, quadrant chart, draw, svg, 艾森豪威尔矩阵, BCG 矩阵, 决策矩阵, 2x2
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 四象限图'
      inLanguage: 'zh-CN'
      about: 'x-cmd/draw 四象限图'
---

# 四象限图 —— 2×2 决策矩阵

## 示例（URL 即所得，点击图片进入交互页）

**四格 + 说明 + 散点**

```text
https://x-cmd.com/draw?type=quadrant&title=%E5%9B%9B%E8%B1%A1%E9%99%90%E5%86%B3%E7%AD%96&quadrants=%E5%BF%AB%E8%B5%A2%2C%E6%88%98%E7%95%A5%2C%E5%A1%AB%E5%9D%91%2C%E6%94%BE%E5%BC%83&quaddescs=%E5%BF%AB%E9%80%9F%E5%BD%93%E4%B8%8B%2C%E9%95%BF%E6%9C%9F%E6%8A%95%E5%85%A5%2C%E8%A1%A5%E5%8D%95%2C%E6%97%A0%E5%90%88%E8%A1%8C&xlabel=%E6%8A%95%E5%85%A5&ylabel=%E5%9B%9E%E6%8A%A5&items=%E6%96%B0%E4%B8%9A%E5%8A%A1%400.82%2C0.86%3BAI+%E8%B0%83%E6%9F%A5%400.74%2C0.68%3B%E6%97%A7%E7%B3%BB%E7%BB%9F%400.22%2C0.28%3B%E5%85%AC%E5%8F%B8%E6%94%BF%E7%AD%96%400.18%2C0.74
```

[![四象限图](https://x-cmd.com/draw?type=quadrant&title=%E5%9B%9B%E8%B1%A1%E9%99%90%E5%86%B3%E7%AD%96&quadrants=%E5%BF%AB%E8%B5%A2%2C%E6%88%98%E7%95%A5%2C%E5%A1%AB%E5%9D%91%2C%E6%94%BE%E5%BC%83&quaddescs=%E5%BF%AB%E9%80%9F%E5%BD%93%E4%B8%8B%2C%E9%95%BF%E6%9C%9F%E6%8A%95%E5%85%A5%2C%E8%A1%A5%E5%8D%95%2C%E6%97%A0%E5%90%88%E8%A1%8C&xlabel=%E6%8A%95%E5%85%A5&ylabel=%E5%9B%9E%E6%8A%A5&items=%E6%96%B0%E4%B8%9A%E5%8A%A1%400.82%2C0.86%3BAI+%E8%B0%83%E6%9F%A5%400.74%2C0.68%3B%E6%97%A7%E7%B3%BB%E7%BB%9F%400.22%2C0.28%3B%E5%85%AC%E5%8F%B8%E6%94%BF%E7%AD%96%400.18%2C0.74)](https://x-cmd.com/draw/explore?type=quadrant&title=%E5%9B%9B%E8%B1%A1%E9%99%90%E5%86%B3%E7%AD%96&quadrants=%E5%BF%AB%E8%B5%A2%2C%E6%88%98%E7%95%A5%2C%E5%A1%AB%E5%9D%91%2C%E6%94%BE%E5%BC%83&quaddescs=%E5%BF%AB%E9%80%9F%E5%BD%93%E4%B8%8B%2C%E9%95%BF%E6%9C%9F%E6%8A%95%E5%85%A5%2C%E8%A1%A5%E5%8D%95%2C%E6%97%A0%E5%90%88%E8%A1%8C&xlabel=%E6%8A%95%E5%85%A5&ylabel=%E5%9B%9E%E6%8A%A5&items=%E6%96%B0%E4%B8%9A%E5%8A%A1%400.82%2C0.86%3BAI+%E8%B0%83%E6%9F%A5%400.74%2C0.68%3B%E6%97%A7%E7%B3%BB%E7%BB%9F%400.22%2C0.28%3B%E5%85%AC%E5%8F%B8%E6%94%BF%E7%AD%96%400.18%2C0.74)

两轴各分高低、四格各一个名称（可带说明）、点按坐标落在格内 ——
艾森豪威尔矩阵、BCG 矩阵、Atlassian 4Ls 回顾都长这样。

---

## 参数

| 参数 | 含义 | 缺省 |
| --- | --- | --- |
| `quadrants=` | 四个象限名，逗号分隔 —— **左上、右上、左下、右下**（必填） | — |
| `quaddescs=` | 四条象限说明，逗号分隔（同序） | — |
| `xlabel=` / `ylabel=` | 轴标题 | — |
| `xlow=` / `xhigh=` | 横轴两端标签 | `低` / `高` |
| `ylow=` / `yhigh=` | 纵轴两端标签 | `低` / `高` |
| `items=` | 散点：`名称@x,y`，分号分隔；`x`/`y` 取 0..1 | — |
| `d=` | 完整 spec 的 JSON | — |
| `title=` | 图标题 | — |

## `d=` 形式

```json
{
  "title": "四象限决策",
  "xlabel": "投入",
  "ylabel": "回报",
  "xlow": "低", "xhigh": "高", "ylow": "低", "yhigh": "高",
  "quadrants": [
    { "name": "快赢", "desc": "快速当下" },
    { "name": "战略", "desc": "长期投入" },
    { "name": "填坑", "desc": "补单" },
    { "name": "放弃", "desc": "无合行" }
  ],
  "items": [{ "name": "新业务", "x": 0.82, "y": 0.86 }]
}
```

---

## 坑

- **象限顺序是固定的**：左上、右上、左下、右下（读图顺序）。写错不报错，只是另一张图。
- **必须正好四格**：多一个少一个都 400，不做静默截断。
- **散点坐标取 0..1**（0 = 轴的低端，1 = 高端）；出界会夹住，不报错。
- **轴两端默认「低/高」**：给英文读者看要自己设 `xlow`/`xhigh`/`ylow`/`yhigh`。
