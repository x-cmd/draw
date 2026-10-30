---
x-title: hbar vodorovné pruhy — x-cmd/draw
x-desc: SVG grafy pro éru AI: jediný endpoint `/draw?type=. type=hbar.
x-sidebar: draw
x-keywords: draw, hbar, vodorovné pruhy, svg, chart
---

# hbar vodorovné pruhy

`GET /draw?type=hbar&...` — vykreslit graf

## Příklady

**base**

```text
https://x-cmd.com/draw?type=hbar&labels=CLI,j%C3%A1dro,dokumentace,UI&values=42,31,18,9&title=Commity%20podle%20oblasti
```

![hbar base](https://x-cmd.com/draw?type=hbar&labels=CLI,j%C3%A1dro,dokumentace,UI&values=42,31,18,9&title=Commity%20podle%20oblasti)

**opendata**

```text
https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,j%C3%A1dro,dokumentace,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=Commity%20podle%20oblasti
```

![hbar opendata](https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,j%C3%A1dro,dokumentace,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=Commity%20podle%20oblasti)

**xcmd**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd&labels=Praha,Brno,Ostrava&values=68,21,11&title=Nejv%C4%9Bt%C5%A1%C3%AD%20m%C4%9Bsta
```

![hbar xcmd](https://x-cmd.com/draw?type=hbar&t=xcmd&labels=Praha,Brno,Ostrava&values=68,21,11&title=Nejv%C4%9Bt%C5%A1%C3%AD%20m%C4%9Bsta)

**xcmd-issue**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,j%C3%A1dro,dokumentace,ci,UI&series=otev%C5%99en%C3%A9:12,8,15,4,9&series=zav%C5%99en%C3%A9:38,52,20,11,26&title=Issue%20podle%20oblasti
```

![hbar xcmd-issue](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,j%C3%A1dro,dokumentace,ci,UI&series=otev%C5%99en%C3%A9:12,8,15,4,9&series=zav%C5%99en%C3%A9:38,52,20,11,26&title=Issue%20podle%20oblasti)

**rank**

```text
https://x-cmd.com/draw?type=hbar&t=rank&labels=Po,%C3%9At,St&series=2025:80,95,110&series=2026:110,85,120&title=T%C3%BDdenn%C3%AD%20sta%C5%BEen%C3%AD
```

![hbar rank](https://x-cmd.com/draw?type=hbar&t=rank&labels=Po,%C3%9At,St&series=2025:80,95,110&series=2026:110,85,120&title=T%C3%BDdenn%C3%AD%20sta%C5%BEen%C3%AD)

## Parametry

| Parametry | | |
|---|---|---|
| `labels=` | popisky, oddělené čárkami | ✓ |
| `values=` | hodnoty, oddělené čárkami | ✓ |
| `series=` | jen některé styly: 2 řady | ✗ |
| `ref=` | hodnota referenční čáry | ✗ |
| `reflabel=` | popisek referenční čáry | ✗ |
| `t=` | rodina stylu | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `opendata` |
| `xcmd` |
| `xcmd-issue` |
| `rank` |

## Zádrhele

- ≤30 pruhů, výchozí jedna řada
- dvě řady jen s `t=xcmd-issue` / `t=rank`
- mezery v názvu kódujte jako `%20`
