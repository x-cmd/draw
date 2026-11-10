---
x-title: Code composition — tokei's numbers as a chart
x-desc: 'x-cmd/draw code composition chart (`/draw/tokei`). Takes the JSON from `tokei --output json` and draws one stacked column per language: code, comments, blanks. Params: `d=` the tokei json, `title=`, `unit=`, `w=/h=`, `t=`, `scheme=`.'
x-sidebar: draw code composition chart
x-keywords: code composition chart, 代码构成图, tokei, draw, svg, repository stats, language stats
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw code composition chart'
      inLanguage: 'en'
      about: 'x-cmd/draw 10-tokei'
---

# Code composition — tokei's numbers as a chart

`/draw/tokei` takes the JSON that `tokei --output json` prints and draws it:
one column per language, split into **code**, **comments** and **blanks**.

## Examples (what you see is what the URL gives; click to explore)

### A repository's languages

```text
https://x-cmd.com/draw/tokei?d=%7B%22TypeScript%22%3A%7B%22code%22%3A4820%2C%22comments%22%3A1180%2C%22blanks%22%3A940%7D%2C%22JavaScript%22%3A%7B%22code%22%3A1687%2C%22comments%22%3A298%2C%22blanks%22%3A71%7D%2C%22Shell%22%3A%7B%22code%22%3A640%2C%22comments%22%3A120%2C%22blanks%22%3A88%7D%2C%22CSS%22%3A%7B%22code%22%3A210%2C%22comments%22%3A40%2C%22blanks%22%3A35%7D%2C%22Markdown%22%3A%7B%22code%22%3A180%2C%22comments%22%3A760%2C%22blanks%22%3A120%7D%2C%22JSON%22%3A%7B%22code%22%3A95%2C%22comments%22%3A0%2C%22blanks%22%3A12%7D%7D&title=Code%20composition%20%C2%B7%20v0.3.0&w=760&h=440
```

