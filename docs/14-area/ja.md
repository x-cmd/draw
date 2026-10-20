---
x-title: area 面 — x-cmd/draw
x-desc: AI 時代の SVG グラフ生成:単一エンドポイント `/draw?type=. type=area.
x-sidebar: draw
x-keywords: draw, area, 面, svg, chart
---

# area 面

`GET /draw?type=area&...` — グラフを描画

## 例

**evil**

```text
https://x-cmd.com/draw?type=area&labels=%E6%9C%88,%E7%81%AB,%E6%B0%B4&series=dev:30,42,38&series=CI:12,18,9&title=%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89
```

![area evil](https://x-cmd.com/draw?type=area&labels=%E6%9C%88,%E7%81%AB,%E6%B0%B4&series=dev:30,42,38&series=CI:12,18,9&title=%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89)

**star**

```text
https://x-cmd.com/draw?type=area&t=star&labels=%E6%9C%88,%E7%81%AB,%E6%B0%B4&values=3,5,4&title=%E6%88%90%E9%95%B7%E7%8E%87
```

![area star](https://x-cmd.com/draw?type=area&t=star&labels=%E6%9C%88,%E7%81%AB,%E6%B0%B4&values=3,5,4&title=%E6%88%90%E9%95%B7%E7%8E%87)

**opendata**

```text
https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=%E6%88%90%E9%95%B7%E7%8E%87&source=x-cmd.com%2Fdraw
```

![area opendata](https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=%E6%88%90%E9%95%B7%E7%8E%87&source=x-cmd.com%2Fdraw)

**pixel**

```text
https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=%E6%88%90%E9%95%B7%E7%8E%87
```

![area pixel](https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=%E6%88%90%E9%95%B7%E7%8E%87)

## パラメータ

| パラメータ | | |
|---|---|---|
| `labels=` | ラベル(カンマ区切り) | ✓ |
| `values=` | 値(カンマ区切り) | ✓ |
| `series=` | 系列 `名前:値`,繰り返し可 | ✗ |
| `source=` | 出典(area のみ) | ✗ |
| `subtitle=` | サブタイトル(area opendata) | ✗ |
| `t=` | スタイルファミリー | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `star` |
| `opendata` |
| `pixel` |
| `polka` |

## 落とし穴

- ≤60 点。複数線は各線のピークのみ表示
- タイトルの空白は `%20` にエンコード
