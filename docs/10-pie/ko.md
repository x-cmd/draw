---
x-title: pie 원형 — x-cmd/draw
x-desc: AI 시대의 SVG 차트 생성: 단일 엔드포인트 `/draw?type=. type=pie.
x-sidebar: draw
x-keywords: draw, pie, 원형, svg, chart
---

# pie 원형

`GET /draw?type=pie&...` — 차트 렌더링

## 예시

**opendata**

```text
https://x-cmd.com/draw?type=pie&title=%EC%B5%9C%EB%8C%80%20%EB%8F%84%EC%8B%9C%20%EC%9D%B8%EA%B5%AC&unit=%EB%B0%B1%EB%A7%8C%20%EB%AA%85&labels=%EC%84%9C%EC%9A%B8,%EB%B6%80%EC%82%B0,%EC%9D%B8%EC%B2%9C,%EB%8C%80%EA%B5%AC&values=9.7,3.4,2.9,2.4
```

![pie opendata](https://x-cmd.com/draw?type=pie&title=%EC%B5%9C%EB%8C%80%20%EB%8F%84%EC%8B%9C%20%EC%9D%B8%EA%B5%AC&unit=%EB%B0%B1%EB%A7%8C%20%EB%AA%85&labels=%EC%84%9C%EC%9A%B8,%EB%B6%80%EC%82%B0,%EC%9D%B8%EC%B2%9C,%EB%8C%80%EA%B5%AC&values=9.7,3.4,2.9,2.4)

**evil**

```text
https://x-cmd.com/draw?type=pie&t=evil&title=%EC%B5%9C%EB%8C%80%20%EB%8F%84%EC%8B%9C%20%EC%9D%B8%EA%B5%AC&unit=%EB%B0%B1%EB%A7%8C%20%EB%AA%85&labels=%EC%84%9C%EC%9A%B8,%EB%B6%80%EC%82%B0,%EC%9D%B8%EC%B2%9C,%EB%8C%80%EA%B5%AC&values=9.7,3.4,2.9,2.4
```

![pie evil](https://x-cmd.com/draw?type=pie&t=evil&title=%EC%B5%9C%EB%8C%80%20%EB%8F%84%EC%8B%9C%20%EC%9D%B8%EA%B5%AC&unit=%EB%B0%B1%EB%A7%8C%20%EB%AA%85&labels=%EC%84%9C%EC%9A%B8,%EB%B6%80%EC%82%B0,%EC%9D%B8%EC%B2%9C,%EB%8C%80%EA%B5%AC&values=9.7,3.4,2.9,2.4)

**evil-mono**

```text
https://x-cmd.com/draw?type=pie&t=evil-mono&title=%EC%B5%9C%EB%8C%80%20%EB%8F%84%EC%8B%9C%20%EC%9D%B8%EA%B5%AC&unit=%EB%B0%B1%EB%A7%8C%20%EB%AA%85&labels=%EC%84%9C%EC%9A%B8,%EB%B6%80%EC%82%B0,%EC%9D%B8%EC%B2%9C,%EB%8C%80%EA%B5%AC&values=9.7,3.4,2.9,2.4
```

![pie evil-mono](https://x-cmd.com/draw?type=pie&t=evil-mono&title=%EC%B5%9C%EB%8C%80%20%EB%8F%84%EC%8B%9C%20%EC%9D%B8%EA%B5%AC&unit=%EB%B0%B1%EB%A7%8C%20%EB%AA%85&labels=%EC%84%9C%EC%9A%B8,%EB%B6%80%EC%82%B0,%EC%9D%B8%EC%B2%9C,%EB%8C%80%EA%B5%AC&values=9.7,3.4,2.9,2.4)

**market-mono**

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=%EC%B5%9C%EB%8C%80%20%EB%8F%84%EC%8B%9C%20%EC%9D%B8%EA%B5%AC&unit=%EB%B0%B1%EB%A7%8C%20%EB%AA%85&labels=%EC%84%9C%EC%9A%B8,%EB%B6%80%EC%82%B0,%EC%9D%B8%EC%B2%9C,%EB%8C%80%EA%B5%AC&values=9.7,3.4,2.9,2.4
```

