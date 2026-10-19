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

## 示例（URL 即所得，点击图片放大）

**CPU 使用率**

```text
https://x-cmd.com/draw?type=gauge&value=72&max=100&label=CPU%25&title=Server%20load
```

![CPU 使用率](https://x-cmd.com/draw?type=gauge&value=72&max=100&label=CPU%25&title=Server%20load)

**内存**

```text
https://x-cmd.com/draw?type=gauge&value=4.2&max=8&label=Memory%20(GB)&title=Memory%20usage
```

![内存](https://x-cmd.com/draw?type=gauge&value=4.2&max=8&label=Memory%20(GB)&title=Memory%20usage)

**进度**

```text
https://x-cmd.com/draw?type=gauge&value=340&max=500&label=Tickets%20resolved&title=Sprint
```

![进度](https://x-cmd.com/draw?type=gauge&value=340&max=500&label=Tickets%20resolved&title=Sprint)

**SLA**

```text
https://x-cmd.com/draw?type=gauge&value=99.95&max=100&label=SLA%25&unit=%25
```

![SLA](https://x-cmd.com/draw?type=gauge&value=99.95&max=100&label=SLA%25&unit=%25)

**多环（labels+values）**

```text
https://x-cmd.com/draw?type=gauge&labels=cpu,mem,io&values=72,58,40&max=100&title=Node%20health
```

![多环（labels+values）](https://x-cmd.com/draw?type=gauge&labels=cpu,mem,io&values=72,58,40&max=100&title=Node%20health)

**渐变（t=gradient）**

```text
https://x-cmd.com/draw?type=gauge&t=gradient&title=CI%20pass%20rate&value=87&max=100
```

![渐变（t=gradient）](https://x-cmd.com/draw?type=gauge&t=gradient&title=CI%20pass%20rate&value=87&max=100)

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

- **不要画多个 gauge**：一次只画一个；多对象用 [18-combo](18-combo) 或 [13-line](13-line)
- **`max` 别太小**：会让指针冲到顶，丢失精度
- **配合暗色主题**：仪表盘在暗色下颜色变化更明显