---
x-title: sankey sankey — x-cmd/draw
x-desc: Yapay zekâ çağı için SVG grafikler: tek endpoint `/draw?type=. type=sankey.
x-sidebar: draw
x-keywords: draw, sankey, sankey, svg, chart
---

# sankey sankey

`GET /draw?type=sankey&...` — grafik çiz

## Örnekler

**pipeline**

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=%C3%B6zellik,d%C3%BCzeltme,belgeler,di%C4%9Fer,birle%C5%9Ftirilen,kapat%C4%B1lan,reddedilen,%3C1y,1%E2%80%932y,%3E2y&links=%C3%B6zellik%3Ebirle%C5%9Ftirilen:38;%C3%B6zellik%3Ekapat%C4%B1lan:12;%C3%B6zellik%3Ereddedilen:8;d%C3%BCzeltme%3Ebirle%C5%9Ftirilen:33;d%C3%BCzeltme%3Ekapat%C4%B1lan:6;d%C3%BCzeltme%3Ereddedilen:2;belgeler%3Ebirle%C5%9Ftirilen:16;belgeler%3Ekapat%C4%B1lan:4;di%C4%9Fer%3Ebirle%C5%9Ftirilen:5;di%C4%9Fer%3Ekapat%C4%B1lan:6;di%C4%9Fer%3Ereddedilen:6;birle%C5%9Ftirilen%3E%3C1y:52;birle%C5%9Ftirilen%3E1%E2%80%932y:28;birle%C5%9Ftirilen%3E%3E2y:12;kapat%C4%B1lan%3E%3C1y:14;kapat%C4%B1lan%3E1%E2%80%932y:9;kapat%C4%B1lan%3E%3E2y:5;reddedilen%3E%3C1y:9;reddedilen%3E1%E2%80%932y:5;reddedilen%3E%3E2y:2&title=PR%20ya%C5%9Fam%20d%C3%B6ng%C3%BCs%C3%BC&unit=prs
```

![sankey pipeline](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=%C3%B6zellik,d%C3%BCzeltme,belgeler,di%C4%9Fer,birle%C5%9Ftirilen,kapat%C4%B1lan,reddedilen,%3C1y,1%E2%80%932y,%3E2y&links=%C3%B6zellik%3Ebirle%C5%9Ftirilen:38;%C3%B6zellik%3Ekapat%C4%B1lan:12;%C3%B6zellik%3Ereddedilen:8;d%C3%BCzeltme%3Ebirle%C5%9Ftirilen:33;d%C3%BCzeltme%3Ekapat%C4%B1lan:6;d%C3%BCzeltme%3Ereddedilen:2;belgeler%3Ebirle%C5%9Ftirilen:16;belgeler%3Ekapat%C4%B1lan:4;di%C4%9Fer%3Ebirle%C5%9Ftirilen:5;di%C4%9Fer%3Ekapat%C4%B1lan:6;di%C4%9Fer%3Ereddedilen:6;birle%C5%9Ftirilen%3E%3C1y:52;birle%C5%9Ftirilen%3E1%E2%80%932y:28;birle%C5%9Ftirilen%3E%3E2y:12;kapat%C4%B1lan%3E%3C1y:14;kapat%C4%B1lan%3E1%E2%80%932y:9;kapat%C4%B1lan%3E%3E2y:5;reddedilen%3E%3C1y:9;reddedilen%3E1%E2%80%932y:5;reddedilen%3E%3E2y:2&title=PR%20ya%C5%9Fam%20d%C3%B6ng%C3%BCs%C3%BC&unit=prs)

**fund**

```text
https://x-cmd.com/draw?type=sankey&t=fund&labels=%C3%B6zellik,d%C3%BCzeltme,birle%C5%9Ftirilen,kapat%C4%B1lan,%3C1y,1%E2%80%932y&links=%C3%B6zellik%3Ebirle%C5%9Ftirilen:50;%C3%B6zellik%3Ekapat%C4%B1lan:20;d%C3%BCzeltme%3Ebirle%C5%9Ftirilen:30;d%C3%BCzeltme%3Ekapat%C4%B1lan:10;birle%C5%9Ftirilen%3E%3C1y:52;birle%C5%9Ftirilen%3E1%E2%80%932y:28;kapat%C4%B1lan%3E%3C1y:14;kapat%C4%B1lan%3E1%E2%80%932y:9&title=PR%20ya%C5%9Fam%20d%C3%B6ng%C3%BCs%C3%BC
```

![sankey fund](https://x-cmd.com/draw?type=sankey&t=fund&labels=%C3%B6zellik,d%C3%BCzeltme,birle%C5%9Ftirilen,kapat%C4%B1lan,%3C1y,1%E2%80%932y&links=%C3%B6zellik%3Ebirle%C5%9Ftirilen:50;%C3%B6zellik%3Ekapat%C4%B1lan:20;d%C3%BCzeltme%3Ebirle%C5%9Ftirilen:30;d%C3%BCzeltme%3Ekapat%C4%B1lan:10;birle%C5%9Ftirilen%3E%3C1y:52;birle%C5%9Ftirilen%3E1%E2%80%932y:28;kapat%C4%B1lan%3E%3C1y:14;kapat%C4%B1lan%3E1%E2%80%932y:9&title=PR%20ya%C5%9Fam%20d%C3%B6ng%C3%BCs%C3%BC)

**base**

```text
https://x-cmd.com/draw?type=sankey&labels=%C3%B6zellik,birle%C5%9Ftirilen,kapat%C4%B1lan,%3C1y,1%E2%80%932y&links=%C3%B6zellik%3Ebirle%C5%9Ftirilen:71;%C3%B6zellik%3Ekapat%C4%B1lan:22;birle%C5%9Ftirilen%3E%3C1y:52;birle%C5%9Ftirilen%3E1%E2%80%932y:19;kapat%C4%B1lan%3E%3C1y:14;kapat%C4%B1lan%3E1%E2%80%932y:8&title=PR%20ya%C5%9Fam%20d%C3%B6ng%C3%BCs%C3%BC
```

![sankey base](https://x-cmd.com/draw?type=sankey&labels=%C3%B6zellik,birle%C5%9Ftirilen,kapat%C4%B1lan,%3C1y,1%E2%80%932y&links=%C3%B6zellik%3Ebirle%C5%9Ftirilen:71;%C3%B6zellik%3Ekapat%C4%B1lan:22;birle%C5%9Ftirilen%3E%3C1y:52;birle%C5%9Ftirilen%3E1%E2%80%932y:19;kapat%C4%B1lan%3E%3C1y:14;kapat%C4%B1lan%3E1%E2%80%932y:8&title=PR%20ya%C5%9Fam%20d%C3%B6ng%C3%BCs%C3%BC)

## Parametreler

| Parametreler | | |
|---|---|---|
| `labels=` | düğümler, virgülle ayrılmış | ✓ |
| `links=` | akışlar `A>B:değer`, ; ile ayrılmış | ✓ |
| `title=` | başlık | ✗ |
| `unit=` | birim | ✗ |
| `t=` | stil ailesi | ✗ |

## `t=`

| | |
|---|---|
| `base` |
| `fund` |
| `pipeline` |

## Tuzaklar

- ≤24 düğüm / 60 akış; döngüler reddedilir
- akışlar DAG oluşturur — toplam labels ile uyuşur
- başlıktaki boşlukları `%20` olarak kodla
