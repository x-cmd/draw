---
x-title: combo 복합 — x-cmd/draw
x-desc: AI 시대의 SVG 차트 생성: 단일 엔드포인트 `/draw?type=. type=combo.
x-sidebar: draw
x-keywords: draw, combo, 복합, svg, chart
---

# combo 복합

`GET /draw?type=combo&...` — 차트 렌더링

## 예시

**base**

```text
https://x-cmd.com/draw?type=combo&labels=%EC%9B%94,%ED%99%94,%EC%88%98,%EB%AA%A9,%EA%B8%88,%ED%86%A0,%EC%9D%BC&series=%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C:120,180,150,210,240,200,260&line=%EC%84%B1%EC%9E%A5%EB%A5%A0:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%EC%A3%BC%EA%B0%84%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C&unit=dl
```

![combo base](https://x-cmd.com/draw?type=combo&labels=%EC%9B%94,%ED%99%94,%EC%88%98,%EB%AA%A9,%EA%B8%88,%ED%86%A0,%EC%9D%BC&series=%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C:120,180,150,210,240,200,260&line=%EC%84%B1%EC%9E%A5%EB%A5%A0:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%EC%A3%BC%EA%B0%84%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C&unit=dl)

**evil**

```text
https://x-cmd.com/draw?type=combo&t=evil&labels=%EC%9B%94,%ED%99%94,%EC%88%98&series=%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C:9,12,15&line=%EC%84%B1%EC%9E%A5%EB%A5%A0:1.1,1.4,1.8&title=%EC%A3%BC%EA%B0%84%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C
```

![combo evil](https://x-cmd.com/draw?type=combo&t=evil&labels=%EC%9B%94,%ED%99%94,%EC%88%98&series=%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C:9,12,15&line=%EC%84%B1%EC%9E%A5%EB%A5%A0:1.1,1.4,1.8&title=%EC%A3%BC%EA%B0%84%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C)

## 파라미터

| 파라미터 | | |
|---|---|---|
| `labels=` | 라벨(쉼표 구분) | ✓ |
| `series=` | 계열 `이름:값`, 반복 가능 | ✓ |
| `line=` | 선 계열 `이름:값` | ✗ |
| `stack=` | 1 = 누적 | ✗ |
| `title=` | 제목 | ✗ |
| `t=` | 스타일 계열 | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `evil` |

## 주의점

- 막대 + 선. 5× 차이부터 이중 축
- 제목의 공백은 `%20`으로 인코딩
