# draw — 데이터가 URL에 담긴 SVG 차트

> [English](../README.md) | **한국어**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/x-cmd/draw/badge)](https://securityscorecards.dev/viewer/?uri=github.com/x-cmd/draw)

AI 시대의 SVG 차트 생성: 단일 엔드포인트 `/draw?type=...`, 데이터는 URL 안, 모든 출력에 머신 판독 가능한 `<metadata>` 포함. 스타일 시스템은 디자인 사양을 따르며 차트 유형별 여러 변형 제공.

## 미리보기

모든 데이터가 URL 안에 있습니다 — 브라우저에서 열거나 `<img>`로 삽입하거나 README에 붙여넣으면 SVG가 즉시 렌더링됩니다.

### 산키 — PR 라이프사이클 (`type=sankey&t=pipeline`)

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=%EA%B8%B0%EB%8A%A5,%EC%88%98%EC%A0%95,%EB%AC%B8%EC%84%9C,%EA%B8%B0%ED%83%80,%EB%B3%91%ED%95%A9%EB%90%A8,%EB%8B%AB%ED%9E%98,%EA%B1%B0%EB%B6%80%EB%90%A8,1%EB%85%84%EB%AF%B8%EB%A7%8C,1%E2%80%932%EB%85%84,2%EB%85%84%2B&links=%EA%B8%B0%EB%8A%A5%3E%EB%B3%91%ED%95%A9%EB%90%A8:38;%EA%B8%B0%EB%8A%A5%3E%EB%8B%AB%ED%9E%98:12;%EA%B8%B0%EB%8A%A5%3E%EA%B1%B0%EB%B6%80%EB%90%A8:8;%EC%88%98%EC%A0%95%3E%EB%B3%91%ED%95%A9%EB%90%A8:33;%EC%88%98%EC%A0%95%3E%EB%8B%AB%ED%9E%98:6;%EC%88%98%EC%A0%95%3E%EA%B1%B0%EB%B6%80%EB%90%A8:2;%EB%AC%B8%EC%84%9C%3E%EB%B3%91%ED%95%A9%EB%90%A8:16;%EB%AC%B8%EC%84%9C%3E%EB%8B%AB%ED%9E%98:4;%EA%B8%B0%ED%83%80%3E%EB%B3%91%ED%95%A9%EB%90%A8:5;%EA%B8%B0%ED%83%80%3E%EB%8B%AB%ED%9E%98:6;%EA%B8%B0%ED%83%80%3E%EA%B1%B0%EB%B6%80%EB%90%A8:6;%EB%B3%91%ED%95%A9%EB%90%A8%3E1%EB%85%84%EB%AF%B8%EB%A7%8C:52;%EB%B3%91%ED%95%A9%EB%90%A8%3E1%E2%80%932%EB%85%84:28;%EB%B3%91%ED%95%A9%EB%90%A8%3E2%EB%85%84%2B:12;%EB%8B%AB%ED%9E%98%3E1%EB%85%84%EB%AF%B8%EB%A7%8C:14;%EB%8B%AB%ED%9E%98%3E1%E2%80%932%EB%85%84:9;%EB%8B%AB%ED%9E%98%3E2%EB%85%84%2B:5;%EA%B1%B0%EB%B6%80%EB%90%A8%3E1%EB%85%84%EB%AF%B8%EB%A7%8C:9;%EA%B1%B0%EB%B6%80%EB%90%A8%3E1%E2%80%932%EB%85%84:5;%EA%B1%B0%EB%B6%80%EB%90%A8%3E2%EB%85%84%2B:2&title=PR%20%EB%9D%BC%EC%9D%B4%ED%94%84%EC%82%AC%EC%9D%B4%ED%81%B4&unit=prs
```

![산키 — PR 라이프사이클](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=%EA%B8%B0%EB%8A%A5,%EC%88%98%EC%A0%95,%EB%AC%B8%EC%84%9C,%EA%B8%B0%ED%83%80,%EB%B3%91%ED%95%A9%EB%90%A8,%EB%8B%AB%ED%9E%98,%EA%B1%B0%EB%B6%80%EB%90%A8,1%EB%85%84%EB%AF%B8%EB%A7%8C,1%E2%80%932%EB%85%84,2%EB%85%84%2B&links=%EA%B8%B0%EB%8A%A5%3E%EB%B3%91%ED%95%A9%EB%90%A8:38;%EA%B8%B0%EB%8A%A5%3E%EB%8B%AB%ED%9E%98:12;%EA%B8%B0%EB%8A%A5%3E%EA%B1%B0%EB%B6%80%EB%90%A8:8;%EC%88%98%EC%A0%95%3E%EB%B3%91%ED%95%A9%EB%90%A8:33;%EC%88%98%EC%A0%95%3E%EB%8B%AB%ED%9E%98:6;%EC%88%98%EC%A0%95%3E%EA%B1%B0%EB%B6%80%EB%90%A8:2;%EB%AC%B8%EC%84%9C%3E%EB%B3%91%ED%95%A9%EB%90%A8:16;%EB%AC%B8%EC%84%9C%3E%EB%8B%AB%ED%9E%98:4;%EA%B8%B0%ED%83%80%3E%EB%B3%91%ED%95%A9%EB%90%A8:5;%EA%B8%B0%ED%83%80%3E%EB%8B%AB%ED%9E%98:6;%EA%B8%B0%ED%83%80%3E%EA%B1%B0%EB%B6%80%EB%90%A8:6;%EB%B3%91%ED%95%A9%EB%90%A8%3E1%EB%85%84%EB%AF%B8%EB%A7%8C:52;%EB%B3%91%ED%95%A9%EB%90%A8%3E1%E2%80%932%EB%85%84:28;%EB%B3%91%ED%95%A9%EB%90%A8%3E2%EB%85%84%2B:12;%EB%8B%AB%ED%9E%98%3E1%EB%85%84%EB%AF%B8%EB%A7%8C:14;%EB%8B%AB%ED%9E%98%3E1%E2%80%932%EB%85%84:9;%EB%8B%AB%ED%9E%98%3E2%EB%85%84%2B:5;%EA%B1%B0%EB%B6%80%EB%90%A8%3E1%EB%85%84%EB%AF%B8%EB%A7%8C:9;%EA%B1%B0%EB%B6%80%EB%90%A8%3E1%E2%80%932%EB%85%84:5;%EA%B1%B0%EB%B6%80%EB%90%A8%3E2%EB%85%84%2B:2&title=PR%20%EB%9D%BC%EC%9D%B4%ED%94%84%EC%82%AC%EC%9D%B4%ED%81%B4&unit=prs)

### 수평 막대 — 런타임 처리량(실측) (`type=hbar; draw() ops/s: deno 7238 · node 6553 · bun 4972, Apple Silicon`)

```text
https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs
```

![수평 막대 — 런타임 처리량(실측)](https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs)

### 레이더 — 에디터 3종 비교 (`type=radar&t=evil`)

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=%EC%8B%9C%EC%9E%91%20%EC%86%8D%EB%8F%84,%EC%83%9D%ED%83%9C%EA%B3%84,%ED%99%95%EC%9E%A5%EC%84%B1,%EB%A9%94%EB%AA%A8%EB%A6%AC,%ED%8E%B8%EC%9D%98%EC%84%B1&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=%EC%97%90%EB%94%94%ED%84%B0%20%EB%B9%84%EA%B5%90
```

![레이더 — 에디터 3종 비교](https://x-cmd.com/draw?type=radar&t=evil&labels=%EC%8B%9C%EC%9E%91%20%EC%86%8D%EB%8F%84,%EC%83%9D%ED%83%9C%EA%B3%84,%ED%99%95%EC%9E%A5%EC%84%B1,%EB%A9%94%EB%AA%A8%EB%A6%AC,%ED%8E%B8%EC%9D%98%EC%84%B1&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=%EC%97%90%EB%94%94%ED%84%B0%20%EB%B9%84%EA%B5%90)

### 복합 — 다운로드와 성장률 (`type=combo`)

```text
https://x-cmd.com/draw?type=combo&labels=%EC%9B%94,%ED%99%94,%EC%88%98,%EB%AA%A9,%EA%B8%88,%ED%86%A0,%EC%9D%BC&series=%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C:120,180,150,210,240,200,260&line=%EC%84%B1%EC%9E%A5%EB%A5%A0:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%EC%A3%BC%EA%B0%84%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C&unit=dl
```

![복합 — 다운로드와 성장률](https://x-cmd.com/draw?type=combo&labels=%EC%9B%94,%ED%99%94,%EC%88%98,%EB%AA%A9,%EA%B8%88,%ED%86%A0,%EC%9D%BC&series=%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C:120,180,150,210,240,200,260&line=%EC%84%B1%EC%9E%A5%EB%A5%A0:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%EC%A3%BC%EA%B0%84%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C&unit=dl)

### 수평 막대 — 열림/닫힘 이슈(나비형) (`type=hbar&t=xcmd-issue`)

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,%EC%BD%94%EC%96%B4,%EB%AC%B8%EC%84%9C,ci,UI&series=%EC%97%B4%EB%A6%BC:12,8,15,4,9&series=%EB%8B%AB%ED%9E%98:38,52,20,11,26&title=%EC%98%81%EC%97%AD%EB%B3%84%20%EC%9D%B4%EC%8A%88
```

![수평 막대 — 열림/닫힘 이슈(나비형)](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,%EC%BD%94%EC%96%B4,%EB%AC%B8%EC%84%9C,ci,UI&series=%EC%97%B4%EB%A6%BC:12,8,15,4,9&series=%EB%8B%AB%ED%9E%98:38,52,20,11,26&title=%EC%98%81%EC%97%AD%EB%B3%84%20%EC%9D%B4%EC%8A%88)

### 원형 — 최대 도시 (`type=pie&t=market-mono`)

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=%EC%B5%9C%EB%8C%80%20%EB%8F%84%EC%8B%9C%20%EC%9D%B8%EA%B5%AC&unit=%EB%B0%B1%EB%A7%8C%20%EB%AA%85&labels=%EC%84%9C%EC%9A%B8,%EB%B6%80%EC%82%B0,%EC%9D%B8%EC%B2%9C,%EB%8C%80%EA%B5%AC&values=9.7,3.4,2.9,2.4
```

![원형 — 최대 도시](https://x-cmd.com/draw?type=pie&t=market-mono&title=%EC%B5%9C%EB%8C%80%20%EB%8F%84%EC%8B%9C%20%EC%9D%B8%EA%B5%AC&unit=%EB%B0%B1%EB%A7%8C%20%EB%AA%85&labels=%EC%84%9C%EC%9A%B8,%EB%B6%80%EC%82%B0,%EC%9D%B8%EC%B2%9C,%EB%8C%80%EA%B5%AC&values=9.7,3.4,2.9,2.4)

## 3가지 사용 방법

**호스티드 서비스(설치 불필요)** — `https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2`

**npm 라이브러리 + CLI(오프라인·동기)** (`npm i -g @x-cmd/draw` / `npx`):

```sh
npm install @x-cmd/draw
```
```ts
import { draw } from '@x-cmd/draw';
const { svg } = draw({ type: 'pie', labels: 'A,B', values: '3,2', t: 'evil', scheme: 'dark' });
// 쿼리 문자열도 가능: draw('?type=bar&labels=월,화&values=3,5')
// 배열 = 반복 파라미터(쉼표 포함 라벨)
draw({ type: 'bar', labels: ['Q1, 2024', 'Q2'], values: [1, 2] })
```
```sh
draw --type pie --labels "A,B,C" --values "3,2,1" --out pie.svg
draw "?type=hbar&labels=a,b,c&values=3,2,1&t=xcmd"   # 순수 쿼리 문자열
```

**셀프 호스팅**:

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve      # 로컬 Node 서버 :8787(데모 페이지 포함)
npm run dev        # wrangler dev
bash scripts/setup.sh   # 내 Cloudflare 계정에 원클릭 배포
```

환경 변수(Node): `PORT`(8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN`(POST 짧은 링크 활성화).

**Deno** — 렌더 코어는 순수 함수·네트워크 없음 — 무권한 샌드박스가 곧 보안 경계:

```ts
import { draw } from "jsr:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

## 엔드포인트

**`GET /draw?type=<pie|bar|hbar|line|area|radar|gauge|scatter|combo|sankey|qr>`** — 차트 렌더링

| type | | |
|---|---|---|
| `pie` | 도넛; `donut=0` = 원형<br><br>**<u>≤100개(>9는 Other 병합)</u>** | <a href="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=%EC%96%B8%EC%96%B4%EB%B3%84%20%EC%8A%A4%ED%83%80"><img src="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=%EC%96%B8%EC%96%B4%EB%B3%84%20%EC%8A%A4%ED%83%80" width="360" alt="example"></a> |
| `bar` | 묶은 세로 막대; `stack=1` 누적<br><br>**<u>≤30그룹</u>** | <a href="https://x-cmd.com/draw?type=bar&labels=%EC%9B%94,%ED%99%94,%EC%88%98&series=dev:12,18,9&series=ci:8,11,6"><img src="https://x-cmd.com/draw?type=bar&labels=%EC%9B%94,%ED%99%94,%EC%88%98&series=dev:12,18,9&series=ci:8,11,6" width="360" alt="example"></a> |
| `hbar` | 수평 막대(랭킹)<br><br>**<u>≤30개</u>** | <a href="https://x-cmd.com/draw?type=hbar&labels=CLI,%EC%BD%94%EC%96%B4,%EB%AC%B8%EC%84%9C,UI&values=42,31,18,9&title=%EC%98%81%EC%97%AD%EB%B3%84%20%EC%BB%A4%EB%B0%8B"><img src="https://x-cmd.com/draw?type=hbar&labels=CLI,%EC%BD%94%EC%96%B4,%EB%AC%B8%EC%84%9C,UI&values=42,31,18,9&title=%EC%98%81%EC%97%AD%EB%B3%84%20%EC%BB%A4%EB%B0%8B" width="360" alt="example"></a> |
| `line` | 부드러운 선 + 그라데이션/다중 선<br><br>**<u>≤60점</u>** | <a href="https://x-cmd.com/draw?type=line&labels=1%EC%9B%94,2%EC%9B%94,3%EC%9B%94,4%EC%9B%94,5%EC%9B%94,6%EC%9B%94&values=12,19,15,25,22,30&title=%EC%96%B8%EC%96%B4%EB%B3%84%20%EC%8A%A4%ED%83%80"><img src="https://x-cmd.com/draw?type=line&labels=1%EC%9B%94,2%EC%9B%94,3%EC%9B%94,4%EC%9B%94,5%EC%9B%94,6%EC%9B%94&values=12,19,15,25,22,30&title=%EC%96%B8%EC%96%B4%EB%B3%84%20%EC%8A%A4%ED%83%80" width="360" alt="example"></a> |
| `area` | 면적 / 다중 면적<br><br>**<u>≤60점</u>** | <a href="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C"><img src="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C" width="360" alt="example"></a> |
| `radar` | 레이더<br><br>**<u>3–12축</u>** | <a href="https://x-cmd.com/draw?type=radar&t=evil&labels=%EC%8B%9C%EC%9E%91%20%EC%86%8D%EB%8F%84,%EC%83%9D%ED%83%9C%EA%B3%84,%ED%99%95%EC%9E%A5%EC%84%B1,%EB%A9%94%EB%AA%A8%EB%A6%AC,%ED%8E%B8%EC%9D%98%EC%84%B1&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=%EC%97%90%EB%94%94%ED%84%B0%20%EB%B9%84%EA%B5%90"><img src="https://x-cmd.com/draw?type=radar&t=evil&labels=%EC%8B%9C%EC%9E%91%20%EC%86%8D%EB%8F%84,%EC%83%9D%ED%83%9C%EA%B3%84,%ED%99%95%EC%9E%A5%EC%84%B1,%EB%A9%94%EB%AA%A8%EB%A6%AC,%ED%8E%B8%EC%9D%98%EC%84%B1&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=%EC%97%90%EB%94%94%ED%84%B0%20%EB%B9%84%EA%B5%90" width="360" alt="example"></a> |
| `gauge` | 게이지(240° 호, 중앙 값)<br><br>**<u>value+max; 링 ≤8</u>** | <a href="https://x-cmd.com/draw?type=gauge&title=CI%20%ED%86%B5%EA%B3%BC%EC%9C%A8&value=87&max=100"><img src="https://x-cmd.com/draw?type=gauge&title=CI%20%ED%86%B5%EA%B3%BC%EC%9C%A8&value=87&max=100" width="360" alt="example"></a> |
| `scatter` | 산점도, 두 숫자 축, 음수 가능<br><br>**<u>x=&y=, ≤200점</u>** | <a href="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=%EC%A7%80%EC%97%B0%20%EC%8B%9C%EA%B0%84"><img src="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=%EC%A7%80%EC%97%B0%20%EC%8B%9C%EA%B0%84" width="360" alt="example"></a> |
| `combo` | 막대(`series=`)+선(`line=`); 5× 차이부터 이중 축<br><br>**<u>≤30그룹, ≤6계열</u>** | <a href="https://x-cmd.com/draw?type=combo&labels=%EC%9B%94,%ED%99%94,%EC%88%98,%EB%AA%A9,%EA%B8%88,%ED%86%A0,%EC%9D%BC&series=%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C:120,180,150,210,240,200,260&line=%EC%84%B1%EC%9E%A5%EB%A5%A0:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%EC%A3%BC%EA%B0%84%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C&unit=dl"><img src="https://x-cmd.com/draw?type=combo&labels=%EC%9B%94,%ED%99%94,%EC%88%98,%EB%AA%A9,%EA%B8%88,%ED%86%A0,%EC%9D%BC&series=%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C:120,180,150,210,240,200,260&line=%EC%84%B1%EC%9E%A5%EB%A5%A0:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=%EC%A3%BC%EA%B0%84%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C&unit=dl" width="360" alt="example"></a> |
| `sankey` | 플로우 다이어그램(폭=량)<br><br>**<u>labels=+links=A>B:30, ≤24노드</u>** | <a href="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=%EA%B8%B0%EB%8A%A5,%EC%88%98%EC%A0%95,%EB%AC%B8%EC%84%9C,%EA%B8%B0%ED%83%80,%EB%B3%91%ED%95%A9%EB%90%A8,%EB%8B%AB%ED%9E%98,%EA%B1%B0%EB%B6%80%EB%90%A8,1%EB%85%84%EB%AF%B8%EB%A7%8C,1%E2%80%932%EB%85%84,2%EB%85%84%2B&links=%EA%B8%B0%EB%8A%A5%3E%EB%B3%91%ED%95%A9%EB%90%A8:38;%EA%B8%B0%EB%8A%A5%3E%EB%8B%AB%ED%9E%98:12;%EA%B8%B0%EB%8A%A5%3E%EA%B1%B0%EB%B6%80%EB%90%A8:8;%EC%88%98%EC%A0%95%3E%EB%B3%91%ED%95%A9%EB%90%A8:33;%EC%88%98%EC%A0%95%3E%EB%8B%AB%ED%9E%98:6;%EC%88%98%EC%A0%95%3E%EA%B1%B0%EB%B6%80%EB%90%A8:2;%EB%AC%B8%EC%84%9C%3E%EB%B3%91%ED%95%A9%EB%90%A8:16;%EB%AC%B8%EC%84%9C%3E%EB%8B%AB%ED%9E%98:4;%EA%B8%B0%ED%83%80%3E%EB%B3%91%ED%95%A9%EB%90%A8:5;%EA%B8%B0%ED%83%80%3E%EB%8B%AB%ED%9E%98:6;%EA%B8%B0%ED%83%80%3E%EA%B1%B0%EB%B6%80%EB%90%A8:6;%EB%B3%91%ED%95%A9%EB%90%A8%3E1%EB%85%84%EB%AF%B8%EB%A7%8C:52;%EB%B3%91%ED%95%A9%EB%90%A8%3E1%E2%80%932%EB%85%84:28;%EB%B3%91%ED%95%A9%EB%90%A8%3E2%EB%85%84%2B:12;%EB%8B%AB%ED%9E%98%3E1%EB%85%84%EB%AF%B8%EB%A7%8C:14;%EB%8B%AB%ED%9E%98%3E1%E2%80%932%EB%85%84:9;%EB%8B%AB%ED%9E%98%3E2%EB%85%84%2B:5;%EA%B1%B0%EB%B6%80%EB%90%A8%3E1%EB%85%84%EB%AF%B8%EB%A7%8C:9;%EA%B1%B0%EB%B6%80%EB%90%A8%3E1%E2%80%932%EB%85%84:5;%EA%B1%B0%EB%B6%80%EB%90%A8%3E2%EB%85%84%2B:2&title=PR%20%EB%9D%BC%EC%9D%B4%ED%94%84%EC%82%AC%EC%9D%B4%ED%81%B4&unit=prs"><img src="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=%EA%B8%B0%EB%8A%A5,%EC%88%98%EC%A0%95,%EB%AC%B8%EC%84%9C,%EA%B8%B0%ED%83%80,%EB%B3%91%ED%95%A9%EB%90%A8,%EB%8B%AB%ED%9E%98,%EA%B1%B0%EB%B6%80%EB%90%A8,1%EB%85%84%EB%AF%B8%EB%A7%8C,1%E2%80%932%EB%85%84,2%EB%85%84%2B&links=%EA%B8%B0%EB%8A%A5%3E%EB%B3%91%ED%95%A9%EB%90%A8:38;%EA%B8%B0%EB%8A%A5%3E%EB%8B%AB%ED%9E%98:12;%EA%B8%B0%EB%8A%A5%3E%EA%B1%B0%EB%B6%80%EB%90%A8:8;%EC%88%98%EC%A0%95%3E%EB%B3%91%ED%95%A9%EB%90%A8:33;%EC%88%98%EC%A0%95%3E%EB%8B%AB%ED%9E%98:6;%EC%88%98%EC%A0%95%3E%EA%B1%B0%EB%B6%80%EB%90%A8:2;%EB%AC%B8%EC%84%9C%3E%EB%B3%91%ED%95%A9%EB%90%A8:16;%EB%AC%B8%EC%84%9C%3E%EB%8B%AB%ED%9E%98:4;%EA%B8%B0%ED%83%80%3E%EB%B3%91%ED%95%A9%EB%90%A8:5;%EA%B8%B0%ED%83%80%3E%EB%8B%AB%ED%9E%98:6;%EA%B8%B0%ED%83%80%3E%EA%B1%B0%EB%B6%80%EB%90%A8:6;%EB%B3%91%ED%95%A9%EB%90%A8%3E1%EB%85%84%EB%AF%B8%EB%A7%8C:52;%EB%B3%91%ED%95%A9%EB%90%A8%3E1%E2%80%932%EB%85%84:28;%EB%B3%91%ED%95%A9%EB%90%A8%3E2%EB%85%84%2B:12;%EB%8B%AB%ED%9E%98%3E1%EB%85%84%EB%AF%B8%EB%A7%8C:14;%EB%8B%AB%ED%9E%98%3E1%E2%80%932%EB%85%84:9;%EB%8B%AB%ED%9E%98%3E2%EB%85%84%2B:5;%EA%B1%B0%EB%B6%80%EB%90%A8%3E1%EB%85%84%EB%AF%B8%EB%A7%8C:9;%EA%B1%B0%EB%B6%80%EB%90%A8%3E1%E2%80%932%EB%85%84:5;%EA%B1%B0%EB%B6%80%EB%90%A8%3E2%EB%85%84%2B:2&title=PR%20%EB%9D%BC%EC%9D%B4%ED%94%84%EC%82%AC%EC%9D%B4%ED%81%B4&unit=prs" width="360" alt="example"></a> |
| `qr` | QR 코드<br><br>**<u>d≤1000자, fg/bg, title/unit</u>** | <a href="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=%EC%8A%A4%EC%BA%94"><img src="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=%EC%8A%A4%EC%BA%94" width="360" alt="example"></a> |

**`GET /draw`** — 데모 페이지 · **`POST /draw?type=...`** — JSON/CSV body로 영구 짧은 링크 생성 · **`GET /draw/c/<hash>`** — 짧은 링크 렌더링(immutable)

## 스타일(`?t=`)

| type | |
|---|---|
| `pie` | opendata(기본) · evil · evil-mono · market-mono · progress · revenue |
| `bar` | evil(기본) · base · grid |
| `hbar` | base(기본) · opendata(ref=) · xcmd · xcmd-issue · rank |
| `line` | shadcn(기본) · evil · evil-glow · evil-mono · opendata |
| `area` | evil(기본) · star · opendata · pixel · polka |
| `radar` | base(기본) · evil · xcmd |
| `sankey` | base(기본) · fund · pipeline |
| `gauge` | base(기본) · gradient · reliability |
| `scatter/combo/qr` | base(combo는 evil 추가) |

## 데이터 전달

```text
https://x-cmd.com/draw?type=pie&title=%EC%96%B8%EC%96%B4%EB%B3%84%20%EC%8A%A4%ED%83%80&labels=TypeScript,Python,Go&values=4821,2312,980
```

쉼표 포함 라벨은 파라미터 반복(`labels=Q1, 2024&labels=Q2`). 복잡한 데이터는 `?d=` + URL 인코딩 JSON:

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

## 짧은 링크

POST는 콘텐츠 주소화된 영구 짧은 링크를 생성(GitHub 리포지터리에 저장):

- 같은 데이터 → 같은 해시(멱등·중복 제거)
- 분당 30 요청/IP 제한
- 공개 저장소 — 민감 데이터 불가

## 버전

- `v` 없음: 최신 버전, 캐시 300초
- `v=N`: 버전 고정, 캐시 1일
- `immutable`은 `/c/<hash>` 전용

## AI 친화적

모든 SVG에 JSON 내장: `{generator, template, version, spec}` — 데이터와 파라미터가 그대로 왕복하며 텍스트는 진짜 `<text>`.

## 원클릭 셀프 호스팅

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

스크립트가 클론 → wrangler 로그인 → 배포 → `*.workers.dev` URL 출력. 짧은 링크(POST)는 `DATA_REPO` + `GITHUB_TOKEN`으로 활성화.

## 개발

```sh
npm install
npm run dev      # wrangler dev
npm test         # vitest (120)
npm run check    # tsc ×3
npm run build    # dist/
```

## 라이선스

코드 Apache-2.0; 글꼴 OFL — [LICENSE](../LICENSE) · 전체 문서: [README (EN)](../README.md)
