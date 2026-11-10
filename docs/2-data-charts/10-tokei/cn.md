---
x-title: 代码构成图 —— 把 tokei 的数字画出来
x-desc: 'x-cmd/draw 代码构成图(`/draw/tokei`)。吃 `tokei --output json` 的 JSON,每门语言一根堆叠柱:代码、注释、空行。参数:`d=` tokei 的 json,`title=`,`unit=`,`w=/h=`,`t=`,`scheme=`。'
x-sidebar: draw 代码构成图
x-keywords: 代码构成图, tokei, draw, svg, 仓库统计, 语言统计
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 代码构成图'
      inLanguage: 'cn'
      about: 'x-cmd/draw 10-tokei'
---

# 代码构成图 —— 把 tokei 的数字画出来

`/draw/tokei` 吃 `tokei --output json` 打印的那份 JSON,画成:每门语言一根柱,
分成 **代码**、**注释**、**空行** 三段。

## 示例(URL 即所得,点击图片进入交互页)

### 一个仓库的语言构成

```text
https://x-cmd.com/draw/tokei?d=%7B%22TypeScript%22%3A%7B%22code%22%3A4820%2C%22comments%22%3A1180%2C%22blanks%22%3A940%7D%2C%22JavaScript%22%3A%7B%22code%22%3A1687%2C%22comments%22%3A298%2C%22blanks%22%3A71%7D%2C%22Shell%22%3A%7B%22code%22%3A640%2C%22comments%22%3A120%2C%22blanks%22%3A88%7D%2C%22CSS%22%3A%7B%22code%22%3A210%2C%22comments%22%3A40%2C%22blanks%22%3A35%7D%2C%22Markdown%22%3A%7B%22code%22%3A180%2C%22comments%22%3A760%2C%22blanks%22%3A120%7D%2C%22JSON%22%3A%7B%22code%22%3A95%2C%22comments%22%3A0%2C%22blanks%22%3A12%7D%7D&title=Code%20composition%20%C2%B7%20v0.3.0&w=760&h=440
```

