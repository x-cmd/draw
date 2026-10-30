---
x-title: Español — draw overview
x-desc: Gráficos SVG para la era de la IA: un único endpoint `/draw?type=.
x-sidebar: draw
x-keywords: draw, overview, svg, chart, api
---

# draw — Gráficos SVG con los datos en la URL

Gráficos SVG para la era de la IA: un único endpoint `/draw?type=...`, los datos en la URL y `<metadata>` legible por máquinas en cada salida. El sistema de estilos sigue una especificación de diseño, con varias variantes por tipo de gráfico.

## Endpoints

| type | | |
|---|---|---|
| `pie` | Donut; `donut=0` = pastel sólido | ≤100 clases (>9 → Other) |
| `bar` | Columnas agrupadas; `stack=1` apiladas | ≤30 grupos |
| `hbar` | Barras horizontales (rankings) | ≤30 barras |
| `line` | Línea suave + degradado / multilínea | ≤60 puntos |
| `area` | Área / multi-área | ≤60 puntos |
| `radar` | Radar | 3–12 ejes |
| `gauge` | Medidor (arco 240°, valor central) | value+max; anillos ≤8 |
| `scatter` | Dispersión, dos ejes numéricos, negativos ok | x=&y=, ≤200 puntos |
| `combo` | Columnas (`series=`) + línea (`line=`); doble eje desde 5× de diferencia | ≤30 grupos, ≤6 series |
| `sankey` | Diagrama de flujo con anchos | labels=+links=A>B:30, ≤24 nodos |
| `qr` | Código QR | d≤1000 caracteres, fg/bg, title/unit |

## Versionado

- sin `v`: última versión, caché 300 s
- `v=N`: versión fijada, caché 1 día
- `immutable` solo para `/c/<hash>`

## Adaptado a la IA

Cada SVG incrusta JSON: `{generator, template, version, spec}` — datos y parámetros van y vienen directamente; el texto es `<text>` real.
