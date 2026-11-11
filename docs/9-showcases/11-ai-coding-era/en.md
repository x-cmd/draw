---
x-title: The AI-coding era — one person, the whole picture
x-desc: 'x-cmd/draw showcase: what a solo builder or a small team needs to keep hold of the whole project while the code comes fast. The code composition of a repository and of a diff, the architecture, the files a change touched, the shape of the work — each one a URL you can paste.'
x-sidebar: draw showcase ai coding
x-keywords: ai coding, solo builder, project overview, code composition, tokei, architecture diagram, draw showcase, 宏观掌控
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw showcase ai coding'
      inLanguage: 'en'
      about: 'x-cmd/draw 11-ai-coding-era'
---

# The AI-coding era — one person, the whole picture

The code comes fast now. An agent writes it, you review it, it goes out. What
gets lost is the *macro* view: you wrote three hundred lines yesterday and no
longer have the shape of the project in your head — and nobody else is holding
it either.

Being the architect, the product manager and the project manager at once means
you need the picture handed back to you. That is what charts are for: not the
code, the shape of the code.

Every picture below is a real project — draw itself — and every one is a URL
you can paste into an issue, a release note or a README.

## The project, at a glance

### What it is made of

The composition of the whole repository: code, comments and blanks per
language, with the file count as a line on its own axis (files and lines are
not the same measure — one axis would lie).

```text
https://x-cmd.com/draw/tokei?langs=TypeScript%3A24096%3A9638%3A1071%3A118%2CMarkdown%3A0%3A19928%3A8107%3A409%2CJson%3A4866%3A0%3A0%3A6%2CJavaScript%3A2621%3A473%3A166%3A27%2CYaml%3A1884%3A0%3A104%3A43&title=Code%20composition&w=760
```

