---
x-title: line linha — x-cmd/draw
x-desc: Gráficos SVG para a era da IA: um único endpoint `/draw?type=. type=line.
x-sidebar: draw
x-keywords: draw, line, linha, svg, chart
---

# line linha

`GET /draw?type=line&...` — renderizar um gráfico

## Exemplos

**shadcn**

```text
https://x-cmd.com/draw?type=line&labels=Jan,Fev,Mar,Abr,Mai,Jun&values=12,19,15,25,22,30&title=Estrelas%20por%20linguagem
```

![line shadcn](https://x-cmd.com/draw?type=line&labels=Jan,Fev,Mar,Abr,Mai,Jun&values=12,19,15,25,22,30&title=Estrelas%20por%20linguagem)

**evil**

```text
https://x-cmd.com/draw?type=line&t=evil&labels=Jan,Fev,Mar,Abr,Mai,Jun&series=Downloads:12,19,15,25,22,30&series=CI:8,11,9,14,12,10
```

![line evil](https://x-cmd.com/draw?type=line&t=evil&labels=Jan,Fev,Mar,Abr,Mai,Jun&series=Downloads:12,19,15,25,22,30&series=CI:8,11,9,14,12,10)

**evil-glow**

```text
https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=Crescimento
```

![line evil-glow](https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=Crescimento)

**opendata**

```text
https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=Downloads
```

![line opendata](https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=Downloads)

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
| `shadcn` |
| `evil` |
| `evil-glow` |
| `evil-mono` |
| `opendata` |

## Armadilhas

- ≤60 pontos; com várias linhas marca só o pico de cada
- codifique espaços do título como `%20`
