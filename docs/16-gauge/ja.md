---
x-title: gauge ゲージ — x-cmd/draw
x-desc: AI 時代の SVG グラフ生成:単一エンドポイント `/draw?type=. type=gauge.
x-sidebar: draw
x-keywords: draw, gauge, ゲージ, svg, chart
---

# gauge ゲージ

`GET /draw?type=gauge&...` — グラフを描画

## 例

**base**

```text
https://x-cmd.com/draw?type=gauge&title=CI%20%E6%88%90%E5%8A%9F%E7%8E%87&value=87&max=100
```

![gauge base](https://x-cmd.com/draw?type=gauge&title=CI%20%E6%88%90%E5%8A%9F%E7%8E%87&value=87&max=100)

**gradient**

```text
https://x-cmd.com/draw?type=gauge&t=gradient&title=CI%20%E6%88%90%E5%8A%9F%E7%8E%87&value=87&max=100
```

![gauge gradient](https://x-cmd.com/draw?type=gauge&t=gradient&title=CI%20%E6%88%90%E5%8A%9F%E7%8E%87&value=87&max=100)

**reliability**

```text
https://x-cmd.com/draw?type=gauge&t=reliability&title=CI%20%E6%88%90%E5%8A%9F%E7%8E%87&value=99.9&max=100
```

![gauge reliability](https://x-cmd.com/draw?type=gauge&t=reliability&title=CI%20%E6%88%90%E5%8A%9F%E7%8E%87&value=99.9&max=100)

## パラメータ

| パラメータ | | |
|---|---|---|
| `value=` | 現在値 | ✓ |
| `max=` | 最大値(既定 100) | ✗ |
| `labels=` | リングラベル(多リング) | ✗ |
| `values=` | リング値(パーセント) | ✗ |
| `title=` | タイトル | ✗ |
| `t=` | スタイルファミリー | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `gradient` |
| `reliability` |

## 落とし穴

- 1 グラフ 1 値。複数値は combo/line へ
- タイトルの空白は `%20` にエンコード
