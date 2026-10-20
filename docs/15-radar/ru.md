---
x-title: radar радар — x-cmd/draw
x-desc: SVG-графики для эпохи ИИ: один эндпоинт `/draw?type=. type=radar.
x-sidebar: draw
x-keywords: draw, radar, радар, svg, chart
---

# radar радар

`GET /draw?type=radar&...` — отрисовать график

## Примеры

**base**

```text
https://x-cmd.com/draw?type=radar&labels=%D0%B7%D0%B0%D0%BF%D1%83%D1%81%D0%BA,%D1%8D%D0%BA%D0%BE%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%B0,%D1%80%D0%B0%D1%81%D1%88%D0%B8%D1%80%D1%8F%D0%B5%D0%BC%D0%BE%D1%81%D1%82%D1%8C,%D0%BF%D0%B0%D0%BC%D1%8F%D1%82%D1%8C,%D0%BF%D1%80%D0%BE%D1%81%D1%82%D0%BE%D1%82%D0%B0&values=85,90,70,80,95&title=%D0%A1%D1%80%D0%B0%D0%B2%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%80%D0%B5%D0%B4%D0%B0%D0%BA%D1%82%D0%BE%D1%80%D0%BE%D0%B2
```

![radar base](https://x-cmd.com/draw?type=radar&labels=%D0%B7%D0%B0%D0%BF%D1%83%D1%81%D0%BA,%D1%8D%D0%BA%D0%BE%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%B0,%D1%80%D0%B0%D1%81%D1%88%D0%B8%D1%80%D1%8F%D0%B5%D0%BC%D0%BE%D1%81%D1%82%D1%8C,%D0%BF%D0%B0%D0%BC%D1%8F%D1%82%D1%8C,%D0%BF%D1%80%D0%BE%D1%81%D1%82%D0%BE%D1%82%D0%B0&values=85,90,70,80,95&title=%D0%A1%D1%80%D0%B0%D0%B2%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%80%D0%B5%D0%B4%D0%B0%D0%BA%D1%82%D0%BE%D1%80%D0%BE%D0%B2)

**evil**

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=%D0%B7%D0%B0%D0%BF%D1%83%D1%81%D0%BA,%D1%8D%D0%BA%D0%BE%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%B0,%D1%80%D0%B0%D1%81%D1%88%D0%B8%D1%80%D1%8F%D0%B5%D0%BC%D0%BE%D1%81%D1%82%D1%8C,%D0%BF%D0%B0%D0%BC%D1%8F%D1%82%D1%8C,%D0%BF%D1%80%D0%BE%D1%81%D1%82%D0%BE%D1%82%D0%B0&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=%D0%A1%D1%80%D0%B0%D0%B2%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%80%D0%B5%D0%B4%D0%B0%D0%BA%D1%82%D0%BE%D1%80%D0%BE%D0%B2
```

![radar evil](https://x-cmd.com/draw?type=radar&t=evil&labels=%D0%B7%D0%B0%D0%BF%D1%83%D1%81%D0%BA,%D1%8D%D0%BA%D0%BE%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%B0,%D1%80%D0%B0%D1%81%D1%88%D0%B8%D1%80%D1%8F%D0%B5%D0%BC%D0%BE%D1%81%D1%82%D1%8C,%D0%BF%D0%B0%D0%BC%D1%8F%D1%82%D1%8C,%D0%BF%D1%80%D0%BE%D1%81%D1%82%D0%BE%D1%82%D0%B0&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=%D0%A1%D1%80%D0%B0%D0%B2%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%80%D0%B5%D0%B4%D0%B0%D0%BA%D1%82%D0%BE%D1%80%D0%BE%D0%B2)

**xcmd**

```text
https://x-cmd.com/draw?type=radar&t=xcmd&labels=%D0%B7%D0%B0%D0%BF%D1%83%D1%81%D0%BA,%D1%8D%D0%BA%D0%BE%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%B0,%D1%80%D0%B0%D1%81%D1%88%D0%B8%D1%80%D1%8F%D0%B5%D0%BC%D0%BE%D1%81%D1%82%D1%8C,%D0%BF%D0%B0%D0%BC%D1%8F%D1%82%D1%8C,%D0%BF%D1%80%D0%BE%D1%81%D1%82%D0%BE%D1%82%D0%B0&values=8,6,9,7,5&title=%D0%A1%D1%80%D0%B0%D0%B2%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%80%D0%B5%D0%B4%D0%B0%D0%BA%D1%82%D0%BE%D1%80%D0%BE%D0%B2
```

![radar xcmd](https://x-cmd.com/draw?type=radar&t=xcmd&labels=%D0%B7%D0%B0%D0%BF%D1%83%D1%81%D0%BA,%D1%8D%D0%BA%D0%BE%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%B0,%D1%80%D0%B0%D1%81%D1%88%D0%B8%D1%80%D1%8F%D0%B5%D0%BC%D0%BE%D1%81%D1%82%D1%8C,%D0%BF%D0%B0%D0%BC%D1%8F%D1%82%D1%8C,%D0%BF%D1%80%D0%BE%D1%81%D1%82%D0%BE%D1%82%D0%B0&values=8,6,9,7,5&title=%D0%A1%D1%80%D0%B0%D0%B2%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%80%D0%B5%D0%B4%D0%B0%D0%BA%D1%82%D0%BE%D1%80%D0%BE%D0%B2)

## Параметры

| Параметры | | |
|---|---|---|
| `labels=` | метки, через запятую | ✓ |
| `values=` | значения, через запятую | ✓ |
| `series=` | серии `имя:значения`, можно повторять | ✗ |
| `title=` | заголовок | ✗ |
| `t=` | семейство стиля | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `evil` |
| `xcmd` |

## Подводные камни

- 3–12 осей
- несколько серий требуют `t=evil`
- пробелы в заголовке кодируйте как `%20`
