---
x-title: radar radar — x-cmd/draw
x-desc: Grafici SVG per l’era dell’IA: un solo endpoint `/draw?type=. type=radar.
x-sidebar: draw
x-keywords: draw, radar, radar, svg, chart
---

# radar radar

`GET /draw?type=radar&...` — renderizzare un grafico

## Esempi

**base**

```text
https://x-cmd.com/draw?type=radar&labels=avvio,ecosistema,estendibilit%C3%A0,memoria,facilit%C3%A0&values=85,90,70,80,95&title=Confronto%20editor
```

![radar base](https://x-cmd.com/draw?type=radar&labels=avvio,ecosistema,estendibilit%C3%A0,memoria,facilit%C3%A0&values=85,90,70,80,95&title=Confronto%20editor)

**evil**

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=avvio,ecosistema,estendibilit%C3%A0,memoria,facilit%C3%A0&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Confronto%20editor
```

![radar evil](https://x-cmd.com/draw?type=radar&t=evil&labels=avvio,ecosistema,estendibilit%C3%A0,memoria,facilit%C3%A0&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Confronto%20editor)

**xcmd**

```text
https://x-cmd.com/draw?type=radar&t=xcmd&labels=avvio,ecosistema,estendibilit%C3%A0,memoria,facilit%C3%A0&values=8,6,9,7,5&title=Confronto%20editor
```

![radar xcmd](https://x-cmd.com/draw?type=radar&t=xcmd&labels=avvio,ecosistema,estendibilit%C3%A0,memoria,facilit%C3%A0&values=8,6,9,7,5&title=Confronto%20editor)

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
| `base` |
| `evil` |
| `xcmd` |

## Insidie

- 3–12 assi
- più serie richiedono `t=evil`
- codifica gli spazi del titolo come `%20`
