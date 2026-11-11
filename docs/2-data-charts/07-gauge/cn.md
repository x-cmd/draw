---
x-title: gauge 仪表盘 —— 单值监控
x-desc: x-cmd/draw `type=gauge` 用法速查。单值监控（CPU / 内存 / 进度 / 完成率）。参数：`value=` 当前值，`max=` 最大值（默认 100），`label=` 名称，`t=` 风格。
x-sidebar: draw 仪表盘
x-keywords: gauge, 仪表盘, gauge dial, draw, svg, 单值监控
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw gauge 仪表盘'
      inLanguage: 'zh-CN'
      about: 'x-cmd/draw 仪表盘'
---

# gauge 仪表盘 —— 单值监控

## 示例（URL 即所得，点击图片进入交互页）

**CPU 使用率**

```text
https://x-cmd.com/draw?type=gauge&value=72&max=100&label=CPU%25&title=%E6%9C%8D%E5%8A%A1%E5%99%A8%E8%B4%9F%E8%BD%BD
```

[![CPU 使用率](https://x-cmd.com/draw?type=gauge&value=72&max=100&label=CPU%25&title=%E6%9C%8D%E5%8A%A1%E5%99%A8%E8%B4%9F%E8%BD%BD)](https://x-cmd.com/draw/explore?type=gauge&value=72&max=100&label=CPU%25&title=%E6%9C%8D%E5%8A%A1%E5%99%A8%E8%B4%9F%E8%BD%BD)

**内存**

```text
https://x-cmd.com/draw?type=gauge&value=4.2&max=8&label=内存%20%28GB%29&title=内存用量
```

[![内存](https://x-cmd.com/draw?type=gauge&value=4.2&max=8&label=内存%20%28GB%29&title=内存用量)](https://x-cmd.com/draw/explore?type=gauge&value=4.2&max=8&label=内存%20%28GB%29&title=内存用量)

**进度**

```text
https://x-cmd.com/draw?type=gauge&value=340&max=500&label=%E5%B7%B2%E5%A4%84%E7%90%86%E5%B7%A5%E5%8D%95&title=%E5%86%B2%E5%88%BA%E8%BF%9B%E5%BA%A6
```

[![进度](https://x-cmd.com/draw?type=gauge&value=340&max=500&label=%E5%B7%B2%E5%A4%84%E7%90%86%E5%B7%A5%E5%8D%95&title=%E5%86%B2%E5%88%BA%E8%BF%9B%E5%BA%A6)](https://x-cmd.com/draw/explore?type=gauge&value=340&max=500&label=%E5%B7%B2%E5%A4%84%E7%90%86%E5%B7%A5%E5%8D%95&title=%E5%86%B2%E5%88%BA%E8%BF%9B%E5%BA%A6)

**SLA**

```text
https://x-cmd.com/draw?type=gauge&value=99.95&max=100&label=SLA%25&unit=%25
```

[![SLA](https://x-cmd.com/draw?type=gauge&value=99.95&max=100&label=SLA%25&unit=%25)](https://x-cmd.com/draw/explore?type=gauge&value=99.95&max=100&label=SLA%25&unit=%25)

**多环（labels+values）**

```text
https://x-cmd.com/draw?type=gauge&labels=CPU%2C%E5%86%85%E5%AD%98%2CIO&values=72,58,40&max=100&title=%E8%8A%82%E7%82%B9%E5%81%A5%E5%BA%B7%E5%BA%A6
```

[![多环（labels+values）](https://x-cmd.com/draw?type=gauge&labels=CPU%2C%E5%86%85%E5%AD%98%2CIO&values=72,58,40&max=100&title=%E8%8A%82%E7%82%B9%E5%81%A5%E5%BA%B7%E5%BA%A6)](https://x-cmd.com/draw/explore?type=gauge&labels=CPU%2C%E5%86%85%E5%AD%98%2CIO&values=72,58,40&max=100&title=%E8%8A%82%E7%82%B9%E5%81%A5%E5%BA%B7%E5%BA%A6)

**渐变（t=gradient）**

```text
https://x-cmd.com/draw?type=gauge&t=gradient&title=CI%20%E9%80%9A%E8%BF%87%E7%8E%87&value=87&max=100
```

[![渐变（t=gradient）](https://x-cmd.com/draw?type=gauge&t=gradient&title=CI%20%E9%80%9A%E8%BF%87%E7%8E%87&value=87&max=100)](https://x-cmd.com/draw/explore?type=gauge&t=gradient&title=CI%20%E9%80%9A%E8%BF%87%E7%8E%87&value=87&max=100)

单值的"进度仪表"。**典型用法**：CPU / 内存 / SLA / 完成率 / 当前值 vs 目标。

---

## 参数

| 参数 | 含义 | 默认 |
| --- | --- | --- |
| `value=` | 当前值 | ✓ |
| `max=` | 最大值（满量程） | 100 |
| `label=` | 表盘名称 | — |
| `t=` | 风格（默认带颜色变化） | — |
| `unit=` | 单位 | — |

---



---

## 踩坑

- **不要画多个 gauge**：一次只画一个；多对象用 [combo](../09-combo/cn.md) 或 [line](../04-line/cn.md)
- **`max` 别太小**：会让指针冲到顶，丢失精度
- **配合暗色主题**：仪表盘在暗色下颜色变化更明显