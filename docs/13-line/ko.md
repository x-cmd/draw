---
x-title: line 선 — x-cmd/draw
x-desc: AI 시대의 SVG 차트 생성: 단일 엔드포인트 `/draw?type=. type=line.
x-sidebar: draw
x-keywords: draw, line, 선, svg, chart
---

# line 선

`GET /draw?type=line&...` — 차트 렌더링

## 예시

**shadcn**

```text
https://x-cmd.com/draw?type=line&labels=1%EC%9B%94,2%EC%9B%94,3%EC%9B%94,4%EC%9B%94,5%EC%9B%94,6%EC%9B%94&values=12,19,15,25,22,30&title=%EC%96%B8%EC%96%B4%EB%B3%84%20%EC%8A%A4%ED%83%80
```

![line shadcn](https://x-cmd.com/draw?type=line&labels=1%EC%9B%94,2%EC%9B%94,3%EC%9B%94,4%EC%9B%94,5%EC%9B%94,6%EC%9B%94&values=12,19,15,25,22,30&title=%EC%96%B8%EC%96%B4%EB%B3%84%20%EC%8A%A4%ED%83%80)

**evil**

```text
https://x-cmd.com/draw?type=line&t=evil&labels=1%EC%9B%94,2%EC%9B%94,3%EC%9B%94,4%EC%9B%94,5%EC%9B%94,6%EC%9B%94&series=%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C:12,19,15,25,22,30&series=CI:8,11,9,14,12,10
```

![line evil](https://x-cmd.com/draw?type=line&t=evil&labels=1%EC%9B%94,2%EC%9B%94,3%EC%9B%94,4%EC%9B%94,5%EC%9B%94,6%EC%9B%94&series=%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C:12,19,15,25,22,30&series=CI:8,11,9,14,12,10)

**evil-glow**

```text
https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=%EC%84%B1%EC%9E%A5%EB%A5%A0
```

![line evil-glow](https://x-cmd.com/draw?type=line&t=evil-glow&labels=Q1,Q2,Q3,Q4&values=3.1,3.4,3.2,3.8&title=%EC%84%B1%EC%9E%A5%EB%A5%A0)

**opendata**

```text
https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C
```

![line opendata](https://x-cmd.com/draw?type=line&t=opendata&labels=v1,v2,v3&values=120,240,410&title=%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C)

## 파라미터

| 파라미터 | | |
|---|---|---|
| `labels=` | 라벨(쉼표 구분) | ✓ |
| `values=` | 값(쉼표 구분) | ✓ |
| `series=` | 계열 `이름:값`, 반복 가능 | ✗ |
| `title=` | 제목 | ✗ |
| `t=` | 스타일 계열 | ✗ |

## `t=`

| | |
|---|---|
| `shadcn` |
| `evil` |
| `evil-glow` |
| `evil-mono` |
| `opendata` |

## 주의점

- ≤60점. 여러 선은 각 선의 피크만 표시
- 제목의 공백은 `%20`으로 인코딩
