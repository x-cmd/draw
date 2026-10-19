# draw — SVG-графики с данными в URL

> [English](../README.md) | **Русский**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)

Все данные живут в URL — откройте в браузере, вставьте как `<img>` или добавьте в README: SVG отрисуется мгновенно, а ИИ прочитает его напрямую.

## Превью

### Круговая — крупнейшие города

```text
https://x-cmd.com/draw?type=pie&title=%D0%9D%D0%B0%D1%81%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BA%D1%80%D1%83%D0%BF%D0%BD%D0%B5%D0%B9%D1%88%D0%B8%D1%85%20%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%BE%D0%B2&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0,%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3,%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D0%B8%D0%B1%D0%B8%D1%80%D1%81%D0%BA,%D0%95%D0%BA%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B1%D1%83%D1%80%D0%B3&values=12.6,5.4,1.6,1.5
```

![Круговая — крупнейшие города](https://x-cmd.com/draw?type=pie&title=%D0%9D%D0%B0%D1%81%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BA%D1%80%D1%83%D0%BF%D0%BD%D0%B5%D0%B9%D1%88%D0%B8%D1%85%20%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%BE%D0%B2&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0,%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3,%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D0%B8%D0%B1%D0%B8%D1%80%D1%81%D0%BA,%D0%95%D0%BA%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B1%D1%83%D1%80%D0%B3&values=12.6,5.4,1.6,1.5)

### Полосы — рейтинг по областям

```text
https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=%D0%9A%D0%BE%D0%BC%D0%BC%D0%B8%D1%82%D1%8B%20%D0%BF%D0%BE%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8F%D0%BC
```

![Полосы — рейтинг по областям](https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=%D0%9A%D0%BE%D0%BC%D0%BC%D0%B8%D1%82%D1%8B%20%D0%BF%D0%BE%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8F%D0%BC)

### Комбинированный — загрузки и рост

```text
https://x-cmd.com/draw?type=combo&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80,%D0%A7%D1%82,%D0%9F%D1%82,%D0%A1%D0%B1,%D0%92%D1%81&series=%D0%97%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8:120,180,150,210,240,200,260&line=%D0%A0%D0%BE%D1%81%D1%82:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%D0%9D%D0%B5%D0%B4%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8&unit=dl
```

![Комбинированный — загрузки и рост](https://x-cmd.com/draw?type=combo&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80,%D0%A7%D1%82,%D0%9F%D1%82,%D0%A1%D0%B1,%D0%92%D1%81&series=%D0%97%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8:120,180,150,210,240,200,260&line=%D0%A0%D0%BE%D1%81%D1%82:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%D0%9D%D0%B5%D0%B4%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8&unit=dl)

### Санки — жизненный цикл PR

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs
```

![Санки — жизненный цикл PR](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs)

## Три способа использования

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

## Все типы графиков

| type | | |
|---|---|---|
| `pie` | Кольцо; donut=0 = сплошной | ≤100 классов |
| `bar` | Групповые столбцы; stack=1 | ≤30 групп |
| `hbar` | Горизонтальные полосы | ≤30 полос |
| `line` | Гладкая линия + градиент | ≤60 точек |
| `area` | Область / мультиобласть | ≤60 точек |
| `radar` | Радар | 3–12 осей |
| `gauge` | Индикатор (дуга 240°) | value+max; колец ≤8 |
| `scatter` | Разброс, отрицательные ок | ≤200 точек |
| `combo` | Столбцы + линия, две оси | ≤6 серий |
| `sankey` | Диаграмма потоков | ≤24 узлов |
| `qr` | QR-код | ≤1000 символов |

---

Полная документация (англ.): [README (EN)](../README.md) · [docs](../docs/) — Код Apache-2.0; шрифты OFL.
