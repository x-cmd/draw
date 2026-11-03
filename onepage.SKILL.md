---
name: onepage
description: 把 markdown 渲染成手机分享的条状长图(一页纸)。POST body / GET ?d= / GET ?src=(GitHub 自动转 raw);浏览器打开即正常字号阅读页。
title: onepage 一页纸
subtitle: markdown → 手机条状长图
website: https://x-cmd.com/draw
qr: https://x-cmd.com/draw
---

## 这是什么

一段 markdown,一条 URL,变成微信可转发的**条状长图**:1800 宽、高度随内容生长、蓝黑灰编辑版式。浏览器打开就是正常字号的阅读页,curl 拿到矢量 SVG,加 format=png 出位图。

适合:项目一页纸、融资 BP 摘要、产品发布说明、技术文速览 —— 一切「手机上看」的内容。

## 怎么用

**POST**,长文与 CJK 全文首选,body 即 markdown:

```sh
curl -X POST --data-binary @doc.md \
  https://x-cmd.com/draw/x-cmd/onepage
```

**GET ?src=**,文档放在 GitHub,blob 链接自动转 raw,一条链接直出:

```sh
https://x-cmd.com/draw/x-cmd/onepage
  ?src=https://github.com/x-cmd/draw/blob/main/doc.md
```

**GET ?d=**,短文明文放参数里(≤16000 字符)。CJK 会被编码放大约 3 倍,超限就换 POST 或 src。

## 取文逻辑

同 x-cmd/ppt 的三步:

1. GitHub 地址自动转 raw.githubusercontent 直链接
2. 浏览器端能取就自取 —— raw 自带跨域许可
3. 取不到时走内置代取 /draw/nocors?url=(仅 GET,512KB 内)

## 写作约定

yfm 头控制页头页脚:title(必填)、subtitle,contact 与 location、website、qr、qr-note。首个 ## 之前出现的列表,渲染成标题下的**页头要点** —— 公司、城市、融资额这类信息行。

结构上:## 是顶级节,粗黑字加左缘蓝条;### 或整段粗体是次级节。正文行内**加粗**变黑。列表、代码块都支持。没有编号、没有分隔线、没有卡片 —— 层级只靠字重与留白。

## 示例:本文即一页纸

这份 SKILL.md 本身就是合法输入,自渲染:

```sh
https://x-cmd.com/draw/x-cmd/onepage
  ?src=https://github.com/x-cmd/draw/blob/main/onepage.SKILL.md
```

浏览器地址栏打开是阅读页;当图片嵌或 curl 得 SVG;加 format=png 出位图。错误对照:400 缺 title 或超长;404 源地址取不到。
