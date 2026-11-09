---
x-title: 四象限图 —— 2×2 决策矩阵
x-desc: x-cmd/draw `type=quadrant` 用法速查。一族商业决策图：矩阵式(BCG、艾森豪威尔)与十字式(优先级排序)。参数：`quadrants=` 四个象限名,`quaddescs=` 四条说明(分号分隔),`quadlabels=` 每格并列的小标签,`frame=box|cross`,`xlabel=`/`ylabel=` 轴标题,`xlow=`/`xhigh=`/`ylow=`/`yhigh=` 轴两端,`items=` 散点(`名称@x,y`,0..1)。
x-sidebar: draw 四象限图
x-keywords: 四象限图, quadrant chart, draw, svg, BCG 矩阵, 艾森豪威尔矩阵, 决策矩阵, 2x2, 优先级排序
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

**矩阵式**(`frame=box`,给了格子时的缺省)—— 圆角面板里四格各一个标签,两条带箭头的轴。BCG 增长-份额矩阵:

```text
https://x-cmd.com/draw?type=quadrant&title=BCG+%E5%A2%9E%E9%95%BF-%E4%BB%BD%E9%A2%9D%E7%9F%A9%E9%98%B5&quadrants=%E9%97%AE%E9%A2%98%E4%B8%9A%E5%8A%A1%2C%E6%98%8E%E6%98%9F%E4%B8%9A%E5%8A%A1%2C%E7%98%A6%E7%8B%97%E4%B8%9A%E5%8A%A1%2C%E7%8E%B0%E9%87%91%E7%89%9B&quaddescs=%E9%AB%98%E5%A2%9E%E9%95%BF+%C2%B7+%E4%BD%8E%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E8%A6%81%E4%B9%88%E6%8A%95%E9%92%B1%E7%BF%BB%E7%9B%98%2C%E8%A6%81%E4%B9%88%E5%8F%8A%E6%97%B6%E6%AD%A2%E6%8D%9F%3B%E9%AB%98%E5%A2%9E%E9%95%BF+%C2%B7+%E9%AB%98%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E5%8A%A0%E6%8A%95%E8%B5%84%E6%BA%90%E5%AE%88%E4%BD%8F%E4%BB%BD%E9%A2%9D%3B%E4%BD%8E%E5%A2%9E%E9%95%BF+%C2%B7+%E4%BD%8E%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E6%94%B6%E7%BC%A9%E6%88%96%E5%89%A5%E7%A6%BB%2C%E5%88%AB%E5%86%8D%E6%8A%95%E9%92%B1%3B%E4%BD%8E%E5%A2%9E%E9%95%BF+%C2%B7+%E9%AB%98%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E6%94%B6%E5%89%B2%E7%8E%B0%E9%87%91%2C%E5%8F%8D%E5%93%BA%E4%B8%BB%E4%B8%9A&xlabel=%E7%9B%B8%E5%AF%B9%E5%B8%82%E5%9C%BA%E4%BB%BD%E9%A2%9D&ylabel=%E5%B8%82%E5%9C%BA%E5%A2%9E%E9%95%BF%E7%8E%87&xlow=%E4%BD%8E&xhigh=%E9%AB%98&ylow=%E4%BD%8E&yhigh=%E9%AB%98
```

