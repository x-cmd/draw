---
x-title: Four-arrow compass — labels radiating out
x-desc: 'x-cmd/draw `type=compass` quick reference. A centre point with four labelled arrows (up / right / down / left) — the other quadrant-style decision diagram, next to the 2×2 matrix. Params: `up=`, `right=`, `down=`, `left=` (each `label` or `label:note`), `center=`, `title=`.'
x-sidebar: draw compass chart
x-keywords: compass chart, 四向箭头, draw, svg, four arrows, decision diagram
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
https://x-cmd.com/draw?type=compass&title=%E5%91%98%E5%B7%A5%E5%9F%B9%E5%85%BB%E6%A8%A1%E5%9E%8B&center=%E6%88%91&up=%E8%87%AA%E5%B7%B1%3A%E8%87%AA%E5%B1%B1%E4%BA%BA&right=%E6%88%91%E5%81%9A%3A%E5%AE%A3%E8%AE%B2%E7%9B%AE%E6%A0%87&down=%E4%BD%A0%E8%AF%B4%3A%E5%90%AC%E5%A2%99%E5%A3%81&left=%E7%8E%AF%E5%A2%83%3A%E5%A4%96%E9%83%A8%E5%BD%B1%E5%93%8D
```

[![Compass chart](https://x-cmd.com/draw?type=compass&title=%E5%91%98%E5%B7%A5%E5%9F%B9%E5%85%BB%E6%A8%A1%E5%9E%8B&center=%E6%88%91&up=%E8%87%AA%E5%B7%B1%3A%E8%87%AA%E5%B1%B1%E4%BA%BA&right=%E6%88%91%E5%81%9A%3A%E5%AE%A3%E8%AE%B2%E7%9B%AE%E6%A0%87&down=%E4%BD%A0%E8%AF%B4%3A%E5%90%AC%E5%A2%99%E5%A3%81&left=%E7%8E%AF%E5%A2%83%3A%E5%A4%96%E9%83%A8%E5%BD%B1%E5%93%8D)](https://x-cmd.com/draw/explore?type=compass&title=%E5%91%98%E5%B7%A5%E5%9F%B9%E5%85%BB%E6%A8%A1%E5%9E%8B&center=%E6%88%91&up=%E8%87%AA%E5%B7%B1%3A%E8%87%AA%E5%B1%B1%E4%BA%BA&right=%E6%88%91%E5%81%9A%3A%E5%AE%A3%E8%AE%B2%E7%9B%AE%E6%A0%87&down=%E4%BD%A0%E8%AF%B4%3A%E5%90%AC%E5%A2%99%E5%A3%81&left=%E7%8E%AF%E5%A2%83%3A%E5%A4%96%E9%83%A8%E5%BD%B1%E5%93%8D)

A centre point, four arrows radiating out (up / right / down / left), each
carrying a label. Where the quadrant chart cuts the plane into four regions,
this one sends four arrows out of a middle — same family, different shape.

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
  "title": "员工培养模型",
  "center": "我",
  "up": { "label": "自己", "note": "自山人" },
  "right": { "label": "我做", "note": "宣讲目标" },
  "down": { "label": "你说", "note": "听墙壁" },
  "left": { "label": "环境", "note": "外部影响" }
}
```

---

## Pitfalls

- **At least one direction** — an empty compass is a 400.
- **`up=自己:自山人`** — the colon separates the label from the note; a colon
  inside the label is not possible.
- **Not the same as the quadrant**: the quadrant cuts a plane into four regions
  along two axes, the compass sends four arrows out of a centre.
