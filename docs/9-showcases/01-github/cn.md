---
x-title: GitHub 与开源项目 —— 仓库主人真正会画的那几张图
x-desc: 'x-cmd/draw 场景用例:Github 与开源项目。语言 star、贡献者漏斗、每天提交、各区域 issue、仓库导图、安装二维码的真实 URL。'
x-sidebar: draw 场景用例 github
x-keywords: github 图表, 仓库数据看板, draw 场景用例, svg, 开源数据
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 场景用例 github'
      inLanguage: 'cn'
      about: 'x-cmd/draw showcase 01-github'
---

# GitHub 与开源项目 —— 仓库主人真正会画的那几张图

维护者、会议演讲者、README 作者要展示的项目信息 —— 以及渲染它们的 URL。

### 按语言看 star —— 看占比

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=Stars%20by%20language&labels=TypeScript,Python,Go,Rust,Java&values=4821,2312,980,645,520
```

[![Stars by language](https://x-cmd.com/draw?type=pie&t=market-mono&title=Stars%20by%20language&labels=TypeScript,Python,Go,Rust,Java&values=4821,2312,980,645,520)](https://x-cmd.com/draw/explore?type=pie&t=market-mono&title=Stars%20by%20language&labels=TypeScript,Python,Go,Rust,Java&values=4821,2312,980,645,520)

环形图一眼看出「star 落在各语言上的比例」。

### 同一组数据排个名 —— 看数量

```text
https://x-cmd.com/draw?type=hbar&title=Stars%20by%20language&labels=TypeScript,Python,Go,Rust,Java&values=4821,2312,980,645,520&unit=stars
```

[![Stars by language](https://x-cmd.com/draw?type=hbar&title=Stars%20by%20language&labels=TypeScript,Python,Go,Rust,Java&values=4821,2312,980,645,520&unit=stars)](https://x-cmd.com/draw/explore?type=hbar&title=Stars%20by%20language&labels=TypeScript,Python,Go,Rust,Java&values=4821,2312,980,645,520&unit=stars)

横条把标签放左边、数字放右边 —— 名字长、或者要读准数的时候更好用。

### 贡献者漏斗 —— 读者在哪一步掉队

```text
https://x-cmd.com/draw?type=sankey&t=fund&title=Contributor%20funnel&labels=Docs,Blog,Talks,Issue,PR,Merged&links=Docs>Issue:40;Blog>Issue:25;Talks>Issue:15;Issue>PR:32;PR>Merged:18
```

[![Contributor funnel](https://x-cmd.com/draw?type=sankey&t=fund&title=Contributor%20funnel&labels=Docs,Blog,Talks,Issue,PR,Merged&links=Docs>Issue:40;Blog>Issue:25;Talks>Issue:15;Issue>PR:32;PR>Merged:18)](https://x-cmd.com/draw/explore?type=sankey&t=fund&title=Contributor%20funnel&labels=Docs,Blog,Talks,Issue,PR,Merged&links=Docs>Issue:40;Blog>Issue:25;Talks>Issue:15;Issue>PR:32;PR>Merged:18)

桑基图把整条链路(read → star → fork → PR → merged)和收窄的地方都画出来。

### 每天的提交 —— 谁在什么时候干活

```text
https://x-cmd.com/draw?type=bar&labels=Mon,Tue,Wed,Thu,Fri,Sat,Sun&series=dev:12,18,9,15,21,8,17&series=ci:8,11,6,13,16,5,12&title=Commits%20by%20day
```

[![Commits by day](https://x-cmd.com/draw?type=bar&labels=Mon,Tue,Wed,Thu,Fri,Sat,Sun&series=dev:12,18,9,15,21,8,17&series=ci:8,11,6,13,16,5,12&title=Commits%20by%20day)](https://x-cmd.com/draw/explore?type=bar&labels=Mon,Tue,Wed,Thu,Fri,Sat,Sun&series=dev:12,18,9,15,21,8,17&series=ci:8,11,6,13,16,5,12&title=Commits%20by%20day)

每个工作日两组(功能与 CI),分组柱状图让对比不掺水。

### star 的增长曲线

```text
https://x-cmd.com/draw?type=area&t=star&labels=Jan,Feb,Mar,Apr,May,Jun,Jul&values=120,180,150,260,310,420,560&title=Stars%20over%20time
```

[![Stars over time](https://x-cmd.com/draw?type=area&t=star&labels=Jan,Feb,Mar,Apr,May,Jun,Jul&values=120,180,150,260,310,420,560&title=Stars%20over%20time)](https://x-cmd.com/draw/explore?type=area&t=star&labels=Jan,Feb,Mar,Apr,May,Jun,Jul&values=120,180,150,260,310,420,560&title=Stars%20over%20time)

面积风格在线下填色,像 star 这种累计数字读起来最顺。

### 各区域的 issue —— 未关与已关

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=open:12,8,15,4,9&series=closed:38,52,20,11,26&title=Issues%20by%20area
```

[![Issues by area](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=open:12,8,15,4,9&series=closed:38,52,20,11,26&title=Issues%20by%20area)](https://x-cmd.com/draw/explore?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=open:12,8,15,4,9&series=closed:38,52,20,11,26&title=Issues%20by%20area)

每个区域两根条:还开着的,和已经做完的。

### 仓库地图 —— 东西各在哪

```text
https://x-cmd.com/draw/mindmap?n=draw/Charts/Pie&n=draw/Charts/Bar%20and%20Line&n=draw/Charts/Sankey&n=draw/Arch/Archmap&n=draw/Arch/Mindmap&n=draw/Ecosystem/Skill&n=draw/Ecosystem/Data%20link&w=560
```

[![draw feature map](https://x-cmd.com/draw/mindmap?n=draw/Charts/Pie&n=draw/Charts/Bar%20and%20Line&n=draw/Charts/Sankey&n=draw/Arch/Archmap&n=draw/Arch/Mindmap&n=draw/Ecosystem/Skill&n=draw/Ecosystem/Data%20link&w=560)](https://x-cmd.com/draw/explore/mindmap?n=draw/Charts/Pie&n=draw/Charts/Bar%20and%20Line&n=draw/Charts/Sankey&n=draw/Arch/Archmap&n=draw/Arch/Mindmap&n=draw/Ecosystem/Skill&n=draw/Ecosystem/Data%20link&w=560)

仓库的思维导图:功能、图种、生态。

### 指向仓库的二维码 —— 放幻灯片、印纸上

```text
https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=scan%20me
```

[![QR code](https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=scan%20me)](https://x-cmd.com/draw/explore?type=qr&d=https://github.com/x-cmd/draw&title=scan%20me)

一张指向仓库的二维码,直接贴进幻灯片。


## 该用哪张图

| 问题 | 图种 | 参考 |
|---|---|---|
| 用户主要用哪种语言? | 饼图 | [pie](../../2-data-charts/01-pie/cn.md) |
| 名字长、还要排名? | 横条图 | [hbar](../../2-data-charts/03-hbar/cn.md) |
| 读者在哪一步流失? | 桑基图 | [sankey](../../3-relations/01-sankey/cn.md) |
| 每天干了多少活? | 柱状图 | [bar](../../2-data-charts/02-bar/cn.md) |
| 增长有多快? | 面积图 | [area](../../2-data-charts/05-area/cn.md) |
| 还有多少没做完? | 横条图 | [hbar](../../2-data-charts/03-hbar/cn.md) |
| 仓库里东西各在哪? | 思维导图 | [mindmap](../../5-architecture/02-mindmap/cn.md) |
| 别人怎么装? | 二维码 | [qr](../../7-infographics/01-qr/cn.md) |
