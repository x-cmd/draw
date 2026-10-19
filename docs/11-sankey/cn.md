---
x-title: sankey 桑基图 —— 流量 / 转化路径
x-desc: x-cmd/draw `type=sankey` 用法速查。流量 / 转化路径可视化（用户从来源 → 中间步骤 → 终点）。参数：nodes + links 描述流。
x-sidebar: draw sankey 桑基图
x-keywords: sankey diagram, 桑基图, draw, svg, 流量, 转化路径
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw sankey 桑基图'
      inLanguage: 'zh-CN'
      about: 'x-cmd/draw 桑基图'
---

# sankey 桑基图 —— 流量 / 转化路径

**典型用法**：流量从来源 → 中间步骤 → 终点 的转化路径（如：用户从搜索 → 落地 → 注册 → 付费）。

---

## 参数

| 参数 | 含义 | 必填 |
| --- | --- | --- |
| `nodes=` | 节点列表，逗号分隔 | ✓ |
| `links=source,target,value;...` | 连接：源 → 目标 → 值；分号分隔多条 | ✓ |
| `title=` | 标题 | ✗ |

---

## 示例

```sh
# 用户转化漏斗
curl "https://x-cmd.com/draw?type=sankey&nodes=Visitor,Signup,Active,Paid,Churn&links=Visitor,Signup,1000;Signup,Active,600;Active,Paid,200;Active,Churn,300&title=User%20conversion"

# 能源流（多源 → 多汇）
curl "https://x-cmd.com/draw?type=sankey&nodes=Solar,Wind,Nuclear,Grid,Home,Industry&links=Solar,Grid,500;Wind,Grid,800;Nuclear,Grid,300;Grid,Home,400;Grid,Industry,1200&title=Energy%20flow"
```

---

## 踩坑

- **节点名引用**：links 里的 `source`/`target` 必须**精确匹配** nodes 里的字符串
- **节点数 ≤ 20**：图变密集；超过考虑分组
- **值为 0 的 link 不画**：用于隐藏不需要强调的路径
- **JSON 写法更适合**：节点多、连接复杂时用 `?d=` JSON