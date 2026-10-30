---
x-title: hbar 수평 막대 — x-cmd/draw
x-desc: AI 시대의 SVG 차트 생성: 단일 엔드포인트 `/draw?type=. type=hbar.
x-sidebar: draw
x-keywords: draw, hbar, 수평 막대, svg, chart
---

# hbar 수평 막대

`GET /draw?type=hbar&...` — 차트 렌더링

## 예시

**base**

```text
https://x-cmd.com/draw?type=hbar&labels=CLI,%EC%BD%94%EC%96%B4,%EB%AC%B8%EC%84%9C,UI&values=42,31,18,9&title=%EC%98%81%EC%97%AD%EB%B3%84%20%EC%BB%A4%EB%B0%8B
```

![hbar base](https://x-cmd.com/draw?type=hbar&labels=CLI,%EC%BD%94%EC%96%B4,%EB%AC%B8%EC%84%9C,UI&values=42,31,18,9&title=%EC%98%81%EC%97%AD%EB%B3%84%20%EC%BB%A4%EB%B0%8B)

**opendata**

```text
https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,%EC%BD%94%EC%96%B4,%EB%AC%B8%EC%84%9C,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=%EC%98%81%EC%97%AD%EB%B3%84%20%EC%BB%A4%EB%B0%8B
```

![hbar opendata](https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,%EC%BD%94%EC%96%B4,%EB%AC%B8%EC%84%9C,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=%EC%98%81%EC%97%AD%EB%B3%84%20%EC%BB%A4%EB%B0%8B)

**xcmd**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd&labels=%EC%84%9C%EC%9A%B8,%EB%B6%80%EC%82%B0,%EC%9D%B8%EC%B2%9C&values=68,21,11&title=%EC%B5%9C%EB%8C%80%20%EB%8F%84%EC%8B%9C%20%EC%9D%B8%EA%B5%AC
```

![hbar xcmd](https://x-cmd.com/draw?type=hbar&t=xcmd&labels=%EC%84%9C%EC%9A%B8,%EB%B6%80%EC%82%B0,%EC%9D%B8%EC%B2%9C&values=68,21,11&title=%EC%B5%9C%EB%8C%80%20%EB%8F%84%EC%8B%9C%20%EC%9D%B8%EA%B5%AC)

**xcmd-issue**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,%EC%BD%94%EC%96%B4,%EB%AC%B8%EC%84%9C,ci,UI&series=%EC%97%B4%EB%A6%BC:12,8,15,4,9&series=%EB%8B%AB%ED%9E%98:38,52,20,11,26&title=%EC%98%81%EC%97%AD%EB%B3%84%20%EC%9D%B4%EC%8A%88
```

![hbar xcmd-issue](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,%EC%BD%94%EC%96%B4,%EB%AC%B8%EC%84%9C,ci,UI&series=%EC%97%B4%EB%A6%BC:12,8,15,4,9&series=%EB%8B%AB%ED%9E%98:38,52,20,11,26&title=%EC%98%81%EC%97%AD%EB%B3%84%20%EC%9D%B4%EC%8A%88)

**rank**

```text
https://x-cmd.com/draw?type=hbar&t=rank&labels=%EC%9B%94,%ED%99%94,%EC%88%98&series=2025:80,95,110&series=2026:110,85,120&title=%EC%A3%BC%EA%B0%84%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C
```

![hbar rank](https://x-cmd.com/draw?type=hbar&t=rank&labels=%EC%9B%94,%ED%99%94,%EC%88%98&series=2025:80,95,110&series=2026:110,85,120&title=%EC%A3%BC%EA%B0%84%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C)

## 파라미터

| 파라미터 | | |
|---|---|---|
| `labels=` | 라벨(쉼표 구분) | ✓ |
| `values=` | 값(쉼표 구분) | ✓ |
| `series=` | 일부 스타일만: 2계열 | ✗ |
| `ref=` | 기준선 값 | ✗ |
| `reflabel=` | 기준선 라벨 | ✗ |
| `t=` | 스타일 계열 | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `opendata` |
| `xcmd` |
| `xcmd-issue` |
| `rank` |

## 주의점

- ≤30개, 기본 단일 계열
- 2계열은 `t=xcmd-issue` / `t=rank` 전용
- 제목의 공백은 `%20`으로 인코딩
