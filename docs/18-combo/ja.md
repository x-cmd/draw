---
x-title: combo 複合 — x-cmd/draw
x-desc: AI 時代の SVG グラフ生成:単一エンドポイント `/draw?type=. type=combo.
x-sidebar: draw
x-keywords: draw, combo, 複合, svg, chart
---

# combo 複合

`GET /draw?type=combo&...` — グラフを描画

## 例

**base**

```text
https://x-cmd.com/draw?type=combo&labels=%E6%9C%88,%E7%81%AB,%E6%B0%B4,%E6%9C%A8,%E9%87%91,%E5%9C%9F,%E6%97%A5&series=%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89:120,180,150,210,240,200,260&line=%E6%88%90%E9%95%B7%E7%8E%87:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%E9%80%B1%E9%96%93%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89&unit=dl
```

![combo base](https://x-cmd.com/draw?type=combo&labels=%E6%9C%88,%E7%81%AB,%E6%B0%B4,%E6%9C%A8,%E9%87%91,%E5%9C%9F,%E6%97%A5&series=%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89:120,180,150,210,240,200,260&line=%E6%88%90%E9%95%B7%E7%8E%87:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%E9%80%B1%E9%96%93%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89&unit=dl)

**evil**

```text
https://x-cmd.com/draw?type=combo&t=evil&labels=%E6%9C%88,%E7%81%AB,%E6%B0%B4&series=%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89:9,12,15&line=%E6%88%90%E9%95%B7%E7%8E%87:1.1,1.4,1.8&title=%E9%80%B1%E9%96%93%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89
```

![combo evil](https://x-cmd.com/draw?type=combo&t=evil&labels=%E6%9C%88,%E7%81%AB,%E6%B0%B4&series=%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89:9,12,15&line=%E6%88%90%E9%95%B7%E7%8E%87:1.1,1.4,1.8&title=%E9%80%B1%E9%96%93%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89)

## パラメータ

| パラメータ | | |
|---|---|---|
| `labels=` | ラベル(カンマ区切り) | ✓ |
| `series=` | 系列 `名前:値`,繰り返し可 | ✓ |
| `line=` | 折れ線系列 `名前:値` | ✗ |
| `stack=` | 1 = 積み上げ | ✗ |
| `title=` | タイトル | ✗ |
| `t=` | スタイルファミリー | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `evil` |

## 落とし穴

- 棒 + 線。5× 差で双軸に自動切替
- タイトルの空白は `%20` にエンコード
