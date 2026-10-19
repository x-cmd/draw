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

多维对比的标配。**典型用法**：产品 / 候选人 / 方案 在多个维度上的评分。

---

## 参数

| 参数 | 含义 | 必填 |
| --- | --- | --- |
| `labels=` | 维度名（轴标签） | ✓ |
| `values=` | 单对象各维度分数 | 单对象 ✓ |
| `series=A:v1,v2,...&series=B:v1,v2,...` | 多对象（叠放对比） | 多对象 ✓ |
| `title=` | 标题 | ✗ |

值域通常是 0-100（或 0-10）。**所有维度用同一个值域**才能公平对比。

---

## 示例

```sh
# 单对象
curl "https://x-cmd.com/draw?type=radar&labels=Speed,Quality,Price,Support,UX&values=85,90,70,80,95&title=Product%20A"

# 多对象对比
curl "https://x-cmd.com/draw?type=radar&labels=Speed,Quality,Price,Support,UX&series=A:85,90,70,80,95&series=B:75,85,90,70,80&series=C:90,80,60,85,75&title=Product%20comparison"
```

---

## 踩坑

- **维度数 3-7 最佳**：< 3 看不出形状；> 7 太密
- **所有维度同值域**：混用 0-100 和 0-10 会失真
- **多对象时图例用 series 名**：A/B/C 是 series 标识，可以改成有意义的名字