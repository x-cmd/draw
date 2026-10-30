---
x-title: qr QR-код — x-cmd/draw
x-desc: SVG-графики для эпохи ИИ: один эндпоинт `/draw?type=. type=qr.
x-sidebar: draw
x-keywords: draw, qr, QR-код, svg, chart
---

# qr QR-код

`GET /draw?type=qr&...` — отрисовать график

## Примеры

**base url**

```text
https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=%D0%BE%D1%82%D1%81%D0%BA%D0%B0%D0%BD%D0%B8%D1%80%D1%83%D0%B9
```

![qr base url](https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=%D0%BE%D1%82%D1%81%D0%BA%D0%B0%D0%BD%D0%B8%D1%80%D1%83%D0%B9)

**base wifi**

```text
https://x-cmd.com/draw?type=qr&d=WIFI%3AS%3AMyWiFi%3BT%3AWPA%3BP%3Apassword123%3B%3B&title=wifi
```

![qr base wifi](https://x-cmd.com/draw?type=qr&d=WIFI%3AS%3AMyWiFi%3BT%3AWPA%3BP%3Apassword123%3B%3B&title=wifi)

**base color**

```text
https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fx-cmd.com&fg=%236366f1&bg=%230f0f12&title=x-cmd
```

![qr base color](https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fx-cmd.com&fg=%236366f1&bg=%230f0f12&title=x-cmd)

## Параметры

| Параметры | | |
|---|---|---|
| `d=` | текст/URL (≤1000 символов) | ✓ |
| `fg=` | цвет модулей (hex) | ✗ |
| `bg=` | фон (hex) | ✗ |
| `title=` | подпись под кодом | ✗ |
| `unit=` | маленькая строка | ✗ |
| `t=` | семейство стиля | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## Подводные камни

- текст ≤1000 символов; `#` кодируйте как `%23`
- пробелы в заголовке кодируйте как `%20`
