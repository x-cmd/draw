---
x-title: 한국어 — draw overview
x-desc: AI 시대의 SVG 차트 생성: 단일 엔드포인트 `/draw?type=.
x-sidebar: draw
x-keywords: draw, overview, svg, chart, api
---

# draw — 데이터가 URL에 담긴 SVG 차트

AI 시대의 SVG 차트 생성: 단일 엔드포인트 `/draw?type=...`, 데이터는 URL 안, 모든 출력에 머신 판독 가능한 `<metadata>` 포함. 스타일 시스템은 디자인 사양을 따르며 차트 유형별 여러 변형 제공.

## 엔드포인트

| type | | |
|---|---|---|
| `pie` | 도넛; `donut=0` = 원형 | ≤100개(>9는 Other 병합) |
| `bar` | 묶은 세로 막대; `stack=1` 누적 | ≤30그룹 |
| `hbar` | 수평 막대(랭킹) | ≤30개 |
| `line` | 부드러운 선 + 그라데이션/다중 선 | ≤60점 |
| `area` | 면적 / 다중 면적 | ≤60점 |
| `radar` | 레이더 | 3–12축 |
| `gauge` | 게이지(240° 호, 중앙 값) | value+max; 링 ≤8 |
| `scatter` | 산점도, 두 숫자 축, 음수 가능 | x=&y=, ≤200점 |
| `combo` | 막대(`series=`)+선(`line=`); 5× 차이부터 이중 축 | ≤30그룹, ≤6계열 |
| `sankey` | 플로우 다이어그램(폭=량) | labels=+links=A>B:30, ≤24노드 |
| `qr` | QR 코드 | d≤1000자, fg/bg, title/unit |

## 버전

- `v` 없음: 최신 버전, 캐시 300초
- `v=N`: 버전 고정, 캐시 1일
- `immutable`은 `/c/<hash>` 전용

## AI 친화적

모든 SVG에 JSON 내장: `{generator, template, version, spec}` — 데이터와 파라미터가 그대로 왕복하며 텍스트는 진짜 `<text>`.
