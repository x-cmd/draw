---
x-title: 教育教学 —— 选课、成绩与学期计划
x-desc: 'x-cmd/draw 场景用例:教育教学。各门课选课人数、每周平均分、出勤与成绩、课程评估、课程地图、学期计划的真实 URL。'
x-sidebar: draw 场景用例 教育教学
x-keywords: 教学图表, 课程报告, 学生数据, draw 场景用例, svg
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 场景用例 教育教学'
      inLanguage: 'cn'
      about: 'x-cmd/draw showcase 07-education'
---

# 教育教学 —— 选课、成绩与学期计划

学期末院里要交的东西,以及期中学生自己会看的东西。

### 各门课的选课人数 —— 排名

```text
https://x-cmd.com/draw?type=hbar&title=%E5%90%84%E8%AF%BE%E7%A8%8B%E6%8A%A5%E5%90%8D%E4%BA%BA%E6%95%B0&labels=%E7%AE%97%E6%B3%95%2C%E7%BA%BF%E6%80%A7%E4%BB%A3%E6%95%B0%2C%E7%BB%9F%E8%AE%A1%E5%AD%A6%2C%E6%95%B0%E6%8D%AE%E5%BA%93%2C%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86&values=186,154,141,98,76&unit=%E4%BA%BA
```

