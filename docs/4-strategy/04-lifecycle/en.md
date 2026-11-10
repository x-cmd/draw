---
x-title: Lifecycle diagram — the states and the moves between them
x-desc: 'x-cmd/draw lifecycle diagram (`/draw/lifecycle`). States, decisions and terminals; every edge says what triggers the move. Same URL model as the architecture diagram.'
x-sidebar: draw lifecycle diagram
x-keywords: lifecycle diagram, 生命周期图, state machine, draw, svg
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw lifecycle diagram'
      inLanguage: 'en'
      about: 'x-cmd/draw 04-lifecycle'
---

# Lifecycle diagram — the states and the moves between them

A state machine drawn the way you would sketch it: states, the decision
between them, and the trigger written on every arrow.

```text
https://x-cmd.com/draw/lifecycle?n=open;state;Open;;r0c0&n=review;state;In%20review;;r1c0&n=ci;decision;CI%20green%3F;;r1c1&n=merged;terminal;Merged;;r2c0&n=closed;terminal;Closed;;r2c2&e=open;review;opened&e=review;ci&e=ci;merged;pass&e=ci;closed;fail&e=closed;open;reopen
```

[![Lifecycle](https://x-cmd.com/draw/lifecycle?n=open;state;Open;;r0c0&n=review;state;In%20review;;r1c0&n=ci;decision;CI%20green%3F;;r1c1&n=merged;terminal;Merged;;r2c0&n=closed;terminal;Closed;;r2c2&e=open;review;opened&e=review;ci&e=ci;merged;pass&e=ci;closed;fail&e=closed;open;reopen)](https://x-cmd.com/draw/explore/lifecycle?n=open;state;Open;;r0c0&n=review;state;In%20review;;r1c0&n=ci;decision;CI%20green%3F;;r1c1&n=merged;terminal;Merged;;r2c0&n=closed;terminal;Closed;;r2c2&e=open;review;opened&e=review;ci&e=ci;merged;pass&e=ci;closed;fail&e=closed;open;reopen)

This one is a pull request's life: opened, in review, CI decides.

## 1. Parameters

| param | meaning | default |
|---|---|---|
| `n=` | a node: `id;type;label[;sub][;pos]` | — |
| `e=` | a transition: `from;to[;trigger]` | — |
| `b=` | a group: `label;id id …` | — |
| `title=` | diagram title | — |
| `w=` / `h=` | canvas size | natural size |

## 2. The vocabulary

| type | it is | shape |
|---|---|---|
| `state` | a state the thing can be in | round |
| `decision` | a branch point | diamond |
| `terminal` | where it starts or ends | round |

The arrow label is the trigger — `payment ok`, `fail`, `reopen`. That is what
turns the picture into a state machine rather than a flowchart.

## 3. Pitfalls

- **The type must be one of the three** — `state`, `decision` or `terminal`.
- **Put the trigger on the edge** — without it the reader cannot tell what
  caused the move.
- **A cycle is fine** — `e=closed;open;reopen` draws a line back, and the
  router routes around the boxes.

