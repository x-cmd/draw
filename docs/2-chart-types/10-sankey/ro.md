---
x-title: sankey sankey — x-cmd/draw
x-desc: Grafice SVG pentru era AI: un singur endpoint `/draw?type=. type=sankey.
x-sidebar: draw
x-keywords: draw, sankey, sankey, svg, chart
---

# sankey sankey

`GET /draw?type=sankey&...` — randează un grafic

## Exemple

**pipeline**

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=func%C8%9Bii,fixuri,documenta%C8%9Bie,altele,combinate,%C3%AEnchise,respinse,%3C1a,1%E2%80%932a,%3E2a&links=func%C8%9Bii%3Ecombinate:38;func%C8%9Bii%3E%C3%AEnchise:12;func%C8%9Bii%3Erespinse:8;fixuri%3Ecombinate:33;fixuri%3E%C3%AEnchise:6;fixuri%3Erespinse:2;documenta%C8%9Bie%3Ecombinate:16;documenta%C8%9Bie%3E%C3%AEnchise:4;altele%3Ecombinate:5;altele%3E%C3%AEnchise:6;altele%3Erespinse:6;combinate%3E%3C1a:52;combinate%3E1%E2%80%932a:28;combinate%3E%3E2a:12;%C3%AEnchise%3E%3C1a:14;%C3%AEnchise%3E1%E2%80%932a:9;%C3%AEnchise%3E%3E2a:5;respinse%3E%3C1a:9;respinse%3E1%E2%80%932a:5;respinse%3E%3E2a:2&title=Ciclul%20de%20via%C8%9B%C4%83%20al%20PR&unit=prs
```

![sankey pipeline](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=func%C8%9Bii,fixuri,documenta%C8%9Bie,altele,combinate,%C3%AEnchise,respinse,%3C1a,1%E2%80%932a,%3E2a&links=func%C8%9Bii%3Ecombinate:38;func%C8%9Bii%3E%C3%AEnchise:12;func%C8%9Bii%3Erespinse:8;fixuri%3Ecombinate:33;fixuri%3E%C3%AEnchise:6;fixuri%3Erespinse:2;documenta%C8%9Bie%3Ecombinate:16;documenta%C8%9Bie%3E%C3%AEnchise:4;altele%3Ecombinate:5;altele%3E%C3%AEnchise:6;altele%3Erespinse:6;combinate%3E%3C1a:52;combinate%3E1%E2%80%932a:28;combinate%3E%3E2a:12;%C3%AEnchise%3E%3C1a:14;%C3%AEnchise%3E1%E2%80%932a:9;%C3%AEnchise%3E%3E2a:5;respinse%3E%3C1a:9;respinse%3E1%E2%80%932a:5;respinse%3E%3E2a:2&title=Ciclul%20de%20via%C8%9B%C4%83%20al%20PR&unit=prs)

**fund**

```text
https://x-cmd.com/draw?type=sankey&t=fund&labels=func%C8%9Bii,fixuri,combinate,%C3%AEnchise,%3C1a,1%E2%80%932a&links=func%C8%9Bii%3Ecombinate:50;func%C8%9Bii%3E%C3%AEnchise:20;fixuri%3Ecombinate:30;fixuri%3E%C3%AEnchise:10;combinate%3E%3C1a:52;combinate%3E1%E2%80%932a:28;%C3%AEnchise%3E%3C1a:14;%C3%AEnchise%3E1%E2%80%932a:9&title=Ciclul%20de%20via%C8%9B%C4%83%20al%20PR
```

![sankey fund](https://x-cmd.com/draw?type=sankey&t=fund&labels=func%C8%9Bii,fixuri,combinate,%C3%AEnchise,%3C1a,1%E2%80%932a&links=func%C8%9Bii%3Ecombinate:50;func%C8%9Bii%3E%C3%AEnchise:20;fixuri%3Ecombinate:30;fixuri%3E%C3%AEnchise:10;combinate%3E%3C1a:52;combinate%3E1%E2%80%932a:28;%C3%AEnchise%3E%3C1a:14;%C3%AEnchise%3E1%E2%80%932a:9&title=Ciclul%20de%20via%C8%9B%C4%83%20al%20PR)

**base**

```text
https://x-cmd.com/draw?type=sankey&labels=func%C8%9Bii,combinate,%C3%AEnchise,%3C1a,1%E2%80%932a&links=func%C8%9Bii%3Ecombinate:71;func%C8%9Bii%3E%C3%AEnchise:22;combinate%3E%3C1a:52;combinate%3E1%E2%80%932a:19;%C3%AEnchise%3E%3C1a:14;%C3%AEnchise%3E1%E2%80%932a:8&title=Ciclul%20de%20via%C8%9B%C4%83%20al%20PR
```

![sankey base](https://x-cmd.com/draw?type=sankey&labels=func%C8%9Bii,combinate,%C3%AEnchise,%3C1a,1%E2%80%932a&links=func%C8%9Bii%3Ecombinate:71;func%C8%9Bii%3E%C3%AEnchise:22;combinate%3E%3C1a:52;combinate%3E1%E2%80%932a:19;%C3%AEnchise%3E%3C1a:14;%C3%AEnchise%3E1%E2%80%932a:8&title=Ciclul%20de%20via%C8%9B%C4%83%20al%20PR)

## Parametri

| Parametri | | |
|---|---|---|
| `labels=` | noduri, separate prin virgule | ✓ |
| `links=` | fluxuri `A>B:valoare`, separate prin ; | ✓ |
| `title=` | titlu | ✗ |
| `unit=` | unitate | ✗ |
| `t=` | familia stilului | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `fund` |
| `pipeline` |

## Capcane

- ≤24 noduri / 60 fluxuri; ciclurile sunt respinse
- fluxurile formează un DAG — totalul se potrivește cu labels
- codează spațiile din titlu ca `%20`
