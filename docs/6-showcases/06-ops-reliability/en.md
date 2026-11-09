---
x-title: Ops and reliability — the dashboard wall
x-desc: 'x-cmd/draw showcase: ops and reliability. Real URLs for the uptime SLA gauge, storage, a Kubernetes topology, a login decision flow and weekly active users.'
x-sidebar: draw showcase ops reliability
x-keywords: sre dashboard, uptime chart, k8s diagram, draw showcase, svg
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw showcase ops reliability'
      inLanguage: 'en'
      about: 'x-cmd/draw showcase 06-ops-reliability'
---

# Ops and reliability — the dashboard wall

The handful of panels a service dashboard is made of.

### Uptime — the number on the wall

```text
https://x-cmd.com/draw?type=gauge&t=reliability&title=Uptime%20SLA&value=99.95&max=100
```

[![Uptime SLA](https://x-cmd.com/draw?type=gauge&t=reliability&title=Uptime%20SLA&value=99.95&max=100)](https://x-cmd.com/draw/explore?type=gauge&t=reliability&title=Uptime%20SLA&value=99.95&max=100)

The reliability style: a segmented ring with a scale, so 99.95 does not look like 100.

### Storage — how full are we

```text
https://x-cmd.com/draw?type=gauge&t=gradient&title=Storage%20used&value=68&max=100
```

[![Storage used](https://x-cmd.com/draw?type=gauge&t=gradient&title=Storage%20used&value=68&max=100)](https://x-cmd.com/draw/explore?type=gauge&t=gradient&title=Storage%20used&value=68&max=100)

A gradient ring fills up as the number climbs.

### The cluster — what talks to what

```text
https://x-cmd.com/draw/archmap?n=ing;cloud;Ingress;r0c0&n=svc;cloud;Service;r0c1&n=p1;be;Pod%20api-a;r1c0&n=p2;be;Pod%20api-b;r1c1&n=db;db;StatefulSet;r2c0&n=tw;fe;Web%20UI;r0c2&e=tw;svc&e=ing;svc&e=svc;p1&e=svc;p2&e=p1;db&e=p2;db&b=Namespace;p1%20p2&title=Kubernetes%20topology&w=560
```

[![Kubernetes topology](https://x-cmd.com/draw/archmap?n=ing;cloud;Ingress;r0c0&n=svc;cloud;Service;r0c1&n=p1;be;Pod%20api-a;r1c0&n=p2;be;Pod%20api-b;r1c1&n=db;db;StatefulSet;r2c0&n=tw;fe;Web%20UI;r0c2&e=tw;svc&e=ing;svc&e=svc;p1&e=svc;p2&e=p1;db&e=p2;db&b=Namespace;p1%20p2&title=Kubernetes%20topology&w=560)](https://x-cmd.com/draw/explore/archmap?n=ing;cloud;Ingress;r0c0&n=svc;cloud;Service;r0c1&n=p1;be;Pod%20api-a;r1c0&n=p2;be;Pod%20api-b;r1c1&n=db;db;StatefulSet;r2c0&n=tw;fe;Web%20UI;r0c2&e=tw;svc&e=ing;svc&e=svc;p1&e=svc;p2&e=p1;db&e=p2;db&b=Namespace;p1%20p2&title=Kubernetes%20topology&w=560)

Ingress, service, pods and a stateful set, with the namespace boxed around the pods.

### The login path — a decision tree

```text
https://x-cmd.com/draw/mermaid?m=graph%20TD%0A%20%20Login%5BUser%20login%5D%20--%3E%20MFA%7BMFA%20enabled%3F%7D%0A%20%20MFA%20--%3E%7Cyes%7C%20Code%5BSend%20code%5D%0A%20%20Code%20--%3E%20Verify%5BVerify%5D%0A%20%20Verify%20--%3E%7Cpass%7C%20Session%5BIssue%20session%5D%0A%20%20Verify%20--%3E%7Cfail%7C%20Lock%5BLock%20account%5D%0A%20%20MFA%20--%3E%7Cno%7C%20Session&t=mono&title=Login%20flow&w=560
```

[![Login flow](https://x-cmd.com/draw/mermaid?m=graph%20TD%0A%20%20Login%5BUser%20login%5D%20--%3E%20MFA%7BMFA%20enabled%3F%7D%0A%20%20MFA%20--%3E%7Cyes%7C%20Code%5BSend%20code%5D%0A%20%20Code%20--%3E%20Verify%5BVerify%5D%0A%20%20Verify%20--%3E%7Cpass%7C%20Session%5BIssue%20session%5D%0A%20%20Verify%20--%3E%7Cfail%7C%20Lock%5BLock%20account%5D%0A%20%20MFA%20--%3E%7Cno%7C%20Session&t=mono&title=Login%20flow&w=560)](https://x-cmd.com/draw/explore/mermaid?m=graph%20TD%0A%20%20Login%5BUser%20login%5D%20--%3E%20MFA%7BMFA%20enabled%3F%7D%0A%20%20MFA%20--%3E%7Cyes%7C%20Code%5BSend%20code%5D%0A%20%20Code%20--%3E%20Verify%5BVerify%5D%0A%20%20Verify%20--%3E%7Cpass%7C%20Session%5BIssue%20session%5D%0A%20%20Verify%20--%3E%7Cfail%7C%20Lock%5BLock%20account%5D%0A%20%20MFA%20--%3E%7Cno%7C%20Session&t=mono&title=Login%20flow&w=560)

Mermaid source in, diagram out: MFA on or off, code accepted or not.

### Active users — two surfaces

```text
https://x-cmd.com/draw?type=line&t=opendata&labels=W1,W2,W3,W4,W5,W6,W7,W8&series=App:120,145,138,170,165,198,210,230&series=Web:80,95,110,140,170,190,220,250&title=Weekly%20active%20users
```

[![Weekly active users](https://x-cmd.com/draw?type=line&t=opendata&labels=W1,W2,W3,W4,W5,W6,W7,W8&series=App:120,145,138,170,165,198,210,230&series=Web:80,95,110,140,170,190,220,250&title=Weekly%20active%20users)](https://x-cmd.com/draw/explore?type=line&t=opendata&labels=W1,W2,W3,W4,W5,W6,W7,W8&series=App:120,145,138,170,165,198,210,230&series=Web:80,95,110,140,170,190,220,250&title=Weekly%20active%20users)

Two series over eight weeks; the open-data style is the plainest of them all.


## Which chart for what

| question | chart | reference |
|---|---|---|
| What is our uptime right now? | gauge | [gauge](../../2-chart-types/01-data-charts/07-gauge/en.md) |
| How full is the disk? | gauge | [gauge](../../2-chart-types/01-data-charts/07-gauge/en.md) |
| What talks to what in the cluster? | architecture diagram | [archmap](../../2-chart-types/04-architecture/01-archmap/en.md) |
| What happens when a user logs in? | flowchart | [mermaid](../../2-chart-types/04-architecture/03-mermaid/en.md) |
| How many people are using it? | line | [line](../../2-chart-types/01-data-charts/04-line/en.md) |
