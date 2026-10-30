---
x-title: sankey sankey — x-cmd/draw
x-desc: SVG grafy pro éru AI: jediný endpoint `/draw?type=. type=sankey.
x-sidebar: draw
x-keywords: draw, sankey, sankey, svg, chart
---

# sankey sankey

`GET /draw?type=sankey&...` — vykreslit graf

## Příklady

**pipeline**

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=featury,fixy,dokumentace,jin%C3%A9,slou%C4%8Deno,zav%C5%99eno,zam%C3%ADtnuto,%3C1r,1%E2%80%932r,%3E2r&links=featury%3Eslou%C4%8Deno:38;featury%3Ezav%C5%99eno:12;featury%3Ezam%C3%ADtnuto:8;fixy%3Eslou%C4%8Deno:33;fixy%3Ezav%C5%99eno:6;fixy%3Ezam%C3%ADtnuto:2;dokumentace%3Eslou%C4%8Deno:16;dokumentace%3Ezav%C5%99eno:4;jin%C3%A9%3Eslou%C4%8Deno:5;jin%C3%A9%3Ezav%C5%99eno:6;jin%C3%A9%3Ezam%C3%ADtnuto:6;slou%C4%8Deno%3E%3C1r:52;slou%C4%8Deno%3E1%E2%80%932r:28;slou%C4%8Deno%3E%3E2r:12;zav%C5%99eno%3E%3C1r:14;zav%C5%99eno%3E1%E2%80%932r:9;zav%C5%99eno%3E%3E2r:5;zam%C3%ADtnuto%3E%3C1r:9;zam%C3%ADtnuto%3E1%E2%80%932r:5;zam%C3%ADtnuto%3E%3E2r:2&title=%C5%BDivotn%C3%AD%20cyklus%20PR&unit=prs
```

![sankey pipeline](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=featury,fixy,dokumentace,jin%C3%A9,slou%C4%8Deno,zav%C5%99eno,zam%C3%ADtnuto,%3C1r,1%E2%80%932r,%3E2r&links=featury%3Eslou%C4%8Deno:38;featury%3Ezav%C5%99eno:12;featury%3Ezam%C3%ADtnuto:8;fixy%3Eslou%C4%8Deno:33;fixy%3Ezav%C5%99eno:6;fixy%3Ezam%C3%ADtnuto:2;dokumentace%3Eslou%C4%8Deno:16;dokumentace%3Ezav%C5%99eno:4;jin%C3%A9%3Eslou%C4%8Deno:5;jin%C3%A9%3Ezav%C5%99eno:6;jin%C3%A9%3Ezam%C3%ADtnuto:6;slou%C4%8Deno%3E%3C1r:52;slou%C4%8Deno%3E1%E2%80%932r:28;slou%C4%8Deno%3E%3E2r:12;zav%C5%99eno%3E%3C1r:14;zav%C5%99eno%3E1%E2%80%932r:9;zav%C5%99eno%3E%3E2r:5;zam%C3%ADtnuto%3E%3C1r:9;zam%C3%ADtnuto%3E1%E2%80%932r:5;zam%C3%ADtnuto%3E%3E2r:2&title=%C5%BDivotn%C3%AD%20cyklus%20PR&unit=prs)

**fund**

```text
https://x-cmd.com/draw?type=sankey&t=fund&labels=featury,fixy,slou%C4%8Deno,zav%C5%99eno,%3C1r,1%E2%80%932r&links=featury%3Eslou%C4%8Deno:50;featury%3Ezav%C5%99eno:20;fixy%3Eslou%C4%8Deno:30;fixy%3Ezav%C5%99eno:10;slou%C4%8Deno%3E%3C1r:52;slou%C4%8Deno%3E1%E2%80%932r:28;zav%C5%99eno%3E%3C1r:14;zav%C5%99eno%3E1%E2%80%932r:9&title=%C5%BDivotn%C3%AD%20cyklus%20PR
```

![sankey fund](https://x-cmd.com/draw?type=sankey&t=fund&labels=featury,fixy,slou%C4%8Deno,zav%C5%99eno,%3C1r,1%E2%80%932r&links=featury%3Eslou%C4%8Deno:50;featury%3Ezav%C5%99eno:20;fixy%3Eslou%C4%8Deno:30;fixy%3Ezav%C5%99eno:10;slou%C4%8Deno%3E%3C1r:52;slou%C4%8Deno%3E1%E2%80%932r:28;zav%C5%99eno%3E%3C1r:14;zav%C5%99eno%3E1%E2%80%932r:9&title=%C5%BDivotn%C3%AD%20cyklus%20PR)

**base**

```text
https://x-cmd.com/draw?type=sankey&labels=featury,slou%C4%8Deno,zav%C5%99eno,%3C1r,1%E2%80%932r&links=featury%3Eslou%C4%8Deno:71;featury%3Ezav%C5%99eno:22;slou%C4%8Deno%3E%3C1r:52;slou%C4%8Deno%3E1%E2%80%932r:19;zav%C5%99eno%3E%3C1r:14;zav%C5%99eno%3E1%E2%80%932r:8&title=%C5%BDivotn%C3%AD%20cyklus%20PR
```

![sankey base](https://x-cmd.com/draw?type=sankey&labels=featury,slou%C4%8Deno,zav%C5%99eno,%3C1r,1%E2%80%932r&links=featury%3Eslou%C4%8Deno:71;featury%3Ezav%C5%99eno:22;slou%C4%8Deno%3E%3C1r:52;slou%C4%8Deno%3E1%E2%80%932r:19;zav%C5%99eno%3E%3C1r:14;zav%C5%99eno%3E1%E2%80%932r:8&title=%C5%BDivotn%C3%AD%20cyklus%20PR)

## Parametry

| Parametry | | |
|---|---|---|
| `labels=` | uzly, oddělené čárkami | ✓ |
| `links=` | toky `A>B:hodnota`, oddělené ; | ✓ |
| `title=` | název | ✗ |
| `unit=` | jednotka | ✗ |
| `t=` | rodina stylu | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `fund` |
| `pipeline` |

## Zádrhele

- ≤24 uzlů / 60 toků; cykly se odmítají
- toky tvoří DAG — součet souhlasí s labels
- mezery v názvu kódujte jako `%20`
