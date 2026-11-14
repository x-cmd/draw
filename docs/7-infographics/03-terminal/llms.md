---
name: docs/7-infographics-03-terminal
description: 'x-cmd/draw terminal (/draw/tty): one command line plus its output drawn as an Apple-style terminal window (traffic lights, title bar, prompt and cursor), ANSI escapes restored to colours. Params: cmd= (a built-in mini shell runs it when out= is absent — help/echo/clear/draw), out= (raw ANSI output), cols= (20–200, default 72), rows= (1–200, default 24, overflow cut), title=, theme=dark|light. Companion page /draw/explore/tty edits both.'
type: reference
---

# Core Content

core_features:

  - A command-line session drawn as a macOS-style window — traffic lights, title bar, `$` prompt, cursor
  - ANSI escapes in the output restored to colours (bold, dim, 256-colour, true-colour)
  - Built-in mini shell runs `cmd=` when `out=` is absent: `help`, `echo`, `clear`, `draw <kind> --labels --values`
  - `draw` inside the shell charts as Unicode art — bar, hbar, pie, line, area, gauge
  - `title=` sets the title bar; `cols=`/`rows=` size the window; CJK wraps at two columns per wide char

# Key Information

highlights:

  - Unknown commands render the classic `command not found` — a fine picture too
  - `rows=` truncates from the bottom; raise it for complete screenshots
  - `out=` must be URL-encoded: `%` as `%25`, newline `%0A`, ESC as `%1B`
  - /draw/explore/tty edits the command and output side by side before copying the image URL

# Use Cases

  - A README quick-start that shows a real command and its colourful output
  - CI logs and test runs pasted as crisp SVG instead of bitmap screenshots
  - A documentation page that needs "the terminal says so" evidence

# Related Resources

official:
  endpoint: https://x-cmd.com/draw/tty
related:
  qr: docs/7-infographics/01-qr/cn.md
  chemistry: docs/7-infographics/02-chemistry/cn.md
  gallery: https://x-cmd.com/draw/demo/info
