---
x-title: combo combinado — x-cmd/draw
x-desc: Gráficos SVG para a era da IA: um único endpoint `/draw?type=. type=combo.
x-sidebar: draw
x-keywords: draw, combo, combinado, svg, chart
---

# combo combinado

`GET /draw?type=combo&...` — renderizar um gráfico

## Exemplos

**base**

```text
https://x-cmd.com/draw?type=combo&labels=Seg,Ter,Qua,Qui,Sex,S%C3%A1b,Dom&series=Downloads:120,180,150,210,240,200,260&line=Crescimento:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Downloads%20semanais&unit=dl
```

![combo base](https://x-cmd.com/draw?type=combo&labels=Seg,Ter,Qua,Qui,Sex,S%C3%A1b,Dom&series=Downloads:120,180,150,210,240,200,260&line=Crescimento:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Downloads%20semanais&unit=dl)

**evil**

```text
https://x-cmd.com/draw?type=combo&t=evil&labels=Seg,Ter,Qua&series=Downloads:9,12,15&line=Crescimento:1.1,1.4,1.8&title=Downloads%20semanais
```

![combo evil](https://x-cmd.com/draw?type=combo&t=evil&labels=Seg,Ter,Qua&series=Downloads:9,12,15&line=Crescimento:1.1,1.4,1.8&title=Downloads%20semanais)

## Parâmetros

| Parâmetros | | |
|---|---|---|
| `labels=` | rótulos, separados por vírgula | ✓ |
| `series=` | séries `nome:valores`, repetível | ✓ |
| `line=` | série de linha `nome:valores` | ✗ |
| `stack=` | 1 = empilhadas | ✗ |
| `title=` | título | ✗ |
| `t=` | família de estilo | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `evil` |

## Armadilhas

- barras + linha; eixo duplo a partir de 5× de diferença
- codifique espaços do título como `%20`
