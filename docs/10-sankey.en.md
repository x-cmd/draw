---
x-title: sankey diagram — flow / conversion path
x-desc: x-cmd/draw `type=sankey` quick reference. Flow / conversion path visualization (users from source → middle steps → endpoint). Params: nodes + links describe the flow.
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

**Typical use**: flow from source → middle steps → endpoint (e.g., users from search → landing → signup → paid).

---

## Parameters

| param | meaning | required |
| --- | --- | --- |
| `nodes=` | node list, comma-separated | ✓ |
| `links=source,target,value;...` | connections: source → target → value; semicolon between | ✓ |
| `title=` | chart title | ✗ |

---

## Examples

```sh
# User conversion funnel
curl "https://x-cmd.com/draw?type=sankey&nodes=Visitor,Signup,Active,Paid,Churn&links=Visitor,Signup,1000;Signup,Active,600;Active,Paid,200;Active,Churn,300&title=User%20conversion"

# Energy flow (multi-source → multi-sink)
curl "https://x-cmd.com/draw?type=sankey&nodes=Solar,Wind,Nuclear,Grid,Home,Industry&links=Solar,Grid,500;Wind,Grid,800;Nuclear,Grid,300;Grid,Home,400;Grid,Industry,1200&title=Energy%20flow"
```

---

## Pitfalls

- **Node name reference**: `source`/`target` in links must **exactly match** strings in `nodes`
- **≤ 20 nodes**: chart gets crowded; consider grouping beyond
- **Zero-value links not drawn**: useful for hiding less-important paths
- **JSON format better for big data**: many nodes / complex connections → use `?d=` JSON