# draw — Biểu đồ SVG với dữ liệu nằm trong URL

> [English](../README.md) | **Tiếng Việt**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/x-cmd/draw/badge)](https://securityscorecards.dev/viewer/?uri=github.com/x-cmd/draw)

Biểu đồ SVG cho thời đại AI: một endpoint `/draw?type=...`, dữ liệu trong URL và `<metadata>` máy đọc được trong mỗi kết quả. Hệ phong cách theo spec thiết kế, nhiều biến thể cho mỗi loại biểu đồ.

## Xem nhanh

Toàn bộ dữ liệu nằm trong URL — mở bằng trình duyệt, nhúng qua `<img>` hoặc dán vào README: SVG hiển thị ngay.

### Sankey — vòng đời PR (`type=sankey&t=pipeline`)

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs
```

![Sankey — vòng đời PR](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs)

### Thanh ngang — thông lượng runtime (đo thực) (`type=hbar; draw() ops/s: deno 7238 · node 6553 · bun 4972, Apple Silicon`)

```text
https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs
```

![Thanh ngang — thông lượng runtime (đo thực)](https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs)

### Ra đa — so sánh ba trình soạn thảo (`type=radar&t=evil`)

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison
```

![Ra đa — so sánh ba trình soạn thảo](https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison)

### Kết hợp — tải xuống và tăng trưởng (`type=combo`)

```text
https://x-cmd.com/draw?type=combo&labels=T2,T3,T4,T5,T6,T7,CN&series=T%E1%BA%A3i%20xu%E1%BB%91ng:120,180,150,210,240,200,260&line=T%C4%83ng%20tr%C6%B0%E1%BB%9Fng:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=T%E1%BA%A3i%20xu%E1%BB%91ng%20h%E1%BA%B1ng%20tu%E1%BA%A7n&unit=dl
```

![Kết hợp — tải xuống và tăng trưởng](https://x-cmd.com/draw?type=combo&labels=T2,T3,T4,T5,T6,T7,CN&series=T%E1%BA%A3i%20xu%E1%BB%91ng:120,180,150,210,240,200,260&line=T%C4%83ng%20tr%C6%B0%E1%BB%9Fng:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=T%E1%BA%A3i%20xu%E1%BB%91ng%20h%E1%BA%B1ng%20tu%E1%BA%A7n&unit=dl)

### Thanh ngang — issue mở/đóng (bướm) (`type=hbar&t=xcmd-issue`)

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=m%E1%BB%9F:12,8,15,4,9&series=%C4%91%C3%B3ng:38,52,20,11,26&title=Issue%20theo%20khu%20v%E1%BB%B1c
```

![Thanh ngang — issue mở/đóng (bướm)](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=m%E1%BB%9F:12,8,15,4,9&series=%C4%91%C3%B3ng:38,52,20,11,26&title=Issue%20theo%20khu%20v%E1%BB%B1c)

### Tròn — thành phố lớn nhất (`type=pie&t=market-mono`)

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=Th%C3%A0nh%20ph%E1%BB%91%20l%E1%BB%9Bn%20nh%E1%BA%A5t&unit=tr&labels=TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh,H%C3%A0%20N%E1%BB%99i,%C4%90%C3%A0%20N%E1%BA%B5ng,C%E1%BA%A7n%20Th%C6%A1&values=9.5,8.4,1.3,1.2
```

![Tròn — thành phố lớn nhất](https://x-cmd.com/draw?type=pie&t=market-mono&title=Th%C3%A0nh%20ph%E1%BB%91%20l%E1%BB%9Bn%20nh%E1%BA%A5t&unit=tr&labels=TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh,H%C3%A0%20N%E1%BB%99i,%C4%90%C3%A0%20N%E1%BA%B5ng,C%E1%BA%A7n%20Th%C6%A1&values=9.5,8.4,1.3,1.2)

## Ba cách sử dụng

**Dịch vụ lưu trữ (không cần cài)** — `https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2`

**Thư viện npm + CLI (ngoại tuyến, đồng bộ)** (`npm i -g @x-cmd/draw` / `npx`):

```sh
npm install @x-cmd/draw
```
```ts
import { draw } from '@x-cmd/draw';
const { svg } = draw({ type: 'pie', labels: 'A,B', values: '3,2', t: 'evil', scheme: 'dark' });
// cũng nhận chuỗi truy vấn: draw('?type=bar&labels=T2,T3&values=3,5')
// mảng = tham số lặp lại (nhãn chứa dấu phẩy)
draw({ type: 'bar', labels: ['Q1, 2024', 'Q2'], values: [1, 2] })
```
```sh
draw --type pie --labels "A,B,C" --values "3,2,1" --out pie.svg
draw "?type=hbar&labels=a,b,c&values=3,2,1&t=xcmd"   # chuỗi truy vấn trần
```

**Tự lưu trữ**:

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve      # máy chủ Node cục bộ :8787 kèm trang demo
npm run dev        # wrangler dev
bash scripts/setup.sh   # triển khai một chạm lên tài khoản Cloudflare
```

Biến môi trường (Node): `PORT` (8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (bật liên kết ngắn POST).

**Deno** — lõi render thuần, không mạng — sandbox không quyền hạn chính là ranh giới bảo mật:

```ts
import { draw } from "jsr:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

## Endpoint

**`GET /draw?type=<pie|bar|hbar|line|area|radar|gauge|scatter|combo|sankey|qr>`** — vẽ biểu đồ

| type | | |
|---|---|---|
| `pie` | Vành khuyên; `donut=0` = tròn đặc<br><br>**<u>≤100 lớp (>9 → Other)</u>** | <a href="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Sao%20theo%20ng%C3%B4n%20ng%E1%BB%AF"><img src="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Sao%20theo%20ng%C3%B4n%20ng%E1%BB%AF" width="360" alt="example"></a> |
| `bar` | Cột nhóm; `stack=1` xếp chồng<br><br>**<u>≤30 nhóm</u>** | <a href="https://x-cmd.com/draw?type=bar&labels=T2,T3,T4&series=dev:12,18,9&series=ci:8,11,6"><img src="https://x-cmd.com/draw?type=bar&labels=T2,T3,T4&series=dev:12,18,9&series=ci:8,11,6" width="360" alt="example"></a> |
| `hbar` | Thanh ngang (xếp hạng)<br><br>**<u>≤30 thanh</u>** | <a href="https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commit%20theo%20khu%20v%E1%BB%B1c"><img src="https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commit%20theo%20khu%20v%E1%BB%B1c" width="360" alt="example"></a> |
| `line` | Đường mượt + gradient / đa đường<br><br>**<u>≤60 điểm</u>** | <a href="https://x-cmd.com/draw?type=line&labels=T1,T2,T3,T4,T5,T6&values=12,19,15,25,22,30&title=Sao%20theo%20ng%C3%B4n%20ng%E1%BB%AF"><img src="https://x-cmd.com/draw?type=line&labels=T1,T2,T3,T4,T5,T6&values=12,19,15,25,22,30&title=Sao%20theo%20ng%C3%B4n%20ng%E1%BB%AF" width="360" alt="example"></a> |
| `area` | Diện tích / đa diện tích<br><br>**<u>≤60 điểm</u>** | <a href="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=T%E1%BA%A3i%20xu%E1%BB%91ng"><img src="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=T%E1%BA%A3i%20xu%E1%BB%91ng" width="360" alt="example"></a> |
| `radar` | Ra đa<br><br>**<u>3–12 trục</u>** | <a href="https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison"><img src="https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison" width="360" alt="example"></a> |
| `gauge` | Đồng hồ (cung 240°, giá trị giữa)<br><br>**<u>value+max; vòng ≤8</u>** | <a href="https://x-cmd.com/draw?type=gauge&title=T%E1%BB%B7%20l%E1%BB%87%20CI&value=87&max=100"><img src="https://x-cmd.com/draw?type=gauge&title=T%E1%BB%B7%20l%E1%BB%87%20CI&value=87&max=100" width="360" alt="example"></a> |
| `scatter` | Phân tán, hai trục số, âm được<br><br>**<u>x=&y=, ≤200 điểm</u>** | <a href="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=%C4%90%E1%BB%99%20tr%E1%BB%85"><img src="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=%C4%90%E1%BB%99%20tr%E1%BB%85" width="360" alt="example"></a> |
| `combo` | Cột (`series=`) + đường (`line=`); trục kép khi lệch 5×<br><br>**<u>≤30 nhóm, ≤6 chuỗi</u>** | <a href="https://x-cmd.com/draw?type=combo&labels=T2,T3,T4,T5,T6,T7,CN&series=T%E1%BA%A3i%20xu%E1%BB%91ng:120,180,150,210,240,200,260&line=T%C4%83ng%20tr%C6%B0%E1%BB%9Fng:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=T%E1%BA%A3i%20xu%E1%BB%91ng%20h%E1%BA%B1ng%20tu%E1%BA%A7n&unit=dl"><img src="https://x-cmd.com/draw?type=combo&labels=T2,T3,T4,T5,T6,T7,CN&series=T%E1%BA%A3i%20xu%E1%BB%91ng:120,180,150,210,240,200,260&line=T%C4%83ng%20tr%C6%B0%E1%BB%9Fng:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=T%E1%BA%A3i%20xu%E1%BB%91ng%20h%E1%BA%B1ng%20tu%E1%BA%A7n&unit=dl" width="360" alt="example"></a> |
| `sankey` | Sơ đồ dòng chảy theo bề rộng<br><br>**<u>labels=+links=A>B:30, ≤24 nút</u>** | <a href="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs"><img src="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs" width="360" alt="example"></a> |
| `qr` | Mã QR<br><br>**<u>d≤1000 ký tự, fg/bg, title/unit</u>** | <a href="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=qu%C3%A9t"><img src="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=qu%C3%A9t" width="360" alt="example"></a> |

**`GET /draw`** — trang demo · **`POST /draw?type=...`** — body JSON/CSV tạo liên kết ngắn vĩnh viễn · **`GET /draw/c/<hash>`** — vẽ liên kết ngắn (immutable)

## Phong cách (`?t=`)

| type | |
|---|---|
| `pie` | opendata (mặc định) · evil · evil-mono · market-mono · progress · revenue |
| `bar` | evil (mặc định) · base · grid |
| `hbar` | base (mặc định) · opendata (ref=) · xcmd · xcmd-issue · rank |
| `line` | shadcn (mặc định) · evil · evil-glow · evil-mono · opendata |
| `area` | evil (mặc định) · star · opendata · pixel · polka |
| `radar` | base (mặc định) · evil · xcmd |
| `sankey` | base (mặc định) · fund · pipeline |
| `gauge` | base (mặc định) · gradient · reliability |
| `scatter/combo/qr` | base (combo thêm evil) |

## Truyền dữ liệu

```text
https://x-cmd.com/draw?type=pie&title=Sao%20theo%20ng%C3%B4n%20ng%E1%BB%AF&labels=TypeScript,Python,Go&values=4821,2312,980
```

Nhãn chứa dấu phẩy: lặp tham số (`labels=Q1, 2024&labels=Q2`). Dữ liệu phức tạp: `?d=` + JSON mã hóa URL:

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

## Liên kết ngắn

POST tạo liên kết ngắn vĩnh viễn đánh địa chỉ theo nội dung (kho GitHub làm nơi lưu):

- cùng dữ liệu → cùng hash (idempotent, khử trùng)
- giới hạn 30 yêu cầu/phút/IP
- kho công khai — không dữ liệu nhạy cảm

## Phiên bản

- không `v`: bản mới nhất, cache 300 giây
- `v=N`: ghim phiên bản, cache 1 ngày
- `immutable` chỉ cho `/c/<hash>`

## Thân thiện AI

Mỗi SVG nhúng JSON: `{generator, template, version, spec}` — dữ liệu và tham số qua lại trực tiếp; chữ là `<text>` thật.

## Tự host một bước

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

Script clone, đăng nhập wrangler, triển khai và in URL `*.workers.dev` của bạn. Liên kết ngắn (POST) bật qua `DATA_REPO` + `GITHUB_TOKEN`.

## Phát triển

```sh
npm install
npm run dev      # wrangler dev
npm test         # vitest (120)
npm run check    # tsc ×3
npm run build    # dist/
```

## Giấy phép

Mã nguồn Apache-2.0; phông OFL — [LICENSE](../LICENSE) · Tài liệu đầy đủ: [README (EN)](../README.md)
