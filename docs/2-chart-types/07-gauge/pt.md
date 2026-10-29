---
x-title: gauge medidor — x-cmd/draw
x-desc: Gráficos SVG para a era da IA: um único endpoint `/draw?type=. type=gauge.
x-sidebar: draw
x-keywords: draw, gauge, medidor, svg, chart
---

# gauge medidor

`GET /draw?type=gauge&...` — renderizar um gráfico

## Exemplos

**base**

```text
https://x-cmd.com/draw?type=gauge&title=Taxa%20de%20CI&value=87&max=100
```

![gauge base](https://x-cmd.com/draw?type=gauge&title=Taxa%20de%20CI&value=87&max=100)

**gradient**

```text
https://x-cmd.com/draw?type=gauge&t=gradient&title=Taxa%20de%20CI&value=87&max=100
```

![gauge gradient](https://x-cmd.com/draw?type=gauge&t=gradient&title=Taxa%20de%20CI&value=87&max=100)

**reliability**

```text
https://x-cmd.com/draw?type=gauge&t=reliability&title=Taxa%20de%20CI&value=99.9&max=100
```

![gauge reliability](https://x-cmd.com/draw?type=gauge&t=reliability&title=Taxa%20de%20CI&value=99.9&max=100)

## Parâmetros

| Parâmetros | | |
|---|---|---|
| `value=` | valor atual | ✓ |
| `max=` | máximo (padrão 100) | ✗ |
| `labels=` | rótulos dos anéis (multianel) | ✗ |
| `values=` | valores dos anéis (porcentagem) | ✗ |
| `title=` | título | ✗ |
| `t=` | família de estilo | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `gradient` |
| `reliability` |

## Armadilhas

- um valor por gráfico; vários valores → combo/line
- codifique espaços do título como `%20`
