---
x-title: Deutsch — draw overview
x-desc: SVG-Diagramme für das KI-Zeitalter: ein Endpunkt `/draw?type=.
x-sidebar: draw
x-keywords: draw, overview, svg, chart, api
---

# draw — SVG-Diagramme, deren Daten in der URL leben

SVG-Diagramme für das KI-Zeitalter: ein Endpunkt `/draw?type=...`, Daten in der URL, maschinenlesbarer `<metadata>` in jeder Ausgabe. Das Stilsystem folgt einer Designer-Spezifikation, mit mehreren Stilvarianten pro Diagrammtyp.

## Endpunkte

| type | | |
|---|---|---|
| `pie` | Donut; `donut=0` = volle Kreis | ≤100 Klassen (>9 → Other) |
| `bar` | Gruppierte Säulen; `stack=1` gestapelt | ≤30 Gruppen |
| `hbar` | Horizontale Balken (Rankings) | ≤30 Balken |
| `line` | Glatte Linie + Verlauf / Mehrfachlinien | ≤60 Punkte |
| `area` | Fläche / Mehrfach-Flächen | ≤60 Punkte |
| `radar` | Radar | 3–12 Achsen |
| `gauge` | Messuhr (240°-Bogen, Mittelwert) | value+max; Ringe ≤8 |
| `scatter` | Streuung, zwei numerische Achsen, Negative ok | x=&y=, ≤200 Punkte |
| `combo` | Säulen (`series=`) + Linie (`line=`); Doppelachse ab 5× Spanne | ≤30 Gruppen, ≤6 Serien |
| `sankey` | Flussdiagramm mit Bandbreiten | labels=+links=A>B:30, ≤24 Knoten |
| `qr` | QR-Code | d≤1000 Zeichen, fg/bg, title/unit |

## Versionierung

- ohne `v`: neueste Version, 300 s Cache
- `v=N`: Version angeheftet, 1 Tag Cache
- `immutable` nur für Kurzlinks `/c/<hash>`

## KI-freundlich

Jedes SVG bettet JSON ein: `{generator, template, version, spec}` — Daten und Parameter sind direkt round-trip-fähig; Text bleibt echtes `<text>`.
