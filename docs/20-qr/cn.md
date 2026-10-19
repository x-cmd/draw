---
x-title: qr 二维码 —— URL / WiFi / 联系人
x-desc: x-cmd/draw `type=qr` 用法速查。生成 URL / WiFi / 联系人 / 任意文本的二维码 SVG。参数：`data=` 内容（URL / 文本 / WiFi / vCard），`size=` 二维码大小，`ec=` 纠错级别 (L/M/Q/H)。
x-sidebar: draw 二维码
x-keywords: qr code, 二维码, draw, svg, wifi qr, vcard qr
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw qr 二维码'
      inLanguage: 'zh-CN'
      about: 'x-cmd/draw 二维码'
---

# qr 二维码 —— URL / WiFi / 联系人

## 示例（URL 即所得，点击图片放大）

**URL（扫码直达）**

```text
https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=scan%20me
```

![URL（扫码直达）](https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=scan%20me)

**WiFi 配置（手机扫就连）**

```text
https://x-cmd.com/draw?type=qr&d=WIFI:S:MyWiFi;T:WPA;P:password123;;&title=wifi
```

![WiFi 配置（手机扫就连）](https://x-cmd.com/draw?type=qr&d=WIFI:S:MyWiFi;T:WPA;P:password123;;&title=wifi)

**vCard 联系人**

```text
https://x-cmd.com/draw?type=qr&d=BEGIN:VCARD%0AVERSION:3.0%0AFN:Alice%0AORG:x-cmd%0AEND:VCARD&title=contact
```

![vCard 联系人](https://x-cmd.com/draw?type=qr&d=BEGIN:VCARD%0AVERSION:3.0%0AFN:Alice%0AORG:x-cmd%0AEND:VCARD&title=contact)

**普通文本**

```text
https://x-cmd.com/draw?type=qr&d=Hello%20from%20x-cmd&title=hello
```

![普通文本](https://x-cmd.com/draw?type=qr&d=Hello%20from%20x-cmd&title=hello)

**配色（fg/bg + 标注）**

```text
https://x-cmd.com/draw?type=qr&d=https://x-cmd.com&fg=%236366f1&bg=%230f0f12&title=x-cmd&unit=docs
```

![配色（fg/bg + 标注）](https://x-cmd.com/draw?type=qr&d=https://x-cmd.com&fg=%236366f1&bg=%230f0f12&title=x-cmd&unit=docs)

生成任何内容（URL、文本、WiFi 配置、vCard）的二维码。返回的 SVG 可以直接 print / embed。

---

## 参数

| 参数 | 含义 | 默认 |
| --- | --- | --- |
| `data=` | 内容（必填） | — |
| `size=` | QR 模块像素大小 | — |
| `ec=` | 纠错级别 L/M/Q/H | M |

纠错级别决定二维码损坏多少仍可识别：L ~7% / M ~15% / Q ~25% / H ~30%。

---



---

## 内容格式

### URL
直接传：`data=https://...`

### WiFi
```
WIFI:S:<SSID>;T:<WPA|WEP|>;H:<true|false|>;P:<password>;;
```

### vCard
完整 vCard 格式（注意 URL-encode 换行 `\n%0A`）。

---

## 踩坑

- **内容长度**：QR 标准上限 ~2953 字节（版本 40 + 低纠错），URL-encode 后中文也只占 3 字节/字符
- **`data=` 必须 URL-encode**：特别是 `:`、`;`、`#`、`%`
- **暗色 QR**：默认黑底白图案；可调 `invert=1` 反色（适合深色背景）
- **嵌入 logo**：把 logo 放在 SVG 中央会被 QR 引擎自动识别为"中间 logo"；纠错级别建议 H