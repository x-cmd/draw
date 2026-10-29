---
x-title: radar radar — x-cmd/draw
x-desc: Des graphiques SVG pour l’ère de l’IA : un seul endpoint `/draw?type=. type=radar.
x-sidebar: draw
x-keywords: draw, radar, radar, svg, chart
---

# radar radar

`GET /draw?type=radar&...` — rendre un graphique

## Exemples

**base**

```text
https://x-cmd.com/draw?type=radar&labels=d%C3%A9marrage,%C3%A9cosyst%C3%A8me,extensibilit%C3%A9,m%C3%A9moire,simplicit%C3%A9&values=85,90,70,80,95&title=Comparaison%20d%E2%80%99%C3%A9diteurs
```

![radar base](https://x-cmd.com/draw?type=radar&labels=d%C3%A9marrage,%C3%A9cosyst%C3%A8me,extensibilit%C3%A9,m%C3%A9moire,simplicit%C3%A9&values=85,90,70,80,95&title=Comparaison%20d%E2%80%99%C3%A9diteurs)

**evil**

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=d%C3%A9marrage,%C3%A9cosyst%C3%A8me,extensibilit%C3%A9,m%C3%A9moire,simplicit%C3%A9&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Comparaison%20d%E2%80%99%C3%A9diteurs
```

![radar evil](https://x-cmd.com/draw?type=radar&t=evil&labels=d%C3%A9marrage,%C3%A9cosyst%C3%A8me,extensibilit%C3%A9,m%C3%A9moire,simplicit%C3%A9&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Comparaison%20d%E2%80%99%C3%A9diteurs)

**xcmd**

```text
https://x-cmd.com/draw?type=radar&t=xcmd&labels=d%C3%A9marrage,%C3%A9cosyst%C3%A8me,extensibilit%C3%A9,m%C3%A9moire,simplicit%C3%A9&values=8,6,9,7,5&title=Comparaison%20d%E2%80%99%C3%A9diteurs
```

![radar xcmd](https://x-cmd.com/draw?type=radar&t=xcmd&labels=d%C3%A9marrage,%C3%A9cosyst%C3%A8me,extensibilit%C3%A9,m%C3%A9moire,simplicit%C3%A9&values=8,6,9,7,5&title=Comparaison%20d%E2%80%99%C3%A9diteurs)

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
| `base` |
| `evil` |
| `xcmd` |

## Pièges

- 3–12 axes
- plusieurs séries exigent `t=evil`
- encodez les espaces du titre en `%20`
