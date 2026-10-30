---
x-title: pie 円グラフ — x-cmd/draw
x-desc: AI 時代の SVG グラフ生成:単一エンドポイント `/draw?type=. type=pie.
x-sidebar: draw
x-keywords: draw, pie, 円グラフ, svg, chart
---

# pie 円グラフ

`GET /draw?type=pie&...` — グラフを描画

## 例

**opendata**

```text
https://x-cmd.com/draw?type=pie&title=%E6%9C%80%E5%A4%A7%E9%83%BD%E5%B8%82%E3%81%AE%E4%BA%BA%E5%8F%A3&unit=%E7%99%BE%E4%B8%87%E4%BA%BA&labels=%E6%9D%B1%E4%BA%AC,%E6%A8%AA%E6%B5%9C,%E5%A4%A7%E9%98%AA,%E5%90%8D%E5%8F%A4%E5%B1%8B&values=13.9,3.8,2.8,2.3
```

![pie opendata](https://x-cmd.com/draw?type=pie&title=%E6%9C%80%E5%A4%A7%E9%83%BD%E5%B8%82%E3%81%AE%E4%BA%BA%E5%8F%A3&unit=%E7%99%BE%E4%B8%87%E4%BA%BA&labels=%E6%9D%B1%E4%BA%AC,%E6%A8%AA%E6%B5%9C,%E5%A4%A7%E9%98%AA,%E5%90%8D%E5%8F%A4%E5%B1%8B&values=13.9,3.8,2.8,2.3)

**evil**

```text
https://x-cmd.com/draw?type=pie&t=evil&title=%E6%9C%80%E5%A4%A7%E9%83%BD%E5%B8%82%E3%81%AE%E4%BA%BA%E5%8F%A3&unit=%E7%99%BE%E4%B8%87%E4%BA%BA&labels=%E6%9D%B1%E4%BA%AC,%E6%A8%AA%E6%B5%9C,%E5%A4%A7%E9%98%AA,%E5%90%8D%E5%8F%A4%E5%B1%8B&values=13.9,3.8,2.8,2.3
```

![pie evil](https://x-cmd.com/draw?type=pie&t=evil&title=%E6%9C%80%E5%A4%A7%E9%83%BD%E5%B8%82%E3%81%AE%E4%BA%BA%E5%8F%A3&unit=%E7%99%BE%E4%B8%87%E4%BA%BA&labels=%E6%9D%B1%E4%BA%AC,%E6%A8%AA%E6%B5%9C,%E5%A4%A7%E9%98%AA,%E5%90%8D%E5%8F%A4%E5%B1%8B&values=13.9,3.8,2.8,2.3)

**evil-mono**

```text
https://x-cmd.com/draw?type=pie&t=evil-mono&title=%E6%9C%80%E5%A4%A7%E9%83%BD%E5%B8%82%E3%81%AE%E4%BA%BA%E5%8F%A3&unit=%E7%99%BE%E4%B8%87%E4%BA%BA&labels=%E6%9D%B1%E4%BA%AC,%E6%A8%AA%E6%B5%9C,%E5%A4%A7%E9%98%AA,%E5%90%8D%E5%8F%A4%E5%B1%8B&values=13.9,3.8,2.8,2.3
```

![pie evil-mono](https://x-cmd.com/draw?type=pie&t=evil-mono&title=%E6%9C%80%E5%A4%A7%E9%83%BD%E5%B8%82%E3%81%AE%E4%BA%BA%E5%8F%A3&unit=%E7%99%BE%E4%B8%87%E4%BA%BA&labels=%E6%9D%B1%E4%BA%AC,%E6%A8%AA%E6%B5%9C,%E5%A4%A7%E9%98%AA,%E5%90%8D%E5%8F%A4%E5%B1%8B&values=13.9,3.8,2.8,2.3)

**market-mono**

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=%E6%9C%80%E5%A4%A7%E9%83%BD%E5%B8%82%E3%81%AE%E4%BA%BA%E5%8F%A3&unit=%E7%99%BE%E4%B8%87%E4%BA%BA&labels=%E6%9D%B1%E4%BA%AC,%E6%A8%AA%E6%B5%9C,%E5%A4%A7%E9%98%AA,%E5%90%8D%E5%8F%A4%E5%B1%8B&values=13.9,3.8,2.8,2.3
```

