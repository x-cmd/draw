---
x-title: 日本語 — draw quick start
x-desc: AI 時代の SVG グラフ生成:単一エンドポイント `/draw?type=.
x-sidebar: draw
x-keywords: draw, quickstart, svg, chart
---

# draw — データを URL に載せた SVG グラフ

AI 時代の SVG グラフ生成:単一エンドポイント `/draw?type=...`、データは URL 内、出力には機械可読な `<metadata>` を埋め込み。スタイル体系はデザイナー仕様に準拠し、グラフ種別ごとに複数バリアント。

## プレビュー

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

![pie](https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2)

## 3 つの使い方

**ホステッドサービス(インストール不要)** · **npm ライブラリ + CLI(オフライン・同期)** · Deno:

```ts
import { draw } from "jsr:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

## エンドポイント

| type | | |
|---|---|---|
| `pie` | ドーナツ;`donut=0` でベタ円 | ≤100 分類(>9 は Other 統合) |
| `bar` | 集合縦棒;`stack=1` 積み上げ | ≤30 グループ |
| `hbar` | 横棒(ランキング) | ≤30 本 |
| `line` | 平滑ライン + グラデーション/複数線 | ≤60 点 |
| `area` | 面 / 多系列面 | ≤60 点 |
| `radar` | レーダー | 3–12 軸 |
| `gauge` | ゲージ(240° 円弧 + 中央値) | value+max;リング ≤8 |
| `scatter` | 散布,2 数値軸,負数 OK | x=&y=, ≤200 点 |
| `combo` | 棒(`series=`)+線(`line=`);5× 差で双軸 | ≤30 グループ, ≤6 系列 |
| `sankey` | フロー図(帯の太さ=量) | labels=+links=A>B:30, ≤24 ノード |
| `qr` | QR コード | d≤1000 文字, fg/bg, title/unit |

コードは Apache-2.0;フォントは OFL — [README (EN)](../readme/en.md)
