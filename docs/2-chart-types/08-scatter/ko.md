---
x-title: scatter 산점 — x-cmd/draw
x-desc: AI 시대의 SVG 차트 생성: 단일 엔드포인트 `/draw?type=. type=scatter.
x-sidebar: draw
x-keywords: draw, scatter, 산점, svg, chart
---

# scatter 산점

`GET /draw?type=scatter&...` — 차트 렌더링

## 예시

**base**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=%EC%A7%80%EC%97%B0%20%EC%8B%9C%EA%B0%84
```

![scatter base](https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=%EC%A7%80%EC%97%B0%20%EC%8B%9C%EA%B0%84)

**base neg**

```text
https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=%EC%A7%80%EC%97%B0%20%EC%8B%9C%EA%B0%84
```

![scatter base neg](https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=%EC%A7%80%EC%97%B0%20%EC%8B%9C%EA%B0%84)

**base num**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=%EC%A7%80%EC%97%B0%20%EC%8B%9C%EA%B0%84
```

![scatter base num](https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=%EC%A7%80%EC%97%B0%20%EC%8B%9C%EA%B0%84)

## 파라미터

| 파라미터 | | |
|---|---|---|
| `x=` | x 값 | ✓ |
| `y=` | y 값 | ✓ |
| `title=` | 제목 | ✗ |
| `num=` | 수치 표시: all/peak/none | ✗ |
| `t=` | 스타일 계열 | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## 주의점

- 계열당 ≤200점. 음수 가능
- 제목의 공백은 `%20`으로 인코딩
