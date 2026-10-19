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

## 示例（URL 即所得，点击图片放大）

**用户转化漏斗**

```text
https://x-cmd.com/draw?type=sankey&labels=Visitor,Signup,Active,Paid,Churn&links=Visitor>Signup:1000;Signup>Active:600;Active>Paid:200;Active>Churn:300&title=User%20conversion
```

![用户转化漏斗](https://x-cmd.com/draw?type=sankey&labels=Visitor,Signup,Active,Paid,Churn&links=Visitor>Signup:1000;Signup>Active:600;Active>Paid:200;Active>Churn:300&title=User%20conversion)

**能源流（多源→多汇）**

```text
https://x-cmd.com/draw?type=sankey&labels=Solar,Wind,Nuclear,Grid,Home,Industry&links=Solar>Grid:500;Wind>Grid:800;Nuclear>Grid:300;Grid>Home:400;Grid>Industry:1200&title=Energy%20flow
```

![能源流（多源→多汇）](https://x-cmd.com/draw?type=sankey&labels=Solar,Wind,Nuclear,Grid,Home,Industry&links=Solar>Grid:500;Wind>Grid:800;Nuclear>Grid:300;Grid>Home:400;Grid>Industry:1200&title=Energy%20flow)

**PR 生命周期（类型→结果→时段）**

```text
https://x-cmd.com/draw?type=sankey&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y+&links=feat>merged:38;feat>closed:12;feat>rejected:8;fix>merged:33;fix>closed:6;fix>rejected:2;docs>merged:16;docs>closed:4;chore>merged:5;chore>closed:6;chore>rejected:6;merged>0-1y:52;merged>1-2y:28;merged>2y+:12;closed>0-1y:14;closed>1-2y:9;closed>2y+:5;rejected>0-1y:9;rejected>1-2y:5;rejected>2y+:2&title=Pull%20requests%20lifecycle&unit=prs
```

![PR 生命周期（类型→结果→时段）](https://x-cmd.com/draw?type=sankey&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y+&links=feat>merged:38;feat>closed:12;feat>rejected:8;fix>merged:33;fix>closed:6;fix>rejected:2;docs>merged:16;docs>closed:4;chore>merged:5;chore>closed:6;chore>rejected:6;merged>0-1y:52;merged>1-2y:28;merged>2y+:12;closed>0-1y:14;closed>1-2y:9;closed>2y+:5;rejected>0-1y:9;rejected>1-2y:5;rejected>2y+:2&title=Pull%20requests%20lifecycle&unit=prs)

**资金流向（t=fund）**

```text
https://x-cmd.com/draw?type=sankey&t=fund&labels=Fees,Grants,Core,Ops,Docs&links=Fees>Core:50;Fees>Ops:20;Grants>Docs:30;Grants>Ops:10&title=Budget
```

![资金流向（t=fund）](https://x-cmd.com/draw?type=sankey&t=fund&labels=Fees,Grants,Core,Ops,Docs&links=Fees>Core:50;Fees>Ops:20;Grants>Docs:30;Grants>Ops:10&title=Budget)

**管线风（t=pipeline）**

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=Visitors,Stars,Forks,PRs,Merged&links=Visitors>Stars:84;Visitors>Forks:18;Stars>Forks:17;Forks>PRs:9;Visitors>PRs:3;PRs>Merged:7&title=Contributor%20funnel&unit=users
```

![管线风（t=pipeline）](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=Visitors,Stars,Forks,PRs,Merged&links=Visitors>Stars:84;Visitors>Forks:18;Stars>Forks:17;Forks>PRs:9;Visitors>PRs:3;PRs>Merged:7&title=Contributor%20funnel&unit=users)

**典型用法**：流量从来源 → 中间步骤 → 终点 的转化路径（如：用户从搜索 → 落地 → 注册 → 付费）。

---

## 参数

| 参数 | 含义 | 必填 |
| --- | --- | --- |
| `nodes=` | 节点列表，逗号分隔 | ✓ |
| `links=source,target,value;...` | 连接：源 → 目标 → 值；分号分隔多条 | ✓ |
| `title=` | 标题 | ✗ |

---



---

## 踩坑

- **节点名引用**：links 里的 `source`/`target` 必须**精确匹配** nodes 里的字符串
- **节点数 ≤ 20**：图变密集；超过考虑分组
- **值为 0 的 link 不画**：用于隐藏不需要强调的路径
- **JSON 写法更适合**：节点多、连接复杂时用 `?d=` JSON