---
x-title: radar radar — x-cmd/draw
x-desc: Wykresy SVG dla ery AI: jeden endpoint `/draw?type=. type=radar.
x-sidebar: draw
x-keywords: draw, radar, radar, svg, chart
---

# radar radar

`GET /draw?type=radar&...` — wyrenderować wykres

## Przykłady

**base**

```text
https://x-cmd.com/draw?type=radar&labels=start,ekosystem,rozszerzalno%C5%9B%C4%87,pami%C4%99%C4%87,%C5%82atwo%C5%9B%C4%87&values=85,90,70,80,95&title=Por%C3%B3wnanie%20edytor%C3%B3w
```

![radar base](https://x-cmd.com/draw?type=radar&labels=start,ekosystem,rozszerzalno%C5%9B%C4%87,pami%C4%99%C4%87,%C5%82atwo%C5%9B%C4%87&values=85,90,70,80,95&title=Por%C3%B3wnanie%20edytor%C3%B3w)

**evil**

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=start,ekosystem,rozszerzalno%C5%9B%C4%87,pami%C4%99%C4%87,%C5%82atwo%C5%9B%C4%87&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Por%C3%B3wnanie%20edytor%C3%B3w
```

![radar evil](https://x-cmd.com/draw?type=radar&t=evil&labels=start,ekosystem,rozszerzalno%C5%9B%C4%87,pami%C4%99%C4%87,%C5%82atwo%C5%9B%C4%87&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Por%C3%B3wnanie%20edytor%C3%B3w)

**xcmd**

```text
https://x-cmd.com/draw?type=radar&t=xcmd&labels=start,ekosystem,rozszerzalno%C5%9B%C4%87,pami%C4%99%C4%87,%C5%82atwo%C5%9B%C4%87&values=8,6,9,7,5&title=Por%C3%B3wnanie%20edytor%C3%B3w
```

![radar xcmd](https://x-cmd.com/draw?type=radar&t=xcmd&labels=start,ekosystem,rozszerzalno%C5%9B%C4%87,pami%C4%99%C4%87,%C5%82atwo%C5%9B%C4%87&values=8,6,9,7,5&title=Por%C3%B3wnanie%20edytor%C3%B3w)

## Parametry

| Parametry | | |
|---|---|---|
| `labels=` | etykiety, oddzielone przecinkami | ✓ |
| `values=` | wartości, oddzielone przecinkami | ✓ |
| `series=` | serie `nazwa:wartości`, powtarzalne | ✗ |
| `title=` | tytuł | ✗ |
| `t=` | rodzina stylu | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `evil` |
| `xcmd` |

## Pułapki

- 3–12 osi
- wiele serii wymaga `t=evil`
- spacje w tytule koduj jako `%20`
