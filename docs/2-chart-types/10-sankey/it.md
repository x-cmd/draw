---
x-title: sankey sankey — x-cmd/draw
x-desc: Grafici SVG per l’era dell’IA: un solo endpoint `/draw?type=. type=sankey.
x-sidebar: draw
x-keywords: draw, sankey, sankey, svg, chart
---

# sankey sankey

`GET /draw?type=sankey&...` — renderizzare un grafico

## Esempi

**pipeline**

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=funz.,fix,documentazione,varie,uniti,chiusi,rifiutati,%3C1a,1%E2%80%932a,%3E2a&links=funz.%3Euniti:38;funz.%3Echiusi:12;funz.%3Erifiutati:8;fix%3Euniti:33;fix%3Echiusi:6;fix%3Erifiutati:2;documentazione%3Euniti:16;documentazione%3Echiusi:4;varie%3Euniti:5;varie%3Echiusi:6;varie%3Erifiutati:6;uniti%3E%3C1a:52;uniti%3E1%E2%80%932a:28;uniti%3E%3E2a:12;chiusi%3E%3C1a:14;chiusi%3E1%E2%80%932a:9;chiusi%3E%3E2a:5;rifiutati%3E%3C1a:9;rifiutati%3E1%E2%80%932a:5;rifiutati%3E%3E2a:2&title=Ciclo%20di%20vita%20delle%20PR&unit=prs
```

![sankey pipeline](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=funz.,fix,documentazione,varie,uniti,chiusi,rifiutati,%3C1a,1%E2%80%932a,%3E2a&links=funz.%3Euniti:38;funz.%3Echiusi:12;funz.%3Erifiutati:8;fix%3Euniti:33;fix%3Echiusi:6;fix%3Erifiutati:2;documentazione%3Euniti:16;documentazione%3Echiusi:4;varie%3Euniti:5;varie%3Echiusi:6;varie%3Erifiutati:6;uniti%3E%3C1a:52;uniti%3E1%E2%80%932a:28;uniti%3E%3E2a:12;chiusi%3E%3C1a:14;chiusi%3E1%E2%80%932a:9;chiusi%3E%3E2a:5;rifiutati%3E%3C1a:9;rifiutati%3E1%E2%80%932a:5;rifiutati%3E%3E2a:2&title=Ciclo%20di%20vita%20delle%20PR&unit=prs)

**fund**

```text
https://x-cmd.com/draw?type=sankey&t=fund&labels=funz.,fix,uniti,chiusi,%3C1a,1%E2%80%932a&links=funz.%3Euniti:50;funz.%3Echiusi:20;fix%3Euniti:30;fix%3Echiusi:10;uniti%3E%3C1a:52;uniti%3E1%E2%80%932a:28;chiusi%3E%3C1a:14;chiusi%3E1%E2%80%932a:9&title=Ciclo%20di%20vita%20delle%20PR
```

![sankey fund](https://x-cmd.com/draw?type=sankey&t=fund&labels=funz.,fix,uniti,chiusi,%3C1a,1%E2%80%932a&links=funz.%3Euniti:50;funz.%3Echiusi:20;fix%3Euniti:30;fix%3Echiusi:10;uniti%3E%3C1a:52;uniti%3E1%E2%80%932a:28;chiusi%3E%3C1a:14;chiusi%3E1%E2%80%932a:9&title=Ciclo%20di%20vita%20delle%20PR)

**base**

```text
https://x-cmd.com/draw?type=sankey&labels=funz.,uniti,chiusi,%3C1a,1%E2%80%932a&links=funz.%3Euniti:71;funz.%3Echiusi:22;uniti%3E%3C1a:52;uniti%3E1%E2%80%932a:19;chiusi%3E%3C1a:14;chiusi%3E1%E2%80%932a:8&title=Ciclo%20di%20vita%20delle%20PR
```

![sankey base](https://x-cmd.com/draw?type=sankey&labels=funz.,uniti,chiusi,%3C1a,1%E2%80%932a&links=funz.%3Euniti:71;funz.%3Echiusi:22;uniti%3E%3C1a:52;uniti%3E1%E2%80%932a:19;chiusi%3E%3C1a:14;chiusi%3E1%E2%80%932a:8&title=Ciclo%20di%20vita%20delle%20PR)

## Parametri

| Parametri | | |
|---|---|---|
| `labels=` | nodi, separati da virgole | ✓ |
| `links=` | flussi `A>B:valore`, separati da ; | ✓ |
| `title=` | titolo | ✗ |
| `unit=` | unità | ✗ |
| `t=` | famiglia di stile | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `fund` |
| `pipeline` |

## Insidie

- ≤24 nodi / 60 flussi; i cicli vengono rifiutati
- i flussi formano un DAG — il totale torna con le labels
- codifica gli spazi del titolo come `%20`
