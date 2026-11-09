---
x-title: 四向箭头 —— 从中心射出的四个方向
x-desc: x-cmd/draw `type=compass` 用法速查。中心一点,上右下左四个方向各一支箭头(与四象限同族的另一种决策图)。参数:`up=`、`right=`、`down=`、`left=`(各写 `标签` 或 `标签:说明`),`center=` 中心的字,`title=` 图标题。
x-sidebar: draw 四向箭头图
x-keywords: 四向箭头, compass chart, draw, svg, four arrows, 决策图
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 四向箭头图'
      inLanguage: 'zh-CN'
      about: 'x-cmd/draw 四向箭头图'
---

# 四向箭头 —— 从中心射出的四个方向

```text
https://x-cmd.com/draw?type=compass&title=%E5%91%98%E5%B7%A5%E5%9F%B9%E5%85%BB%E6%A8%A1%E5%9E%8B&center=%E6%88%91&up=%E8%87%AA%E5%B7%B1%3A%E8%87%AA%E5%B1%B1%E4%BA%BA&right=%E6%88%91%E5%81%9A%3A%E5%AE%A3%E8%AE%B2%E7%9B%AE%E6%A0%87&down=%E4%BD%A0%E8%AF%B4%3A%E5%90%AC%E5%A2%99%E5%A3%81&left=%E7%8E%AF%E5%A2%83%3A%E5%A4%96%E9%83%A8%E5%BD%B1%E5%93%8D
```

[![四向箭头图](https://x-cmd.com/draw?type=compass&title=%E5%91%98%E5%B7%A5%E5%9F%B9%E5%85%BB%E6%A8%A1%E5%9E%8B&center=%E6%88%91&up=%E8%87%AA%E5%B7%B1%3A%E8%87%AA%E5%B1%B1%E4%BA%BA&right=%E6%88%91%E5%81%9A%3A%E5%AE%A3%E8%AE%B2%E7%9B%AE%E6%A0%87&down=%E4%BD%A0%E8%AF%B4%3A%E5%90%AC%E5%A2%99%E5%A3%81&left=%E7%8E%AF%E5%A2%83%3A%E5%A4%96%E9%83%A8%E5%BD%B1%E5%93%8D)](https://x-cmd.com/draw/explore?type=compass&title=%E5%91%98%E5%B7%A5%E5%9F%B9%E5%85%BB%E6%A8%A1%E5%9E%8B&center=%E6%88%91&up=%E8%87%AA%E5%B7%B1%3A%E8%87%AA%E5%B1%B1%E4%BA%BA&right=%E6%88%91%E5%81%9A%3A%E5%AE%A3%E8%AE%B2%E7%9B%AE%E6%A0%87&down=%E4%BD%A0%E8%AF%B4%3A%E5%90%AC%E5%A2%99%E5%A3%81&left=%E7%8E%AF%E5%A2%83%3A%E5%A4%96%E9%83%A8%E5%BD%B1%E5%93%8D)

中心一个点,上右下左四个方向各射出一支箭头,箭头端点带标签。四象限是用两条轴
把平面切成四块,这里是四条箭头从中心往外 —— 同一族,不同形状。

---

## 参数

| 参数 | 含义 | 缺省 |
| --- | --- | --- |
| `up=` / `right=` / `down=` / `left=` | 该方向的标签;`标签:说明` 写两行 | — |
| `center=` | 中心的字 | — |
| `title=` | 图标题 | — |
| `d=` | 完整 spec 的 JSON | — |

没有内容的方向就不画那支箭头。

## `d=` 形式

```json
{
  "title": "员工培养模型",
  "center": "我",
  "up": { "label": "自己", "note": "自山人" },
  "right": { "label": "我做", "note": "宣讲目标" },
  "down": { "label": "你说", "note": "听墙壁" },
  "left": { "label": "环境", "note": "外部影响" }
}
```

---

## 坑

- **至少要有一个方向**:一个方向都没有是 400。
- **`up=自己:自山人`** —— 冒号分隔标签与说明,所以标签里不能再有冒号。
- **和四象限不是一回事**:四象限用两条轴把平面切四块,四向箭头是四条箭头从中心射出。
