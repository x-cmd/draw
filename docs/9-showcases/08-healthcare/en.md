---
x-title: Healthcare — waiting times, occupancy and pathways
x-desc: 'x-cmd/draw showcase: healthcare. Real URLs for waiting time by department, outpatient visits, bed occupancy, case mix, length of stay against age, the patient pathway and the clinical systems.'
x-sidebar: draw showcase healthcare
x-keywords: healthcare chart, hospital dashboard, patient data, draw showcase, svg
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw showcase healthcare'
      inLanguage: 'en'
      about: 'x-cmd/draw showcase 08-healthcare'
---

# Healthcare — waiting times, occupancy and pathways

The panels on a hospital wall, and the two diagrams a ward meeting
actually argues about.

### Waiting time by department — the ranking

```text
https://x-cmd.com/draw?type=hbar&title=Waiting%20time%20by%20department&labels=Cardiology,Orthopaedics,Paediatrics,Neurology,Oncology&values=42,35,28,51,63&unit=min
```

[![Waiting time by department](https://x-cmd.com/draw?type=hbar&title=Waiting%20time%20by%20department&labels=Cardiology,Orthopaedics,Paediatrics,Neurology,Oncology&values=42,35,28,51,63&unit=min)](https://x-cmd.com/draw/explore?type=hbar&title=Waiting%20time%20by%20department&labels=Cardiology,Orthopaedics,Paediatrics,Neurology,Oncology&values=42,35,28,51,63&unit=min)

The unit sits in the corner; the longest wait is at the top of the eye.

### Outpatient visits over the year — the trend

```text
https://x-cmd.com/draw?type=area&t=evil&title=Outpatient%20visits&labels=Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec&values=12400,11800,13100,14200,13800,14900,15600,15100,16200,17400,18100,19300
```

[![Outpatient visits](https://x-cmd.com/draw?type=area&t=evil&title=Outpatient%20visits&labels=Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec&values=12400,11800,13100,14200,13800,14900,15600,15100,16200,17400,18100,19300)](https://x-cmd.com/draw/explore?type=area&t=evil&title=Outpatient%20visits&labels=Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec&values=12400,11800,13100,14200,13800,14900,15600,15100,16200,17400,18100,19300)

Twelve months of volume, filled under the line.

### Bed occupancy — one number, right now

```text
https://x-cmd.com/draw?type=gauge&t=reliability&title=Bed%20occupancy&value=78&max=100
```

[![Bed occupancy](https://x-cmd.com/draw?type=gauge&t=reliability&title=Bed%20occupancy&value=78&max=100)](https://x-cmd.com/draw/explore?type=gauge&t=reliability&title=Bed%20occupancy&value=78&max=100)

The reliability style: a segmented ring with a scale, so 78% reads as 78%.

### Case mix — the pie

```text
https://x-cmd.com/draw?type=pie&t=market-mono&title=Case%20mix&labels=Cardiac,Respiratory,Orthopaedic,Neuro,Other&values=18,22,25,15,20&unit=%25
```

[![Case mix](https://x-cmd.com/draw?type=pie&t=market-mono&title=Case%20mix&labels=Cardiac,Respiratory,Orthopaedic,Neuro,Other&values=18,22,25,15,20&unit=%25)](https://x-cmd.com/draw/explore?type=pie&t=market-mono&title=Case%20mix&labels=Cardiac,Respiratory,Orthopaedic,Neuro,Other&values=18,22,25,15,20&unit=%25)

The grayscale donut prints cleanly in a briefing.

### Length of stay against age — the scatter

```text
https://x-cmd.com/draw?type=scatter&title=Length%20of%20stay%20vs%20age&x=24,31,45,52,58,63,67,71,74,79&y=3,4,5,6,7,8,9,10,12,14&unit=days
```

[![Length of stay vs age](https://x-cmd.com/draw?type=scatter&title=Length%20of%20stay%20vs%20age&x=24,31,45,52,58,63,67,71,74,79&y=3,4,5,6,7,8,9,10,12,14&unit=days)](https://x-cmd.com/draw/explore?type=scatter&title=Length%20of%20stay%20vs%20age&x=24,31,45,52,58,63,67,71,74,79&y=3,4,5,6,7,8,9,10,12,14&unit=days)

One point per patient; the slope is the story.

### The patient pathway — a decision tree

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

Mermaid source in, diagram out.

### The clinical systems — who talks to what

```text
https://x-cmd.com/draw/archmap?n=portal;fe;Patient%20portal;r0c0&n=his;be;Hospital%20system;r1c0&n=lab;be;Laboratory;r1c1&n=pharm;db;Pharmacy;r2c0&n=ehr;db;Records;r2c1&e=portal;his&e=his;lab&e=his;pharm&e=his;ehr&b=Clinical%20core;his%20lab%20pharm%20ehr
```

[![Clinical systems](https://x-cmd.com/draw/archmap?n=portal;fe;Patient%20portal;r0c0&n=his;be;Hospital%20system;r1c0&n=lab;be;Laboratory;r1c1&n=pharm;db;Pharmacy;r2c0&n=ehr;db;Records;r2c1&e=portal;his&e=his;lab&e=his;pharm&e=his;ehr&b=Clinical%20core;his%20lab%20pharm%20ehr)](https://x-cmd.com/draw/explore/archmap?n=portal;fe;Patient%20portal;r0c0&n=his;be;Hospital%20system;r1c0&n=lab;be;Laboratory;r1c1&n=pharm;db;Pharmacy;r2c0&n=ehr;db;Records;r2c1&e=portal;his&e=his;lab&e=his;pharm&e=his;ehr&b=Clinical%20core;his%20lab%20pharm%20ehr)

The architecture diagram: a boundary around the clinical core.


## Which chart for what

| question | chart | reference |
|---|---|---|
| Which department is over capacity? | hbar | [hbar](../../2-data-charts/03-hbar/en.md) |
| How is volume trending? | area | [area](../../2-data-charts/05-area/en.md) |
| How full are the beds right now? | gauge | [gauge](../../2-data-charts/07-gauge/en.md) |
| What is the case mix? | pie | [pie](../../2-data-charts/01-pie/en.md) |
| Does age drive the stay? | scatter | [scatter](../../2-data-charts/08-scatter/en.md) |
| What does a patient go through? | flowchart | [mermaid](../../5-architecture/03-mermaid/en.md) |
| What talks to what? | architecture diagram | [archmap](../../5-architecture/01-archmap/en.md) |