[![Enrolment by course](https://x-cmd.com/draw?type=hbar&title=%E5%90%84%E8%AF%BE%E7%A8%8B%E6%8A%A5%E5%90%8D%E4%BA%BA%E6%95%B0&labels=%E7%AE%97%E6%B3%95%2C%E7%BA%BF%E6%80%A7%E4%BB%A3%E6%95%B0%2C%E7%BB%9F%E8%AE%A1%E5%AD%A6%2C%E6%95%B0%E6%8D%AE%E5%BA%93%2C%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86&values=186,154,141,98,76&unit=%E4%BA%BA)](https://x-cmd.com/draw/explore?type=hbar&title=%E5%90%84%E8%AF%BE%E7%A8%8B%E6%8A%A5%E5%90%8D%E4%BA%BA%E6%95%B0&labels=%E7%AE%97%E6%B3%95%2C%E7%BA%BF%E6%80%A7%E4%BB%A3%E6%95%B0%2C%E7%BB%9F%E8%AE%A1%E5%AD%A6%2C%E6%95%B0%E6%8D%AE%E5%BA%93%2C%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86&values=186,154,141,98,76&unit=%E4%BA%BA)

课名长就放左边,人数放右边。

### 每周平均分 —— 两届对比

```text
https://x-cmd.com/draw?type=line&title=%E6%AF%8F%E5%91%A8%E5%B9%B3%E5%9D%87%E5%88%86&labels=W1,W2,W3,W4,W5,W6,W7,W8,W9,W10,W11,W12&series=2024:62,65,64,68,70,69,73,75,74,78,80,82&series=2025:64,67,66,71,74,72,76,79,78,82,85,87
```

[![Average score by week](https://x-cmd.com/draw?type=line&title=%E6%AF%8F%E5%91%A8%E5%B9%B3%E5%9D%87%E5%88%86&labels=W1,W2,W3,W4,W5,W6,W7,W8,W9,W10,W11,W12&series=2024:62,65,64,68,70,69,73,75,74,78,80,82&series=2025:64,67,66,71,74,72,76,79,78,82,85,87)](https://x-cmd.com/draw/explore?type=line&title=%E6%AF%8F%E5%91%A8%E5%B9%B3%E5%9D%87%E5%88%86&labels=W1,W2,W3,W4,W5,W6,W7,W8,W9,W10,W11,W12&series=2024:62,65,64,68,70,69,73,75,74,78,80,82&series=2025:64,67,66,71,74,72,76,79,78,82,85,87)

两条线,一届一根;两条线之间的差距就是重点。

### 出勤与成绩 —— 相关性

```text
https://x-cmd.com/draw?type=scatter&title=%E5%87%BA%E5%8B%A4%E4%B8%8E%E6%88%90%E7%BB%A9&x=52,60,71,66,78,84,69,91,88,74&y=61,68,79,72,85,90,70,94,91,76
```

[![Attendance vs score](https://x-cmd.com/draw?type=scatter&title=%E5%87%BA%E5%8B%A4%E4%B8%8E%E6%88%90%E7%BB%A9&x=52,60,71,66,78,84,69,91,88,74&y=61,68,79,72,85,90,70,94,91,76)](https://x-cmd.com/draw/explore?type=scatter&title=%E5%87%BA%E5%8B%A4%E4%B8%8E%E6%88%90%E7%BB%A9&x=52,60,71,66,78,84,69,91,88,74&y=61,68,79,72,85,90,70,94,91,76)

一个点一个学生。点贴着一条斜线,说明出勤确实在起作用。

### 课程评估 —— 五个维度

```text
https://x-cmd.com/draw?type=radar&t=evil&title=%E8%AF%BE%E7%A8%8B%E8%AF%84%E4%BB%B7&labels=%E6%B8%85%E6%99%B0%E5%BA%A6%2C%E5%B7%A5%E4%BD%9C%E9%87%8F%2C%E6%94%AF%E6%8C%81%2C%E6%95%99%E6%9D%90%2C%E8%80%83%E6%A0%B8&series=2024:7,4,6,7,5&series=2025:8,5,8,8,6
```

[![Course evaluation](https://x-cmd.com/draw?type=radar&t=evil&title=%E8%AF%BE%E7%A8%8B%E8%AF%84%E4%BB%B7&labels=%E6%B8%85%E6%99%B0%E5%BA%A6%2C%E5%B7%A5%E4%BD%9C%E9%87%8F%2C%E6%94%AF%E6%8C%81%2C%E6%95%99%E6%9D%90%2C%E8%80%83%E6%A0%B8&series=2024:7,4,6,7,5&series=2025:8,5,8,8,6)](https://x-cmd.com/draw/explore?type=radar&t=evil&title=%E8%AF%BE%E7%A8%8B%E8%AF%84%E4%BB%B7&labels=%E6%B8%85%E6%99%B0%E5%BA%A6%2C%E5%B7%A5%E4%BD%9C%E9%87%8F%2C%E6%94%AF%E6%8C%81%2C%E6%95%99%E6%9D%90%2C%E8%80%83%E6%A0%B8&series=2024:7,4,6,7,5&series=2025:8,5,8,8,6)

雷达图适合画像:今年对去年,五个维度。

### 课程地图 —— 什么先修什么

```text
https://x-cmd.com/draw/mindmap?n=Syllabus/Math/Linear%20algebra/Vectors&n=Syllabus/Math/Linear%20algebra/Matrices&n=Syllabus/Math/Probability/Combinatorics&n=Syllabus/Math/Probability/Distributions&n=Syllabus/CS/Data%20structures/Trees&n=Syllabus/CS/Data%20structures/Graphs&n=Syllabus/CS/Systems/Concurrency&n=Syllabus/CS/Systems/Databases&style=tree&title=%E8%AF%BE%E7%A8%8B%E5%9C%B0%E5%9B%BE&w=560
```

[![Course map](https://x-cmd.com/draw/mindmap?n=Syllabus/Math/Linear%20algebra/Vectors&n=Syllabus/Math/Linear%20algebra/Matrices&n=Syllabus/Math/Probability/Combinatorics&n=Syllabus/Math/Probability/Distributions&n=Syllabus/CS/Data%20structures/Trees&n=Syllabus/CS/Data%20structures/Graphs&n=Syllabus/CS/Systems/Concurrency&n=Syllabus/CS/Systems/Databases&style=tree&title=%E8%AF%BE%E7%A8%8B%E5%9C%B0%E5%9B%BE&w=560)](https://x-cmd.com/draw/explore/mindmap?n=Syllabus/Math/Linear%20algebra/Vectors&n=Syllabus/Math/Linear%20algebra/Matrices&n=Syllabus/Math/Probability/Combinatorics&n=Syllabus/Math/Probability/Distributions&n=Syllabus/CS/Data%20structures/Trees&n=Syllabus/CS/Data%20structures/Graphs&n=Syllabus/CS/Systems/Concurrency&n=Syllabus/CS/Systems/Databases&style=tree&title=Course%20map&w=560)

大纲的思维导图,tree 形态把父节点放上面。

### 学期计划 —— 讲课、实验、截止日期

```text
https://x-cmd.com/draw/gantt?dateFormat YYYY-MM-DD
  section Term 1
  Lectures :done, l1, 2026-09-01, 28d
  Problem sets :active, p1, 2026-09-15, 35d
  Mid-term :milestone, m1, 2026-10-15, 0d
  section Term 2
  Labs :crit, b1, 2026-11-01, 30d
  Final exam :milestone, m2, 2026-12-18, 0d
```

[![Term plan](https://x-cmd.com/draw/gantt?dateFormat YYYY-MM-DD
  section Term 1
  Lectures :done, l1, 2026-09-01, 28d
  Problem sets :active, p1, 2026-09-15, 35d
  Mid-term :milestone, m1, 2026-10-15, 0d
  section Term 2
  Labs :crit, b1, 2026-11-01, 30d
  Final exam :milestone, m2, 2026-12-18, 0d)](https://x-cmd.com/draw/explore/gantt?dateFormat YYYY-MM-DD
  section Term 1
  Lectures :done, l1, 2026-09-01, 28d
  Problem sets :active, p1, 2026-09-15, 35d
  Mid-term :milestone, m1, 2026-10-15, 0d
  section Term 2
  Labs :crit, b1, 2026-11-01, 30d
  Final exam :milestone, m2, 2026-12-18, 0d)

按学期分段,考试画成里程碑。


## 该用哪张图

| 问题 | 图种 | 参考 |
|---|---|---|
| 哪些课最满? | 横条图 | [hbar](../../2-data-charts/03-hbar/cn.md) |
| 一届比一届好吗? | 折线图 | [line](../../2-data-charts/04-line/cn.md) |
| 出勤有用吗? | 散点图 | [scatter](../../2-data-charts/08-scatter/cn.md) |
| 学生怎么评价? | 雷达图 | [radar](../../2-data-charts/06-radar/cn.md) |
| 大纲长什么样? | 思维导图 | [mindmap](../../5-architecture/02-mindmap/cn.md) |
| 什么时候交? | 甘特图 | [gantt](../../6-schedule/01-gantt/cn.md) |
