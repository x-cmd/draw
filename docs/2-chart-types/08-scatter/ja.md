---
x-title: scatter 散布 — x-cmd/draw
x-desc: AI 時代の SVG グラフ生成:単一エンドポイント `/draw?type=. type=scatter.
x-sidebar: draw
x-keywords: draw, scatter, 散布, svg, chart
---

# scatter 散布

`GET /draw?type=scatter&...` — グラフを描画

## 例

**base**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=%E3%83%AC%E3%82%A4%E3%83%86%E3%83%B3%E3%82%B7
```

![scatter base](https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=%E3%83%AC%E3%82%A4%E3%83%86%E3%83%B3%E3%82%B7)

**base neg**

```text
https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=%E3%83%AC%E3%82%A4%E3%83%86%E3%83%B3%E3%82%B7
```

![scatter base neg](https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=%E3%83%AC%E3%82%A4%E3%83%86%E3%83%B3%E3%82%B7)

**base num**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=%E3%83%AC%E3%82%A4%E3%83%86%E3%83%B3%E3%82%B7
```

![scatter base num](https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=%E3%83%AC%E3%82%A4%E3%83%86%E3%83%B3%E3%82%B7)

## パラメータ

| パラメータ | | |
|---|---|---|
| `x=` | x 値 | ✓ |
| `y=` | y 値 | ✓ |
| `title=` | タイトル | ✗ |
| `num=` | 数値ラベル: all/peak/none | ✗ |
| `t=` | スタイルファミリー | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## 落とし穴

- 系列ごと ≤200 点。負数 OK
- タイトルの空白は `%20` にエンコード
