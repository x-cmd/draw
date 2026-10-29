---
x-title: area 면적 — x-cmd/draw
x-desc: AI 시대의 SVG 차트 생성: 단일 엔드포인트 `/draw?type=. type=area.
x-sidebar: draw
x-keywords: draw, area, 면적, svg, chart
---

# area 면적

`GET /draw?type=area&...` — 차트 렌더링

## 예시

**evil**

```text
https://x-cmd.com/draw?type=area&labels=%EC%9B%94,%ED%99%94,%EC%88%98&series=dev:30,42,38&series=CI:12,18,9&title=%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C
```

![area evil](https://x-cmd.com/draw?type=area&labels=%EC%9B%94,%ED%99%94,%EC%88%98&series=dev:30,42,38&series=CI:12,18,9&title=%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C)

**star**

```text
https://x-cmd.com/draw?type=area&t=star&labels=%EC%9B%94,%ED%99%94,%EC%88%98&values=3,5,4&title=%EC%84%B1%EC%9E%A5%EB%A5%A0
```

![area star](https://x-cmd.com/draw?type=area&t=star&labels=%EC%9B%94,%ED%99%94,%EC%88%98&values=3,5,4&title=%EC%84%B1%EC%9E%A5%EB%A5%A0)

**opendata**

```text
https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=%EC%84%B1%EC%9E%A5%EB%A5%A0&source=x-cmd.com%2Fdraw
```

![area opendata](https://x-cmd.com/draw?type=area&t=opendata&labels=2019,2020,2021,2022&values=1.2,2.8,6.4,14.1&title=%EC%84%B1%EC%9E%A5%EB%A5%A0&source=x-cmd.com%2Fdraw)

**pixel**

```text
https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=%EC%84%B1%EC%9E%A5%EB%A5%A0
```

![area pixel](https://x-cmd.com/draw?type=area&t=pixel&labels=a,b,c,d&values=2,4,3,5&title=%EC%84%B1%EC%9E%A5%EB%A5%A0)

## 파라미터

| 파라미터 | | |
|---|---|---|
| `labels=` | 라벨(쉼표 구분) | ✓ |
| `values=` | 값(쉼표 구분) | ✓ |
| `series=` | 계열 `이름:값`, 반복 가능 | ✗ |
| `source=` | 출처(area 전용) | ✗ |
| `subtitle=` | 부제(area opendata) | ✗ |
| `t=` | 스타일 계열 | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `star` |
| `opendata` |
| `pixel` |
| `polka` |

## 주의점

- ≤60점. 여러 선은 각 선의 피크만 표시
- 제목의 공백은 `%20`으로 인코딩
