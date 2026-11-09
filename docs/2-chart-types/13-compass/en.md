---
x-title: Four-arrow compass — labels radiating out
x-desc: 'x-cmd/draw `type=compass` quick reference. A centre point with four labelled arrows (up / right / down / left) — the other quadrant-style business diagram, next to the 2×2 matrix. Params: `up=`, `right=`, `down=`, `left=` (each `label` or `label:note`), `center=`, `title=`.'
x-sidebar: draw compass chart
x-keywords: compass chart, 四向箭头, draw, svg, four arrows, business decision
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw compass chart'
      inLanguage: 'en'
      about: 'x-cmd/draw compass chart'
---

# Four-arrow compass — labels radiating out

```text
https://x-cmd.com/draw?type=compass&title=%E4%B8%9A%E5%8A%A1%E5%8D%95%E5%85%83%E7%9A%84%E5%9B%9B%E4%B8%AA%E9%80%89%E9%A1%B9&center=%E6%A0%B8%E5%BF%83%E4%B8%9A%E5%8A%A1&up=%E5%8A%A0%E5%A4%A7%E6%8A%95%E5%85%A5%3A%E6%8A%A2%E4%BB%BD%E9%A2%9D&right=%E7%BB%B4%E6%8C%81%E7%8E%B0%E7%8A%B6%3A%E5%AE%88%E7%8E%B0%E9%87%91%E6%B5%81&down=%E6%94%B6%E7%BC%A9%E8%A7%84%E6%A8%A1%3A%E9%99%8D%E6%88%90%E6%9C%AC&left=%E9%80%80%E5%87%BA%E5%B8%82%E5%9C%BA%3A%E8%85%BE%E8%B5%84%E6%BA%90
```

[![Compass chart](https://x-cmd.com/draw?type=compass&title=%E4%B8%9A%E5%8A%A1%E5%8D%95%E5%85%83%E7%9A%84%E5%9B%9B%E4%B8%AA%E9%80%89%E9%A1%B9&center=%E6%A0%B8%E5%BF%83%E4%B8%9A%E5%8A%A1&up=%E5%8A%A0%E5%A4%A7%E6%8A%95%E5%85%A5%3A%E6%8A%A2%E4%BB%BD%E9%A2%9D&right=%E7%BB%B4%E6%8C%81%E7%8E%B0%E7%8A%B6%3A%E5%AE%88%E7%8E%B0%E9%87%91%E6%B5%81&down=%E6%94%B6%E7%BC%A9%E8%A7%84%E6%A8%A1%3A%E9%99%8D%E6%88%90%E6%9C%AC&left=%E9%80%80%E5%87%BA%E5%B8%82%E5%9C%BA%3A%E8%85%BE%E8%B5%84%E6%BA%90)](https://x-cmd.com/draw/explore?type=compass&title=%E4%B8%9A%E5%8A%A1%E5%8D%95%E5%85%83%E7%9A%84%E5%9B%9B%E4%B8%AA%E9%80%89%E9%A1%B9&center=%E6%A0%B8%E5%BF%83%E4%B8%9A%E5%8A%A1&up=%E5%8A%A0%E5%A4%A7%E6%8A%95%E5%85%A5%3A%E6%8A%A2%E4%BB%BD%E9%A2%9D&right=%E7%BB%B4%E6%8C%81%E7%8E%B0%E7%8A%B6%3A%E5%AE%88%E7%8E%B0%E9%87%91%E6%B5%81&down=%E6%94%B6%E7%BC%A9%E8%A7%84%E6%A8%A1%3A%E9%99%8D%E6%88%90%E6%9C%AC&left=%E9%80%80%E5%87%BA%E5%B8%82%E5%9C%BA%3A%E8%85%BE%E8%B5%84%E6%BA%90)

A centre point, four arrows radiating out (up / right / down / left), each
carrying a label. Where the quadrant chart cuts the plane into four regions,
this one sends four arrows out of a middle — same family, different shape.

A business use: the four options for a business unit (invest, hold, shrink,
exit) with the unit itself in the middle.

---

## Parameters

| param | meaning | default |
| --- | --- | --- |
| `up=` / `right=` / `down=` / `left=` | the label of that direction; `label:note` for a second line | — |
| `center=` | the word in the middle | — |
| `title=` | chart title | — |
| `d=` | the whole spec as JSON | — |

Directions with no content are simply not drawn.

## The `d=` form

```json
{
  "title": "业务单元的四个选项",
  "center": "核心业务",
  "up": { "label": "加大投入", "note": "抢份额" },
  "right": { "label": "维持现状", "note": "守现金流" },
  "down": { "label": "收缩规模", "note": "降成本" },
  "left": { "label": "退出市场", "note": "腾资源" }
}
```

---

## Pitfalls

- **At least one direction** — an empty compass is a 400.
- **`up=Self:from within`** — the colon separates the label from the note; a colon
  inside the label is not possible.
- **Not the same as the quadrant**: the quadrant cuts a plane into four regions
  along two axes, the compass sends four arrows out of a centre.
