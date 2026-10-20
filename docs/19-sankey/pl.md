---
x-title: sankey sankey — x-cmd/draw
x-desc: Wykresy SVG dla ery AI: jeden endpoint `/draw?type=. type=sankey.
x-sidebar: draw
x-keywords: draw, sankey, sankey, svg, chart
---

# sankey sankey

`GET /draw?type=sankey&...` — wyrenderować wykres

## Przykłady

**pipeline**

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=ficzery,fixy,dokumentacja,inne,scalone,zamkni%C4%99te,odrzucone,%3C1r,1%E2%80%932r,%3E2r&links=ficzery%3Escalone:38;ficzery%3Ezamkni%C4%99te:12;ficzery%3Eodrzucone:8;fixy%3Escalone:33;fixy%3Ezamkni%C4%99te:6;fixy%3Eodrzucone:2;dokumentacja%3Escalone:16;dokumentacja%3Ezamkni%C4%99te:4;inne%3Escalone:5;inne%3Ezamkni%C4%99te:6;inne%3Eodrzucone:6;scalone%3E%3C1r:52;scalone%3E1%E2%80%932r:28;scalone%3E%3E2r:12;zamkni%C4%99te%3E%3C1r:14;zamkni%C4%99te%3E1%E2%80%932r:9;zamkni%C4%99te%3E%3E2r:5;odrzucone%3E%3C1r:9;odrzucone%3E1%E2%80%932r:5;odrzucone%3E%3E2r:2&title=Cykl%20%C5%BCycia%20PR&unit=prs
```

![sankey pipeline](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=ficzery,fixy,dokumentacja,inne,scalone,zamkni%C4%99te,odrzucone,%3C1r,1%E2%80%932r,%3E2r&links=ficzery%3Escalone:38;ficzery%3Ezamkni%C4%99te:12;ficzery%3Eodrzucone:8;fixy%3Escalone:33;fixy%3Ezamkni%C4%99te:6;fixy%3Eodrzucone:2;dokumentacja%3Escalone:16;dokumentacja%3Ezamkni%C4%99te:4;inne%3Escalone:5;inne%3Ezamkni%C4%99te:6;inne%3Eodrzucone:6;scalone%3E%3C1r:52;scalone%3E1%E2%80%932r:28;scalone%3E%3E2r:12;zamkni%C4%99te%3E%3C1r:14;zamkni%C4%99te%3E1%E2%80%932r:9;zamkni%C4%99te%3E%3E2r:5;odrzucone%3E%3C1r:9;odrzucone%3E1%E2%80%932r:5;odrzucone%3E%3E2r:2&title=Cykl%20%C5%BCycia%20PR&unit=prs)

**fund**

```text
https://x-cmd.com/draw?type=sankey&t=fund&labels=ficzery,fixy,scalone,zamkni%C4%99te,%3C1r,1%E2%80%932r&links=ficzery%3Escalone:50;ficzery%3Ezamkni%C4%99te:20;fixy%3Escalone:30;fixy%3Ezamkni%C4%99te:10;scalone%3E%3C1r:52;scalone%3E1%E2%80%932r:28;zamkni%C4%99te%3E%3C1r:14;zamkni%C4%99te%3E1%E2%80%932r:9&title=Cykl%20%C5%BCycia%20PR
```

![sankey fund](https://x-cmd.com/draw?type=sankey&t=fund&labels=ficzery,fixy,scalone,zamkni%C4%99te,%3C1r,1%E2%80%932r&links=ficzery%3Escalone:50;ficzery%3Ezamkni%C4%99te:20;fixy%3Escalone:30;fixy%3Ezamkni%C4%99te:10;scalone%3E%3C1r:52;scalone%3E1%E2%80%932r:28;zamkni%C4%99te%3E%3C1r:14;zamkni%C4%99te%3E1%E2%80%932r:9&title=Cykl%20%C5%BCycia%20PR)

**base**

```text
https://x-cmd.com/draw?type=sankey&labels=ficzery,scalone,zamkni%C4%99te,%3C1r,1%E2%80%932r&links=ficzery%3Escalone:71;ficzery%3Ezamkni%C4%99te:22;scalone%3E%3C1r:52;scalone%3E1%E2%80%932r:19;zamkni%C4%99te%3E%3C1r:14;zamkni%C4%99te%3E1%E2%80%932r:8&title=Cykl%20%C5%BCycia%20PR
```

![sankey base](https://x-cmd.com/draw?type=sankey&labels=ficzery,scalone,zamkni%C4%99te,%3C1r,1%E2%80%932r&links=ficzery%3Escalone:71;ficzery%3Ezamkni%C4%99te:22;scalone%3E%3C1r:52;scalone%3E1%E2%80%932r:19;zamkni%C4%99te%3E%3C1r:14;zamkni%C4%99te%3E1%E2%80%932r:8&title=Cykl%20%C5%BCycia%20PR)

## Parametry

| Parametry | | |
|---|---|---|
| `labels=` | węzły, oddzielone przecinkami | ✓ |
| `links=` | przepływy `A>B:wartość`, oddzielone ; | ✓ |
| `title=` | tytuł | ✗ |
| `unit=` | jednostka | ✗ |
| `t=` | rodzina stylu | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `fund` |
| `pipeline` |

## Pułapki

- ≤24 węzłów / 60 przepływów; cykle odrzucane
- przepływy tworzą DAG — suma zgadza się z labels
- spacje w tytule koduj jako `%20`
