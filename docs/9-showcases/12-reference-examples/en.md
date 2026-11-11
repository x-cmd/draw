---
x-title: Seven reference charts — how far we get
x-desc: 'x-cmd/draw showcase: seven public reference charts (an agent leaderboard, a home network, a CI pipeline, a character network, an animated illustration) checked one by one — a URL where we can, an honest reason where we cannot.'
x-sidebar: draw showcase reference charts
x-keywords: reference charts, agent leaderboard, home network, CI pipeline, character network, draw showcase, frontierharness
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw showcase reference charts'
      inLanguage: 'en'
      about: 'x-cmd/draw 12-reference-examples'
---

# Seven reference charts — how far we get

Every time we see someone else's chart we ask: could we draw that? This page checks
seven public references one by one: **a URL where we can, an honest reason where we
cannot**.

The references: FrontierHarness' AI-coding agent leaderboard, an r/homelab-style home
network, a CI pipeline, a character network, and the animated SVG illustrations at
illos.dev.

The data below is real — the leaderboard uses FrontierHarness' published evaluation
results, the character network uses the co-occurrence dataset from the novels.

## 1. AI coding agent harnesses

> Reference: frontierharness.org — one point per harness, pass rate against cost.

This is the one worth copying: money on the x axis (median cost per task), the score
on the y axis (pass rate). **Every point carries its name** — a leaderboard scatter is
unreadable without them.

```text
https://x-cmd.com/draw?type=scatter&x=3.47,3.28,18.34,2.43,4.58,3.46,4.75,3.65,4.72,1.05,3.24,2.9&y=66.7,63.3,63.3,60.0,60.0,60.0,56.7,56.7,56.7,53.3,50.0,50.0&names=codex,dsh-creator,claude-code,pi-responses,dsh-ptc,dsh-standard,oh-my-pi,kimi-code,dsh-minimal,exo,opencode,hermes&logx=1&xname=Median%20cost%20per%20task%20%28USD%29&yname=Pass%20rate%20%28%25%29&title=AI%20coding%20agent%20harnesses&w=760
```

