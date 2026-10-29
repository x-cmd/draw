---
x-title: hbar 横棒 — x-cmd/draw
x-desc: AI 時代の SVG グラフ生成:単一エンドポイント `/draw?type=. type=hbar.
x-sidebar: draw
x-keywords: draw, hbar, 横棒, svg, chart
---

# hbar 横棒

`GET /draw?type=hbar&...` — グラフを描画

## 例

**base**

```text
https://x-cmd.com/draw?type=hbar&labels=CLI,%E3%82%B3%E3%82%A2,%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88,UI&values=42,31,18,9&title=%E9%A0%98%E5%9F%9F%E5%88%A5%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88
```

![hbar base](https://x-cmd.com/draw?type=hbar&labels=CLI,%E3%82%B3%E3%82%A2,%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88,UI&values=42,31,18,9&title=%E9%A0%98%E5%9F%9F%E5%88%A5%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88)

**opendata**

```text
https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,%E3%82%B3%E3%82%A2,%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=%E9%A0%98%E5%9F%9F%E5%88%A5%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88
```

![hbar opendata](https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,%E3%82%B3%E3%82%A2,%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=%E9%A0%98%E5%9F%9F%E5%88%A5%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88)

**xcmd**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd&labels=%E6%9D%B1%E4%BA%AC,%E6%A8%AA%E6%B5%9C,%E5%A4%A7%E9%98%AA&values=68,21,11&title=%E6%9C%80%E5%A4%A7%E9%83%BD%E5%B8%82%E3%81%AE%E4%BA%BA%E5%8F%A3
```

![hbar xcmd](https://x-cmd.com/draw?type=hbar&t=xcmd&labels=%E6%9D%B1%E4%BA%AC,%E6%A8%AA%E6%B5%9C,%E5%A4%A7%E9%98%AA&values=68,21,11&title=%E6%9C%80%E5%A4%A7%E9%83%BD%E5%B8%82%E3%81%AE%E4%BA%BA%E5%8F%A3)

**xcmd-issue**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,%E3%82%B3%E3%82%A2,%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88,ci,UI&series=%E3%82%AA%E3%83%BC%E3%83%97%E3%83%B3:12,8,15,4,9&series=%E3%82%AF%E3%83%AD%E3%83%BC%E3%82%BA:38,52,20,11,26&title=%E9%A0%98%E5%9F%9F%E5%88%A5%20issue
```

![hbar xcmd-issue](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,%E3%82%B3%E3%82%A2,%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88,ci,UI&series=%E3%82%AA%E3%83%BC%E3%83%97%E3%83%B3:12,8,15,4,9&series=%E3%82%AF%E3%83%AD%E3%83%BC%E3%82%BA:38,52,20,11,26&title=%E9%A0%98%E5%9F%9F%E5%88%A5%20issue)

**rank**

```text
https://x-cmd.com/draw?type=hbar&t=rank&labels=%E6%9C%88,%E7%81%AB,%E6%B0%B4&series=2025:80,95,110&series=2026:110,85,120&title=%E9%80%B1%E9%96%93%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89
```

![hbar rank](https://x-cmd.com/draw?type=hbar&t=rank&labels=%E6%9C%88,%E7%81%AB,%E6%B0%B4&series=2025:80,95,110&series=2026:110,85,120&title=%E9%80%B1%E9%96%93%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89)

## パラメータ

| パラメータ | | |
|---|---|---|
| `labels=` | ラベル(カンマ区切り) | ✓ |
| `values=` | 値(カンマ区切り) | ✓ |
| `series=` | 特定スタイルのみ:2 系列 | ✗ |
| `ref=` | 参考線の値 | ✗ |
| `reflabel=` | 参考線のラベル | ✗ |
| `t=` | スタイルファミリー | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `opendata` |
| `xcmd` |
| `xcmd-issue` |
| `rank` |

## 落とし穴

- ≤30 本,既定は単一系列
- 2 系列は `t=xcmd-issue` / `t=rank` のみ
- タイトルの空白は `%20` にエンコード
