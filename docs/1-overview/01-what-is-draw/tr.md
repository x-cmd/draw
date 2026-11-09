---
x-title: Türkçe — draw overview
x-desc: Yapay zekâ çağı için SVG grafikler: tek endpoint `/draw?type=.
x-sidebar: draw
x-keywords: draw, overview, svg, chart, api
---

# draw — Verileri URL’de taşıyan SVG grafikler

Yapay zekâ çağı için SVG grafikler: tek endpoint `/draw?type=...`, veriler URL’de ve her çıktıda makine tarafından okunabilir `<metadata>`. Stil sistemi bir tasarım spesifikasyonunu izler; her grafik türü için çeşitli varyantlar.

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

## Sürümleme

- `v` yok: en yeni sürüm, 300 sn önbellek
- `v=N`: sabit sürüm, 1 gün önbellek
- `immutable` yalnızca `/c/<hash>`

## YZ-dostu

Her SVG bir JSON gömer: `{generator, template, version, spec}` — veri ve parametreler doğrudan gider-döner; metin gerçek `<text>`.
