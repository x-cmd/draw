---
x-title: Flowchart — Mermaid source in, diagram out
x-desc: 'x-cmd/draw flowchart quick reference (`/draw/mermaid`). Write the diagram in Mermaid syntax and the engine renders it server-side. Params: `m=` Mermaid source, `t=` style (mono), `title=`, `w=/h=`.'
x-sidebar: draw flowchart
x-keywords: flowchart, 流程图, mermaid, draw, svg, decision tree
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw flowchart'
      inLanguage: 'en'
      about: 'x-cmd/draw 03-mermaid'
---

# Flowchart — Mermaid source in, diagram out

> This page is a stub: the examples below are live, the full write-up is still to come.

Write the chart in Mermaid syntax and the engine draws it — no browser, no
screenshot step.

```text
https://x-cmd.com/draw/mermaid?m=graph%20TD%0A%20%20Login%5BUser%20login%5D%20--%3E%20MFA%7BMFA%20enabled%3F%7D%0A%20%20MFA%20--%3E%7Cyes%7C%20Code%5BSend%20code%5D%0A%20%20Code%20--%3E%20Verify%5BVerify%5D%0A%20%20Verify%20--%3E%7Cpass%7C%20Session%5BIssue%20session%5D%0A%20%20Verify%20--%3E%7Cfail%7C%20Lock%5BLock%20account%5D%0A%20%20MFA%20--%3E%7Cno%7C%20Session&t=mono&title=Login%20flow&w=560
```

[![Login flow](https://x-cmd.com/draw/mermaid?m=graph%20TD%0A%20%20Login%5BUser%20login%5D%20--%3E%20MFA%7BMFA%20enabled%3F%7D%0A%20%20MFA%20--%3E%7Cyes%7C%20Code%5BSend%20code%5D%0A%20%20Code%20--%3E%20Verify%5BVerify%5D%0A%20%20Verify%20--%3E%7Cpass%7C%20Session%5BIssue%20session%5D%0A%20%20Verify%20--%3E%7Cfail%7C%20Lock%5BLock%20account%5D%0A%20%20MFA%20--%3E%7Cno%7C%20Session&t=mono&title=Login%20flow&w=560)](https://x-cmd.com/draw/explore/mermaid?m=graph%20TD%0A%20%20Login%5BUser%20login%5D%20--%3E%20MFA%7BMFA%20enabled%3F%7D%0A%20%20MFA%20--%3E%7Cyes%7C%20Code%5BSend%20code%5D%0A%20%20Code%20--%3E%20Verify%5BVerify%5D%0A%20%20Verify%20--%3E%7Cpass%7C%20Session%5BIssue%20session%5D%0A%20%20Verify%20--%3E%7Cfail%7C%20Lock%5BLock%20account%5D%0A%20%20MFA%20--%3E%7Cno%7C%20Session&t=mono&title=Login%20flow&w=560)

## 1. Parameters

| param | meaning | default |
| --- | --- | --- |
| `m=` | the Mermaid source (`graph LR …`, `flowchart TD …`) | — |
| `t=` | style: `mono` for line art | — |
| `title=` | diagram title | — |
| `w=` / `h=` | minimum width / height | natural size |

## 2. Pitfalls

- **The source goes in `m=` URL-encoded** — `>` becomes `%3E`, spaces `%20`,
  newlines `%0A`. A raw `&` inside the source splits the parameter.
- **Only the flowchart subset is drawn** — this is the diagram renderer, not a
  full Mermaid runtime; exotic diagram types are not supported.

