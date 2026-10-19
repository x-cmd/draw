# draw — データを URL に載せた SVG グラフ

> [English](../README.md) | **日本語**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/x-cmd/draw/badge)](https://securityscorecards.dev/viewer/?uri=github.com/x-cmd/draw)

AI 時代の SVG グラフ生成:単一エンドポイント `/draw?type=...`、データは URL 内、出力には機械可読な `<metadata>` を埋め込み。スタイル体系はデザイナー仕様に準拠し、グラフ種別ごとに複数バリアント。

## プレビュー

データはすべて URL の中 — ブラウザで開く、`<img>` で埋め込む、README に貼るだけで SVG が即描画されます。

### サンキー — PR ライフサイクル (`type=sankey&t=pipeline`)

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs
```

![サンキー — PR ライフサイクル](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs)

### 横棒 — 実行時スループット(実測) (`type=hbar; draw() ops/s: deno 7238 · node 6553 · bun 4972, Apple Silicon`)

```text
https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs
```

![横棒 — 実行時スループット(実測)](https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs)

### レーダー — 3 エディター比較 (`type=radar&t=evil`)

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison
```

![レーダー — 3 エディター比較](https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison)

### 複合 — ダウンロードと成長率 (`type=combo`)

```text
https://x-cmd.com/draw?type=combo&labels=%E6%9C%88,%E7%81%AB,%E6%B0%B4,%E6%9C%A8,%E9%87%91,%E5%9C%9F,%E6%97%A5&series=%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89:120,180,150,210,240,200,260&line=%E6%88%90%E9%95%B7%E7%8E%87:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%E9%80%B1%E9%96%93%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89&unit=dl
```

![複合 — ダウンロードと成長率](https://x-cmd.com/draw?type=combo&labels=%E6%9C%88,%E7%81%AB,%E6%B0%B4,%E6%9C%A8,%E9%87%91,%E5%9C%9F,%E6%97%A5&series=%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89:120,180,150,210,240,200,260&line=%E6%88%90%E9%95%B7%E7%8E%87:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%E9%80%B1%E9%96%93%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89&unit=dl)

### 横棒 — オープン/クローズ-issue(バタフライ) (`type=hbar&t=xcmd-issue`)

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=%E3%82%AA%E3%83%BC%E3%83%97%E3%83%B3:12,8,15,4,9&series=%E3%82%AF%E3%83%AD%E3%83%BC%E3%82%BA:38,52,20,11,26&title=%E9%A0%98%E5%9F%9F%E5%88%A5%20issue
```

![横棒 — オープン/クローズ-issue(バタフライ)](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=%E3%82%AA%E3%83%BC%E3%83%97%E3%83%B3:12,8,15,4,9&series=%E3%82%AF%E3%83%AD%E3%83%BC%E3%82%BA:38,52,20,11,26&title=%E9%A0%98%E5%9F%9F%E5%88%A5%20issue)

### 円 — 最大都市 (`type=pie&t=market-mono`)

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=%E6%9C%80%E5%A4%A7%E9%83%BD%E5%B8%82%E3%81%AE%E4%BA%BA%E5%8F%A3&unit=%E7%99%BE%E4%B8%87%E4%BA%BA&labels=%E6%9D%B1%E4%BA%AC,%E6%A8%AA%E6%B5%9C,%E5%A4%A7%E9%98%AA,%E5%90%8D%E5%8F%A4%E5%B1%8B&values=13.9,3.8,2.8,2.3
```

![円 — 最大都市](https://x-cmd.com/draw?type=pie&t=market-mono&title=%E6%9C%80%E5%A4%A7%E9%83%BD%E5%B8%82%E3%81%AE%E4%BA%BA%E5%8F%A3&unit=%E7%99%BE%E4%B8%87%E4%BA%BA&labels=%E6%9D%B1%E4%BA%AC,%E6%A8%AA%E6%B5%9C,%E5%A4%A7%E9%98%AA,%E5%90%8D%E5%8F%A4%E5%B1%8B&values=13.9,3.8,2.8,2.3)

## 3 つの使い方

**ホステッドサービス(インストール不要)** — `https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2`

**npm ライブラリ + CLI(オフライン・同期)** (`npm i -g @x-cmd/draw` / `npx`):

```sh
npm install @x-cmd/draw
```
```ts
import { draw } from '@x-cmd/draw';
const { svg } = draw({ type: 'pie', labels: 'A,B', values: '3,2', t: 'evil', scheme: 'dark' });
// クエリ文字列も可: draw('?type=bar&labels=月,火&values=3,5')
// 配列 = 繰り返しパラメータ(カンマ入りラベル)
draw({ type: 'bar', labels: ['Q1, 2024', 'Q2'], values: [1, 2] })
```
```sh
draw --type pie --labels "A,B,C" --values "3,2,1" --out pie.svg
draw "?type=hbar&labels=a,b,c&values=3,2,1&t=xcmd"   # 裸クエリ文字列
```

**セルフホスト**:

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve      # ローカル Node サーバー :8787(デモページ付き)
npm run dev        # wrangler dev
bash scripts/setup.sh   # 自分の Cloudflare アカウントへワンクリックデプロイ
```

環境変数(Node): `PORT`(8787)· `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN`(POST ショートリンクを有効化)。

**Deno** — 描画コアは純関数・ネットワーク不要 — ゼロ権限サンドボックスがそのままセキュリティ境界:

```ts
import { draw } from "jsr:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

## エンドポイント

**`GET /draw?type=<pie|bar|hbar|line|area|radar|gauge|scatter|combo|sankey|qr>`** — グラフを描画

| type | | |
|---|---|---|
| `pie` | ドーナツ;`donut=0` でベタ円<br><br>**<u>≤100 分類(>9 は Other 統合)</u>** | <a href="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=%E8%A8%80%E8%AA%9E%E5%88%A5%E3%82%B9%E3%82%BF%E3%83%BC"><img src="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=%E8%A8%80%E8%AA%9E%E5%88%A5%E3%82%B9%E3%82%BF%E3%83%BC" width="360" alt="example"></a> |
| `bar` | 集合縦棒;`stack=1` 積み上げ<br><br>**<u>≤30 グループ</u>** | <a href="https://x-cmd.com/draw?type=bar&labels=%E6%9C%88,%E7%81%AB,%E6%B0%B4&series=dev:12,18,9&series=ci:8,11,6"><img src="https://x-cmd.com/draw?type=bar&labels=%E6%9C%88,%E7%81%AB,%E6%B0%B4&series=dev:12,18,9&series=ci:8,11,6" width="360" alt="example"></a> |
| `hbar` | 横棒(ランキング)<br><br>**<u>≤30 本</u>** | <a href="https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=%E9%A0%98%E5%9F%9F%E5%88%A5%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88"><img src="https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=%E9%A0%98%E5%9F%9F%E5%88%A5%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88" width="360" alt="example"></a> |
| `line` | 平滑ライン + グラデーション/複数線<br><br>**<u>≤60 点</u>** | <a href="https://x-cmd.com/draw?type=line&labels=1%E6%9C%88,2%E6%9C%88,3%E6%9C%88,4%E6%9C%88,5%E6%9C%88,6%E6%9C%88&values=12,19,15,25,22,30&title=%E8%A8%80%E8%AA%9E%E5%88%A5%E3%82%B9%E3%82%BF%E3%83%BC"><img src="https://x-cmd.com/draw?type=line&labels=1%E6%9C%88,2%E6%9C%88,3%E6%9C%88,4%E6%9C%88,5%E6%9C%88,6%E6%9C%88&values=12,19,15,25,22,30&title=%E8%A8%80%E8%AA%9E%E5%88%A5%E3%82%B9%E3%82%BF%E3%83%BC" width="360" alt="example"></a> |
| `area` | 面 / 多系列面<br><br>**<u>≤60 点</u>** | <a href="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89"><img src="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89" width="360" alt="example"></a> |
| `radar` | レーダー<br><br>**<u>3–12 軸</u>** | <a href="https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison"><img src="https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison" width="360" alt="example"></a> |
| `gauge` | ゲージ(240° 円弧 + 中央値)<br><br>**<u>value+max;リング ≤8</u>** | <a href="https://x-cmd.com/draw?type=gauge&title=CI%20%E6%88%90%E5%8A%9F%E7%8E%87&value=87&max=100"><img src="https://x-cmd.com/draw?type=gauge&title=CI%20%E6%88%90%E5%8A%9F%E7%8E%87&value=87&max=100" width="360" alt="example"></a> |
| `scatter` | 散布,2 数値軸,負数 OK<br><br>**<u>x=&y=, ≤200 点</u>** | <a href="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=%E3%83%AC%E3%82%A4%E3%83%86%E3%83%B3%E3%82%B7"><img src="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=%E3%83%AC%E3%82%A4%E3%83%86%E3%83%B3%E3%82%B7" width="360" alt="example"></a> |
| `combo` | 棒(`series=`)+線(`line=`);5× 差で双軸<br><br>**<u>≤30 グループ, ≤6 系列</u>** | <a href="https://x-cmd.com/draw?type=combo&labels=%E6%9C%88,%E7%81%AB,%E6%B0%B4,%E6%9C%A8,%E9%87%91,%E5%9C%9F,%E6%97%A5&series=%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89:120,180,150,210,240,200,260&line=%E6%88%90%E9%95%B7%E7%8E%87:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%E9%80%B1%E9%96%93%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89&unit=dl"><img src="https://x-cmd.com/draw?type=combo&labels=%E6%9C%88,%E7%81%AB,%E6%B0%B4,%E6%9C%A8,%E9%87%91,%E5%9C%9F,%E6%97%A5&series=%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89:120,180,150,210,240,200,260&line=%E6%88%90%E9%95%B7%E7%8E%87:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%E9%80%B1%E9%96%93%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89&unit=dl" width="360" alt="example"></a> |
| `sankey` | フロー図(帯の太さ=量)<br><br>**<u>labels=+links=A>B:30, ≤24 ノード</u>** | <a href="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs"><img src="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs" width="360" alt="example"></a> |
| `qr` | QR コード<br><br>**<u>d≤1000 文字, fg/bg, title/unit</u>** | <a href="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=%E3%82%B9%E3%82%AD%E3%83%A3%E3%83%B3"><img src="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=%E3%82%B9%E3%82%AD%E3%83%A3%E3%83%B3" width="360" alt="example"></a> |

**`GET /draw`** — デモページ · **`POST /draw?type=...`** — JSON/CSV body で永久ショートリンクを作成 · **`GET /draw/c/<hash>`** — ショートリンク描画(immutable)

## スタイル(`?t=`)

| type | |
|---|---|
| `pie` | opendata(既定)· evil · evil-mono · market-mono · progress · revenue |
| `bar` | evil(既定)· base · grid |
| `hbar` | base(既定)· opendata(ref=)· xcmd · xcmd-issue · rank |
| `line` | shadcn(既定)· evil · evil-glow · evil-mono · opendata |
| `area` | evil(既定)· star · opendata · pixel · polka |
| `radar` | base(既定)· evil · xcmd |
| `sankey` | base(既定)· fund · pipeline |
| `gauge` | base(既定)· gradient · reliability |
| `scatter/combo/qr` | base(combo は evil も) |

## データの渡し方

```text
https://x-cmd.com/draw?type=pie&title=%E8%A8%80%E8%AA%9E%E5%88%A5%E3%82%B9%E3%82%BF%E3%83%BC&labels=TypeScript,Python,Go&values=4821,2312,980
```

カンマを含むラベルはパラメータを繰り返し(`labels=Q1, 2024&labels=Q2`)。複雑なデータは `?d=` + URL エンコード JSON:

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

## ショートリンク

POST はコンテンツアドレス式の永久ショートリンクを生成(GitHub リポジトリが保管):

- 同じデータ → 同じハッシュ(冪等・重複排除)
- 制限 30 リクエスト/分/IP
- データ保管は公開 — 機密データは不可

## バージョン

- `v` なし: 最新版・キャッシュ 300 秒
- `v=N`: バージョン固定・キャッシュ 1 日
- `immutable` は `/c/<hash>` のみ

## AI フレンドリー

各 SVG に JSON を埋め込み: `{generator, template, version, spec}` — データとパラメータをそのまま往復でき、文字はすべて本物の `<text>`。

## ワンステップ自前ホスト

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

スクリプトはクローン→wrangler ログイン→デプロイ→`*.workers.dev` の URL を表示します。 ショートリンク(POST)は `DATA_REPO` + `GITHUB_TOKEN` で有効化。

## 開発

```sh
npm install
npm run dev      # wrangler dev
npm test         # vitest (120)
npm run check    # tsc ×3
npm run build    # dist/
```

## ライセンス

コードは Apache-2.0;フォントは OFL — [LICENSE](../LICENSE) · 完全なドキュメント: [README (EN)](../README.md)
