---
x-title: hbar barres horizontales — x-cmd/draw
x-desc: Des graphiques SVG pour l’ère de l’IA : un seul endpoint `/draw?type=. type=hbar.
x-sidebar: draw
x-keywords: draw, hbar, barres horizontales, svg, chart
---

# hbar barres horizontales

`GET /draw?type=hbar&...` — rendre un graphique

## Exemples

**base**

```text
https://x-cmd.com/draw?type=hbar&labels=CLI,c%C5%93ur,documentation,UI&values=42,31,18,9&title=Commits%20par%20domaine
```

![hbar base](https://x-cmd.com/draw?type=hbar&labels=CLI,c%C5%93ur,documentation,UI&values=42,31,18,9&title=Commits%20par%20domaine)

**opendata**

```text
https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,c%C5%93ur,documentation,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=Commits%20par%20domaine
```

![hbar opendata](https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,c%C5%93ur,documentation,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=Commits%20par%20domaine)

**xcmd**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd&labels=Paris,Marseille,Lyon&values=68,21,11&title=Plus%20grandes%20villes
```

![hbar xcmd](https://x-cmd.com/draw?type=hbar&t=xcmd&labels=Paris,Marseille,Lyon&values=68,21,11&title=Plus%20grandes%20villes)

**xcmd-issue**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,c%C5%93ur,documentation,ci,UI&series=ouvertes:12,8,15,4,9&series=ferm%C3%A9es:38,52,20,11,26&title=Issues%20par%20domaine
```

![hbar xcmd-issue](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,c%C5%93ur,documentation,ci,UI&series=ouvertes:12,8,15,4,9&series=ferm%C3%A9es:38,52,20,11,26&title=Issues%20par%20domaine)

**rank**

```text
https://x-cmd.com/draw?type=hbar&t=rank&labels=Lun,Mar,Mer&series=2025:80,95,110&series=2026:110,85,120&title=T%C3%A9l%C3%A9chargements%20hebdo
```

![hbar rank](https://x-cmd.com/draw?type=hbar&t=rank&labels=Lun,Mar,Mer&series=2025:80,95,110&series=2026:110,85,120&title=T%C3%A9l%C3%A9chargements%20hebdo)

## Paramètres

| Paramètres | | |
|---|---|---|
| `labels=` | étiquettes, séparées par des virgules | ✓ |
| `values=` | valeurs, séparées par des virgules | ✓ |
| `series=` | certains styles seulement : 2 séries | ✗ |
| `ref=` | valeur de la ligne de référence | ✗ |
| `reflabel=` | texte de la ligne de référence | ✗ |
| `t=` | famille de style | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `opendata` |
| `xcmd` |
| `xcmd-issue` |
| `rank` |

## Pièges

- ≤30 barres, une seule série par défaut
- deux séries uniquement avec `t=xcmd-issue` / `t=rank`
- encodez les espaces du titre en `%20`
