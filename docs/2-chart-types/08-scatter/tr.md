---
x-title: scatter saçılım — x-cmd/draw
x-desc: Yapay zekâ çağı için SVG grafikler: tek endpoint `/draw?type=. type=scatter.
x-sidebar: draw
x-keywords: draw, scatter, saçılım, svg, chart
---

# scatter saçılım

`GET /draw?type=scatter&...` — grafik çiz

## Örnekler

**base**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Gecikme
```

![scatter base](https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Gecikme)

**base neg**

```text
https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=Gecikme
```

![scatter base neg](https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=Gecikme)

**base num**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=Gecikme
```

![scatter base num](https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=Gecikme)

## Parametreler

| Parametreler | | |
|---|---|---|
| `x=` | x değerleri | ✓ |
| `y=` | y değerleri | ✓ |
| `title=` | başlık | ✗ |
| `num=` | değer işaretleri: all/peak/none | ✗ |
| `t=` | stil ailesi | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## Tuzaklar

- seri başına ≤200 nokta; negatif olur
- başlıktaki boşlukları `%20` olarak kodla
