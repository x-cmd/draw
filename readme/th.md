# draw — กราฟ SVG ที่ข้อมูลอยู่ใน URL

> [English](../README.md) | **ไทย**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)

ข้อมูลทั้งหมดอยู่ใน URL — เปิดในเบราว์เซอร์ ฝังด้วย `<img>` หรือวางใน README: SVG เรนเดอร์ทันทีและ AI อ่านได้โดยตรง

## ตัวอย่าง

### วงกลม — เมืองใหญ่ที่สุด

```text
https://x-cmd.com/draw?type=pie&title=%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%8A%E0%B8%B2%E0%B8%81%E0%B8%A3%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87%E0%B9%83%E0%B8%AB%E0%B8%8D%E0%B9%88&unit=%E0%B8%A5%E0%B9%89%E0%B8%B2%E0%B8%99&labels=%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3,%E0%B8%99%E0%B8%99%E0%B8%97%E0%B8%9A%E0%B8%B8%E0%B8%A3%E0%B8%B5,%E0%B9%80%E0%B8%8A%E0%B8%B5%E0%B8%A2%E0%B8%87%E0%B9%83%E0%B8%AB%E0%B8%A1%E0%B9%88,%E0%B8%A0%E0%B8%B9%E0%B9%80%E0%B8%81%E0%B9%87%E0%B8%95&values=10.7,0.3,1.2,0.9
```

![วงกลม — เมืองใหญ่ที่สุด](https://x-cmd.com/draw?type=pie&title=%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%8A%E0%B8%B2%E0%B8%81%E0%B8%A3%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87%E0%B9%83%E0%B8%AB%E0%B8%8D%E0%B9%88&unit=%E0%B8%A5%E0%B9%89%E0%B8%B2%E0%B8%99&labels=%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3,%E0%B8%99%E0%B8%99%E0%B8%97%E0%B8%9A%E0%B8%B8%E0%B8%A3%E0%B8%B5,%E0%B9%80%E0%B8%8A%E0%B8%B5%E0%B8%A2%E0%B8%87%E0%B9%83%E0%B8%AB%E0%B8%A1%E0%B9%88,%E0%B8%A0%E0%B8%B9%E0%B9%80%E0%B8%81%E0%B9%87%E0%B8%95&values=10.7,0.3,1.2,0.9)

### แท่งแนวนอน — จัดอันดับตามส่วน

```text
https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=%E0%B8%84%E0%B8%AD%E0%B8%A1%E0%B8%A1%E0%B8%B4%E0%B8%95%E0%B9%81%E0%B8%A2%E0%B8%81%E0%B8%AA%E0%B9%88%E0%B8%A7%E0%B8%99
```

![แท่งแนวนอน — จัดอันดับตามส่วน](https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=%E0%B8%84%E0%B8%AD%E0%B8%A1%E0%B8%A1%E0%B8%B4%E0%B8%95%E0%B9%81%E0%B8%A2%E0%B8%81%E0%B8%AA%E0%B9%88%E0%B8%A7%E0%B8%99)

### ผสม — ดาวน์โหลดกับการเติบโต

```text
https://x-cmd.com/draw?type=combo&labels=%E0%B8%88,%E0%B8%AD,%E0%B8%9E,%E0%B8%9E%E0%B8%A4,%E0%B8%A8,%E0%B8%AA,%E0%B8%AD%E0%B8%B2&series=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94:120,180,150,210,240,200,260&line=%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%9A%E0%B9%82%E0%B8%95:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%AA%E0%B8%B1%E0%B8%9B%E0%B8%94%E0%B8%B2%E0%B8%AB%E0%B9%8C&unit=dl
```

![ผสม — ดาวน์โหลดกับการเติบโต](https://x-cmd.com/draw?type=combo&labels=%E0%B8%88,%E0%B8%AD,%E0%B8%9E,%E0%B8%9E%E0%B8%A4,%E0%B8%A8,%E0%B8%AA,%E0%B8%AD%E0%B8%B2&series=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94:120,180,150,210,240,200,260&line=%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%9A%E0%B9%82%E0%B8%95:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%AA%E0%B8%B1%E0%B8%9B%E0%B8%94%E0%B8%B2%E0%B8%AB%E0%B9%8C&unit=dl)

### แซงกี้ — วงจรชีวิต PR

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs
```

![แซงกี้ — วงจรชีวิต PR](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs)

## 3 วิธีใช้งาน

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

## กราฟทุกประเภท

| type | | |
|---|---|---|
| `pie` | โดนัท; donut=0 = วงกลมเต็ม | ≤100 หมวด |
| `bar` | แท่งแนวตั้งกลุ่ม; stack=1 | ≤30 กลุ่ม |
| `hbar` | แท่งแนวนอน (อันดับ) | ≤30 แท่ง |
| `line` | เส้นเรียบ + ไล่เฉด | ≤60 จุด |
| `area` | พื้นที่ / หลายพื้นที่ | ≤60 จุด |
| `radar` | เรดาร์ | 3–12 แกน |
| `gauge` | เกจ (ส่วนโค้ง 240°) | value+max; วง ≤8 |
| `scatter` | กระจาย ค่าลบได้ | ≤200 จุด |
| `combo` | แท่ง + เส้น สองแกน | ≤6 ชุด |
| `sankey` | แผนภาพการไหล | ≤24 โหนด |
| `qr` | คิวอาร์โค้ด | ≤1000 อักขระ |

---

เอกสารฉบับเต็ม (อังกฤษ): [README (EN)](../README.md) · [docs](../docs/) — โค้ด Apache-2.0; ฟอนต์ OFL.
