---
x-title: bar colunas — x-cmd/draw
x-desc: Gráficos SVG para a era da IA: um único endpoint `/draw?type=. type=bar.
x-sidebar: draw
x-keywords: draw, bar, colunas, svg, chart
---

# bar colunas

`GET /draw?type=bar&...` — renderizar um gráfico

## Exemplos

**evil**

```text
https://x-cmd.com/draw?type=bar&t=evil&labels=Seg,Ter,Qua,Qui,Sex,S%C3%A1b,Dom&series=Downloads:34,87,51,63,45,78,39&series=Crescimento:18,49,29,39,31,45,23
```

![bar evil](https://x-cmd.com/draw?type=bar&t=evil&labels=Seg,Ter,Qua,Qui,Sex,S%C3%A1b,Dom&series=Downloads:34,87,51,63,45,78,39&series=Crescimento:18,49,29,39,31,45,23)

**base**

```text
https://x-cmd.com/draw?type=bar&labels=Seg,Ter,Qua&series=dev:12,18,9&series=CI:8,11,6
```

![bar base](https://x-cmd.com/draw?type=bar&labels=Seg,Ter,Qua&series=dev:12,18,9&series=CI:8,11,6)

**grid**

```text
https://x-cmd.com/draw?type=bar&t=grid&labels=Seg,Ter,Qua&values=12,18,9
```

![bar grid](https://x-cmd.com/draw?type=bar&t=grid&labels=Seg,Ter,Qua&values=12,18,9)

**evil stack**

```text
https://x-cmd.com/draw?type=bar&stack=1&labels=Seg,Ter,Qua&series=dev:12,18,9&series=CI:8,11,6
```

![bar evil stack](https://x-cmd.com/draw?type=bar&stack=1&labels=Seg,Ter,Qua&series=dev:12,18,9&series=CI:8,11,6)

## Parâmetros

| Parâmetros | | |
|---|---|---|
| `labels=` | rótulos, separados por vírgula | ✓ |
| `values=` | valores, separados por vírgula | ✓ |
| `series=` | séries `nome:valores`, repetível | ✗ |
| `stack=` | 1 = empilhadas | ✗ |
| `title=` | título | ✗ |
| `t=` | família de estilo | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `base` |
| `grid` |

## Armadilhas

- ≤30 grupos, ≤6 séries
- com diferenças extremas empilha em percentual automaticamente
- codifique espaços do título como `%20`
