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

每一行画成一条**字段行**:名字靠左,类型靠右(等宽字体,一列类型上下对齐),
前面还有一个键标记角标。

**键自己标** —— 主键写 `id:int (pk)`,外键写 `user_id:int (fk)`,
唯一键写 `slug:text (uk)`。draw 不猜,只照着标记画角标。

## 三、词汇

| 类型 | 是什么 |
|---|---|
| `table` | 表 |
| `view` | 建在表上的视图 |

## 四、踩坑

- **字段表是第四个字段** —— `id;类型;表名;字段表;位置`。位置不写,表会自己排。
- **`%0A` 是换行,不是空格** —— 写成空格,整个列表就挤在一行。
- **基数写在边上**(`e=repos;charts;1:N`)—— draw 不会从字段名推出来。
  标签写成基数时,边两端就画成标准记号:「一」那端是一根横杠,「多」那端是鱼尾。
- **基数后面可以跟一个动词**(`e=repos;charts;1:N placed by`)—— 基数画记号,
  动词留在标签上。
- **URL 里的 `+` 是空格。** 字段名开头要写真的加号,得写成 `%2B` ——
  查询串里裸的 `+` 会被当成空格。

## 五、位置不用写 —— 按关系自动分层

不写 `r0c1` 的话,以前是按你写的顺序往网格里塞 —— 十几张表就看不出谁引谁了。
现在 ERD 会**按外键关系分层**:没人引用的表在左边,引用别人的表往右挪,
一列就是一层关系:

```text
https://x-cmd.com/draw/erd?n=users;table;users;id:uuid%20%28pk%29%0Aemail:text%20%28uk%29%0Acreated_at:timestamp&n=products;table;products;id:uuid%20%28pk%29%0Asku:text%20%28uk%29%0Aname:text%0Aprice_cents:int%0Aactive:bool&n=inventory;table;inventory;product_id:uuid%20%28fk%29%0Awarehouse_id:uuid%20%28fk%29%0Aon_hand:int%0Areserved:int&n=warehouses;table;warehouses;id:uuid%20%28pk%29%0Acode:text%20%28uk%29%0Acity:text&n=orders;table;orders;id:uuid%20%28pk%29%0Auser_id:uuid%20%28fk%29%0Astatus:text%0Atotal_cents:int%0Aplaced_at:timestamp&n=order_items;table;order_items;order_id:uuid%20%28fk%29%0Aproduct_id:uuid%20%28fk%29%0Aqty:int%0Aunit_price_cents:int&n=payments;table;payments;id:uuid%20%28pk%29%0Aorder_id:uuid%20%28fk%29%0Aprovider:text%0Aamount_cents:int%0Acaptured_at:timestamp&n=shipments;table;shipments;id:uuid%20%28pk%29%0Aorder_id:uuid%20%28fk%29%0Acarrier:text%0Atracking_no:text%0Ashipped_at:timestamp&e=users;orders;1:N&e=orders;order_items;1:N&e=products;order_items;1:N&e=products;inventory;1:N&e=warehouses;inventory;1:N&e=orders;payments;1:1&e=orders;shipments;1:N&title=Orders,%20inventory%20and%20payments&w=760
```