![pie market-mono](https://x-cmd.com/draw?type=pie&t=market-mono&title=%E6%9C%80%E5%A4%A7%E9%83%BD%E5%B8%82%E3%81%AE%E4%BA%BA%E5%8F%A3&unit=%E7%99%BE%E4%B8%87%E4%BA%BA&labels=%E6%9D%B1%E4%BA%AC,%E6%A8%AA%E6%B5%9C,%E5%A4%A7%E9%98%AA,%E5%90%8D%E5%8F%A4%E5%B1%8B&values=13.9,3.8,2.8,2.3)

**progress**

```text
https://x-cmd.com/draw?type=pie&t=progress&title=%E6%9C%80%E5%A4%A7%E9%83%BD%E5%B8%82%E3%81%AE%E4%BA%BA%E5%8F%A3&unit=%E7%99%BE%E4%B8%87%E4%BA%BA&labels=%E6%9D%B1%E4%BA%AC,%E6%A8%AA%E6%B5%9C,%E5%A4%A7%E9%98%AA,%E5%90%8D%E5%8F%A4%E5%B1%8B&values=13.9,3.8,2.8,2.3
```

![pie progress](https://x-cmd.com/draw?type=pie&t=progress&title=%E6%9C%80%E5%A4%A7%E9%83%BD%E5%B8%82%E3%81%AE%E4%BA%BA%E5%8F%A3&unit=%E7%99%BE%E4%B8%87%E4%BA%BA&labels=%E6%9D%B1%E4%BA%AC,%E6%A8%AA%E6%B5%9C,%E5%A4%A7%E9%98%AA,%E5%90%8D%E5%8F%A4%E5%B1%8B&values=13.9,3.8,2.8,2.3)

**revenue**

```text
https://x-cmd.com/draw?type=pie&t=revenue&title=%E6%9C%80%E5%A4%A7%E9%83%BD%E5%B8%82%E3%81%AE%E4%BA%BA%E5%8F%A3&unit=%E7%99%BE%E4%B8%87%E4%BA%BA&labels=%E6%9D%B1%E4%BA%AC,%E6%A8%AA%E6%B5%9C,%E5%A4%A7%E9%98%AA,%E5%90%8D%E5%8F%A4%E5%B1%8B&values=13.9,3.8,2.8,2.3
```

![pie revenue](https://x-cmd.com/draw?type=pie&t=revenue&title=%E6%9C%80%E5%A4%A7%E9%83%BD%E5%B8%82%E3%81%AE%E4%BA%BA%E5%8F%A3&unit=%E7%99%BE%E4%B8%87%E4%BA%BA&labels=%E6%9D%B1%E4%BA%AC,%E6%A8%AA%E6%B5%9C,%E5%A4%A7%E9%98%AA,%E5%90%8D%E5%8F%A4%E5%B1%8B&values=13.9,3.8,2.8,2.3)

## パラメータ

| パラメータ | | |
|---|---|---|
| `labels=` | ラベル(カンマ区切り) | ✓ |
| `values=` | 値(カンマ区切り) | ✓ |
| `title=` | タイトル | ✗ |
| `unit=` | 単位 | ✗ |
| `donut=` | 0 = ベタ円 | ✗ |
| `t=` | スタイルファミリー | ✗ |

## `t=`

| | |
|---|---|
| `opendata` |
| `evil` |
| `evil-mono` |
| `market-mono` |
| `progress` |
| `revenue` |

## 落とし穴

- ≤100 分類。9 を超えると自動で Other に統合
- ベタ円とドーナツは `donut=` の違いだけ — スタイルを変えない
- スタイルによってはダークモードでコントラストが変わる
- タイトルの空白は `%20` にエンコード