![pie market-mono](https://x-cmd.com/draw?type=pie&t=market-mono&title=%EC%B5%9C%EB%8C%80%20%EB%8F%84%EC%8B%9C%20%EC%9D%B8%EA%B5%AC&unit=%EB%B0%B1%EB%A7%8C%20%EB%AA%85&labels=%EC%84%9C%EC%9A%B8,%EB%B6%80%EC%82%B0,%EC%9D%B8%EC%B2%9C,%EB%8C%80%EA%B5%AC&values=9.7,3.4,2.9,2.4)

**progress**

```text
https://x-cmd.com/draw?type=pie&t=progress&title=%EC%B5%9C%EB%8C%80%20%EB%8F%84%EC%8B%9C%20%EC%9D%B8%EA%B5%AC&unit=%EB%B0%B1%EB%A7%8C%20%EB%AA%85&labels=%EC%84%9C%EC%9A%B8,%EB%B6%80%EC%82%B0,%EC%9D%B8%EC%B2%9C,%EB%8C%80%EA%B5%AC&values=9.7,3.4,2.9,2.4
```

![pie progress](https://x-cmd.com/draw?type=pie&t=progress&title=%EC%B5%9C%EB%8C%80%20%EB%8F%84%EC%8B%9C%20%EC%9D%B8%EA%B5%AC&unit=%EB%B0%B1%EB%A7%8C%20%EB%AA%85&labels=%EC%84%9C%EC%9A%B8,%EB%B6%80%EC%82%B0,%EC%9D%B8%EC%B2%9C,%EB%8C%80%EA%B5%AC&values=9.7,3.4,2.9,2.4)

**revenue**

```text
https://x-cmd.com/draw?type=pie&t=revenue&title=%EC%B5%9C%EB%8C%80%20%EB%8F%84%EC%8B%9C%20%EC%9D%B8%EA%B5%AC&unit=%EB%B0%B1%EB%A7%8C%20%EB%AA%85&labels=%EC%84%9C%EC%9A%B8,%EB%B6%80%EC%82%B0,%EC%9D%B8%EC%B2%9C,%EB%8C%80%EA%B5%AC&values=9.7,3.4,2.9,2.4
```

![pie revenue](https://x-cmd.com/draw?type=pie&t=revenue&title=%EC%B5%9C%EB%8C%80%20%EB%8F%84%EC%8B%9C%20%EC%9D%B8%EA%B5%AC&unit=%EB%B0%B1%EB%A7%8C%20%EB%AA%85&labels=%EC%84%9C%EC%9A%B8,%EB%B6%80%EC%82%B0,%EC%9D%B8%EC%B2%9C,%EB%8C%80%EA%B5%AC&values=9.7,3.4,2.9,2.4)

## 파라미터

| 파라미터 | | |
|---|---|---|
| `labels=` | 라벨(쉼표 구분) | ✓ |
| `values=` | 값(쉼표 구분) | ✓ |
| `title=` | 제목 | ✗ |
| `unit=` | 단위 | ✗ |
| `donut=` | 0 = 원형 | ✗ |
| `t=` | 스타일 계열 | ✗ |

## `t=`

| | |
|---|---|
| `opendata` |
| `evil` |
| `evil-mono` |
| `market-mono` |
| `progress` |
| `revenue` |

## 주의점

- ≤100개. 9개 초과 시 자동으로 Other 병합
- 원형과 도넛은 `donut=` 차이뿐 — 스타일을 바꾸지 마세요
- 일부 스타일은 다크 모드에서 대비가 달라집니다
- 제목의 공백은 `%20`으로 인코딩
