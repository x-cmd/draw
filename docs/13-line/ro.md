---
x-title: line linie — x-cmd/draw
x-desc: Grafice SVG pentru era AI: un singur endpoint `/draw?type=. type=line.
x-sidebar: draw
x-keywords: draw, line, linie, svg, chart
---

# line linie

`GET /draw?type=line&...` — randează un grafic

## Exemple

**shadcn**

```text
https://x-cmd.com/draw?type=line&labels=Ian,Feb,Mar,Apr,Mai,Iun&values=12,19,15,25,22,30&title=Stele%20pe%20limbaj
```

![line shadcn](https://x-cmd.com/draw?type=line&labels=Ian,Feb,Mar,Apr,Mai,Iun&values=12,19,15,25,22,30&title=Stele%20pe%20limbaj)

**evil**

```text
https://x-cmd.com/draw?type=line&t=evil&labels=Ian,Feb,Mar,Apr,Mai,Iun&series=Desc%C4%83rc%C4%83ri:12,19,15,25,22,30&series=CI:8,11,9,14,12,10
```

![line evil](https://x-cmd.com/draw?type=line&t=evil&labels=Ian,Feb,Mar,Apr,Mai,Iun&series=Desc%C4%83rc%C4%83ri:12,19,15,25,22,30&series=CI:8,11,9,14,12,10)

**evil-glow**

```text
https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=Cre%C8%99tere
```

![line evil-glow](https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=Cre%C8%99tere)

**opendata**

```text
https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=Desc%C4%83rc%C4%83ri
```

![line opendata](https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=Desc%C4%83rc%C4%83ri)

## Parametri

| Parametri | | |
|---|---|---|
| `labels=` | etichete, separate prin virgule | ✓ |
| `values=` | valori, separate prin virgule | ✓ |
| `series=` | serii `nume:valori`, repetabile | ✗ |
| `title=` | titlu | ✗ |
| `t=` | familia stilului | ✗ |

## `t=`

| | |
|---|---|
| `shadcn` |
| `evil` |
| `evil-glow` |
| `evil-mono` |
| `opendata` |

## Capcane

- ≤60 puncte; la mai multe linii se marchează doar vârful fiecăreia
- codează spațiile din titlu ca `%20`
