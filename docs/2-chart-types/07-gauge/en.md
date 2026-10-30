---
x-title: gauge dial — single-value monitoring
x-desc: 'x-cmd/draw `type=gauge` quick reference. Single-value monitoring (CPU / memory / progress / completion rate). Params: `value=` current value, `max=` max (default 100), `label=` gauge name, `t=` style.'
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

## Examples (what you see is what the URL gives; click to enlarge)

**CPU usage**

```text
https://x-cmd.com/draw?type=gauge&value=72&max=100&label=CPU%25&title=Server%20load
```

![CPU usage](https://x-cmd.com/draw?type=gauge&value=72&max=100&label=CPU%25&title=Server%20load)

**Memory**

```text
https://x-cmd.com/draw?type=gauge&value=4.2&max=8&label=Memory%20(GB)&title=Memory%20usage
```

![Memory](https://x-cmd.com/draw?type=gauge&value=4.2&max=8&label=Memory%20(GB)&title=Memory%20usage)

**Progress**

```text
https://x-cmd.com/draw?type=gauge&value=340&max=500&label=Tickets%20resolved&title=Sprint
```

![Progress](https://x-cmd.com/draw?type=gauge&value=340&max=500&label=Tickets%20resolved&title=Sprint)

**SLA**

```text
https://x-cmd.com/draw?type=gauge&value=99.95&max=100&label=SLA%25&unit=%25
```

![SLA](https://x-cmd.com/draw?type=gauge&value=99.95&max=100&label=SLA%25&unit=%25)

**Multi-ring (labels+values)**

```text
https://x-cmd.com/draw?type=gauge&labels=cpu,mem,io&values=72,58,40&max=100&title=Node%20health
```

![Multi-ring (labels+values)](https://x-cmd.com/draw?type=gauge&labels=cpu,mem,io&values=72,58,40&max=100&title=Node%20health)

**Gradient (t=gradient)**

```text
https://x-cmd.com/draw?type=gauge&t=gradient&title=CI%20pass%20rate&value=87&max=100
```

![Gradient (t=gradient)](https://x-cmd.com/draw?type=gauge&t=gradient&title=CI%20pass%20rate&value=87&max=100)

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



---

## Pitfalls

- **One gauge per chart**: don't draw multiple; use [18-combo](../09-combo/en.md) or [13-line](../04-line/en.md) for multiple values
- **`max` not too small**: pointer pegged at max loses precision
- **Dark theme**: gauge color change is more visible in dark mode