# draw — Gráficos SVG com os dados na URL

> [English](../README.md) | **Português**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)

Todos os dados vivem na URL — abra no navegador, incorpore com `<img>` ou cole no seu README: o SVG renderiza na hora e as IAs conseguem lê-lo diretamente.

## Prévia

### Pizza — maiores cidades

```text
https://x-cmd.com/draw?type=pie&title=Popula%C3%A7%C3%A3o%20das%20maiores%20cidades&unit=mi&labels=S%C3%A3o%20Paulo,Rio%20de%20Janeiro,Bras%C3%ADlia,Salvador&values=12.3,6.7,3,2.9
```

![Pizza — maiores cidades](https://x-cmd.com/draw?type=pie&title=Popula%C3%A7%C3%A3o%20das%20maiores%20cidades&unit=mi&labels=S%C3%A3o%20Paulo,Rio%20de%20Janeiro,Bras%C3%ADlia,Salvador&values=12.3,6.7,3,2.9)

### Barras — ranking por área

```text
https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commits%20por%20%C3%A1rea
```

![Barras — ranking por área](https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commits%20por%20%C3%A1rea)

### Combinado — downloads vs crescimento

```text
https://x-cmd.com/draw?type=combo&labels=Seg,Ter,Qua,Qui,Sex,S%C3%A1b,Dom&series=Downloads:120,180,150,210,240,200,260&line=Crescimento:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Downloads%20semanais&unit=dl
```

![Combinado — downloads vs crescimento](https://x-cmd.com/draw?type=combo&labels=Seg,Ter,Qua,Qui,Sex,S%C3%A1b,Dom&series=Downloads:120,180,150,210,240,200,260&line=Crescimento:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Downloads%20semanais&unit=dl)

### Sankey — ciclo de vida de PRs

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs
```

![Sankey — ciclo de vida de PRs](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs)

## Três formas de usar

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

```sh
npm install @x-cmd/draw
draw --type pie --labels "A,B" --values "3,2" --out pie.svg
```

```ts
import { draw } from "jsr:@x-cmd/draw";   // or npm:@x-cmd/draw
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

## Todos os tipos de gráfico

| type | | |
|---|---|---|
| `pie` | Donut; donut=0 = pizza sólida | ≤100 classes |
| `bar` | Colunas agrupadas; stack=1 empilhadas | ≤30 grupos |
| `hbar` | Barras horizontais (rankings) | ≤30 barras |
| `line` | Linha suave + gradiente | ≤60 pontos |
| `area` | Área / multi-área | ≤60 pontos |
| `radar` | Radar | 3–12 eixos |
| `gauge` | Medidor (arco 240°) | value+max; anéis ≤8 |
| `scatter` | Dispersão, negativos ok | ≤200 pontos |
| `combo` | Barras + linha, eixo duplo | ≤6 séries |
| `sankey` | Diagrama de fluxo | ≤24 nós |
| `qr` | QR Code | ≤1000 caracteres |

---

Documentação completa (inglês): [README (EN)](../README.md) · [docs](../docs/) — Código Apache-2.0; fontes OFL.
