---
x-title: 在 HTML 报告里画图 —— 引一行 `<script>`
x-desc: draw 的浏览器入口:引一行脚本,图自己出来,**不请求后台**。参数语法跟 /draw 端点一模一样 —— 地址栏上的参数就是图的全部数据。
x-sidebar: 在报告里画图
x-keywords: html report, script tag, client side rendering, csr, data-draw, embed chart, draw
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: '在 HTML 报告里画图 —— draw 浏览器入口'
      inLanguage: 'zh-CN'
      about: 'x-cmd/draw 客户端渲染(CSR)库用法'
---

# 在 HTML 报告里画图

---

引一行脚本,图自己出来 —— **不请求后台**。

```html
<script src="https://cdn.jsdelivr.net/npm/@x-cmd/draw@latest/client"></script>

<div data-draw="type=bar&labels=Jan,Feb,Mar&values=120,145,138&title=Monthly"></div>
```

就这样:页面打开,图已经在那里了。报告是静态的 HTML 也没关系(不用起服务、不用等网络)。

---

## 一、两种用法

### 用法 A:元素上写参数(最省事)

```html
<div data-draw="type=line&labels=W1,W2,W3&series=App:120,145,138&series=Web:80,95,110"></div>
```

页面加载后脚本会扫一遍 `[data-draw]`,挨个画出来;**后加的元素也会被画上**(动态生成的报告用得上)。

### 用法 B:自己调(要在画之前做点什么时)

```js
import { renderChartTo, autoRender } from '@x-cmd/draw/client';

renderChartTo(document.querySelector('#chart'), 'type=pie&labels=A,B&values=1,2');
autoRender(document);   // 扫 [data-draw]
```

---

## 二、参数语法:**跟 `/draw` 端点一模一样**

这是这套东西最要紧的一条:**URL 即数据**。地址栏上的参数就是图的全部数据 —— 报告里那张图,参数可以直接抄。

| 参数 | 例子 | 说明 |
|---|---|---|
| `type` | `type=bar` | 图种(见下) |
| `labels` / `values` | `labels=Jan,Feb&values=1,2` | 简单图表的数据 |
| `series` | `series=App:1,2&series=Web:3,4` | 多系列(冒号后是名字) |
| `title` / `unit` | `title=Monthly` | 图上的标题与单位 |
| `t` | `t=macaron` | 风格家族(跟 `?t=` 一个意思) |
| `scheme` | `scheme=light` | 明暗(默认跟系统) |
| `w` / `h` | `w=760&h=420` | 画布大小(不给就用图种的缺省) |

⇒ 同一段参数,放地址栏是 `/draw?type=bar&…`,放元素上是 `data-draw="type=bar&…"` —— **图一样**。

支持的图种(v1,图表族):

`pie` `bar` `hbar` `line` `area` `gauge` `scatter` `combo` `sankey` `radar`
`qr` `quadrant` `compass` `butterfly` `calendar` `ladder` `butterfly-ladder`

---

## 三、交互也有

图不是一张死图:

- **悬停**出话(值、名字、那一行)
- **点图例**显隐系列
- **图例悬停**整个系列一起亮

⇒ 报告里的图能读、能查,不是截图。

---

## 四、样式不会脏你的页面

- 皮肤的颜色变量挂在 `svg.chart` 上 —— **不污染**整页的 CSS 变量
- 图里没有「Edit @X-CMD」角标(那是官网落地页要的东西)
- 想跟页面统一:给容器套自己的 CSS 就行(`.draw-chart` 之类)

---

## 五、自己发一份(离线/内网)

```sh
npm pack @x-cmd/draw        # 拿到 tarball
# 或者直接拷 dist/draw-client.iife.js(255KB,min,IIFE,全局 DrawChart)
```

```html
<script src="./draw-client.iife.js"></script>
<div data-draw="type=bar&labels=A,B&values=1,2"></div>
```

⇒ 没有外网也能画。

---

## 六、自己搭一份(要改渲染器时)

```sh
git clone https://github.com/x-cmd/draw
cd draw && npm i && npm run build:client
# ⇒ dist/draw-client.iife.js
```

渲染器就在 `src/render/`(拼字符串的 ⇒ 与环境无关:Worker 里靠 `svgdom` 垫片,浏览器里用真 DOM)。

---

**相关**:[/draw 端点的参数](/draw/docs/1-overview/07-params/) · [数据格式两种写法](/draw/docs/1-overview/04-data-and-api/)
