---
x-title: hbar barre orizzontali — x-cmd/draw
x-desc: Grafici SVG per l’era dell’IA: un solo endpoint `/draw?type=. type=hbar.
x-sidebar: draw
x-keywords: draw, hbar, barre orizzontali, svg, chart
---

# hbar barre orizzontali

`GET /draw?type=hbar&...` — renderizzare un grafico

## Esempi

**base**

```text
https://x-cmd.com/draw?type=hbar&labels=CLI,core,documentazione,UI&values=42,31,18,9&title=Commit%20per%20area
```

![hbar base](https://x-cmd.com/draw?type=hbar&labels=CLI,core,documentazione,UI&values=42,31,18,9&title=Commit%20per%20area)

**opendata**

```text
https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,core,documentazione,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=Commit%20per%20area
```

![hbar opendata](https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,core,documentazione,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=Commit%20per%20area)

**xcmd**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd&labels=Roma,Milano,Napoli&values=68,21,11&title=Maggiori%20citt%C3%A0
```

![hbar xcmd](https://x-cmd.com/draw?type=hbar&t=xcmd&labels=Roma,Milano,Napoli&values=68,21,11&title=Maggiori%20citt%C3%A0)

**xcmd-issue**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,core,documentazione,ci,UI&series=aperte:12,8,15,4,9&series=chiuse:38,52,20,11,26&title=Issue%20per%20area
```

![hbar xcmd-issue](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,core,documentazione,ci,UI&series=aperte:12,8,15,4,9&series=chiuse:38,52,20,11,26&title=Issue%20per%20area)

**rank**

```text
https://x-cmd.com/draw?type=hbar&t=rank&labels=Lun,Mar,Mer&series=2025:80,95,110&series=2026:110,85,120&title=Download%20settimanali
```

![hbar rank](https://x-cmd.com/draw?type=hbar&t=rank&labels=Lun,Mar,Mer&series=2025:80,95,110&series=2026:110,85,120&title=Download%20settimanali)

## Parametri

| Parametri | | |
|---|---|---|
| `labels=` | etichette, separate da virgole | ✓ |
| `values=` | valori, separati da virgole | ✓ |
| `series=` | solo alcuni stili: 2 serie | ✗ |
| `ref=` | valore della linea di riferimento | ✗ |
| `reflabel=` | testo della linea di riferimento | ✗ |
| `t=` | famiglia di stile | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `opendata` |
| `xcmd` |
| `xcmd-issue` |
| `rank` |

## Insidie

- ≤30 barre, di default una serie
- due serie solo con `t=xcmd-issue` / `t=rank`
- codifica gli spazi del titolo come `%20`
