---
x-title: 七张参考图 —— 我们能画到哪一步
x-desc: 'x-cmd/draw 场景用例:拿七张公开的参考图(agent 榜单、家庭网络图、CI 流程、人物关系、动画插画)一张一张对:能画的给 URL,画不了的写清楚为什么。'
x-sidebar: draw 场景用例 参考图
x-keywords: 参考图, agent 横评, 家庭网络图, CI 流水线, 人物关系图, draw 场景用例, frontierharness
x-json-ld:
  '@context': https://schema.org
  '@graph':
    - '@type': TechArticle
      headline: 'draw 场景用例 参考图'
      inLanguage: 'cn'
      about: 'x-cmd/draw 12-reference-examples'
---

# 七张参考图 —— 我们能画到哪一步

看别人家的图,总在想「这个我能不能画」。这一页拿七张公开的参考图,一张一张对:
**能画的给 URL,画不了的写清楚为什么**。

参考图来自:FrontierHarness 的 AI 编码 agent 榜单、r/homelab 风格的家庭网络图、
一条 CI 流程、《权力的游戏》的人物关系图,以及 illos.dev 的动画 SVG 插画。

下面每一张图的数据都是真的 —— 榜单用的是 FrontierHarness 公开的评测结果,
人物关系用的是原著里的人物共现数据集。

## 一、AI 编码 agent 横评

> 参考:frontierharness.org —— 每个 harness 一个点,通过率对成本。

这是最值得抄的一张:横轴是钱(每个任务的中位成本),纵轴是成绩(通过率)。
**每个点旁写着名字** —— 榜单类散点图没有名字就分不清谁是谁。

```text
https://x-cmd.com/draw?type=scatter&x=3.47,3.28,18.34,2.43,4.58,3.46,4.75,3.65,4.72,1.05,3.24,2.9&y=66.7,63.3,63.3,60.0,60.0,60.0,56.7,56.7,56.7,53.3,50.0,50.0&names=codex,dsh-creator,claude-code,pi-responses,dsh-ptc,dsh-standard,oh-my-pi,kimi-code,dsh-minimal,exo,opencode,hermes&logx=1&xname=Median%20cost%20per%20task%20%28USD%29&yname=Pass%20rate%20%28%25%29&title=AI%20coding%20agent%20harnesses&w=760
```

