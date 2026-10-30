---
x-title: area area — x-cmd/draw
x-desc: Grafici SVG per l’era dell’IA: un solo endpoint `/draw?type=. type=area.
x-sidebar: draw
x-keywords: draw, area, area, svg, chart
---

# area area

`GET /draw?type=area&...` — renderizzare un grafico

## Esempi

**evil**

```text
https://x-cmd.com/draw?type=area&labels=Lun,Mar,Mer&series=dev:30,42,38&series=CI:12,18,9&title=Download
```

![area evil](https://x-cmd.com/draw?type=area&labels=Lun,Mar,Mer&series=dev:30,42,38&series=CI:12,18,9&title=Download)

**star**

```text
https://x-cmd.com/draw?type=area&t=star&labels=Lun,Mar,Mer&values=3,5,4&title=Crescita
```

![area star](https://x-cmd.com/draw?type=area&t=star&labels=Lun,Mar,Mer&values=3,5,4&title=Crescita)

**opendata**

```text
https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=Crescita&source=x-cmd.com%2Fdraw
```

![area opendata](https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=Crescita&source=x-cmd.com%2Fdraw)

**pixel**

```text
https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=Crescita
```

![area pixel](https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=Crescita)

## Parametri

| Parametri | | |
|---|---|---|
| `labels=` | etichette, separate da virgole | ✓ |
| `values=` | valori, separati da virgole | ✓ |
| `series=` | serie `nome:valori`, ripetibile | ✗ |
| `source=` | fonte dei dati (solo area) | ✗ |
| `subtitle=` | sottotitolo editoriale (area opendata) | ✗ |
| `t=` | famiglia di stile | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `star` |
| `opendata` |
| `pixel` |
| `polka` |

## Insidie

- ≤60 punti; con più linee si segna solo il picco di ciascuna
- codifica gli spazi del titolo come `%20`
