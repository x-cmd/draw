---
x-title: Terminal — a command-line session, drawn as a macOS window
x-desc: 'x-cmd/draw terminal (`/draw/tty`): one command line plus its output, drawn as an Apple-style terminal window (traffic lights + title bar), with ANSI escapes restored to colours. Params: `cmd=` (a built-in mini shell actually runs it), `out=` (pass raw ANSI output), `cols=`/`rows=`, `title=`, `theme=`.'
x-sidebar: terminal
x-keywords: terminal screenshot, tty, ANSI, draw, svg, README image, command line, cli
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw terminal'
      inLanguage: 'en'
      about: 'x-cmd/draw 03-terminal'
---

# Terminal — a command-line session, drawn as a macOS window

The old problem of pasting a "terminal screenshot" into a README: bitmaps go
stale, re-shooting on every theme change, and nothing is editable.
`/draw/tty` **draws a command-line session as an SVG**: a rounded window with the
red-yellow-green lights and a title bar, one command line below (with the `$`
prompt and a cursor), then the output — and the **ANSI escapes in the output are
restored to colours** (bold, dim, 256-colour and true-colour all recognised).

Give it `out=` and your output is used verbatim; omit it and a **built-in mini
shell actually runs the command**: `help` for usage, `echo` for echoes,
`clear` for clearing (in a static picture that is one line of commentary), and
`draw <kind> --labels A,B --values 1,2` to chart data as Unicode art.
Unknown commands get the old rule: `command not found: xxx` — which is a
perfectly fine picture too.

## Parameters

| param | meaning | default |
|---|---|---|
| `cmd=` | the command line (the line in the window) | — |
| `out=` | the output (may carry ANSI escapes); given, the mini shell is skipped | mini shell runs `cmd=` |
| `cols=` | window width in character columns (20–200) | 72 |
| `rows=` | window height in lines (1–200; overflow is cut) | 24 |
| `title=` | title-bar text | the command itself |
| `theme=` | `dark` / `light` | dark |

## Examples

### A chart inside the shell

```text
https://x-cmd.com/draw/tty?cmd=draw%20bar%20--labels%20Mon%2CTue%2CWed%2CThu%20--values%2012%2C30%2C18%2C25&cols=58
```

[![Terminal · chart in a shell](https://x-cmd.com/draw/tty?cmd=draw%20bar%20--labels%20Mon%2CTue%2CWed%2CThu%20--values%2012%2C30%2C18%2C25&cols=58)](https://x-cmd.com/draw/explore/tty?cmd=draw%20bar%20--labels%20Mon%2CTue%2CWed%2CThu%20--values%2012%2C30%2C18%2C25&cols=58)

The mini shell knows six chart kinds — `bar hbar pie line area gauge` — so the
same picture changes when the `--labels`/`--values` do.

### The mini shell, describing itself

```text
https://x-cmd.com/draw/tty?cmd=help&cols=58
```

[![Terminal · help](https://x-cmd.com/draw/tty?cmd=help&cols=58)](https://x-cmd.com/draw/explore/tty?cmd=help&cols=58)

### Your own output + ANSI + title bar

With `out=` you pass the raw output (URL-encode it: newline `%0A`, ESC `%1B`)
and the ANSI sequences come back as colours — the right way to paste CI logs
and test runs:

```text
https://x-cmd.com/draw/tty?cmd=python3%20-m%20pytest&out=%1B%5B1mcollected%203%20items%1B%5B0m%0A%0Atest_api.py%20%1B%5B32m...%1B%5B0m%20%1B%5B32mPASSED%1B%5B0m%0Atest_web.py%20%1B%5B32m..%1B%5B0m%20%1B%5B32mPASSED%1B%5B0m%0Atest_db.py%20%1B%5B31mF%1B%5B0m%20%1B%5B31mFAILED%1B%5B0m%0A%0A%1B%5B31m1%20failed%2C%202%20passed%20in%200.42s%1B%5B0m&title=ci%20%C2%B7%20pytest&cols=64&rows=12
```

[![Terminal · CI output](https://x-cmd.com/draw/tty?cmd=python3%20-m%20pytest&out=%1B%5B1mcollected%203%20items%1B%5B0m%0A%0Atest_api.py%20%1B%5B32m...%1B%5B0m%20%1B%5B32mPASSED%1B%5B0m%0Atest_web.py%20%1B%5B32m..%1B%5B0m%20%1B%5B32mPASSED%1B%5B0m%0Atest_db.py%20%1B%5B31mF%1B%5B0m%20%1B%5B31mFAILED%1B%5B0m%0A%0A%1B%5B31m1%20failed%2C%202%20passed%20in%200.42s%1B%5B0m&title=ci%20%C2%B7%20pytest&cols=64&rows=12)](https://x-cmd.com/draw/explore/tty?cmd=python3%20-m%20pytest&out=%1B%5B1mcollected%203%20items%1B%5B0m%0A%0Atest_api.py%20%1B%5B32m...%1B%5B0m%20%1B%5B32mPASSED%1B%5B0m%0Atest_web.py%20%1B%5B32m..%1B%5B0m%20%1B%5B32mPASSED%1B%5B0m%0Atest_db.py%20%1B%5B31mF%1B%5B0m%20%1B%5B31mFAILED%1B%5B0m%0A%0A%1B%5B31m1%20failed%2C%202%20passed%20in%200.42s%1B%5B0m&title=ci%20%C2%B7%20pytest&cols=64&rows=12)

`title=` changes the title bar (the command is used when absent); `rows=12`
shrinks the window to twelve lines.

## Limits

- **The mini shell only does a few things**: `help` / `echo` / `clear` /
  `draw …`. For real output, pass the command's actual printout via `out=`.
- **`rows=` truncates.** Overflow is cut from the bottom — for a complete
  screenshot, raise `rows=` or trim the output.
- **East-Asian wide characters count as two columns**, and lines wrap at a
  space when possible (hard break otherwise) — CJK output stays aligned.
- **`out=` must be encoded.** `%` itself is `%25`, newline `%0A`, ESC `%1B`;
  raw control characters do not survive a URL.

## How it differs from the other kinds

Every other kind draws **data**; the terminal draws a **session** — not a
statistics chart but the evidence of a command. Its companion is the
interactive page [/draw/explore/tty](https://x-cmd.com/draw/explore/tty):
the window on the left, editable command and output on the right, and the
image URL to copy once it looks right.

More in the gallery: [/draw/demo/info](https://x-cmd.com/draw/demo/info).
