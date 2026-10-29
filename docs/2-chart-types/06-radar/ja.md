---
x-title: radar レーダー — x-cmd/draw
x-desc: AI 時代の SVG グラフ生成:単一エンドポイント `/draw?type=. type=radar.
x-sidebar: draw
x-keywords: draw, radar, レーダー, svg, chart
---

# radar レーダー

`GET /draw?type=radar&...` — グラフを描画

## 例

**base**

```text
https://x-cmd.com/draw?type=radar&labels=%E8%B5%B7%E5%8B%95%E9%80%9F%E5%BA%A6,%E3%82%A8%E3%82%B3%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0,%E6%8B%A1%E5%BC%B5%E6%80%A7,%E3%83%A1%E3%83%A2%E3%83%AA,%E4%BD%BF%E3%81%84%E3%82%84%E3%81%99%E3%81%95&values=85,90,70,80,95&title=%E3%82%A8%E3%83%87%E3%82%A3%E3%82%BF%E3%83%BC%E6%AF%94%E8%BC%83
```

![radar base](https://x-cmd.com/draw?type=radar&labels=%E8%B5%B7%E5%8B%95%E9%80%9F%E5%BA%A6,%E3%82%A8%E3%82%B3%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0,%E6%8B%A1%E5%BC%B5%E6%80%A7,%E3%83%A1%E3%83%A2%E3%83%AA,%E4%BD%BF%E3%81%84%E3%82%84%E3%81%99%E3%81%95&values=85,90,70,80,95&title=%E3%82%A8%E3%83%87%E3%82%A3%E3%82%BF%E3%83%BC%E6%AF%94%E8%BC%83)

**evil**

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=%E8%B5%B7%E5%8B%95%E9%80%9F%E5%BA%A6,%E3%82%A8%E3%82%B3%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0,%E6%8B%A1%E5%BC%B5%E6%80%A7,%E3%83%A1%E3%83%A2%E3%83%AA,%E4%BD%BF%E3%81%84%E3%82%84%E3%81%99%E3%81%95&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=%E3%82%A8%E3%83%87%E3%82%A3%E3%82%BF%E3%83%BC%E6%AF%94%E8%BC%83
```

![radar evil](https://x-cmd.com/draw?type=radar&t=evil&labels=%E8%B5%B7%E5%8B%95%E9%80%9F%E5%BA%A6,%E3%82%A8%E3%82%B3%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0,%E6%8B%A1%E5%BC%B5%E6%80%A7,%E3%83%A1%E3%83%A2%E3%83%AA,%E4%BD%BF%E3%81%84%E3%82%84%E3%81%99%E3%81%95&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=%E3%82%A8%E3%83%87%E3%82%A3%E3%82%BF%E3%83%BC%E6%AF%94%E8%BC%83)

**xcmd**

```text
https://x-cmd.com/draw?type=radar&t=xcmd&labels=%E8%B5%B7%E5%8B%95%E9%80%9F%E5%BA%A6,%E3%82%A8%E3%82%B3%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0,%E6%8B%A1%E5%BC%B5%E6%80%A7,%E3%83%A1%E3%83%A2%E3%83%AA,%E4%BD%BF%E3%81%84%E3%82%84%E3%81%99%E3%81%95&values=8,6,9,7,5&title=%E3%82%A8%E3%83%87%E3%82%A3%E3%82%BF%E3%83%BC%E6%AF%94%E8%BC%83
```

![radar xcmd](https://x-cmd.com/draw?type=radar&t=xcmd&labels=%E8%B5%B7%E5%8B%95%E9%80%9F%E5%BA%A6,%E3%82%A8%E3%82%B3%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0,%E6%8B%A1%E5%BC%B5%E6%80%A7,%E3%83%A1%E3%83%A2%E3%83%AA,%E4%BD%BF%E3%81%84%E3%82%84%E3%81%99%E3%81%95&values=8,6,9,7,5&title=%E3%82%A8%E3%83%87%E3%82%A3%E3%82%BF%E3%83%BC%E6%AF%94%E8%BC%83)

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
| `base` |
| `evil` |
| `xcmd` |

## 落とし穴

- 3–12 軸
- 複数系列には `t=evil` が必要
- タイトルの空白は `%20` にエンコード
