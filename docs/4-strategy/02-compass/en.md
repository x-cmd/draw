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
https://x-cmd.com/draw?type=compass&title=Four%20options%20for%20a%20business%20unit&center=Core%20business&up=Invest%3A%20grow%20share&right=Hold%3A%20protect%20cash&down=Shrink%3A%20cut%20cost&left=Exit%3A%20free%20resources
```

[![Compass chart](https://x-cmd.com/draw?type=compass&title=Four%20options%20for%20a%20business%20unit&center=Core%20business&up=Invest%3A%20grow%20share&right=Hold%3A%20protect%20cash&down=Shrink%3A%20cut%20cost&left=Exit%3A%20free%20resources)](https://x-cmd.com/draw/explore?type=compass&title=Four%20options%20for%20a%20business%20unit&center=Core%20business&up=Invest%3A%20grow%20share&right=Hold%3A%20protect%20cash&down=Shrink%3A%20cut%20cost&left=Exit%3A%20free%20resources)

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
