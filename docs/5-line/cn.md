---
x-title: line 折线图 —— 时间序列标配
x-desc: x-cmd/draw `type=line` 用法速查。时间序列标配。参数：`x=` 时间标签 / `y=` 单系列 / `series=A:...,B:...` 多系列 / `title=` / `unit=`。点和线可分别控制样式。
x-sidebar: draw 折线图
x-keywords: line chart, 折线图, draw, svg, 时间序列, time series
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw line 折线图'
      inLanguage: 'zh-CN'
      about: 'x-cmd/draw 折线图'
---

# line 折线图 —— 时间序列标配

---

## 参数

| 参数 | 含义 | 必填 |
| --- | --- | --- |
| `x=` | X 轴标签（时间 / 类别） | ✓ |
| `y=` | 单系列数值 | 单系列 ✓ |
| `series=A:v1,v2,...&series=B:v1,v2,...` | 多系列 | 多系列 ✓ |
| `title=` / `unit=` | 标题 / 单位 | ✗ |
| `t=` | 风格 | — |

---

## 示例

```sh
# 单系列
curl "https://x-cmd.com/draw?type=line&x=Jan,Feb,Mar,Apr,May,Jul&y=10,20,15,30,25,40&title=Monthly%20growth"

# 多系列
curl "https://x-cmd.com/draw?type=line&x=Mon,Tue,Wed,Thu,Fri,Sat,Sun&series=Daytime:120,140,135,150,180,200,170&series=Nighttime:80,75,90,85,95,110,100"

# 带单位
curl "https://x-cmd.com/draw?type=line&x=Q1,Q2,Q3,Q4&series=Revenue:52400,38900,24150,16300&series=Cost:31200,28700,19800,14500&unit=USD&title=Quarterly%20P&L"
```

---

## 踩坑

- **点数 vs X 轴标签数**：X 标签 ≥ 数据点数，否则缺值；X 标签 < 数据点数则取前 N 个
- **多系列对齐**：所有系列必须长度相同，否则只画到最短的为止
- **极值**：Y 轴自动适配；如需固定范围，用 `ymin=` / `ymax=`