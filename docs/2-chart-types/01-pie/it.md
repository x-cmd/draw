---
x-title: pie torta — x-cmd/draw
x-desc: Grafici SVG per l’era dell’IA: un solo endpoint `/draw?type=. type=pie.
x-sidebar: draw
x-keywords: draw, pie, torta, svg, chart
---

# pie torta

`GET /draw?type=pie&...` — renderizzare un grafico

## Esempi

**opendata**

```text
https://x-cmd.com/draw?type=pie&title=Maggiori%20citt%C3%A0&unit=mln&labels=Roma,Milano,Napoli,Torino&values=2.8,1.4,1,0.9
```

![pie opendata](https://x-cmd.com/draw?type=pie&title=Maggiori%20citt%C3%A0&unit=mln&labels=Roma,Milano,Napoli,Torino&values=2.8,1.4,1,0.9)

**evil**

```text
https://x-cmd.com/draw?type=pie&t=evil&title=Maggiori%20citt%C3%A0&unit=mln&labels=Roma,Milano,Napoli,Torino&values=2.8,1.4,1,0.9
```

![pie evil](https://x-cmd.com/draw?type=pie&t=evil&title=Maggiori%20citt%C3%A0&unit=mln&labels=Roma,Milano,Napoli,Torino&values=2.8,1.4,1,0.9)

**evil-mono**

```text
https://x-cmd.com/draw?type=pie&t=evil-mono&title=Maggiori%20citt%C3%A0&unit=mln&labels=Roma,Milano,Napoli,Torino&values=2.8,1.4,1,0.9
```

![pie evil-mono](https://x-cmd.com/draw?type=pie&t=evil-mono&title=Maggiori%20citt%C3%A0&unit=mln&labels=Roma,Milano,Napoli,Torino&values=2.8,1.4,1,0.9)

**market-mono**

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=Maggiori%20citt%C3%A0&unit=mln&labels=Roma,Milano,Napoli,Torino&values=2.8,1.4,1,0.9
```

![pie market-mono](https://x-cmd.com/draw?type=pie&t=market-mono&title=Maggiori%20citt%C3%A0&unit=mln&labels=Roma,Milano,Napoli,Torino&values=2.8,1.4,1,0.9)

**progress**

```text
https://x-cmd.com/draw?type=pie&t=progress&title=Maggiori%20citt%C3%A0&unit=mln&labels=Roma,Milano,Napoli,Torino&values=2.8,1.4,1,0.9
```

![pie progress](https://x-cmd.com/draw?type=pie&t=progress&title=Maggiori%20citt%C3%A0&unit=mln&labels=Roma,Milano,Napoli,Torino&values=2.8,1.4,1,0.9)

**revenue**

```text
https://x-cmd.com/draw?type=pie&t=revenue&title=Maggiori%20citt%C3%A0&unit=mln&labels=Roma,Milano,Napoli,Torino&values=2.8,1.4,1,0.9
```

![pie revenue](https://x-cmd.com/draw?type=pie&t=revenue&title=Maggiori%20citt%C3%A0&unit=mln&labels=Roma,Milano,Napoli,Torino&values=2.8,1.4,1,0.9)

## Parametri

| Parametri | | |
|---|---|---|
| `labels=` | etichette, separate da virgole | ✓ |
| `values=` | valori, separati da virgole | ✓ |
| `title=` | titolo | ✗ |
| `unit=` | unità | ✗ |
| `donut=` | 0 = torta piena | ✗ |
| `t=` | famiglia di stile | ✗ |

## `t=`

| | |
|---|---|
| `opendata` |
| `evil` |
| `evil-mono` |
| `market-mono` |
| `progress` |
| `revenue` |

## Insidie

- ≤100 classi; oltre 9 si raggruppano in Other
- torta piena vs ciambella è solo `donut=` — non cambiare stile
- il contrasto di alcuni stili cambia in modalità scura
- codifica gli spazi del titolo come `%20`
