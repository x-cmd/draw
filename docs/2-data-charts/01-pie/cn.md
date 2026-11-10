---
x-title: pie 饼图 —— 6 种风格（opendata / evil / evil-mono / market-mono / progress / revenue）
x-desc: x-cmd/draw `type=pie` 用法速查。6 种风格：opendata（标签圈外+编辑式标题）、evil（圆角扇区+数值内标）、evil-mono（引线外标）、market-mono（灰阶+环心总计）、progress（点状进度环）、revenue（渐变扇区+右图例）。完整参数：labels / values / title / unit / donut / t / scheme / num / w/h。
x-sidebar: draw 饼图
x-keywords: pie chart, 饼图, draw, svg, opendata, evil, market-mono, progress, revenue, donut
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw pie 饼图'
      inLanguage: 'zh-CN'
      about: 'x-cmd/draw 饼图类型用法'
---

# pie 饼图 —— 6 种风格（opendata / evil / evil-mono / market-mono / progress / revenue）

## 示例（URL 即所得，点击图片进入交互页）

**OpenData（默认，标签圈外）**

```text
https://x-cmd.com/draw?type=pie&t=opendata&title=Chrome%20%E5%8D%A0%E6%AF%94&labels=Chrome%2CSafari%2CFirefox%2CEdge%2C%E5%85%B6%E4%BB%96&values=65,18,7,6,4
```

