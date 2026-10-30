---
x-title: hbar poziomy — x-cmd/draw
x-desc: Wykresy SVG dla ery AI: jeden endpoint `/draw?type=. type=hbar.
x-sidebar: draw
x-keywords: draw, hbar, poziomy, svg, chart
---

# hbar poziomy

`GET /draw?type=hbar&...` — wyrenderować wykres

## Przykłady

**base**

```text
https://x-cmd.com/draw?type=hbar&labels=CLI,rdze%C5%84,dokumentacja,UI&values=42,31,18,9&title=Commity%20po%20obszarach
```

![hbar base](https://x-cmd.com/draw?type=hbar&labels=CLI,rdze%C5%84,dokumentacja,UI&values=42,31,18,9&title=Commity%20po%20obszarach)

**opendata**

```text
https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,rdze%C5%84,dokumentacja,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=Commity%20po%20obszarach
```

![hbar opendata](https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,rdze%C5%84,dokumentacja,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=Commity%20po%20obszarach)

**xcmd**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd&labels=Warszawa,Krak%C3%B3w,Wroc%C5%82aw&values=68,21,11&title=Najwi%C4%99ksze%20miasta
```

![hbar xcmd](https://x-cmd.com/draw?type=hbar&t=xcmd&labels=Warszawa,Krak%C3%B3w,Wroc%C5%82aw&values=68,21,11&title=Najwi%C4%99ksze%20miasta)

**xcmd-issue**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,rdze%C5%84,dokumentacja,ci,UI&series=otwarte:12,8,15,4,9&series=zamkni%C4%99te:38,52,20,11,26&title=Issues%20po%20obszarach
```

![hbar xcmd-issue](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,rdze%C5%84,dokumentacja,ci,UI&series=otwarte:12,8,15,4,9&series=zamkni%C4%99te:38,52,20,11,26&title=Issues%20po%20obszarach)

**rank**

```text
https://x-cmd.com/draw?type=hbar&t=rank&labels=Pon,Wt,%C5%9Ar&series=2025:80,95,110&series=2026:110,85,120&title=Tygodniowe%20pobrania
```

![hbar rank](https://x-cmd.com/draw?type=hbar&t=rank&labels=Pon,Wt,%C5%9Ar&series=2025:80,95,110&series=2026:110,85,120&title=Tygodniowe%20pobrania)

## Parametry

| Parametry | | |
|---|---|---|
| `labels=` | etykiety, oddzielone przecinkami | ✓ |
| `values=` | wartości, oddzielone przecinkami | ✓ |
| `series=` | tylko niektóre style: 2 serie | ✗ |
| `ref=` | wartość linii odniesienia | ✗ |
| `reflabel=` | opis linii odniesienia | ✗ |
| `t=` | rodzina stylu | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `opendata` |
| `xcmd` |
| `xcmd-issue` |
| `rank` |

## Pułapki

- ≤30 słupków, domyślnie jedna seria
- dwie serie tylko z `t=xcmd-issue` / `t=rank`
- spacje w tytule koduj jako `%20`
