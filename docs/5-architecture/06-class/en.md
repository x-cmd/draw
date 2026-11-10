---
x-title: Class diagram — the types and how they hang together
x-desc: 'x-cmd/draw class diagram (`/draw/class`). Classes, interfaces and enums; the members live inside the node, one per line. Same URL model as the architecture diagram.'
x-sidebar: draw class diagram
x-keywords: class diagram, 类图, draw, svg, uml, types
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw class diagram'
      inLanguage: 'en'
      about: 'x-cmd/draw 06-class'
---

# Class diagram — the types and how they hang together

The public types of a library, drawn the way you would put them in a design
doc: the members inside each box, the relations on the arrows.

```text
https://x-cmd.com/draw/class?n=draw;class;draw;spec:%20object%250Areturns:%20DrawResult;r0c0&n=arch;class;renderArch;url:%20URL%250Areturns:%20DrawResult;r1c0&n=result;class;DrawResult;svg:%20string%250Aversion:%20number%250AcacheControl:%20string;r1c1&e=draw;result&e=arch;result
```

[![Class diagram](https://x-cmd.com/draw/class?n=draw;class;draw;spec:%20object%250Areturns:%20DrawResult;r0c0&n=arch;class;renderArch;url:%20URL%250Areturns:%20DrawResult;r1c0&n=result;class;DrawResult;svg:%20string%250Aversion:%20number%250AcacheControl:%20string;r1c1&e=draw;result&e=arch;result)](https://x-cmd.com/draw/explore/class?n=draw;class;draw;spec:%20object%250Areturns:%20DrawResult;r0c0&n=arch;class;renderArch;url:%20URL%250Areturns:%20DrawResult;r1c0&n=result;class;DrawResult;svg:%20string%250Aversion:%20number%250AcacheControl:%20string;r1c1&e=draw;result&e=arch;result)

These are draw's own entry points: `draw()`, the diagram renderers, and the
`DrawResult` they all return.

## 1. Parameters

| param | meaning | default |
|---|---|---|
| `n=` | a class: `id;type;label;members;pos` | — |
| `e=` | a relation: `from;to[;label]` | — |
| `b=` | a group: `label;id id …` | — |
| `title=` | diagram title | — |
| `w=` / `h=` | canvas size | natural size |

## 2. Writing the members

The member list is the node's fourth field, **one per line, separated by
`%0A`**:

```
n=draw;class;draw;spec: object%0Areturns: DrawResult;r0c0
```

Two lines: `spec: object` and `returns: DrawResult`. A method reads the way
you would write it in code — `greet(): void`.

Each line is drawn as a **member row**: the name on the left, the type on the
right (monospaced, so the types line up down the column). The split happens at
the first colon *outside* parentheses, so a method keeps its parameters:
`charge(amount: Money): Result` is the member `charge(amount: Money)` of type
`Result`.

**Visibility** — start a line with `+`, `-` or `#` and draw puts that marker in
front of it. A literal `+` has to be written `%2B` (in a query string a bare
`+` means space).

## 3. The vocabulary

| type | it is |
|---|---|
| `class` | a class |
| `iface` | an interface |
| `enum` | an enum |

## 4. Pitfalls

- **The member list is the fourth field** — `id;type;name;members;pos`.
- **`%0A` is a newline** — a plain space puts the whole list on one line.
- **Relations are edges, and the label is yours** — `e=user;repo;implements`.
  draw does not know your language's keywords.

