# draw — SVG-діаграми з даними в URL

> [English](../README.md) | **Українська**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)

Усі дані — в URL: відкрийте в браузері, вбудуйте через `<img>` чи вставте в README — SVG зрендериться одразу, а ШІ прочитає його напряму.

## Швидкий перегляд

### Кругова — найбільші міста

```text
https://x-cmd.com/draw?type=pie&title=%D0%9D%D0%B0%D1%81%D0%B5%D0%BB%D0%B5%D0%BD%D0%BD%D1%8F%20%D0%BD%D0%B0%D0%B9%D0%B1%D1%96%D0%BB%D1%8C%D1%88%D0%B8%D1%85%20%D0%BC%D1%96%D1%81%D1%82&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9A%D0%B8%D1%97%D0%B2,%D0%A5%D0%B0%D1%80%D0%BA%D1%96%D0%B2,%D0%9E%D0%B4%D0%B5%D1%81%D0%B0,%D0%94%D0%BD%D1%96%D0%BF%D1%80%D0%BE&values=3,1.4,1,1
```

![Кругова — найбільші міста](https://x-cmd.com/draw?type=pie&title=%D0%9D%D0%B0%D1%81%D0%B5%D0%BB%D0%B5%D0%BD%D0%BD%D1%8F%20%D0%BD%D0%B0%D0%B9%D0%B1%D1%96%D0%BB%D1%8C%D1%88%D0%B8%D1%85%20%D0%BC%D1%96%D1%81%D1%82&unit=%D0%BC%D0%BB%D0%BD&labels=%D0%9A%D0%B8%D1%97%D0%B2,%D0%A5%D0%B0%D1%80%D0%BA%D1%96%D0%B2,%D0%9E%D0%B4%D0%B5%D1%81%D0%B0,%D0%94%D0%BD%D1%96%D0%BF%D1%80%D0%BE&values=3,1.4,1,1)

### Стовпчики — рейтинг за областями

```text
https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=%D0%9A%D0%BE%D0%BC%D1%96%D1%82%D0%B8%20%D0%B7%D0%B0%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8F%D0%BC%D0%B8
```

![Стовпчики — рейтинг за областями](https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=%D0%9A%D0%BE%D0%BC%D1%96%D1%82%D0%B8%20%D0%B7%D0%B0%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8F%D0%BC%D0%B8)

### Комбінована — завантаження і зростання

```text
https://x-cmd.com/draw?type=combo&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80,%D0%A7%D1%82,%D0%9F%D1%82,%D0%A1%D0%B1,%D0%9D%D0%B4&series=%D0%97%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F:120,180,150,210,240,200,260&line=%D0%97%D1%80%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BD%D1%8F:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%D0%A2%D0%B8%D0%B6%D0%BD%D0%B5%D0%B2%D1%96%20%D0%B7%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F&unit=dl
```

![Комбінована — завантаження і зростання](https://x-cmd.com/draw?type=combo&labels=%D0%9F%D0%BD,%D0%92%D1%82,%D0%A1%D1%80,%D0%A7%D1%82,%D0%9F%D1%82,%D0%A1%D0%B1,%D0%9D%D0%B4&series=%D0%97%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F:120,180,150,210,240,200,260&line=%D0%97%D1%80%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BD%D1%8F:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%D0%A2%D0%B8%D0%B6%D0%BD%D0%B5%D0%B2%D1%96%20%D0%B7%D0%B0%D0%B2%D0%B0%D0%BD%D1%82%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F&unit=dl)

### Санкі — життєвий цикл PR

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs
```

![Санкі — життєвий цикл PR](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs)

## Три способи використання

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

## Усі типи діаграм

| type | | |
|---|---|---|
| `pie` | Кільце; donut=0 = суцільний | ≤100 класів |
| `bar` | Груповані стовпчики; stack=1 | ≤30 груп |
| `hbar` | Горизонтальні стовпчики | ≤30 смуг |
| `line` | Гладка лінія + градієнт | ≤60 точок |
| `area` | Площина / мультиплощина | ≤60 точок |
| `radar` | Радар | 3–12 осей |
| `gauge` | Індикатор (дуга 240°) | value+max; кілець ≤8 |
| `scatter` | Розсіювання, відємні ок | ≤200 точок |
| `combo` | Стовпчики + лінія, дві осі | ≤6 серій |
| `sankey` | Діаграма потоків | ≤24 вузли |
| `qr` | QR-код | ≤1000 символів |

---

Повна документація (англ.): [README (EN)](../README.md) · [docs](../docs/) — Код Apache-2.0; шрифти OFL.
