---
x-title: gauge gösterge — x-cmd/draw
x-desc: Yapay zekâ çağı için SVG grafikler: tek endpoint `/draw?type=. type=gauge.
x-sidebar: draw
x-keywords: draw, gauge, gösterge, svg, chart
---

# gauge gösterge

`GET /draw?type=gauge&...` — grafik çiz

## Örnekler

**base**

```text
https://x-cmd.com/draw?type=gauge&title=CI%20oran%C4%B1&value=87&max=100
```

![gauge base](https://x-cmd.com/draw?type=gauge&title=CI%20oran%C4%B1&value=87&max=100)

**gradient**

```text
https://x-cmd.com/draw?type=gauge&t=gradient&title=CI%20oran%C4%B1&value=87&max=100
```

![gauge gradient](https://x-cmd.com/draw?type=gauge&t=gradient&title=CI%20oran%C4%B1&value=87&max=100)

**reliability**

```text
https://x-cmd.com/draw?type=gauge&t=reliability&title=CI%20oran%C4%B1&value=99.9&max=100
```

![gauge reliability](https://x-cmd.com/draw?type=gauge&t=reliability&title=CI%20oran%C4%B1&value=99.9&max=100)

## Parametreler

| Parametreler | | |
|---|---|---|
| `value=` | mevcut değer | ✓ |
| `max=` | maksimum (varsayılan 100) | ✗ |
| `labels=` | halka etiketleri (çok halkalı) | ✗ |
| `values=` | halka değerleri (yüzde) | ✗ |
| `title=` | başlık | ✗ |
| `t=` | stil ailesi | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `gradient` |
| `reliability` |

## Tuzaklar

- grafik başına bir değer; daha fazlası → combo/line
- başlıktaki boşlukları `%20` olarak kodla
