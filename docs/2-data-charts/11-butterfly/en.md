---
x-title: Butterfly chart — two series, back to back
x-desc: 'x-cmd/draw butterfly chart (`/draw?type=butterfly`). Two bar series mirrored around a shared centre axis, each side optionally stacked, either side optionally carrying a line on its own scale. Params: `labels=`, `left=`, `right=`, `line=`, `lineside=`, `dir=lr|tb`, `title=`, `unit=`, `w=/h=`.'
x-sidebar: draw butterfly chart
x-keywords: butterfly chart, 双翼条形图, tornado chart, population pyramid, diverging bar, back to back bar, draw, svg
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw butterfly chart'
      inLanguage: 'en'
      about: 'x-cmd/draw 11-butterfly'
---

# Butterfly chart — two series, back to back

A horizontal bar chart can only answer "which is longer". Comparing two things
side by side means two charts. A **butterfly chart** puts both series back to
back around one centre axis: the lengths are directly comparable, and it takes
half the room.

The same construction has other names in the wild — **tornado chart** when the
categories are ranked by magnitude, **population pyramid** for age × sex, and
more generally **diverging bar chart** for anything around a zero baseline.
draw calls it a butterfly chart.

## Examples (what you see is what the URL gives; click to explore)

### Opened vs closed, by age

```text
https://x-cmd.com/draw?type=butterfly&title=Issues%20opened%20vs%20closed&labels=0-30d,30-60d,60-90d,90-180d,180-360d,360-720d&left=Opened:7,8,2,7,6,7&right=Closed:5,6,2,7,5,6&w=760&h=440
```

