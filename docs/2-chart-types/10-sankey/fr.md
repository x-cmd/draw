---
x-title: sankey sankey — x-cmd/draw
x-desc: Des graphiques SVG pour l’ère de l’IA : un seul endpoint `/draw?type=. type=sankey.
x-sidebar: draw
x-keywords: draw, sankey, sankey, svg, chart
---

# sankey sankey

`GET /draw?type=sankey&...` — rendre un graphique

## Exemples

**pipeline**

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=fonction,correctif,documentation,divers,fusionn%C3%A9s,ferm%C3%A9s,rejet%C3%A9s,%3C1a,1%E2%80%932a,%3E2a&links=fonction%3Efusionn%C3%A9s:38;fonction%3Eferm%C3%A9s:12;fonction%3Erejet%C3%A9s:8;correctif%3Efusionn%C3%A9s:33;correctif%3Eferm%C3%A9s:6;correctif%3Erejet%C3%A9s:2;documentation%3Efusionn%C3%A9s:16;documentation%3Eferm%C3%A9s:4;divers%3Efusionn%C3%A9s:5;divers%3Eferm%C3%A9s:6;divers%3Erejet%C3%A9s:6;fusionn%C3%A9s%3E%3C1a:52;fusionn%C3%A9s%3E1%E2%80%932a:28;fusionn%C3%A9s%3E%3E2a:12;ferm%C3%A9s%3E%3C1a:14;ferm%C3%A9s%3E1%E2%80%932a:9;ferm%C3%A9s%3E%3E2a:5;rejet%C3%A9s%3E%3C1a:9;rejet%C3%A9s%3E1%E2%80%932a:5;rejet%C3%A9s%3E%3E2a:2&title=Cycle%20de%20vie%20des%20PR&unit=prs
```

![sankey pipeline](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=fonction,correctif,documentation,divers,fusionn%C3%A9s,ferm%C3%A9s,rejet%C3%A9s,%3C1a,1%E2%80%932a,%3E2a&links=fonction%3Efusionn%C3%A9s:38;fonction%3Eferm%C3%A9s:12;fonction%3Erejet%C3%A9s:8;correctif%3Efusionn%C3%A9s:33;correctif%3Eferm%C3%A9s:6;correctif%3Erejet%C3%A9s:2;documentation%3Efusionn%C3%A9s:16;documentation%3Eferm%C3%A9s:4;divers%3Efusionn%C3%A9s:5;divers%3Eferm%C3%A9s:6;divers%3Erejet%C3%A9s:6;fusionn%C3%A9s%3E%3C1a:52;fusionn%C3%A9s%3E1%E2%80%932a:28;fusionn%C3%A9s%3E%3E2a:12;ferm%C3%A9s%3E%3C1a:14;ferm%C3%A9s%3E1%E2%80%932a:9;ferm%C3%A9s%3E%3E2a:5;rejet%C3%A9s%3E%3C1a:9;rejet%C3%A9s%3E1%E2%80%932a:5;rejet%C3%A9s%3E%3E2a:2&title=Cycle%20de%20vie%20des%20PR&unit=prs)

**fund**

```text
https://x-cmd.com/draw?type=sankey&t=fund&labels=fonction,correctif,fusionn%C3%A9s,ferm%C3%A9s,%3C1a,1%E2%80%932a&links=fonction%3Efusionn%C3%A9s:50;fonction%3Eferm%C3%A9s:20;correctif%3Efusionn%C3%A9s:30;correctif%3Eferm%C3%A9s:10;fusionn%C3%A9s%3E%3C1a:52;fusionn%C3%A9s%3E1%E2%80%932a:28;ferm%C3%A9s%3E%3C1a:14;ferm%C3%A9s%3E1%E2%80%932a:9&title=Cycle%20de%20vie%20des%20PR
```

![sankey fund](https://x-cmd.com/draw?type=sankey&t=fund&labels=fonction,correctif,fusionn%C3%A9s,ferm%C3%A9s,%3C1a,1%E2%80%932a&links=fonction%3Efusionn%C3%A9s:50;fonction%3Eferm%C3%A9s:20;correctif%3Efusionn%C3%A9s:30;correctif%3Eferm%C3%A9s:10;fusionn%C3%A9s%3E%3C1a:52;fusionn%C3%A9s%3E1%E2%80%932a:28;ferm%C3%A9s%3E%3C1a:14;ferm%C3%A9s%3E1%E2%80%932a:9&title=Cycle%20de%20vie%20des%20PR)

**base**

```text
https://x-cmd.com/draw?type=sankey&labels=fonction,fusionn%C3%A9s,ferm%C3%A9s,%3C1a,1%E2%80%932a&links=fonction%3Efusionn%C3%A9s:71;fonction%3Eferm%C3%A9s:22;fusionn%C3%A9s%3E%3C1a:52;fusionn%C3%A9s%3E1%E2%80%932a:19;ferm%C3%A9s%3E%3C1a:14;ferm%C3%A9s%3E1%E2%80%932a:8&title=Cycle%20de%20vie%20des%20PR
```

![sankey base](https://x-cmd.com/draw?type=sankey&labels=fonction,fusionn%C3%A9s,ferm%C3%A9s,%3C1a,1%E2%80%932a&links=fonction%3Efusionn%C3%A9s:71;fonction%3Eferm%C3%A9s:22;fusionn%C3%A9s%3E%3C1a:52;fusionn%C3%A9s%3E1%E2%80%932a:19;ferm%C3%A9s%3E%3C1a:14;ferm%C3%A9s%3E1%E2%80%932a:8&title=Cycle%20de%20vie%20des%20PR)

## Paramètres

| Paramètres | | |
|---|---|---|
| `labels=` | nœuds, séparés par des virgules | ✓ |
| `links=` | flux `A>B:valeur`, séparés par ; | ✓ |
| `title=` | titre | ✗ |
| `unit=` | unité | ✗ |
| `t=` | famille de style | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `fund` |
| `pipeline` |

## Pièges

- ≤24 nœuds / 60 flux ; les cycles sont rejetés
- les flux forment un DAG — le total correspond aux labels
- encodez les espaces du titre en `%20`
