---
x-title: radar radar — x-cmd/draw
x-desc: Gráficos SVG para a era da IA: um único endpoint `/draw?type=. type=radar.
x-sidebar: draw
x-keywords: draw, radar, radar, svg, chart
---

# radar radar

`GET /draw?type=radar&...` — renderizar um gráfico

## Exemplos

**base**

```text
https://x-cmd.com/draw?type=radar&labels=in%C3%ADcio,ecossistema,extensibilidade,mem%C3%B3ria,facilidade&values=85,90,70,80,95&title=Compara%C3%A7%C3%A3o%20de%20editores
```

![radar base](https://x-cmd.com/draw?type=radar&labels=in%C3%ADcio,ecossistema,extensibilidade,mem%C3%B3ria,facilidade&values=85,90,70,80,95&title=Compara%C3%A7%C3%A3o%20de%20editores)

**evil**

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=in%C3%ADcio,ecossistema,extensibilidade,mem%C3%B3ria,facilidade&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Compara%C3%A7%C3%A3o%20de%20editores
```

![radar evil](https://x-cmd.com/draw?type=radar&t=evil&labels=in%C3%ADcio,ecossistema,extensibilidade,mem%C3%B3ria,facilidade&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Compara%C3%A7%C3%A3o%20de%20editores)

**xcmd**

```text
https://x-cmd.com/draw?type=radar&t=xcmd&labels=in%C3%ADcio,ecossistema,extensibilidade,mem%C3%B3ria,facilidade&values=8,6,9,7,5&title=Compara%C3%A7%C3%A3o%20de%20editores
```

![radar xcmd](https://x-cmd.com/draw?type=radar&t=xcmd&labels=in%C3%ADcio,ecossistema,extensibilidade,mem%C3%B3ria,facilidade&values=8,6,9,7,5&title=Compara%C3%A7%C3%A3o%20de%20editores)

## Parâmetros

| Parâmetros | | |
|---|---|---|
| `labels=` | rótulos, separados por vírgula | ✓ |
| `values=` | valores, separados por vírgula | ✓ |
| `series=` | séries `nome:valores`, repetível | ✗ |
| `title=` | título | ✗ |
| `t=` | família de estilo | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `evil` |
| `xcmd` |

## Armadilhas

- 3–12 eixos
- várias séries exigem `t=evil`
- codifique espaços do título como `%20`