[![Issues opened vs closed](https://x-cmd.com/draw?type=butterfly&title=Issues%20opened%20vs%20closed&labels=0-30d,30-60d,60-90d,90-180d,180-360d,360-720d&left=Opened:7,8,2,7,6,7&right=Closed:5,6,2,7,5,6&w=760&h=440)](https://x-cmd.com/draw/explore?type=butterfly&title=Issues%20opened%20vs%20closed&labels=0-30d,30-60d,60-90d,90-180d,180-360d,360-720d&left=Opened:7,8,2,7,6,7&right=Closed:5,6,2,7,5,6)

### Two engines: peak memory against data on disk

```text
https://x-cmd.com/draw?type=butterfly&title=Memory%20vs%20disk%20per%20engine&labels=duckdb,sqlite&left=peak%20memory%20(GB):0.32,0.04&right=data%20on%20disk%20(GB):0.37,3.08&w=760&h=440
```

[![Memory vs disk](https://x-cmd.com/draw?type=butterfly&title=Memory%20vs%20disk%20per%20engine&labels=duckdb,sqlite&left=peak%20memory%20(GB):0.32,0.04&right=data%20on%20disk%20(GB):0.37,3.08&w=760&h=440)](https://x-cmd.com/draw/explore?type=butterfly&title=Memory%20vs%20disk%20per%20engine&labels=duckdb,sqlite&left=peak%20memory%20(GB):0.32,0.04&right=data%20on%20disk%20(GB):0.37,3.08)

### Population by age — the same chart standing up

```text
https://x-cmd.com/draw?type=butterfly&dir=tb&title=Population%20by%20age&labels=0-19,20-39,40-59,60-79&left=Male:51,48,42,35&right=Female:49,52,58,65&w=760&h=440
```

[![Population by age](https://x-cmd.com/draw?type=butterfly&dir=tb&title=Population%20by%20age&labels=0-19,20-39,40-59,60-79&left=Male:51,48,42,35&right=Female:49,52,58,65&w=760&h=440)](https://x-cmd.com/draw/explore?type=butterfly&dir=tb&title=Population%20by%20age&labels=0-19,20-39,40-59,60-79&left=Male:51,48,42,35&right=Female:49,52,58,65)

### Bars against a line — different units, different scales

```text
https://x-cmd.com/draw?type=butterfly&title=Memory,%20disk%20and%20report%20time&labels=duckdb,sqlite&left=peak%20memory%20(GB):0.32,0.04&right=data%20on%20disk%20(GB):0.37,3.08&line=report%20time%20(ms):536,49178&lineside=right&w=760&h=440
```

[![Memory, disk and report time](https://x-cmd.com/draw?type=butterfly&title=Memory,%20disk%20and%20report%20time&labels=duckdb,sqlite&left=peak%20memory%20(GB):0.32,0.04&right=data%20on%20disk%20(GB):0.37,3.08&line=report%20time%20(ms):536,49178&lineside=right&w=760&h=440)](https://x-cmd.com/draw/explore?type=butterfly&title=Memory,%20disk%20and%20report%20time&labels=duckdb,sqlite&left=peak%20memory%20(GB):0.32,0.04&right=data%20on%20disk%20(GB):0.37,3.08&line=report%20time%20(ms):536,49178&lineside=right)

## 1. Parameters

| param | meaning | default |
|---|---|---|
| `labels=` | the categories — rows in `lr`, columns in `tb` | — |
| `left=` | the first series: `Name:v,v,v`, or `name:v,v;name:v,v` to stack | — |
| `right=` | the second series, same shape | — |
| `line=` | a line on its own scale: `Name:v,v,v` | — |
| `lineside=` | which half the line sits in: `left` / `right` | `right` |
| `dir=` | `lr` (bars left and right) or `tb` (bars up and down) | `lr` |
| `title=` | chart title | — |
| `unit=` | unit, shown in the legend | — |
| `w=` / `h=` | canvas size | 640 × 420 |
| `scheme=` | `dark` / `light` | auto |
| `d=` | the JSON form (below) | — |

**The JSON form** — for anything the short form cannot say:

```text
https://x-cmd.com/draw?type=butterfly&d={"labels":["duckdb","sqlite"],"left":{"name":"peak memory (GB)","values":[0.32,0.04]},"right":{"name":"on disk (GB)","values":[0.37,3.08]},"line":{"name":"report (ms)","values":[536,49178],"side":"right"}}
```

```json
{
  "labels": ["duckdb", "sqlite"],
  "left":  { "name": "peak memory (GB)", "values": [0.32, 0.04] },
  "right": { "name": "on disk (GB)", "values": [0.37, 3.08] },
  "line":  { "name": "report (ms)", "values": [536, 49178], "side": "right" },
  "dir": "lr"
}
```

A side with several segments uses `"segments": [{"name": "code", "values": [...]}, …]`
— they stack outwards from the centre.

## 2. The four variants

One data shape covers all of them:

| variant | how to ask for it |
|---|---|
| **plain** — two series, back to back | `left=` + `right=` |
| **stacked** — each side a stack of segments | `left=code:1,2;comments:3,4` (semicolon between segments) |
| **standing up** — categories become columns | `dir=tb` |
| **bars against a line** — one side is a line | `line=Name:v,v,v&lineside=right` (and leave that side's bars out) |
| **a line over the bars** — the line has its own scale | `line=…` together with `left=`/`right=` |

Both sides share **one scale** for the bars — that is the whole point, the
lengths are comparable. A line always gets **its own scale**, because its unit
usually differs.

## 3. In the explore app

`/draw/explore?type=butterfly&…` shows the chart and its parameters as an
editable table: one row per category, one column per segment. Change a value
and the chart redraws; the URL follows.

## 4. Pitfalls

- **The unit belongs in the legend, not on the axis.** Write `left=peak memory
  (GB):…` rather than `unit=GB`: a reader who finds "1k" under an axis has no
  way to know it means megabytes. The legend is the only place they look.
- **Both sides share the bar scale.** If one side is in GB and the other in
  bytes, the picture lies. Convert first, or put the second number on a line.
- **`+` in a URL is a space.** A name that starts with a plus has to be
  written `%2B`.
- **Names are what the reader compares.** `Opened` and `Closed` beat
  `series A` and `series B`.
