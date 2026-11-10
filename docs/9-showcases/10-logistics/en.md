---
x-title: Logistics — throughput, fill rate and the network
x-desc: 'x-cmd/draw showcase: logistics and supply chain. Real URLs for on-time deliveries by region, weekly throughput, warehouse fill, shipments by mode, the order-to-door flow and the fulfilment network.'
x-sidebar: draw showcase logistics
x-keywords: logistics chart, supply chain dashboard, draw showcase, svg
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw showcase logistics'
      inLanguage: 'en'
      about: 'x-cmd/draw showcase 10-logistics'
---

# Logistics — throughput, fill rate and the network

The daily picture of a delivery network — how much moved, how full the
warehouses are, and what the network looks like on paper.

### On-time deliveries by region

```text
https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=East,North,South,West,Central&series=on%20time:62,48,71,55,44&series=late:14,26,11,21,33&title=Deliveries%20on%20time%20by%20region
```

[![On-time by region](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=East,North,South,West,Central&series=on%20time:62,48,71,55,44&series=late:14,26,11,21,33&title=Deliveries%20on%20time%20by%20region)](https://x-cmd.com/draw/explore?type=hbar&t=xcmd-issue&labels=East,North,South,West,Central&series=on%20time:62,48,71,55,44&series=late:14,26,11,21,33&title=Deliveries%20on%20time%20by%20region)

Two bars per region: on time against late.

### Weekly throughput — parcels and pallets

```text
https://x-cmd.com/draw?type=line&t=opendata&labels=W1,W2,W3,W4,W5,W6,W7,W8&series=Parcels:1200,1340,1280,1510,1620,1740,1810,1930&series=Pallets:340,380,360,420,455,470,505,530&title=Weekly%20throughput
```

[![Weekly throughput](https://x-cmd.com/draw?type=line&t=opendata&labels=W1,W2,W3,W4,W5,W6,W7,W8&series=Parcels:1200,1340,1280,1510,1620,1740,1810,1930&series=Pallets:340,380,360,420,455,470,505,530&title=Weekly%20throughput)](https://x-cmd.com/draw/explore?type=line&t=opendata&labels=W1,W2,W3,W4,W5,W6,W7,W8&series=Parcels:1200,1340,1280,1510,1620,1740,1810,1930&series=Pallets:340,380,360,420,455,470,505,530&title=Weekly%20throughput)

Two series over eight weeks.

### Warehouse fill — how full are we

```text
https://x-cmd.com/draw?type=gauge&t=gradient&title=Warehouse%20fill&value=72&max=100
```

[![Warehouse fill](https://x-cmd.com/draw?type=gauge&t=gradient&title=Warehouse%20fill&value=72&max=100)](https://x-cmd.com/draw/explore?type=gauge&t=gradient&title=Warehouse%20fill&value=72&max=100)

The gradient ring fills as the number climbs.

### Shipments by mode — the split

```text
https://x-cmd.com/draw?type=pie&title=Shipments%20by%20mode&labels=Road,Rail,Sea,Air&values=48,26,19,7&unit=%25
```

[![Shipments by mode](https://x-cmd.com/draw?type=pie&title=Shipments%20by%20mode&labels=Road,Rail,Sea,Air&values=48,26,19,7&unit=%25)](https://x-cmd.com/draw/explore?type=pie&title=Shipments%20by%20mode&labels=Road,Rail,Sea,Air&values=48,26,19,7&unit=%25)

Road, rail, sea, air — the shape of the network in one ring.

### Order to door — where the time goes

```text
https://x-cmd.com/draw?type=sankey&t=fund&title=Order%20to%20door&labels=Order,Pick,Pack,Ship,Deliver&links=Order>Pick:420;Order>Ship:60;Pick>Pack:380;Pack>Ship:360;Ship>Deliver:340
```

[![Order to door](https://x-cmd.com/draw?type=sankey&t=fund&title=Order%20to%20door&labels=Order,Pick,Pack,Ship,Deliver&links=Order>Pick:420;Order>Ship:60;Pick>Pack:380;Pack>Ship:360;Ship>Deliver:340)](https://x-cmd.com/draw/explore?type=sankey&t=fund&title=Order%20to%20door&labels=Order,Pick,Pack,Ship,Deliver&links=Order>Pick:420;Order>Ship:60;Pick>Pack:380;Pack>Ship:360;Ship>Deliver:340)

Every stage, and the orders that skip a stage entirely.

### The fulfilment network

```text
https://x-cmd.com/draw/archmap?n=hub;sec;Sorting%20hub;r0c0&n=depot;be;Regional%20depot;r1c0&n=van;fe;Delivery%20van;r2c0&n=scanner;db;WMS;r1c1&e=hub;depot&e=depot;van&e=depot;scanner&b=Fulfilment;hub%20depot%20scanner
```

[![Fulfilment network](https://x-cmd.com/draw/archmap?n=hub;sec;Sorting%20hub;r0c0&n=depot;be;Regional%20depot;r1c0&n=van;fe;Delivery%20van;r2c0&n=scanner;db;WMS;r1c1&e=hub;depot&e=depot;van&e=depot;scanner&b=Fulfilment;hub%20depot%20scanner)](https://x-cmd.com/draw/explore/archmap?n=hub;sec;Sorting%20hub;r0c0&n=depot;be;Regional%20depot;r1c0&n=van;fe;Delivery%20van;r2c0&n=scanner;db;WMS;r1c1&e=hub;depot&e=depot;van&e=depot;scanner&b=Fulfilment;hub%20depot%20scanner)

The architecture diagram: hub, depot, van, and the system that feeds them.


## Which chart for what

| question | chart | reference |
|---|---|---|
| Which region is late? | hbar | [hbar](../../2-data-charts/03-hbar/en.md) |
| How much moved this week? | line | [line](../../2-data-charts/04-line/en.md) |
| How full are the warehouses? | gauge | [gauge](../../2-data-charts/07-gauge/en.md) |
| How do we ship? | pie | [pie](../../2-data-charts/01-pie/en.md) |
| Where does the time go? | sankey | [sankey](../../3-relations/01-sankey/en.md) |
| What does the network look like? | architecture diagram | [archmap](../../5-architecture/01-archmap/en.md) |
