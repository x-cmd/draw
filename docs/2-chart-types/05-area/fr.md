---
x-title: area aire — x-cmd/draw
x-desc: Des graphiques SVG pour l’ère de l’IA : un seul endpoint `/draw?type=. type=area.
x-sidebar: draw
x-keywords: draw, area, aire, svg, chart
---

# area aire

`GET /draw?type=area&...` — rendre un graphique

## Exemples

**evil**

```text
https://x-cmd.com/draw?type=area&labels=Lun,Mar,Mer&series=dev:30,42,38&series=CI:12,18,9&title=T%C3%A9l%C3%A9chargements
```

![area evil](https://x-cmd.com/draw?type=area&labels=Lun,Mar,Mer&series=dev:30,42,38&series=CI:12,18,9&title=T%C3%A9l%C3%A9chargements)

**star**

```text
https://x-cmd.com/draw?type=area&t=star&labels=Lun,Mar,Mer&values=3,5,4&title=Croissance
```

![area star](https://x-cmd.com/draw?type=area&t=star&labels=Lun,Mar,Mer&values=3,5,4&title=Croissance)

**opendata**

```text
https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=Croissance&source=x-cmd.com%2Fdraw
```

![area opendata](https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=Croissance&source=x-cmd.com%2Fdraw)

**pixel**

```text
https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=Croissance
```

![area pixel](https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=Croissance)

## Paramètres

| Paramètres | | |
|---|---|---|
| `labels=` | étiquettes, séparées par des virgules | ✓ |
| `values=` | valeurs, séparées par des virgules | ✓ |
| `series=` | séries `nom:valeurs`, répétable | ✗ |
| `source=` | source des données (area seulement) | ✗ |
| `subtitle=` | sous-titre éditorial (area opendata) | ✗ |
| `t=` | famille de style | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `star` |
| `opendata` |
| `pixel` |
| `polka` |

## Pièges

- ≤60 points ; avec plusieurs lignes, seul le pic de chacune est marqué
- encodez les espaces du titre en `%20`
