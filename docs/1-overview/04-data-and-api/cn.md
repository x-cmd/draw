---
x-title: data formats —— 扁平参数 vs `?d=` JSON
x-desc: x-cmd/draw 两种数据写法对比。扁平参数（URL 永远可读，`?labels=A,B&values=10,20`）vs `?d=` JSON（数据多时更整洁，`?d={"data":[...]}`）。两种写法结果完全等价。
x-sidebar: draw 数据格式
x-keywords: data formats, flat params, JSON, ?d=, draw, url encoding
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw data formats 对比'
      inLanguage: 'zh-CN'
      about: 'x-cmd/draw 扁平参数 vs ?d= JSON'
---

# data formats —— 扁平参数 vs `?d=` JSON

---

每个图表都支持两种数据写法——结果完全等价。**选哪种看场景**。

---

## 一、扁平参数（URL 永远可读）

数据少（≤ 5 项）时用扁平参数。URL 短、可分享、`git diff` 友好。

```
/draw?type=pie&title=Chrome%20holds&labels=Chrome,Safari,Firefox,Edge,Other&values=65,18,7,6,4
```

特点：
- ✅ URL 永远可读，文档里直接贴
- ✅ 浏览器地址栏直接复制
- ✅ `git diff` 显示数据变化
- ❌ 数据多（> 10 项）URL 会很长
- ❌ 数据有嵌套结构时扁平化麻烦

---

## 二、`?d=` JSON（数据多 / 有结构时）

数据多或需要嵌套结构时用 JSON。URL 仍可读（参数编码后）。

```
/draw?type=pie&d={"title":"Chrome holds","data":[{"label":"Chrome","value":65},{"label":"Safari","value":18},{"label":"Firefox","value":7}]}
```

特点：
- ✅ 数据多 / 嵌套结构整洁
- ✅ 可以传对象数组（每项含多个字段）
- ✅ 适合复杂场景
- ❌ JSON 需要 URL-encode（引号、空格等）
- ❌ 数据简单时反而冗长

---

## 三、JSON schema（按图表类型）

JSON 里 `data` 字段的形状随图表类型变化：

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

## 四、怎么选

| 场景 | 推荐 |
| --- | --- |
| 数据 ≤ 5 项，无嵌套 | 扁平参数 |
| 数据 > 5 项，简单数组 | JSON |
| 数据有嵌套结构 | JSON（必须） |
| 在文档 / README / 聊天里贴 URL | 扁平参数（可读） |
| 程序生成 URL | 看哪种更易生成（都可以） |

---

## 五、踩坑

- **JSON 必须 URL-encode**：用 `&d={"..."}` 会被 `&` 切分，要 `&d=%7B...%7D`
- **扁平参数里 `,` 是分隔符**：标签里含 `,` 要 URL-encode `%2C`
- **两种写法不要混**：选一种坚持用，混着用读 URL 时容易搞混
- **service workers 缓存**：扁平参数缓存友好（key 稳定）；JSON 因为字符串内容不同，缓存 key 会变