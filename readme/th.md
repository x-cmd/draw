# draw — กราฟ SVG ที่ข้อมูลอยู่ใน URL

> [English](../README.md) | **ไทย**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/x-cmd/draw/badge)](https://securityscorecards.dev/viewer/?uri=github.com/x-cmd/draw)

กราฟ SVG สำหรับยุค AI: endpoint เดียว `/draw?type=...` ข้อมูลอยู่ใน URL และมี `<metadata>` ที่เครื่องอ่านได้ในทุกผลลัพธ์ ระบบสไตล์ตามสเปกดีไซเนอร์ มีหลายVariant ต่อชนิดกราฟ

## ตัวอย่าง

ข้อมูลทั้งหมดอยู่ใน URL — เปิดในเบราว์เซอร์ ฝังด้วย `<img>` หรือวางใน README: SVG เรนเดอร์ทันที

### แซงกี้ — วงจรชีวิต PR (`type=sankey&t=pipeline`)

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs
```

![แซงกี้ — วงจรชีวิต PR](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs)

### แท่งแนวนอน — ทรูพุตรันไทม์ (วัดจริง) (`type=hbar; draw() ops/s: deno 7238 · node 6553 · bun 4972, Apple Silicon`)

```text
https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs
```

![แท่งแนวนอน — ทรูพุตรันไทม์ (วัดจริง)](https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs)

### เรดาร์ — เทียบสามเอดิเตอร์ (`type=radar&t=evil`)

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison
```

![เรดาร์ — เทียบสามเอดิเตอร์](https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison)

### ผสม — ดาวน์โหลดกับการเติบโต (`type=combo`)

```text
https://x-cmd.com/draw?type=combo&labels=%E0%B8%88,%E0%B8%AD,%E0%B8%9E,%E0%B8%9E%E0%B8%A4,%E0%B8%A8,%E0%B8%AA,%E0%B8%AD%E0%B8%B2&series=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94:120,180,150,210,240,200,260&line=%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%9A%E0%B9%82%E0%B8%95:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%AA%E0%B8%B1%E0%B8%9B%E0%B8%94%E0%B8%B2%E0%B8%AB%E0%B9%8C&unit=dl
```

![ผสม — ดาวน์โหลดกับการเติบโต](https://x-cmd.com/draw?type=combo&labels=%E0%B8%88,%E0%B8%AD,%E0%B8%9E,%E0%B8%9E%E0%B8%A4,%E0%B8%A8,%E0%B8%AA,%E0%B8%AD%E0%B8%B2&series=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94:120,180,150,210,240,200,260&line=%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%9A%E0%B9%82%E0%B8%95:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%AA%E0%B8%B1%E0%B8%9B%E0%B8%94%E0%B8%B2%E0%B8%AB%E0%B9%8C&unit=dl)

### แท่งแนวนอน — issue เปิด/ปิด (ผีเสื้อ) (`type=hbar&t=xcmd-issue`)

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=%E0%B9%80%E0%B8%9B%E0%B8%B4%E0%B8%94:12,8,15,4,9&series=%E0%B8%9B%E0%B8%B4%E0%B8%94:38,52,20,11,26&title=issue%20%E0%B9%81%E0%B8%A2%E0%B8%81%E0%B8%AA%E0%B9%88%E0%B8%A7%E0%B8%99
```

![แท่งแนวนอน — issue เปิด/ปิด (ผีเสื้อ)](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=%E0%B9%80%E0%B8%9B%E0%B8%B4%E0%B8%94:12,8,15,4,9&series=%E0%B8%9B%E0%B8%B4%E0%B8%94:38,52,20,11,26&title=issue%20%E0%B9%81%E0%B8%A2%E0%B8%81%E0%B8%AA%E0%B9%88%E0%B8%A7%E0%B8%99)

### วงกลม — เมืองใหญ่ที่สุด (`type=pie&t=market-mono`)

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87%E0%B9%83%E0%B8%AB%E0%B8%8D%E0%B9%88%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AA%E0%B8%B8%E0%B8%94&unit=%E0%B8%A5%E0%B9%89%E0%B8%B2%E0%B8%99&labels=%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3,%E0%B9%80%E0%B8%8A%E0%B8%B5%E0%B8%A2%E0%B8%87%E0%B9%83%E0%B8%AB%E0%B8%A1%E0%B9%88,%E0%B8%99%E0%B8%99%E0%B8%97%E0%B8%9A%E0%B8%B8%E0%B8%A3%E0%B8%B5,%E0%B8%A0%E0%B8%B9%E0%B9%80%E0%B8%81%E0%B9%87%E0%B8%95&values=10.7,1.2,0.3,0.9
```

![วงกลม — เมืองใหญ่ที่สุด](https://x-cmd.com/draw?type=pie&t=market-mono&title=%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87%E0%B9%83%E0%B8%AB%E0%B8%8D%E0%B9%88%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AA%E0%B8%B8%E0%B8%94&unit=%E0%B8%A5%E0%B9%89%E0%B8%B2%E0%B8%99&labels=%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3,%E0%B9%80%E0%B8%8A%E0%B8%B5%E0%B8%A2%E0%B8%87%E0%B9%83%E0%B8%AB%E0%B8%A1%E0%B9%88,%E0%B8%99%E0%B8%99%E0%B8%97%E0%B8%9A%E0%B8%B8%E0%B8%A3%E0%B8%B5,%E0%B8%A0%E0%B8%B9%E0%B9%80%E0%B8%81%E0%B9%87%E0%B8%95&values=10.7,1.2,0.3,0.9)

## 3 วิธีใช้งาน

**บริการโฮสต์ (ไม่ต้องติดตั้ง)** — `https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2`

**ไลบรารี npm + CLI (ออฟไลน์, ซิงค์)** (`npm i -g @x-cmd/draw` / `npx`):

```sh
npm install @x-cmd/draw
```
```ts
import { draw } from '@x-cmd/draw';
const { svg } = draw({ type: 'pie', labels: 'A,B', values: '3,2', t: 'evil', scheme: 'dark' });
// รับ query string ด้วย: draw('?type=bar&labels=จ,อ&values=3,5')
// อาร์เรย์ = พารามิเตอร์ซ้ำ (ป้ายที่มีจุลภาค)
draw({ type: 'bar', labels: ['Q1, 2024', 'Q2'], values: [1, 2] })
```
```sh
draw --type pie --labels "A,B,C" --values "3,2,1" --out pie.svg
draw "?type=hbar&labels=a,b,c&values=3,2,1&t=xcmd"   # query string เปล่า ๆ
```

**Self-host**:

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve      # เซิร์ฟเวอร์ Node ในเครื่อง :8787 พร้อมหน้าเดโม
npm run dev        # wrangler dev
bash scripts/setup.sh   # ดีพลอยคลิกเดียวไปบัญชี Cloudflare ของคุณ
```

ตัวแปรสภาพแวดล้อม (Node): `PORT` (8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (เปิดลิงก์สั้น POST)

**Deno** — แกนเรนเดอร์เป็นฟังก์ชันล้วน ไม่มีเครือข่าย — แซนด์บ็อกซ์ไร้สิทธิ์คือขอบเขตความปลอดภัย:

```ts
import { draw } from "jsr:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

## Endpoint

**`GET /draw?type=<pie|bar|hbar|line|area|radar|gauge|scatter|combo|sankey|qr>`** — เรนเดอร์กราฟ

| type | | |
|---|---|---|
| `pie` | โดนัท; `donut=0` = วงกลมเต็ม<br><br>**<u>≤100 หมวด (>9 → Other)</u>** | <a href="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%95%E0%B8%B2%E0%B8%A1%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B2"><img src="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%95%E0%B8%B2%E0%B8%A1%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B2" width="360" alt="example"></a> |
| `bar` | แท่งแนวตั้งกลุ่ม; `stack=1` ซ้อน<br><br>**<u>≤30 กลุ่ม</u>** | <a href="https://x-cmd.com/draw?type=bar&labels=%E0%B8%88,%E0%B8%AD,%E0%B8%9E&series=dev:12,18,9&series=ci:8,11,6"><img src="https://x-cmd.com/draw?type=bar&labels=%E0%B8%88,%E0%B8%AD,%E0%B8%9E&series=dev:12,18,9&series=ci:8,11,6" width="360" alt="example"></a> |
| `hbar` | แท่งแนวนอน (อันดับ)<br><br>**<u>≤30 แท่ง</u>** | <a href="https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=%E0%B8%84%E0%B8%AD%E0%B8%A1%E0%B8%A1%E0%B8%B4%E0%B8%95%E0%B9%81%E0%B8%A2%E0%B8%81%E0%B8%AA%E0%B9%88%E0%B8%A7%E0%B8%99"><img src="https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=%E0%B8%84%E0%B8%AD%E0%B8%A1%E0%B8%A1%E0%B8%B4%E0%B8%95%E0%B9%81%E0%B8%A2%E0%B8%81%E0%B8%AA%E0%B9%88%E0%B8%A7%E0%B8%99" width="360" alt="example"></a> |
| `line` | เส้นเรียบ + ไล่เฉด / หลายเส้น<br><br>**<u>≤60 จุด</u>** | <a href="https://x-cmd.com/draw?type=line&labels=%E0%B8%A1.%E0%B8%84.,%E0%B8%81.%E0%B8%9E.,%E0%B8%A1%E0%B8%B5.%E0%B8%84.,%E0%B9%80%E0%B8%A1.%E0%B8%A2.,%E0%B8%9E.%E0%B8%84.,%E0%B8%A1%E0%B8%B4.%E0%B8%A2.&values=12,19,15,25,22,30&title=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%95%E0%B8%B2%E0%B8%A1%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B2"><img src="https://x-cmd.com/draw?type=line&labels=%E0%B8%A1.%E0%B8%84.,%E0%B8%81.%E0%B8%9E.,%E0%B8%A1%E0%B8%B5.%E0%B8%84.,%E0%B9%80%E0%B8%A1.%E0%B8%A2.,%E0%B8%9E.%E0%B8%84.,%E0%B8%A1%E0%B8%B4.%E0%B8%A2.&values=12,19,15,25,22,30&title=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%95%E0%B8%B2%E0%B8%A1%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B2" width="360" alt="example"></a> |
| `area` | พื้นที่ / หลายพื้นที่<br><br>**<u>≤60 จุด</u>** | <a href="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94"><img src="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94" width="360" alt="example"></a> |
| `radar` | เรดาร์<br><br>**<u>3–12 แกน</u>** | <a href="https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison"><img src="https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison" width="360" alt="example"></a> |
| `gauge` | เกจ (ส่วนโค้ง 240° ค่ากลาง)<br><br>**<u>value+max; วง ≤8</u>** | <a href="https://x-cmd.com/draw?type=gauge&title=%E0%B8%AD%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B8%B2%20CI&value=87&max=100"><img src="https://x-cmd.com/draw?type=gauge&title=%E0%B8%AD%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B8%B2%20CI&value=87&max=100" width="360" alt="example"></a> |
| `scatter` | กระจาย สองแกนตัวเลข ค่าลบได้<br><br>**<u>x=&y=, ≤200 จุด</u>** | <a href="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%87"><img src="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%87" width="360" alt="example"></a> |
| `combo` | แท่ง (`series=`) + เส้น (`line=`); สองแกนเมื่อต่าง 5×<br><br>**<u>≤30 กลุ่ม, ≤6 ชุด</u>** | <a href="https://x-cmd.com/draw?type=combo&labels=%E0%B8%88,%E0%B8%AD,%E0%B8%9E,%E0%B8%9E%E0%B8%A4,%E0%B8%A8,%E0%B8%AA,%E0%B8%AD%E0%B8%B2&series=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94:120,180,150,210,240,200,260&line=%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%9A%E0%B9%82%E0%B8%95:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%AA%E0%B8%B1%E0%B8%9B%E0%B8%94%E0%B8%B2%E0%B8%AB%E0%B9%8C&unit=dl"><img src="https://x-cmd.com/draw?type=combo&labels=%E0%B8%88,%E0%B8%AD,%E0%B8%9E,%E0%B8%9E%E0%B8%A4,%E0%B8%A8,%E0%B8%AA,%E0%B8%AD%E0%B8%B2&series=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94:120,180,150,210,240,200,260&line=%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%9A%E0%B9%82%E0%B8%95:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%AA%E0%B8%B1%E0%B8%9B%E0%B8%94%E0%B8%B2%E0%B8%AB%E0%B9%8C&unit=dl" width="360" alt="example"></a> |
| `sankey` | แผนภาพการไหลตามความกว้าง<br><br>**<u>labels=+links=A>B:30, ≤24 โหนด</u>** | <a href="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs"><img src="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs" width="360" alt="example"></a> |
| `qr` | คิวอาร์โค้ด<br><br>**<u>d≤1000 อักขระ, fg/bg, title/unit</u>** | <a href="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=%E0%B8%AA%E0%B9%81%E0%B8%81%E0%B8%99"><img src="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=%E0%B8%AA%E0%B9%81%E0%B8%81%E0%B8%99" width="360" alt="example"></a> |

**`GET /draw`** — หน้าเดโม · **`POST /draw?type=...`** — body JSON/CSV สร้างลิงก์สั้นถาวร · **`GET /draw/c/<hash>`** — เรนเดอร์ลิงก์สั้น (immutable)

## สไตล์ (`?t=`)

| type | |
|---|---|
| `pie` | opendata (ค่าตั้งต้น) · evil · evil-mono · market-mono · progress · revenue |
| `bar` | evil (ค่าตั้งต้น) · base · grid |
| `hbar` | base (ค่าตั้งต้น) · opendata (ref=) · xcmd · xcmd-issue · rank |
| `line` | shadcn (ค่าตั้งต้น) · evil · evil-glow · evil-mono · opendata |
| `area` | evil (ค่าตั้งต้น) · star · opendata · pixel · polka |
| `radar` | base (ค่าตั้งต้น) · evil · xcmd |
| `sankey` | base (ค่าตั้งต้น) · fund · pipeline |
| `gauge` | base (ค่าตั้งต้น) · gradient · reliability |
| `scatter/combo/qr` | base (combo มี evil เพิ่ม) |

## การส่งข้อมูล

```text
https://x-cmd.com/draw?type=pie&title=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%95%E0%B8%B2%E0%B8%A1%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B2&labels=TypeScript,Python,Go&values=4821,2312,980
```

ป้ายที่มีจุลภาค: ทำซ้ำพารามิเตอร์ (`labels=Q1, 2024&labels=Q2`) ข้อมูลซับซ้อน: `?d=` + JSON เข้ารหัส URL:

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

## ลิงก์สั้น

POST สร้างลิงก์สั้นถาวรแบบชี้ตามเนื้อหา (เก็บในรีโป GitHub):

- ข้อมูลเดิม → hash เดิม (idempotent, ตัดซ้ำ)
- จำกัด 30 คำขอ/นาที/IP
- ที่เก็บสาธารณะ — ห้ามข้อมูลอ่อนไหว

## เวอร์ชัน

- ไม่มี `v`: เวอร์ชันล่าสุด แคช 300 วิ
- `v=N`: ล็อกเวอร์ชัน แคช 1 วัน
- `immutable` เฉพาะ `/c/<hash>`

## เป็นมิตรกับ AI

ทุก SVG ฝัง JSON: `{generator, template, version, spec}` — ข้อมูลและพารามิเตอร์ไป-กลับได้ตรง ๆ ข้อความเป็น `<text>` จริง

## Self-host หนึ่งสเต็ป

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

สคริปต์ clone, ล็อกอิน wrangler, ดีพลอย และพิมพ์ URL `*.workers.dev` ของคุณ ลิงก์สั้น (POST) เปิดด้วย `DATA_REPO` + `GITHUB_TOKEN`

## พัฒนา

```sh
npm install
npm run dev      # wrangler dev
npm test         # vitest (120)
npm run check    # tsc ×3
npm run build    # dist/
```

## สัญญาอนุญาต

โค้ด Apache-2.0; ฟอนต์ OFL — [LICENSE](../LICENSE) · เอกสารฉบับเต็ม: [README (EN)](../README.md)
