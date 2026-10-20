---
x-title: bar colonne — x-cmd/draw
x-desc: Grafici SVG per l’era dell’IA: un solo endpoint `/draw?type=. type=bar.
x-sidebar: draw
x-keywords: draw, bar, colonne, svg, chart
---

# bar colonne

`GET /draw?type=bar&...` — renderizzare un grafico

## Esempi

**evil**

```text
https://x-cmd.com/draw?type=bar&t=evil&labels=Lun,Mar,Mer,Gio,Ven,Sab,Dom&series=Download:34,87,51,63,45,78,39&series=Crescita:18,49,29,39,31,45,23
```

![bar evil](https://x-cmd.com/draw?type=bar&t=evil&labels=Lun,Mar,Mer,Gio,Ven,Sab,Dom&series=Download:34,87,51,63,45,78,39&series=Crescita:18,49,29,39,31,45,23)

**base**

```text
https://x-cmd.com/draw?type=bar&labels=Lun,Mar,Mer&series=dev:12,18,9&series=CI:8,11,6
```

![bar base](https://x-cmd.com/draw?type=bar&labels=Lun,Mar,Mer&series=dev:12,18,9&series=CI:8,11,6)

**grid**

```text
https://x-cmd.com/draw?type=bar&t=grid&labels=Lun,Mar,Mer&values=12,18,9
```

![bar grid](https://x-cmd.com/draw?type=bar&t=grid&labels=Lun,Mar,Mer&values=12,18,9)

**evil stack**

```text
https://x-cmd.com/draw?type=bar&stack=1&labels=Lun,Mar,Mer&series=dev:12,18,9&series=CI:8,11,6
```

![bar evil stack](https://x-cmd.com/draw?type=bar&stack=1&labels=Lun,Mar,Mer&series=dev:12,18,9&series=CI:8,11,6)

## Parametri

| Parametri | | |
|---|---|---|
| `labels=` | etichette, separate da virgole | ✓ |
| `values=` | valori, separati da virgole | ✓ |
| `series=` | serie `nome:valori`, ripetibile | ✗ |
| `stack=` | 1 = impilate | ✗ |
| `title=` | titolo | ✗ |
| `t=` | famiglia di stile | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `base` |
| `grid` |

## Insidie

- ≤30 gruppi, ≤6 serie
- con differenze estreme impila in percentuale automaticamente
- codifica gli spazi del titolo come `%20`
