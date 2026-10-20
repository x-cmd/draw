---
x-title: Português — draw quick start
x-desc: Gráficos SVG para a era da IA: um único endpoint `/draw?type=.
x-sidebar: draw
x-keywords: draw, quickstart, svg, chart
---

# draw — Gráficos SVG com os dados na URL

Gráficos SVG para a era da IA: um único endpoint `/draw?type=...`, dados na URL e `<metadata>` legível por máquinas em cada saída. O sistema de estilos segue uma especificação de design, com várias variantes por tipo de gráfico.

## Prévia

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

![pie](https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2)

## Três formas de usar

**Serviço hospedado (zero instalação)** · **Biblioteca npm + CLI (offline, síncrona)** · Deno:

```ts
import { draw } from "jsr:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

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

Código Apache-2.0; fontes OFL — [README (EN)](../readme/en.md)
