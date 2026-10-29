---
x-title: sankey diagram — flow / conversion path
x-desc: 'x-cmd/draw `type=sankey` quick reference. Flow / conversion path visualization (users from source → middle steps → endpoint). Params: nodes + links describe the flow.'
x-sidebar: draw sankey
x-keywords: sankey, sankey diagram, draw, svg, flow, conversion path
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw sankey diagram'
      inLanguage: 'en'
      about: 'x-cmd/draw sankey diagram'
---

# sankey diagram — flow / conversion path

## Examples (what you see is what the URL gives; click to enlarge)

**User conversion funnel**

```text
https://x-cmd.com/draw?type=sankey&labels=Visitor,Signup,Active,Paid,Churn&links=Visitor>Signup:1000;Signup>Active:600;Active>Paid:200;Active>Churn:300&title=User%20conversion
```

![User conversion funnel](https://x-cmd.com/draw?type=sankey&labels=Visitor,Signup,Active,Paid,Churn&links=Visitor>Signup:1000;Signup>Active:600;Active>Paid:200;Active>Churn:300&title=User%20conversion)

**Energy flow**

```text
https://x-cmd.com/draw?type=sankey&labels=Solar,Wind,Nuclear,Grid,Home,Industry&links=Solar>Grid:500;Wind>Grid:800;Nuclear>Grid:300;Grid>Home:400;Grid>Industry:1200&title=Energy%20flow
```

![Energy flow](https://x-cmd.com/draw?type=sankey&labels=Solar,Wind,Nuclear,Grid,Home,Industry&links=Solar>Grid:500;Wind>Grid:800;Nuclear>Grid:300;Grid>Home:400;Grid>Industry:1200&title=Energy%20flow)

**PR lifecycle (type→outcome→age)**

```text
https://x-cmd.com/draw?type=sankey&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y+&links=feat>merged:38;feat>closed:12;feat>rejected:8;fix>merged:33;fix>closed:6;fix>rejected:2;docs>merged:16;docs>closed:4;chore>merged:5;chore>closed:6;chore>rejected:6;merged>0-1y:52;merged>1-2y:28;merged>2y+:12;closed>0-1y:14;closed>1-2y:9;closed>2y+:5;rejected>0-1y:9;rejected>1-2y:5;rejected>2y+:2&title=Pull%20requests%20lifecycle&unit=prs
```

![PR lifecycle (type→outcome→age)](https://x-cmd.com/draw?type=sankey&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y+&links=feat>merged:38;feat>closed:12;feat>rejected:8;fix>merged:33;fix>closed:6;fix>rejected:2;docs>merged:16;docs>closed:4;chore>merged:5;chore>closed:6;chore>rejected:6;merged>0-1y:52;merged>1-2y:28;merged>2y+:12;closed>0-1y:14;closed>1-2y:9;closed>2y+:5;rejected>0-1y:9;rejected>1-2y:5;rejected>2y+:2&title=Pull%20requests%20lifecycle&unit=prs)

**Funding flow (t=fund)**

```text
https://x-cmd.com/draw?type=sankey&t=fund&labels=Fees,Grants,Core,Ops,Docs&links=Fees>Core:50;Fees>Ops:20;Grants>Docs:30;Grants>Ops:10&title=Budget
```

![Funding flow (t=fund)](https://x-cmd.com/draw?type=sankey&t=fund&labels=Fees,Grants,Core,Ops,Docs&links=Fees>Core:50;Fees>Ops:20;Grants>Docs:30;Grants>Ops:10&title=Budget)

**Pipeline (t=pipeline)**

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=Visitors,Stars,Forks,PRs,Merged&links=Visitors>Stars:84;Visitors>Forks:18;Stars>Forks:17;Forks>PRs:9;Visitors>PRs:3;PRs>Merged:7&title=Contributor%20funnel&unit=users
```

![Pipeline (t=pipeline)](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=Visitors,Stars,Forks,PRs,Merged&links=Visitors>Stars:84;Visitors>Forks:18;Stars>Forks:17;Forks>PRs:9;Visitors>PRs:3;PRs>Merged:7&title=Contributor%20funnel&unit=users)

**Typical use**: flow from source → middle steps → endpoint (e.g., users from search → landing → signup → paid).

---

## Parameters

| param | meaning | required |
| --- | --- | --- |
| `nodes=` | node list, comma-separated | ✓ |
| `links=source,target,value;...` | connections: source → target → value; semicolon between | ✓ |
| `title=` | chart title | ✗ |

---



---

## Pitfalls

- **Node name reference**: `source`/`target` in links must **exactly match** strings in `nodes`
- **≤ 20 nodes**: chart gets crowded; consider grouping beyond
- **Zero-value links not drawn**: useful for hiding less-important paths
- **JSON format better for big data**: many nodes / complex connections → use `?d=` JSON