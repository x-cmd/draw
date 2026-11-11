---
x-title: ERD — the tables, their fields, and how they relate
x-desc: 'x-cmd/draw ERD (`/draw/erd`). One node per table, the field list inside the node (lines separated by %0A), relationships on the edges. Same URL model as the architecture diagram.'
x-sidebar: draw ERD
x-keywords: erd, entity relationship diagram, 实体关系图, draw, svg, schema
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw ERD'
      inLanguage: 'en'
      about: 'x-cmd/draw 05-erd'
---

# ERD — the tables, their fields, and how they relate

One node per table. The field list lives inside the node, one field per line.
Relationships are edges, labelled the way you would say them out loud.

```text
https://x-cmd.com/draw/erd?n=charts;table;charts;hash:string%20(pk)%250Atemplate:string%250Aspec:json%250Acreated_at:timestamp;r0c0&n=repos;table;repos;owner:string%20(pk)%250Aname:string%20(pk)%250Abranch:string%250Adata_repo:string;r1c0&n=branches;table;branches;repo:string%20(fk)%250Abranch:string%20(fk)%250Asha:string;r2c0&e=repos;branches;1:N&e=repos;charts;1:N
```

[![ERD](https://x-cmd.com/draw/erd?n=charts;table;charts;hash:string%20(pk)%250Atemplate:string%250Aspec:json%250Acreated_at:timestamp;r0c0&n=repos;table;repos;owner:string%20(pk)%250Aname:string%20(pk)%250Abranch:string%250Adata_repo:string;r1c0&n=branches;table;branches;repo:string%20(fk)%250Abranch:string%20(fk)%250Asha:string;r2c0&e=repos;branches;1:N&e=repos;charts;1:N)](https://x-cmd.com/draw/explore/erd?n=charts;table;charts;hash:string%20(pk)%250Atemplate:string%250Aspec:json%250Acreated_at:timestamp;r0c0&n=repos;table;repos;owner:string%20(pk)%250Aname:string%20(pk)%250Abranch:string%250Adata_repo:string;r1c0&n=branches;table;branches;repo:string%20(fk)%250Abranch:string%20(fk)%250Asha:string;r2c0&e=repos;branches;1:N&e=repos;charts;1:N)

These are draw's own tables: the short-link store, and the repos and branches
it points at.

## 1. Parameters

| param | meaning | default |
|---|---|---|
| `n=` | a table: `id;type;label;fields;pos` | — |
| `e=` | a relationship: `from;to[;cardinality]` | — |
| `b=` | a group: `label;id id …` | — |
| `title=` | diagram title | — |
| `w=` / `h=` | canvas size | natural size |

## 2. Writing the field list

The field list is the node's fourth field, and **its lines are separated by
`%0A`** (a newline in the URL):

```
n=users;table;users;id:int (pk)%0Aname:text%0Acreated_at:timestamp;r0c0
```

That is three lines: `id:int (pk)`, `name:text`, `created_at:timestamp`. The
first field of the node is the table name, so the reader sees it as the title.

Each line is drawn as a **field row**: the name on the left, the type on the
right (in a monospaced face, so the types line up down the column), and a key
badge in front.

**Mark the key yourself** — `id:int (pk)` for a primary key, `user_id:int (fk)`
for a foreign key, `slug:text (uk)` for a unique key. draw does not guess; it
reads the marker and draws the badge.

## 3. The vocabulary

| type | it is |
|---|---|
| `table` | a table |
| `view` | a view over tables |

## 4. Pitfalls

- **The field list is the fourth field** — `id;type;name;fields;pos`. Leave the
  position out and the tables are packed for you.
- **`%0A` is a newline, not a space** — a plain space puts the whole list on
  one line.
- **Cardinality goes on the edge** (`e=repos;charts;1:N`) — draw does not
  infer it from the field names. When the label is a cardinality, the edge
  ends are drawn in the standard notation: a bar for the *one* side, a
  crow's foot for the *many* side.
- **A verb can follow the cardinality** (`e=repos;charts;1:N placed by`) —
  the cardinality draws the notation, the verb stays as the label.
- **A `+` in the URL is a space.** A field or member that starts with a
  literal plus has to be written `%2B` — in a query string a bare `+` means
  space.

## 5. You don't have to place the tables — they layer by relation

Without `r0c1`, the tables used to be dropped into the grid in the order you wrote
them — with a dozen tables you could not tell who references whom. Now the ERD
**layers them by foreign key**: a table nobody references sits on the left, a table
that references others moves right, one column per level of the relation.

```text
https://x-cmd.com/draw/erd?n=users;table;users;id:uuid%20%28pk%29%0Aemail:text%20%28uk%29%0Acreated_at:timestamp&n=products;table;products;id:uuid%20%28pk%29%0Asku:text%20%28uk%29%0Aname:text%0Aprice_cents:int%0Aactive:bool&n=inventory;table;inventory;product_id:uuid%20%28fk%29%0Awarehouse_id:uuid%20%28fk%29%0Aon_hand:int%0Areserved:int&n=warehouses;table;warehouses;id:uuid%20%28pk%29%0Acode:text%20%28uk%29%0Acity:text&n=orders;table;orders;id:uuid%20%28pk%29%0Auser_id:uuid%20%28fk%29%0Astatus:text%0Atotal_cents:int%0Aplaced_at:timestamp&n=order_items;table;order_items;order_id:uuid%20%28fk%29%0Aproduct_id:uuid%20%28fk%29%0Aqty:int%0Aunit_price_cents:int&n=payments;table;payments;id:uuid%20%28pk%29%0Aorder_id:uuid%20%28fk%29%0Aprovider:text%0Aamount_cents:int%0Acaptured_at:timestamp&n=shipments;table;shipments;id:uuid%20%28pk%29%0Aorder_id:uuid%20%28fk%29%0Acarrier:text%0Atracking_no:text%0Ashipped_at:timestamp&e=users;orders;1:N&e=orders;order_items;1:N&e=products;order_items;1:N&e=products;inventory;1:N&e=warehouses;inventory;1:N&e=orders;payments;1:1&e=orders;shipments;1:N&title=Orders,%20inventory%20and%20payments&w=760
```

[![Orders, inventory and payments](https://x-cmd.com/draw/erd?n=users;table;users;id:uuid%20%28pk%29%0Aemail:text%20%28uk%29%0Acreated_at:timestamp&n=products;table;products;id:uuid%20%28pk%29%0Asku:text%20%28uk%29%0Aname:text%0Aprice_cents:int%0Aactive:bool&n=inventory;table;inventory;product_id:uuid%20%28fk%29%0Awarehouse_id:uuid%20%28fk%29%0Aon_hand:int%0Areserved:int&n=warehouses;table;warehouses;id:uuid%20%28pk%29%0Acode:text%20%28uk%29%0Acity:text&n=orders;table;orders;id:uuid%20%28pk%29%0Auser_id:uuid%20%28fk%29%0Astatus:text%0Atotal_cents:int%0Aplaced_at:timestamp&n=order_items;table;order_items;order_id:uuid%20%28fk%29%0Aproduct_id:uuid%20%28fk%29%0Aqty:int%0Aunit_price_cents:int&n=payments;table;payments;id:uuid%20%28pk%29%0Aorder_id:uuid%20%28fk%29%0Aprovider:text%0Aamount_cents:int%0Acaptured_at:timestamp&n=shipments;table;shipments;id:uuid%20%28pk%29%0Aorder_id:uuid%20%28fk%29%0Acarrier:text%0Atracking_no:text%0Ashipped_at:timestamp&e=users;orders;1:N&e=orders;order_items;1:N&e=products;order_items;1:N&e=products;inventory;1:N&e=warehouses;inventory;1:N&e=orders;payments;1:1&e=orders;shipments;1:N&title=Orders,%20inventory%20and%20payments&w=760)](https://x-cmd.com/draw/explore/erd?n=users;table;users;id:uuid%20%28pk%29%0Aemail:text%20%28uk%29%0Acreated_at:timestamp&n=products;table;products;id:uuid%20%28pk%29%0Asku:text%20%28uk%29%0Aname:text%0Aprice_cents:int%0Aactive:bool&n=inventory;table;inventory;product_id:uuid%20%28fk%29%0Awarehouse_id:uuid%20%28fk%29%0Aon_hand:int%0Areserved:int&n=warehouses;table;warehouses;id:uuid%20%28pk%29%0Acode:text%20%28uk%29%0Acity:text&n=orders;table;orders;id:uuid%20%28pk%29%0Auser_id:uuid%20%28fk%29%0Astatus:text%0Atotal_cents:int%0Aplaced_at:timestamp&n=order_items;table;order_items;order_id:uuid%20%28fk%29%0Aproduct_id:uuid%20%28fk%29%0Aqty:int%0Aunit_price_cents:int&n=payments;table;payments;id:uuid%20%28pk%29%0Aorder_id:uuid%20%28fk%29%0Aprovider:text%0Aamount_cents:int%0Acaptured_at:timestamp&n=shipments;table;shipments;id:uuid%20%28pk%29%0Aorder_id:uuid%20%28fk%29%0Acarrier:text%0Atracking_no:text%0Ashipped_at:timestamp&e=users;orders;1:N&e=orders;order_items;1:N&e=products;order_items;1:N&e=products;inventory;1:N&e=warehouses;inventory;1:N&e=orders;payments;1:1&e=orders;shipments;1:N&title=Orders,%20inventory%20and%20payments&w=760)

`users`/`products`/`warehouses` are in the first column, `orders`/`inventory` in the
second, `order_items`/`payments`/`shipments` in the third — read left to right and
you are reading the direction the data flows.

Placing them yourself still works (`r0c1`), and a table you placed is left alone.

## 6. Real cases

### Orders, inventory and payments

```text
https://x-cmd.com/draw/erd?n=users;table;users;id:uuid%20%28pk%29%0Aemail:text%20%28uk%29%0Acreated_at:timestamp&n=products;table;products;id:uuid%20%28pk%29%0Asku:text%20%28uk%29%0Aname:text%0Aprice_cents:int%0Aactive:bool&n=inventory;table;inventory;product_id:uuid%20%28fk%29%0Awarehouse_id:uuid%20%28fk%29%0Aon_hand:int%0Areserved:int&n=warehouses;table;warehouses;id:uuid%20%28pk%29%0Acode:text%20%28uk%29%0Acity:text&n=orders;table;orders;id:uuid%20%28pk%29%0Auser_id:uuid%20%28fk%29%0Astatus:text%0Atotal_cents:int%0Aplaced_at:timestamp&n=order_items;table;order_items;order_id:uuid%20%28fk%29%0Aproduct_id:uuid%20%28fk%29%0Aqty:int%0Aunit_price_cents:int&n=payments;table;payments;id:uuid%20%28pk%29%0Aorder_id:uuid%20%28fk%29%0Aprovider:text%0Aamount_cents:int%0Acaptured_at:timestamp&n=shipments;table;shipments;id:uuid%20%28pk%29%0Aorder_id:uuid%20%28fk%29%0Acarrier:text%0Atracking_no:text%0Ashipped_at:timestamp&e=users;orders;1:N&e=orders;order_items;1:N&e=products;order_items;1:N&e=products;inventory;1:N&e=warehouses;inventory;1:N&e=orders;payments;1:1&e=orders;shipments;1:N&title=Orders,%20inventory%20and%20payments&w=760
```

[![Orders, inventory and payments](https://x-cmd.com/draw/erd?n=users;table;users;id:uuid%20%28pk%29%0Aemail:text%20%28uk%29%0Acreated_at:timestamp&n=products;table;products;id:uuid%20%28pk%29%0Asku:text%20%28uk%29%0Aname:text%0Aprice_cents:int%0Aactive:bool&n=inventory;table;inventory;product_id:uuid%20%28fk%29%0Awarehouse_id:uuid%20%28fk%29%0Aon_hand:int%0Areserved:int&n=warehouses;table;warehouses;id:uuid%20%28pk%29%0Acode:text%20%28uk%29%0Acity:text&n=orders;table;orders;id:uuid%20%28pk%29%0Auser_id:uuid%20%28fk%29%0Astatus:text%0Atotal_cents:int%0Aplaced_at:timestamp&n=order_items;table;order_items;order_id:uuid%20%28fk%29%0Aproduct_id:uuid%20%28fk%29%0Aqty:int%0Aunit_price_cents:int&n=payments;table;payments;id:uuid%20%28pk%29%0Aorder_id:uuid%20%28fk%29%0Aprovider:text%0Aamount_cents:int%0Acaptured_at:timestamp&n=shipments;table;shipments;id:uuid%20%28pk%29%0Aorder_id:uuid%20%28fk%29%0Acarrier:text%0Atracking_no:text%0Ashipped_at:timestamp&e=users;orders;1:N&e=orders;order_items;1:N&e=products;order_items;1:N&e=products;inventory;1:N&e=warehouses;inventory;1:N&e=orders;payments;1:1&e=orders;shipments;1:N&title=Orders,%20inventory%20and%20payments&w=760)](https://x-cmd.com/draw/explore/erd?n=users;table;users;id:uuid%20%28pk%29%0Aemail:text%20%28uk%29%0Acreated_at:timestamp&n=products;table;products;id:uuid%20%28pk%29%0Asku:text%20%28uk%29%0Aname:text%0Aprice_cents:int%0Aactive:bool&n=inventory;table;inventory;product_id:uuid%20%28fk%29%0Awarehouse_id:uuid%20%28fk%29%0Aon_hand:int%0Areserved:int&n=warehouses;table;warehouses;id:uuid%20%28pk%29%0Acode:text%20%28uk%29%0Acity:text&n=orders;table;orders;id:uuid%20%28pk%29%0Auser_id:uuid%20%28fk%29%0Astatus:text%0Atotal_cents:int%0Aplaced_at:timestamp&n=order_items;table;order_items;order_id:uuid%20%28fk%29%0Aproduct_id:uuid%20%28fk%29%0Aqty:int%0Aunit_price_cents:int&n=payments;table;payments;id:uuid%20%28pk%29%0Aorder_id:uuid%20%28fk%29%0Aprovider:text%0Aamount_cents:int%0Acaptured_at:timestamp&n=shipments;table;shipments;id:uuid%20%28pk%29%0Aorder_id:uuid%20%28fk%29%0Acarrier:text%0Atracking_no:text%0Ashipped_at:timestamp&e=users;orders;1:N&e=orders;order_items;1:N&e=products;order_items;1:N&e=products;inventory;1:N&e=warehouses;inventory;1:N&e=orders;payments;1:1&e=orders;shipments;1:N&title=Orders,%20inventory%20and%20payments&w=760)


### A multi-tenant SaaS

```text
https://x-cmd.com/draw/erd?n=tenants;table;tenants;id:uuid%20%28pk%29%0Aslug:text%20%28uk%29%0Aplan:text%0Acreated_at:timestamp&n=users;table;users;id:uuid%20%28pk%29%0Aemail:text%20%28uk%29%0Acreated_at:timestamp&n=memberships;table;memberships;tenant_id:uuid%20%28fk%29%0Auser_id:uuid%20%28fk%29%0Arole:text%0Ajoined_at:timestamp&n=projects;table;projects;id:uuid%20%28pk%29%0Atenant_id:uuid%20%28fk%29%0Aname:text%0Aarchived_at:timestamp&n=tasks;table;tasks;id:uuid%20%28pk%29%0Aproject_id:uuid%20%28fk%29%0Aassignee_id:uuid%20%28fk%29%0Atitle:text%0Astatus:text%0Adue_at:timestamp&n=comments;table;comments;id:uuid%20%28pk%29%0Atask_id:uuid%20%28fk%29%0Aauthor_id:uuid%20%28fk%29%0Abody:text%0Acreated_at:timestamp&n=api_keys;table;api_keys;id:uuid%20%28pk%29%0Atenant_id:uuid%20%28fk%29%0Aprefix:text%20%28uk%29%0Asecret_hash:text%0Alast_used_at:timestamp&n=audit_log;table;audit_log;id:uuid%20%28pk%29%0Atenant_id:uuid%20%28fk%29%0Aactor_id:uuid%20%28fk%29%0Aaction:text%0Aat:timestamp&e=tenants;memberships;1:N&e=users;memberships;1:N&e=tenants;projects;1:N&e=projects;tasks;1:N&e=users;tasks;1:N&e=tasks;comments;1:N&e=users;comments;1:N&e=tenants;api_keys;1:N&e=tenants;audit_log;1:N&title=Multi-tenant%20SaaS&w=760
```

[![Multi-tenant SaaS](https://x-cmd.com/draw/erd?n=tenants;table;tenants;id:uuid%20%28pk%29%0Aslug:text%20%28uk%29%0Aplan:text%0Acreated_at:timestamp&n=users;table;users;id:uuid%20%28pk%29%0Aemail:text%20%28uk%29%0Acreated_at:timestamp&n=memberships;table;memberships;tenant_id:uuid%20%28fk%29%0Auser_id:uuid%20%28fk%29%0Arole:text%0Ajoined_at:timestamp&n=projects;table;projects;id:uuid%20%28pk%29%0Atenant_id:uuid%20%28fk%29%0Aname:text%0Aarchived_at:timestamp&n=tasks;table;tasks;id:uuid%20%28pk%29%0Aproject_id:uuid%20%28fk%29%0Aassignee_id:uuid%20%28fk%29%0Atitle:text%0Astatus:text%0Adue_at:timestamp&n=comments;table;comments;id:uuid%20%28pk%29%0Atask_id:uuid%20%28fk%29%0Aauthor_id:uuid%20%28fk%29%0Abody:text%0Acreated_at:timestamp&n=api_keys;table;api_keys;id:uuid%20%28pk%29%0Atenant_id:uuid%20%28fk%29%0Aprefix:text%20%28uk%29%0Asecret_hash:text%0Alast_used_at:timestamp&n=audit_log;table;audit_log;id:uuid%20%28pk%29%0Atenant_id:uuid%20%28fk%29%0Aactor_id:uuid%20%28fk%29%0Aaction:text%0Aat:timestamp&e=tenants;memberships;1:N&e=users;memberships;1:N&e=tenants;projects;1:N&e=projects;tasks;1:N&e=users;tasks;1:N&e=tasks;comments;1:N&e=users;comments;1:N&e=tenants;api_keys;1:N&e=tenants;audit_log;1:N&title=Multi-tenant%20SaaS&w=760)](https://x-cmd.com/draw/explore/erd?n=tenants;table;tenants;id:uuid%20%28pk%29%0Aslug:text%20%28uk%29%0Aplan:text%0Acreated_at:timestamp&n=users;table;users;id:uuid%20%28pk%29%0Aemail:text%20%28uk%29%0Acreated_at:timestamp&n=memberships;table;memberships;tenant_id:uuid%20%28fk%29%0Auser_id:uuid%20%28fk%29%0Arole:text%0Ajoined_at:timestamp&n=projects;table;projects;id:uuid%20%28pk%29%0Atenant_id:uuid%20%28fk%29%0Aname:text%0Aarchived_at:timestamp&n=tasks;table;tasks;id:uuid%20%28pk%29%0Aproject_id:uuid%20%28fk%29%0Aassignee_id:uuid%20%28fk%29%0Atitle:text%0Astatus:text%0Adue_at:timestamp&n=comments;table;comments;id:uuid%20%28pk%29%0Atask_id:uuid%20%28fk%29%0Aauthor_id:uuid%20%28fk%29%0Abody:text%0Acreated_at:timestamp&n=api_keys;table;api_keys;id:uuid%20%28pk%29%0Atenant_id:uuid%20%28fk%29%0Aprefix:text%20%28uk%29%0Asecret_hash:text%0Alast_used_at:timestamp&n=audit_log;table;audit_log;id:uuid%20%28pk%29%0Atenant_id:uuid%20%28fk%29%0Aactor_id:uuid%20%28fk%29%0Aaction:text%0Aat:timestamp&e=tenants;memberships;1:N&e=users;memberships;1:N&e=tenants;projects;1:N&e=projects;tasks;1:N&e=users;tasks;1:N&e=tasks;comments;1:N&e=users;comments;1:N&e=tenants;api_keys;1:N&e=tenants;audit_log;1:N&title=Multi-tenant%20SaaS&w=760)

The tenant table is on the left; everything carrying a `tenant_id` hangs off it.

### The WordPress core tables (the real schema)

```text
https://x-cmd.com/draw/erd?n=users;table;wp_users;ID:bigint%20%28pk%29%0Auser_login:varchar%20%28uk%29%0Auser_email:varchar%20%28uk%29%0Auser_registered:datetime%0Auser_status:int&n=posts;table;wp_posts;ID:bigint%20%28pk%29%0Apost_author:bigint%20%28fk%29%0Apost_parent:bigint%20%28fk%29%0Apost_title:text%0Apost_status:varchar%0Apost_type:varchar%0Apost_date:datetime&n=postmeta;table;wp_postmeta;meta_id:bigint%20%28pk%29%0Apost_id:bigint%20%28fk%29%0Ameta_key:varchar%0Ameta_value:longtext&n=comments;table;wp_comments;comment_ID:bigint%20%28pk%29%0Acomment_post_ID:bigint%20%28fk%29%0Auser_id:bigint%20%28fk%29%0Acomment_content:text%0Acomment_date:datetime&n=terms;table;wp_terms;term_id:bigint%20%28pk%29%0Aname:varchar%0Aslug:varchar%20%28uk%29&n=term_taxonomy;table;wp_term_taxonomy;term_taxonomy_id:bigint%20%28pk%29%0Aterm_id:bigint%20%28fk%29%0Ataxonomy:varchar%0Aparent:bigint%20%28fk%29%0Acount:bigint&n=term_relationships;table;wp_term_relationships;object_id:bigint%20%28fk%29%0Aterm_taxonomy_id:bigint%20%28fk%29%0Aterm_order:int&n=options;table;wp_options;option_id:bigint%20%28pk%29%0Aoption_name:varchar%20%28uk%29%0Aoption_value:longtext%0Aautoload:varchar&e=users;posts;1:N&e=users;comments;1:N&e=posts;postmeta;1:N&e=posts;comments;1:N&e=posts;term_relationships;1:N&e=terms;term_taxonomy;1:N&e=term_taxonomy;term_relationships;1:N&title=WordPress%20core%20tables&w=760
```

[![WordPress core tables](https://x-cmd.com/draw/erd?n=users;table;wp_users;ID:bigint%20%28pk%29%0Auser_login:varchar%20%28uk%29%0Auser_email:varchar%20%28uk%29%0Auser_registered:datetime%0Auser_status:int&n=posts;table;wp_posts;ID:bigint%20%28pk%29%0Apost_author:bigint%20%28fk%29%0Apost_parent:bigint%20%28fk%29%0Apost_title:text%0Apost_status:varchar%0Apost_type:varchar%0Apost_date:datetime&n=postmeta;table;wp_postmeta;meta_id:bigint%20%28pk%29%0Apost_id:bigint%20%28fk%29%0Ameta_key:varchar%0Ameta_value:longtext&n=comments;table;wp_comments;comment_ID:bigint%20%28pk%29%0Acomment_post_ID:bigint%20%28fk%29%0Auser_id:bigint%20%28fk%29%0Acomment_content:text%0Acomment_date:datetime&n=terms;table;wp_terms;term_id:bigint%20%28pk%29%0Aname:varchar%0Aslug:varchar%20%28uk%29&n=term_taxonomy;table;wp_term_taxonomy;term_taxonomy_id:bigint%20%28pk%29%0Aterm_id:bigint%20%28fk%29%0Ataxonomy:varchar%0Aparent:bigint%20%28fk%29%0Acount:bigint&n=term_relationships;table;wp_term_relationships;object_id:bigint%20%28fk%29%0Aterm_taxonomy_id:bigint%20%28fk%29%0Aterm_order:int&n=options;table;wp_options;option_id:bigint%20%28pk%29%0Aoption_name:varchar%20%28uk%29%0Aoption_value:longtext%0Aautoload:varchar&e=users;posts;1:N&e=users;comments;1:N&e=posts;postmeta;1:N&e=posts;comments;1:N&e=posts;term_relationships;1:N&e=terms;term_taxonomy;1:N&e=term_taxonomy;term_relationships;1:N&title=WordPress%20core%20tables&w=760)](https://x-cmd.com/draw/explore/erd?n=users;table;wp_users;ID:bigint%20%28pk%29%0Auser_login:varchar%20%28uk%29%0Auser_email:varchar%20%28uk%29%0Auser_registered:datetime%0Auser_status:int&n=posts;table;wp_posts;ID:bigint%20%28pk%29%0Apost_author:bigint%20%28fk%29%0Apost_parent:bigint%20%28fk%29%0Apost_title:text%0Apost_status:varchar%0Apost_type:varchar%0Apost_date:datetime&n=postmeta;table;wp_postmeta;meta_id:bigint%20%28pk%29%0Apost_id:bigint%20%28fk%29%0Ameta_key:varchar%0Ameta_value:longtext&n=comments;table;wp_comments;comment_ID:bigint%20%28pk%29%0Acomment_post_ID:bigint%20%28fk%29%0Auser_id:bigint%20%28fk%29%0Acomment_content:text%0Acomment_date:datetime&n=terms;table;wp_terms;term_id:bigint%20%28pk%29%0Aname:varchar%0Aslug:varchar%20%28uk%29&n=term_taxonomy;table;wp_term_taxonomy;term_taxonomy_id:bigint%20%28pk%29%0Aterm_id:bigint%20%28fk%29%0Ataxonomy:varchar%0Aparent:bigint%20%28fk%29%0Acount:bigint&n=term_relationships;table;wp_term_relationships;object_id:bigint%20%28fk%29%0Aterm_taxonomy_id:bigint%20%28fk%29%0Aterm_order:int&n=options;table;wp_options;option_id:bigint%20%28pk%29%0Aoption_name:varchar%20%28uk%29%0Aoption_value:longtext%0Aautoload:varchar&e=users;posts;1:N&e=users;comments;1:N&e=posts;postmeta;1:N&e=posts;comments;1:N&e=posts;term_relationships;1:N&e=terms;term_taxonomy;1:N&e=term_taxonomy;term_relationships;1:N&title=WordPress%20core%20tables&w=760)

Eight tables, the ones you get with a fresh WordPress install — `wp_posts`
references `wp_users`, `wp_postmeta` hangs off `wp_posts`, and the categories are
wired through the `wp_term_relationships` join table.

### draw's own storage

```text
https://x-cmd.com/draw/erd?n=charts;table;charts/%3Chash%3E.json;template:varchar%0Atheme:varchar%0Astack:bool%0Aspec:json%0Acreated_at:timestamp&n=meta;table;repository%20meta;branch:varchar%0Adefault_branch:varchar%0Aupdated_at:timestamp&n=events;table;draw_explore%20%28Analytics%20Engine%29;index0:varchar%0Aindex1:varchar%0Ablob0:varchar%0Ablob1:varchar%0Ablob2:varchar%0Atimestamp:timestamp&e=meta;charts;1:N&title=The%20draw%20short-link%20store&w=760
```

[![The draw short-link store](https://x-cmd.com/draw/erd?n=charts;table;charts/%3Chash%3E.json;template:varchar%0Atheme:varchar%0Astack:bool%0Aspec:json%0Acreated_at:timestamp&n=meta;table;repository%20meta;branch:varchar%0Adefault_branch:varchar%0Aupdated_at:timestamp&n=events;table;draw_explore%20%28Analytics%20Engine%29;index0:varchar%0Aindex1:varchar%0Ablob0:varchar%0Ablob1:varchar%0Ablob2:varchar%0Atimestamp:timestamp&e=meta;charts;1:N&title=The%20draw%20short-link%20store&w=760)](https://x-cmd.com/draw/explore/erd?n=charts;table;charts/%3Chash%3E.json;template:varchar%0Atheme:varchar%0Astack:bool%0Aspec:json%0Acreated_at:timestamp&n=meta;table;repository%20meta;branch:varchar%0Adefault_branch:varchar%0Aupdated_at:timestamp&n=events;table;draw_explore%20%28Analytics%20Engine%29;index0:varchar%0Aindex1:varchar%0Ablob0:varchar%0Ablob1:varchar%0Ablob2:varchar%0Atimestamp:timestamp&e=meta;charts;1:N&title=The%20draw%20short-link%20store&w=760)

The short-link repository's documents, its repository meta, and the wide analytics
table.

## 7. When not to use an ERD

An ERD answers "**what the tables look like and how they are wired**". Other
questions have other diagrams:

| question | use |
|---|---|
| table structure, fields, keys, foreign keys | **ERD** (`/draw/erd`) |
| where the data comes from and goes | **data flow** (`/draw/dataflow`) |
| which service owns which table | **architecture** (`/draw/arch2`, with icons) |
| which services a request passes through | **sequence** (`/draw/seq`) |
| just which tables exist and how they connect | **an ERD without field lists** (a name per table, the relations still drawn) |

The last one deserves a word: with a dozen tables, what the reader wants first is
"which tables are there and how do they connect", not the fields. So leave the
fields out — one name per table, the relations still drawn:

```text
https://x-cmd.com/draw/erd?n=users;table;users;;r0c0&n=orders;table;orders;;r1c0&n=items;table;order_items;;r2c0&e=users;orders;1:N&e=orders;items;1:N&title=Schema%20map&w=760
```
