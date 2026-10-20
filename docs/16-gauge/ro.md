---
x-title: gauge indicator — x-cmd/draw
x-desc: Grafice SVG pentru era AI: un singur endpoint `/draw?type=. type=gauge.
x-sidebar: draw
x-keywords: draw, gauge, indicator, svg, chart
---

# gauge indicator

`GET /draw?type=gauge&...` — randează un grafic

## Exemple

**base**

```text
https://x-cmd.com/draw?type=gauge&title=Rat%C4%83%20CI&value=87&max=100
```

![gauge base](https://x-cmd.com/draw?type=gauge&title=Rat%C4%83%20CI&value=87&max=100)

**gradient**

```text
https://x-cmd.com/draw?type=gauge&t=gradient&title=Rat%C4%83%20CI&value=87&max=100
```

![gauge gradient](https://x-cmd.com/draw?type=gauge&t=gradient&title=Rat%C4%83%20CI&value=87&max=100)

**reliability**

```text
https://x-cmd.com/draw?type=gauge&t=reliability&title=Rat%C4%83%20CI&value=99.9&max=100
```

![gauge reliability](https://x-cmd.com/draw?type=gauge&t=reliability&title=Rat%C4%83%20CI&value=99.9&max=100)

## Parametri

| Parametri | | |
|---|---|---|
| `value=` | valoarea curentă | ✓ |
| `max=` | maxim (implicit 100) | ✗ |
| `labels=` | etichetele inelelor (multi-inel) | ✗ |
| `values=` | valorile inelelor (procente) | ✗ |
| `title=` | titlu | ✗ |
| `t=` | familia stilului | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `gradient` |
| `reliability` |

## Capcane

- o valoare per grafic; mai multe → combo/line
- codează spațiile din titlu ca `%20`
