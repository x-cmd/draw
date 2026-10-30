---
x-title: gauge indicatore — x-cmd/draw
x-desc: Grafici SVG per l’era dell’IA: un solo endpoint `/draw?type=. type=gauge.
x-sidebar: draw
x-keywords: draw, gauge, indicatore, svg, chart
---

# gauge indicatore

`GET /draw?type=gauge&...` — renderizzare un grafico

## Esempi

**base**

```text
https://x-cmd.com/draw?type=gauge&title=Tasso%20di%20CI&value=87&max=100
```

![gauge base](https://x-cmd.com/draw?type=gauge&title=Tasso%20di%20CI&value=87&max=100)

**gradient**

```text
https://x-cmd.com/draw?type=gauge&t=gradient&title=Tasso%20di%20CI&value=87&max=100
```

![gauge gradient](https://x-cmd.com/draw?type=gauge&t=gradient&title=Tasso%20di%20CI&value=87&max=100)

**reliability**

```text
https://x-cmd.com/draw?type=gauge&t=reliability&title=Tasso%20di%20CI&value=99.9&max=100
```

![gauge reliability](https://x-cmd.com/draw?type=gauge&t=reliability&title=Tasso%20di%20CI&value=99.9&max=100)

## Parametri

| Parametri | | |
|---|---|---|
| `value=` | valore attuale | ✓ |
| `max=` | massimo (default 100) | ✗ |
| `labels=` | etichette degli anelli (multi-anello) | ✗ |
| `values=` | valori degli anelli (percentuale) | ✗ |
| `title=` | titolo | ✗ |
| `t=` | famiglia di stile | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `gradient` |
| `reliability` |

## Insidie

- un valore per grafico; più valori → combo/line
- codifica gli spazi del titolo come `%20`
