---
x-title: draw 快速使用 —— 3 分钟上手（URL / npm / Deno）
x-desc: x-cmd/draw 最快上手路径:拼 URL 直接渲染、npm 库与 CLI 离线渲染、Deno 零权限沙盒。文末附全部图表类型与参数全表。
x-sidebar: draw 快速使用
x-keywords: draw, quickstart, 快速使用, svg, chart, url, npm, deno, cli
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 快速使用'
      inLanguage: 'zh-CN'
      about: 'x-cmd/draw 快速上手'
---

# draw 快速使用 —— 3 分钟上手

数据全在 URL 里,渲染就是拼参数:

```text
https://x-cmd.com/draw?type=pie&labels=TS,Py,Go&values=48,23,9&title=Stars
```

浏览器打开即得 SVG;`<img src>`、Markdown `![]()` 同样直接可用。

本页每个示例都是「点图进交互页」的链接:图是 SVG,点击打开 `/explore` 交互页,可悬停看数、改参数、改数据。

## 三条路径

**1. 托管服务(零安装)** — 拼 URL 即用,见上方。

**2. npm 库 + CLI(离线)**

```sh
npm install @x-cmd/draw
x-draw --type pie --labels "TS,Py,Go" --values "48,23,9" --out pie.svg
```

```ts
import { draw } from '@x-cmd/draw';
const { svg } = draw({ type: 'pie', labels: 'A,B', values: '3,2' });  // 同步,无网络
```

**3. Deno(JSR,零权限沙盒)**

