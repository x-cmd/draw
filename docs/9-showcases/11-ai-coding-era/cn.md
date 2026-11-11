---
x-title: AI-coding 时代 —— 一个人,看得见全局
x-desc: 'x-cmd/draw 场景用例:代码来得很快的时候,一个人(一个小团队)怎么把整个项目握在手里。仓库的代码构成、一次改动的构成、架构、改动碰过的文件、工作的形状 —— 每一张都是一个能直接粘贴的 URL。'
x-sidebar: draw 场景用例 ai coding
x-keywords: ai coding, 一个人做项目, 宏观掌控, 代码构成, tokei, 架构图, draw 场景用例
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 场景用例 ai coding'
      inLanguage: 'cn'
      about: 'x-cmd/draw 11-ai-coding-era'
---

# AI-coding 时代 —— 一个人,看得见全局

现在代码来得很快:agent 写,你审,发出去。丢的是**全局**感 —— 昨天你写了三百行,
今天脑子里已经没有这个项目的形状了;而且也没有别人替你拿着。

架构师、产品经理、项目经理都是你一个人,那就得让图把全局交还给你。
这正是图表的用处:不是代码,是代码的形状。

下面每一张图都是一个真项目 —— 就是 draw 自己 —— 每一张都是一个能粘进 issue、
release note 或 README 的 URL。

## 项目,一眼看完

### 它是由什么组成的

整个仓库的构成:每门语言的代码、注释、空行,文件数作为一条自己的轴上的折线
(文件数和行数不是一个量级,放同一根轴上会骗人)。

```text
https://x-cmd.com/draw/tokei?langs=TypeScript%3A24096%3A9638%3A1071%3A118%2CMarkdown%3A0%3A19928%3A8107%3A409%2CJson%3A4866%3A0%3A0%3A6%2CJavaScript%3A2621%3A473%3A166%3A27%2CYaml%3A1884%3A0%3A104%3A43&title=Code%20composition&w=760
```

