---
x-title: 用例图 —— 谁在用,拿来干什么
x-desc: 'x-cmd/draw 用例图(`/draw/uc`)。火柴人参与者、椭圆用例、系统边界,还有 `<<include>>` / `<<extend>>` 依赖。参数:`n=` 元素(`id;actor|标签` 或 `id;uc|标签`),`e=` 关联,`b=` 边界,`title=`,`w=/h=`。'
x-sidebar: draw 用例图
x-keywords: 用例图, draw, svg, uml, 参与者, 系统边界
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 用例图'
      inLanguage: 'cn'
      about: 'x-cmd/draw 03-uc'
---

# 用例图 —— 谁在用,拿来干什么

左边是火柴人(参与者),右边是椭圆(用例),中间套一圈系统边界。

```text
https://x-cmd.com/draw/draw/uc?n=caller%3Bactor%3B%E4%BD%A0%E7%9A%84%E5%BA%94%E7%94%A8%E6%88%96%20CI&n=agent%3Bactor%3BAI%20%E6%99%BA%E8%83%BD%E4%BD%93&n=writer%3Bactor%3BREADME%20%E6%88%96%E6%96%87%E6%A1%A3&n=ops%3Bactor%3B%E8%87%AA%E6%89%98%E7%AE%A1%E8%BF%90%E7%BB%B4&n=uc1%3Buc%3B%E6%B8%B2%E6%9F%93%E5%9B%BE%E8%A1%A8%3BGET%20%2Fdraw%3Ftype%3D...&n=uc2%3Buc%3B%E5%AD%98%E6%88%90%E7%9F%AD%E9%93%BE%E6%8E%A5%3BPOST%20%2Fdraw&n=uc3%3Buc%3B%E5%B5%8C%E5%85%A5%20SVG%3Bmarkdown%20%2B%20img&n=uc4%3Buc%3B%E8%87%AA%E8%A1%8C%E9%83%A8%E7%BD%B2%3Bnpm%20%2B%20wrangler&e=caller;uc1&e=caller;uc2&e=agent;uc1&e=writer;uc3&e=ops;uc4&e=uc1;uc2;%3C%3Cinclude%3E%3E&b=%E7%BB%98%E5%88%B6%3Buc1%20uc2%20uc3%20uc4&title=draw%20%E8%83%BD%E5%81%9A%E4%BB%80%E4%B9%88
```

[![draw 的用例](https://x-cmd.com/draw/draw/uc?n=caller%3Bactor%3B%E4%BD%A0%E7%9A%84%E5%BA%94%E7%94%A8%E6%88%96%20CI&n=agent%3Bactor%3BAI%20%E6%99%BA%E8%83%BD%E4%BD%93&n=writer%3Bactor%3BREADME%20%E6%88%96%E6%96%87%E6%A1%A3&n=ops%3Bactor%3B%E8%87%AA%E6%89%98%E7%AE%A1%E8%BF%90%E7%BB%B4&n=uc1%3Buc%3B%E6%B8%B2%E6%9F%93%E5%9B%BE%E8%A1%A8%3BGET%20%2Fdraw%3Ftype%3D...&n=uc2%3Buc%3B%E5%AD%98%E6%88%90%E7%9F%AD%E9%93%BE%E6%8E%A5%3BPOST%20%2Fdraw&n=uc3%3Buc%3B%E5%B5%8C%E5%85%A5%20SVG%3Bmarkdown%20%2B%20img&n=uc4%3Buc%3B%E8%87%AA%E8%A1%8C%E9%83%A8%E7%BD%B2%3Bnpm%20%2B%20wrangler&e=caller;uc1&e=caller;uc2&e=agent;uc1&e=writer;uc3&e=ops;uc4&e=uc1;uc2;%3C%3Cinclude%3E%3E&b=%E7%BB%98%E5%88%B6%3Buc1%20uc2%20uc3%20uc4&title=draw%20%E8%83%BD%E5%81%9A%E4%BB%80%E4%B9%88)](https://x-cmd.com/draw/explore/uc?n=caller;actor;Your%20app%20or%20CI&n=agent;actor;AI%20agent&n=writer;actor;README%20or%20docs&n=ops;actor;Self-host%20operator&n=uc1;uc;Render%20a%20chart;GET%20/draw%3Ftype=...&n=uc2;uc;Store%20a%20short%20link;POST%20/draw&n=uc3;uc;Embed%20the%20SVG;markdown%20%2B%20img&n=uc4;uc;Run%20it%20yourself;npm%20%2B%20wrangler&e=caller;uc1&e=caller;uc2&e=agent;uc1&e=writer;uc3&e=ops;uc4&e=uc1;uc2;%3C%3Cinclude%3E%3E&b=draw;uc1%20uc2%20uc3%20uc4&title=What%20draw%20is%20for)

## 一、参数

| 参数 | 含义 | 默认 |
|---|---|---|
| `n=` | 一个元素:`id;actor\|标签[;副标]` 或 `id;uc\|标签[;副标]` | — |
| `e=` | 一条关联:`起点;终点[;文字]` | — |
| `b=` | 系统边界:`名称;id id …` | — |
| `actors=` | 参与方摆在右边(默认在左边) | `left` |
| `title=` | 图标题 | — |
| `w=` / `h=` | 画布尺寸 | 自然尺寸 |
| `v=` | 固定输出版本 | 最新 |

## 二、怎么画的

- **参与者**是一列火柴人;**用例**是另一列椭圆。`actors=right` 把两边对调。
- **关联走正交线** —— 从参与方出来,沿两列之间的空档走一段,再进椭圆;
  所以一个参与方连好几个用例时,线不会从别人的椭圆上压过去。
- **关联**是实线。文字写 `<<include>>` 或 `<<extend>>` 就变成虚线依赖 ——
  UML 里「这个用例一定要用那个」的说法。
- **系统边界**(`b=`)是圈住用例的那个虚线框。

## 三、踩坑

- **类型只能是 `actor` 或 `uc`** —— 别的会 400。
- **边界只框用例** —— 把参与者写进去,框就把参与者也圈上了。
- **用例排成一列** —— URL 里的顺序就是从上往下的顺序。
- **文字里的 `+` 要编码**(`%2B`),别处也一样。

