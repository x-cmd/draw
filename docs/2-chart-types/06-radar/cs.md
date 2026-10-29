---
x-title: radar radar — x-cmd/draw
x-desc: SVG grafy pro éru AI: jediný endpoint `/draw?type=. type=radar.
x-sidebar: draw
x-keywords: draw, radar, radar, svg, chart
---

# radar radar

`GET /draw?type=radar&...` — vykreslit graf

## Příklady

**base**

```text
https://x-cmd.com/draw?type=radar&labels=start,ekosyst%C3%A9m,roz%C5%A1i%C5%99itelnost,pam%C4%9B%C5%A5,jednoduchost&values=85,90,70,80,95&title=Porovn%C3%A1n%C3%AD%20editor%C5%AF
```

![radar base](https://x-cmd.com/draw?type=radar&labels=start,ekosyst%C3%A9m,roz%C5%A1i%C5%99itelnost,pam%C4%9B%C5%A5,jednoduchost&values=85,90,70,80,95&title=Porovn%C3%A1n%C3%AD%20editor%C5%AF)

**evil**

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=start,ekosyst%C3%A9m,roz%C5%A1i%C5%99itelnost,pam%C4%9B%C5%A5,jednoduchost&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Porovn%C3%A1n%C3%AD%20editor%C5%AF
```

![radar evil](https://x-cmd.com/draw?type=radar&t=evil&labels=start,ekosyst%C3%A9m,roz%C5%A1i%C5%99itelnost,pam%C4%9B%C5%A5,jednoduchost&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Porovn%C3%A1n%C3%AD%20editor%C5%AF)

**xcmd**

```text
https://x-cmd.com/draw?type=radar&t=xcmd&labels=start,ekosyst%C3%A9m,roz%C5%A1i%C5%99itelnost,pam%C4%9B%C5%A5,jednoduchost&values=8,6,9,7,5&title=Porovn%C3%A1n%C3%AD%20editor%C5%AF
```

![radar xcmd](https://x-cmd.com/draw?type=radar&t=xcmd&labels=start,ekosyst%C3%A9m,roz%C5%A1i%C5%99itelnost,pam%C4%9B%C5%A5,jednoduchost&values=8,6,9,7,5&title=Porovn%C3%A1n%C3%AD%20editor%C5%AF)

## Parametry

| Parametry | | |
|---|---|---|
| `labels=` | popisky, oddělené čárkami | ✓ |
| `values=` | hodnoty, oddělené čárkami | ✓ |
| `series=` | řady `název:hodnoty`, opakovatelné | ✗ |
| `title=` | název | ✗ |
| `t=` | rodina stylu | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `evil` |
| `xcmd` |

## Zádrhele

- 3–12 os
- více řad vyžaduje `t=evil`
- mezery v názvu kódujte jako `%20`
