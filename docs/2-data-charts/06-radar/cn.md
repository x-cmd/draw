---
x-title: radar 雷达图 —— 多维对比
x-desc: x-cmd/draw `type=radar` 用法速查。多维对比（产品 / 候选人 / 方案 横向评分）。参数：labels=`维度` + values=`分数` 或 series=`多对象`。值域通常 0-100。
x-sidebar: draw 雷达图
x-keywords: radar chart, 雷达图, draw, svg, 多维对比
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw radar 雷达图'
      inLanguage: 'zh-CN'
      about: 'x-cmd/draw 雷达图'
---

# radar 雷达图 —— 多维对比

## 示例（URL 即所得，点击图片进入交互页）

**单对象（默认 base）**

```text
https://x-cmd.com/draw?type=radar&labels=%E9%80%9F%E5%BA%A6%2C%E8%B4%A8%E9%87%8F%2C%E4%BB%B7%E6%A0%BC%2C%E6%94%AF%E6%8C%81%2C%E4%BD%93%E9%AA%8C&values=85,90,70,80,95&title=%E4%BA%A7%E5%93%81
```

[![单对象（默认 base）](https://x-cmd.com/draw?type=radar&labels=%E9%80%9F%E5%BA%A6%2C%E8%B4%A8%E9%87%8F%2C%E4%BB%B7%E6%A0%BC%2C%E6%94%AF%E6%8C%81%2C%E4%BD%93%E9%AA%8C&values=85,90,70,80,95&title=%E4%BA%A7%E5%93%81)](https://x-cmd.com/draw/explore?type=radar&labels=%E9%80%9F%E5%BA%A6%2C%E8%B4%A8%E9%87%8F%2C%E4%BB%B7%E6%A0%BC%2C%E6%94%AF%E6%8C%81%2C%E4%BD%93%E9%AA%8C&values=85,90,70,80,95&title=%E4%BA%A7%E5%93%81)

**双对象（t=evil）**

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=%E9%80%9F%E5%BA%A6%2C%E8%B4%A8%E9%87%8F%2C%E4%BB%B7%E6%A0%BC%2C%E6%94%AF%E6%8C%81%2C%E4%BD%93%E9%AA%8C&series=A:85,90,70,80,95&series=B:75,85,90,70,80&title=%E5%AF%B9%E6%AF%94
```

[![双对象（t=evil）](https://x-cmd.com/draw?type=radar&t=evil&labels=%E9%80%9F%E5%BA%A6%2C%E8%B4%A8%E9%87%8F%2C%E4%BB%B7%E6%A0%BC%2C%E6%94%AF%E6%8C%81%2C%E4%BD%93%E9%AA%8C&series=A:85,90,70,80,95&series=B:75,85,90,70,80&title=%E5%AF%B9%E6%AF%94)](https://x-cmd.com/draw/explore?type=radar&t=evil&labels=%E9%80%9F%E5%BA%A6%2C%E8%B4%A8%E9%87%8F%2C%E4%BB%B7%E6%A0%BC%2C%E6%94%AF%E6%8C%81%2C%E4%BD%93%E9%AA%8C&series=A:85,90,70,80,95&series=B:75,85,90,70,80&title=%E5%AF%B9%E6%AF%94)

**三对象（t=evil）**

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=%E9%80%9F%E5%BA%A6%2C%E8%B4%A8%E9%87%8F%2C%E4%BB%B7%E6%A0%BC%2C%E6%94%AF%E6%8C%81%2C%E4%BD%93%E9%AA%8C&series=A:85,90,70,80,95&series=B:75,85,90,70,80&series=C:90,80,60,85,75&title=%E5%9F%BA%E5%87%86
```

[![三对象（t=evil）](https://x-cmd.com/draw?type=radar&t=evil&labels=%E9%80%9F%E5%BA%A6%2C%E8%B4%A8%E9%87%8F%2C%E4%BB%B7%E6%A0%BC%2C%E6%94%AF%E6%8C%81%2C%E4%BD%93%E9%AA%8C&series=A:85,90,70,80,95&series=B:75,85,90,70,80&series=C:90,80,60,85,75&title=%E5%9F%BA%E5%87%86)](https://x-cmd.com/draw/explore?type=radar&t=evil&labels=%E9%80%9F%E5%BA%A6%2C%E8%B4%A8%E9%87%8F%2C%E4%BB%B7%E6%A0%BC%2C%E6%94%AF%E6%8C%81%2C%E4%BD%93%E9%AA%8C&series=A:85,90,70,80,95&series=B:75,85,90,70,80&series=C:90,80,60,85,75&title=%E5%9F%BA%E5%87%86)

**像素风（t=xcmd）**

```text
https://x-cmd.com/draw?type=radar&t=xcmd&labels=%E9%80%9F%E5%BA%A6%2C%E6%96%87%E6%A1%A3%2C%E6%B5%8B%E8%AF%95%2C%E5%BC%80%E5%8F%91%E4%BD%93%E9%AA%8C%2Cci&values=8,6,9,7,5&title=%E5%81%A5%E5%BA%B7%E5%BA%A6
```

[![像素风（t=xcmd）](https://x-cmd.com/draw?type=radar&t=xcmd&labels=%E9%80%9F%E5%BA%A6%2C%E6%96%87%E6%A1%A3%2C%E6%B5%8B%E8%AF%95%2C%E5%BC%80%E5%8F%91%E4%BD%93%E9%AA%8C%2Cci&values=8,6,9,7,5&title=%E5%81%A5%E5%BA%B7%E5%BA%A6)](https://x-cmd.com/draw/explore?type=radar&t=xcmd&labels=%E9%80%9F%E5%BA%A6%2C%E6%96%87%E6%A1%A3%2C%E6%B5%8B%E8%AF%95%2C%E5%BC%80%E5%8F%91%E4%BD%93%E9%AA%8C%2Cci&values=8,6,9,7,5&title=%E5%81%A5%E5%BA%B7%E5%BA%A6)

多维对比的标配。**典型用法**：产品 / 候选人 / 方案 在多个维度上的评分。

---


**Edge vs 源站**

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=%E5%BB%B6%E8%BF%9F%2C%E5%90%9E%E5%90%90%2C%E9%94%99%E8%AF%AF%2C%E5%8F%AF%E7%94%A8%E6%80%A7%2C%E6%88%90%E6%9C%AC&series=edge:8,7,9,8,6&series=origin:6,8,7,9,5&title=%E8%BE%B9%E7%BC%98%20vs%20%E6%BA%90%E7%AB%99
```

[![Edge vs 源站](https://x-cmd.com/draw?type=radar&t=evil&labels=%E5%BB%B6%E8%BF%9F%2C%E5%90%9E%E5%90%90%2C%E9%94%99%E8%AF%AF%2C%E5%8F%AF%E7%94%A8%E6%80%A7%2C%E6%88%90%E6%9C%AC&series=edge:8,7,9,8,6&series=origin:6,8,7,9,5&title=%E8%BE%B9%E7%BC%98%20vs%20%E6%BA%90%E7%AB%99)](https://x-cmd.com/draw/explore?type=radar&t=evil&labels=%E5%BB%B6%E8%BF%9F%2C%E5%90%9E%E5%90%90%2C%E9%94%99%E8%AF%AF%2C%E5%8F%AF%E7%94%A8%E6%80%A7%2C%E6%88%90%E6%9C%AC&series=edge:8,7,9,8,6&series=origin:6,8,7,9,5&title=%E8%BE%B9%E7%BC%98%20vs%20%E6%BA%90%E7%AB%99)

**六维双系列**

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=a,b,c,d,e,f&series=x:8,6,9,7,5,8&series=y:5,7,6,8,9,6&title=%E5%85%AD%E7%BB%B4
```

[![六维双系列](https://x-cmd.com/draw?type=radar&t=evil&labels=a,b,c,d,e,f&series=x:8,6,9,7,5,8&series=y:5,7,6,8,9,6&title=%E5%85%AD%E7%BB%B4)](https://x-cmd.com/draw/explore?type=radar&t=evil&labels=a,b,c,d,e,f&series=x:8,6,9,7,5,8&series=y:5,7,6,8,9,6&title=%E5%85%AD%E7%BB%B4)

## 参数

| 参数 | 含义 | 必填 |
| --- | --- | --- |
| `labels=` | 维度名（轴标签） | ✓ |
| `values=` | 单对象各维度分数 | 单对象 ✓ |
| `series=A:v1,v2,...&series=B:v1,v2,...` | 多对象（叠放对比） | 多对象 ✓ |
| `title=` | 标题 | ✗ |

值域通常是 0-100（或 0-10）。**所有维度用同一个值域**才能公平对比。

---



---

## 踩坑

- **维度数 3-7 最佳**：< 3 看不出形状；> 7 太密
- **所有维度同值域**：混用 0-100 和 0-10 会失真
- **多对象时图例用 series 名**：A/B/C 是 series 标识，可以改成有意义的名字