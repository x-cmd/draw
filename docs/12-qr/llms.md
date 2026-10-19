---
name: 11-qr
description: x-cmd/draw QR code (type=qr). Generate QR for URL / WiFi / vCard / any text. Params: data (content), size (module pixel size), ec (error correction L/M/Q/H, default M). Returned SVG is print/embed-ready.
type: reference
---

# Core Content

core_features:

  - `type=qr` — QR code generator
  - `data=` content (required) — URL, text, WiFi config, vCard, anything
  - `size=` module pixel size (optional)
  - `ec=` error correction L/M/Q/H, default M
  - Returned SVG is print/embed-ready

# Key Information

highlights:

  - **Error correction**: L ~7% / M ~15% / Q ~25% / H ~30% tolerance
  - **Content formats**:
    - URL: `data=https://...`
    - WiFi: `data=WIFI:S:<SSID>;T:<WPA>;P:<password>;;`
    - vCard: full vCard with URL-encoded newlines (`%0A`)
  - **Data must be URL-encoded** — especially `:` `;` `#` `%`
  - **Max content**: ~2953 bytes (version 40 + low EC)
  - **`invert=1`** flips colors (good for dark backgrounds)
  - **Embedded logo**: QR engine treats center as logo area; use EC=H

# Use Cases

use_cases:

  - URL QR codes for print/poster
  - WiFi QR (scan to connect)
  - vCard QR (business card)
  - Plain text QR (notes, references)
  - QR with logo overlay (use EC=H)

# Related Resources

official:
  endpoint: https://x-cmd.com/draw?type=qr
related:
  overview: docs/1-overview/cn.md