---
x-title: 参数 —— URL / CLI / npm 三个入口,一份参数
x-desc: 'x-cmd/draw 参数对照:同一个图,URL、命令行、npm 三种写法;加上 URL 编码规则和各图种的调用入口。'
x-sidebar: draw 参数
x-keywords: 参数, URL, CLI, npm, 编码, draw
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 参数对照'
      inLanguage: 'cn'
      about: 'x-cmd/draw 07-params'
---

# 参数 —— URL / CLI / npm 三个入口,一份参数

**同一份参数,三种写法。** 语义完全一样,输出也一样 —— 换入口不用换脑子。

## 三个入口

| 入口 | 怎么调 | 适合 |
|---|---|---|
| **URL** | `GET https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2` | 贴进 README、issue、PR;`format=png` 存图 |
| **CLI** | `draw --type pie --labels "A,B" --values "3,2" --out pie.svg` | 本地出图;`.png` 后缀直接光栅化 |
| **npm** | `import { draw } from '@x-cmd/draw';`<br>`const { svg } = draw({ type: 'pie', labels: 'A,B', values: '3,2' });` | 在自己的程序里画;不联网 |

## 同一个图,三种写法

| 参数 | URL | CLI | npm |
|---|---|---|---|
| 图种 | `type=pie` | `--type pie` | `{ type: 'pie' }` |
| 类别 | `labels=A,B` | `--labels "A,B"` | `{ labels: 'A,B' }` |
| 数值 | `values=3,2` | `--values "3,2"` | `{ values: '3,2' }` |
| 标题 | `title=Stars` | `--title "Stars"` | `{ title: 'Stars' }` |
| 单位 | `unit=stars` | `--unit stars` | `{ unit: 'stars' }` |
| 风格 | `t=evil` | `--theme evil`(或 `--t evil`) | `{ t: 'evil' }` |
| 明暗 | `scheme=dark` | `--scheme dark` | `{ scheme: 'dark' }` |
| 尺寸 | `w=560&h=320` | `--width 560 --height 320` | `{ w: 560, h: 320 }` |
| 数值标签 | `num=all` | `--num all` | `{ num: 'all' }` |
| 重复参数 | `series=a:1,2&series=b:3,4` | `--series "a:1,2" --series "b:3,4"` | `{ series: ['a:1,2', 'b:3,4'] }` |

> CLI 的长 flag 就是查询参数名(`--theme` = `t=`、`--width` = `w=`),
> 认不出的 flag 直接透传成查询参数;重复的 flag 就是重复的参数。
> CLI 也能直接吃裸查询串:`draw "?type=bar&labels=Mon,Tue&values=3,5"`。

## URL 编码规则

| 字符 | 写成 | 为什么 |
|---|---|---|
| 空格 | `%20` | 不是 `+` —— `+` 在查询串里会被当成空格 |
| `+`(真的加号) | `%2B` | 名字以加号开头时(`C++`) |
| `&` | `%26` | 它是参数分隔符 |
| `=` | `%3D` | 它是键值分隔符 |
| `;` | `%3B` | 架构图的节点语法用分号,写在名字里要转义 |
| `#` | `%23` | 它是 fragment 的开头 |
| `<` `>` | `%3C` `%3E` | 写 `<<include>>` 这种 UML 记号时 |
| 中文 | 百分号编码 | 浏览器会自动做,手写时记得 UTF-8 |

`;` `=` `,` `:` `/` `@` 本身不用转义 —— 架构图那套 `n=` `e=` `b=` 语法靠它们分字段。

## 调用入口:哪种图走哪个端点

| 入口 | 端点 | 图种 |
|---|---|---|
| **core** | `/draw?type=…` | pie、bar、hbar、line、area、radar、gauge、scatter、combo、sankey、qr、quadrant、compass、butterfly、calendar |
| **echarts** | `/draw/echarts?d=…` | ECharts 覆盖层:力导向图、环形关系、旭日、矩形树、漏斗、主题河流、地图… |
| **arch2** | `/draw/arch2?n=…&e=…` | 架构图 v2(带类型着色和图例) |
| **archmap** | `/draw/archmap?n=…&e=…` | 架构图(素框) |
| **mermaid** | `/draw/mermaid?m=…` | Mermaid 流程图 |
| **seq / uc / erd / class / dataflow / lifecycle** | `/draw/<图种>?n=…&e=…` | 时序图、用例图、ERD、类图、数据流、生命周期 |
| **gantt / gantt2** | `/draw/gantt?…` | 甘特图 |
| **mindmap** | `/draw/mindmap?n=…` | 导图 |
| **tokei** | `/draw/tokei?langs=…` | 代码构成 |

## 两个链接,两件事

| 链接 | 是什么 |
|---|---|
| `https://x-cmd.com/draw?type=…` | **图** —— SVG/PNG,拿去就能嵌 |
| `https://x-cmd.com/draw/explore?type=…` | **编辑器** —— 左边图右边表,改一格重画,再复制图片 URL |

demo 页(/draw/demo)上每张卡片都带「复制图片 URL」按钮,拷的就是第一个。