[![Code composition](https://x-cmd.com/draw/tokei?langs=TypeScript%3A24096%3A9638%3A1071%3A118%2CMarkdown%3A0%3A19928%3A8107%3A409%2CJson%3A4866%3A0%3A0%3A6%2CJavaScript%3A2621%3A473%3A166%3A27%2CYaml%3A1884%3A0%3A104%3A43&title=Code%20composition&w=760)](https://x-cmd.com/draw/explore/tokei?langs=TypeScript%3A24096%3A9638%3A1071%3A118%2CMarkdown%3A0%3A19928%3A8107%3A409%2CJson%3A4866%3A0%3A0%3A6%2CJavaScript%3A2621%3A473%3A166%3A27%2CYaml%3A1884%3A0%3A104%3A43&title=Code%20composition)

### Files against lines

The same data spread out: how many **files** a language takes against how many
**lines**. A language with many lines in few files is a different beast from one
with the reverse — and that is the kind of thing you only see when the two
numbers sit side by side.

```text
https://x-cmd.com/draw/tokei?layout=files&langs=TypeScript%3A24096%3A9638%3A1071%3A118%2CMarkdown%3A0%3A19928%3A8107%3A409%2CJson%3A4866%3A0%3A0%3A6%2CJavaScript%3A2621%3A473%3A166%3A27%2CYaml%3A1884%3A0%3A104%3A43&title=Files%20vs%20lines&w=760
```

[![Files vs lines](https://x-cmd.com/draw/tokei?layout=files&langs=TypeScript%3A24096%3A9638%3A1071%3A118%2CMarkdown%3A0%3A19928%3A8107%3A409%2CJson%3A4866%3A0%3A0%3A6%2CJavaScript%3A2621%3A473%3A166%3A27%2CYaml%3A1884%3A0%3A104%3A43&title=Files%20vs%20lines&w=760)](https://x-cmd.com/draw/explore/tokei?layout=files&langs=TypeScript%3A24096%3A9638%3A1071%3A118%2CMarkdown%3A0%3A19928%3A8107%3A409%2CJson%3A4866%3A0%3A0%3A6%2CJavaScript%3A2621%3A473%3A166%3A27%2CYaml%3A1884%3A0%3A104%3A43&title=Files%20vs%20lines)

## The shape of the code

### Architecture

Where the parts are and who calls whom. This is the picture that tells you
whether the agent put the new thing in the right layer:

```text
https://x-cmd.com/draw/arch2?n=client;ext;Your%20app%20or%20CI;GET%20/draw%3Ftype%3D...;r0c0&n=worker;fe;Edge%20worker;src/index.ts%20%C2%B7%20fetch%20handler;r0c1&n=handler;be;handler.ts;route%20%E2%86%92%20respond;r1c1&n=specs;be;specs/;parse%20%2B%20validate;r2c0&n=store;db;store.ts;short%20links%20%E2%86%92%20Git%20repo;r2c1&n=render;be;render/;draw%20the%20SVG;r3c0&n=styles;be;styles/;skins%20%2B%20families;r4c0&n=png;be;png.ts;resvg%20%E2%86%92%20PNG;r4c2&e=client;worker;HTTPS&e=worker;handler;same%20core&e=handler;specs;spec&e=handler;store;short%20link&e=handler;render;render&e=render;styles;skin&e=render;png;format%3Dpng&b=Edge%20runtime%20%E2%80%94%20Cloudflare%20Worker;worker%20handler%20specs%20store%20render%20styles&title=Inside%20draw&w=760
```

[![Architecture](https://x-cmd.com/draw/arch2?n=client;ext;Your%20app%20or%20CI;GET%20/draw%3Ftype%3D...;r0c0&n=worker;fe;Edge%20worker;src/index.ts%20%C2%B7%20fetch%20handler;r0c1&n=handler;be;handler.ts;route%20%E2%86%92%20respond;r1c1&n=specs;be;specs/;parse%20%2B%20validate;r2c0&n=store;db;store.ts;short%20links%20%E2%86%92%20Git%20repo;r2c1&n=render;be;render/;draw%20the%20SVG;r3c0&n=styles;be;styles/;skins%20%2B%20families;r4c0&n=png;be;png.ts;resvg%20%E2%86%92%20PNG;r4c2&e=client;worker;HTTPS&e=worker;handler;same%20core&e=handler;specs;spec&e=handler;store;short%20link&e=handler;render;render&e=render;styles;skin&e=render;png;format%3Dpng&b=Edge%20runtime%20%E2%80%94%20Cloudflare%20Worker;worker%20handler%20specs%20store%20render%20styles&title=Inside%20draw&w=760)](https://x-cmd.com/draw/explore/arch2?n=client;ext;Your%20app%20or%20CI;GET%20/draw%3Ftype%3D...;r0c0&n=worker;fe;Edge%20worker;src/index.ts%20%C2%B7%20fetch%20handler;r0c1&n=handler;be;handler.ts;route%20%E2%86%92%20respond;r1c1&n=specs;be;specs/;parse%20%2B%20validate;r2c0&n=store;db;store.ts;short%20links%20%E2%86%92%20Git%20repo;r2c1&n=render;be;render/;draw%20the%20SVG;r3c0&n=styles;be;styles/;skins%20%2B%20families;r4c0&n=png;be;png.ts;resvg%20%E2%86%92%20PNG;r4c2&e=client;worker;HTTPS&e=worker;handler;same%20core&e=handler;specs;spec&e=handler;store;short%20link&e=handler;render;render&e=render;styles;skin&e=render;png;format%3Dpng&b=Edge%20runtime%20%E2%80%94%20Cloudflare%20Worker;worker%20handler%20specs%20store%20render%20styles&title=Inside%20draw&w=760)

### The folders that matter

The module tree as a mind map — the second level of the picture, the one that
tells you where a new file belongs:

```text
https://x-cmd.com/draw/mindmap?n=draw/src/handler.ts&n=draw/src/render&n=draw/src/specs&n=draw/src/styles&n=draw/src/store.ts&n=draw/test&n=draw/docs&style=tree&title=Where%20the%20code%20lives&w=560
```

[![The folders that matter](https://x-cmd.com/draw/mindmap?n=draw/src/handler.ts&n=draw/src/render&n=draw/src/specs&n=draw/src/styles&n=draw/src/store.ts&n=draw/test&n=draw/docs&style=tree&title=Where%20the%20code%20lives&w=560)](https://x-cmd.com/draw/explore/mindmap?n=draw/src/handler.ts&n=draw/src/render&n=draw/src/specs&n=draw/src/styles&n=draw/src/store.ts&n=draw/test&n=draw/docs&style=tree&title=Where%20the%20code%20lives)

## One change, checked

### What the agent wrote

The composition of the files a change touched — the increment, not the whole
repository. This is the picture that answers "did it write three hundred lines
of comments again".

```text
https://x-cmd.com/draw/tokei?langs=TypeScript%3A1820%3A420%3A160%3A9%2CTypeScript%20tests%3A240%3A60%3A40%3A2&title=What%20the%20last%20PR%20touched&w=560
```

### The files it touched

```text
https://x-cmd.com/draw/mindmap?n=draw/src/render/butterfly.ts&n=draw/src/render/tokei.ts&n=draw/src/specs/butterfly.ts&n=draw/test/butterfly.test.ts&n=draw/docs/2-data-charts/11-butterfly/en.md&style=tree&title=Files%20the%20last%20PR%20touched&w=560
```

[![Files the last PR touched](https://x-cmd.com/draw/mindmap?n=draw/src/render/butterfly.ts&n=draw/src/render/tokei.ts&n=draw/src/specs/butterfly.ts&n=draw/test/butterfly.test.ts&n=draw/docs/2-data-charts/11-butterfly/en.md&style=tree&title=Files%20the%20last%20PR%20touched&w=560)](https://x-cmd.com/draw/explore/mindmap?n=draw/src/render/butterfly.ts&n=draw/src/render/tokei.ts&n=draw/src/specs/butterfly.ts&n=draw/test/butterfly.test.ts&n=draw/docs/2-data-charts/11-butterfly/en.md&style=tree&title=Files%20the%20last%20PR%20touched)

## Where the project is going

### The plan

```text
https://x-cmd.com/draw/gantt2?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Sprint%20plan&w=560
```

[![Sprint plan](https://x-cmd.com/draw/gantt2?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Sprint%20plan&w=560)](https://x-cmd.com/draw/explore/gantt2?m=dateFormat%20YYYY-MM-DD%0A%20%20section%20Dev%0A%20%20Design%20%3Adone%2C%20a1%2C%202026-11-01%2C%203d%0A%20%20Build%20%3Aactive%2C%20a2%2C%20after%20a1%2C%205d%0A%20%20Ship%20%3Amilestone%2C%20m1%2C%202026-11-10%2C%200d%0A%20%20section%20QA%0A%20%20Regression%20%3Acrit%2C%20b1%2C%20after%20a2%2C%203d&title=Sprint%20plan)

### Where a change sits in the life of the issue

```text
https://x-cmd.com/draw/lifecycle?n=open;state;Open;;r0c0&n=review;state;In%20review;;r1c0&n=ci;decision;CI%20green%3F;;r1c1&n=merged;terminal;Merged;;r2c0&n=closed;terminal;Closed;;r2c2&e=open;review;opened&e=review;ci&e=ci;merged;pass&e=ci;closed;fail&e=closed;open;reopen&title=Issue%20life&w=560
```

[![Issue life](https://x-cmd.com/draw/lifecycle?n=open;state;Open;;r0c0&n=review;state;In%20review;;r1c0&n=ci;decision;CI%20green%3F;;r1c1&n=merged;terminal;Merged;;r2c0&n=closed;terminal;Closed;;r2c2&e=open;review;opened&e=review;ci&e=ci;merged;pass&e=ci;closed;fail&e=closed;open;reopen&title=Issue%20life&w=560)](https://x-cmd.com/draw/explore/lifecycle?n=open;state;Open;;r0c0&n=review;state;In%20review;;r1c0&n=ci;decision;CI%20green%3F;;r1c1&n=merged;terminal;Merged;;r2c0&n=closed;terminal;Closed;;r2c2&e=open;review;opened&e=review;ci&e=ci;merged;pass&e=ci;closed;fail&e=closed;open;reopen&title=Issue%20life)

## Which chart answers which question

| the question | the chart |
|---|---|
| What is this project made of? | code composition — `tokei` |
| How many files against how many lines? | files vs lines — `tokei?layout=files` |
| What did this change touch? | the composition of the diff — `tokei` |
| Where does the code live? | the module tree — `mindmap` |
| How do the parts fit together? | the architecture — `arch2` |
| What happens when a request comes in? | the sequence — `seq` |
| What does the system do for whom? | the use cases — `uc` |
| Where is this change in the plan? | the gantt — `gantt2` |
| What state is this issue in? | the lifecycle — `lifecycle` |
| How do the numbers compare? | the butterfly — `butterfly` |

Every one of them is a URL. Paste it in the issue, and the picture is there
for whoever reads it next — including the agent that picks the work up.
