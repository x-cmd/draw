---
x-title: 日历 —— 一个月、一周、一年,以及课程表和排期表
x-desc: 'x-cmd/draw 日历(`/draw?type=calendar`):月历、周历、年历、双月历、三月历、课程表、排期表 —— URL 控图,内容都在链接里。'
x-sidebar: draw 日历
x-keywords: 日历, 月历, 周历, 年历, 双月历, 三月历, 课程表, 排期表, 值班表, calendar, draw
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 日历'
      inLanguage: 'cn'
      about: 'x-cmd/draw 12-calendar'
---

# 日历 —— 一个月、一周、一年,以及课程表和排期表

课程表、排期表、周历、月历、年历 —— 它们都是**一段时间 × 一格**的表。
draw 把它们做成一个图种:格子是同一套,内容全在 URL 里。

排版参照 Apple 的日历:白底、细线、日期号小而克制,**今天是红底白字**,
周末的号是灰的,事件是一行一个小圆点加名字。类别多了,图例放底部一行。

## 七种摆法

| `layout=` | 是什么 | 长什么样 |
|---|---|---|
| `month` | 月历 | 一个月 7 列,格子里是那几天的事件 |
| `week` | 周历 | 时间网格:列是七天,行是时段 |
| `year` | 年历 | 12 个小月,有事的日子点一下 |
| `bimonth` | 双月历 | 两个月并排(格子窄,只摆小圆点) |
| `quarter` | 三月历 | 三个月并排,备注放下面(`npos=right` 放右边) |
| `course` | 课程表 | 同周历,但一周从周一开始(`ws=1`),行是节次 |
| `plan` | 排期表 | 行是事项(带日期区间),列是天,今天那根红线 |

## 参数

| 参数 | 意思 |
|---|---|
| `layout=` | 上面七种 |
| `start=` | 锚点日期(`YYYY-MM-DD`)—— 月历看哪个月、周历看哪周、年历看哪年 |
| `ev=` | 事件:`日期;类别;文字[;时间或结束日期]`,可重复 |
| `day=` | 某一天的性质:`日期;work\|rest\|holiday[;名字]`,可重复 |
| `note=` | 备注:`日期(或 YYYY-MM);文字`,可重复 |
| `months=` | 双月/三月历显示哪几个月(`2026-10,2026-11`) |
| `periods=` | 周历/课程表的行(时间槽起点,逗号分隔) |
| `ws=` | 一周从哪天开始:`0`=周日(缺省),`1`=周一 |
| `npos=` | 三月历的备注位置:`below`(缺省)/`right`/`left` |
| `title=` `w=` `h=` `t=` | 标题、尺寸、风格 |

事件类别决定颜色,图例里会写出来:`work` 工作、`meeting` 会议、`review` 评审、
`release` 发布、`focus` 专注、`travel` 出行、`health` 健康、`personal` 个人、
`class` 课程、`oncall` 值班。

## 例子

### 一个月