[![AI coding agent harnesses](https://x-cmd.com/draw?type=scatter&x=3.47,3.28,18.34,2.43,4.58,3.46,4.75,3.65,4.72,1.05,3.24,2.9&y=66.7,63.3,63.3,60.0,60.0,60.0,56.7,56.7,56.7,53.3,50.0,50.0&names=codex,dsh-creator,claude-code,pi-responses,dsh-ptc,dsh-standard,oh-my-pi,kimi-code,dsh-minimal,exo,opencode,hermes&logx=1&xname=Median%20cost%20per%20task%20%28USD%29&yname=Pass%20rate%20%28%25%29&title=AI%20coding%20agent%20harnesses&w=760)](https://x-cmd.com/draw/explore?type=scatter&x=3.47,3.28,18.34,2.43,4.58,3.46,4.75,3.65,4.72,1.05,3.24,2.9&y=66.7,63.3,63.3,60.0,60.0,60.0,56.7,56.7,56.7,53.3,50.0,50.0&names=codex,dsh-creator,claude-code,pi-responses,dsh-ptc,dsh-standard,oh-my-pi,kimi-code,dsh-minimal,exo,opencode,hermes&logx=1&xname=Median%20cost%20per%20task%20%28USD%29&yname=Pass%20rate%20%28%25%29&title=AI%20coding%20agent%20harnesses&w=760)

两个新的参数撑着这张图:`names=` 给每个点起名字,`logx=1` 把横轴取对数
(成本从 1 块到 18 块,线性轴上十个点会全挤在左边三分之一)。两条轴也有名字了:
`xname=` / `yname=`。

## 二、同一份数据的榜单

> 参考:同一站点的 leaderboard —— 排名表。

散点看关系,排名看次序。这是同一份数据的另一张脸:

```text
https://x-cmd.com/draw?type=hbar&labels=codex,dsh-creator,claude-code,pi-responses,dsh-ptc,dsh-standard,oh-my-pi,kimi-code,dsh-minimal,exo,opencode,hermes&values=66.7,63.3,63.3,60.0,60.0,60.0,56.7,56.7,56.7,53.3,50.0,50.0&title=Pass%20rate%20by%20harness%20%28%25%29&w=760
```

[![Pass rate by harness](https://x-cmd.com/draw?type=hbar&labels=codex,dsh-creator,claude-code,pi-responses,dsh-ptc,dsh-standard,oh-my-pi,kimi-code,dsh-minimal,exo,opencode,hermes&values=66.7,63.3,63.3,60.0,60.0,60.0,56.7,56.7,56.7,53.3,50.0,50.0&title=Pass%20rate%20by%20harness%20%28%25%29&w=760)](https://x-cmd.com/draw/explore?type=hbar&labels=codex,dsh-creator,claude-code,pi-responses,dsh-ptc,dsh-standard,oh-my-pi,kimi-code,dsh-minimal,exo,opencode,hermes&values=66.7,63.3,63.3,60.0,60.0,60.0,56.7,56.7,56.7,53.3,50.0,50.0&title=Pass%20rate%20by%20harness%20%28%25%29&w=760)

条形图按通过率排,数值在条尾 —— 谁强谁弱一眼就完,不用去对散点的位置。

## 三、家庭网络

> 参考:Goblinmine/homelab-diagram —— r/homelab 风格的网络图。

那张图是海报级的:一堆面板、图标、表格。draw 画不了那种密度,但**拓扑关系**是它的本行:

```text
https://x-cmd.com/draw/arch2?n=inet;ext;Internet;WAN;r0c1&n=router;sec;Router;OpenWrt;r1c1&n=switch;svc;Switch;2.5G;r2c1&n=ap;fe;Wi-Fi%20AP;Wi-Fi%206;r2c3&n=nas;db;NAS;4x12TB;r3c0&n=ha;be;Home%20Assistant;automations;r3c1&n=jelly;fe;Jellyfin;media;r3c2&n=pihole;be;Pi-hole;DNS;r3c3&e=inet;router;WAN&e=router;switch;LAN&e=switch;ap;PoE&e=switch;nas;2.5G&e=switch;ha;2.5G&e=switch;jelly;2.5G&e=switch;pihole;2.5G&b=LAN%20192.168.1.0/24;router%20switch%20nas%20ha%20jelly%20pihole&b=Wi-Fi%20192.168.10.0/24;ap&title=Home%20network&w=760
```

[![Home network](https://x-cmd.com/draw/arch2?n=inet;ext;Internet;WAN;r0c1&n=router;sec;Router;OpenWrt;r1c1&n=switch;svc;Switch;2.5G;r2c1&n=ap;fe;Wi-Fi%20AP;Wi-Fi%206;r2c3&n=nas;db;NAS;4x12TB;r3c0&n=ha;be;Home%20Assistant;automations;r3c1&n=jelly;fe;Jellyfin;media;r3c2&n=pihole;be;Pi-hole;DNS;r3c3&e=inet;router;WAN&e=router;switch;LAN&e=switch;ap;PoE&e=switch;nas;2.5G&e=switch;ha;2.5G&e=switch;jelly;2.5G&e=switch;pihole;2.5G&b=LAN%20192.168.1.0/24;router%20switch%20nas%20ha%20jelly%20pihole&b=Wi-Fi%20192.168.10.0/24;ap&title=Home%20network&w=760)](https://x-cmd.com/draw/explore/arch2?n=inet;ext;Internet;WAN;r0c1&n=router;sec;Router;OpenWrt;r1c1&n=switch;svc;Switch;2.5G;r2c1&n=ap;fe;Wi-Fi%20AP;Wi-Fi%206;r2c3&n=nas;db;NAS;4x12TB;r3c0&n=ha;be;Home%20Assistant;automations;r3c1&n=jelly;fe;Jellyfin;media;r3c2&n=pihole;be;Pi-hole;DNS;r3c3&e=inet;router;WAN&e=router;switch;LAN&e=switch;ap;PoE&e=switch;nas;2.5G&e=switch;ha;2.5G&e=switch;jelly;2.5G&e=switch;pihole;2.5G&b=LAN%20192.168.1.0/24;router%20switch%20nas%20ha%20jelly%20pihole&b=Wi-Fi%20192.168.10.0/24;ap&title=Home%20network&w=760)

一台路由器、一台交换机、四个服务、一个 AP;两个网段用边界框圈出来。
边上的字(2.5G、PoE)是链路本身的信息,不是装饰。

## 四、一条流程

> 参考:讲流程的短视频。

流程解释最怕的是框多线乱。draw 的流程图只有三样东西:状态、判断、终态:

```text
https://x-cmd.com/draw/lifecycle?n=commit;terminal;%E6%8F%90%E4%BA%A4;push%20/%20PR;r0c0&n=lint;state;%E9%9D%99%E6%80%81%E6%A3%80%E6%9F%A5;eslint%20%2B%20tsc;r1c0&n=lintok;decision;%E9%80%9A%E8%BF%87%3F;;r2c0&n=unit;state;%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95;vitest;r2c1&n=unitok;decision;%E9%80%9A%E8%BF%87%3F;;r3c1&n=build;state;%E6%9E%84%E5%BB%BA%E9%95%9C%E5%83%8F;docker%20buildx;r3c2&n=staging;state;%E9%83%A8%E7%BD%B2%20staging;k8s;r4c2&n=gate;decision;%E5%86%92%E7%83%9F%E9%80%9A%E8%BF%87%3F;;r5c2&n=prod;state;%E5%85%A8%E9%87%8F%E5%8F%91%E5%B8%83;canary;r6c2&n=done;terminal;%E4%B8%8A%E7%BA%BF;;r7c2&n=fail;terminal;%E5%A4%B1%E8%B4%A5;%E9%80%9A%E7%9F%A5%E4%BD%9C%E8%80%85;r3c0&e=commit;lint&e=lint;lintok&e=lintok;unit;%E6%98%AF&e=lintok;fail;%E5%90%A6&e=unit;unitok&e=unitok;build;%E6%98%AF&e=unitok;fail;%E5%90%A6&e=build;staging&e=staging;gate&e=gate;prod;%E6%98%AF&e=gate;fail;%E5%90%A6&e=prod;done&title=CI%20%E6%B5%81%E6%B0%B4%E7%BA%BF&w=760
```

[![CI 流水线](https://x-cmd.com/draw/lifecycle?n=commit;terminal;%E6%8F%90%E4%BA%A4;push%20/%20PR;r0c0&n=lint;state;%E9%9D%99%E6%80%81%E6%A3%80%E6%9F%A5;eslint%20%2B%20tsc;r1c0&n=lintok;decision;%E9%80%9A%E8%BF%87%3F;;r2c0&n=unit;state;%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95;vitest;r2c1&n=unitok;decision;%E9%80%9A%E8%BF%87%3F;;r3c1&n=build;state;%E6%9E%84%E5%BB%BA%E9%95%9C%E5%83%8F;docker%20buildx;r3c2&n=staging;state;%E9%83%A8%E7%BD%B2%20staging;k8s;r4c2&n=gate;decision;%E5%86%92%E7%83%9F%E9%80%9A%E8%BF%87%3F;;r5c2&n=prod;state;%E5%85%A8%E9%87%8F%E5%8F%91%E5%B8%83;canary;r6c2&n=done;terminal;%E4%B8%8A%E7%BA%BF;;r7c2&n=fail;terminal;%E5%A4%B1%E8%B4%A5;%E9%80%9A%E7%9F%A5%E4%BD%9C%E8%80%85;r3c0&e=commit;lint&e=lint;lintok&e=lintok;unit;%E6%98%AF&e=lintok;fail;%E5%90%A6&e=unit;unitok&e=unitok;build;%E6%98%AF&e=unitok;fail;%E5%90%A6&e=build;staging&e=staging;gate&e=gate;prod;%E6%98%AF&e=gate;fail;%E5%90%A6&e=prod;done&title=CI%20%E6%B5%81%E6%B0%B4%E7%BA%BF&w=760)](https://x-cmd.com/draw/explore/lifecycle?n=commit;terminal;%E6%8F%90%E4%BA%A4;push%20/%20PR;r0c0&n=lint;state;%E9%9D%99%E6%80%81%E6%A3%80%E6%9F%A5;eslint%20%2B%20tsc;r1c0&n=lintok;decision;%E9%80%9A%E8%BF%87%3F;;r2c0&n=unit;state;%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95;vitest;r2c1&n=unitok;decision;%E9%80%9A%E8%BF%87%3F;;r3c1&n=build;state;%E6%9E%84%E5%BB%BA%E9%95%9C%E5%83%8F;docker%20buildx;r3c2&n=staging;state;%E9%83%A8%E7%BD%B2%20staging;k8s;r4c2&n=gate;decision;%E5%86%92%E7%83%9F%E9%80%9A%E8%BF%87%3F;;r5c2&n=prod;state;%E5%85%A8%E9%87%8F%E5%8F%91%E5%B8%83;canary;r6c2&n=done;terminal;%E4%B8%8A%E7%BA%BF;;r7c2&n=fail;terminal;%E5%A4%B1%E8%B4%A5;%E9%80%9A%E7%9F%A5%E4%BD%9C%E8%80%85;r3c0&e=commit;lint&e=lint;lintok&e=lintok;unit;%E6%98%AF&e=lintok;fail;%E5%90%A6&e=unit;unitok&e=unitok;build;%E6%98%AF&e=unitok;fail;%E5%90%A6&e=build;staging&e=staging;gate&e=gate;prod;%E6%98%AF&e=gate;fail;%E5%90%A6&e=prod;done&title=CI%20%E6%B5%81%E6%B0%B4%E7%BA%BF&w=760)

判断框出边标着「是 / 否」,不用读者去猜哪条是哪条。

## 五、人物关系

> 参考:游戏角色关系图。

这张走的是 ECharts 覆盖层(`/draw/echarts?d=…`),不是核心图种 —— 核心图种里
暂时没有关系图。人物是《冰与火之歌》原著里共现最多的一批,颜色是家族:

```text
https://x-cmd.com/draw/echarts?d=%7B%22title%22:%7B%22text%22:%22Game%20of%20Thrones%20%5Cu2014%20who%20meets%20whom%22%7D,%22legend%22:%7B%22data%22:%5B%22Stark%22,%22Lannister%22,%22Targaryen%22%5D,%22bottom%22:6,%22left%22:%22center%22,%22textStyle%22:%7B%22fontSize%22:11%7D%7D,%22series%22:%5B%7B%22type%22:%22graph%22,%22layout%22:%22circular%22,%22roam%22:false,%22left%22:40,%22right%22:40,%22top%22:56,%22bottom%22:44,%22label%22:%7B%22show%22:true,%22fontSize%22:11,%22position%22:%22right%22%7D,%22labelLayout%22:%7B%22moveOverlap%22:%22shiftY%22,%22hideOverlap%22:false%7D,%22edgeSymbol%22:%5B%22none%22,%22none%22%5D,%22edgeLineStyle%22:%7B%22opacity%22:0.45%7D,%22categories%22:%5B%7B%22name%22:%22Stark%22%7D,%7B%22name%22:%22Lannister%22%7D,%7B%22name%22:%22Targaryen%22%7D%5D,%22data%22:%5B%7B%22name%22:%22Tyrion%22,%22symbolSize%22:32,%22category%22:%22Lannister%22%7D,%7B%22name%22:%22Jon%22,%22symbolSize%22:28,%22category%22:%22Stark%22%7D,%7B%22name%22:%22Sansa%22,%22symbolSize%22:25,%22category%22:%22Stark%22%7D,%7B%22name%22:%22Jaime%22,%22symbolSize%22:25,%22category%22:%22Lannister%22%7D,%7B%22name%22:%22Bran%22,%22symbolSize%22:24,%22category%22:%22Stark%22%7D,%7B%22name%22:%22Robb%22,%22symbolSize%22:24,%22category%22:%22Stark%22%7D,%7B%22name%22:%22Cersei%22,%22symbolSize%22:18,%22category%22:%22Lannister%22%7D,%7B%22name%22:%22Daenerys%22,%22symbolSize%22:19,%22category%22:%22Targaryen%22%7D%5D,%22links%22:%5B%7B%22source%22:%22Bran%22,%22target%22:%22Jon%22%7D,%7B%22source%22:%22Cersei%22,%22target%22:%22Jaime%22%7D,%7B%22source%22:%22Cersei%22,%22target%22:%22Tyrion%22%7D,%7B%22source%22:%22Jaime%22,%22target%22:%22Tyrion%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Bran%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Jaime%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Jon%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Sansa%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Tyrion%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Bran%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Cersei%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Jaime%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Jon%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Tyrion%22%7D%5D%7D%5D%7D&w=760&h=440
```

[![Game of Thrones — who meets whom](https://x-cmd.com/draw/echarts?d=%7B%22title%22:%7B%22text%22:%22Game%20of%20Thrones%20%5Cu2014%20who%20meets%20whom%22%7D,%22legend%22:%7B%22data%22:%5B%22Stark%22,%22Lannister%22,%22Targaryen%22%5D,%22bottom%22:6,%22left%22:%22center%22,%22textStyle%22:%7B%22fontSize%22:11%7D%7D,%22series%22:%5B%7B%22type%22:%22graph%22,%22layout%22:%22circular%22,%22roam%22:false,%22left%22:40,%22right%22:40,%22top%22:56,%22bottom%22:44,%22label%22:%7B%22show%22:true,%22fontSize%22:11,%22position%22:%22right%22%7D,%22labelLayout%22:%7B%22moveOverlap%22:%22shiftY%22,%22hideOverlap%22:false%7D,%22edgeSymbol%22:%5B%22none%22,%22none%22%5D,%22edgeLineStyle%22:%7B%22opacity%22:0.45%7D,%22categories%22:%5B%7B%22name%22:%22Stark%22%7D,%7B%22name%22:%22Lannister%22%7D,%7B%22name%22:%22Targaryen%22%7D%5D,%22data%22:%5B%7B%22name%22:%22Tyrion%22,%22symbolSize%22:32,%22category%22:%22Lannister%22%7D,%7B%22name%22:%22Jon%22,%22symbolSize%22:28,%22category%22:%22Stark%22%7D,%7B%22name%22:%22Sansa%22,%22symbolSize%22:25,%22category%22:%22Stark%22%7D,%7B%22name%22:%22Jaime%22,%22symbolSize%22:25,%22category%22:%22Lannister%22%7D,%7B%22name%22:%22Bran%22,%22symbolSize%22:24,%22category%22:%22Stark%22%7D,%7B%22name%22:%22Robb%22,%22symbolSize%22:24,%22category%22:%22Stark%22%7D,%7B%22name%22:%22Cersei%22,%22symbolSize%22:18,%22category%22:%22Lannister%22%7D,%7B%22name%22:%22Daenerys%22,%22symbolSize%22:19,%22category%22:%22Targaryen%22%7D%5D,%22links%22:%5B%7B%22source%22:%22Bran%22,%22target%22:%22Jon%22%7D,%7B%22source%22:%22Cersei%22,%22target%22:%22Jaime%22%7D,%7B%22source%22:%22Cersei%22,%22target%22:%22Tyrion%22%7D,%7B%22source%22:%22Jaime%22,%22target%22:%22Tyrion%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Bran%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Jaime%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Jon%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Sansa%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Tyrion%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Bran%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Cersei%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Jaime%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Jon%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Tyrion%22%7D%5D%7D%5D%7D&w=760&h=440)](https://x-cmd.com/draw/explore/echarts?d=%7B%22title%22:%7B%22text%22:%22Game%20of%20Thrones%20%5Cu2014%20who%20meets%20whom%22%7D,%22legend%22:%7B%22data%22:%5B%22Stark%22,%22Lannister%22,%22Targaryen%22%5D,%22bottom%22:6,%22left%22:%22center%22,%22textStyle%22:%7B%22fontSize%22:11%7D%7D,%22series%22:%5B%7B%22type%22:%22graph%22,%22layout%22:%22circular%22,%22roam%22:false,%22left%22:40,%22right%22:40,%22top%22:56,%22bottom%22:44,%22label%22:%7B%22show%22:true,%22fontSize%22:11,%22position%22:%22right%22%7D,%22labelLayout%22:%7B%22moveOverlap%22:%22shiftY%22,%22hideOverlap%22:false%7D,%22edgeSymbol%22:%5B%22none%22,%22none%22%5D,%22edgeLineStyle%22:%7B%22opacity%22:0.45%7D,%22categories%22:%5B%7B%22name%22:%22Stark%22%7D,%7B%22name%22:%22Lannister%22%7D,%7B%22name%22:%22Targaryen%22%7D%5D,%22data%22:%5B%7B%22name%22:%22Tyrion%22,%22symbolSize%22:32,%22category%22:%22Lannister%22%7D,%7B%22name%22:%22Jon%22,%22symbolSize%22:28,%22category%22:%22Stark%22%7D,%7B%22name%22:%22Sansa%22,%22symbolSize%22:25,%22category%22:%22Stark%22%7D,%7B%22name%22:%22Jaime%22,%22symbolSize%22:25,%22category%22:%22Lannister%22%7D,%7B%22name%22:%22Bran%22,%22symbolSize%22:24,%22category%22:%22Stark%22%7D,%7B%22name%22:%22Robb%22,%22symbolSize%22:24,%22category%22:%22Stark%22%7D,%7B%22name%22:%22Cersei%22,%22symbolSize%22:18,%22category%22:%22Lannister%22%7D,%7B%22name%22:%22Daenerys%22,%22symbolSize%22:19,%22category%22:%22Targaryen%22%7D%5D,%22links%22:%5B%7B%22source%22:%22Bran%22,%22target%22:%22Jon%22%7D,%7B%22source%22:%22Cersei%22,%22target%22:%22Jaime%22%7D,%7B%22source%22:%22Cersei%22,%22target%22:%22Tyrion%22%7D,%7B%22source%22:%22Jaime%22,%22target%22:%22Tyrion%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Bran%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Jaime%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Jon%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Sansa%22%7D,%7B%22source%22:%22Robb%22,%22target%22:%22Tyrion%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Bran%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Cersei%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Jaime%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Jon%22%7D,%7B%22source%22:%22Sansa%22,%22target%22:%22Tyrion%22%7D%5D%7D%5D%7D&w=760&h=440)

只画了 8 个人:URL 得压在 2.7KB 以内,不然 GitHub 的 Camo 代理会 414
(URL 越长,数据越多 —— 这是「图即数据」的代价)。

## 六、动画 SVG 插画 —— 画不了,也不该画

> 参考:illos.dev —— 给产品站做的动画插画(Shader / HUD / 等距 / 界面四种风格)。

这一类不是 draw 的活。draw 画的是**图表**:数据、比较、关系、流程;
illos 画的是**插画**:氛围、装饰、品牌。两者都叫「SVG 图形」,但一个要能改数字,
一个只要好看。硬用图表去凑一张插画,只会两边都不像。

---

## 这页想说明的事

- **参考图不是抄样式,是抄问题。** 「agent 横评」这个问题 draw 能答;
  「人物关系」要借 ECharts;「动画插画」不该由 draw 答 —— 先分清是哪一类。
- **数据在链接里。** 每张图都是一个能粘进 issue 的 URL,数字可以改,改完图就变。
- **真数据才有说服力。** 榜单用的是公开评测结果,人物用的是原著数据集 ——
  玩具数据的图看起来总比真图好看。
