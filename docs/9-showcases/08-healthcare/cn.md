---
x-title: 医疗健康 —— 候诊、占用与就诊路径
x-desc: 'x-cmd/draw 场景用例:医疗健康。各科室候诊时长、门诊量、床位占用率、病种构成、住院天数与年龄、就诊路径、临床系统的真实 URL。'
x-sidebar: draw 场景用例 医疗健康
x-keywords: 医疗图表, 医院看板, 患者数据, draw 场景用例, svg
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 场景用例 医疗健康'
      inLanguage: 'cn'
      about: 'x-cmd/draw showcase 08-healthcare'
---

# 医疗健康 —— 候诊、占用与就诊路径

医院墙上那几块屏,还有科室会上真正会争的两张图。

### 各科室候诊时长 —— 排名

```text
https://x-cmd.com/draw?type=hbar&title=Waiting%20time%20by%20department&labels=Cardiology,Orthopaedics,Paediatrics,Neurology,Oncology&values=42,35,28,51,63&unit=min
```

[![Waiting time by department](https://x-cmd.com/draw?type=hbar&title=Waiting%20time%20by%20department&labels=Cardiology,Orthopaedics,Paediatrics,Neurology,Oncology&values=42,35,28,51,63&unit=min)](https://x-cmd.com/draw/explore?type=hbar&title=Waiting%20time%20by%20department&labels=Cardiology,Orthopaedics,Paediatrics,Neurology,Oncology&values=42,35,28,51,63&unit=min)

单位放在角上;等最久的排在最上面。

### 门诊量 —— 全年趋势

```text
https://x-cmd.com/draw?type=area&t=evil&title=Outpatient%20visits&labels=Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec&values=12400,11800,13100,14200,13800,14900,15600,15100,16200,17400,18100,19300
```

[![Outpatient visits](https://x-cmd.com/draw?type=area&t=evil&title=Outpatient%20visits&labels=Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec&values=12400,11800,13100,14200,13800,14900,15600,15100,16200,17400,18100,19300)](https://x-cmd.com/draw/explore?type=area&t=evil&title=Outpatient%20visits&labels=Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec&values=12400,11800,13100,14200,13800,14900,15600,15100,16200,17400,18100,19300)

十二个月的量,线下填色。

### 床位占用率 —— 此刻就一个数

```text
https://x-cmd.com/draw?type=gauge&t=reliability&title=Bed%20occupancy&value=78&max=100
```

[![Bed occupancy](https://x-cmd.com/draw?type=gauge&t=reliability&title=Bed%20occupancy&value=78&max=100)](https://x-cmd.com/draw/explore?type=gauge&t=reliability&title=Bed%20occupancy&value=78&max=100)

reliability 风格:分区环加刻度,78% 就读成 78%。

### 病种构成 —— 饼图

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=Case%20mix&labels=Cardiac,Respiratory,Orthopaedic,Neuro,Other&values=18,22,25,15,20&unit=%25
```

[![Case mix](https://x-cmd.com/draw?type=pie&t=market-mono&title=Case%20mix&labels=Cardiac,Respiratory,Orthopaedic,Neuro,Other&values=18,22,25,15,20&unit=%25)](https://x-cmd.com/draw/explore?type=pie&t=market-mono&title=Case%20mix&labels=Cardiac,Respiratory,Orthopaedic,Neuro,Other&values=18,22,25,15,20&unit=%25)

灰阶环形图在简报里也印得清楚。

### 住院天数与年龄 —— 散点

```text
https://x-cmd.com/draw?type=scatter&title=Length%20of%20stay%20vs%20age&x=24,31,45,52,58,63,67,71,74,79&y=3,4,5,6,7,8,9,10,12,14&unit=days
```

[![Length of stay vs age](https://x-cmd.com/draw?type=scatter&title=Length%20of%20stay%20vs%20age&x=24,31,45,52,58,63,67,71,74,79&y=3,4,5,6,7,8,9,10,12,14&unit=days)](https://x-cmd.com/draw/explore?type=scatter&title=Length%20of%20stay%20vs%20age&x=24,31,45,52,58,63,67,71,74,79&y=3,4,5,6,7,8,9,10,12,14&unit=days)

一个患者一个点;斜率就是重点。

### 就诊路径 —— 一棵决策树

```text
https://x-cmd.com/draw/mermaid?graph TD
  Patient[Patient arrives] --> Triage[Triage]
  Triage -->|minor| GP[GP consult]
  Triage -->|urgent| ED[Emergency]
  ED --> Ward[Ward admission]
  GP --> Discharge[Discharge]
```

[![Patient pathway](https://x-cmd.com/draw/mermaid?graph TD
  Patient[Patient arrives] --> Triage[Triage]
  Triage -->|minor| GP[GP consult]
  Triage -->|urgent| ED[Emergency]
  ED --> Ward[Ward admission]
  GP --> Discharge[Discharge])](https://x-cmd.com/draw/explore/mermaid?graph TD
  Patient[Patient arrives] --> Triage[Triage]
  Triage -->|minor| GP[GP consult]
  Triage -->|urgent| ED[Emergency]
  ED --> Ward[Ward admission]
  GP --> Discharge[Discharge])

写 Mermaid,出图。

### 临床系统 —— 谁和谁通信

```text
https://x-cmd.com/draw/archmap?n=portal;fe;Patient%20portal;r0c0&n=his;be;Hospital%20system;r1c0&n=lab;be;Laboratory;r1c1&n=pharm;db;Pharmacy;r2c0&n=ehr;db;Records;r2c1&e=portal;his&e=his;lab&e=his;pharm&e=his;ehr&b=Clinical%20core;his%20lab%20pharm%20ehr
```

[![Clinical systems](https://x-cmd.com/draw/archmap?n=portal;fe;Patient%20portal;r0c0&n=his;be;Hospital%20system;r1c0&n=lab;be;Laboratory;r1c1&n=pharm;db;Pharmacy;r2c0&n=ehr;db;Records;r2c1&e=portal;his&e=his;lab&e=his;pharm&e=his;ehr&b=Clinical%20core;his%20lab%20pharm%20ehr)](https://x-cmd.com/draw/explore/archmap?n=portal;fe;Patient%20portal;r0c0&n=his;be;Hospital%20system;r1c0&n=lab;be;Laboratory;r1c1&n=pharm;db;Pharmacy;r2c0&n=ehr;db;Records;r2c1&e=portal;his&e=his;lab&e=his;pharm&e=his;ehr&b=Clinical%20core;his%20lab%20pharm%20ehr)

架构图:临床核心那一圈是边界。


## 该用哪张图

| 问题 | 图种 | 参考 |
|---|---|---|
| 哪个科室超负荷? | 横条图 | [hbar](../../2-data-charts/03-hbar/cn.md) |
| 门诊量在涨还是跌? | 面积图 | [area](../../2-data-charts/05-area/cn.md) |
| 此刻床位满不满? | 仪表盘 | [gauge](../../2-data-charts/07-gauge/cn.md) |
| 病种怎么构成? | 饼图 | [pie](../../2-data-charts/01-pie/cn.md) |
| 年龄决定住院天数吗? | 散点图 | [scatter](../../2-data-charts/08-scatter/cn.md) |
| 患者要经过哪几步? | 流程图 | [mermaid](../../5-architecture/03-mermaid/cn.md) |
| 系统之间怎么连? | 架构图 | [archmap](../../5-architecture/01-archmap/cn.md) |
