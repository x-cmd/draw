---
x-title: hbar bare orizontale — x-cmd/draw
x-desc: Grafice SVG pentru era AI: un singur endpoint `/draw?type=. type=hbar.
x-sidebar: draw
x-keywords: draw, hbar, bare orizontale, svg, chart
---

# hbar bare orizontale

`GET /draw?type=hbar&...` — randează un grafic

## Exemple

**base**

```text
https://x-cmd.com/draw?type=hbar&labels=CLI,nucleu,documenta%C8%9Bie,UI&values=42,31,18,9&title=Commit-uri%20pe%20zone
```

![hbar base](https://x-cmd.com/draw?type=hbar&labels=CLI,nucleu,documenta%C8%9Bie,UI&values=42,31,18,9&title=Commit-uri%20pe%20zone)

**opendata**

```text
https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,nucleu,documenta%C8%9Bie,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=Commit-uri%20pe%20zone
```

![hbar opendata](https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,nucleu,documenta%C8%9Bie,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=Commit-uri%20pe%20zone)

**xcmd**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd&labels=Bucure%C8%99ti,Cluj-Napoca,Timi%C8%99oara&values=68,21,11&title=Cele%20mai%20mari%20ora%C8%99e
```

![hbar xcmd](https://x-cmd.com/draw?type=hbar&t=xcmd&labels=Bucure%C8%99ti,Cluj-Napoca,Timi%C8%99oara&values=68,21,11&title=Cele%20mai%20mari%20ora%C8%99e)

**xcmd-issue**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,nucleu,documenta%C8%9Bie,ci,UI&series=deschise:12,8,15,4,9&series=%C3%AEnchise:38,52,20,11,26&title=Issue-uri%20pe%20zone
```

![hbar xcmd-issue](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,nucleu,documenta%C8%9Bie,ci,UI&series=deschise:12,8,15,4,9&series=%C3%AEnchise:38,52,20,11,26&title=Issue-uri%20pe%20zone)

**rank**

```text
https://x-cmd.com/draw?type=hbar&t=rank&labels=Lun,Mar,Mie&series=2025:80,95,110&series=2026:110,85,120&title=Desc%C4%83rc%C4%83ri%20s%C4%83pt%C4%83m%C3%A2nale
```

![hbar rank](https://x-cmd.com/draw?type=hbar&t=rank&labels=Lun,Mar,Mie&series=2025:80,95,110&series=2026:110,85,120&title=Desc%C4%83rc%C4%83ri%20s%C4%83pt%C4%83m%C3%A2nale)

## Parametri

| Parametri | | |
|---|---|---|
| `labels=` | etichete, separate prin virgule | ✓ |
| `values=` | valori, separate prin virgule | ✓ |
| `series=` | doar unele stiluri: 2 serii | ✗ |
| `ref=` | valoarea liniei de referință | ✗ |
| `reflabel=` | textul liniei de referință | ✗ |
| `t=` | familia stilului | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `opendata` |
| `xcmd` |
| `xcmd-issue` |
| `rank` |

## Capcane

- ≤30 bare, implicit o serie
- două serii doar cu `t=xcmd-issue` / `t=rank`
- codează spațiile din titlu ca `%20`
