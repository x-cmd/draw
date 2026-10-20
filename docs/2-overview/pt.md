---
x-title: Português — draw overview
x-desc: Gráficos SVG para a era da IA: um único endpoint `/draw?type=.
x-sidebar: draw
x-keywords: draw, overview, svg, chart, api
---

# draw — Gráficos SVG com os dados na URL

Gráficos SVG para a era da IA: um único endpoint `/draw?type=...`, dados na URL e `<metadata>` legível por máquinas em cada saída. O sistema de estilos segue uma especificação de design, com várias variantes por tipo de gráfico.

## Endpoints

| type | | |
|---|---|---|
| `pie` | Donut; `donut=0` = pizza sólida | ≤100 classes (>9 → Other) |
| `bar` | Colunas agrupadas; `stack=1` empilhadas | ≤30 grupos |
| `hbar` | Barras horizontais (rankings) | ≤30 barras |
| `line` | Linha suave + gradiente / multilinha | ≤60 pontos |
| `area` | Área / multi-área | ≤60 pontos |
| `radar` | Radar | 3–12 eixos |
| `gauge` | Medidor (arco 240°, valor central) | value+max; anéis ≤8 |
| `scatter` | Dispersão, dois eixos numéricos, negativos ok | x=&y=, ≤200 pontos |
| `combo` | Colunas (`series=`) + linha (`line=`); eixo duplo acima de 5× de diferença | ≤30 grupos, ≤6 séries |
| `sankey` | Diagrama de fluxo com larguras | labels=+links=A>B:30, ≤24 nós |
| `qr` | QR Code | d≤1000 caracteres, fg/bg, title/unit |

## Versionamento

- sem `v`: versão mais recente, cache 300 s
- `v=N`: versão fixada, cache 1 dia
- `immutable` só para `/c/<hash>`

## Amigável à IA

Cada SVG embute JSON: `{generator, template, version, spec}` — dados e parâmetros fazem round-trip direto; texto é `<text>` de verdade.
