---
x-title: bar 세로 막대 — x-cmd/draw
x-desc: AI 시대의 SVG 차트 생성: 단일 엔드포인트 `/draw?type=. type=bar.
x-sidebar: draw
x-keywords: draw, bar, 세로 막대, svg, chart
---

# bar 세로 막대

`GET /draw?type=bar&...` — 차트 렌더링

## 예시

**evil**

```text
https://x-cmd.com/draw?type=bar&t=evil&labels=%EC%9B%94,%ED%99%94,%EC%88%98,%EB%AA%A9,%EA%B8%88,%ED%86%A0,%EC%9D%BC&series=%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C:34,87,51,63,45,78,39&series=%EC%84%B1%EC%9E%A5%EB%A5%A0:18,49,29,39,31,45,23
```

![bar evil](https://x-cmd.com/draw?type=bar&t=evil&labels=%EC%9B%94,%ED%99%94,%EC%88%98,%EB%AA%A9,%EA%B8%88,%ED%86%A0,%EC%9D%BC&series=%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C:34,87,51,63,45,78,39&series=%EC%84%B1%EC%9E%A5%EB%A5%A0:18,49,29,39,31,45,23)

**base**

```text
https://x-cmd.com/draw?type=bar&labels=%EC%9B%94,%ED%99%94,%EC%88%98&series=dev:12,18,9&series=CI:8,11,6
```

![bar base](https://x-cmd.com/draw?type=bar&labels=%EC%9B%94,%ED%99%94,%EC%88%98&series=dev:12,18,9&series=CI:8,11,6)

**grid**

```text
https://x-cmd.com/draw?type=bar&t=grid&labels=%EC%9B%94,%ED%99%94,%EC%88%98&values=12,18,9
```

![bar grid](https://x-cmd.com/draw?type=bar&t=grid&labels=%EC%9B%94,%ED%99%94,%EC%88%98&values=12,18,9)

**evil stack**

```text
https://x-cmd.com/draw?type=bar&stack=1&labels=%EC%9B%94,%ED%99%94,%EC%88%98&series=dev:12,18,9&series=CI:8,11,6
```

![bar evil stack](https://x-cmd.com/draw?type=bar&stack=1&labels=%EC%9B%94,%ED%99%94,%EC%88%98&series=dev:12,18,9&series=CI:8,11,6)

## 파라미터

| 파라미터 | | |
|---|---|---|
| `labels=` | 라벨(쉼표 구분) | ✓ |
| `values=` | 값(쉼표 구분) | ✓ |
| `series=` | 계열 `이름:값`, 반복 가능 | ✗ |
| `stack=` | 1 = 누적 | ✗ |
| `title=` | 제목 | ✗ |
| `t=` | 스타일 계열 | ✗ |

## `t=`

| | |
|---|---|
| `evil` |
| `base` |
| `grid` |

## 주의점

- ≤30그룹, ≤6계열
- 규모 차이가 극단적이면 자동으로 100% 누적
- 제목의 공백은 `%20`으로 인코딩
