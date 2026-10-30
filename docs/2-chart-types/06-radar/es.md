---
x-title: radar radar — x-cmd/draw
x-desc: Gráficos SVG para la era de la IA: un único endpoint `/draw?type=. type=radar.
x-sidebar: draw
x-keywords: draw, radar, radar, svg, chart
---

# radar radar

`GET /draw?type=radar&...` — renderizar un gráfico

## Ejemplos

**base**

```text
https://x-cmd.com/draw?type=radar&labels=arranque,ecosistema,extensibilidad,memoria,facilidad&values=85,90,70,80,95&title=Comparaci%C3%B3n%20de%20editores
```

![radar base](https://x-cmd.com/draw?type=radar&labels=arranque,ecosistema,extensibilidad,memoria,facilidad&values=85,90,70,80,95&title=Comparaci%C3%B3n%20de%20editores)

**evil**

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=arranque,ecosistema,extensibilidad,memoria,facilidad&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Comparaci%C3%B3n%20de%20editores
```

![radar evil](https://x-cmd.com/draw?type=radar&t=evil&labels=arranque,ecosistema,extensibilidad,memoria,facilidad&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Comparaci%C3%B3n%20de%20editores)

**xcmd**

```text
https://x-cmd.com/draw?type=radar&t=xcmd&labels=arranque,ecosistema,extensibilidad,memoria,facilidad&values=8,6,9,7,5&title=Comparaci%C3%B3n%20de%20editores
```

![radar xcmd](https://x-cmd.com/draw?type=radar&t=xcmd&labels=arranque,ecosistema,extensibilidad,memoria,facilidad&values=8,6,9,7,5&title=Comparaci%C3%B3n%20de%20editores)

## Parámetros

| Parámetros | | |
|---|---|---|
| `labels=` | etiquetas, separadas por comas | ✓ |
| `values=` | valores, separados por comas | ✓ |
| `series=` | series `nombre:valores`, repetible | ✗ |
| `title=` | título | ✗ |
| `t=` | familia de estilo | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `evil` |
| `xcmd` |

## Errores comunes

- 3–12 ejes
- varias series requieren `t=evil`
- codifica los espacios del título como `%20`