[![Code composition](https://x-cmd.com/draw/tokei?langs=TypeScript%3A24096%3A9638%3A1071%3A118%2CMarkdown%3A0%3A19928%3A8107%3A409%2CJson%3A4866%3A0%3A0%3A6%2CJavaScript%3A2621%3A473%3A166%3A27%2CYaml%3A1884%3A0%3A104%3A43&title=Code%20composition&w=760)](https://x-cmd.com/draw/explore/tokei?langs=TypeScript%3A24096%3A9638%3A1071%3A118%2CMarkdown%3A0%3A19928%3A8107%3A409%2CJson%3A4866%3A0%3A0%3A6%2CJavaScript%3A2621%3A473%3A166%3A27%2CYaml%3A1884%3A0%3A104%3A43&title=Code%20composition)

### 文件数 对 行数

同一份数据摊开:一门语言**占多少文件** 对 **多少行**。用少量文件写很多行,和
反过来,是两种东西 —— 而这种事只有两个数摆在一起时才看得见。

```text
https://x-cmd.com/draw/tokei?layout=files&langs=TypeScript%3A24096%3A9638%3A1071%3A118%2CMarkdown%3A0%3A19928%3A8107%3A409%2CJson%3A4866%3A0%3A0%3A6%2CJavaScript%3A2621%3A473%3A166%3A27%2CYaml%3A1884%3A0%3A104%3A43&title=Files%20vs%20lines&w=760
```

[![Files vs lines](https://x-cmd.com/draw/tokei?layout=files&langs=TypeScript%3A24096%3A9638%3A1071%3A118%2CMarkdown%3A0%3A19928%3A8107%3A409%2CJson%3A4866%3A0%3A0%3A6%2CJavaScript%3A2621%3A473%3A166%3A27%2CYaml%3A1884%3A0%3A104%3A43&title=Files%20vs%20lines&w=760)](https://x-cmd.com/draw/explore/tokei?layout=files&langs=TypeScript%3A24096%3A9638%3A1071%3A118%2CMarkdown%3A0%3A19928%3A8107%3A409%2CJson%3A4866%3A0%3A0%3A6%2CJavaScript%3A2621%3A473%3A166%3A27%2CYaml%3A1884%3A0%3A104%3A43&title=Files%20vs%20lines)

## 代码的形状

### 架构

各个部分在哪、谁调谁。这张图能告诉你:agent 是不是把新东西放进了正确的层。

```text
https://x-cmd.com/draw/arch2?n=client;ext;Your%20app%20or%20CI;GET%20/draw%3Ftype%3D...;r0c0&n=worker;fe;Edge%20worker;src/index.ts%20%C2%B7%20fetch%20handler;r0c1&n=handler;be;handler.ts;route%20%E2%86%92%20respond;r1c1&n=specs;be;specs/;parse%20%2B%20validate;r2c0&n=store;db;store.ts;short%20links%20%E2%86%92%20Git%20repo;r2c1&n=render;be;render/;draw%20the%20SVG;r3c0&n=styles;be;styles/;skins%20%2B%20families;r4c0&n=png;be;png.ts;resvg%20%E2%86%92%20PNG;r4c2&e=client;worker;HTTPS&e=worker;handler;same%20core&e=handler;specs;spec&e=handler;store;short%20link&e=handler;render;render&e=render;styles;skin&e=render;png;format%3Dpng&b=Edge%20runtime%20%E2%80%94%20Cloudflare%20Worker;worker%20handler%20specs%20store%20render%20styles&title=Inside%20draw&w=760
```

[![Architecture](https://x-cmd.com/draw/arch2?n=client;ext;Your%20app%20or%20CI;GET%20/draw%3Ftype%3D...;r0c0&n=worker;fe;Edge%20worker;src/index.ts%20%C2%B7%20fetch%20handler;r0c1&n=handler;be;handler.ts;route%20%E2%86%92%20respond;r1c1&n=specs;be;specs/;parse%20%2B%20validate;r2c0&n=store;db;store.ts;short%20links%20%E2%86%92%20Git%20repo;r2c1&n=render;be;render/;draw%20the%20SVG;r3c0&n=styles;be;styles/;skins%20%2B%20families;r4c0&n=png;be;png.ts;resvg%20%E2%86%92%20PNG;r4c2&e=client;worker;HTTPS&e=worker;handler;same%20core&e=handler;specs;spec&e=handler;store;short%20link&e=handler;render;render&e=render;styles;skin&e=render;png;format%3Dpng&b=Edge%20runtime%20%E2%80%94%20Cloudflare%20Worker;worker%20handler%20specs%20store%20render%20styles&title=Inside%20draw&w=760)](https://x-cmd.com/draw/explore/arch2?n=client;ext;Your%20app%20or%20CI;GET%20/draw%3Ftype%3D...;r0c0&n=worker;fe;Edge%20worker;src/index.ts%20%C2%B7%20fetch%20handler;r0c1&n=handler;be;handler.ts;route%20%E2%86%92%20respond;r1c1&n=specs;be;specs/;parse%20%2B%20validate;r2c0&n=store;db;store.ts;short%20links%20%E2%86%92%20Git%20repo;r2c1&n=render;be;render/;draw%20the%20SVG;r3c0&n=styles;be;styles/;skins%20%2B%20families;r4c0&n=png;be;png.ts;resvg%20%E2%86%92%20PNG;r4c2&e=client;worker;HTTPS&e=worker;handler;same%20core&e=handler;specs;spec&e=handler;store;short%20link&e=handler;render;render&e=render;styles;skin&e=render;png;format%3Dpng&b=Edge%20runtime%20%E2%80%94%20Cloudflare%20Worker;worker%20handler%20specs%20store%20render%20styles&title=Inside%20draw&w=760)

### 代码住在哪

模块树画成导图 —— 全局的第二层:告诉你新文件该放哪。

```text
https://x-cmd.com/draw/mindmap?n=draw/src/handler.ts&n=draw/src/render&n=draw/src/specs&n=draw/src/styles&n=draw/src/store.ts&n=draw/test&n=draw/docs&style=tree&title=Where%20the%20code%20lives&w=560
```

[![The folders that matter](https://x-cmd.com/draw/mindmap?n=draw/src/handler.ts&n=draw/src/render&n=draw/src/specs&n=draw/src/styles&n=draw/src/store.ts&n=draw/test&n=draw/docs&style=tree&title=Where%20the%20code%20lives&w=560)](https://x-cmd.com/draw/explore/mindmap?n=draw/src/handler.ts&n=draw/src/render&n=draw/src/specs&n=draw/src/styles&n=draw/src/store.ts&n=draw/test&n=draw/docs&style=tree&title=Where%20the%20code%20lives)

## 一次改动,核对一下

### agent 写了什么

这次改动碰到的文件的构成 —— 是增量,不是整个仓库。这张图回答的是
「它是不是又写了三百行注释」。

```text
https://x-cmd.com/draw/tokei?langs=TypeScript%3A1820%3A420%3A160%3A9%2CTypeScript%20tests%3A240%3A60%3A40%3A2&title=What%20the%20last%20PR%20touched&w=560
```

### 它碰了哪些文件

```text
https://x-cmd.com/draw/mindmap?n=draw/src/render/butterfly.ts&n=draw/src/render/tokei.ts&n=draw/src/specs/butterfly.ts&n=draw/test/butterfly.test.ts&n=draw/docs/2-data-charts/11-butterfly/en.md&style=tree&title=Files%20the%20last%20PR%20touched&w=560
```

[![Files the last PR touched](https://x-cmd.com/draw/mindmap?n=draw/src/render/butterfly.ts&n=draw/src/render/tokei.ts&n=draw/src/specs/butterfly.ts&n=draw/test/butterfly.test.ts&n=draw/docs/2-data-charts/11-butterfly/en.md&style=tree&title=Files%20the%20last%20PR%20touched&w=560)](https://x-cmd.com/draw/explore/mindmap?n=draw/src/render/butterfly.ts&n=draw/src/render/tokei.ts&n=draw/src/specs/butterfly.ts&n=draw/test/butterfly.test.ts&n=draw/docs/2-data-charts/11-butterfly/en.md&style=tree&title=Files%20the%20last%20PR%20touched)

## 项目往哪走

### 计划

```text
https://x-cmd.com/draw/gantt2?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Sprint%20plan&w=560
```

[![Sprint plan](https://x-cmd.com/draw/gantt2?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Sprint%20plan&w=560)](https://x-cmd.com/draw/explore/gantt2?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Sprint%20plan)

### 这次改动在 issue 的一生里处在哪

```text
https://x-cmd.com/draw/lifecycle?n=open;state;Open;;r0c0&n=review;state;In%20review;;r1c0&n=ci;decision;CI%20green%3F;;r1c1&n=merged;terminal;Merged;;r2c0&n=closed;terminal;Closed;;r2c2&e=open;review;opened&e=review;ci&e=ci;merged;pass&e=ci;closed;fail&e=closed;open;reopen&title=Issue%20life&w=560
```

[![Issue life](https://x-cmd.com/draw/lifecycle?n=open;state;Open;;r0c0&n=review;state;In%20review;;r1c0&n=ci;decision;CI%20green%3F;;r1c1&n=merged;terminal;Merged;;r2c0&n=closed;terminal;Closed;;r2c2&e=open;review;opened&e=review;ci&e=ci;merged;pass&e=ci;closed;fail&e=closed;open;reopen&title=Issue%20life&w=560)](https://x-cmd.com/draw/explore/lifecycle?n=open;state;Open;;r0c0&n=review;state;In%20review;;r1c0&n=ci;decision;CI%20green%3F;;r1c1&n=merged;terminal;Merged;;r2c0&n=closed;terminal;Closed;;r2c2&e=open;review;opened&e=review;ci&e=ci;merged;pass&e=ci;closed;fail&e=closed;open;reopen&title=Issue%20life)

## 哪个问题用哪张图

| 问题 | 图 |
|---|---|
| 这个项目由什么组成? | 代码构成 —— `tokei` |
| 多少文件对多少行? | 文件数与行数 —— `tokei?layout=files` |
| 这次改动碰了什么? | 增量的代码构成 —— `tokei` |
| 代码住在哪? | 模块树 —— `mindmap` |
| 各部分怎么拼起来? | 架构 —— `arch2` |
| 一个请求进来会发生什么? | 时序 —— `seq` |
| 这个系统为谁做什么? | 用例 —— `uc` |
| 这次改动在计划里的哪? | 甘特 —— `gantt2` |
| 这个 issue 现在什么状态? | 生命周期 —— `lifecycle` |
| 两组数字怎么比? | 双翼 —— `butterfly` |

每一个都是一个 URL。粘进 issue,下一个读到它的人就有图了 —— 包括那个
接手这件事的 agent。
