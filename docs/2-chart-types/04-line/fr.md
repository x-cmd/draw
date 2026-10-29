---
x-title: line courbe — x-cmd/draw
x-desc: Des graphiques SVG pour l’ère de l’IA : un seul endpoint `/draw?type=. type=line.
x-sidebar: draw
x-keywords: draw, line, courbe, svg, chart
---

# line courbe

`GET /draw?type=line&...` — rendre un graphique

## Exemples

**shadcn**

```text
https://x-cmd.com/draw?type=line&labels=Jan,F%C3%A9v,Mar,Avr,Mai,Juin&values=12,19,15,25,22,30&title=%C3%89toiles%20par%20langage
```

![line shadcn](https://x-cmd.com/draw?type=line&labels=Jan,F%C3%A9v,Mar,Avr,Mai,Juin&values=12,19,15,25,22,30&title=%C3%89toiles%20par%20langage)

**evil**

```text
https://x-cmd.com/draw?type=line&t=evil&labels=Jan,F%C3%A9v,Mar,Avr,Mai,Juin&series=T%C3%A9l%C3%A9chargements:12,19,15,25,22,30&series=CI:8,11,9,14,12,10
```

![line evil](https://x-cmd.com/draw?type=line&t=evil&labels=Jan,F%C3%A9v,Mar,Avr,Mai,Juin&series=T%C3%A9l%C3%A9chargements:12,19,15,25,22,30&series=CI:8,11,9,14,12,10)

**evil-glow**

```text
https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=Croissance
```

![line evil-glow](https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=Croissance)

**opendata**

```text
https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=T%C3%A9l%C3%A9chargements
```

![line opendata](https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=T%C3%A9l%C3%A9chargements)

## Paramètres

| Paramètres | | |
|---|---|---|
| `labels=` | étiquettes, séparées par des virgules | ✓ |
| `values=` | valeurs, séparées par des virgules | ✓ |
| `series=` | séries `nom:valeurs`, répétable | ✗ |
| `title=` | titre | ✗ |
| `t=` | famille de style | ✗ |

## `t=`

| | |
|---|---|
| `shadcn` |
| `evil` |
| `evil-glow` |
| `evil-mono` |
| `opendata` |

## Pièges

- ≤60 points ; avec plusieurs lignes, seul le pic de chacune est marqué
- encodez les espaces du titre en `%20`
