---
x-title: combo combinato — x-cmd/draw
x-desc: Grafici SVG per l’era dell’IA: un solo endpoint `/draw?type=. type=combo.
x-sidebar: draw
x-keywords: draw, combo, combinato, svg, chart
---

# combo combinato

`GET /draw?type=combo&...` — renderizzare un grafico

## Esempi

**base**

```text
https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mer,Gio,Ven,Sab,Dom&series=Download:120,180,150,210,240,200,260&line=Crescita:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Download%20settimanali&unit=dl
```

![combo base](https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mer,Gio,Ven,Sab,Dom&series=Download:120,180,150,210,240,200,260&line=Crescita:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Download%20settimanali&unit=dl)

**evil**

```text
https://x-cmd.com/draw?type=combo&t=evil&labels=Lun,Mar,Mer&series=Download:9,12,15&line=Crescita:1.1,1.4,1.8&title=Download%20settimanali
```

![combo evil](https://x-cmd.com/draw?type=combo&t=evil&labels=Lun,Mar,Mer&series=Download:9,12,15&line=Crescita:1.1,1.4,1.8&title=Download%20settimanali)

## Parametri

| Parametri | | |
|---|---|---|
| `labels=` | etichette, separate da virgole | ✓ |
| `series=` | serie `nome:valori`, ripetibile | ✓ |
| `line=` | serie linea `nome:valori` | ✗ |
| `stack=` | 1 = impilate | ✗ |
| `title=` | titolo | ✗ |
| `t=` | famiglia di stile | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `evil` |

## Insidie

- barre + linea; doppio asse oltre 5× di scarto
- codifica gli spazi del titolo come `%20`
