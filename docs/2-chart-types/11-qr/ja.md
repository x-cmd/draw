---
x-title: qr QR コード — x-cmd/draw
x-desc: AI 時代の SVG グラフ生成:単一エンドポイント `/draw?type=. type=qr.
x-sidebar: draw
x-keywords: draw, qr, QR コード, svg, chart
---

# qr QR コード

`GET /draw?type=qr&...` — グラフを描画

## 例

**base url**

```text
https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=%E3%82%B9%E3%82%AD%E3%83%A3%E3%83%B3
```

![qr base url](https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=%E3%82%B9%E3%82%AD%E3%83%A3%E3%83%B3)

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

## パラメータ

| パラメータ | | |
|---|---|---|
| `d=` | テキスト/URL(≤1000 文字) | ✓ |
| `fg=` | モジュール色(16 進) | ✗ |
| `bg=` | 背景色(16 進) | ✗ |
| `title=` | コード下のキャプション | ✗ |
| `unit=` | 小さめの補足行 | ✗ |
| `t=` | スタイルファミリー | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## 落とし穴

- テキスト ≤1000 文字。`#` は `%23` にエンコード
- タイトルの空白は `%20` にエンコード