[![AI coding agent harnesses](https://x-cmd.com/draw?type=scatter&x=3.47,3.28,18.34,2.43,4.58,3.46,4.75,3.65,4.72,1.05,3.24,2.9&y=66.7,63.3,63.3,60.0,60.0,60.0,56.7,56.7,56.7,53.3,50.0,50.0&names=codex,dsh-creator,claude-code,pi-responses,dsh-ptc,dsh-standard,oh-my-pi,kimi-code,dsh-minimal,exo,opencode,hermes&logx=1&xname=Median%20cost%20per%20task%20%28USD%29&yname=Pass%20rate%20%28%25%29&title=AI%20coding%20agent%20harnesses&w=760)](https://x-cmd.com/draw/explore?type=scatter&x=3.47,3.28,18.34,2.43,4.58,3.46,4.75,3.65,4.72,1.05,3.24,2.9&y=66.7,63.3,63.3,60.0,60.0,60.0,56.7,56.7,56.7,53.3,50.0,50.0&names=codex,dsh-creator,claude-code,pi-responses,dsh-ptc,dsh-standard,oh-my-pi,kimi-code,dsh-minimal,exo,opencode,hermes&logx=1&xname=Median%20cost%20per%20task%20%28USD%29&yname=Pass%20rate%20%28%25%29&title=AI%20coding%20agent%20harnesses&w=760)

Two new parameters carry this chart: `names=` names each point, and `logx=1` puts the
x axis on a log scale (costs run from $1 to $18 — on a linear axis ten of the twelve
points bunch into the left third). The axes have names too: `xname=` / `yname=`.

## 2. The same data as a ranking

> Reference: the leaderboard on the same site — a ranking table.

The scatter shows relationships, the ranking shows order. Same data, other face:

```text
https://x-cmd.com/draw?type=hbar&labels=codex,dsh-creator,claude-code,pi-responses,dsh-ptc,dsh-standard,oh-my-pi,kimi-code,dsh-minimal,exo,opencode,hermes&values=66.7,63.3,63.3,60.0,60.0,60.0,56.7,56.7,56.7,53.3,50.0,50.0&title=Pass%20rate%20by%20harness%20%28%25%29&w=760
```

[![Pass rate by harness](https://x-cmd.com/draw?type=hbar&labels=codex,dsh-creator,claude-code,pi-responses,dsh-ptc,dsh-standard,oh-my-pi,kimi-code,dsh-minimal,exo,opencode,hermes&values=66.7,63.3,63.3,60.0,60.0,60.0,56.7,56.7,56.7,53.3,50.0,50.0&title=Pass%20rate%20by%20harness%20%28%25%29&w=760)](https://x-cmd.com/draw/explore?type=hbar&labels=codex,dsh-creator,claude-code,pi-responses,dsh-ptc,dsh-standard,oh-my-pi,kimi-code,dsh-minimal,exo,opencode,hermes&values=66.7,63.3,63.3,60.0,60.0,60.0,56.7,56.7,56.7,53.3,50.0,50.0&title=Pass%20rate%20by%20harness%20%28%25%29&w=760)

Bars sorted by pass rate with the value at the end — who is ahead reads at a glance,
without reading point positions.

## 3. A home network

> Reference: Goblinmine/homelab-diagram — an r/homelab-style network diagram.

That one is poster-grade: panels, icons, tables. draw cannot reach that density, but
**topology** is its trade:

```text
https://x-cmd.com/draw/arch2?n=inet;ext;Internet;WAN;r0c1&n=router;sec;Router;OpenWrt;r1c1&n=switch;svc;Switch;2.5G;r2c1&n=ap;fe;Wi-Fi%20AP;Wi-Fi%206;r2c3&n=nas;db;NAS;4x12TB;r3c0&n=ha;be;Home%20Assistant;automations;r3c1&n=jelly;fe;Jellyfin;media;r3c2&n=pihole;be;Pi-hole;DNS;r3c3&e=inet;router;WAN&e=router;switch;LAN&e=switch;ap;PoE&e=switch;nas;2.5G&e=switch;ha;2.5G&e=switch;jelly;2.5G&e=switch;pihole;2.5G&b=LAN%20192.168.1.0/24;router%20switch%20nas%20ha%20jelly%20pihole&b=Wi-Fi%20192.168.10.0/24;ap&title=Home%20network&w=760
```

[![Home network](https://x-cmd.com/draw/arch2?n=inet;ext;Internet;WAN;r0c1&n=router;sec;Router;OpenWrt;r1c1&n=switch;svc;Switch;2.5G;r2c1&n=ap;fe;Wi-Fi%20AP;Wi-Fi%206;r2c3&n=nas;db;NAS;4x12TB;r3c0&n=ha;be;Home%20Assistant;automations;r3c1&n=jelly;fe;Jellyfin;media;r3c2&n=pihole;be;Pi-hole;DNS;r3c3&e=inet;router;WAN&e=router;switch;LAN&e=switch;ap;PoE&e=switch;nas;2.5G&e=switch;ha;2.5G&e=switch;jelly;2.5G&e=switch;pihole;2.5G&b=LAN%20192.168.1.0/24;router%20switch%20nas%20ha%20jelly%20pihole&b=Wi-Fi%20192.168.10.0/24;ap&title=Home%20network&w=760)](https://x-cmd.com/draw/explore/arch2?n=inet;ext;Internet;WAN;r0c1&n=router;sec;Router;OpenWrt;r1c1&n=switch;svc;Switch;2.5G;r2c1&n=ap;fe;Wi-Fi%20AP;Wi-Fi%206;r2c3&n=nas;db;NAS;4x12TB;r3c0&n=ha;be;Home%20Assistant;automations;r3c1&n=jelly;fe;Jellyfin;media;r3c2&n=pihole;be;Pi-hole;DNS;r3c3&e=inet;router;WAN&e=router;switch;LAN&e=switch;ap;PoE&e=switch;nas;2.5G&e=switch;ha;2.5G&e=switch;jelly;2.5G&e=switch;pihole;2.5G&b=LAN%20192.168.1.0/24;router%20switch%20nas%20ha%20jelly%20pihole&b=Wi-Fi%20192.168.10.0/24;ap&title=Home%20network&w=760)

A router, a switch, four services and an access point; two subnets in boundary frames.
The words on the edges (2.5G, PoE) are information about the link, not decoration.

## 4. One pipeline

> Reference: a short video explaining a process.

Process diagrams go wrong when the boxes outnumber the clarity. draw's flow diagrams
have exactly three things: states, decisions, terminals:

```text
https://x-cmd.com/draw/lifecycle?n=commit;terminal;%E6%8F%90%E4%BA%A4;push%20/%20PR;r0c0&n=lint;state;%E9%9D%99%E6%80%81%E6%A3%80%E6%9F%A5;eslint%20%2B%20tsc;r1c0&n=lintok;decision;%E9%80%9A%E8%BF%87%3F;;r2c0&n=unit;state;%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95;vitest;r2c1&n=unitok;decision;%E9%80%9A%E8%BF%87%3F;;r3c1&n=build;state;%E6%9E%84%E5%BB%BA%E9%95%9C%E5%83%8F;docker%20buildx;r3c2&n=staging;state;%E9%83%A8%E7%BD%B2%20staging;k8s;r4c2&n=gate;decision;%E5%86%92%E7%83%9F%E9%80%9A%E8%BF%87%3F;;r5c2&n=prod;state;%E5%85%A8%E9%87%8F%E5%8F%91%E5%B8%83;canary;r6c2&n=done;terminal;%E4%B8%8A%E7%BA%BF;;r7c2&n=fail;terminal;%E5%A4%B1%E8%B4%A5;%E9%80%9A%E7%9F%A5%E4%BD%9C%E8%80%85;r3c0&e=commit;lint&e=lint;lintok&e=lintok;unit;%E6%98%AF&e=lintok;fail;%E5%90%A6&e=unit;unitok&e=unitok;build;%E6%98%AF&e=unitok;fail;%E5%90%A6&e=build;staging&e=staging;gate&e=gate;prod;%E6%98%AF&e=gate;fail;%E5%90%A6&e=prod;done&title=CI%20%E6%B5%81%E6%B0%B4%E7%BA%BF&w=760
```

[![CI pipeline](https://x-cmd.com/draw/lifecycle?n=commit;terminal;%E6%8F%90%E4%BA%A4;push%20/%20PR;r0c0&n=lint;state;%E9%9D%99%E6%80%81%E6%A3%80%E6%9F%A5;eslint%20%2B%20tsc;r1c0&n=lintok;decision;%E9%80%9A%E8%BF%87%3F;;r2c0&n=unit;state;%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95;vitest;r2c1&n=unitok;decision;%E9%80%9A%E8%BF%87%3F;;r3c1&n=build;state;%E6%9E%84%E5%BB%BA%E9%95%9C%E5%83%8F;docker%20buildx;r3c2&n=staging;state;%E9%83%A8%E7%BD%B2%20staging;k8s;r4c2&n=gate;decision;%E5%86%92%E7%83%9F%E9%80%9A%E8%BF%87%3F;;r5c2&n=prod;state;%E5%85%A8%E9%87%8F%E5%8F%91%E5%B8%83;canary;r6c2&n=done;terminal;%E4%B8%8A%E7%BA%BF;;r7c2&n=fail;terminal;%E5%A4%B1%E8%B4%A5;%E9%80%9A%E7%9F%A5%E4%BD%9C%E8%80%85;r3c0&e=commit;lint&e=lint;lintok&e=lintok;unit;%E6%98%AF&e=lintok;fail;%E5%90%A6&e=unit;unitok&e=unitok;build;%E6%98%AF&e=unitok;fail;%E5%90%A6&e=build;staging&e=staging;gate&e=gate;prod;%E6%98%AF&e=gate;fail;%E5%90%A6&e=prod;done&title=CI%20%E6%B5%81%E6%B0%B4%E7%BA%BF&w=760)](https://x-cmd.com/draw/explore/lifecycle?n=commit;terminal;%E6%8F%90%E4%BA%A4;push%20/%20PR;r0c0&n=lint;state;%E9%9D%99%E6%80%81%E6%A3%80%E6%9F%A5;eslint%20%2B%20tsc;r1c0&n=lintok;decision;%E9%80%9A%E8%BF%87%3F;;r2c0&n=unit;state;%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95;vitest;r2c1&n=unitok;decision;%E9%80%9A%E8%BF%87%3F;;r3c1&n=build;state;%E6%9E%84%E5%BB%BA%E9%95%9C%E5%83%8F;docker%20buildx;r3c2&n=staging;state;%E9%83%A8%E7%BD%B2%20staging;k8s;r4c2&n=gate;decision;%E5%86%92%E7%83%9F%E9%80%9A%E8%BF%87%3F;;r5c2&n=prod;state;%E5%85%A8%E9%87%8F%E5%8F%91%E5%B8%83;canary;r6c2&n=done;terminal;%E4%B8%8A%E7%BA%BF;;r7c2&n=fail;terminal;%E5%A4%B1%E8%B4%A5;%E9%80%9A%E7%9F%A5%E4%BD%9C%E8%80%85;r3c0&e=commit;lint&e=lint;lintok&e=lintok;unit;%E6%98%AF&e=lintok;fail;%E5%90%A6&e=unit;unitok&e=unitok;build;%E6%98%AF&e=unitok;fail;%E5%90%A6&e=build;staging&e=staging;gate&e=gate;prod;%E6%98%AF&e=gate;fail;%E5%90%A6&e=prod;done&title=CI%20%E6%B5%81%E6%B0%B4%E7%BA%BF&w=760)

The decision diamonds carry 是/否 on their outgoing edges — the reader never has to
guess which way is which.

## 5. A character network

> Reference: a game character relationship graph.

This one goes through the ECharts overlay (`/draw/echarts?d=…`) — the core chart
types have no relation graph yet. The people are the most co-occurring characters in
the novels; the colours are their houses:

```text
https://x-cmd.com/draw/echarts?d=%7B%22title%22:%7B%22text%22:%22Game%20of%20Thrones%20%5Cu2014%20who%20meets%20whom%22%7D,%22legend%22:%7B%22data%22:%5B%22Stark%22,%22Lannister%22,%22Targaryen%22%5D,%22bottom%22:6,%22left%22:%22center%22,%22textStyle%22:%7B%22fontSize%22:11%7D%7D,%22series%22:%5B%7B%22type%22:%22graph%22,%22layout%22:%22circular%22,%22roam%22:false,%22left%22:40,%22right%22:40,%22top%22:56,%22bottom%22:44,%22label%22:%7B%22show%22:true,%22fontSize%22:11,%22position%22:%22right%22%7D,%22labelLayout%22:%7B%22moveOverlap%22:%22shiftY%22,%22hideOverlap%22:false%7D,%22edgeSymbol%22:%5B%22none%22,%22none%22%5D,%22edgeLineStyle%22:%7B%22opacity%22:0.45%7D,%22categories%22:%5B%7B%22name%22:%22Stark%22%7D,%7B%22name%22:%22Lannister%22%7D,%7B%22name%22:%22Targaryen%22%7D%5D,%22data%22:%5B%7B%22name%22:%22Tyrion%22,%22symbolSize%22:32,%22category%22:%22Lannister%22%7D,%7B%22name%22:%22Jon%22,%22symbolSize%22:28,%22category%22:%22Stark%22%7D,%7B%22name%22:%22Sansa%22,%22symbolSize%22:25,%22category%22:%22Stark%22%7D,%7B%22name%22:%22Jaime%22,%22symbolSize%22:25,%22category%22:%22Lannister%22%7D,%7B%22name%22:%22Bran%22,%22symbolSize%22:24,%22category%22:%22Stark%22%7D,%7B%22name%22:%22Robb%22,%22symbolSize%22:24,%22category%22:%22Stark%22%7D,%7B%22name%22:%22Cersei%22,%22symbolSize%22:18,%22category%22:%22Lannister%22%7D,%7B%22name%22:%22Daenerys%22,%22symbolSize%22:19,%22category%22:%22Targaryen%22%7D%5D,%22links%22:%5B%7B%22source%22:%22Bran%22,%22target%22:%22Jon%22%7D,%7B%22source%22:%22Cersei%22,%22target%22:%22Jaime%22%7D,%7B%22source%22:%22Cersei%22,%22target%22:%22Tyrion%22%7D,%7B%22source%22:%22Jaime%22,%22target%22:%22Tyrion%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Bran%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Jaime%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Jon%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Sansa%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Tyrion%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Bran%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Cersei%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Jaime%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Jon%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Tyrion%22%7D%5D%7D%5D%7D&w=760&h=440
```

[![Game of Thrones — who meets whom](https://x-cmd.com/draw/echarts?d=%7B%22title%22:%7B%22text%22:%22Game%20of%20Thrones%20%5Cu2014%20who%20meets%20whom%22%7D,%22legend%22:%7B%22data%22:%5B%22Stark%22,%22Lannister%22,%22Targaryen%22%5D,%22bottom%22:6,%22left%22:%22center%22,%22textStyle%22:%7B%22fontSize%22:11%7D%7D,%22series%22:%5B%7B%22type%22:%22graph%22,%22layout%22:%22circular%22,%22roam%22:false,%22left%22:40,%22right%22:40,%22top%22:56,%22bottom%22:44,%22label%22:%7B%22show%22:true,%22fontSize%22:11,%22position%22:%22right%22%7D,%22labelLayout%22:%7B%22moveOverlap%22:%22shiftY%22,%22hideOverlap%22:false%7D,%22edgeSymbol%22:%5B%22none%22,%22none%22%5D,%22edgeLineStyle%22:%7B%22opacity%22:0.45%7D,%22categories%22:%5B%7B%22name%22:%22Stark%22%7D,%7B%22name%22:%22Lannister%22%7D,%7B%22name%22:%22Targaryen%22%7D%5D,%22data%22:%5B%7B%22name%22:%22Tyrion%22,%22symbolSize%22:32,%22category%22:%22Lannister%22%7D,%7B%22name%22:%22Jon%22,%22symbolSize%22:28,%22category%22:%22Stark%22%7D,%7B%22name%22:%22Sansa%22,%22symbolSize%22:25,%22category%22:%22Stark%22%7D,%7B%22name%22:%22Jaime%22,%22symbolSize%22:25,%22category%22:%22Lannister%22%7D,%7B%22name%22:%22Bran%22,%22symbolSize%22:24,%22category%22:%22Stark%22%7D,%7B%22name%22:%22Robb%22,%22symbolSize%22:24,%22category%22:%22Stark%22%7D,%7B%22name%22:%22Cersei%22,%22symbolSize%22:18,%22category%22:%22Lannister%22%7D,%7B%22name%22:%22Daenerys%22,%22symbolSize%22:19,%22category%22:%22Targaryen%22%7D%5D,%22links%22:%5B%7B%22source%22:%22Bran%22,%22target%22:%22Jon%22%7D,%7B%22source%22:%22Cersei%22,%22target%22:%22Jaime%22%7D,%7B%22source%22:%22Cersei%22,%22target%22:%22Tyrion%22%7D,%7B%22source%22:%22Jaime%22,%22target%22:%22Tyrion%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Bran%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Jaime%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Jon%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Sansa%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Tyrion%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Bran%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Cersei%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Jaime%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Jon%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Tyrion%22%7D%5D%7D%5D%7D&w=760&h=440)](https://x-cmd.com/draw/explore/echarts?d=%7B%22title%22:%7B%22text%22:%22Game%20of%20Thrones%20%5Cu2014%20who%20meets%20whom%22%7D,%22legend%22:%7B%22data%22:%5B%22Stark%22,%22Lannister%22,%22Targaryen%22%5D,%22bottom%22:6,%22left%22:%22center%22,%22textStyle%22:%7B%22fontSize%22:11%7D%7D,%22series%22:%5B%7B%22type%22:%22graph%22,%22layout%22:%22circular%22,%22roam%22:false,%22left%22:40,%22right%22:40,%22top%22:56,%22bottom%22:44,%22label%22:%7B%22show%22:true,%22fontSize%22:11,%22position%22:%22right%22%7D,%22labelLayout%22:%7B%22moveOverlap%22:%22shiftY%22,%22hideOverlap%22:false%7D,%22edgeSymbol%22:%5B%22none%22,%22none%22%5D,%22edgeLineStyle%22:%7B%22opacity%22:0.45%7D,%22categories%22:%5B%7B%22name%22:%22Stark%22%7D,%7B%22name%22:%22Lannister%22%7D,%7B%22name%22:%22Targaryen%22%7D%5D,%22data%22:%5B%7B%22name%22:%22Tyrion%22,%22symbolSize%22:32,%22category%22:%22Lannister%22%7D,%7B%22name%22:%22Jon%22,%22symbolSize%22:28,%22category%22:%22Stark%22%7D,%7B%22name%22:%22Sansa%22,%22symbolSize%22:25,%22category%22:%22Stark%22%7D,%7B%22name%22:%22Jaime%22,%22symbolSize%22:25,%22category%22:%22Lannister%22%7D,%7B%22name%22:%22Bran%22,%22symbolSize%22:24,%22category%22:%22Stark%22%7D,%7B%22name%22:%22Robb%22,%22symbolSize%22:24,%22category%22:%22Stark%22%7D,%7B%22name%22:%22Cersei%22,%22symbolSize%22:18,%22category%22:%22Lannister%22%7D,%7B%22name%22:%22Daenerys%22,%22symbolSize%22:19,%22category%22:%22Targaryen%22%7D%5D,%22links%22:%5B%7B%22source%22:%22Bran%22,%22target%22:%22Jon%22%7D,%7B%22source%22:%22Cersei%22,%22target%22:%22Jaime%22%7D,%7B%22source%22:%22Cersei%22,%22target%22:%22Tyrion%22%7D,%7B%22source%22:%22Jaime%22,%22target%22:%22Tyrion%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Bran%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Jaime%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Jon%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Sansa%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Tyrion%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Bran%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Cersei%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Jaime%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Jon%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Tyrion%22%7D%5D%7D%5D%7D&w=760&h=440)

Only eight of them: the URL has to stay under 2.7KB or GitHub's Camo proxy answers 414
(the longer the URL, the more data it carries — that is the price of "the chart is
the data").

## 6. Animated SVG illustrations — not ours to draw

> Reference: illos.dev — animated illustrations for product sites (Shader, HUD,
> Isometric and Interface styles).

That is not draw's job. draw draws **charts**: data, comparison, relationships,
processes. illos draws **illustrations**: mood, decoration, brand. Both are "SVG
graphics", but one has to stay editable — you change the numbers and the chart
changes — and the other only has to look good. Forcing a chart to impersonate an
illustration satisfies neither.

---

## What this page is for

- **A reference is a question, not a style to copy.** "Agent leaderboard" is a question
  draw can answer; "character network" needs ECharts; "animated illustration" is not
  draw's question at all — work out which kind you are looking at first.
- **The data lives in the link.** Every chart here is a URL you can paste into an
  issue, and the numbers are editable — change one and the chart changes.
- **Real data convinces.** The leaderboard uses published evaluation results, the
  characters come from the novels — charts made of toy data always look better than
  charts made of facts.