```ts
import { draw } from "jsr:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

更多细节:总览见 [2-overview](../01-what-is-draw/cn.md),风格见 [3-styles-themes](../../3-styles/01-style-families/cn.md),自托管见 [4-self-hosting](../../5-self-hosting/01-deploy/cn.md),各类型详解从 [pie](../../2-chart-types/01-data-charts/01-pie/cn.md) 起。

## 全表(13 种类型)

| type | 图表 | 示例 |
|---|---|---|
| `pie` | 环形图;`donut=0` 变实心饼<br><br>**<u>≤100 类(>9 自动合并 Other)</u>** | [![pie example](https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Stars%20by%20language&w=360)](https://x-cmd.com/draw/explore?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Stars%20by%20language) |
| `bar` | 柱状图/分组并排;多系列加 `stack=1` 变堆叠柱<br><br>**<u>≤30 组</u>** | [![bar example](https://x-cmd.com/draw?type=bar&labels=Mon,Tue,Wed&series=dev:12,18,9&series=ci:8,11,6&w=360)](https://x-cmd.com/draw/explore?type=bar&labels=Mon,Tue,Wed&series=dev:12,18,9&series=ci:8,11,6) |
| `hbar` | 水平柱状图(排行场景,标签左值右)<br><br>**<u>≤30 条,单系列(部分风格双系列)</u>** | [![hbar example](https://x-cmd.com/draw?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commits%20by%20area&w=360)](https://x-cmd.com/draw/explore?type=hbar&labels=cli,core,docs,ui&values=42,31,18,9&title=Commits%20by%20area) |
| `line` | 折线图(平滑+渐变面积)/多折线<br><br>**<u>≤60 点</u>** | [![line example](https://x-cmd.com/draw?type=line&labels=Jan,Feb,Mar,Apr,May,Jun&values=12,19,15,25,22,30&title=Stars&w=360)](https://x-cmd.com/draw/explore?type=line&labels=Jan,Feb,Mar,Apr,May,Jun&values=12,19,15,25,22,30&title=Stars) |
| `area` | 面积图/多系列面积(渐变填充)<br><br>**<u>≤60 点</u>** | [![area example](https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=Downloads&w=360)](https://x-cmd.com/draw/explore?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=Downloads) |
| `radar` | 雷达图<br><br>**<u>3-12 维</u>** | [![radar example](https://x-cmd.com/draw?type=radar&t=evil&labels=perf,docs,tests,dx&series=v1:7,5,8,6&series=v2:8,8,9,8&w=360)](https://x-cmd.com/draw/explore?type=radar&t=evil&labels=perf,docs,tests,dx&series=v1:7,5,8,6&series=v2:8,8,9,8) |
| `gauge` | 仪表盘(240° 弧+中心数值)<br><br>**<u>`value`+`max`(默认100),value≤max;多环 ≤8</u>** | [![gauge example](https://x-cmd.com/draw?type=gauge&title=CI%20pass%20rate&value=87&max=100&w=360)](https://x-cmd.com/draw/explore?type=gauge&title=CI%20pass%20rate&value=87&max=100) |
| `scatter` | 散点图(双数值轴,支持负值;默认不标数值)<br><br>**<u>`x=&y=`,≤200 点</u>** | [![scatter example](https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latency&w=360)](https://x-cmd.com/draw/explore?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latency) |
| `combo` | 混合图:柱(`series=`)+线(`line=`)同图,`stack=1` 变堆叠柱<br><br>**<u>≤30 组,共 ≤6 系列</u>** | [![combo example](https://x-cmd.com/draw?type=combo&labels=Mon,Tue,Wed,Thu,Fri&series=dl:120,180,150,210,240&line=growth:3.1,3.4,3.2,3.8,4.1&title=Downloads&w=360)](https://x-cmd.com/draw/explore?type=combo&labels=Mon,Tue,Wed,Thu,Fri&series=dl:120,180,150,210,240&line=growth:3.1,3.4,3.2,3.8,4.1&title=Downloads) |
| `sankey` | 桑基图(流向带宽)<br><br>**<u>`labels=`+`links=A>B:30`,≤24 节点/60 链接</u>** | [![sankey example](https://x-cmd.com/draw?type=sankey&labels=Visitors,Stars,Forks,PRs,Merged&links=Visitors>Stars:84;Stars>Forks:17;Forks>PRs:9;PRs>Merged:7&title=Contributor%20funnel&w=360)](https://x-cmd.com/draw/explore?type=sankey&labels=Visitors,Stars,Forks,PRs,Merged&links=Visitors>Stars:84;Stars>Forks:17;Forks>PRs:9;PRs>Merged:7&title=Contributor%20funnel) |
| `qr` | 二维码<br><br>**<u>`d`=文本(≤1000 字符),`fg`/`bg` 配色,`title`/`unit` 标注</u>** | [![qr example](https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=scan%20me&w=360)](https://x-cmd.com/draw/explore?type=qr&d=https://github.com/x-cmd/draw&title=scan%20me) |
| `quadrant` | 2×2 矩阵,或只有两条交叉的轴;格子用 `quadrants=`,散点用 `items=name@x,y`<br><br>**<u>格子正好 4 个;坐标 0..1</u>** | [![quadrant example](https://x-cmd.com/draw?type=quadrant&frame=cross&title=Prioritisation&ylabel=Value&xlabel=Cost&ylow=Low&yhigh=High&xlow=Low&xhigh=High&items=Platform@0.18,0.82;AI@0.38,0.55;Partners@0.62,0.28;Brand@0.78,0.12&w=360)](https://x-cmd.com/draw/explore?type=quadrant&frame=cross&title=Prioritisation&ylabel=Value&xlabel=Cost&ylow=Low&yhigh=High&xlow=Low&xhigh=High&items=Platform@0.18,0.82;AI@0.38,0.55;Partners@0.62,0.28;Brand@0.78,0.12) |
| `compass` | 中心向外四支带标签的箭头(`up=` `right=` `down=` `left=`)<br><br>**<u>至少要有一个方向</u>** | [![compass example](https://x-cmd.com/draw?type=compass&title=Four%20options&center=Core&up=Invest:grow%20share&right=Hold:protect%20cash&down=Shrink:cut%20cost&left=Exit:free%20resources&w=360)](https://x-cmd.com/draw/explore?type=compass&title=Four%20options&center=Core&up=Invest:grow%20share&right=Hold:protect%20cash&down=Shrink:cut%20cost&left=Exit:free%20resources) |
