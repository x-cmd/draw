---
x-title: Education — enrolment, scores and the term plan
x-desc: 'x-cmd/draw showcase: education. Real URLs for enrolment by course, average score by week, attendance against score, course evaluation, the course map and the term plan.'
x-sidebar: draw showcase education
x-keywords: education chart, course report, student data, draw showcase, svg
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw showcase education'
      inLanguage: 'en'
      about: 'x-cmd/draw showcase 07-education'
---

# Education — enrolment, scores and the term plan

What a department shows at the end of a term, and what a student checks
in the middle of one.

### Enrolment by course — the ranking

```text
https://x-cmd.com/draw?type=hbar&title=Enrolment%20by%20course&labels=Algorithms,Linear%20algebra,Statistics,Databases,Compilers&values=186,154,141,98,76&unit=students
```

[![Enrolment by course](https://x-cmd.com/draw?type=hbar&title=Enrolment%20by%20course&labels=Algorithms,Linear%20algebra,Statistics,Databases,Compilers&values=186,154,141,98,76&unit=students)](https://x-cmd.com/draw/explore?type=hbar&title=Enrolment%20by%20course&labels=Algorithms,Linear%20algebra,Statistics,Databases,Compilers&values=186,154,141,98,76&unit=students)

Long course names on the left, the count on the right.

### Average score by week — two cohorts

```text
https://x-cmd.com/draw?type=line&title=Average%20score%20by%20week&labels=W1,W2,W3,W4,W5,W6,W7,W8,W9,W10,W11,W12&series=2024:62,65,64,68,70,69,73,75,74,78,80,82&series=2025:64,67,66,71,74,72,76,79,78,82,85,87
```

[![Average score by week](https://x-cmd.com/draw?type=line&title=Average%20score%20by%20week&labels=W1,W2,W3,W4,W5,W6,W7,W8,W9,W10,W11,W12&series=2024:62,65,64,68,70,69,73,75,74,78,80,82&series=2025:64,67,66,71,74,72,76,79,78,82,85,87)](https://x-cmd.com/draw/explore?type=line&title=Average%20score%20by%20week&labels=W1,W2,W3,W4,W5,W6,W7,W8,W9,W10,W11,W12&series=2024:62,65,64,68,70,69,73,75,74,78,80,82&series=2025:64,67,66,71,74,72,76,79,78,82,85,87)

Two lines, one per cohort: the gap between them is the story.

### Attendance against score — the correlation

```text
https://x-cmd.com/draw?type=scatter&title=Attendance%20vs%20score&x=52,60,71,66,78,84,69,91,88,74&y=61,68,79,72,85,90,70,94,91,76
```

[![Attendance vs score](https://x-cmd.com/draw?type=scatter&title=Attendance%20vs%20score&x=52,60,71,66,78,84,69,91,88,74&y=61,68,79,72,85,90,70,94,91,76)](https://x-cmd.com/draw/explore?type=scatter&title=Attendance%20vs%20score&x=52,60,71,66,78,84,69,91,88,74&y=61,68,79,72,85,90,70,94,91,76)

One point per student. A tight diagonal means attendance is doing the work.

### Course evaluation — five axes

```text
https://x-cmd.com/draw?type=radar&t=evil&title=Course%20evaluation&labels=Clarity,Workload,Support,Materials,Assessment&series=2024:7,4,6,7,5&series=2025:8,5,8,8,6
```

[![Course evaluation](https://x-cmd.com/draw?type=radar&t=evil&title=Course%20evaluation&labels=Clarity,Workload,Support,Materials,Assessment&series=2024:7,4,6,7,5&series=2025:8,5,8,8,6)](https://x-cmd.com/draw/explore?type=radar&t=evil&title=Course%20evaluation&labels=Clarity,Workload,Support,Materials,Assessment&series=2024:7,4,6,7,5&series=2025:8,5,8,8,6)

Radar for a profile: this year against last, on five axes.

### The course map — what builds on what

```text
https://x-cmd.com/draw/mindmap?n=Syllabus/Math/Linear%20algebra/Vectors&n=Syllabus/Math/Linear%20algebra/Matrices&n=Syllabus/Math/Probability/Combinatorics&n=Syllabus/Math/Probability/Distributions&n=Syllabus/CS/Data%20structures/Trees&n=Syllabus/CS/Data%20structures/Graphs&n=Syllabus/CS/Systems/Concurrency&n=Syllabus/CS/Systems/Databases&style=tree&title=Course%20map&w=560
```

[![Course map](https://x-cmd.com/draw/mindmap?n=Syllabus/Math/Linear%20algebra/Vectors&n=Syllabus/Math/Linear%20algebra/Matrices&n=Syllabus/Math/Probability/Combinatorics&n=Syllabus/Math/Probability/Distributions&n=Syllabus/CS/Data%20structures/Trees&n=Syllabus/CS/Data%20structures/Graphs&n=Syllabus/CS/Systems/Concurrency&n=Syllabus/CS/Systems/Databases&style=tree&title=Course%20map&w=560)](https://x-cmd.com/draw/explore/mindmap?n=Syllabus/Math/Linear%20algebra/Vectors&n=Syllabus/Math/Linear%20algebra/Matrices&n=Syllabus/Math/Probability/Combinatorics&n=Syllabus/Math/Probability/Distributions&n=Syllabus/CS/Data%20structures/Trees&n=Syllabus/CS/Data%20structures/Graphs&n=Syllabus/CS/Systems/Concurrency&n=Syllabus/CS/Systems/Databases&style=tree&title=Course%20map&w=560)

A mind map of the syllabus: the tree style puts the parents above.

### The term plan — lectures, labs, deadlines

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

Sections per term, a milestone for the exam.


## Which chart for what

| question | chart | reference |
|---|---|---|
| Which courses are full? | hbar | [hbar](../../2-data-charts/03-hbar/en.md) |
| Are the cohorts improving? | line | [line](../../2-data-charts/04-line/en.md) |
| Does attendance pay? | scatter | [scatter](../../2-data-charts/08-scatter/en.md) |
| How did students rate it? | radar | [radar](../../2-data-charts/06-radar/en.md) |
| What is the syllabus? | mind map | [mindmap](../../5-architecture/02-mindmap/en.md) |
| When is everything due? | Gantt chart | [gantt](../../6-schedule/01-gantt/en.md) |
