# draw — データを URL に載せた SVG グラフ

> [English](../README.md) | **日本語**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)

データはすべて URL の中 — ブラウザで開く、`<img>` で埋め込む、README に貼るだけで SVG が即描画され、AI もそのまま読めます。

## 先睹为快 → プレビュー

### 円グラフ — 最大都市

```text
https://x-cmd.com/draw?type=pie&title=%E6%9C%80%E5%A4%A7%E9%83%BD%E5%B8%82%E3%81%AE%E4%BA%BA%E5%8F%A3&unit=%E7%99%BE%E4%B8%87%E4%BA%BA&labels=%E6%9D%B1%E4%BA%AC,%E6%A8%AA%E6%B5%9C,%E5%A4%A7%E9%98%AA,%E5%90%8D%E5%8F%A4%E5%B1%8B&values=13.9,3.8,2.8,2.3
```

![円グラフ — 最大都市](https://x-cmd.com/draw?type=pie&title=%E6%9C%80%E5%A4%A7%E9%83%BD%E5%B8%82%E3%81%AE%E4%BA%BA%E5%8F%A3&unit=%E7%99%BE%E4%B8%87%E4%BA%BA&labels=%E6%9D%B1%E4%BA%AC,%E6%A8%AA%E6%B5%9C,%E5%A4%A7%E9%98%AA,%E5%90%8D%E5%8F%A4%E5%B1%8B&values=13.9,3.8,2.8,2.3)

### 横棒 — 領域別ランキング

```text
https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=%E9%A0%98%E5%9F%9F%E5%88%A5%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88%E6%95%B0
```

![横棒 — 領域別ランキング](https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=%E9%A0%98%E5%9F%9F%E5%88%A5%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88%E6%95%B0)

### 複合 — ダウンロードと成長

```text
https://x-cmd.com/draw?type=combo&labels=%E6%9C%88,%E7%81%AB,%E6%B0%B4,%E6%9C%A8,%E9%87%91,%E5%9C%9F,%E6%97%A5&series=%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89:120,180,150,210,240,200,260&line=%E6%88%90%E9%95%B7%E7%8E%87:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%E9%80%B1%E9%96%93%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89&unit=dl
```

![複合 — ダウンロードと成長](https://x-cmd.com/draw?type=combo&labels=%E6%9C%88,%E7%81%AB,%E6%B0%B4,%E6%9C%A8,%E9%87%91,%E5%9C%9F,%E6%97%A5&series=%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89:120,180,150,210,240,200,260&line=%E6%88%90%E9%95%B7%E7%8E%87:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%E9%80%B1%E9%96%93%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89&unit=dl)

### サンキー — PR ライフサイクル

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs
```

![サンキー — PR ライフサイクル](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs)

## 3 つの使い方

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

```sh
npm install @x-cmd/draw
draw --type pie --labels "A,B" --values "3,2" --out pie.svg
```

```ts
import { draw } from "jsr:@x-cmd/draw";   // or npm:@x-cmd/draw
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

## 全グラフ種別

| type | | |
|---|---|---|
| `pie` | ドーナツ; donut=0 でベータ | ≤100 分類 |
| `bar` | 集合縦棒; stack=1 積み上げ | ≤30 グループ |
| `hbar` | 横棒(ランキング) | ≤30 本 |
| `line` | 平滑ライン + グラデーション | ≤60 点 |
| `area` | 面 / 多系列面 | ≤60 点 |
| `radar` | レーダー | 3–12 軸 |
| `gauge` | ゲージ(240° 円弧) | value+max; リング ≤8 |
| `scatter` | 散布図, 負数 OK | ≤200 点 |
| `combo` | 棒 + 線, 双軸 | ≤6 系列 |
| `sankey` | フロー図 | ≤24 ノード |
| `qr` | QR コード | ≤1000 文字 |

---

完全なドキュメント(英語): [README (EN)](../README.md) · [docs](../docs/) — コードは Apache-2.0; フォントは OFL。