```text
https://x-cmd.com/draw?type=calendar&layout=month&start=2026-11-01&w=760&h=520&ev=2026-11-02;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-02;review;%E9%9C%80%E6%B1%82%E8%AF%84%E5%AE%A1;14:00&ev=2026-11-03;review;%E4%BB%A3%E7%A0%81%E8%AF%84%E5%AE%A1;10:00&ev=2026-11-03;focus;%E5%86%99%E6%96%87%E6%A1%A3;15:00&ev=2026-11-04;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-04;meeting;%E5%AE%A2%E6%88%B7%E6%B2%9F%E9%80%9A;16:00&ev=2026-11-05;release;%E5%8F%91%20v0.3.1;11:00&ev=2026-11-05;oncall;%E5%80%BC%E7%8F%AD%E4%BA%A4%E6%8E%A5;14:30&ev=2026-11-06;work;%E5%8F%8C%E5%91%A8%E8%BF%AD%E4%BB%A3%E8%AE%A1%E5%88%92;10:00&ev=2026-11-06;health;%E7%9C%8B%E7%89%99%E5%8C%BB;16:00&ev=2026-11-09;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-09;review;%E6%9E%B6%E6%9E%84%E8%AF%84%E5%AE%A1;15:00&ev=2026-11-10;travel;%E5%87%BA%E5%B7%AE%E4%B8%8A%E6%B5%B7;08:00&ev=2026-11-10;oncall;%E5%80%BC%E7%8F%AD;20:00&ev=2026-11-11;class;%E7%AE%97%E6%B3%95%E8%AF%BE;19:00&ev=2026-11-12;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-12;release;%E5%8F%91%20v0.3.2;11:00&ev=2026-11-13;meeting;%E4%B8%8E%E8%AE%BE%E8%AE%A1%E5%AF%B9%E4%B8%80%E7%89%88;10:00&ev=2026-11-13;focus;%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96;14:00&ev=2026-11-16;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-16;review;%E5%AD%A3%E5%BA%A6%E5%9B%9E%E9%A1%BE;15:00&ev=2026-11-17;meeting;%E5%AE%A2%E6%88%B7%E6%B2%9F%E9%80%9A;10:00&ev=2026-11-17;oncall;%E5%80%BC%E7%8F%AD;11:00&ev=2026-11-18;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-18;review;%E7%81%B0%E5%BA%A6%E8%AF%84%E5%AE%A1;14:00&ev=2026-11-19;release;%E5%8F%91%20v0.4.0;10:00&ev=2026-11-19;health;%E4%BD%93%E6%A3%80;16:00&ev=2026-11-20;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-20;focus;%E6%8A%80%E6%9C%AF%E5%80%BA;14:00&ev=2026-11-23;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-23;meeting;%E9%9D%A2%E8%AF%95;11:00&ev=2026-11-24;oncall;%E5%80%BC%E7%8F%AD;10:00&ev=2026-11-24;focus;%E6%96%87%E6%A1%A3%E5%86%B2%E5%88%BA;15:00&ev=2026-11-25;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-25;work;%E8%B7%AF%E7%BA%BF%E5%9B%BE;14:00&ev=2026-11-26;meeting;%E5%AE%A2%E6%88%B7%E6%B2%9F%E9%80%9A;10:00&ev=2026-11-26;oncall;%E5%80%BC%E7%8F%AD;16:00&ev=2026-11-27;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-27;release;%E5%8F%91%20v0.4.1;15:00
```

