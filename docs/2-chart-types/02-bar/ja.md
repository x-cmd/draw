---
x-title: bar 縦棒 — x-cmd/draw
x-desc: AI 時代の SVG グラフ生成:単一エンドポイント `/draw?type=. type=bar.
x-sidebar: draw
x-keywords: draw, bar, 縦棒, svg, chart
---

# bar 縦棒

`GET /draw?type=bar&...` — グラフを描画

## 例

**evil**

```text
https://x-cmd.com/draw?type=bar&t=evil&labels=%E6%9C%88,%E7%81%AB,%E6%B0%B4,%E6%9C%A8,%E9%87%91,%E5%9C%9F,%E6%97%A5&series=%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89:34,87,51,63,45,78,39&series=%E6%88%90%E9%95%B7%E7%8E%87:18,49,29,39,31,45,23
```

![bar evil](https://x-cmd.com/draw?type=bar&t=evil&labels=%E6%9C%88,%E7%81%AB,%E6%B0%B4,%E6%9C%A8,%E9%87%91,%E5%9C%9F,%E6%97%A5&series=%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89:34,87,51,63,45,78,39&series=%E6%88%90%E9%95%B7%E7%8E%87:18,49,29,39,31,45,23)

**base**

```text
https://x-cmd.com/draw?type=bar&labels=%E6%9C%88,%E7%81%AB,%E6%B0%B4&series=dev:12,18,9&series=CI:8,11,6
```

![bar base](https://x-cmd.com/draw?type=bar&labels=%E6%9C%88,%E7%81%AB,%E6%B0%B4&series=dev:12,18,9&series=CI:8,11,6)

**grid**

```text
https://x-cmd.com/draw?type=bar&t=grid&labels=%E6%9C%88,%E7%81%AB,%E6%B0%B4&values=12,18,9
```

![bar grid](https://x-cmd.com/draw?type=bar&t=grid&labels=%E6%9C%88,%E7%81%AB,%E6%B0%B4&values=12,18,9)

**evil stack**

```text
https://x-cmd.com/draw?type=bar&stack=1&labels=%E6%9C%88,%E7%81%AB,%E6%B0%B4&series=dev:12,18,9&series=CI:8,11,6
```

![bar evil stack](https://x-cmd.com/draw?type=bar&stack=1&labels=%E6%9C%88,%E7%81%AB,%E6%B0%B4&series=dev:12,18,9&series=CI:8,11,6)

## パラメータ

| パラメータ | | |
|---|---|---|
| `labels=` | ラベル(カンマ区切り) | ✓ |
| `values=` | 値(カンマ区切り) | ✓ |
| `series=` | 系列 `名前:値`,繰り返し可 | ✗ |
| `stack=` | 1 = 積み上げ | ✗ |
| `title=` | タイトル | ✗ |
| `t=` | スタイルファミリー | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `base` |
| `grid` |

## 落とし穴

- ≤30 グループ, ≤6 系列
- 桁差が極端だと自動で 100% 積み上げに切替
- タイトルの空白は `%20` にエンコード