[![代码构成](https://x-cmd.com/draw/tokei?d=%7B%22TypeScript%22%3A%7B%22code%22%3A4820%2C%22comments%22%3A1180%2C%22blanks%22%3A940%7D%2C%22JavaScript%22%3A%7B%22code%22%3A1687%2C%22comments%22%3A298%2C%22blanks%22%3A71%7D%2C%22Shell%22%3A%7B%22code%22%3A640%2C%22comments%22%3A120%2C%22blanks%22%3A88%7D%2C%22CSS%22%3A%7B%22code%22%3A210%2C%22comments%22%3A40%2C%22blanks%22%3A35%7D%2C%22Markdown%22%3A%7B%22code%22%3A180%2C%22comments%22%3A760%2C%22blanks%22%3A120%7D%2C%22JSON%22%3A%7B%22code%22%3A95%2C%22comments%22%3A0%2C%22blanks%22%3A12%7D%7D&title=Code%20composition%20%C2%B7%20v0.3.0&w=760&h=440)](https://x-cmd.com/draw/explore/tokei?d=%7B%22TypeScript%22%3A%7B%22code%22%3A4820%2C%22comments%22%3A1180%2C%22blanks%22%3A940%7D%2C%22JavaScript%22%3A%7B%22code%22%3A1687%2C%22comments%22%3A298%2C%22blanks%22%3A71%7D%2C%22Shell%22%3A%7B%22code%22%3A640%2C%22comments%22%3A120%2C%22blanks%22%3A88%7D%2C%22CSS%22%3A%7B%22code%22%3A210%2C%22comments%22%3A40%2C%22blanks%22%3A35%7D%2C%22Markdown%22%3A%7B%22code%22%3A180%2C%22comments%22%3A760%2C%22blanks%22%3A120%7D%2C%22JSON%22%3A%7B%22code%22%3A95%2C%22comments%22%3A0%2C%22blanks%22%3A12%7D%7D&title=Code%20composition%20%C2%B7%20v0.3.0&w=760&h=440)

同一张图走普通柱状图入口 —— `stack=1` 加三个系列:

```text
https://x-cmd.com/draw?type=bar&stack=1&labels=TypeScript,JavaScript,Shell,CSS,Markdown,JSON&series=code:4820,1687,640,210,180,95&series=comments:1180,298,120,40,760,0&series=blanks:940,71,88,35,120,12&title=Code%20composition%20%C2%B7%20v0.3.0&w=760&h=440
```

[![代码构成 · bar](https://x-cmd.com/draw?type=bar&stack=1&labels=TypeScript,JavaScript,Shell,CSS,Markdown,JSON&series=code:4820,1687,640,210,180,95&series=comments:1180,298,120,40,760,0&series=blanks:940,71,88,35,120,12&title=Code%20composition%20%C2%B7%20v0.3.0&w=760&h=440)](https://x-cmd.com/draw/explore?type=bar&stack=1&labels=TypeScript,JavaScript,Shell,CSS,Markdown,JSON&series=code:4820,1687,640,210,180,95&series=comments:1180,298,120,40,760,0&series=blanks:940,71,88,35,120,12&title=Code%20composition%20%C2%B7%20v0.3.0&w=760&h=440)

## 一、两种给数的方式

**短的那种 —— `langs=`,我们主推这个:**

```text
https://x-cmd.com/draw/tokei?langs=TypeScript:4820:1180:940,JavaScript:1687:298:71
```

每一项是 `语言:代码:注释:空行`,逗号分隔;后两个可以不写。比 JSON 形态短
八倍左右,而且人(或 agent)不用解转义就能读。

**机器的那种 —— `d=`,tokei --output json 的原样:**

```text
https://x-cmd.com/draw/tokei?d={"TypeScript":{"code":4820,"comments":1180,"blanks":940},…}
```

两种形态出同一张图。JSON 形态可以直接吃 tokei 的原样输出(含每个文件的明细,
那部分会被忽略);property 形态是放进 README 用的。

## 二、参数

| 参数 | 含义 | 默认 |
|---|---|---|
| `langs=` | 短形态:`语言:代码:注释:空行`,逗号分隔 | — |
| `d=` | JSON 形态(tokei 的输出,或裁剪过的子集) | — |
| `title=` | 图标题 | — |
| `unit=` | 数值旁的单位 | — |
| `w=` / `h=` | 画布尺寸 | 760 × 440 |
| `t=` | 皮肤(柱状图那几族) | — |
| `scheme=` | `dark` / `light` | 自动 |

## 三、输入长什么样

`tokei --output json` 按语言打印一个对象:

```json
{"TypeScript":{"code":1200,"comments":300,"blanks":150}, ...}
```

整份输出直接能用 —— 每个文件的 `reports` 和 `children` 会被读进来然后忽略,
只用每门语言那三个合计数。裁剪成「每门语言三个数」的精简对象也行,
URL 短的时候用这个。

端点替你做了两件事:

- tokei 多加的 `Total` 行**不会**画成一根柱;
- 语言按总量**从大到小**排。

## 四、POST 直接接 tokei

POST 的 body 就是那份 JSON,整件事一个管道:

```sh
tokei --output json | curl -X POST --data-binary @- https://x-cmd.com/draw/tokei
```

## 五、只看 PR 改动的部分

pull request 就把 tokei 跑在这次改动碰到的文件上:

```sh
git diff --name-only origin/main… | xargs tokei --output json
```

再 POST 进去。画出来的是**增量**而不是整个仓库 —— 这才是 reviewer 真正想看的数。
同样的招数也能给出「这个 release 相对上一个 tag 改了什么」。

## 六、踩坑

- **输入必须是 tokei 的形状** —— 一个「语言 → {code, comments, blanks}」的对象。
  不像样会 400,报错里带着该长什么样。
- **什么都没有的语言会被丢掉** —— 代码、注释、空行全是 0 的语言不占柱子。
- **数的是行,不是字节** —— tokei 的 `code` 是代码行数;这张图跟文件大小没关系。
- **`t=` 定颜色不定形状** —— 永远是堆叠柱;想换形状就用普通的 `type=bar`。

