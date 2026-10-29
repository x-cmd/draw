---
x-title: line linea — x-cmd/draw
x-desc: Grafici SVG per l’era dell’IA: un solo endpoint `/draw?type=. type=line.
x-sidebar: draw
x-keywords: draw, line, linea, svg, chart
---

# line linea

`GET /draw?type=line&...` — renderizzare un grafico

## Esempi

**shadcn**

```text
https://x-cmd.com/draw?type=line&labels=Gen,Feb,Mar,Apr,Mag,Giu&values=12,19,15,25,22,30&title=Stelle%20per%20linguaggio
```

![line shadcn](https://x-cmd.com/draw?type=line&labels=Gen,Feb,Mar,Apr,Mag,Giu&values=12,19,15,25,22,30&title=Stelle%20per%20linguaggio)

**evil**

```text
https://x-cmd.com/draw?type=line&t=evil&labels=Gen,Feb,Mar,Apr,Mag,Giu&series=Download:12,19,15,25,22,30&series=CI:8,11,9,14,12,10
```

![line evil](https://x-cmd.com/draw?type=line&t=evil&labels=Gen,Feb,Mar,Apr,Mag,Giu&series=Download:12,19,15,25,22,30&series=CI:8,11,9,14,12,10)

**evil-glow**

```text
https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=Crescita
```

![line evil-glow](https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=Crescita)

**opendata**

```text
https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=Download
```

![line opendata](https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=Download)

## Parametri

| Parametri | | |
|---|---|---|
| `labels=` | etichette, separate da virgole | ✓ |
| `values=` | valori, separati da virgole | ✓ |
| `series=` | serie `nome:valori`, ripetibile | ✗ |
| `title=` | titolo | ✗ |
| `t=` | famiglia di stile | ✗ |

## `t=`

| | |
|---|---|
| `shadcn` |
| `evil` |
| `evil-glow` |
| `evil-mono` |
| `opendata` |

## Insidie

- ≤60 punti; con più linee si segna solo il picco di ciascuna
- codifica gli spazi del titolo come `%20`
