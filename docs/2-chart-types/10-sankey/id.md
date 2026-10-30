---
x-title: sankey sankey — x-cmd/draw
x-desc: Grafik SVG untuk era AI: satu endpoint `/draw?type=. type=sankey.
x-sidebar: draw
x-keywords: draw, sankey, sankey, svg, chart
---

# sankey sankey

`GET /draw?type=sankey&...` — render grafik

## Contoh

**pipeline**

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=fitur,fix,dokumentasi,lainnya,digabungkan,ditutup,ditolak,%3C1th,1%E2%80%932th,%3E2th&links=fitur%3Edigabungkan:38;fitur%3Editutup:12;fitur%3Editolak:8;fix%3Edigabungkan:33;fix%3Editutup:6;fix%3Editolak:2;dokumentasi%3Edigabungkan:16;dokumentasi%3Editutup:4;lainnya%3Edigabungkan:5;lainnya%3Editutup:6;lainnya%3Editolak:6;digabungkan%3E%3C1th:52;digabungkan%3E1%E2%80%932th:28;digabungkan%3E%3E2th:12;ditutup%3E%3C1th:14;ditutup%3E1%E2%80%932th:9;ditutup%3E%3E2th:5;ditolak%3E%3C1th:9;ditolak%3E1%E2%80%932th:5;ditolak%3E%3E2th:2&title=Siklus%20hidup%20PR&unit=prs
```

![sankey pipeline](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=fitur,fix,dokumentasi,lainnya,digabungkan,ditutup,ditolak,%3C1th,1%E2%80%932th,%3E2th&links=fitur%3Edigabungkan:38;fitur%3Editutup:12;fitur%3Editolak:8;fix%3Edigabungkan:33;fix%3Editutup:6;fix%3Editolak:2;dokumentasi%3Edigabungkan:16;dokumentasi%3Editutup:4;lainnya%3Edigabungkan:5;lainnya%3Editutup:6;lainnya%3Editolak:6;digabungkan%3E%3C1th:52;digabungkan%3E1%E2%80%932th:28;digabungkan%3E%3E2th:12;ditutup%3E%3C1th:14;ditutup%3E1%E2%80%932th:9;ditutup%3E%3E2th:5;ditolak%3E%3C1th:9;ditolak%3E1%E2%80%932th:5;ditolak%3E%3E2th:2&title=Siklus%20hidup%20PR&unit=prs)

**fund**

```text
https://x-cmd.com/draw?type=sankey&t=fund&labels=fitur,fix,digabungkan,ditutup,%3C1th,1%E2%80%932th&links=fitur%3Edigabungkan:50;fitur%3Editutup:20;fix%3Edigabungkan:30;fix%3Editutup:10;digabungkan%3E%3C1th:52;digabungkan%3E1%E2%80%932th:28;ditutup%3E%3C1th:14;ditutup%3E1%E2%80%932th:9&title=Siklus%20hidup%20PR
```

![sankey fund](https://x-cmd.com/draw?type=sankey&t=fund&labels=fitur,fix,digabungkan,ditutup,%3C1th,1%E2%80%932th&links=fitur%3Edigabungkan:50;fitur%3Editutup:20;fix%3Edigabungkan:30;fix%3Editutup:10;digabungkan%3E%3C1th:52;digabungkan%3E1%E2%80%932th:28;ditutup%3E%3C1th:14;ditutup%3E1%E2%80%932th:9&title=Siklus%20hidup%20PR)

**base**

```text
https://x-cmd.com/draw?type=sankey&labels=fitur,digabungkan,ditutup,%3C1th,1%E2%80%932th&links=fitur%3Edigabungkan:71;fitur%3Editutup:22;digabungkan%3E%3C1th:52;digabungkan%3E1%E2%80%932th:19;ditutup%3E%3C1th:14;ditutup%3E1%E2%80%932th:8&title=Siklus%20hidup%20PR
```

![sankey base](https://x-cmd.com/draw?type=sankey&labels=fitur,digabungkan,ditutup,%3C1th,1%E2%80%932th&links=fitur%3Edigabungkan:71;fitur%3Editutup:22;digabungkan%3E%3C1th:52;digabungkan%3E1%E2%80%932th:19;ditutup%3E%3C1th:14;ditutup%3E1%E2%80%932th:8&title=Siklus%20hidup%20PR)

## Parameter

| Parameter | | |
|---|---|---|
| `labels=` | simpul, dipisah koma | ✓ |
| `links=` | aliran `A>nilai`, dipisah ; | ✓ |
| `title=` | judul | ✗ |
| `unit=` | satuan | ✗ |
| `t=` | keluarga gaya | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `fund` |
| `pipeline` |

## Jebakan

- ≤24 simpul / 60 aliran; siklus ditolak
- aliran membentuk DAG — total cocok dengan labels
- enkode spasi pada judul jadi `%20`