[![A team in November](https://x-cmd.com/draw?type=calendar&layout=month&start=2026-11-01&w=760&h=520&ev=2026-11-02;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-02;review;%E9%9C%80%E6%B1%82%E8%AF%84%E5%AE%A1;14:00&ev=2026-11-03;review;%E4%BB%A3%E7%A0%81%E8%AF%84%E5%AE%A1;10:00&ev=2026-11-03;focus;%E5%86%99%E6%96%87%E6%A1%A3;15:00&ev=2026-11-04;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-04;meeting;%E5%AE%A2%E6%88%B7%E6%B2%9F%E9%80%9A;16:00&ev=2026-11-05;release;%E5%8F%91%20v0.3.1;11:00&ev=2026-11-05;oncall;%E5%80%BC%E7%8F%AD%E4%BA%A4%E6%8E%A5;14:30&ev=2026-11-06;work;%E5%8F%8C%E5%91%A8%E8%BF%AD%E4%BB%A3%E8%AE%A1%E5%88%92;10:00&ev=2026-11-06;health;%E7%9C%8B%E7%89%99%E5%8C%BB;16:00&ev=2026-11-09;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-09;review;%E6%9E%B6%E6%9E%84%E8%AF%84%E5%AE%A1;15:00&ev=2026-11-10;travel;%E5%87%BA%E5%B7%AE%E4%B8%8A%E6%B5%B7;08:00&ev=2026-11-10;oncall;%E5%80%BC%E7%8F%AD;20:00&ev=2026-11-11;class;%E7%AE%97%E6%B3%95%E8%AF%BE;19:00&ev=2026-11-12;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-12;release;%E5%8F%91%20v0.3.2;11:00&ev=2026-11-13;meeting;%E4%B8%8E%E8%AE%BE%E8%AE%A1%E5%AF%B9%E4%B8%80%E7%89%88;10:00&ev=2026-11-13;focus;%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96;14:00&ev=2026-11-16;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-16;review;%E5%AD%A3%E5%BA%A6%E5%9B%9E%E9%A1%BE;15:00&ev=2026-11-17;meeting;%E5%AE%A2%E6%88%B7%E6%B2%9F%E9%80%9A;10:00&ev=2026-11-17;oncall;%E5%80%BC%E7%8F%AD;11:00&ev=2026-11-18;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-18;review;%E7%81%B0%E5%BA%A6%E8%AF%84%E5%AE%A1;14:00&ev=2026-11-19;release;%E5%8F%91%20v0.4.0;10:00&ev=2026-11-19;health;%E4%BD%93%E6%A3%80;16:00&ev=2026-11-20;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-20;focus;%E6%8A%80%E6%9C%AF%E5%80%BA;14:00&ev=2026-11-23;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-23;meeting;%E9%9D%A2%E8%AF%95;11:00&ev=2026-11-24;oncall;%E5%80%BC%E7%8F%AD;10:00&ev=2026-11-24;focus;%E6%96%87%E6%A1%A3%E5%86%B2%E5%88%BA;15:00&ev=2026-11-25;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-25;work;%E8%B7%AF%E7%BA%BF%E5%9B%BE;14:00&ev=2026-11-26;meeting;%E5%AE%A2%E6%88%B7%E6%B2%9F%E9%80%9A;10:00&ev=2026-11-26;oncall;%E5%80%BC%E7%8F%AD;16:00&ev=2026-11-27;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-27;release;%E5%8F%91%20v0.4.1;15:00)](https://x-cmd.com/draw/explore?type=calendar&layout=month&start=2026-11-01&w=760&h=520&ev=2026-11-02;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-02;review;%E9%9C%80%E6%B1%82%E8%AF%84%E5%AE%A1;14:00&ev=2026-11-03;review;%E4%BB%A3%E7%A0%81%E8%AF%84%E5%AE%A1;10:00&ev=2026-11-03;focus;%E5%86%99%E6%96%87%E6%A1%A3;15:00&ev=2026-11-04;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-04;meeting;%E5%AE%A2%E6%88%B7%E6%B2%9F%E9%80%9A;16:00&ev=2026-11-05;release;%E5%8F%91%20v0.3.1;11:00&ev=2026-11-05;oncall;%E5%80%BC%E7%8F%AD%E4%BA%A4%E6%8E%A5;14:30&ev=2026-11-06;work;%E5%8F%8C%E5%91%A8%E8%BF%AD%E4%BB%A3%E8%AE%A1%E5%88%92;10:00&ev=2026-11-06;health;%E7%9C%8B%E7%89%99%E5%8C%BB;16:00&ev=2026-11-09;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-09;review;%E6%9E%B6%E6%9E%84%E8%AF%84%E5%AE%A1;15:00&ev=2026-11-10;travel;%E5%87%BA%E5%B7%AE%E4%B8%8A%E6%B5%B7;08:00&ev=2026-11-10;oncall;%E5%80%BC%E7%8F%AD;20:00&ev=2026-11-11;class;%E7%AE%97%E6%B3%95%E8%AF%BE;19:00&ev=2026-11-12;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-12;release;%E5%8F%91%20v0.3.2;11:00&ev=2026-11-13;meeting;%E4%B8%8E%E8%AE%BE%E8%AE%A1%E5%AF%B9%E4%B8%80%E7%89%88;10:00&ev=2026-11-13;focus;%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96;14:00&ev=2026-11-16;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-16;review;%E5%AD%A3%E5%BA%A6%E5%9B%9E%E9%A1%BE;15:00&ev=2026-11-17;meeting;%E5%AE%A2%E6%88%B7%E6%B2%9F%E9%80%9A;10:00&ev=2026-11-17;oncall;%E5%80%BC%E7%8F%AD;11:00&ev=2026-11-18;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-18;review;%E7%81%B0%E5%BA%A6%E8%AF%84%E5%AE%A1;14:00&ev=2026-11-19;release;%E5%8F%91%20v0.4.0;10:00&ev=2026-11-19;health;%E4%BD%93%E6%A3%80;16:00&ev=2026-11-20;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-20;focus;%E6%8A%80%E6%9C%AF%E5%80%BA;14:00&ev=2026-11-23;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-23;meeting;%E9%9D%A2%E8%AF%95;11:00&ev=2026-11-24;oncall;%E5%80%BC%E7%8F%AD;10:00&ev=2026-11-24;focus;%E6%96%87%E6%A1%A3%E5%86%B2%E5%88%BA;15:00&ev=2026-11-25;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-25;work;%E8%B7%AF%E7%BA%BF%E5%9B%BE;14:00&ev=2026-11-26;meeting;%E5%AE%A2%E6%88%B7%E6%B2%9F%E9%80%9A;10:00&ev=2026-11-26;oncall;%E5%80%BC%E7%8F%AD;16:00&ev=2026-11-27;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-27;release;%E5%8F%91%20v0.4.1;15:00)

月历不写时间(格子窄,时间会把名字挤没)—— 名字比时间重要,时间留给周历。

### 一周

```text
https://x-cmd.com/draw?type=calendar&layout=week&start=2026-11-09&w=760&h=460&periods=09:00,10:00,11:00,14:00,15:00,16:00,17:00&ev=2026-11-09;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-09;review;%E6%9E%B6%E6%9E%84%E8%AF%84%E5%AE%A1;15:00&ev=2026-11-10;travel;%E5%87%BA%E5%B7%AE%E4%B8%8A%E6%B5%B7;08:00&ev=2026-11-10;oncall;%E5%80%BC%E7%8F%AD;20:00&ev=2026-11-11;class;%E7%AE%97%E6%B3%95%E8%AF%BE;19:00&ev=2026-11-12;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-12;release;%E5%8F%91%20v0.3.2;11:00&ev=2026-11-13;meeting;%E4%B8%8E%E8%AE%BE%E8%AE%A1%E5%AF%B9%E4%B8%80%E7%89%88;10:00&ev=2026-11-13;focus;%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96;14:00
```

[![One work week](https://x-cmd.com/draw?type=calendar&layout=week&start=2026-11-09&w=760&h=460&periods=09:00,10:00,11:00,14:00,15:00,16:00,17:00&ev=2026-11-09;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-09;review;%E6%9E%B6%E6%9E%84%E8%AF%84%E5%AE%A1;15:00&ev=2026-11-10;travel;%E5%87%BA%E5%B7%AE%E4%B8%8A%E6%B5%B7;08:00&ev=2026-11-10;oncall;%E5%80%BC%E7%8F%AD;20:00&ev=2026-11-11;class;%E7%AE%97%E6%B3%95%E8%AF%BE;19:00&ev=2026-11-12;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-12;release;%E5%8F%91%20v0.3.2;11:00&ev=2026-11-13;meeting;%E4%B8%8E%E8%AE%BE%E8%AE%A1%E5%AF%B9%E4%B8%80%E7%89%88;10:00&ev=2026-11-13;focus;%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96;14:00)](https://x-cmd.com/draw/explore?type=calendar&layout=week&start=2026-11-09&w=760&h=460&periods=09:00,10:00,11:00,14:00,15:00,16:00,17:00&ev=2026-11-09;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-09;review;%E6%9E%B6%E6%9E%84%E8%AF%84%E5%AE%A1;15:00&ev=2026-11-10;travel;%E5%87%BA%E5%B7%AE%E4%B8%8A%E6%B5%B7;08:00&ev=2026-11-10;oncall;%E5%80%BC%E7%8F%AD;20:00&ev=2026-11-11;class;%E7%AE%97%E6%B3%95%E8%AF%BE;19:00&ev=2026-11-12;meeting;%E5%9B%A2%E9%98%9F%E5%91%A8%E4%BC%9A;09:30&ev=2026-11-12;release;%E5%8F%91%20v0.3.2;11:00&ev=2026-11-13;meeting;%E4%B8%8E%E8%AE%BE%E8%AE%A1%E5%AF%B9%E4%B8%80%E7%89%88;10:00&ev=2026-11-13;focus;%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96;14:00)

周历按时间落格:一条线是那天,一段是那个时段。

## 坑

- **格子窄就别塞字。** 双月历、三月历的格子只有五十来像素宽,那里只摆小圆点,
  名字留给周历和备注。
- **假日的名字要占地方。** `day=` 的第三个字段是节日的名字(「国庆」),
  它会写在那一天旁边 —— 名字太长会挤到日期号上。
- **`ev=` 的第四段是时间还是结束日期?** 看内容:像 `14:00` 是时间,像 `2026-11-09` 是结束日期
  (排期表用)。两种写法不会撞。
