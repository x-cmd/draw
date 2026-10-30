---
x-title: radar 레이더 — x-cmd/draw
x-desc: AI 시대의 SVG 차트 생성: 단일 엔드포인트 `/draw?type=. type=radar.
x-sidebar: draw
x-keywords: draw, radar, 레이더, svg, chart
---

# radar 레이더

`GET /draw?type=radar&...` — 차트 렌더링

## 예시

**base**

```text
https://x-cmd.com/draw?type=radar&labels=%EC%8B%9C%EC%9E%91%20%EC%86%8D%EB%8F%84,%EC%83%9D%ED%83%9C%EA%B3%84,%ED%99%95%EC%9E%A5%EC%84%B1,%EB%A9%94%EB%AA%A8%EB%A6%AC,%ED%8E%B8%EC%9D%98%EC%84%B1&values=85,90,70,80,95&title=%EC%97%90%EB%94%94%ED%84%B0%20%EB%B9%84%EA%B5%90
```

![radar base](https://x-cmd.com/draw?type=radar&labels=%EC%8B%9C%EC%9E%91%20%EC%86%8D%EB%8F%84,%EC%83%9D%ED%83%9C%EA%B3%84,%ED%99%95%EC%9E%A5%EC%84%B1,%EB%A9%94%EB%AA%A8%EB%A6%AC,%ED%8E%B8%EC%9D%98%EC%84%B1&values=85,90,70,80,95&title=%EC%97%90%EB%94%94%ED%84%B0%20%EB%B9%84%EA%B5%90)

**evil**

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=%EC%8B%9C%EC%9E%91%20%EC%86%8D%EB%8F%84,%EC%83%9D%ED%83%9C%EA%B3%84,%ED%99%95%EC%9E%A5%EC%84%B1,%EB%A9%94%EB%AA%A8%EB%A6%AC,%ED%8E%B8%EC%9D%98%EC%84%B1&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=%EC%97%90%EB%94%94%ED%84%B0%20%EB%B9%84%EA%B5%90
```

![radar evil](https://x-cmd.com/draw?type=radar&t=evil&labels=%EC%8B%9C%EC%9E%91%20%EC%86%8D%EB%8F%84,%EC%83%9D%ED%83%9C%EA%B3%84,%ED%99%95%EC%9E%A5%EC%84%B1,%EB%A9%94%EB%AA%A8%EB%A6%AC,%ED%8E%B8%EC%9D%98%EC%84%B1&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=%EC%97%90%EB%94%94%ED%84%B0%20%EB%B9%84%EA%B5%90)

**xcmd**

```text
https://x-cmd.com/draw?type=radar&t=xcmd&labels=%EC%8B%9C%EC%9E%91%20%EC%86%8D%EB%8F%84,%EC%83%9D%ED%83%9C%EA%B3%84,%ED%99%95%EC%9E%A5%EC%84%B1,%EB%A9%94%EB%AA%A8%EB%A6%AC,%ED%8E%B8%EC%9D%98%EC%84%B1&values=8,6,9,7,5&title=%EC%97%90%EB%94%94%ED%84%B0%20%EB%B9%84%EA%B5%90
```

![radar xcmd](https://x-cmd.com/draw?type=radar&t=xcmd&labels=%EC%8B%9C%EC%9E%91%20%EC%86%8D%EB%8F%84,%EC%83%9D%ED%83%9C%EA%B3%84,%ED%99%95%EC%9E%A5%EC%84%B1,%EB%A9%94%EB%AA%A8%EB%A6%AC,%ED%8E%B8%EC%9D%98%EC%84%B1&values=8,6,9,7,5&title=%EC%97%90%EB%94%94%ED%84%B0%20%EB%B9%84%EA%B5%90)

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
| `base` |
| `evil` |
| `xcmd` |

## 주의점

- 3–12축
- 다중 계열에는 `t=evil` 필요
- 제목의 공백은 `%20`으로 인코딩
