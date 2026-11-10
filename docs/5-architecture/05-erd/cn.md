---
x-title: 实体关系图 —— 表、字段,以及表之间的关系
x-desc: 'x-cmd/draw 实体关系图(`/draw/erd`)。一个表一个节点,字段表写在节点里(用 %0A 分行),关系写在边上。和架构图同一套 URL 模型。'
x-sidebar: draw 实体关系图
x-keywords: erd, entity relationship diagram, 实体关系图, draw, svg, 表结构
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 实体关系图'
      inLanguage: 'cn'
      about: 'x-cmd/draw 05-erd'
---

# 实体关系图 —— 表、字段,以及表之间的关系

一个表一个节点。字段表写在节点里,一行一个字段。关系是边,按你嘴上说的那样标。

```text
https://x-cmd.com/draw/erd?n=charts;table;charts;hash:string%20(pk)%250Atemplate:string%250Aspec:json%250Acreated_at:timestamp;r0c0&n=repos;table;repos;owner:string%20(pk)%250Aname:string%20(pk)%250Abranch:string%250Adata_repo:string;r1c0&n=branches;table;branches;repo:string%20(fk)%250Abranch:string%20(fk)%250Asha:string;r2c0&e=repos;branches;1:N&e=repos;charts;1:N
```

[![实体关系图](https://x-cmd.com/draw/erd?n=charts;table;charts;hash:string%20(pk)%250Atemplate:string%250Aspec:json%250Acreated_at:timestamp;r0c0&n=repos;table;repos;owner:string%20(pk)%250Aname:string%20(pk)%250Abranch:string%250Adata_repo:string;r1c0&n=branches;table;branches;repo:string%20(fk)%250Abranch:string%20(fk)%250Asha:string;r2c0&e=repos;branches;1:N&e=repos;charts;1:N)](https://x-cmd.com/draw/explore/erd?n=charts;table;charts;hash:string%20(pk)%250Atemplate:string%250Aspec:json%250Acreated_at:timestamp;r0c0&n=repos;table;repos;owner:string%20(pk)%250Aname:string%20(pk)%250Abranch:string%250Adata_repo:string;r1c0&n=branches;table;branches;repo:string%20(fk)%250Abranch:string%20(fk)%250Asha:string;r2c0&e=repos;branches;1:N&e=repos;charts;1:N)

这是 draw 自己的表:短链那个仓,以及它指着的 repos 和 branches。

## 一、参数

| 参数 | 含义 | 默认 |
|---|---|---|
| `n=` | 一个表:`id;类型;表名;字段表;位置` | — |
| `e=` | 一条关系:`起点;终点[;基数]` | — |
| `b=` | 一组:`名称;id id …` | — |
| `title=` | 图标题 | — |
| `w=` / `h=` | 画布尺寸 | 自然尺寸 |

## 二、字段表怎么写

字段表是节点的第四个字段,**行与行之间用 `%0A`**(URL 里的换行):

```
n=users;table;users;id:int (pk)%0Aname:text%0Acreated_at:timestamp;r0c0
```

这是三行:`id:int (pk)`、`name:text`、`created_at:timestamp`。
节点的第一个字段是表名,读者看到的是标题。

**键自己标** —— 主键写 `id:int (pk)`,外键写 `user_id:int (fk)`。draw 不猜。

## 三、词汇

| 类型 | 是什么 |
|---|---|
| `table` | 表 |
| `view` | 建在表上的视图 |

## 四、踩坑

- **字段表是第四个字段** —— `id;类型;表名;字段表;位置`。位置不写,表会自己排。
- **`%0A` 是换行,不是空格** —— 写成空格,整个列表就挤在一行。
- **基数写在边上**(`e=repos;charts;1:N`)—— draw 不会从字段名推出来。

