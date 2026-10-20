# draw — Verileri URL’de taşıyan SVG grafikler

> [English](../README.md) | **Türkçe**

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/x-cmd/draw/badge)](https://securityscorecards.dev/viewer/?uri=github.com/x-cmd/draw)

Yapay zekâ çağı için SVG grafikler: tek endpoint `/draw?type=...`, veriler URL’de ve her çıktıda makine tarafından okunabilir `<metadata>`. Stil sistemi bir tasarım spesifikasyonunu izler; her grafik türü için çeşitli varyantlar.

## Önizleme

Tüm veriler URL’nin içinde — tarayıcıda aç, `<img>` ile göm veya README’ye yapıştır: SVG anında çizilir.

### Sankey — PR yaşam döngüsü (`type=sankey&t=pipeline`)

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=%C3%B6zellik,d%C3%BCzeltme,belgeler,di%C4%9Fer,birle%C5%9Ftirilen,kapat%C4%B1lan,reddedilen,%3C1y,1%E2%80%932y,%3E2y&links=%C3%B6zellik%3Ebirle%C5%9Ftirilen:38;%C3%B6zellik%3Ekapat%C4%B1lan:12;%C3%B6zellik%3Ereddedilen:8;d%C3%BCzeltme%3Ebirle%C5%9Ftirilen:33;d%C3%BCzeltme%3Ekapat%C4%B1lan:6;d%C3%BCzeltme%3Ereddedilen:2;belgeler%3Ebirle%C5%9Ftirilen:16;belgeler%3Ekapat%C4%B1lan:4;di%C4%9Fer%3Ebirle%C5%9Ftirilen:5;di%C4%9Fer%3Ekapat%C4%B1lan:6;di%C4%9Fer%3Ereddedilen:6;birle%C5%9Ftirilen%3E%3C1y:52;birle%C5%9Ftirilen%3E1%E2%80%932y:28;birle%C5%9Ftirilen%3E%3E2y:12;kapat%C4%B1lan%3E%3C1y:14;kapat%C4%B1lan%3E1%E2%80%932y:9;kapat%C4%B1lan%3E%3E2y:5;reddedilen%3E%3C1y:9;reddedilen%3E1%E2%80%932y:5;reddedilen%3E%3E2y:2&title=PR%20ya%C5%9Fam%20d%C3%B6ng%C3%BCs%C3%BC&unit=prs
```

![Sankey — PR yaşam döngüsü](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=%C3%B6zellik,d%C3%BCzeltme,belgeler,di%C4%9Fer,birle%C5%9Ftirilen,kapat%C4%B1lan,reddedilen,%3C1y,1%E2%80%932y,%3E2y&links=%C3%B6zellik%3Ebirle%C5%9Ftirilen:38;%C3%B6zellik%3Ekapat%C4%B1lan:12;%C3%B6zellik%3Ereddedilen:8;d%C3%BCzeltme%3Ebirle%C5%9Ftirilen:33;d%C3%BCzeltme%3Ekapat%C4%B1lan:6;d%C3%BCzeltme%3Ereddedilen:2;belgeler%3Ebirle%C5%9Ftirilen:16;belgeler%3Ekapat%C4%B1lan:4;di%C4%9Fer%3Ebirle%C5%9Ftirilen:5;di%C4%9Fer%3Ekapat%C4%B1lan:6;di%C4%9Fer%3Ereddedilen:6;birle%C5%9Ftirilen%3E%3C1y:52;birle%C5%9Ftirilen%3E1%E2%80%932y:28;birle%C5%9Ftirilen%3E%3E2y:12;kapat%C4%B1lan%3E%3C1y:14;kapat%C4%B1lan%3E1%E2%80%932y:9;kapat%C4%B1lan%3E%3E2y:5;reddedilen%3E%3C1y:9;reddedilen%3E1%E2%80%932y:5;reddedilen%3E%3E2y:2&title=PR%20ya%C5%9Fam%20d%C3%B6ng%C3%BCs%C3%BC&unit=prs)

### Hbar — çalışma zamanı verimi (ölçüm) (`type=hbar; draw() ops/s: deno 7238 · node 6553 · bun 4972, Apple Silicon`)

```text
https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs
```

![Hbar — çalışma zamanı verimi (ölçüm)](https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs)

### Radar — üç editör karşılaştırması (`type=radar&t=evil`)

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=ba%C5%9Flang%C4%B1%C3%A7,ekosistem,geni%C5%9Fletilebilirlik,bellek,kolayl%C4%B1k&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Edit%C3%B6r%20kar%C5%9F%C4%B1la%C5%9Ft%C4%B1rmas%C4%B1
```

![Radar — üç editör karşılaştırması](https://x-cmd.com/draw?type=radar&t=evil&labels=ba%C5%9Flang%C4%B1%C3%A7,ekosistem,geni%C5%9Fletilebilirlik,bellek,kolayl%C4%B1k&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Edit%C3%B6r%20kar%C5%9F%C4%B1la%C5%9Ft%C4%B1rmas%C4%B1)

### Kombine — indirme ve büyüme (`type=combo`)

```text
https://x-cmd.com/draw?type=combo&labels=Pzt,Sal,%C3%87ar,Per,Cum,Cmt,Paz&series=%C4%B0ndirme:120,180,150,210,240,200,260&line=B%C3%BCy%C3%BCme:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Haftal%C4%B1k%20indirmeler&unit=dl
```

![Kombine — indirme ve büyüme](https://x-cmd.com/draw?type=combo&labels=Pzt,Sal,%C3%87ar,Per,Cum,Cmt,Paz&series=%C4%B0ndirme:120,180,150,210,240,200,260&line=B%C3%BCy%C3%BCme:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Haftal%C4%B1k%20indirmeler&unit=dl)

### Hbar — açık/kapalı issue (kelebek) (`type=hbar&t=xcmd-issue`)

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,%C3%A7ekirdek,belgeler,ci,UI&series=a%C3%A7%C4%B1k:12,8,15,4,9&series=kapal%C4%B1:38,52,20,11,26&title=Alana%20g%C3%B6re%20issue%E2%80%99lar
```

![Hbar — açık/kapalı issue (kelebek)](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=CLI,%C3%A7ekirdek,belgeler,ci,UI&series=a%C3%A7%C4%B1k:12,8,15,4,9&series=kapal%C4%B1:38,52,20,11,26&title=Alana%20g%C3%B6re%20issue%E2%80%99lar)

### Pasta — en büyük şehirler (`type=pie&t=market-mono`)

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=En%20b%C3%BCy%C3%BCk%20%C5%9Fehirler&unit=mn&labels=%C4%B0stanbul,Ankara,%C4%B0zmir,Bursa&values=15.8,5.8,4.4,2.1
```

![Pasta — en büyük şehirler](https://x-cmd.com/draw?type=pie&t=market-mono&title=En%20b%C3%BCy%C3%BCk%20%C5%9Fehirler&unit=mn&labels=%C4%B0stanbul,Ankara,%C4%B0zmir,Bursa&values=15.8,5.8,4.4,2.1)

## Üç kullanım yolu

**Hosted servis (kurulum yok)** — `https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2`

**npm kütüphanesi + CLI (çevrimdışı, eşzamanlı)** (`npm i -g @x-cmd/draw` / `npx`):

```sh
npm install @x-cmd/draw
```
```ts
import { draw } from '@x-cmd/draw';
const { svg } = draw({ type: 'pie', labels: 'A,B', values: '3,2', t: 'evil', scheme: 'dark' });
// sorgu dizisi de kabul edilir: draw('?type=bar&labels=Pzt,Sal&values=3,5')
// diziler = tekrarlanan parametreler (virgüllü etiketler)
draw({ type: 'bar', labels: ['Q1, 2024', 'Q2'], values: [1, 2] })
```
```sh
draw --type pie --labels "A,B,C" --values "3,2,1" --out pie.svg
draw "?type=hbar&labels=a,b,c&values=3,2,1&t=xcmd"   # çıplak sorgu dizisi
```

**Self-host**:

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve      # yerel Node sunucusu :8787 (demo sayfasıyla)
npm run dev        # wrangler dev
bash scripts/setup.sh   # Cloudflare hesabına tek tıkla dağıtım
```

Ortam değişkenleri (Node): `PORT` (8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (POST kısa bağlantılarını etkinleştirir).

**Deno** — işleme çekirdeği saf, ağ yok — izinsiz sandbox güvenlik sınırdır:

```ts
import { draw } from "jsr:@x-cmd/draw";
const { svg } = draw({ type: "pie", labels: "A,B", values: "3,2" });
```

## Endpoint’ler

**`GET /draw?type=<pie|bar|hbar|line|area|radar|gauge|scatter|combo|sankey|qr>`** — grafik çiz

| type | | |
|---|---|---|
| `pie` | Halka; `donut=0` = dolu pasta<br><br>**<u>≤100 sınıf (>9 → Other)</u>** | <a href="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Dile%20g%C3%B6re%20y%C4%B1ld%C4%B1zlar"><img src="https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Dile%20g%C3%B6re%20y%C4%B1ld%C4%B1zlar" width="360" alt="example"></a> |
| `bar` | Gruplu kolonlar; `stack=1` istifli<br><br>**<u>≤30 grup</u>** | <a href="https://x-cmd.com/draw?type=bar&labels=Pzt,Sal,%C3%87ar&series=dev:12,18,9&series=ci:8,11,6"><img src="https://x-cmd.com/draw?type=bar&labels=Pzt,Sal,%C3%87ar&series=dev:12,18,9&series=ci:8,11,6" width="360" alt="example"></a> |
| `hbar` | Yatay çubuklar (sıralama)<br><br>**<u>≤30 çubuk</u>** | <a href="https://x-cmd.com/draw?type=hbar&labels=CLI,%C3%A7ekirdek,belgeler,UI&values=42,31,18,9&title=Alana%20g%C3%B6re%20commit%E2%80%99ler"><img src="https://x-cmd.com/draw?type=hbar&labels=CLI,%C3%A7ekirdek,belgeler,UI&values=42,31,18,9&title=Alana%20g%C3%B6re%20commit%E2%80%99ler" width="360" alt="example"></a> |
| `line` | Pürüzsüz çizgi + gradyan / çoklu çizgi<br><br>**<u>≤60 nokta</u>** | <a href="https://x-cmd.com/draw?type=line&labels=Oca,%C5%9Eub,Mar,Nis,May,Haz&values=12,19,15,25,22,30&title=Dile%20g%C3%B6re%20y%C4%B1ld%C4%B1zlar"><img src="https://x-cmd.com/draw?type=line&labels=Oca,%C5%9Eub,Mar,Nis,May,Haz&values=12,19,15,25,22,30&title=Dile%20g%C3%B6re%20y%C4%B1ld%C4%B1zlar" width="360" alt="example"></a> |
| `area` | Alan / çoklu alan<br><br>**<u>≤60 nokta</u>** | <a href="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=%C4%B0ndirmeler"><img src="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=%C4%B0ndirmeler" width="360" alt="example"></a> |
| `radar` | Radar<br><br>**<u>3–12 eksen</u>** | <a href="https://x-cmd.com/draw?type=radar&t=evil&labels=ba%C5%9Flang%C4%B1%C3%A7,ekosistem,geni%C5%9Fletilebilirlik,bellek,kolayl%C4%B1k&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Edit%C3%B6r%20kar%C5%9F%C4%B1la%C5%9Ft%C4%B1rmas%C4%B1"><img src="https://x-cmd.com/draw?type=radar&t=evil&labels=ba%C5%9Flang%C4%B1%C3%A7,ekosistem,geni%C5%9Fletilebilirlik,bellek,kolayl%C4%B1k&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Edit%C3%B6r%20kar%C5%9F%C4%B1la%C5%9Ft%C4%B1rmas%C4%B1" width="360" alt="example"></a> |
| `gauge` | Gösterge (240° yay, merkezde değer)<br><br>**<u>value+max; halka ≤8</u>** | <a href="https://x-cmd.com/draw?type=gauge&title=CI%20oran%C4%B1&value=87&max=100"><img src="https://x-cmd.com/draw?type=gauge&title=CI%20oran%C4%B1&value=87&max=100" width="360" alt="example"></a> |
| `scatter` | Saçılım, iki sayısal eksen, negatif ok<br><br>**<u>x=&y=, ≤200 nokta</u>** | <a href="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Gecikme"><img src="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Gecikme" width="360" alt="example"></a> |
| `combo` | Kolon (`series=`) + çizgi (`line=`); 5× farktan itibaren çift eksen<br><br>**<u>≤30 grup, ≤6 seri</u>** | <a href="https://x-cmd.com/draw?type=combo&labels=Pzt,Sal,%C3%87ar,Per,Cum,Cmt,Paz&series=%C4%B0ndirme:120,180,150,210,240,200,260&line=B%C3%BCy%C3%BCme:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Haftal%C4%B1k%20indirmeler&unit=dl"><img src="https://x-cmd.com/draw?type=combo&labels=Pzt,Sal,%C3%87ar,Per,Cum,Cmt,Paz&series=%C4%B0ndirme:120,180,150,210,240,200,260&line=B%C3%BCy%C3%BCme:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Haftal%C4%B1k%20indirmeler&unit=dl" width="360" alt="example"></a> |
| `sankey` | Akış diyagramı (kalınlık = miktar)<br><br>**<u>labels=+links=A>B:30, ≤24 düğüm</u>** | <a href="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=%C3%B6zellik,d%C3%BCzeltme,belgeler,di%C4%9Fer,birle%C5%9Ftirilen,kapat%C4%B1lan,reddedilen,%3C1y,1%E2%80%932y,%3E2y&links=%C3%B6zellik%3Ebirle%C5%9Ftirilen:38;%C3%B6zellik%3Ekapat%C4%B1lan:12;%C3%B6zellik%3Ereddedilen:8;d%C3%BCzeltme%3Ebirle%C5%9Ftirilen:33;d%C3%BCzeltme%3Ekapat%C4%B1lan:6;d%C3%BCzeltme%3Ereddedilen:2;belgeler%3Ebirle%C5%9Ftirilen:16;belgeler%3Ekapat%C4%B1lan:4;di%C4%9Fer%3Ebirle%C5%9Ftirilen:5;di%C4%9Fer%3Ekapat%C4%B1lan:6;di%C4%9Fer%3Ereddedilen:6;birle%C5%9Ftirilen%3E%3C1y:52;birle%C5%9Ftirilen%3E1%E2%80%932y:28;birle%C5%9Ftirilen%3E%3E2y:12;kapat%C4%B1lan%3E%3C1y:14;kapat%C4%B1lan%3E1%E2%80%932y:9;kapat%C4%B1lan%3E%3E2y:5;reddedilen%3E%3C1y:9;reddedilen%3E1%E2%80%932y:5;reddedilen%3E%3E2y:2&title=PR%20ya%C5%9Fam%20d%C3%B6ng%C3%BCs%C3%BC&unit=prs"><img src="https://x-cmd.com/draw?type=sankey&t=pipeline&labels=%C3%B6zellik,d%C3%BCzeltme,belgeler,di%C4%9Fer,birle%C5%9Ftirilen,kapat%C4%B1lan,reddedilen,%3C1y,1%E2%80%932y,%3E2y&links=%C3%B6zellik%3Ebirle%C5%9Ftirilen:38;%C3%B6zellik%3Ekapat%C4%B1lan:12;%C3%B6zellik%3Ereddedilen:8;d%C3%BCzeltme%3Ebirle%C5%9Ftirilen:33;d%C3%BCzeltme%3Ekapat%C4%B1lan:6;d%C3%BCzeltme%3Ereddedilen:2;belgeler%3Ebirle%C5%9Ftirilen:16;belgeler%3Ekapat%C4%B1lan:4;di%C4%9Fer%3Ebirle%C5%9Ftirilen:5;di%C4%9Fer%3Ekapat%C4%B1lan:6;di%C4%9Fer%3Ereddedilen:6;birle%C5%9Ftirilen%3E%3C1y:52;birle%C5%9Ftirilen%3E1%E2%80%932y:28;birle%C5%9Ftirilen%3E%3E2y:12;kapat%C4%B1lan%3E%3C1y:14;kapat%C4%B1lan%3E1%E2%80%932y:9;kapat%C4%B1lan%3E%3E2y:5;reddedilen%3E%3C1y:9;reddedilen%3E1%E2%80%932y:5;reddedilen%3E%3E2y:2&title=PR%20ya%C5%9Fam%20d%C3%B6ng%C3%BCs%C3%BC&unit=prs" width="360" alt="example"></a> |
| `qr` | QR kod<br><br>**<u>d≤1000 karakter, fg/bg, title/unit</u>** | <a href="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=tarat"><img src="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=tarat" width="360" alt="example"></a> |

**`GET /draw`** — demo sayfası · **`POST /draw?type=...`** — JSON/CSV gövdesi kalıcı kısa bağlantı üretir · **`GET /draw/c/<hash>`** — kısa bağlantı çizimi (immutable)

## Stiller (`?t=`)

| type | |
|---|---|
| `pie` | opendata (varsayılan) · evil · evil-mono · market-mono · progress · revenue |
| `bar` | evil (varsayılan) · base · grid |
| `hbar` | base (varsayılan) · opendata (ref=) · xcmd · xcmd-issue · rank |
| `line` | shadcn (varsayılan) · evil · evil-glow · evil-mono · opendata |
| `area` | evil (varsayılan) · star · opendata · pixel · polka |
| `radar` | base (varsayılan) · evil · xcmd |
| `sankey` | base (varsayılan) · fund · pipeline |
| `gauge` | base (varsayılan) · gradient · reliability |
| `scatter/combo/qr` | base (combo’da evil de var) |

## Veri geçirme

```text
https://x-cmd.com/draw?type=pie&title=Dile%20g%C3%B6re%20y%C4%B1ld%C4%B1zlar&labels=TypeScript,Python,Go&values=4821,2312,980
```

Virgüllü etiketler: parametreyi tekrarla (`labels=Q1, 2024&labels=Q2`). Karmaşık veri: `?d=` + URL kodlu JSON:

```json
{"title":"...","data":[{"label":"A","value":1}]}
```

## Kısa bağlantılar

POST, içerik adresli kalıcı bir kısa bağlantı üretir (depo olarak GitHub):

- aynı veri → aynı hash (idempotent, tekilleştirme)
- dakikada 30 istek/IP sınırı
- genel depo — hassas veri yok

## Sürümleme

- `v` yok: en yeni sürüm, 300 sn önbellek
- `v=N`: sabit sürüm, 1 gün önbellek
- `immutable` yalnızca `/c/<hash>`

## YZ-dostu

Her SVG bir JSON gömer: `{generator, template, version, spec}` — veri ve parametreler doğrudan gider-döner; metin gerçek `<text>`.

## Tek adımda self-host

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

Betik klonlar, wrangler’ı oturumlar, dağıtır ve `*.workers.dev` URL’ni yazdırır. Kısa bağlantılar (POST) `DATA_REPO` + `GITHUB_TOKEN` ile açılır.

## Geliştirme

```sh
npm install
npm run dev      # wrangler dev
npm test         # vitest (120)
npm run check    # tsc ×3
npm run build    # dist/
```

## Lisans

Kod Apache-2.0; fontlar OFL — [LICENSE](../LICENSE) · Tam dokümantasyon: [README (EN)](../README.md)