[![Orders, inventory and payments](https://x-cmd.com/draw/erd?n=users;table;users;id:uuid%20%28pk%29%0Aemail:text%20%28uk%29%0Acreated_at:timestamp&n=products;table;products;id:uuid%20%28pk%29%0Asku:text%20%28uk%29%0Aname:text%0Aprice_cents:int%0Aactive:bool&n=inventory;table;inventory;product_id:uuid%20%28fk%29%0Awarehouse_id:uuid%20%28fk%29%0Aon_hand:int%0Areserved:int&n=warehouses;table;warehouses;id:uuid%20%28pk%29%0Acode:text%20%28uk%29%0Acity:text&n=orders;table;orders;id:uuid%20%28pk%29%0Auser_id:uuid%20%28fk%29%0Astatus:text%0Atotal_cents:int%0Aplaced_at:timestamp&n=order_items;table;order_items;order_id:uuid%20%28fk%29%0Aproduct_id:uuid%20%28fk%29%0Aqty:int%0Aunit_price_cents:int&n=payments;table;payments;id:uuid%20%28pk%29%0Aorder_id:uuid%20%28fk%29%0Aprovider:text%0Aamount_cents:int%0Acaptured_at:timestamp&n=shipments;table;shipments;id:uuid%20%28pk%29%0Aorder_id:uuid%20%28fk%29%0Acarrier:text%0Atracking_no:text%0Ashipped_at:timestamp&e=users;orders;1:N&e=orders;order_items;1:N&e=products;order_items;1:N&e=products;inventory;1:N&e=warehouses;inventory;1:N&e=orders;payments;1:1&e=orders;shipments;1:N&title=Orders,%20inventory%20and%20payments&w=760)](https://x-cmd.com/draw/explore/erd?n=users;table;users;id:uuid%20%28pk%29%0Aemail:text%20%28uk%29%0Acreated_at:timestamp&n=products;table;products;id:uuid%20%28pk%29%0Asku:text%20%28uk%29%0Aname:text%0Aprice_cents:int%0Aactive:bool&n=inventory;table;inventory;product_id:uuid%20%28fk%29%0Awarehouse_id:uuid%20%28fk%29%0Aon_hand:int%0Areserved:int&n=warehouses;table;warehouses;id:uuid%20%28pk%29%0Acode:text%20%28uk%29%0Acity:text&n=orders;table;orders;id:uuid%20%28pk%29%0Auser_id:uuid%20%28fk%29%0Astatus:text%0Atotal_cents:int%0Aplaced_at:timestamp&n=order_items;table;order_items;order_id:uuid%20%28fk%29%0Aproduct_id:uuid%20%28fk%29%0Aqty:int%0Aunit_price_cents:int&n=payments;table;payments;id:uuid%20%28pk%29%0Aorder_id:uuid%20%28fk%29%0Aprovider:text%0Aamount_cents:int%0Acaptured_at:timestamp&n=shipments;table;shipments;id:uuid%20%28pk%29%0Aorder_id:uuid%20%28fk%29%0Acarrier:text%0Atracking_no:text%0Ashipped_at:timestamp&e=users;orders;1:N&e=orders;order_items;1:N&e=products;order_items;1:N&e=products;inventory;1:N&e=warehouses;inventory;1:N&e=orders;payments;1:1&e=orders;shipments;1:N&title=Orders,%20inventory%20and%20payments&w=760)

`users`/`products`/`warehouses` 在第一列,`orders`/`inventory` 在第二列,
`order_items`/`payments`/`shipments` 在第三列 —— 从左往右读就是数据流的方向。

想自己摆位置照旧(`r0c1`),写了位置的表不听自动摆的。

## 六、真实案例

### 电商:订单、库存与支付

```text
https://x-cmd.com/draw/erd?n=users;table;users;id:uuid%20%28pk%29%0Aemail:text%20%28uk%29%0Acreated_at:timestamp&n=products;table;products;id:uuid%20%28pk%29%0Asku:text%20%28uk%29%0Aname:text%0Aprice_cents:int%0Aactive:bool&n=inventory;table;inventory;product_id:uuid%20%28fk%29%0Awarehouse_id:uuid%20%28fk%29%0Aon_hand:int%0Areserved:int&n=warehouses;table;warehouses;id:uuid%20%28pk%29%0Acode:text%20%28uk%29%0Acity:text&n=orders;table;orders;id:uuid%20%28pk%29%0Auser_id:uuid%20%28fk%29%0Astatus:text%0Atotal_cents:int%0Aplaced_at:timestamp&n=order_items;table;order_items;order_id:uuid%20%28fk%29%0Aproduct_id:uuid%20%28fk%29%0Aqty:int%0Aunit_price_cents:int&n=payments;table;payments;id:uuid%20%28pk%29%0Aorder_id:uuid%20%28fk%29%0Aprovider:text%0Aamount_cents:int%0Acaptured_at:timestamp&n=shipments;table;shipments;id:uuid%20%28pk%29%0Aorder_id:uuid%20%28fk%29%0Acarrier:text%0Atracking_no:text%0Ashipped_at:timestamp&e=users;orders;1:N&e=orders;order_items;1:N&e=products;order_items;1:N&e=products;inventory;1:N&e=warehouses;inventory;1:N&e=orders;payments;1:1&e=orders;shipments;1:N&title=Orders,%20inventory%20and%20payments&w=760
```

[![Orders, inventory and payments](https://x-cmd.com/draw/erd?n=users;table;users;id:uuid%20%28pk%29%0Aemail:text%20%28uk%29%0Acreated_at:timestamp&n=products;table;products;id:uuid%20%28pk%29%0Asku:text%20%28uk%29%0Aname:text%0Aprice_cents:int%0Aactive:bool&n=inventory;table;inventory;product_id:uuid%20%28fk%29%0Awarehouse_id:uuid%20%28fk%29%0Aon_hand:int%0Areserved:int&n=warehouses;table;warehouses;id:uuid%20%28pk%29%0Acode:text%20%28uk%29%0Acity:text&n=orders;table;orders;id:uuid%20%28pk%29%0Auser_id:uuid%20%28fk%29%0Astatus:text%0Atotal_cents:int%0Aplaced_at:timestamp&n=order_items;table;order_items;order_id:uuid%20%28fk%29%0Aproduct_id:uuid%20%28fk%29%0Aqty:int%0Aunit_price_cents:int&n=payments;table;payments;id:uuid%20%28pk%29%0Aorder_id:uuid%20%28fk%29%0Aprovider:text%0Aamount_cents:int%0Acaptured_at:timestamp&n=shipments;table;shipments;id:uuid%20%28pk%29%0Aorder_id:uuid%20%28fk%29%0Acarrier:text%0Atracking_no:text%0Ashipped_at:timestamp&e=users;orders;1:N&e=orders;order_items;1:N&e=products;order_items;1:N&e=products;inventory;1:N&e=warehouses;inventory;1:N&e=orders;payments;1:1&e=orders;shipments;1:N&title=Orders,%20inventory%20and%20payments&w=760)](https://x-cmd.com/draw/explore/erd?n=users;table;users;id:uuid%20%28pk%29%0Aemail:text%20%28uk%29%0Acreated_at:timestamp&n=products;table;products;id:uuid%20%28pk%29%0Asku:text%20%28uk%29%0Aname:text%0Aprice_cents:int%0Aactive:bool&n=inventory;table;inventory;product_id:uuid%20%28fk%29%0Awarehouse_id:uuid%20%28fk%29%0Aon_hand:int%0Areserved:int&n=warehouses;table;warehouses;id:uuid%20%28pk%29%0Acode:text%20%28uk%29%0Acity:text&n=orders;table;orders;id:uuid%20%28pk%29%0Auser_id:uuid%20%28fk%29%0Astatus:text%0Atotal_cents:int%0Aplaced_at:timestamp&n=order_items;table;order_items;order_id:uuid%20%28fk%29%0Aproduct_id:uuid%20%28fk%29%0Aqty:int%0Aunit_price_cents:int&n=payments;table;payments;id:uuid%20%28pk%29%0Aorder_id:uuid%20%28fk%29%0Aprovider:text%0Aamount_cents:int%0Acaptured_at:timestamp&n=shipments;table;shipments;id:uuid%20%28pk%29%0Aorder_id:uuid%20%28fk%29%0Acarrier:text%0Atracking_no:text%0Ashipped_at:timestamp&e=users;orders;1:N&e=orders;order_items;1:N&e=products;order_items;1:N&e=products;inventory;1:N&e=warehouses;inventory;1:N&e=orders;payments;1:1&e=orders;shipments;1:N&title=Orders,%20inventory%20and%20payments&w=760)


### 多租户 SaaS

```text
https://x-cmd.com/draw/erd?n=tenants;table;tenants;id:uuid%20%28pk%29%0Aslug:text%20%28uk%29%0Aplan:text%0Acreated_at:timestamp&n=users;table;users;id:uuid%20%28pk%29%0Aemail:text%20%28uk%29%0Acreated_at:timestamp&n=memberships;table;memberships;tenant_id:uuid%20%28fk%29%0Auser_id:uuid%20%28fk%29%0Arole:text%0Ajoined_at:timestamp&n=projects;table;projects;id:uuid%20%28pk%29%0Atenant_id:uuid%20%28fk%29%0Aname:text%0Aarchived_at:timestamp&n=tasks;table;tasks;id:uuid%20%28pk%29%0Aproject_id:uuid%20%28fk%29%0Aassignee_id:uuid%20%28fk%29%0Atitle:text%0Astatus:text%0Adue_at:timestamp&n=comments;table;comments;id:uuid%20%28pk%29%0Atask_id:uuid%20%28fk%29%0Aauthor_id:uuid%20%28fk%29%0Abody:text%0Acreated_at:timestamp&n=api_keys;table;api_keys;id:uuid%20%28pk%29%0Atenant_id:uuid%20%28fk%29%0Aprefix:text%20%28uk%29%0Asecret_hash:text%0Alast_used_at:timestamp&n=audit_log;table;audit_log;id:uuid%20%28pk%29%0Atenant_id:uuid%20%28fk%29%0Aactor_id:uuid%20%28fk%29%0Aaction:text%0Aat:timestamp&e=tenants;memberships;1:N&e=users;memberships;1:N&e=tenants;projects;1:N&e=projects;tasks;1:N&e=users;tasks;1:N&e=tasks;comments;1:N&e=users;comments;1:N&e=tenants;api_keys;1:N&e=tenants;audit_log;1:N&title=Multi-tenant%20SaaS&w=760
```

[![Multi-tenant SaaS](https://x-cmd.com/draw/erd?n=tenants;table;tenants;id:uuid%20%28pk%29%0Aslug:text%20%28uk%29%0Aplan:text%0Acreated_at:timestamp&n=users;table;users;id:uuid%20%28pk%29%0Aemail:text%20%28uk%29%0Acreated_at:timestamp&n=memberships;table;memberships;tenant_id:uuid%20%28fk%29%0Auser_id:uuid%20%28fk%29%0Arole:text%0Ajoined_at:timestamp&n=projects;table;projects;id:uuid%20%28pk%29%0Atenant_id:uuid%20%28fk%29%0Aname:text%0Aarchived_at:timestamp&n=tasks;table;tasks;id:uuid%20%28pk%29%0Aproject_id:uuid%20%28fk%29%0Aassignee_id:uuid%20%28fk%29%0Atitle:text%0Astatus:text%0Adue_at:timestamp&n=comments;table;comments;id:uuid%20%28pk%29%0Atask_id:uuid%20%28fk%29%0Aauthor_id:uuid%20%28fk%29%0Abody:text%0Acreated_at:timestamp&n=api_keys;table;api_keys;id:uuid%20%28pk%29%0Atenant_id:uuid%20%28fk%29%0Aprefix:text%20%28uk%29%0Asecret_hash:text%0Alast_used_at:timestamp&n=audit_log;table;audit_log;id:uuid%20%28pk%29%0Atenant_id:uuid%20%28fk%29%0Aactor_id:uuid%20%28fk%29%0Aaction:text%0Aat:timestamp&e=tenants;memberships;1:N&e=users;memberships;1:N&e=tenants;projects;1:N&e=projects;tasks;1:N&e=users;tasks;1:N&e=tasks;comments;1:N&e=users;comments;1:N&e=tenants;api_keys;1:N&e=tenants;audit_log;1:N&title=Multi-tenant%20SaaS&w=760)](https://x-cmd.com/draw/explore/erd?n=tenants;table;tenants;id:uuid%20%28pk%29%0Aslug:text%20%28uk%29%0Aplan:text%0Acreated_at:timestamp&n=users;table;users;id:uuid%20%28pk%29%0Aemail:text%20%28uk%29%0Acreated_at:timestamp&n=memberships;table;memberships;tenant_id:uuid%20%28fk%29%0Auser_id:uuid%20%28fk%29%0Arole:text%0Ajoined_at:timestamp&n=projects;table;projects;id:uuid%20%28pk%29%0Atenant_id:uuid%20%28fk%29%0Aname:text%0Aarchived_at:timestamp&n=tasks;table;tasks;id:uuid%20%28pk%29%0Aproject_id:uuid%20%28fk%29%0Aassignee_id:uuid%20%28fk%29%0Atitle:text%0Astatus:text%0Adue_at:timestamp&n=comments;table;comments;id:uuid%20%28pk%29%0Atask_id:uuid%20%28fk%29%0Aauthor_id:uuid%20%28fk%29%0Abody:text%0Acreated_at:timestamp&n=api_keys;table;api_keys;id:uuid%20%28pk%29%0Atenant_id:uuid%20%28fk%29%0Aprefix:text%20%28uk%29%0Asecret_hash:text%0Alast_used_at:timestamp&n=audit_log;table;audit_log;id:uuid%20%28pk%29%0Atenant_id:uuid%20%28fk%29%0Aactor_id:uuid%20%28fk%29%0Aaction:text%0Aat:timestamp&e=tenants;memberships;1:N&e=users;memberships;1:N&e=tenants;projects;1:N&e=projects;tasks;1:N&e=users;tasks;1:N&e=tasks;comments;1:N&e=users;comments;1:N&e=tenants;api_keys;1:N&e=tenants;audit_log;1:N&title=Multi-tenant%20SaaS&w=760)

租户隔离的那张表(`tenants`)在最左,凡是有 `tenant_id` 的都挂在它右边。

### WordPress 的核心表(真实 schema)

```text
https://x-cmd.com/draw/erd?n=users;table;wp_users;ID:bigint%20%28pk%29%0Auser_login:varchar%20%28uk%29%0Auser_email:varchar%20%28uk%29%0Auser_registered:datetime%0Auser_status:int&n=posts;table;wp_posts;ID:bigint%20%28pk%29%0Apost_author:bigint%20%28fk%29%0Apost_parent:bigint%20%28fk%29%0Apost_title:text%0Apost_status:varchar%0Apost_type:varchar%0Apost_date:datetime&n=postmeta;table;wp_postmeta;meta_id:bigint%20%28pk%29%0Apost_id:bigint%20%28fk%29%0Ameta_key:varchar%0Ameta_value:longtext&n=comments;table;wp_comments;comment_ID:bigint%20%28pk%29%0Acomment_post_ID:bigint%20%28fk%29%0Auser_id:bigint%20%28fk%29%0Acomment_content:text%0Acomment_date:datetime&n=terms;table;wp_terms;term_id:bigint%20%28pk%29%0Aname:varchar%0Aslug:varchar%20%28uk%29&n=term_taxonomy;table;wp_term_taxonomy;term_taxonomy_id:bigint%20%28pk%29%0Aterm_id:bigint%20%28fk%29%0Ataxonomy:varchar%0Aparent:bigint%20%28fk%29%0Acount:bigint&n=term_relationships;table;wp_term_relationships;object_id:bigint%20%28fk%29%0Aterm_taxonomy_id:bigint%20%28fk%29%0Aterm_order:int&n=options;table;wp_options;option_id:bigint%20%28pk%29%0Aoption_name:varchar%20%28uk%29%0Aoption_value:longtext%0Aautoload:varchar&e=users;posts;1:N&e=users;comments;1:N&e=posts;postmeta;1:N&e=posts;comments;1:N&e=posts;term_relationships;1:N&e=terms;term_taxonomy;1:N&e=term_taxonomy;term_relationships;1:N&title=WordPress%20core%20tables&w=760
```

[![WordPress core tables](https://x-cmd.com/draw/erd?n=users;table;wp_users;ID:bigint%20%28pk%29%0Auser_login:varchar%20%28uk%29%0Auser_email:varchar%20%28uk%29%0Auser_registered:datetime%0Auser_status:int&n=posts;table;wp_posts;ID:bigint%20%28pk%29%0Apost_author:bigint%20%28fk%29%0Apost_parent:bigint%20%28fk%29%0Apost_title:text%0Apost_status:varchar%0Apost_type:varchar%0Apost_date:datetime&n=postmeta;table;wp_postmeta;meta_id:bigint%20%28pk%29%0Apost_id:bigint%20%28fk%29%0Ameta_key:varchar%0Ameta_value:longtext&n=comments;table;wp_comments;comment_ID:bigint%20%28pk%29%0Acomment_post_ID:bigint%20%28fk%29%0Auser_id:bigint%20%28fk%29%0Acomment_content:text%0Acomment_date:datetime&n=terms;table;wp_terms;term_id:bigint%20%28pk%29%0Aname:varchar%0Aslug:varchar%20%28uk%29&n=term_taxonomy;table;wp_term_taxonomy;term_taxonomy_id:bigint%20%28pk%29%0Aterm_id:bigint%20%28fk%29%0Ataxonomy:varchar%0Aparent:bigint%20%28fk%29%0Acount:bigint&n=term_relationships;table;wp_term_relationships;object_id:bigint%20%28fk%29%0Aterm_taxonomy_id:bigint%20%28fk%29%0Aterm_order:int&n=options;table;wp_options;option_id:bigint%20%28pk%29%0Aoption_name:varchar%20%28uk%29%0Aoption_value:longtext%0Aautoload:varchar&e=users;posts;1:N&e=users;comments;1:N&e=posts;postmeta;1:N&e=posts;comments;1:N&e=posts;term_relationships;1:N&e=terms;term_taxonomy;1:N&e=term_taxonomy;term_relationships;1:N&title=WordPress%20core%20tables&w=760)](https://x-cmd.com/draw/explore/erd?n=users;table;wp_users;ID:bigint%20%28pk%29%0Auser_login:varchar%20%28uk%29%0Auser_email:varchar%20%28uk%29%0Auser_registered:datetime%0Auser_status:int&n=posts;table;wp_posts;ID:bigint%20%28pk%29%0Apost_author:bigint%20%28fk%29%0Apost_parent:bigint%20%28fk%29%0Apost_title:text%0Apost_status:varchar%0Apost_type:varchar%0Apost_date:datetime&n=postmeta;table;wp_postmeta;meta_id:bigint%20%28pk%29%0Apost_id:bigint%20%28fk%29%0Ameta_key:varchar%0Ameta_value:longtext&n=comments;table;wp_comments;comment_ID:bigint%20%28pk%29%0Acomment_post_ID:bigint%20%28fk%29%0Auser_id:bigint%20%28fk%29%0Acomment_content:text%0Acomment_date:datetime&n=terms;table;wp_terms;term_id:bigint%20%28pk%29%0Aname:varchar%0Aslug:varchar%20%28uk%29&n=term_taxonomy;table;wp_term_taxonomy;term_taxonomy_id:bigint%20%28pk%29%0Aterm_id:bigint%20%28fk%29%0Ataxonomy:varchar%0Aparent:bigint%20%28fk%29%0Acount:bigint&n=term_relationships;table;wp_term_relationships;object_id:bigint%20%28fk%29%0Aterm_taxonomy_id:bigint%20%28fk%29%0Aterm_order:int&n=options;table;wp_options;option_id:bigint%20%28pk%29%0Aoption_name:varchar%20%28uk%29%0Aoption_value:longtext%0Aautoload:varchar&e=users;posts;1:N&e=users;comments;1:N&e=posts;postmeta;1:N&e=posts;comments;1:N&e=posts;term_relationships;1:N&e=terms;term_taxonomy;1:N&e=term_taxonomy;term_relationships;1:N&title=WordPress%20core%20tables&w=760)

八个表就是 WordPress 装完就有的那些 —— `wp_posts` 引 `wp_users`,
`wp_postmeta` 挂在 `wp_posts` 上,分类靠 `wp_term_relationships` 一张关联表连两头。

### draw 自己的存储

```text
https://x-cmd.com/draw/erd?n=charts;table;charts/%3Chash%3E.json;template:varchar%0Atheme:varchar%0Astack:bool%0Aspec:json%0Acreated_at:timestamp&n=meta;table;repository%20meta;branch:varchar%0Adefault_branch:varchar%0Aupdated_at:timestamp&n=events;table;draw_explore%20%28Analytics%20Engine%29;index0:varchar%0Aindex1:varchar%0Ablob0:varchar%0Ablob1:varchar%0Ablob2:varchar%0Atimestamp:timestamp&e=meta;charts;1:N&title=The%20draw%20short-link%20store&w=760
```

[![The draw short-link store](https://x-cmd.com/draw/erd?n=charts;table;charts/%3Chash%3E.json;template:varchar%0Atheme:varchar%0Astack:bool%0Aspec:json%0Acreated_at:timestamp&n=meta;table;repository%20meta;branch:varchar%0Adefault_branch:varchar%0Aupdated_at:timestamp&n=events;table;draw_explore%20%28Analytics%20Engine%29;index0:varchar%0Aindex1:varchar%0Ablob0:varchar%0Ablob1:varchar%0Ablob2:varchar%0Atimestamp:timestamp&e=meta;charts;1:N&title=The%20draw%20short-link%20store&w=760)](https://x-cmd.com/draw/explore/erd?n=charts;table;charts/%3Chash%3E.json;template:varchar%0Atheme:varchar%0Astack:bool%0Aspec:json%0Acreated_at:timestamp&n=meta;table;repository%20meta;branch:varchar%0Adefault_branch:varchar%0Aupdated_at:timestamp&n=events;table;draw_explore%20%28Analytics%20Engine%29;index0:varchar%0Aindex1:varchar%0Ablob0:varchar%0Ablob1:varchar%0Ablob2:varchar%0Atimestamp:timestamp&e=meta;charts;1:N&title=The%20draw%20short-link%20store&w=760)

短链仓的文档结构、仓的元信息,还有埋点那张宽表。

## 七、不用 ERD 的时候用什么

ERD 回答的是「**表长什么样、表之间怎么连**」。别的问题有别的图:

| 要回答的问题 | 用哪个 |
|---|---|
| 表结构、字段、键、外键 | **ERD**(`/draw/erd`) |
| 数据从哪来、到哪去 | **数据流**(`/draw/dataflow`) |
| 哪个服务拥有哪张表 | **架构图**(`/draw/arch2`,给节点加图标) |
| 一次请求经过哪些服务 | **时序图**(`/draw/seq`) |
| 只是一堆表的分布 | **ERD 但不写字段表**(每张表只留名字,关系照样画) |

最后一条值得多说一句:**十几张表的 schema,读者第一眼要的是「有哪些表、怎么连」,
不是字段**。那就别写字段 —— 一张表一个名字,关系照样画:

```text
https://x-cmd.com/draw/erd?n=users;table;users;;r0c0&n=orders;table;orders;;r1c0&n=items;table;order_items;;r2c0&e=users;orders;1:N&e=orders;items;1:N&title=Schema%20map&w=760
```
