---
x-title: scatter розсіювання — x-cmd/draw
x-desc: SVG-діаграми для епохи ШІ: один ендпоінт `/draw?type=. type=scatter.
x-sidebar: draw
x-keywords: draw, scatter, розсіювання, svg, chart
---

# scatter розсіювання

`GET /draw?type=scatter&...` — відрендерити діаграму

## Приклади

**base**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=%D0%97%D0%B0%D1%82%D1%80%D0%B8%D0%BC%D0%BA%D0%B0
```

![scatter base](https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=%D0%97%D0%B0%D1%82%D1%80%D0%B8%D0%BC%D0%BA%D0%B0)

**base neg**

```text
https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=%D0%97%D0%B0%D1%82%D1%80%D0%B8%D0%BC%D0%BA%D0%B0
```

![scatter base neg](https://x-cmd.com/draw?type=scatter&x=-3,-1,0,1,3&y=2,-2,3,-3,1&title=%D0%97%D0%B0%D1%82%D1%80%D0%B8%D0%BC%D0%BA%D0%B0)

**base num**

```text
https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=%D0%97%D0%B0%D1%82%D1%80%D0%B8%D0%BC%D0%BA%D0%B0
```

![scatter base num](https://x-cmd.com/draw?type=scatter&x=1,2,3&y=2,4,3&num=all&title=%D0%97%D0%B0%D1%82%D1%80%D0%B8%D0%BC%D0%BA%D0%B0)

## Параметри

| Параметри | | |
|---|---|---|
| `x=` | значення x | ✓ |
| `y=` | значення y | ✓ |
| `title=` | заголовок | ✗ |
| `num=` | мітки значень: all/peak/none | ✗ |
| `t=` | сімейство стилю | ✗ |

## `t=`

| | |
|---|---|
| `base` |

## Підводні камені

- ≤200 точок на серію; відʼємні дозволені
- пробіли в заголовку кодуйте як `%20`
