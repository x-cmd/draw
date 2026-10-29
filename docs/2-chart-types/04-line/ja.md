---
x-title: line 折れ線 — x-cmd/draw
x-desc: AI 時代の SVG グラフ生成:単一エンドポイント `/draw?type=. type=line.
x-sidebar: draw
x-keywords: draw, line, 折れ線, svg, chart
---

# line 折れ線

`GET /draw?type=line&...` — グラフを描画

## 例

**shadcn**

```text
https://x-cmd.com/draw?type=line&labels=1%E6%9C%88,2%E6%9C%88,3%E6%9C%88,4%E6%9C%88,5%E6%9C%88,6%E6%9C%88&values=12,19,15,25,22,30&title=%E8%A8%80%E8%AA%9E%E5%88%A5%E3%82%B9%E3%82%BF%E3%83%BC
```

![line shadcn](https://x-cmd.com/draw?type=line&labels=1%E6%9C%88,2%E6%9C%88,3%E6%9C%88,4%E6%9C%88,5%E6%9C%88,6%E6%9C%88&values=12,19,15,25,22,30&title=%E8%A8%80%E8%AA%9E%E5%88%A5%E3%82%B9%E3%82%BF%E3%83%BC)

**evil**

```text
https://x-cmd.com/draw?type=line&t=evil&labels=1%E6%9C%88,2%E6%9C%88,3%E6%9C%88,4%E6%9C%88,5%E6%9C%88,6%E6%9C%88&series=%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89:12,19,15,25,22,30&series=CI:8,11,9,14,12,10
```

![line evil](https://x-cmd.com/draw?type=line&t=evil&labels=1%E6%9C%88,2%E6%9C%88,3%E6%9C%88,4%E6%9C%88,5%E6%9C%88,6%E6%9C%88&series=%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89:12,19,15,25,22,30&series=CI:8,11,9,14,12,10)

**evil-glow**

```text
https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=%E6%88%90%E9%95%B7%E7%8E%87
```

![line evil-glow](https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=%E6%88%90%E9%95%B7%E7%8E%87)

**opendata**

```text
https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89
```

![line opendata](https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89)

## パラメータ

| パラメータ | | |
|---|---|---|
| `labels=` | ラベル(カンマ区切り) | ✓ |
| `values=` | 値(カンマ区切り) | ✓ |
| `series=` | 系列 `名前:値`,繰り返し可 | ✗ |
| `title=` | タイトル | ✗ |
| `t=` | スタイルファミリー | ✗ |

## `t=`

| | |
|---|---|
| `shadcn` |
| `evil` |
| `evil-glow` |
| `evil-mono` |
| `opendata` |

## 落とし穴

- ≤60 点。複数線は各線のピークのみ表示
- タイトルの空白は `%20` にエンコード
