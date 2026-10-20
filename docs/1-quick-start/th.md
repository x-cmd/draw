---
x-title: ไทย — draw quick start
x-desc: กราฟ SVG สำหรับยุค AI: endpoint เดียว `/draw?type=.
x-sidebar: draw
x-keywords: draw, quickstart, svg, chart
---

# draw — กราฟ SVG ที่ข้อมูลอยู่ใน URL

กราฟ SVG สำหรับยุค AI: endpoint เดียว `/draw?type=...` ข้อมูลอยู่ใน URL และมี `<metadata>` ที่เครื่องอ่านได้ในทุกผลลัพธ์ ระบบสไตล์ตามสเปกดีไซเนอร์ มีหลายVariant ต่อชนิดกราฟ

## ตัวอย่าง

```text
https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2
```

![pie](https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2)

## 3 วิธีใช้งาน

**บริการโฮสต์ (ไม่ต้องติดตั้ง)** · **ไลบรารี npm + CLI (ออฟไลน์, ซิงค์)** · Deno:

```ts
import { draw } from "jsr:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

## Endpoint

| type | | |
|---|---|---|
| `pie` | โดนัท; `donut=0` = วงกลมเต็ม | ≤100 หมวด (>9 → Other) |
| `bar` | แท่งแนวตั้งกลุ่ม; `stack=1` ซ้อน | ≤30 กลุ่ม |
| `hbar` | แท่งแนวนอน (อันดับ) | ≤30 แท่ง |
| `line` | เส้นเรียบ + ไล่เฉด / หลายเส้น | ≤60 จุด |
| `area` | พื้นที่ / หลายพื้นที่ | ≤60 จุด |
| `radar` | เรดาร์ | 3–12 แกน |
| `gauge` | เกจ (ส่วนโค้ง 240° ค่ากลาง) | value+max; วง ≤8 |
| `scatter` | กระจาย สองแกนตัวเลข ค่าลบได้ | x=&y=, ≤200 จุด |
| `combo` | แท่ง (`series=`) + เส้น (`line=`); สองแกนเมื่อต่าง 5× | ≤30 กลุ่ม, ≤6 ชุด |
| `sankey` | แผนภาพการไหลตามความกว้าง | labels=+links=A>B:30, ≤24 โหนด |
| `qr` | คิวอาร์โค้ด | d≤1000 อักขระ, fg/bg, title/unit |

โค้ด Apache-2.0; ฟอนต์ OFL — [README (EN)](../readme/en.md)
