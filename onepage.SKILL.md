---
name: onepage
description: 把 markdown 渲染成手机分享用的条状长图(一页纸)。POST body / GET ?d= / GET ?src=(GitHub 自动转 raw);浏览器打开即正常字号阅读页。
title: onepage 一页纸
subtitle: markdown → 手机条状长图
website: https://x-cmd.com/draw
qr: https://x-cmd.com/draw
---

## 这是什么

一段 markdown,一条 URL,变成微信可转发的**条状长图**:1800 宽、高度随内容生长、蓝黑灰编辑版式。浏览器打开就是正常字号的阅读页;curl 拿到的是矢量 SVG;加 format=png 出位图。适合:项目一页纸介绍、融资 BP 摘要、产品发布说明、技术文速览。

## 三个入口

- POST:body 即 markdown,长文/CJK 全文走这里

```sh
curl -X POST --data-binary @doc.md "https://x-cmd.com/draw/x-cmd/onepage" -o page.svg
```

- GET ?d=:markdown 明文 urlencoded,短文(≤16000 字符)适用

```sh
https://x-cmd.com/draw/x-cmd/onepage?d=%2D%2D%2D%0Atitle%3A%20Hello%0A%2D%2D%2D%0A%0A%23%23%20%E7%AC%AC%E4%B8%80%E8%8A%82%0A%E5%86%85%E5%AE%B9
```

- GET ?src=:文档放在 GitHub(或任意 http),一个链接直渲,≤64KB

```sh
https://x-cmd.com/draw/x-cmd/onepage?src=https://github.com/x-cmd/draw/blob/main/onepage.SKILL.md
```

## 取文逻辑(同 x-cmd/ppt)

**GitHub 地址自动转 raw** —— blob 页面链接会被规范成 raw.githubusercontent.com 直链,agent 与人都不需要自己换算。

**客户端能取就自取** —— raw.githubusercontent.com 自带 Access-Control-Allow-Origin: * ,浏览器端 fetch 它没有跨域问题。

**跨域取不到走 nocors** —— 其它域无 CORS 头时,用 draw 内置的小型代取服务:

```sh
https://x-cmd.com/draw/nocors?url=<encoded>
```

同一地址给浏览器端用:fetch 它拿原文,github blob 链接同样自动转 raw;仅 GET、文本类、512KB 内,响应带 ACAO:*。

## 写作约定

yfm 头(front matter)控制页头与页脚:

- title:大标题(必填,支持 # 一级标题兜底)
- subtitle:副标题一行
- 页头要点:首个 ## 之前出现的 - 列表,渲染成标题下的信息行(公司/架构/城市/融资额这类)
- contact / location / website:页脚联系方式块(居中)
- qr:二维码内容(通常就填 website);qr-note:码下小字,缺省「扫码了解更多」

结构:

- ## 二级标题 = 顶级节,粗黑字 + 左缘蓝色装饰条
- ### 三级标题、或**整段加粗** = 次级节,粗黑字
- 段落正文 73px 蓝灰,行内 **加粗** 变黑粗;列表、围栏代码块(等宽)均支持
- 没有编号、没有分隔线、没有卡片 —— 层级只靠字重与留白

## 打开方式

- 浏览器地址栏打开 → 阅读页:条图以正文约 17px 的宽度居中(手机恰好整屏,桌面居中窄栏),形状恒定不拉伸,两侧纯色
- 当图片嵌(img / markdown)或 curl → 原始 SVG(1800 宽,矢量)
- &format=png(&scale=1-3)→ 位图,微信发图直接可用

## 示例:本文即一页纸

这份 SKILL.md 本身就是一份合法输入,自渲染:

```sh
https://x-cmd.com/draw/x-cmd/onepage?src=https://github.com/x-cmd/draw/blob/main/onepage.SKILL.md
```

## 错误对照

- 400 needs a title —— 没有 title: 也没有 # 标题
- 400 max 16000/65536 —— 换 POST 或 src=
- 404/400 src fetch got —— 源地址取不到;blob 链接确认拼写
- 413 —— nocors 上游超 512KB
