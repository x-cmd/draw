# draw — Verileri URL’de taşıyan SVG grafikler

> [English](../README.md) | **Türkçe**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)

Tüm veriler URL’nin içinde — tarayıcıda aç, `<img>` ile göm veya README’ye yapıştır: SVG anında çizilir ve yapay zekâ doğrudan okuyabilir.

## Önizleme

### Pasta — en büyük şehirler

```text
https://x-cmd.com/draw?type=pie&title=En%20b%C3%BCy%C3%BCk%20%C5%9Fehirlerin%20n%C3%BCfusu&unit=mn&labels=%C4%B0stanbul,Ankara,%C4%B0zmir,Bursa&values=15.8,5.8,4.4,2.1
```

![Pasta — en büyük şehirler](https://x-cmd.com/draw?type=pie&title=En%20b%C3%BCy%C3%BCk%20%C5%9Fehirlerin%20n%C3%BCfusu&unit=mn&labels=%C4%B0stanbul,Ankara,%C4%B0zmir,Bursa&values=15.8,5.8,4.4,2.1)

### Çubuk — alana göre sıralama

```text
https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Alana%20g%C3%B6re%20commit%E2%80%99ler
```

![Çubuk — alana göre sıralama](https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Alana%20g%C3%B6re%20commit%E2%80%99ler)

### Kombine — indirme ve büyüme

```text
https://x-cmd.com/draw?type=combo&labels=Pzt,Sal,%C3%87ar,Per,Cum,Cmt,Paz&series=%C4%B0ndirme:120,180,150,210,240,200,260&line=B%C3%BCy%C3%BCme:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Haftal%C4%B1k%20indirmeler&unit=dl
```

![Kombine — indirme ve büyüme](https://x-cmd.com/draw?type=combo&labels=Pzt,Sal,%C3%87ar,Per,Cum,Cmt,Paz&series=%C4%B0ndirme:120,180,150,210,240,200,260&line=B%C3%BCy%C3%BCme:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Haftal%C4%B1k%20indirmeler&unit=dl)

### Sankey — PR yaşam döngüsü

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs
```

![Sankey — PR yaşam döngüsü](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs)

## Üç kullanım yolu

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

## Tüm grafik türleri

| type | | |
|---|---|---|
| `pie` | Halka; donut=0 = dolu pasta | ≤100 sınıf |
| `bar` | Gruplu kolonlar; stack=1 | ≤30 grup |
| `hbar` | Yatay çubuklar (sıralama) | ≤30 çubuk |
| `line` | Pürüzsüz çizgi + gradyan | ≤60 nokta |
| `area` | Alan / çoklu alan | ≤60 nokta |
| `radar` | Radar | 3–12 eksen |
| `gauge` | Gösterge (240° yay) | value+max; halka ≤8 |
| `scatter` | Saçılım, negatif ok | ≤200 nokta |
| `combo` | Kolon + çizgi, çift eksen | ≤6 seri |
| `sankey` | Akış diyagramı | ≤24 düğüm |
| `qr` | QR kod | ≤1000 karakter |

---

Tam dokümantasyon (İngilizce): [README (EN)](../README.md) · [docs](../docs/) — Kod Apache-2.0; fontlar OFL.
