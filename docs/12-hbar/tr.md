---
x-title: hbar yatay çubuk — x-cmd/draw
x-desc: Yapay zekâ çağı için SVG grafikler: tek endpoint `/draw?type=. type=hbar.
x-sidebar: draw
x-keywords: draw, hbar, yatay çubuk, svg, chart
---

# hbar yatay çubuk

`GET /draw?type=hbar&...` — grafik çiz

## Örnekler

**base**

```text
https://x-cmd.com/draw?type=hbar&labels=CLI,%C3%A7ekirdek,belgeler,UI&values=42,31,18,9&title=Alana%20g%C3%B6re%20commit%E2%80%99ler
```

![hbar base](https://x-cmd.com/draw?type=hbar&labels=CLI,%C3%A7ekirdek,belgeler,UI&values=42,31,18,9&title=Alana%20g%C3%B6re%20commit%E2%80%99ler)

**opendata**

```text
https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,%C3%A7ekirdek,belgeler,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=Alana%20g%C3%B6re%20commit%E2%80%99ler
```

![hbar opendata](https://x-cmd.com/draw?type=hbar&t=opendata&labels=CLI,%C3%A7ekirdek,belgeler,UI&values=8,6,9,4&ref=7&reflabel=SLA&title=Alana%20g%C3%B6re%20commit%E2%80%99ler)

**xcmd**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd&labels=%C4%B0stanbul,Ankara,%C4%B0zmir&values=68,21,11&title=En%20b%C3%BCy%C3%BCk%20%C5%9Fehirler
```

![hbar xcmd](https://x-cmd.com/draw?type=hbar&t=xcmd&labels=%C4%B0stanbul,Ankara,%C4%B0zmir&values=68,21,11&title=En%20b%C3%BCy%C3%BCk%20%C5%9Fehirler)

**xcmd-issue**

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,%C3%A7ekirdek,belgeler,ci,UI&series=a%C3%A7%C4%B1k:12,8,15,4,9&series=kapal%C4%B1:38,52,20,11,26&title=Alana%20g%C3%B6re%20issue%E2%80%99lar
```

![hbar xcmd-issue](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,%C3%A7ekirdek,belgeler,ci,UI&series=a%C3%A7%C4%B1k:12,8,15,4,9&series=kapal%C4%B1:38,52,20,11,26&title=Alana%20g%C3%B6re%20issue%E2%80%99lar)

**rank**

```text
https://x-cmd.com/draw?type=hbar&t=rank&labels=Pzt,Sal,%C3%87ar&series=2025:80,95,110&series=2026:110,85,120&title=Haftal%C4%B1k%20indirmeler
```

![hbar rank](https://x-cmd.com/draw?type=hbar&t=rank&labels=Pzt,Sal,%C3%87ar&series=2025:80,95,110&series=2026:110,85,120&title=Haftal%C4%B1k%20indirmeler)

## Parametreler

| Parametreler | | |
|---|---|---|
| `labels=` | etiketler, virgülle ayrılmış | ✓ |
| `values=` | değerler, virgülle ayrılmış | ✓ |
| `series=` | yalnızca bazı stiller: 2 seri | ✗ |
| `ref=` | referans çizgisi değeri | ✗ |
| `reflabel=` | referans çizgisi metni | ✗ |
| `t=` | stil ailesi | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `opendata` |
| `xcmd` |
| `xcmd-issue` |
| `rank` |

## Tuzaklar

- ≤30 çubuk, varsayılan tek seri
- iki seri yalnızca `t=xcmd-issue` / `t=rank`
- başlıktaki boşlukları `%20` olarak kodla
