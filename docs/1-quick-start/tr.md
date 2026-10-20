---
x-title: Türkçe — draw quick start
x-desc: Yapay zekâ çağı için SVG grafikler: tek endpoint `/draw?type=.
x-sidebar: draw
x-keywords: draw, quickstart, svg, chart
---

# draw — Verileri URL’de taşıyan SVG grafikler

Yapay zekâ çağı için SVG grafikler: tek endpoint `/draw?type=...`, veriler URL’de ve her çıktıda makine tarafından okunabilir `<metadata>`. Stil sistemi bir tasarım spesifikasyonunu izler; her grafik türü için çeşitli varyantlar.

## Önizleme

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

![pie](https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2)

## Üç kullanım yolu

**Hosted servis (kurulum yok)** · **npm kütüphanesi + CLI (çevrimdışı, eşzamanlı)** · Deno:

```ts
import { draw } from "jsr:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

## Endpoint’ler

| type | | |
|---|---|---|
| `pie` | Halka; `donut=0` = dolu pasta | ≤100 sınıf (>9 → Other) |
| `bar` | Gruplu kolonlar; `stack=1` istifli | ≤30 grup |
| `hbar` | Yatay çubuklar (sıralama) | ≤30 çubuk |
| `line` | Pürüzsüz çizgi + gradyan / çoklu çizgi | ≤60 nokta |
| `area` | Alan / çoklu alan | ≤60 nokta |
| `radar` | Radar | 3–12 eksen |
| `gauge` | Gösterge (240° yay, merkezde değer) | value+max; halka ≤8 |
| `scatter` | Saçılım, iki sayısal eksen, negatif ok | x=&y=, ≤200 nokta |
| `combo` | Kolon (`series=`) + çizgi (`line=`); 5× farktan itibaren çift eksen | ≤30 grup, ≤6 seri |
| `sankey` | Akış diyagramı (kalınlık = miktar) | labels=+links=A>B:30, ≤24 düğüm |
| `qr` | QR kod | d≤1000 karakter, fg/bg, title/unit |

Kod Apache-2.0; fontlar OFL — [README (EN)](../readme/en.md)
