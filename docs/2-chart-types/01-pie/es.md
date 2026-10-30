---
x-title: pie pastel — x-cmd/draw
x-desc: Gráficos SVG para la era de la IA: un único endpoint `/draw?type=. type=pie.
x-sidebar: draw
x-keywords: draw, pie, pastel, svg, chart
---

# pie pastel

`GET /draw?type=pie&...` — renderizar un gráfico

## Ejemplos

**opendata**

```text
https://x-cmd.com/draw?type=pie&title=Mayores%20ciudades&unit=mill.&labels=Madrid,Barcelona,Valencia,Sevilla&values=3.3,1.6,0.8,0.7
```

![pie opendata](https://x-cmd.com/draw?type=pie&title=Mayores%20ciudades&unit=mill.&labels=Madrid,Barcelona,Valencia,Sevilla&values=3.3,1.6,0.8,0.7)

**evil**

```text
https://x-cmd.com/draw?type=pie&t=evil&title=Mayores%20ciudades&unit=mill.&labels=Madrid,Barcelona,Valencia,Sevilla&values=3.3,1.6,0.8,0.7
```

![pie evil](https://x-cmd.com/draw?type=pie&t=evil&title=Mayores%20ciudades&unit=mill.&labels=Madrid,Barcelona,Valencia,Sevilla&values=3.3,1.6,0.8,0.7)

**evil-mono**

```text
https://x-cmd.com/draw?type=pie&t=evil-mono&title=Mayores%20ciudades&unit=mill.&labels=Madrid,Barcelona,Valencia,Sevilla&values=3.3,1.6,0.8,0.7
```

![pie evil-mono](https://x-cmd.com/draw?type=pie&t=evil-mono&title=Mayores%20ciudades&unit=mill.&labels=Madrid,Barcelona,Valencia,Sevilla&values=3.3,1.6,0.8,0.7)

**market-mono**

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=Mayores%20ciudades&unit=mill.&labels=Madrid,Barcelona,Valencia,Sevilla&values=3.3,1.6,0.8,0.7
```

![pie market-mono](https://x-cmd.com/draw?type=pie&t=market-mono&title=Mayores%20ciudades&unit=mill.&labels=Madrid,Barcelona,Valencia,Sevilla&values=3.3,1.6,0.8,0.7)

**progress**

```text
https://x-cmd.com/draw?type=pie&t=progress&title=Mayores%20ciudades&unit=mill.&labels=Madrid,Barcelona,Valencia,Sevilla&values=3.3,1.6,0.8,0.7
```

![pie progress](https://x-cmd.com/draw?type=pie&t=progress&title=Mayores%20ciudades&unit=mill.&labels=Madrid,Barcelona,Valencia,Sevilla&values=3.3,1.6,0.8,0.7)

**revenue**

```text
https://x-cmd.com/draw?type=pie&t=revenue&title=Mayores%20ciudades&unit=mill.&labels=Madrid,Barcelona,Valencia,Sevilla&values=3.3,1.6,0.8,0.7
```

![pie revenue](https://x-cmd.com/draw?type=pie&t=revenue&title=Mayores%20ciudades&unit=mill.&labels=Madrid,Barcelona,Valencia,Sevilla&values=3.3,1.6,0.8,0.7)

## Parámetros

| Parámetros | | |
|---|---|---|
| `labels=` | etiquetas, separadas por comas | ✓ |
| `values=` | valores, separados por comas | ✓ |
| `title=` | título | ✗ |
| `unit=` | unidad | ✗ |
| `donut=` | 0 = pastel sólido | ✗ |
| `t=` | familia de estilo | ✗ |

## `t=`

| | |
|---|---|
| `opendata` |
| `evil` |
| `evil-mono` |
| `market-mono` |
| `progress` |
| `revenue` |

## Errores comunes

- ≤100 clases; más de 9 se agrupan en Other
- pastel sólido vs. anillo es solo `donut=` — no cambies de estilo
- el contraste de algunos estilos cambia en modo oscuro
- codifica los espacios del título como `%20`
