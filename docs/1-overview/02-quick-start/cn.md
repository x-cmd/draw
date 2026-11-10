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
https://x-cmd.com/draw?type=pie&labels=TS,Py,Go&values=48,23,9&title=Star%20%E6%95%B0
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

更多细节:总览见 [overview](../01-what-is-draw/cn.md),风格见 [styles](../03-styles/cn.md),自托管见 [self-hosting](../05-self-hosting/cn.md),各类型详解从 [pie](../../2-data-charts/01-pie/cn.md) 起。

## 全表(13 种类型)

| type | 图表 | 示例 |
|---|---|---|
| `pie` | 环形图;`donut=0` 变实心饼<br><br>**<u>≤100 类(>9 自动合并 Other)</u>** | [![pie example](https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=%E6%8C%89%E8%AF%AD%E8%A8%80%E7%BB%9F%E8%AE%A1%20Star&w=360)](https://x-cmd.com/draw/explore?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=%E6%8C%89%E8%AF%AD%E8%A8%80%E7%BB%9F%E8%AE%A1%20Star) |
| `bar` | 柱状图/分组并排;多系列加 `stack=1` 变堆叠柱<br><br>**<u>≤30 组</u>** | [![bar example](https://x-cmd.com/draw?type=bar&labels=%E5%91%A8%E4%B8%80%2C%E5%91%A8%E4%BA%8C%2C%E5%91%A8%E4%B8%89&series=%E5%BC%80%E5%8F%91%3A12%2C18%2C9&series=ci:8,11,6&w=360)](https://x-cmd.com/draw/explore?type=bar&labels=%E5%91%A8%E4%B8%80%2C%E5%91%A8%E4%BA%8C%2C%E5%91%A8%E4%B8%89&series=%E5%BC%80%E5%8F%91%3A12%2C18%2C9&series=ci:8,11,6) |
| `hbar` | 水平柱状图(排行场景,标签左值右)<br><br>**<u>≤30 条,单系列(部分风格双系列)</u>** | [![hbar example](https://x-cmd.com/draw?type=hbar&labels=CLI%2C%E6%A0%B8%E5%BF%83%2C%E6%96%87%E6%A1%A3%2CUI&values=42,31,18,9&title=%E5%90%84%E6%A8%A1%E5%9D%97%E6%8F%90%E4%BA%A4%E9%87%8F&w=360)](https://x-cmd.com/draw/explore?type=hbar&labels=CLI%2C%E6%A0%B8%E5%BF%83%2C%E6%96%87%E6%A1%A3%2CUI&values=42,31,18,9&title=%E5%90%84%E6%A8%A1%E5%9D%97%E6%8F%90%E4%BA%A4%E9%87%8F) |
| `line` | 折线图(平滑+渐变面积)/多折线<br><br>**<u>≤60 点</u>** | [![line example](https://x-cmd.com/draw?type=line&labels=1%E6%9C%88%2C2%E6%9C%88%2C3%E6%9C%88%2C4%E6%9C%88%2C5%E6%9C%88%2C6%E6%9C%88&values=12,19,15,25,22,30&title=Star%20%E6%95%B0&w=360)](https://x-cmd.com/draw/explore?type=line&labels=1%E6%9C%88%2C2%E6%9C%88%2C3%E6%9C%88%2C4%E6%9C%88%2C5%E6%9C%88%2C6%E6%9C%88&values=12,19,15,25,22,30&title=Star%20%E6%95%B0) |
| `area` | 面积图/多系列面积(渐变填充)<br><br>**<u>≤60 点</u>** | [![area example](https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=%E4%B8%8B%E8%BD%BD%E9%87%8F&w=360)](https://x-cmd.com/draw/explore?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=%E4%B8%8B%E8%BD%BD%E9%87%8F) |
| `radar` | 雷达图<br><br>**<u>3-12 维</u>** | [![radar example](https://x-cmd.com/draw?type=radar&t=evil&labels=%E6%80%A7%E8%83%BD%2C%E6%96%87%E6%A1%A3%2C%E6%B5%8B%E8%AF%95%2C%E5%BC%80%E5%8F%91%E4%BD%93%E9%AA%8C&series=v1:7,5,8,6&series=v2:8,8,9,8&w=360)](https://x-cmd.com/draw/explore?type=radar&t=evil&labels=%E6%80%A7%E8%83%BD%2C%E6%96%87%E6%A1%A3%2C%E6%B5%8B%E8%AF%95%2C%E5%BC%80%E5%8F%91%E4%BD%93%E9%AA%8C&series=v1:7,5,8,6&series=v2:8,8,9,8) |
| `gauge` | 仪表盘(240° 弧+中心数值)<br><br>**<u>`value`+`max`(默认100),value≤max;多环 ≤8</u>** | [![gauge example](https://x-cmd.com/draw?type=gauge&title=CI%20%E9%80%9A%E8%BF%87%E7%8E%87&value=87&max=100&w=360)](https://x-cmd.com/draw/explore?type=gauge&title=CI%20%E9%80%9A%E8%BF%87%E7%8E%87&value=87&max=100) |
| `scatter` | 散点图(双数值轴,支持负值;默认不标数值)<br><br>**<u>`x=&y=`,≤200 点</u>** | [![scatter example](https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=%E5%BB%B6%E8%BF%9F&w=360)](https://x-cmd.com/draw/explore?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=%E5%BB%B6%E8%BF%9F) |
| `combo` | 混合图:柱(`series=`)+线(`line=`)同图,`stack=1` 变堆叠柱<br><br>**<u>≤30 组,共 ≤6 系列</u>** | [![combo example](https://x-cmd.com/draw?type=combo&labels=%E5%91%A8%E4%B8%80%2C%E5%91%A8%E4%BA%8C%2C%E5%91%A8%E4%B8%89%2C%E5%91%A8%E5%9B%9B%2C%E5%91%A8%E4%BA%94&series=%E4%B8%8B%E8%BD%BD%3A120%2C180%2C150%2C210%2C240&line=%E5%A2%9E%E9%95%BF%3A3.1%2C3.4%2C3.2%2C3.8%2C4.1&title=%E4%B8%8B%E8%BD%BD%E9%87%8F&w=360)](https://x-cmd.com/draw/explore?type=combo&labels=%E5%91%A8%E4%B8%80%2C%E5%91%A8%E4%BA%8C%2C%E5%91%A8%E4%B8%89%2C%E5%91%A8%E5%9B%9B%2C%E5%91%A8%E4%BA%94&series=%E4%B8%8B%E8%BD%BD%3A120%2C180%2C150%2C210%2C240&line=%E5%A2%9E%E9%95%BF%3A3.1%2C3.4%2C3.2%2C3.8%2C4.1&title=%E4%B8%8B%E8%BD%BD%E9%87%8F) |
| `sankey` | 桑基图(流向带宽)<br><br>**<u>`labels=`+`links=A>B:30`,≤24 节点/60 链接</u>** | [![sankey example](https://x-cmd.com/draw?type=sankey&labels=%E8%AE%BF%E5%AE%A2%2CStar%2CFork%2CPR%2CMerged&links=%E8%AE%BF%E5%AE%A2%3EStar%3A84%3BStar%3EFork%3A17%3BFork%3EPR%3A9%3BPR%3EMerged%3A7&title=%E8%B4%A1%E7%8C%AE%E8%80%85%E6%BC%8F%E6%96%97&w=360)](https://x-cmd.com/draw/explore?type=sankey&labels=%E8%AE%BF%E5%AE%A2%2CStar%2CFork%2CPR%2CMerged&links=%E8%AE%BF%E5%AE%A2%3EStar%3A84%3BStar%3EFork%3A17%3BFork%3EPR%3A9%3BPR%3EMerged%3A7&title=%E8%B4%A1%E7%8C%AE%E8%80%85%E6%BC%8F%E6%96%97) |
| `qr` | 二维码<br><br>**<u>`d`=文本(≤1000 字符),`fg`/`bg` 配色,`title`/`unit` 标注</u>** | [![qr example](https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=%E6%89%AB%E6%88%91&w=360)](https://x-cmd.com/draw/explore?type=qr&d=https://github.com/x-cmd/draw&title=%E6%89%AB%E6%88%91) |
| `quadrant` | 2×2 矩阵,或只有两条交叉的轴;格子用 `quadrants=`,散点用 `items=name@x,y`<br><br>**<u>格子正好 4 个;坐标 0..1</u>** | [![quadrant example](https://x-cmd.com/draw?type=quadrant&frame=cross&title=%E4%BC%98%E5%85%88%E7%BA%A7&ylabel=Value&xlabel=%E6%88%90%E6%9C%AC&ylow=%E4%BD%8E&yhigh=%E9%AB%98&xlow=%E4%BD%8E&xhigh=%E9%AB%98&items=Platform@0.18,0.82;AI@0.38,0.55;Partners@0.62,0.28;Brand@0.78,0.12&w=360)](https://x-cmd.com/draw/explore?type=quadrant&frame=cross&title=%E4%BC%98%E5%85%88%E7%BA%A7&ylabel=Value&xlabel=%E6%88%90%E6%9C%AC&ylow=%E4%BD%8E&yhigh=%E9%AB%98&xlow=%E4%BD%8E&xhigh=%E9%AB%98&items=Platform@0.18,0.82;AI@0.38,0.55;Partners@0.62,0.28;Brand@0.78,0.12) |
| `compass` | 中心向外四支带标签的箭头(`up=` `right=` `down=` `left=`)<br><br>**<u>至少要有一个方向</u>** | [![compass example](https://x-cmd.com/draw?type=compass&title=%E5%9B%9B%E4%B8%AA%E9%80%89%E9%A1%B9&center=Core&up=%E5%8A%A0%E5%A4%A7%E6%8A%95%E5%85%A5%3A%E6%8A%A2%E4%BB%BD%E9%A2%9D&right=%E7%BB%B4%E6%8C%81%E7%8E%B0%E7%8A%B6%3A%E5%AE%88%E7%8E%B0%E9%87%91%E6%B5%81&down=%E6%94%B6%E7%BC%A9%E8%A7%84%E6%A8%A1%3A%E9%99%8D%E6%88%90%E6%9C%AC&left=%E9%80%80%E5%87%BA%E5%B8%82%E5%9C%BA%3A%E8%85%BE%E8%B5%84%E6%BA%90&w=360)](https://x-cmd.com/draw/explore?type=compass&title=%E5%9B%9B%E4%B8%AA%E9%80%89%E9%A1%B9&center=Core&up=%E5%8A%A0%E5%A4%A7%E6%8A%95%E5%85%A5%3A%E6%8A%A2%E4%BB%BD%E9%A2%9D&right=%E7%BB%B4%E6%8C%81%E7%8E%B0%E7%8A%B6%3A%E5%AE%88%E7%8E%B0%E9%87%91%E6%B5%81&down=%E6%94%B6%E7%BC%A9%E8%A7%84%E6%A8%A1%3A%E9%99%8D%E6%88%90%E6%9C%AC&left=%E9%80%80%E5%87%BA%E5%B8%82%E5%9C%BA%3A%E8%85%BE%E8%B5%84%E6%BA%90) |
