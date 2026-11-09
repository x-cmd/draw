---
x-title: 四向箭头 —— 从中心射出的四个方向
x-desc: x-cmd/draw `type=compass` 用法速查。中心一点,上右下左四个方向各一支箭头(与四象限同族的另一种商业图)。参数:`up=`、`right=`、`down=`、`left=`(各写 `标签` 或 `标签:说明`),`center=` 中心的字,`title=` 图标题。
x-sidebar: draw 四向箭头图
x-keywords: 四向箭头, compass chart, draw, svg, four arrows, 商业决策
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
https://x-cmd.com/draw?type=compass&title=%E4%B8%9A%E5%8A%A1%E5%8D%95%E5%85%83%E7%9A%84%E5%9B%9B%E4%B8%AA%E9%80%89%E9%A1%B9&center=%E6%A0%B8%E5%BF%83%E4%B8%9A%E5%8A%A1&up=%E5%8A%A0%E5%A4%A7%E6%8A%95%E5%85%A5%3A%E6%8A%A2%E4%BB%BD%E9%A2%9D&right=%E7%BB%B4%E6%8C%81%E7%8E%B0%E7%8A%B6%3A%E5%AE%88%E7%8E%B0%E9%87%91%E6%B5%81&down=%E6%94%B6%E7%BC%A9%E8%A7%84%E6%A8%A1%3A%E9%99%8D%E6%88%90%E6%9C%AC&left=%E9%80%80%E5%87%BA%E5%B8%82%E5%9C%BA%3A%E8%85%BE%E8%B5%84%E6%BA%90
```

[![四向箭头图](https://x-cmd.com/draw?type=compass&title=%E4%B8%9A%E5%8A%A1%E5%8D%95%E5%85%83%E7%9A%84%E5%9B%9B%E4%B8%AA%E9%80%89%E9%A1%B9&center=%E6%A0%B8%E5%BF%83%E4%B8%9A%E5%8A%A1&up=%E5%8A%A0%E5%A4%A7%E6%8A%95%E5%85%A5%3A%E6%8A%A2%E4%BB%BD%E9%A2%9D&right=%E7%BB%B4%E6%8C%81%E7%8E%B0%E7%8A%B6%3A%E5%AE%88%E7%8E%B0%E9%87%91%E6%B5%81&down=%E6%94%B6%E7%BC%A9%E8%A7%84%E6%A8%A1%3A%E9%99%8D%E6%88%90%E6%9C%AC&left=%E9%80%80%E5%87%BA%E5%B8%82%E5%9C%BA%3A%E8%85%BE%E8%B5%84%E6%BA%90)](https://x-cmd.com/draw/explore?type=compass&title=%E4%B8%9A%E5%8A%A1%E5%8D%95%E5%85%83%E7%9A%84%E5%9B%9B%E4%B8%AA%E9%80%89%E9%A1%B9&center=%E6%A0%B8%E5%BF%83%E4%B8%9A%E5%8A%A1&up=%E5%8A%A0%E5%A4%A7%E6%8A%95%E5%85%A5%3A%E6%8A%A2%E4%BB%BD%E9%A2%9D&right=%E7%BB%B4%E6%8C%81%E7%8E%B0%E7%8A%B6%3A%E5%AE%88%E7%8E%B0%E9%87%91%E6%B5%81&down=%E6%94%B6%E7%BC%A9%E8%A7%84%E6%A8%A1%3A%E9%99%8D%E6%88%90%E6%9C%AC&left=%E9%80%80%E5%87%BA%E5%B8%82%E5%9C%BA%3A%E8%85%BE%E8%B5%84%E6%BA%90)

中心一个点,上右下左四个方向各射出一支箭头,箭头端点带标签。四象限是用两条轴
把平面切成四块,这里是四条箭头从中心往外 —— 同一族,不同形状。

商业上的用法:一个业务单元的四个选项(加大投入 / 维持 / 收缩 / 退出),
中间那个就是业务单元本身。

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
  "title": "业务单元的四个选项",
  "center": "核心业务",
  "up": { "label": "加大投入", "note": "抢份额" },
  "right": { "label": "维持现状", "note": "守现金流" },
  "down": { "label": "收缩规模", "note": "降成本" },
  "left": { "label": "退出市场", "note": "腾资源" }
}
```

---

## 坑

- **至少要有一个方向**:一个方向都没有是 400。
- **`up=自己:自内而外`** —— 冒号分隔标签与说明,所以标签里不能再有冒号。
- **和四象限不是一回事**:四象限用两条轴把平面切四块,四向箭头是四条箭头从中心射出。
