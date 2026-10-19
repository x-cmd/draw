---
x-title: QR code — URL / WiFi / contact card
x-desc: x-cmd/draw `type=qr` quick reference. Generate QR codes for URL / WiFi / vCard / any text. Params: `data=` content (URL / text / WiFi / vCard), `size=` module pixel size, `ec=` error correction level (L/M/Q/H).
x-sidebar: draw QR code
x-keywords: qr code, qr, draw, svg, wifi qr, vcard qr
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw QR code'
      inLanguage: 'en'
      about: 'x-cmd/draw QR code'
---

# QR code — URL / WiFi / contact card

Generate QR codes for any content (URL, text, WiFi config, vCard). Returned SVG is print/embed-ready.

---

## Parameters

| param | meaning | default |
| --- | --- | --- |
| `data=` | content (required) | — |
| `size=` | QR module pixel size | — |
| `ec=` | error correction L/M/Q/H | M |

Error correction = how much of QR can be damaged and still read: L ~7% / M ~15% / Q ~25% / H ~30%.

---

## Examples

```sh
# URL
curl "https://x-cmd.com/draw?type=qr&data=https://x-cmd.com/draw"

# WiFi (phone scans → connects)
curl "https://x-cmd.com/draw?type=qr&data=WIFI:S:MyWiFi;T:WPA;P:password123;;"

# vCard
curl "https://x-cmd.com/draw?type=qr&data=BEGIN:VCARD%0AVERSION:3.0%0AFN:Alice%0AORG:x-cmd%0AEMAIL:alice@example.com%0AEND:VCARD"

# Plain text
curl "https://x-cmd.com/draw?type=qr&data=Hello%20from%20x-cmd"

# High error correction (logo in middle still scannable)
curl "https://x-cmd.com/draw?type=qr&data=https://x-cmd.com&ec=H&size=10"
```

---

## Content formats

### URL
Direct: `data=https://...`

### WiFi
```
WIFI:S:<SSID>;T:<WPA|WEP|>;H:<true|false|>;P:<password>;;
```

### vCard
Full vCard format (URL-encode newlines as `\n%0A`).

---

## Pitfalls

- **Content length**: QR max ~2953 bytes (version 40 + low EC); URL-encoded Chinese counts 3 bytes/char
- **`data=` must be URL-encoded**: especially `:` `;` `#` `%`
- **Dark theme QR**: default is dark on light; `invert=1` flips (good for dark backgrounds)
- **Embedded logo**: QR engine treats the SVG center as "logo area" automatically; EC level H