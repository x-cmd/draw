---
x-title: qr QR 코드 — x-cmd/draw
x-desc: AI 시대의 SVG 차트 생성: 단일 엔드포인트 `/draw?type=. type=qr.
x-sidebar: draw
x-keywords: draw, qr, QR 코드, svg, chart
---

# qr QR 코드

`GET /draw?type=qr&...` — 차트 렌더링

## 예시

**base url**

```text
https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=%EC%8A%A4%EC%BA%94
```

![qr base url](https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fgithub.com%2Fx-cmd%2Fdraw&title=%EC%8A%A4%EC%BA%94)

**base wifi**

```text
https://x-cmd.com/draw?type=qr&d=WIFI%3AS%3AMyWiFi%3BT%3AWPA%3BP%3Apassword123%3B%3B&title=wifi
```

![qr base wifi](https://x-cmd.com/draw?type=qr&d=WIFI%3AS%3AMyWiFi%3BT%3AWPA%3BP%3Apassword123%3B%3B&title=wifi)

**base color**

```text
https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fx-cmd.com&fg=%236366f1&bg=%230f0f12&title=x-cmd
```

![qr base color](https://x-cmd.com/draw?type=qr&d=https%3A%2F%2Fx-cmd.com&fg=%236366f1&bg=%230f0f12&title=x-cmd)

## 파라미터

| 파라미터 | | |
|---|---|---|
| `d=` | 텍스트/URL(≤1000자) | ✓ |
| `fg=` | 모듈 색(hex) | ✗ |
| `bg=` | 배경(hex) | ✗ |
| `title=` | 코드 아래 캡션 | ✗ |
| `unit=` | 작은 보조 행 | ✗ |
| `t=` | 스타일 계열 | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## 주의점

- 텍스트 ≤1000자. `#`은 `%23`으로 인코딩
- 제목의 공백은 `%20`으로 인코딩
