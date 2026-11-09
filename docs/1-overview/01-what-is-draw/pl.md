---
x-title: Polski — draw overview
x-desc: Wykresy SVG dla ery AI: jeden endpoint `/draw?type=.
x-sidebar: draw
x-keywords: draw, overview, svg, chart, api
---

# draw — Wykresy SVG z danymi w URL

Wykresy SVG dla ery AI: jeden endpoint `/draw?type=...`, dane w URL i maszynowo czytelny `<metadata>` w każdym wyniku. System stylów zgodny ze specyfikacją projektową, po kilka wariantów na typ wykresu.

## Endpointy

| type | | |
|---|---|---|
| `pie` | Pierścień; `donut=0` = pełne koło | ≤100 klas (>9 → Other) |
| `bar` | Słupki grupowane; `stack=1` skumulowane | ≤30 grup |
| `hbar` | Poziome słupki (rankingi) | ≤30 słupków |
| `line` | Gładka linia + gradient / wielolinie | ≤60 punktów |
| `area` | Obszar / wieloobszarowe | ≤60 punktów |
| `radar` | Radar | 3–12 osi |
| `gauge` | Wskaźnik (łuk 240°, wartość centralna) | value+max; pierścieni ≤8 |
| `scatter` | Rozrzut, dwie osie liczbowe, ujemne ok | x=&y=, ≤200 punktów |
| `combo` | Słupki (`series=`) + linia (`line=`); dwie osie od 5× różnicy | ≤30 grup, ≤6 serii |
| `sankey` | Diagram przepływów z szerokościami | labels=+links=A>B:30, ≤24 węzłów |
| `qr` | Kod QR | d≤1000 znaków, fg/bg, title/unit |

## Wersjonowanie

- bez `v`: najnowsza wersja, cache 300 s
- `v=N`: przypięta wersja, cache 1 dzień
- `immutable` tylko dla `/c/<hash>`

## Przyjazne AI

Każdy SVG osadza JSON: `{generator, template, version, spec}` — dane i parametry krążą bezpośrednio; tekst to prawdziwe `<text>`.
