---
x-title: GitHub — issues, PRs and releases
x-desc: 'x-cmd/draw showcase: GitHub issues, pull requests and releases. The pictures worth attaching: a use case diagram, a sequence diagram, the code composition of a diff, the files a PR touched, the architecture of the codebase and the folders that matter.'
x-sidebar: draw showcase github
x-keywords: github issue, pull request, release notes, draw showcase, architecture from code
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw showcase github'
      inLanguage: 'en'
      about: 'x-cmd/draw 01-github'
---

# GitHub — issues, PRs and releases

Nobody reads a chart of star counts. What a reader wants on an issue, a pull
request or a release is a picture of the thing itself: what it does, what
changed, what the code looks like now.

## Why a link and not a screenshot

GitHub is the first place a chart link belongs — and the reason is not that it
looks good there. It is that everything on GitHub is already text: a diff, a
comment, a release note. A URL drops into that world without asking anybody to
change a habit, and it buys three things a screenshot cannot have.

- **It is reviewable.** Edit one parameter in the pull request and the picture
  changes with it. A screenshot can only be replaced.
- **It is diffable.** Two links that differ in one parameter differ in one
  character, so a chart in a pull request is a change somebody can read.
- **It is readable by a bot.** An agent reading the issue can fetch the link and
  take the numbers out of it instead of reading them off the pixels — the SVG
  embeds the data it was drawn from, so the link parses back into the spec it
  came from.

