---
x-title: area área — x-cmd/draw
x-desc: Gráficos SVG para a era da IA: um único endpoint `/draw?type=. type=area.
x-sidebar: draw
x-keywords: draw, area, área, svg, chart
---

# area área

`GET /draw?type=area&...` — renderizar um gráfico

## Exemplos

**evil**

```text
https://x-cmd.com/draw?type=area&labels=Seg,Ter,Qua&series=dev:30,42,38&series=CI:12,18,9&title=Downloads
```

![area evil](https://x-cmd.com/draw?type=area&labels=Seg,Ter,Qua&series=dev:30,42,38&series=CI:12,18,9&title=Downloads)

**star**

```text
https://x-cmd.com/draw?type=area&t=star&labels=Seg,Ter,Qua&values=3,5,4&title=Crescimento
```

![area star](https://x-cmd.com/draw?type=area&t=star&labels=Seg,Ter,Qua&values=3,5,4&title=Crescimento)

**opendata**

```text
https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=Crescimento&source=x-cmd.com%2Fdraw
```

![area opendata](https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=Crescimento&source=x-cmd.com%2Fdraw)

**pixel**

```text
https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=Crescimento
```

![area pixel](https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=Crescimento)

## Parâmetros

| Parâmetros | | |
|---|---|---|
| `labels=` | rótulos, separados por vírgula | ✓ |
| `values=` | valores, separados por vírgula | ✓ |
| `series=` | séries `nome:valores`, repetível | ✗ |
| `source=` | fonte dos dados (só area) | ✗ |
| `subtitle=` | subtítulo editorial (area opendata) | ✗ |
| `t=` | família de estilo | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `star` |
| `opendata` |
| `pixel` |
| `polka` |

## Armadilhas

- ≤60 pontos; com várias linhas marca só o pico de cada
- codifique espaços do título como `%20`
