---
x-title: 生化 —— SMILES 一串,分子一张
x-desc: 'x-cmd/draw 生化(`/draw/chem`):SMILES 化学式 → 分子结构图,smilesdrawer 排版(数据随服务分发,不用外部 API)。参数:`smiles=`(必填,别名 `s=`)、`w=`(120–1600)、`h=`(120–1200)、`theme=dark|light`。例:CCO 乙醇、阿司匹林、扑热息痛。'
x-sidebar: draw 生化
x-keywords: 化学结构, 分子图, SMILES, 生化, draw, svg, chemistry, molecule, 阿司匹林, 乙醇
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 生化'
      inLanguage: 'cn'
      about: 'x-cmd/draw 02-chemistry'
---

# 生化 —— SMILES 一串,分子一张

给一个 SMILES 化学式,拿回一张分子结构图:`/draw/chem?smiles=CCO` 就是乙醇。
排版用 smilesdrawer(MIT),图随服务画 —— 不用外部化学绘图 API,
数据(那份约 200KB 的排版库)也是真来这个端点才动态载入,别的端点不付这份成本。

配两套站上的色板:暗色(默认)垫一张深色卡,亮色留白。原子上带元素配色
(氧红、氮蓝、硫黄……),explore 页里还能点选原子看名字。

## 参数

| 参数 | 意思 | 默认 |
|---|---|---|
| `smiles=` | SMILES 化学式(必填;别名 `s=`) | — |
| `w=` / `h=` | 画布尺寸(w:120–1600;h:120–1200) | 400×360 |
| `theme=` | `dark` / `light` | dark |

`scheme=light` 等价于 `theme=light`。

## 例子

### 乙醇

```text
https://x-cmd.com/draw/chem?smiles=CCO&w=560&h=420
```

[![乙醇](https://x-cmd.com/draw/chem?smiles=CCO&w=560&h=420)](https://x-cmd.com/draw/explore/chem?smiles=CCO&w=560&h=420)

### 阿司匹林

```text
https://x-cmd.com/draw/chem?smiles=CC%28%3DO%29Oc1ccccc1C%28%3DO%29O&w=560&h=420
```

[![阿司匹林](https://x-cmd.com/draw/chem?smiles=CC%28%3DO%29Oc1ccccc1C%28%3DO%29O&w=560&h=420)](https://x-cmd.com/draw/explore/chem?smiles=CC%28%3DO%29Oc1ccccc1C%28%3DO%29O&w=560&h=420)

### 扑热息痛

```text
https://x-cmd.com/draw/chem?smiles=CC%28%3DO%29NC1%3DCC%3DC(C%3DC1)O&w=560&h=420
```

[![扑热息痛](https://x-cmd.com/draw/chem?smiles=CC%28%3DO%29NC1%3DCC%3DC(C%3DC1)O&w=560&h=420)](https://x-cmd.com/draw/explore/chem?smiles=CC%28%3DO%29NC1%3DCC%3DC(C%3DC1)O&w=560&h=420)

### 更多分子(图库直链)

[苯](https://x-cmd.com/draw/chem?smiles=c1ccccc1) ·
[醋酸](https://x-cmd.com/draw/chem?smiles=CC%28%3DO%29O) ·
[咖啡因](https://x-cmd.com/draw/chem?smiles=Cn1cnc2c1c%28%3DO%29n%28C%29c%28%3DO%29n2C) ·
[布洛芬](https://x-cmd.com/draw/chem?smiles=CC%28C%29Cc1ccc%28cc1%29C%28C%29C%28%3DO%29O) ·
[尼古丁](https://x-cmd.com/draw/chem?smiles=CN1CCCC1c2cccnc2) ·
[多巴胺](https://x-cmd.com/draw/chem?smiles=NCCc1ccc%28O%29c%28O%29c1) ·
[葡萄糖](https://x-cmd.com/draw/chem?smiles=OC%5BC%40H%5D1OC%28O%29%5BC%40H%5D%28O%29%5BC%40%40H%5D%28O%29%5BC%40%40H%5D1O) ·
[蔗糖](https://x-cmd.com/draw/chem?smiles=OCC1OC%28CO%29C%28O%29C%28O%29C1O) ·
[青霉素](https://x-cmd.com/draw/chem?smiles=CC1%28C%29S%5BC%40%40H%5D2%5BC%40H%5D%28NC%28%3DO%29Cc3ccccc3%29C%28%3DO%29N2%5BC%40H%5D1C%28%3DO%29O) ·
[胆固醇](https://x-cmd.com/draw/chem?smiles=CC%28C%29CCCC%28C%29C1CCC2C3CC%3DC4CC%28O%29CCC4%28C%29C3CCC12C) ·
[三磷酸腺苷(ATP)](https://x-cmd.com/draw/chem?smiles=NC1%3DNC%3DNC2%3DC1N%3DCN2%5BC%40%40H%5D1O%5BC%40H%5D%28COP%28%3DO%29%28O%29OP%28%3DO%29%28O%29OP%28%3DO%29%28O%29OC2%5BC%40H%5D%28O%29%5BC%40%40H%5D%28O%29%5BC%40H%5D%28O%29%5BC%40H%5D2O)

## 限制

- **SMILES 必须能解析。** 解析失败返回 400 和 smilesdrawer 的错误信息;
  空格、`#`、`%` 这类字符记得 URL-encode(`%3DO` 就是 `=O`)。
- **大分子会挤。** 胆固醇、ATP 这种几十个原子的,标签密;
  画布给大一点(`w=760&h=560`)比默认尺寸舒服。
- **`theme` 跟着页面走。** 贴进暗色 README 用默认 dark,贴进文档白底用
  `theme=light` 或 `scheme=light`。

## 跟别的图种的区别

这不是统计图,是**结构图**:数据不是「数值」,是「原子怎么连」。
SMILES 本身就是一行文本,所以整张图就是一个 URL —— 药品说明书、
化学课的课件、README 里的分子示意,贴链接就出图。

图库里还有更多:[/draw/demo/chem](https://x-cmd.com/draw/demo/chem)。