That last point is why a link beats a screenshot everywhere a machine may read
the same page a human does. The general idea has a name and a draft
specification: [datalink.ac](https://datalink.ac) — *data in the link*.

## An issue — what should it do?

### Use case diagram

The actors on the left, the use cases in the system, one boundary around the
system itself:

```text
https://x-cmd.com/draw/archmap?n=caller;ext;Your%20app;r0c0&n=uc1;be;Render%20a%20chart;r1c0&n=uc2;be;Store%20it%20as%20a%20short%20link;r1c1&n=uc3;be;Deploy%20it%20yourself;r1c2&e=caller;uc1&e=caller;uc2&e=caller;uc3&b=draw;uc1%20uc2%20uc3
```

[![Use case diagram](https://x-cmd.com/draw/archmap?n=caller;ext;Your%20app;r0c0&n=uc1;be;Render%20a%20chart;r1c0&n=uc2;be;Store%20it%20as%20a%20short%20link;r1c1&n=uc3;be;Deploy%20it%20yourself;r1c2&e=caller;uc1&e=caller;uc2&e=caller;uc3&b=draw;uc1%20uc2%20uc3)](https://x-cmd.com/draw/explore/archmap?n=caller;ext;Your%20app;r0c0&n=uc1;be;Render%20a%20chart;r1c0&n=uc2;be;Store%20it%20as%20a%20short%20link;r1c1&n=uc3;be;Deploy%20it%20yourself;r1c2&e=caller;uc1&e=caller;uc2&e=caller;uc3&b=draw;uc1%20uc2%20uc3)

### Sequence diagram

Time runs left to right: the objects are the boxes, the messages are the
arrows.

```text
https://x-cmd.com/draw/mermaid?m=graph%20LR%0A%20%20App%5BYour%20app%5D%20--%3E%7CGET%20%2Fdraw%3Ftype%3Dpie%7C%20Edge%5BEdge%20worker%5D%0A%20%20Edge%20--%3E%7Cparse%20the%20spec%7C%20Spec%5Bspecs%2F%5D%0A%20%20Edge%20--%3E%7Crender%7C%20Render%5Brender%2F%5D%0A%20%20Render%20--%3E%7CSVG%7C%20Edge%0A%20%20Edge%20--%3E%7C200%20OK%7C%20App&w=560
```

[![Sequence diagram](https://x-cmd.com/draw/mermaid?m=graph%20LR%0A%20%20App%5BYour%20app%5D%20--%3E%7CGET%20%2Fdraw%3Ftype%3Dpie%7C%20Edge%5BEdge%20worker%5D%0A%20%20Edge%20--%3E%7Cparse%20the%20spec%7C%20Spec%5Bspecs%2F%5D%0A%20%20Edge%20--%3E%7Crender%7C%20Render%5Brender%2F%5D%0A%20%20Render%20--%3E%7CSVG%7C%20Edge%0A%20%20Edge%20--%3E%7C200%20OK%7C%20App&w=560)](https://x-cmd.com/draw/explore/mermaid?m=graph%20LR%0A%20%20App%5BYour%20app%5D%20--%3E%7CGET%20%2Fdraw%3Ftype%3Dpie%7C%20Edge%5BEdge%20worker%5D%0A%20%20Edge%20--%3E%7Cparse%20the%20spec%7C%20Spec%5Bspecs%2F%5D%0A%20%20Edge%20--%3E%7Crender%7C%20Render%5Brender%2F%5D%0A%20%20Render%20--%3E%7CSVG%7C%20Edge%0A%20%20Edge%20--%3E%7C200%20OK%7C%20App&w=560)

## A PR — what changed?

### Code composition

`tokei` over the files the diff touches, straight into the chart:

```text
https://x-cmd.com/draw/tokei?d=%7B%22TypeScript%22%3A%7B%22code%22%3A4820%2C%22comments%22%3A1180%2C%22blanks%22%3A940%7D%2C%22JavaScript%22%3A%7B%22code%22%3A1687%2C%22comments%22%3A298%2C%22blanks%22%3A71%7D%2C%22Shell%22%3A%7B%22code%22%3A640%2C%22comments%22%3A120%2C%22blanks%22%3A88%7D%2C%22CSS%22%3A%7B%22code%22%3A210%2C%22comments%22%3A40%2C%22blanks%22%3A35%7D%2C%22Markdown%22%3A%7B%22code%22%3A180%2C%22comments%22%3A760%2C%22blanks%22%3A120%7D%2C%22JSON%22%3A%7B%22code%22%3A95%2C%22comments%22%3A0%2C%22blanks%22%3A12%7D%7D&title=Code%20composition%20%C2%B7%20v0.3.0&w=760&h=440
```

[![Code composition](https://x-cmd.com/draw/tokei?d=%7B%22TypeScript%22%3A%7B%22code%22%3A4820%2C%22comments%22%3A1180%2C%22blanks%22%3A940%7D%2C%22JavaScript%22%3A%7B%22code%22%3A1687%2C%22comments%22%3A298%2C%22blanks%22%3A71%7D%2C%22Shell%22%3A%7B%22code%22%3A640%2C%22comments%22%3A120%2C%22blanks%22%3A88%7D%2C%22CSS%22%3A%7B%22code%22%3A210%2C%22comments%22%3A40%2C%22blanks%22%3A35%7D%2C%22Markdown%22%3A%7B%22code%22%3A180%2C%22comments%22%3A760%2C%22blanks%22%3A120%7D%2C%22JSON%22%3A%7B%22code%22%3A95%2C%22comments%22%3A0%2C%22blanks%22%3A12%7D%7D&title=Code%20composition%20%C2%B7%20v0.3.0&w=760&h=440)](https://x-cmd.com/draw/explore/tokei?d=%7B%22TypeScript%22%3A%7B%22code%22%3A4820%2C%22comments%22%3A1180%2C%22blanks%22%3A940%7D%2C%22JavaScript%22%3A%7B%22code%22%3A1687%2C%22comments%22%3A298%2C%22blanks%22%3A71%7D%2C%22Shell%22%3A%7B%22code%22%3A640%2C%22comments%22%3A120%2C%22blanks%22%3A88%7D%2C%22CSS%22%3A%7B%22code%22%3A210%2C%22comments%22%3A40%2C%22blanks%22%3A35%7D%2C%22Markdown%22%3A%7B%22code%22%3A180%2C%22comments%22%3A760%2C%22blanks%22%3A120%7D%2C%22JSON%22%3A%7B%22code%22%3A95%2C%22comments%22%3A0%2C%22blanks%22%3A12%7D%7D&title=Code%20composition%20%C2%B7%20v0.3.0&w=760&h=440)

The bar is split into code, comments and blanks — the increment a reviewer
actually wants, not the whole repository.

### The files it touched

```text
https://x-cmd.com/draw/mindmap?n=draw/src/render/tokei.ts&n=draw/src/handler.ts&n=draw/test/tokei.test.ts&n=draw/docs/2-data-charts/10-tokei/en.md&style=tree&title=Files%20changed%20in%20%2331&w=560
```

[![Files changed](https://x-cmd.com/draw/mindmap?n=draw/src/render/tokei.ts&n=draw/src/handler.ts&n=draw/test/tokei.test.ts&n=draw/docs/2-data-charts/10-tokei/en.md&style=tree&title=Files%20changed%20in%20%2331&w=560)](https://x-cmd.com/draw/explore/mindmap?n=draw/src/render/tokei.ts&n=draw/src/handler.ts&n=draw/test/tokei.test.ts&n=draw/docs/2-data-charts/10-tokei/en.md&style=tree&title=Files%20changed%20in%20%2331&w=560)

## A release — what the codebase looks like now?

### Architecture

Read the code, then place the boxes on a grid and name the edges:

```text
https://x-cmd.com/draw/archmap?n=edge;fe;Edge%20worker;r0c0&n=specs;be;specs/;r1c0&n=render;be;render/;r1c1&n=styles;be;styles/;r1c2&n=store;db;store.ts;r2c0&n=fonts;db;fonts;r2c1&n=geo;db;vendor%20geojson;r2c2&e=edge;specs&e=edge;render&e=edge;styles&e=render;store&e=render;fonts&e=render;geo&b=Draw%20core;specs%20render%20styles
```

[![Architecture diagram](https://x-cmd.com/draw/archmap?n=edge;fe;Edge%20worker;r0c0&n=specs;be;specs/;r1c0&n=render;be;render/;r1c1&n=styles;be;styles/;r1c2&n=store;db;store.ts;r2c0&n=fonts;db;fonts;r2c1&n=geo;db;vendor%20geojson;r2c2&e=edge;specs&e=edge;render&e=edge;styles&e=render;store&e=render;fonts&e=render;geo&b=Draw%20core;specs%20render%20styles)](https://x-cmd.com/draw/explore/archmap?n=edge;fe;Edge%20worker;r0c0&n=specs;be;specs/;r1c0&n=render;be;render/;r1c1&n=styles;be;styles/;r1c2&n=store;db;store.ts;r2c0&n=fonts;db;fonts;r2c1&n=geo;db;vendor%20geojson;r2c2&e=edge;specs&e=edge;render&e=edge;styles&e=render;store&e=render;fonts&e=render;geo&b=Draw%20core;specs%20render%20styles)

### The folders that matter

```text
https://x-cmd.com/draw/mindmap?n=draw/src/specs&n=draw/src/render&n=draw/src/styles&n=draw/src/store.ts&n=draw/src/handler.ts&n=draw/test&n=draw/docs&style=tree&title=Repository%20layout&w=560
```

[![Repository layout](https://x-cmd.com/draw/mindmap?n=draw/src/specs&n=draw/src/render&n=draw/src/styles&n=draw/src/store.ts&n=draw/src/handler.ts&n=draw/test&n=draw/docs&style=tree&title=Repository%20layout&w=560)](https://x-cmd.com/draw/explore/mindmap?n=draw/src/specs&n=draw/src/render&n=draw/src/styles&n=draw/src/store.ts&n=draw/src/handler.ts&n=draw/test&n=draw/docs&style=tree&title=Repository%20layout&w=560)

## Which chart for what

| question | chart | reference |
|---|---|---|
| What does this thing do, and for whom?", "architecture diagram", [archmap](../../5-architecture/01-archmap/en.md) |
| Who does what?", "use case diagram", [archmap](../../5-architecture/01-archmap/en.md) |
| What happens, in what order?", "flowchart", [mermaid](../../5-architecture/03-mermaid/en.md) |
| What did this PR add?", "code composition", [tokei](../../2-data-charts/10-tokei/en.md) |
| Which files did it touch?", "mind map", [mindmap](../../5-architecture/02-mindmap/en.md) |
| What does the project look like?", "architecture diagram", [archmap](../../5-architecture/01-archmap/en.md) |
| How is the project laid out?", "mind map", [mindmap](../../5-architecture/02-mindmap/en.md) |