[![BCG 矩阵](https://x-cmd.com/draw?type=quadrant&title=BCG+%E5%A2%9E%E9%95%BF-%E4%BB%BD%E9%A2%9D%E7%9F%A9%E9%98%B5&quadrants=%E9%97%AE%E9%A2%98%E4%B8%9A%E5%8A%A1%2C%E6%98%8E%E6%98%9F%E4%B8%9A%E5%8A%A1%2C%E7%98%A6%E7%8B%97%E4%B8%9A%E5%8A%A1%2C%E7%8E%B0%E9%87%91%E7%89%9B&quaddescs=%E9%AB%98%E5%A2%9E%E9%95%BF+%C2%B7+%E4%BD%8E%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E8%A6%81%E4%B9%88%E6%8A%95%E9%92%B1%E7%BF%BB%E7%9B%98%2C%E8%A6%81%E4%B9%88%E5%8F%8A%E6%97%B6%E6%AD%A2%E6%8D%9F%3B%E9%AB%98%E5%A2%9E%E9%95%BF+%C2%B7+%E9%AB%98%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E5%8A%A0%E6%8A%95%E8%B5%84%E6%BA%90%E5%AE%88%E4%BD%8F%E4%BB%BD%E9%A2%9D%3B%E4%BD%8E%E5%A2%9E%E9%95%BF+%C2%B7+%E4%BD%8E%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E6%94%B6%E7%BC%A9%E6%88%96%E5%89%A5%E7%A6%BB%2C%E5%88%AB%E5%86%8D%E6%8A%95%E9%92%B1%3B%E4%BD%8E%E5%A2%9E%E9%95%BF+%C2%B7+%E9%AB%98%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E6%94%B6%E5%89%B2%E7%8E%B0%E9%87%91%2C%E5%8F%8D%E5%93%BA%E4%B8%BB%E4%B8%9A&xlabel=%E7%9B%B8%E5%AF%B9%E5%B8%82%E5%9C%BA%E4%BB%BD%E9%A2%9D&ylabel=%E5%B8%82%E5%9C%BA%E5%A2%9E%E9%95%BF%E7%8E%87&xlow=%E4%BD%8E&xhigh=%E9%AB%98&ylow=%E4%BD%8E&yhigh=%E9%AB%98)](https://x-cmd.com/draw/explore?type=quadrant&title=BCG+%E5%A2%9E%E9%95%BF-%E4%BB%BD%E9%A2%9D%E7%9F%A9%E9%98%B5&quadrants=%E9%97%AE%E9%A2%98%E4%B8%9A%E5%8A%A1%2C%E6%98%8E%E6%98%9F%E4%B8%9A%E5%8A%A1%2C%E7%98%A6%E7%8B%97%E4%B8%9A%E5%8A%A1%2C%E7%8E%B0%E9%87%91%E7%89%9B&quaddescs=%E9%AB%98%E5%A2%9E%E9%95%BF+%C2%B7+%E4%BD%8E%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E8%A6%81%E4%B9%88%E6%8A%95%E9%92%B1%E7%BF%BB%E7%9B%98%2C%E8%A6%81%E4%B9%88%E5%8F%8A%E6%97%B6%E6%AD%A2%E6%8D%9F%3B%E9%AB%98%E5%A2%9E%E9%95%BF+%C2%B7+%E9%AB%98%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E5%8A%A0%E6%8A%95%E8%B5%84%E6%BA%90%E5%AE%88%E4%BD%8F%E4%BB%BD%E9%A2%9D%3B%E4%BD%8E%E5%A2%9E%E9%95%BF+%C2%B7+%E4%BD%8E%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E6%94%B6%E7%BC%A9%E6%88%96%E5%89%A5%E7%A6%BB%2C%E5%88%AB%E5%86%8D%E6%8A%95%E9%92%B1%3B%E4%BD%8E%E5%A2%9E%E9%95%BF+%C2%B7+%E9%AB%98%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E6%94%B6%E5%89%B2%E7%8E%B0%E9%87%91%2C%E5%8F%8D%E5%93%BA%E4%B8%BB%E4%B8%9A&xlabel=%E7%9B%B8%E5%AF%B9%E5%B8%82%E5%9C%BA%E4%BB%BD%E9%A2%9D&ylabel=%E5%B8%82%E5%9C%BA%E5%A2%9E%E9%95%BF%E7%8E%87&xlow=%E4%BD%8E&xhigh=%E9%AB%98&ylow=%E4%BD%8E&yhigh=%E9%AB%98)

艾森豪威尔 重要-紧急矩阵:

```text
https://x-cmd.com/draw?type=quadrant&title=%E8%89%BE%E6%A3%AE%E8%B1%AA%E5%A8%81%E5%B0%94+%E9%87%8D%E8%A6%81-%E7%B4%A7%E6%80%A5%E7%9F%A9%E9%98%B5&quadrants=%E7%AB%8B%E5%8D%B3%E5%A4%84%E7%90%86%2C%E9%87%8D%E7%82%B9%E6%8A%95%E5%85%A5%2C%E5%A7%94%E6%89%98%E4%BB%96%E4%BA%BA%2C%E8%AE%A1%E5%88%92%E5%AE%89%E6%8E%92&quaddescs=%E9%87%8D%E8%A6%81%E4%B8%8D%E7%B4%A7%E6%80%A5+%E2%80%94%E2%80%94+%E6%8E%92%E8%BF%9B%E6%97%A5%E7%A8%8B%2C%E5%9B%BA%E5%AE%9A%E6%97%B6%E9%97%B4%E5%81%9A%3B%E9%87%8D%E8%A6%81%E4%B8%94%E7%B4%A7%E6%80%A5+%E2%80%94%E2%80%94+%E9%A9%AC%E4%B8%8A%E5%81%9A%2C%E7%BB%99%E8%B6%B3%E8%B5%84%E6%BA%90%3B%E7%B4%A7%E6%80%A5%E4%B8%8D%E9%87%8D%E8%A6%81+%E2%80%94%E2%80%94+%E6%8E%88%E6%9D%83%E4%B8%8B%E5%B1%9E%2C%E6%88%96%E6%89%B9%E6%88%90%E6%B5%81%E7%A8%8B%3B%E9%83%BD%E4%B8%8D%E7%B4%A7%E6%80%A5+%E2%80%94%E2%80%94+%E5%B0%91%E5%81%9A%2C%E5%AE%9A%E6%9C%9F%E5%9B%9E%E9%A1%BE&xlabel=%E9%87%8D%E8%A6%81%E7%A8%8B%E5%BA%A6&ylabel=%E7%B4%A7%E6%80%A5%E7%A8%8B%E5%BA%A6&xlow=%E4%BD%8E&xhigh=%E9%AB%98&ylow=%E4%BD%8E&yhigh=%E9%AB%98
```

[![艾森豪威尔矩阵](https://x-cmd.com/draw?type=quadrant&title=%E8%89%BE%E6%A3%AE%E8%B1%AA%E5%A8%81%E5%B0%94+%E9%87%8D%E8%A6%81-%E7%B4%A7%E6%80%A5%E7%9F%A9%E9%98%B5&quadrants=%E7%AB%8B%E5%8D%B3%E5%A4%84%E7%90%86%2C%E9%87%8D%E7%82%B9%E6%8A%95%E5%85%A5%2C%E5%A7%94%E6%89%98%E4%BB%96%E4%BA%BA%2C%E8%AE%A1%E5%88%92%E5%AE%89%E6%8E%92&quaddescs=%E9%87%8D%E8%A6%81%E4%B8%8D%E7%B4%A7%E6%80%A5+%E2%80%94%E2%80%94+%E6%8E%92%E8%BF%9B%E6%97%A5%E7%A8%8B%2C%E5%9B%BA%E5%AE%9A%E6%97%B6%E9%97%B4%E5%81%9A%3B%E9%87%8D%E8%A6%81%E4%B8%94%E7%B4%A7%E6%80%A5+%E2%80%94%E2%80%94+%E9%A9%AC%E4%B8%8A%E5%81%9A%2C%E7%BB%99%E8%B6%B3%E8%B5%84%E6%BA%90%3B%E7%B4%A7%E6%80%A5%E4%B8%8D%E9%87%8D%E8%A6%81+%E2%80%94%E2%80%94+%E6%8E%88%E6%9D%83%E4%B8%8B%E5%B1%9E%2C%E6%88%96%E6%89%B9%E6%88%90%E6%B5%81%E7%A8%8B%3B%E9%83%BD%E4%B8%8D%E7%B4%A7%E6%80%A5+%E2%80%94%E2%80%94+%E5%B0%91%E5%81%9A%2C%E5%AE%9A%E6%9C%9F%E5%9B%9E%E9%A1%BE&xlabel=%E9%87%8D%E8%A6%81%E7%A8%8B%E5%BA%A6&ylabel=%E7%B4%A7%E6%80%A5%E7%A8%8B%E5%BA%A6&xlow=%E4%BD%8E&xhigh=%E9%AB%98&ylow=%E4%BD%8E&yhigh=%E9%AB%98)](https://x-cmd.com/draw/explore?type=quadrant&title=%E8%89%BE%E6%A3%AE%E8%B1%AA%E5%A8%81%E5%B0%94+%E9%87%8D%E8%A6%81-%E7%B4%A7%E6%80%A5%E7%9F%A9%E9%98%B5&quadrants=%E7%AB%8B%E5%8D%B3%E5%A4%84%E7%90%86%2C%E9%87%8D%E7%82%B9%E6%8A%95%E5%85%A5%2C%E5%A7%94%E6%89%98%E4%BB%96%E4%BA%BA%2C%E8%AE%A1%E5%88%92%E5%AE%89%E6%8E%92&quaddescs=%E9%87%8D%E8%A6%81%E4%B8%8D%E7%B4%A7%E6%80%A5+%E2%80%94%E2%80%94+%E6%8E%92%E8%BF%9B%E6%97%A5%E7%A8%8B%2C%E5%9B%BA%E5%AE%9A%E6%97%B6%E9%97%B4%E5%81%9A%3B%E9%87%8D%E8%A6%81%E4%B8%94%E7%B4%A7%E6%80%A5+%E2%80%94%E2%80%94+%E9%A9%AC%E4%B8%8A%E5%81%9A%2C%E7%BB%99%E8%B6%B3%E8%B5%84%E6%BA%90%3B%E7%B4%A7%E6%80%A5%E4%B8%8D%E9%87%8D%E8%A6%81+%E2%80%94%E2%80%94+%E6%8E%88%E6%9D%83%E4%B8%8B%E5%B1%9E%2C%E6%88%96%E6%89%B9%E6%88%90%E6%B5%81%E7%A8%8B%3B%E9%83%BD%E4%B8%8D%E7%B4%A7%E6%80%A5+%E2%80%94%E2%80%94+%E5%B0%91%E5%81%9A%2C%E5%AE%9A%E6%9C%9F%E5%9B%9E%E9%A1%BE&xlabel=%E9%87%8D%E8%A6%81%E7%A8%8B%E5%BA%A6&ylabel=%E7%B4%A7%E6%80%A5%E7%A8%8B%E5%BA%A6&xlow=%E4%BD%8E&xhigh=%E9%AB%98&ylow=%E4%BD%8E&yhigh=%E9%AB%98)

**十字式**(`frame=cross`)—— 只有两条带箭头的轴在正中交叉、标签挂四端,点按坐标落位。
没有格子、只有轴与散点时用这个,比如按成本与战略价值给举措排优先级:

```text
https://x-cmd.com/draw?type=quadrant&frame=cross&title=%E6%88%98%E7%95%A5%E4%B8%BE%E6%8E%AA%E4%BC%98%E5%85%88%E7%BA%A7&ylabel=%E6%88%98%E7%95%A5%E4%BB%B7%E5%80%BC&xlabel=%E6%8A%95%E5%85%A5%E6%88%90%E6%9C%AC&ylow=%E4%BD%8E&yhigh=%E9%AB%98&xlow=%E4%BD%8E&xhigh=%E9%AB%98&items=%E5%B9%B3%E5%8F%B0%E9%87%8D%E6%9E%84%400.22%2C0.86%3BAI+%E5%AE%A2%E6%9C%8D%400.42%2C0.62%3B%E6%B8%A0%E9%81%93%E5%90%88%E4%BD%9C%400.72%2C0.44%3B%E5%93%81%E7%89%8C%E6%8A%95%E6%94%BE%400.84%2C0.26
```

[![优先级排序](https://x-cmd.com/draw?type=quadrant&frame=cross&title=%E6%88%98%E7%95%A5%E4%B8%BE%E6%8E%AA%E4%BC%98%E5%85%88%E7%BA%A7&ylabel=%E6%88%98%E7%95%A5%E4%BB%B7%E5%80%BC&xlabel=%E6%8A%95%E5%85%A5%E6%88%90%E6%9C%AC&ylow=%E4%BD%8E&yhigh=%E9%AB%98&xlow=%E4%BD%8E&xhigh=%E9%AB%98&items=%E5%B9%B3%E5%8F%B0%E9%87%8D%E6%9E%84%400.22%2C0.86%3BAI+%E5%AE%A2%E6%9C%8D%400.42%2C0.62%3B%E6%B8%A0%E9%81%93%E5%90%88%E4%BD%9C%400.72%2C0.44%3B%E5%93%81%E7%89%8C%E6%8A%95%E6%94%BE%400.84%2C0.26)](https://x-cmd.com/draw/explore?type=quadrant&frame=cross&title=%E6%88%98%E7%95%A5%E4%B8%BE%E6%8E%AA%E4%BC%98%E5%85%88%E7%BA%A7&ylabel=%E6%88%98%E7%95%A5%E4%BB%B7%E5%80%BC&xlabel=%E6%8A%95%E5%85%A5%E6%88%90%E6%9C%AC&ylow=%E4%BD%8E&yhigh=%E9%AB%98&xlow=%E4%BD%8E&xhigh=%E9%AB%98&items=%E5%B9%B3%E5%8F%B0%E9%87%8D%E6%9E%84%400.22%2C0.86%3BAI+%E5%AE%A2%E6%9C%8D%400.42%2C0.62%3B%E6%B8%A0%E9%81%93%E5%90%88%E4%BD%9C%400.72%2C0.44%3B%E5%93%81%E7%89%8C%E6%8A%95%E6%94%BE%400.84%2C0.26)

---

## 参数

| 参数 | 含义 | 缺省 |
| --- | --- | --- |
| `quadrants=` | 四个象限名,逗号分隔 —— **左上、右上、左下、右下** | — |
| `quaddescs=` | 四条象限说明,**分号**分隔(同序) | — |
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
  "title": "BCG 增长-份额矩阵",
  "xlabel": "相对市场份额", "ylabel": "市场增长率",
  "xlow": "低", "xhigh": "高", "ylow": "低", "yhigh": "高",
  "groups": [
    { "name": "问题业务", "note": "高增长 · 低份额 —— 要么投钱翻盘,要么及时止损" },
    { "name": "明星业务", "note": "高增长 · 高份额 —— 加投资源守住份额" },
    { "name": "瘦狗业务", "note": "低增长 · 低份额 —— 收缩或剥离,别再投钱" },
    { "name": "现金牛", "note": "低增长 · 高份额 —— 收割现金,反哺主业" }
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
- **`quaddescs=` 用分号分隔**:说明里常有逗号,逗号留给象限名。
- **散点坐标取 0..1**(0 = 轴的低端,1 = 高端);出界的值会被夹住,不会报错。
- **轴两端默认「低/高」**:给英文读者看要自己设 `xlow`/`xhigh`/`ylow`/`yhigh`。
