---
x-title: bar 柱状图 —— 分组柱 / 堆叠柱 / 单系列
x-desc: x-cmd/draw `type=bar` 用法速查。分组柱：`labels=` + 多 `series=A:...,B:...`；堆叠柱：同分组；单系列：`labels=` + `values=`。风格 `t=` 含 evil 等。完整参数：labels / values / series / title / unit / t / scheme / num / w/h。
x-sidebar: draw 柱状图
x-keywords: bar chart, 柱状图, draw, svg, evil, 分组柱, 堆叠柱
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw bar 柱状图'
      inLanguage: 'zh-CN'
      about: 'x-cmd/draw 柱状图类型用法'
---

# bar 柱状图 —— 分组柱 / 堆叠柱 / 单系列

---

## 一、参数

| 参数 | 含义 | 必填 |
| --- | --- | --- |
| `labels=` | X 轴标签，逗号分隔 | ✓ |
| `values=` | 单系列数值（Y 轴） | 单系列 ✓ |
| `series=A:v1,v2,...&series=B:v1,v2,...` | 多系列（分组或堆叠） | 分组多系列 ✓ |
| `title=` | 图表标题 | ✗ |
| `unit=` | 数值单位 | ✗ |
| `t=` | 风格（默认 `evil`） | — |

---

## 二、三种用法

### 单系列柱状图

`values=` 一个系列：

```sh
curl "https://x-cmd.com/draw?type=bar&labels=Jan,Feb,Mar,Apr,May&values=100,150,120,180,200"
```

### 分组柱（多系列并排）

多个 `series=A:...,B:...,C:...`：

```sh
curl "https://x-cmd.com/draw?type=bar&t=evil&labels=Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec&series=Desktop:34,87,51,63,45,78,39,92,65,53,80,27&series=Mobile:18,49,29,39,31,45,23,56,37,36,51,14"
```

### 堆叠柱（多系列叠加）

加 `stack=1`：

```sh
curl "https://x-cmd.com/draw?type=bar&stack=1&labels=Jan,Feb,Mar&series=A:10,20,30&series=B:5,15,25"
```

---

## 三、踩坑

- **分组 vs 堆叠**：默认分组；想堆叠加 `stack=1`
- **X 轴标签数**：≤ 50 比较清晰
- **多系列命名**：`series=A:...` 中的 `A` 是图例名，可以是中文
- **数值 0**：0 会被跳过（柱子高度为 0 时不画），这是设计行为