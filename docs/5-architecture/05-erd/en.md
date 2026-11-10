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
  infer it from the field names.
- **A `+` in the URL is a space.** A field or member that starts with a
  literal plus has to be written `%2B` — in a query string a bare `+` means
  space.

