---
x-title: gauge 게이지 — x-cmd/draw
x-desc: AI 시대의 SVG 차트 생성: 단일 엔드포인트 `/draw?type=. type=gauge.
x-sidebar: draw
x-keywords: draw, gauge, 게이지, svg, chart
---

# gauge 게이지

`GET /draw?type=gauge&...` — 차트 렌더링

## 예시

**base**

```text
https://x-cmd.com/draw?type=gauge&title=CI%20%ED%86%B5%EA%B3%BC%EC%9C%A8&value=87&max=100
```

![gauge base](https://x-cmd.com/draw?type=gauge&title=CI%20%ED%86%B5%EA%B3%BC%EC%9C%A8&value=87&max=100)

**gradient**

```text
https://x-cmd.com/draw?type=gauge&t=gradient&title=CI%20%ED%86%B5%EA%B3%BC%EC%9C%A8&value=87&max=100
```

![gauge gradient](https://x-cmd.com/draw?type=gauge&t=gradient&title=CI%20%ED%86%B5%EA%B3%BC%EC%9C%A8&value=87&max=100)

**reliability**

```text
https://x-cmd.com/draw?type=gauge&t=reliability&title=CI%20%ED%86%B5%EA%B3%BC%EC%9C%A8&value=99.9&max=100
```

![gauge reliability](https://x-cmd.com/draw?type=gauge&t=reliability&title=CI%20%ED%86%B5%EA%B3%BC%EC%9C%A8&value=99.9&max=100)

## 파라미터

| 파라미터 | | |
|---|---|---|
| `value=` | 현재 값 | ✓ |
| `max=` | 최대(기본 100) | ✗ |
| `labels=` | 링 라벨(다중 링) | ✗ |
| `values=` | 링 값(백분율) | ✗ |
| `title=` | 제목 | ✗ |
| `t=` | 스타일 계열 | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `gradient` |
| `reliability` |

## 주의점

- 그래프당 값 1개. 여러 값은 combo/line으로
- 제목의 공백은 `%20`으로 인코딩