[![OpenData（默认，标签圈外）](https://x-cmd.com/draw?type=pie&t=opendata&title=Chrome%20%E5%8D%A0%E6%AF%94&labels=Chrome%2CSafari%2CFirefox%2CEdge%2C%E5%85%B6%E4%BB%96&values=65,18,7,6,4)](https://x-cmd.com/draw/explore?type=pie&t=opendata&title=Chrome%20%E5%8D%A0%E6%AF%94&labels=Chrome%2CSafari%2CFirefox%2CEdge%2C%E5%85%B6%E4%BB%96&values=65,18,7,6,4)

**Evil（圆角扇区+数值内标）**

```text
https://x-cmd.com/draw?type=pie&t=evil&title=%E6%B5%8F%E8%A7%88%E5%99%A8%E5%B8%82%E5%9C%BA&labels=Chrome%2CSafari%2CFirefox%2CEdge%2C%E5%85%B6%E4%BB%96&values=275,200,187,173,90
```

[![Evil（圆角扇区+数值内标）](https://x-cmd.com/draw?type=pie&t=evil&title=%E6%B5%8F%E8%A7%88%E5%99%A8%E5%B8%82%E5%9C%BA&labels=Chrome%2CSafari%2CFirefox%2CEdge%2C%E5%85%B6%E4%BB%96&values=275,200,187,173,90)](https://x-cmd.com/draw/explore?type=pie&t=evil&title=%E6%B5%8F%E8%A7%88%E5%99%A8%E5%B8%82%E5%9C%BA&labels=Chrome%2CSafari%2CFirefox%2CEdge%2C%E5%85%B6%E4%BB%96&values=275,200,187,173,90)

**Evil 外标（黑白印刷）**

```text
https://x-cmd.com/draw?type=pie&t=evil-mono&title=%E6%B5%8F%E8%A7%88%E5%99%A8%E5%B8%82%E5%9C%BA&labels=Chrome%2CSafari%2CFirefox%2CEdge%2C%E5%85%B6%E4%BB%96&values=275,200,187,173,90
```

[![Evil 外标（黑白印刷）](https://x-cmd.com/draw?type=pie&t=evil-mono&title=%E6%B5%8F%E8%A7%88%E5%99%A8%E5%B8%82%E5%9C%BA&labels=Chrome%2CSafari%2CFirefox%2CEdge%2C%E5%85%B6%E4%BB%96&values=275,200,187,173,90)](https://x-cmd.com/draw/explore?type=pie&t=evil-mono&title=%E6%B5%8F%E8%A7%88%E5%99%A8%E5%B8%82%E5%9C%BA&labels=Chrome%2CSafari%2CFirefox%2CEdge%2C%E5%85%B6%E4%BB%96&values=275,200,187,173,90)

**Market Mono（灰阶+环心总计）**

```text
https://x-cmd.com/draw?type=pie&t=market-mono&unit=B&title=%E5%B8%82%E5%9C%BA%E4%BB%BD%E9%A2%9D&labels=%E5%A4%A9%E9%99%85%E7%BA%BF%2C%E6%95%B0%E6%8D%AE%E6%B3%89%2C%E4%BA%91%E5%B3%B0%2C%E4%BB%BB%E5%8A%A1%E6%A1%A5%2C%E6%B5%81%E5%B7%A5%E5%9C%BA&values=27,21,13,21,12
```

[![Market Mono（灰阶+环心总计）](https://x-cmd.com/draw?type=pie&t=market-mono&unit=B&title=%E5%B8%82%E5%9C%BA%E4%BB%BD%E9%A2%9D&labels=%E5%A4%A9%E9%99%85%E7%BA%BF%2C%E6%95%B0%E6%8D%AE%E6%B3%89%2C%E4%BA%91%E5%B3%B0%2C%E4%BB%BB%E5%8A%A1%E6%A1%A5%2C%E6%B5%81%E5%B7%A5%E5%9C%BA&values=27,21,13,21,12)](https://x-cmd.com/draw/explore?type=pie&t=market-mono&unit=B&title=%E5%B8%82%E5%9C%BA%E4%BB%BD%E9%A2%9D&labels=%E5%A4%A9%E9%99%85%E7%BA%BF%2C%E6%95%B0%E6%8D%AE%E6%B3%89%2C%E4%BA%91%E5%B3%B0%2C%E4%BB%BB%E5%8A%A1%E6%A1%A5%2C%E6%B5%81%E5%B7%A5%E5%9C%BA&values=27,21,13,21,12)

**Progress（点状进度环）**

```text
https://x-cmd.com/draw?type=pie&t=progress&unit=%E6%AC%A1&title=%E5%B7%A5%E4%BD%9C%E6%97%B6%E9%97%B4%E9%83%BD%E6%BC%8F%E5%9C%A8%E5%93%AA&labels=%E9%A2%9D%E5%A4%96%E7%9A%84%E6%94%AF%E6%8C%81%E8%AF%B7%E6%B1%82%2C%E4%B8%8D%E5%87%86%E7%A1%AE%E7%9A%84%E9%A2%84%E6%B5%8B&values=48,67
```

[![Progress（点状进度环）](https://x-cmd.com/draw?type=pie&t=progress&unit=%E6%AC%A1&title=%E5%B7%A5%E4%BD%9C%E6%97%B6%E9%97%B4%E9%83%BD%E6%BC%8F%E5%9C%A8%E5%93%AA&labels=%E9%A2%9D%E5%A4%96%E7%9A%84%E6%94%AF%E6%8C%81%E8%AF%B7%E6%B1%82%2C%E4%B8%8D%E5%87%86%E7%A1%AE%E7%9A%84%E9%A2%84%E6%B5%8B&values=48,67)](https://x-cmd.com/draw/explore?type=pie&t=progress&unit=%E6%AC%A1&title=%E5%B7%A5%E4%BD%9C%E6%97%B6%E9%97%B4%E9%83%BD%E6%BC%8F%E5%9C%A8%E5%93%AA&labels=%E9%A2%9D%E5%A4%96%E7%9A%84%E6%94%AF%E6%8C%81%E8%AF%B7%E6%B1%82%2C%E4%B8%8D%E5%87%86%E7%A1%AE%E7%9A%84%E9%A2%84%E6%B5%8B&values=48,67)

**Revenue（渐变扇区+右图例）**

```text
https://x-cmd.com/draw?type=pie&t=revenue&unit=%E5%8D%95&title=%E8%90%A5%E6%94%B6&labels=%E7%9B%B4%E8%90%A5%2C%E5%B9%B3%E5%8F%B0%2C%E6%89%B9%E5%8F%91%2C%E8%81%94%E7%9B%9F&values=52400,38900,24150,16300
```

[![Revenue（渐变扇区+右图例）](https://x-cmd.com/draw?type=pie&t=revenue&unit=%E5%8D%95&title=%E8%90%A5%E6%94%B6&labels=%E7%9B%B4%E8%90%A5%2C%E5%B9%B3%E5%8F%B0%2C%E6%89%B9%E5%8F%91%2C%E8%81%94%E7%9B%9F&values=52400,38900,24150,16300)](https://x-cmd.com/draw/explore?type=pie&t=revenue&unit=%E5%8D%95&title=%E8%90%A5%E6%94%B6&labels=%E7%9B%B4%E8%90%A5%2C%E5%B9%B3%E5%8F%B0%2C%E6%89%B9%E5%8F%91%2C%E8%81%94%E7%9B%9F&values=52400,38900,24150,16300)

**实心饼（donut=0）**

```text
https://x-cmd.com/draw?type=pie&donut=0&title=%E5%8D%A0%E6%AF%94&labels=TS,Py,Go&values=48,23,9
```

[![实心饼（donut=0）](https://x-cmd.com/draw?type=pie&donut=0&title=%E5%8D%A0%E6%AF%94&labels=TS,Py,Go&values=48,23,9)](https://x-cmd.com/draw/explore?type=pie&donut=0&title=%E5%8D%A0%E6%AF%94&labels=TS,Py,Go&values=48,23,9)

---

## 一、参数

| 参数 | 含义 | 必填 |
| --- | --- | --- |
| `labels=` | 各扇区标签，逗号分隔 | ✓ |
| `values=` | 各扇区数值，逗号分隔 | ✓ |
| `title=` | 图表标题 | ✗ |
| `unit=` | 数值单位（如 `B`、`responses`、`%`） | ✗ |
| `donut=` | `0` 实心 / `>0` 圆环宽度 | ✗ |
| `t=` | 风格（见下表） | ✗ |

通用参数（`scheme` / `num` / `w/h` / `v`）见 [overview](../../1-overview/01-what-is-draw/cn.md) §二。

---

## 二、6 种风格（`t=`）

| 风格 (`t=`) | 视觉 | 适用 |
| --- | --- | --- |
| `opendata`（默认）| 标签圈外、编辑式标题 | 通用、浏览器市场类 |
| `evil` | 圆角扇区、白缝分隔、数值内标 | 营收 / 市场份额 |
| `evil-mono` | 实心 + 引线外标、名称灰数值墨 | 黑白印刷 |
| `market-mono` | 灰阶按份额深浅、环心总计、两列图例 | 商业报告 |
| `progress` | 点状进度环、环心大百分比 | 调研 / 调查 |
| `revenue` | 对角渐变、虚线内圈、右图例带数值 | 营收分析 |



---

## 三、实心 vs 圆环

`donut=0` 强制实心饼（无环心）：


> **同一模板，一个参数切换形态**——这是 x-cmd/draw 的核心设计：风格由参数控制，不换模板。

---

## 四、踩坑

- **标签数 ≤ 100**，> 9 自动合并 Other
- 实心 vs 圆环只是 `donut=` 的差别，不要为了"实心"换风格
- 配色方案：`scheme=dark\|light`，dark 模式下有些风格的对比度会变化
- 标题里有空格要 URL-encode：`%20` 代替