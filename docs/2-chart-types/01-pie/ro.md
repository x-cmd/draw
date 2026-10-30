---
x-title: pie circular — x-cmd/draw
x-desc: Grafice SVG pentru era AI: un singur endpoint `/draw?type=. type=pie.
x-sidebar: draw
x-keywords: draw, pie, circular, svg, chart
---

# pie circular

`GET /draw?type=pie&...` — randează un grafic

## Exemple

**opendata**

```text
https://x-cmd.com/draw?type=pie&title=Cele%20mai%20mari%20ora%C8%99e&unit=mil.&labels=Bucure%C8%99ti,Cluj-Napoca,Timi%C8%99oara,Ia%C8%99i&values=1.8,0.3,0.3,0.3
```

![pie opendata](https://x-cmd.com/draw?type=pie&title=Cele%20mai%20mari%20ora%C8%99e&unit=mil.&labels=Bucure%C8%99ti,Cluj-Napoca,Timi%C8%99oara,Ia%C8%99i&values=1.8,0.3,0.3,0.3)

**evil**

```text
https://x-cmd.com/draw?type=pie&t=evil&title=Cele%20mai%20mari%20ora%C8%99e&unit=mil.&labels=Bucure%C8%99ti,Cluj-Napoca,Timi%C8%99oara,Ia%C8%99i&values=1.8,0.3,0.3,0.3
```

![pie evil](https://x-cmd.com/draw?type=pie&t=evil&title=Cele%20mai%20mari%20ora%C8%99e&unit=mil.&labels=Bucure%C8%99ti,Cluj-Napoca,Timi%C8%99oara,Ia%C8%99i&values=1.8,0.3,0.3,0.3)

**evil-mono**

```text
https://x-cmd.com/draw?type=pie&t=evil-mono&title=Cele%20mai%20mari%20ora%C8%99e&unit=mil.&labels=Bucure%C8%99ti,Cluj-Napoca,Timi%C8%99oara,Ia%C8%99i&values=1.8,0.3,0.3,0.3
```

![pie evil-mono](https://x-cmd.com/draw?type=pie&t=evil-mono&title=Cele%20mai%20mari%20ora%C8%99e&unit=mil.&labels=Bucure%C8%99ti,Cluj-Napoca,Timi%C8%99oara,Ia%C8%99i&values=1.8,0.3,0.3,0.3)

**market-mono**

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=Cele%20mai%20mari%20ora%C8%99e&unit=mil.&labels=Bucure%C8%99ti,Cluj-Napoca,Timi%C8%99oara,Ia%C8%99i&values=1.8,0.3,0.3,0.3
```

![pie market-mono](https://x-cmd.com/draw?type=pie&t=market-mono&title=Cele%20mai%20mari%20ora%C8%99e&unit=mil.&labels=Bucure%C8%99ti,Cluj-Napoca,Timi%C8%99oara,Ia%C8%99i&values=1.8,0.3,0.3,0.3)

**progress**

```text
https://x-cmd.com/draw?type=pie&t=progress&title=Cele%20mai%20mari%20ora%C8%99e&unit=mil.&labels=Bucure%C8%99ti,Cluj-Napoca,Timi%C8%99oara,Ia%C8%99i&values=1.8,0.3,0.3,0.3
```

![pie progress](https://x-cmd.com/draw?type=pie&t=progress&title=Cele%20mai%20mari%20ora%C8%99e&unit=mil.&labels=Bucure%C8%99ti,Cluj-Napoca,Timi%C8%99oara,Ia%C8%99i&values=1.8,0.3,0.3,0.3)

**revenue**

```text
https://x-cmd.com/draw?type=pie&t=revenue&title=Cele%20mai%20mari%20ora%C8%99e&unit=mil.&labels=Bucure%C8%99ti,Cluj-Napoca,Timi%C8%99oara,Ia%C8%99i&values=1.8,0.3,0.3,0.3
```

![pie revenue](https://x-cmd.com/draw?type=pie&t=revenue&title=Cele%20mai%20mari%20ora%C8%99e&unit=mil.&labels=Bucure%C8%99ti,Cluj-Napoca,Timi%C8%99oara,Ia%C8%99i&values=1.8,0.3,0.3,0.3)

## Parametri

| Parametri | | |
|---|---|---|
| `labels=` | etichete, separate prin virgule | ✓ |
| `values=` | valori, separate prin virgule | ✓ |
| `title=` | titlu | ✗ |
| `unit=` | unitate | ✗ |
| `donut=` | 0 = plin | ✗ |
| `t=` | familia stilului | ✗ |

## `t=`

| | |
|---|---|
| `opendata` |
| `evil` |
| `evil-mono` |
| `market-mono` |
| `progress` |
| `revenue` |

## Capcane

- ≤100 clase; peste 9 se grupează în Other
- plin vs inel e doar `donut=` — nu schimba stilul
- contrastul unor stiluri se schimbă în modul întunecat
- codează spațiile din titlu ca `%20`
