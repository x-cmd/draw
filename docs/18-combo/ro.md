---
x-title: combo combinat — x-cmd/draw
x-desc: Grafice SVG pentru era AI: un singur endpoint `/draw?type=. type=combo.
x-sidebar: draw
x-keywords: draw, combo, combinat, svg, chart
---

# combo combinat

`GET /draw?type=combo&...` — randează un grafic

## Exemple

**base**

```text
https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mie,Joi,Vin,S%C3%A2m,Dum&series=Desc%C4%83rc%C4%83ri:120,180,150,210,240,200,260&line=Cre%C8%99tere:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Desc%C4%83rc%C4%83ri%20s%C4%83pt%C4%83m%C3%A2nale&unit=dl
```

![combo base](https://x-cmd.com/draw?type=combo&labels=Lun,Mar,Mie,Joi,Vin,S%C3%A2m,Dum&series=Desc%C4%83rc%C4%83ri:120,180,150,210,240,200,260&line=Cre%C8%99tere:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Desc%C4%83rc%C4%83ri%20s%C4%83pt%C4%83m%C3%A2nale&unit=dl)

**evil**

```text
https://x-cmd.com/draw?type=combo&t=evil&labels=Lun,Mar,Mie&series=Desc%C4%83rc%C4%83ri:9,12,15&line=Cre%C8%99tere:1.1,1.4,1.8&title=Desc%C4%83rc%C4%83ri%20s%C4%83pt%C4%83m%C3%A2nale
```

![combo evil](https://x-cmd.com/draw?type=combo&t=evil&labels=Lun,Mar,Mie&series=Desc%C4%83rc%C4%83ri:9,12,15&line=Cre%C8%99tere:1.1,1.4,1.8&title=Desc%C4%83rc%C4%83ri%20s%C4%83pt%C4%83m%C3%A2nale)

## Parametri

| Parametri | | |
|---|---|---|
| `labels=` | etichete, separate prin virgule | ✓ |
| `series=` | serii `nume:valori`, repetabile | ✓ |
| `line=` | serie linie `nume:valori` | ✗ |
| `stack=` | 1 = stivuite | ✗ |
| `title=` | titlu | ✗ |
| `t=` | familia stilului | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `evil` |

## Capcane

- coloane + linie; axă dublă de la 5× diferență
- codează spațiile din titlu ca `%20`
