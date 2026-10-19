---
x-title: gauge dial — single-value monitoring
x-desc: x-cmd/draw `type=gauge` quick reference. Single-value monitoring (CPU / memory / progress / completion rate). Params: `value=` current value, `max=` max (default 100), `label=` gauge name, `t=` style.
x-sidebar: draw gauge dial
x-keywords: gauge, gauge dial, draw, svg, single-value monitoring
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw gauge dial'
      inLanguage: 'en'
      about: 'x-cmd/draw gauge dial'
---

# gauge dial — single-value monitoring

Single-value "progress dial". **Typical use**: CPU / memory / SLA / completion rate / current vs target.

---

## Parameters

| param | meaning | default |
| --- | --- | --- |
| `value=` | current value | ✓ |
| `max=` | max (full scale) | 100 |
| `label=` | gauge name | — |
| `t=` | style (default has color change) | — |
| `unit=` | unit | — |

---

## Examples

```sh
# CPU usage
curl "https://x-cmd.com/draw?type=gauge&value=72&max=100&label=CPU%25&title=Server%20load"

# Memory
curl "https://x-cmd.com/draw?type=gauge&value=4.2&max=8&label=Memory%20(GB)&title=Memory%20usage"

# Progress
curl "https://x-cmd.com/draw?type=gauge&value=340&max=500&label=Tickets%20resolved&title=Sprint%20progress"

# SLA
curl "https://x-cmd.com/draw?type=gauge&value=99.95&max=100&label=SLA%25&unit=%25"
```

---

## Pitfalls

- **One gauge per chart**: don't draw multiple; use [9-combo](9-combo) or [4-line](4-line) for multiple values
- **`max` not too small**: pointer pegged at max loses precision
- **Dark theme**: gauge color change is more visible in dark mode