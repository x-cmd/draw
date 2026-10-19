# draw — 데이터가 URL에 담긴 SVG 차트

> [English](../README.md) | **한국어**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)

모든 데이터가 URL 안에 있습니다 — 브라우저에서 열거나 `<img>`로 삽입하거나 README에 붙여넣으면 SVG가 즉시 렌더링되고 AI가 바로 읽을 수 있습니다.

## 미리보기

### 원형 차트 — 최대 도시

```text
https://x-cmd.com/draw?type=pie&title=%EA%B0%80%EC%9E%A5%20%ED%81%B0%20%EB%8F%84%EC%8B%9C%20%EC%9D%B8%EA%B5%AC&unit=%EB%B0%B1%EB%A7%8C%20%EB%AA%85&labels=%EC%84%9C%EC%9A%B8,%EB%B6%80%EC%82%B0,%EC%9D%B8%EC%B2%9C,%EB%8C%80%EA%B5%AC&values=9.7,3.4,2.9,2.4
```

![원형 차트 — 최대 도시](https://x-cmd.com/draw?type=pie&title=%EA%B0%80%EC%9E%A5%20%ED%81%B0%20%EB%8F%84%EC%8B%9C%20%EC%9D%B8%EA%B5%AC&unit=%EB%B0%B1%EB%A7%8C%20%EB%AA%85&labels=%EC%84%9C%EC%9A%B8,%EB%B6%80%EC%82%B0,%EC%9D%B8%EC%B2%9C,%EB%8C%80%EA%B5%AC&values=9.7,3.4,2.9,2.4)

### 수평 막대 — 영역별 랭킹

```text
https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=%EC%98%81%EC%97%AD%EB%B3%84%20%EC%BB%A4%EB%B0%8B
```

![수평 막대 — 영역별 랭킹](https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=%EC%98%81%EC%97%AD%EB%B3%84%20%EC%BB%A4%EB%B0%8B)

### 복합 — 다운로드와 성장

```text
https://x-cmd.com/draw?type=combo&labels=%EC%9B%94,%ED%99%94,%EC%88%98,%EB%AA%A9,%EA%B8%88,%ED%86%A0,%EC%9D%BC&series=%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C:120,180,150,210,240,200,260&line=%EC%84%B1%EC%9E%A5%EB%A5%A0:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%EC%A3%BC%EA%B0%84%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C&unit=dl
```

![복합 — 다운로드와 성장](https://x-cmd.com/draw?type=combo&labels=%EC%9B%94,%ED%99%94,%EC%88%98,%EB%AA%A9,%EA%B8%88,%ED%86%A0,%EC%9D%BC&series=%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C:120,180,150,210,240,200,260&line=%EC%84%B1%EC%9E%A5%EB%A5%A0:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%EC%A3%BC%EA%B0%84%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C&unit=dl)

### 산키 — PR 라이프사이클

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs
```

![산키 — PR 라이프사이클](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y%2B&links=feat%3Emerged:38;feat%3Eclosed:12;feat%3Erejected:8;fix%3Emerged:33;fix%3Eclosed:6;fix%3Erejected:2;docs%3Emerged:16;docs%3Eclosed:4;chore%3Emerged:5;chore%3Eclosed:6;chore%3Erejected:6;merged%3E0-1y:52;merged%3E1-2y:28;merged%3E2y%2B:12;closed%3E0-1y:14;closed%3E1-2y:9;closed%3E2y%2B:5;rejected%3E0-1y:9;rejected%3E1-2y:5;rejected%3E2y%2B:2&title=Pull%20requests%20lifecycle&unit=prs)

## 3가지 사용 방법

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

## 모든 차트 유형

| type | | |
|---|---|---|
| `pie` | 도넛; donut=0 = 원형 | ≤100개 |
| `bar` | 묶은 세로 막대; stack=1 | ≤30그룹 |
| `hbar` | 수평 막대(랭킹) | ≤30개 |
| `line` | 부드러운 선 + 그라데이션 | ≤60점 |
| `area` | 면적 / 다중 면적 | ≤60점 |
| `radar` | 레이더 | 3–12축 |
| `gauge` | 게이지(240° 호) | value+max; 링 ≤8 |
| `scatter` | 산점도, 음수 가능 | ≤200점 |
| `combo` | 막대 + 선, 이중 축 | ≤6계열 |
| `sankey` | 플로우 다이어그램 | ≤24노드 |
| `qr` | QR 코드 | ≤1000자 |

---

전체 문서(영어): [README (EN)](../README.md) · [docs](../docs/) — 코드 Apache-2.0; 글꼴 OFL.
