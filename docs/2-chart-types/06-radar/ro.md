---
x-title: radar radar — x-cmd/draw
x-desc: Grafice SVG pentru era AI: un singur endpoint `/draw?type=. type=radar.
x-sidebar: draw
x-keywords: draw, radar, radar, svg, chart
---

# radar radar

`GET /draw?type=radar&...` — randează un grafic

## Exemple

**base**

```text
https://x-cmd.com/draw?type=radar&labels=pornire,ecosistem,extensibilitate,memorie,u%C8%99urin%C8%9B%C4%83&values=85,90,70,80,95&title=Comparare%20editoare
```

![radar base](https://x-cmd.com/draw?type=radar&labels=pornire,ecosistem,extensibilitate,memorie,u%C8%99urin%C8%9B%C4%83&values=85,90,70,80,95&title=Comparare%20editoare)

**evil**

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=pornire,ecosistem,extensibilitate,memorie,u%C8%99urin%C8%9B%C4%83&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Comparare%20editoare
```

![radar evil](https://x-cmd.com/draw?type=radar&t=evil&labels=pornire,ecosistem,extensibilitate,memorie,u%C8%99urin%C8%9B%C4%83&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Comparare%20editoare)

**xcmd**

```text
https://x-cmd.com/draw?type=radar&t=xcmd&labels=pornire,ecosistem,extensibilitate,memorie,u%C8%99urin%C8%9B%C4%83&values=8,6,9,7,5&title=Comparare%20editoare
```

![radar xcmd](https://x-cmd.com/draw?type=radar&t=xcmd&labels=pornire,ecosistem,extensibilitate,memorie,u%C8%99urin%C8%9B%C4%83&values=8,6,9,7,5&title=Comparare%20editoare)

## Parametri

| Parametri | | |
|---|---|---|
| `labels=` | etichete, separate prin virgule | ✓ |
| `values=` | valori, separate prin virgule | ✓ |
| `series=` | serii `nume:valori`, repetabile | ✗ |
| `title=` | titlu | ✗ |
| `t=` | familia stilului | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `evil` |
| `xcmd` |

## Capcane

- 3–12 axe
- mai multe serii cer `t=evil`
- codează spațiile din titlu ca `%20`