[![Code composition](https://x-cmd.com/draw/tokei?d=%7B%22TypeScript%22%3A%7B%22code%22%3A4820%2C%22comments%22%3A1180%2C%22blanks%22%3A940%7D%2C%22JavaScript%22%3A%7B%22code%22%3A1687%2C%22comments%22%3A298%2C%22blanks%22%3A71%7D%2C%22Shell%22%3A%7B%22code%22%3A640%2C%22comments%22%3A120%2C%22blanks%22%3A88%7D%2C%22CSS%22%3A%7B%22code%22%3A210%2C%22comments%22%3A40%2C%22blanks%22%3A35%7D%2C%22Markdown%22%3A%7B%22code%22%3A180%2C%22comments%22%3A760%2C%22blanks%22%3A120%7D%2C%22JSON%22%3A%7B%22code%22%3A95%2C%22comments%22%3A0%2C%22blanks%22%3A12%7D%7D&title=Code%20composition%20%C2%B7%20v0.3.0&w=760&h=440)](https://x-cmd.com/draw/explore/tokei?d=%7B%22TypeScript%22%3A%7B%22code%22%3A4820%2C%22comments%22%3A1180%2C%22blanks%22%3A940%7D%2C%22JavaScript%22%3A%7B%22code%22%3A1687%2C%22comments%22%3A298%2C%22blanks%22%3A71%7D%2C%22Shell%22%3A%7B%22code%22%3A640%2C%22comments%22%3A120%2C%22blanks%22%3A88%7D%2C%22CSS%22%3A%7B%22code%22%3A210%2C%22comments%22%3A40%2C%22blanks%22%3A35%7D%2C%22Markdown%22%3A%7B%22code%22%3A180%2C%22comments%22%3A760%2C%22blanks%22%3A120%7D%2C%22JSON%22%3A%7B%22code%22%3A95%2C%22comments%22%3A0%2C%22blanks%22%3A12%7D%7D&title=Code%20composition%20%C2%B7%20v0.3.0&w=760&h=440)

The same picture through the plain bar endpoint — `stack=1` and three series:

```text
https://x-cmd.com/draw?type=bar&stack=1&labels=TypeScript,JavaScript,Shell,CSS,Markdown,JSON&series=code:4820,1687,640,210,180,95&series=comments:1180,298,120,40,760,0&series=blanks:940,71,88,35,120,12&title=Code%20composition%20%C2%B7%20v0.3.0&w=760&h=440
```

[![Code composition · bar](https://x-cmd.com/draw?type=bar&stack=1&labels=TypeScript,JavaScript,Shell,CSS,Markdown,JSON&series=code:4820,1687,640,210,180,95&series=comments:1180,298,120,40,760,0&series=blanks:940,71,88,35,120,12&title=Code%20composition%20%C2%B7%20v0.3.0&w=760&h=440)](https://x-cmd.com/draw/explore?type=bar&stack=1&labels=TypeScript,JavaScript,Shell,CSS,Markdown,JSON&series=code:4820,1687,640,210,180,95&series=comments:1180,298,120,40,760,0&series=blanks:940,71,88,35,120,12&title=Code%20composition%20%C2%B7%20v0.3.0&w=760&h=440)

## 1. Two ways to hand it the numbers

**The short one — `langs=`, and the one we push:**

```text
https://x-cmd.com/draw/tokei?langs=TypeScript:4820:1180:940,JavaScript:1687:298:71
```

Each item is `language:code:comments:blanks`, comma separated; the last two
may be left out. It is about eight times shorter than the JSON form and a
person — or an agent — can read it without unescaping anything.

**The machine one — `d=`, the JSON `tokei --output json` prints:**

```text
https://x-cmd.com/draw/tokei?d={"TypeScript":{"code":4820,"comments":1180,"blanks":940},…}
```

Same picture from either. The JSON form takes tokei's own output verbatim,
including the per-file detail (which is ignored); the property form is what
you want in a README.

## 2. Parameters

| param | meaning | default |
|---|---|---|
| `langs=` | the short form: `Lang:code:comments:blanks`, comma separated | — |
| `d=` | the JSON form (tokei's own output, or a trimmed subset) | — |
| `title=` | chart title | — |
| `unit=` | unit shown next to the values | — |
| `w=` / `h=` | canvas size | 760 × 440 |
| `t=` | skin (the bar families) | — |
| `scheme=` | `dark` / `light` | auto |

## 3. The input

`tokei --output json` prints one object per language:

```json
{"TypeScript":{"code":1200,"comments":300,"blanks":150}, ...}
```

The whole output works — the per-file `reports` and `children` are read and
ignored, only the three totals per language are used. A trimmed object with
just those three numbers per language works too, which is what you want
when the URL has to stay short.

Two things the endpoint does for you:

- the `Total` row tokei adds is **not** drawn as a column;
- languages are sorted by their total, **largest first**.

## 4. POST it straight from tokei

The body of a POST is the JSON, so the whole thing is one pipe:

```sh
tokei --output json | curl -X POST --data-binary @- https://x-cmd.com/draw/tokei
```

## 5. Only what the PR changed

For a pull request, run tokei over the files the diff touches:

```sh
git diff --name-only origin/main… | xargs tokei --output json
```

and post that. The chart then shows the increment, not the whole repository —
which is the number a reviewer actually wants. The same trick gives a
release its "what changed since the last tag" chart.

## 6. Pitfalls

- **The input has to be tokei's shape** — an object of
  `language → {code, comments, blanks}`. Anything else is a 400 with the
  expected shape in the message.
- **Languages with nothing in them are dropped** — a language with zero code,
  zero comments and zero blanks does not get a column.
- **The counts are lines, not bytes** — tokei's `code` is the number of code
  lines; the chart says nothing about file size.
- **`t=` picks the colours, not the shape** — the chart is always a stacked
  bar; use the plain `type=bar` endpoint if you want a different shape.

