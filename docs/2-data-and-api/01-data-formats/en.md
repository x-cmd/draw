---
x-title: data formats — flat params vs `?d=` JSON
x-desc: x-cmd/draw two data format comparison. Flat params (URL always readable, `?labels=A,B&values=10,20`) vs `?d=` JSON (cleaner for big data, `?d={"data":[...]}`). Both formats produce identical output.
x-sidebar: draw data formats
x-keywords: data formats, flat params, JSON, ?d=, draw, url encoding
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw data formats comparison'
      inLanguage: 'en'
      about: 'x-cmd/draw flat params vs ?d= JSON'
---

# data formats — flat params vs `?d=` JSON

---

Every chart supports both data formats — output is identical. **Choose by situation**.

---

## 1. Flat params (URL always readable)

Use flat params for small data (≤ 5 items). URL short, shareable, `git diff`-friendly.

```
/draw?type=pie&title=Chrome%20holds&labels=Chrome,Safari,Firefox,Edge,Other&values=65,18,7,6,4
```

Pros:
- ✅ URL always readable, paste-able in docs
- ✅ Copy from browser address bar
- ✅ `git diff` shows data changes
- ❌ Long URL with > 10 items
- ❌ Awkward for nested data

---

## 2. `?d=` JSON (big data / structured)

Use JSON for big or nested data. URL still readable (after URL-encoding).

```
/draw?type=pie&d={"title":"Chrome holds","data":[{"label":"Chrome","value":65},{"label":"Safari","value":18},{"label":"Firefox","value":7}]}
```

Pros:
- ✅ Clean for big / nested data
- ✅ Object arrays (each item with multiple fields)
- ✅ Suits complex scenarios
- ❌ JSON must be URL-encoded (quotes, spaces)
- ❌ Verbose for simple data

---

## 3. JSON schema (per chart type)

The `data` field's shape varies by chart type:

### pie / hbar / gauge / sankey
```json
{
  "title": "...",
  "data": [
    {"label": "Chrome", "value": 65},
    {"label": "Safari", "value": 18}
  ]
}
```

### bar / line / area / radar
```json
{
  "title": "...",
  "labels": ["Jan", "Feb", "Mar"],
  "series": {
    "A": [10, 20, 30],
    "B": [5, 15, 25]
  }
}
```

### scatter
```json
{
  "title": "...",
  "xlabel": "H",
  "ylabel": "W",
  "data": [{"x": 1.5, "y": 60}, {"x": 1.7, "y": 65}]
}
```

### sankey
```json
{
  "title": "...",
  "nodes": ["A", "B", "C"],
  "links": [
    {"source": "A", "target": "B", "value": 100},
    {"source": "B", "target": "C", "value": 80}
  ]
}
```

---

## 4. Which to use

| scenario | pick |
| --- | --- |
| ≤ 5 items, no nesting | flat params |
| > 5 items, simple arrays | JSON |
| nested structure | JSON (required) |
| paste URL in docs / README / chat | flat params (readable) |
| generate URL programmatically | whichever is easier to generate |

---

## 5. Pitfalls

- **JSON must be URL-encoded**: `&d={"..."}` gets split by `&` — use `&d=%7B...%7D`
- **`comma` is separator in flat params**: labels with `,` need URL-encoding `%2C`
- **Don't mix the two**: pick one, stick with it. Mixing makes URLs confusing
- **Service worker caching**: flat params cache-friendly (stable key); JSON strings vary, cache key varies