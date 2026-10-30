# draw

> **English** | [简体中文](readme/cn.md) | [Deutsch](readme/de.md) | [Español](readme/es.md) | [Français](readme/fr.md) | [Italiano](readme/it.md) | [Português](readme/pt.md) | [Русский](readme/ru.md) | [Українська](readme/uk.md) | [日本語](readme/ja.md) | [한국어](readme/ko.md) | [Čeština](readme/cs.md) | [Polski](readme/pl.md) | [Română](readme/ro.md) | [Türkçe](readme/tr.md) | [Tiếng Việt](readme/vi.md) | [ไทย](readme/th.md) | [Bahasa Indonesia](readme/id.md)

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/x-cmd/draw/badge)](https://securityscorecards.dev/viewer/?uri=github.com/x-cmd/draw)

SVG chart generation for the AI era. One endpoint — `/draw?type=...` — with the data in the URL, machine-readable `<metadata>` embedded in every output, and SVG rendered directly by TypeScript. The style system mirrors a designer spec (13 SVGs), with multiple style variants per chart type.

## Sneak peek

All the data lives in the URL — open it in a browser, drop it into an `<img>`, paste it into your repo README: the SVG renders right away.

### Sankey — pull-request lifecycle: type → outcome → age (`type=sankey&t=pipeline`)

```text
https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y+&links=feat>merged:38;feat>closed:12;feat>rejected:8;fix>merged:33;fix>closed:6;fix>rejected:2;docs>merged:16;docs>closed:4;chore>merged:5;chore>closed:6;chore>rejected:6;merged>0-1y:52;merged>1-2y:28;merged>2y+:12;closed>0-1y:14;closed>1-2y:9;closed>2y+:5;rejected>0-1y:9;rejected>1-2y:5;rejected>2y+:2&title=Pull%20requests%20lifecycle&unit=prs
```

![Sankey: PR lifecycle](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y+&links=feat>merged:38;feat>closed:12;feat>rejected:8;fix>merged:33;fix>closed:6;fix>rejected:2;docs>merged:16;docs>closed:4;chore>merged:5;chore>closed:6;chore>rejected:6;merged>0-1y:52;merged>1-2y:28;merged>2y+:12;closed>0-1y:14;closed>1-2y:9;closed>2y+:5;rejected>0-1y:9;rejected>1-2y:5;rejected>2y+:2&title=Pull%20requests%20lifecycle&unit=prs)

### Radar — three-way software comparison (`type=radar&t=evil`, multi-series)

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison
```

![Radar: editor comparison](https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison)

### Combo — weekly downloads vs star-growth rate (`type=combo`, dual y-axis)

```text
https://x-cmd.com/draw?type=combo&labels=Mon,Tue,Wed,Thu,Fri,Sat,Sun&series=Downloads:120,180,150,210,240,200,260&line=Star%20growth:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Weekly%20npm%20downloads&unit=dl
```

![Combo: downloads + star growth](https://x-cmd.com/draw?type=combo&labels=Mon,Tue,Wed,Thu,Fri,Sat,Sun&series=Downloads:120,180,150,210,240,200,260&line=Star%20growth:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Weekly%20npm%20downloads&unit=dl)

### Archmap — three-tier web app (`/draw/archmap`: grid cells you author, the engine packs & routes)

```text
https://po6.sh/draw/archmap?title=Web%20App&n=user;ext;User;;r0c0&n=cdn;cloud;CDN;;r0c1&n=web;fe;Web%20App;SSR;r0c2&n=api;be;API;;r1c1&n=db;db;Postgres;;r2c1&n=redis;db;Redis;;r2c2&e=user;cdn;https&e=cdn;web&e=web;api;json&e=api;db;sql;dash&e=api;redis&b=Data%20Layer;db%20redis
```

![Archmap: web app three tiers](https://po6.sh/draw/archmap?title=Web%20App&n=user;ext;User;;r0c0&n=cdn;cloud;CDN;;r0c1&n=web;fe;Web%20App;SSR;r0c2&n=api;be;API;;r1c1&n=db;db;Postgres;;r2c1&n=redis;db;Redis;;r2c2&e=user;cdn;https&e=cdn;web&e=web;api;json&e=api;db;sql;dash&e=api;redis&b=Data%20Layer;db%20redis)

`n=id;type;label;sublabel;r0c1` — the cell address **is** the layout: rows read as tiers, adjacency is legible straight from the URL. `ext/fe/be/db/cloud/sec/bus/svc` map to semantic colors; `b=` wraps a boundary; `e=` takes `main`/`dash` variants.

### Archmap — RAG pipeline (`t=evil`; spans `w2`, two boundaries, emphasis + dashed edges)

```text
https://po6.sh/draw/archmap?title=RAG%20Pipeline&t=evil&n=user;ext;User;Chat%20API;r0c0&n=gw;be;API%20Gateway;rate%20limit;r0c1w2&n=guard;sec;Guardrail;;r1c1&n=llm;be;LLM;embed+rerank;r1c2&n=vec;db;Vector%20Store;;r2c1&n=kb;db;Knowledge%20Base;docs;r2c2&n=obs;cloud;Object%20Storage;;r3c0w2&e=user;gw;question;main&e=gw;guard&e=gw;llm;context&e=guard;llm&e=llm;vec;knn&e=kb;vec;index;dash&e=llm;obs;artifacts&b=Retrieval;vec%20kb&b=Query%20Runtime;gw%20guard%20llm
```

![Archmap: RAG pipeline](https://po6.sh/draw/archmap?title=RAG%20Pipeline&t=evil&n=user;ext;User;Chat%20API;r0c0&n=gw;be;API%20Gateway;rate%20limit;r0c1w2&n=guard;sec;Guardrail;;r1c1&n=llm;be;LLM;embed+rerank;r1c2&n=vec;db;Vector%20Store;;r2c1&n=kb;db;Knowledge%20Base;docs;r2c2&n=obs;cloud;Object%20Storage;;r3c0w2&e=user;gw;question;main&e=gw;guard&e=gw;llm;context&e=guard;llm&e=llm;vec;knn&e=kb;vec;index;dash&e=llm;obs;artifacts&b=Retrieval;vec%20kb&b=Query%20Runtime;gw%20guard%20llm)

### Archmap — Codex CLI, inside the agent (`/draw/archmap`; process + OS-sandbox boundaries)

```text
https://po6.sh/draw/archmap?title=Codex%20CLI%20architecture&n=user;ext;Developer;terminal;r0c0&n=cli;fe;Codex%20CLI;Rust%20%C2%B7%20TUI;r0c1&n=api;cloud;OpenAI;responses%20API;r0c2&n=cfg;svc;config.toml;profiles%20%C2%B7%20sandbox;r1c0&n=core;be;Agent%20Core;turns%20%C2%B7%20tools;r1c1&n=auth;sec;Auth;ChatGPT%20%C2%B7%20API%20key;r1c2&n=agents;svc;AGENTS.md;repo%20context;r2c0&n=tools;svc;Tools;shell%20%C2%B7%20web;r2c1&n=mcp;bus;MCP;servers;r2c2&n=sandbox;sec;Sandbox;seatbelt%20%C2%B7%20landlock;r3c1&e=user;cli;prompt;main&e=cli;core&e=core;api;model;main&e=api;auth;OAuth;dash&e=cli;cfg;load&e=core;tools;exec&e=tools;sandbox;isolated;dash&e=core;mcp&e=agents;core;context&b=CLI%20process;cli%20cfg%20core%20tools%20agents%20mcp&b=OS%20sandbox;sandbox
```

![Archmap: Codex CLI architecture](https://po6.sh/draw/archmap?title=Codex%20CLI%20architecture&n=user;ext;Developer;terminal;r0c0&n=cli;fe;Codex%20CLI;Rust%20%C2%B7%20TUI;r0c1&n=api;cloud;OpenAI;responses%20API;r0c2&n=cfg;svc;config.toml;profiles%20%C2%B7%20sandbox;r1c0&n=core;be;Agent%20Core;turns%20%C2%B7%20tools;r1c1&n=auth;sec;Auth;ChatGPT%20%C2%B7%20API%20key;r1c2&n=agents;svc;AGENTS.md;repo%20context;r2c0&n=tools;svc;Tools;shell%20%C2%B7%20web;r2c1&n=mcp;bus;MCP;servers;r2c2&n=sandbox;sec;Sandbox;seatbelt%20%C2%B7%20landlock;r3c1&e=user;cli;prompt;main&e=cli;core&e=core;api;model;main&e=api;auth;OAuth;dash&e=cli;cfg;load&e=core;tools;exec&e=tools;sandbox;isolated;dash&e=core;mcp&e=agents;core;context&b=CLI%20process;cli%20cfg%20core%20tools%20agents%20mcp&b=OS%20sandbox;sandbox)

A row per tier: terminal → the CLI process (TUI · config · core · tools · MCP · AGENTS.md inside one boundary) → OpenAI; tool exec drops one row further into the OS sandbox.

### Mindmap — LLM technology landscape, 42 nodes (`/draw/mindmap`: `n=root/branch/leaf` paths)

```text
https://po6.sh/draw/mindmap?title=%E5%A4%A7%E6%A8%A1%E5%9E%8B%E6%8A%80%E6%9C%AF%E5%85%A8%E6%99%AF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E6%B8%85%E6%B4%97%E5%8E%BB%E9%87%8D&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E5%90%88%E6%88%90%E6%95%B0%E6%8D%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E8%AE%AD%E7%BB%83/MoE%E6%9E%B6%E6%9E%84&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/SFT&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/RLHF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/DPO&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/temperature&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/top-p&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/KV%20Cache&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E6%8A%95%E6%9C%BA%E8%A7%A3%E7%A0%81&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E9%87%8F%E5%8C%96&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%83%A8%E7%BD%B2/vLLM&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%90%91%E9%87%8F%E5%BA%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%B5%8C%E5%85%A5%E6%A8%A1%E5%9E%8B&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E9%87%8D%E6%8E%92%E5%BA%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%B7%A5%E5%85%B7%E8%B0%83%E7%94%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E4%BB%BB%E5%8A%A1%E8%A7%84%E5%88%92&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%A4%9A%E6%99%BA%E8%83%BD%E4%BD%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/MCP%E5%8D%8F%E8%AE%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/LoRA&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E5%85%A8%E5%8F%82%E6%95%B0%E5%BE%AE%E8%B0%83&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E7%9F%A5%E8%AF%86%E8%92%B8%E9%A6%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/MMLU&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/HumanEval&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/LLM%E8%AF%84%E5%AE%A1&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E8%A7%89%E7%BC%96%E7%A0%81%E5%99%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%AF%AD%E9%9F%B3&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E9%A2%91
```

![Mindmap: LLM technology landscape](https://po6.sh/draw/mindmap?title=%E5%A4%A7%E6%A8%A1%E5%9E%8B%E6%8A%80%E6%9C%AF%E5%85%A8%E6%99%AF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E6%B8%85%E6%B4%97%E5%8E%BB%E9%87%8D&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E5%90%88%E6%88%90%E6%95%B0%E6%8D%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E8%AE%AD%E7%BB%83/MoE%E6%9E%B6%E6%9E%84&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/SFT&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/RLHF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/DPO&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/temperature&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/top-p&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/KV%20Cache&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E6%8A%95%E6%9C%BA%E8%A7%A3%E7%A0%81&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E9%87%8F%E5%8C%96&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%83%A8%E7%BD%B2/vLLM&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%90%91%E9%87%8F%E5%BA%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%B5%8C%E5%85%A5%E6%A8%A1%E5%9E%8B&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E9%87%8D%E6%8E%92%E5%BA%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%B7%A5%E5%85%B7%E8%B0%83%E7%94%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E4%BB%BB%E5%8A%A1%E8%A7%84%E5%88%92&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%A4%9A%E6%99%BA%E8%83%BD%E4%BD%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/MCP%E5%8D%8F%E8%AE%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/LoRA&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E5%85%A8%E5%8F%82%E6%95%B0%E5%BE%AE%E8%B0%83&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E7%9F%A5%E8%AF%86%E8%92%B8%E9%A6%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/MMLU&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/HumanEval&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/LLM%E8%AF%84%E5%AE%A1&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E8%A7%89%E7%BC%96%E7%A0%81%E5%99%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%AF%AD%E9%9F%B3&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E9%A2%91)

Every `n=` is one root-to-leaf path — an agent reading the URL rebuilds the whole tree without ever rendering it. CJK and Latin labels mix freely.

### Mindmap — the same 42-node tree, three forms (`style=organic|tree|radial`)

```text
https://po6.sh/draw/mindmap?style=radial&title=%E5%A4%A7%E6%A8%A1%E5%9E%8B%E6%8A%80%E6%9C%AF%E5%85%A8%E6%99%AF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E6%B8%85%E6%B4%97%E5%8E%BB%E9%87%8D&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E5%90%88%E6%88%90%E6%95%B0%E6%8D%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E8%AE%AD%E7%BB%83/MoE%E6%9E%B6%E6%9E%84&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/SFT&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/RLHF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/DPO&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/temperature&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/top-p&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/KV%20Cache&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E6%8A%95%E6%9C%BA%E8%A7%A3%E7%A0%81&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E9%87%8F%E5%8C%96&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%83%A8%E7%BD%B2/vLLM&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%90%91%E9%87%8F%E5%BA%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%B5%8C%E5%85%A5%E6%A8%A1%E5%9E%8B&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E9%87%8D%E6%8E%92%E5%BA%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%B7%A5%E5%85%B7%E8%B0%83%E7%94%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E4%BB%BB%E5%8A%A1%E8%A7%84%E5%88%92&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%A4%9A%E6%99%BA%E8%83%BD%E4%BD%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/MCP%E5%8D%8F%E8%AE%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/LoRA&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E5%85%A8%E5%8F%82%E6%95%B0%E5%BE%AE%E8%B0%83&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E7%9F%A5%E8%AF%86%E8%92%B8%E9%A6%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/MMLU&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/HumanEval&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/LLM%E8%AF%84%E5%AE%A1&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E8%A7%89%E7%BC%96%E7%A0%81%E5%99%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%AF%AD%E9%9F%B3&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E9%A2%91
```

![Mindmap: LLM landscape, radial form](https://po6.sh/draw/mindmap?style=radial&title=%E5%A4%A7%E6%A8%A1%E5%9E%8B%E6%8A%80%E6%9C%AF%E5%85%A8%E6%99%AF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E6%B8%85%E6%B4%97%E5%8E%BB%E9%87%8D&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E5%90%88%E6%88%90%E6%95%B0%E6%8D%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E8%AE%AD%E7%BB%83/MoE%E6%9E%B6%E6%9E%84&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/SFT&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/RLHF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/DPO&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/temperature&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/top-p&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/KV%20Cache&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E6%8A%95%E6%9C%BA%E8%A7%A3%E7%A0%81&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E9%87%8F%E5%8C%96&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%83%A8%E7%BD%B2/vLLM&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%90%91%E9%87%8F%E5%BA%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%B5%8C%E5%85%A5%E6%A8%A1%E5%9E%8B&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E9%87%8D%E6%8E%92%E5%BA%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%B7%A5%E5%85%B7%E8%B0%83%E7%94%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E4%BB%BB%E5%8A%A1%E8%A7%84%E5%88%92&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%A4%9A%E6%99%BA%E8%83%BD%E4%BD%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/MCP%E5%8D%8F%E8%AE%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/LoRA&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E5%85%A8%E5%8F%82%E6%95%B0%E5%BE%AE%E8%B0%83&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E7%9F%A5%E8%AF%86%E8%92%B8%E9%A6%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/MMLU&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/HumanEval&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/LLM%E8%AF%84%E5%AE%A1&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E8%A7%89%E7%BC%96%E7%A0%81%E5%99%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%AF%AD%E9%9F%B3&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E9%A2%91)

Same paths as the tree above — swap `style=`: `organic` (bezier), `tree` (boxes + elbows), `radial` (root-centred fan; leaf slots size themselves to label width). All three sit side by side in the Endpoints table below.

## Six ways to use it (one render core)

Every way below hits the same render core with the same parameters — a URL tested one way works every other way.

### 1. Prompt — tell your AI agent (skill)

Zero install: point any web-connected agent at the skill by URL and ask in plain language —

> Follow the draw skill at https://raw.githubusercontent.com/x-cmd/draw/main/SKILL.md:
> chart language stars as a pie — TypeScript 4821, Python 2312, Go 980

The skill carries the whole contract — chart-type selection by data shape, params, styles, the ECharts layer, short links, error recovery — so the agent answers with a URL:

```text
https://x-cmd.com/draw?type=pie&labels=TypeScript,Python,Go&values=4821,2312,980&title=Language%20stars
```

Agents that load skills natively (Claude Code etc.): drop [`SKILL.md`](SKILL.md) into your skills folder (`~/.claude/skills/draw/SKILL.md`) once, and the same prompt works without the URL line.

### 2. Click a URL — charts straight in the browser

The recommended embed puts the SVG preview behind a click-to-explore link — the image is the chart, a click opens the explore webapp to hover the data, tweak params and edit the values:

[![Pie — stars by language](https://x-cmd.com/draw?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Stars%20by%20language)](https://x-cmd.com/draw/explore?type=pie&labels=TS,Py,Go,Rust&values=4821,2312,980,645&title=Stars%20by%20language)

More to click (open in explore): [Hbar — issues by area, butterfly](https://x-cmd.com/draw/explore?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=open:12,8,15,4,9&series=closed:38,52,20,11,26&title=Issues%20by%20area) · [Radar — editor comparison](https://x-cmd.com/draw/explore?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison)

Or browse the demo page with every type & style: <https://x-cmd.com/draw>

### 3. CLI — fetch or render from the shell

```sh
curl 'https://x-cmd.com/draw?type=bar&labels=Mon,Tue,Wed,Thu,Fri&values=12,18,9,22,15' > barchart.svg
curl 'https://x-cmd.com/draw?type=pie&labels=TS,Py,Go&values=4821,2312,980' -o pie.svg && open pie.svg
curl 'http://localhost:8787/draw?type=line&labels=Q1,Q2,Q3,Q4&values=8,14,23,37' > line.svg   # your own service (way 4), same URLs
```

Offline / no network: the same params ship as a binary (`npm i -g @x-cmd/draw`, or `npx`): stdout = SVG, stderr = diagnostics, so `>` and pipes just work.

```sh
draw --type pie --labels TS,Py,Go --values 4821,2312,980 > pie.svg
draw --type pie --labels TS,Py,Go --values 4821,2312,980 --out pie.png --scheme dark   # .png = rasterized (resvg-wasm)
draw "?type=bar&labels=Mon,Tue&values=3,5"                                  # bare query string, same params as the URL
draw echarts '{"series":[{"type":"treemap","data":[{"name":"a","value":3}]}]}' > treemap.svg   # ECharts layer (also: file / stdin)
```

### 4. Run your own service — local, sandboxed

```sh
git clone https://github.com/x-cmd/draw && cd draw
deno task serve    # = deno run --allow-net --allow-env --sloppy-imports src/node/server.ts
                   # ONLY net+env granted; fs/subprocess/ffi stay denied — the render core needs
                   # none of them, so Deno's permission sandbox is the security boundary
npm run serve      # same server on Node (http://localhost:8787/draw, demo page included)
```

Environment variables: `PORT` (default 8787) · `BASE_PATH` · `DATA_REPO`/`DATA_BRANCH`/`GITHUB_TOKEN` (set these to enable POST short links; unset degrades gracefully, exactly like self-deployed workers).

### 5. Deploy on Cloudflare — one shot

Hand it to your agent (deploy skill in this repo):

> Follow the deploy skill at https://raw.githubusercontent.com/x-cmd/draw/main/deploy-on-cloudflare.SKILL.md:
> deploy x-cmd/draw to my Cloudflare account, serving at charts.example.com/draw

Or run the script yourself:

```sh
bash scripts/setup.sh        # inside the repo: wrangler login → deploy to workers.dev → smoke test
# or from anywhere:
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

The script writes a workers.dev config (no routes/vars), deploys, and prints your URL. From then on: `npx wrangler deploy` to update; custom domain via dashboard → Workers → Domains & Routes (the path prefix auto-adapts — `/draw` subpath or root both work, no code change). Local workerd dev: `npm run dev`.

### 6. Embed into your own service

In-process library (npm / JSR) — the core renders synchronously with no network or files; params identical to the URL:

```sh
npm install @x-cmd/draw
```
```ts
import { draw, renderEchartsOption } from '@x-cmd/draw';
const { svg } = draw({ type: 'pie', labels: 'A,B', values: '3,2', t: 'evil', scheme: 'dark' });
draw('?type=bar&labels=Mon,Tue&values=3,5');                        // query-string form
draw({ type: 'bar', labels: ['Q1, 2024', 'Q2'], values: [1, 2] });  // arrays = repeated params
const e = await renderEchartsOption({ series: [{ type: 'bar', data: [1, 2] }] }, new URLSearchParams());
```

Wire it into any route:

```ts
app.get('/chart', (req, res) => res.type('image/svg+xml').send(draw(req.query).svg));
```

Deno: `import { draw } from "jsr:@x-cmd/draw";`

Or mount the full HTTP layer from this repo (routing, short links, error handling — web-standard `Request`/`Response`, runs on Node/Deno/Bun/Workers):

```ts
import { handleRequest } from './src/handler.js';
const response = await handleRequest(request, env, {});
```

## Endpoints

**`GET /draw?type=<pie|bar|hbar|line|area|radar|gauge|scatter|combo|sankey|qr|archmap|mindmap>`** — render a chart

| type | chart | example |
|---|---|---|
| `pie` | donut; `donut=0` for a solid pie<br><br>**<u>≤100 categories (>9 auto-merge into Other)</u>** | <a href="https://x-cmd.com/draw?type=pie&t=market-mono&title=Languages&unit=%25&labels=TypeScript,Shell,JavaScript,Rust,Other&values=68,14,9,6,3"><img src="https://x-cmd.com/draw?type=pie&t=market-mono&title=Languages&unit=%25&labels=TypeScript,Shell,JavaScript,Rust,Other&values=68,14,9,6,3" width="360" alt="pie example"></a> |
| `bar` | grouped columns; multi-series with `stack=1` for stacked<br><br>**<u>≤30 groups</u>** | <a href="https://x-cmd.com/draw?type=bar&labels=Mon,Tue,Wed&series=dev:12,18,9&series=ci:8,11,6"><img src="https://x-cmd.com/draw?type=bar&labels=Mon,Tue,Wed&series=dev:12,18,9&series=ci:8,11,6" width="360" alt="bar example"></a> |
| `hbar` | horizontal bars (rankings; labels left, values right)<br><br>**<u>≤30 bars, single series (some styles take two)</u>** | <a href="https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=open:12,8,15,4,9&series=closed:38,52,20,11,26&title=Issues%20by%20area"><img src="https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=open:12,8,15,4,9&series=closed:38,52,20,11,26&title=Issues%20by%20area" width="360" alt="hbar butterfly example"></a> <a href="https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs"><img src="https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs" width="360" alt="hbar throughput example"></a> |
| `line` | smooth line + gradient area / multi-line<br><br>**<u>≤60 points</u>** | <a href="https://x-cmd.com/draw?type=line&labels=Jan,Feb,Mar,Apr,May,Jun&values=12,19,15,25,22,30&title=Stars"><img src="https://x-cmd.com/draw?type=line&labels=Jan,Feb,Mar,Apr,May,Jun&values=12,19,15,25,22,30&title=Stars" width="360" alt="line example"></a> |
| `area` | area / multi-series area (gradient fill)<br><br>**<u>≤60 points</u>** | <a href="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=Downloads"><img src="https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=Downloads" width="360" alt="area example"></a> |
| `radar` | radar chart<br><br>**<u>3–12 axes</u>** | <a href="https://x-cmd.com/draw?type=radar&t=evil&labels=perf,docs,tests,dx&series=v1:7,5,8,6&series=v2:8,8,9,8"><img src="https://x-cmd.com/draw?type=radar&t=evil&labels=perf,docs,tests,dx&series=v1:7,5,8,6&series=v2:8,8,9,8" width="360" alt="radar example"></a> |
| `gauge` | gauge (240° arc + center value)<br><br>**<u>`value`+`max` (default 100), value ≤ max; multi-ring ≤8</u>** | <a href="https://x-cmd.com/draw?type=gauge&title=CI%20pass%20rate&value=87&max=100"><img src="https://x-cmd.com/draw?type=gauge&title=CI%20pass%20rate&value=87&max=100" width="360" alt="gauge example"></a> |
| `scatter` | scatter (two numeric axes, negatives supported; no value labels by default)<br><br>**<u>`x=&y=`, ≤200 points</u>** | <a href="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latency"><img src="https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latency" width="360" alt="scatter example"></a> |
| `combo` | bars (`series=`) + line (`line=`) in one chart; `stack=1` to stack the bars<br><br>**<u>≤30 groups, ≤6 series total</u>** | <a href="https://x-cmd.com/draw?type=combo&labels=Mon,Tue,Wed,Thu,Fri&series=dl:120,180,150,210,240&line=growth:3.1,3.4,3.2,3.8,4.1&title=Downloads"><img src="https://x-cmd.com/draw?type=combo&labels=Mon,Tue,Wed,Thu,Fri&series=dl:120,180,150,210,240&line=growth:3.1,3.4,3.2,3.8,4.1&title=Downloads" width="360" alt="combo example"></a> |
| `sankey` | flow diagram with weighted bands<br><br>**<u>`labels=`+`links=A>B:30`, ≤24 nodes/60 links</u>** | <a href="https://x-cmd.com/draw?type=sankey&labels=Visitors,Stars,Forks,PRs,Merged&links=Visitors>Stars:84;Stars>Forks:17;Forks>PRs:9;PRs>Merged:7&title=Contributor%20funnel"><img src="https://x-cmd.com/draw?type=sankey&labels=Visitors,Stars,Forks,PRs,Merged&links=Visitors>Stars:84;Stars>Forks:17;Forks>PRs:9;PRs>Merged:7&title=Contributor%20funnel" width="360" alt="sankey example"></a> |
| `qr` | QR code<br><br>**<u>`d`=text (≤1000 chars), `fg`/`bg` colors, `title`/`unit` captions</u>** | <a href="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=scan%20me"><img src="https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=scan%20me" width="360" alt="qr example"></a> |
| `archmap` | architecture map: you author grid cells (`r0c1`, `w`/`h` spans ≤3, pixel escape `p40,80`), the engine auto-sizes tracks and routes orthogonal edges<br><br>**<u>`n=id;type;label[;sub][;pos]` (types `ext/fe/be/db/cloud/sec/bus/svc`), `e=from;to[;label[;main\|dash]]`, `b=label;ids`; ≤500 nodes</u>** | <a href="https://po6.sh/draw/archmap?title=Web%20App&n=user;ext;User;;r0c0&n=cdn;cloud;CDN;;r0c1&n=web;fe;Web%20App;SSR;r0c2&n=api;be;API;;r1c1&n=db;db;Postgres;;r2c1&n=redis;db;Redis;;r2c2&e=user;cdn;https&e=cdn;web&e=web;api;json&e=api;db;sql;dash&e=api;redis&b=Data%20Layer;db%20redis"><img src="https://po6.sh/draw/archmap?title=Web%20App&n=user;ext;User;;r0c0&n=cdn;cloud;CDN;;r0c1&n=web;fe;Web%20App;SSR;r0c2&n=api;be;API;;r1c1&n=db;db;Postgres;;r2c1&n=redis;db;Redis;;r2c2&e=user;cdn;https&e=cdn;web&e=web;api;json&e=api;db;sql;dash&e=api;redis&b=Data%20Layer;db%20redis" width="300" alt="archmap: web app"></a> <a href="https://po6.sh/draw/archmap?title=Codex%20CLI%20architecture&n=user;ext;Developer;terminal;r0c0&n=cli;fe;Codex%20CLI;Rust%20%C2%B7%20TUI;r0c1&n=api;cloud;OpenAI;responses%20API;r0c2&n=cfg;svc;config.toml;profiles%20%C2%B7%20sandbox;r1c0&n=core;be;Agent%20Core;turns%20%C2%B7%20tools;r1c1&n=auth;sec;Auth;ChatGPT%20%C2%B7%20API%20key;r1c2&n=agents;svc;AGENTS.md;repo%20context;r2c0&n=tools;svc;Tools;shell%20%C2%B7%20web;r2c1&n=mcp;bus;MCP;servers;r2c2&n=sandbox;sec;Sandbox;seatbelt%20%C2%B7%20landlock;r3c1&e=user;cli;prompt;main&e=cli;core&e=core;api;model;main&e=api;auth;OAuth;dash&e=cli;cfg;load&e=core;tools;exec&e=tools;sandbox;isolated;dash&e=core;mcp&e=agents;core;context&b=CLI%20process;cli%20cfg%20core%20tools%20agents%20mcp&b=OS%20sandbox;sandbox"><img src="https://po6.sh/draw/archmap?title=Codex%20CLI%20architecture&n=user;ext;Developer;terminal;r0c0&n=cli;fe;Codex%20CLI;Rust%20%C2%B7%20TUI;r0c1&n=api;cloud;OpenAI;responses%20API;r0c2&n=cfg;svc;config.toml;profiles%20%C2%B7%20sandbox;r1c0&n=core;be;Agent%20Core;turns%20%C2%B7%20tools;r1c1&n=auth;sec;Auth;ChatGPT%20%C2%B7%20API%20key;r1c2&n=agents;svc;AGENTS.md;repo%20context;r2c0&n=tools;svc;Tools;shell%20%C2%B7%20web;r2c1&n=mcp;bus;MCP;servers;r2c2&n=sandbox;sec;Sandbox;seatbelt%20%C2%B7%20landlock;r3c1&e=user;cli;prompt;main&e=cli;core&e=core;api;model;main&e=api;auth;OAuth;dash&e=cli;cfg;load&e=core;tools;exec&e=tools;sandbox;isolated;dash&e=core;mcp&e=agents;core;context&b=CLI%20process;cli%20cfg%20core%20tools%20agents%20mcp&b=OS%20sandbox;sandbox" width="300" alt="archmap: codex cli"></a> |
| `mindmap` | mind map: repeated `n=root/branch/leaf` paths, shared prefixes merge, engine lays out the tree<br><br>**<u>`style=organic\|tree\|radial`; ≤500 nodes, ≤8 levels</u>** | <a href="https://po6.sh/draw/mindmap?title=%E5%A4%A7%E6%A8%A1%E5%9E%8B%E6%8A%80%E6%9C%AF%E5%85%A8%E6%99%AF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E6%B8%85%E6%B4%97%E5%8E%BB%E9%87%8D&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E5%90%88%E6%88%90%E6%95%B0%E6%8D%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E8%AE%AD%E7%BB%83/MoE%E6%9E%B6%E6%9E%84&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/SFT&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/RLHF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/DPO&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/temperature&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/top-p&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/KV%20Cache&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E6%8A%95%E6%9C%BA%E8%A7%A3%E7%A0%81&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E9%87%8F%E5%8C%96&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%83%A8%E7%BD%B2/vLLM&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%90%91%E9%87%8F%E5%BA%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%B5%8C%E5%85%A5%E6%A8%A1%E5%9E%8B&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E9%87%8D%E6%8E%92%E5%BA%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%B7%A5%E5%85%B7%E8%B0%83%E7%94%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E4%BB%BB%E5%8A%A1%E8%A7%84%E5%88%92&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%A4%9A%E6%99%BA%E8%83%BD%E4%BD%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/MCP%E5%8D%8F%E8%AE%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/LoRA&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E5%85%A8%E5%8F%82%E6%95%B0%E5%BE%AE%E8%B0%83&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E7%9F%A5%E8%AF%86%E8%92%B8%E9%A6%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/MMLU&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/HumanEval&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/LLM%E8%AF%84%E5%AE%A1&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E8%A7%89%E7%BC%96%E7%A0%81%E5%99%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%AF%AD%E9%9F%B3&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E9%A2%91"><img src="https://po6.sh/draw/mindmap?title=%E5%A4%A7%E6%A8%A1%E5%9E%8B%E6%8A%80%E6%9C%AF%E5%85%A8%E6%99%AF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E6%B8%85%E6%B4%97%E5%8E%BB%E9%87%8D&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E5%90%88%E6%88%90%E6%95%B0%E6%8D%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E8%AE%AD%E7%BB%83/MoE%E6%9E%B6%E6%9E%84&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/SFT&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/RLHF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/DPO&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/temperature&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/top-p&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/KV%20Cache&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E6%8A%95%E6%9C%BA%E8%A7%A3%E7%A0%81&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E9%87%8F%E5%8C%96&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%83%A8%E7%BD%B2/vLLM&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%90%91%E9%87%8F%E5%BA%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%B5%8C%E5%85%A5%E6%A8%A1%E5%9E%8B&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E9%87%8D%E6%8E%92%E5%BA%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%B7%A5%E5%85%B7%E8%B0%83%E7%94%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E4%BB%BB%E5%8A%A1%E8%A7%84%E5%88%92&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%A4%9A%E6%99%BA%E8%83%BD%E4%BD%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/MCP%E5%8D%8F%E8%AE%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/LoRA&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E5%85%A8%E5%8F%82%E6%95%B0%E5%BE%AE%E8%B0%83&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E7%9F%A5%E8%AF%86%E8%92%B8%E9%A6%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/MMLU&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/HumanEval&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/LLM%E8%AF%84%E5%AE%A1&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E8%A7%89%E7%BC%96%E7%A0%81%E5%99%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%AF%AD%E9%9F%B3&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E9%A2%91" width="230" alt="mindmap organic: LLM landscape"></a> <a href="https://po6.sh/draw/mindmap?style=tree&title=%E5%A4%A7%E6%A8%A1%E5%9E%8B%E6%8A%80%E6%9C%AF%E5%85%A8%E6%99%AF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E6%B8%85%E6%B4%97%E5%8E%BB%E9%87%8D&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E5%90%88%E6%88%90%E6%95%B0%E6%8D%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E8%AE%AD%E7%BB%83/MoE%E6%9E%B6%E6%9E%84&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/SFT&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/RLHF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/DPO&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/temperature&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/top-p&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/KV%20Cache&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E6%8A%95%E6%9C%BA%E8%A7%A3%E7%A0%81&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E9%87%8F%E5%8C%96&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%83%A8%E7%BD%B2/vLLM&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%90%91%E9%87%8F%E5%BA%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%B5%8C%E5%85%A5%E6%A8%A1%E5%9E%8B&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E9%87%8D%E6%8E%92%E5%BA%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%B7%A5%E5%85%B7%E8%B0%83%E7%94%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E4%BB%BB%E5%8A%A1%E8%A7%84%E5%88%92&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%A4%9A%E6%99%BA%E8%83%BD%E4%BD%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/MCP%E5%8D%8F%E8%AE%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/LoRA&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E5%85%A8%E5%8F%82%E6%95%B0%E5%BE%AE%E8%B0%83&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E7%9F%A5%E8%AF%86%E8%92%B8%E9%A6%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/MMLU&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/HumanEval&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/LLM%E8%AF%84%E5%AE%A1&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E8%A7%89%E7%BC%96%E7%A0%81%E5%99%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%AF%AD%E9%9F%B3&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E9%A2%91"><img src="https://po6.sh/draw/mindmap?style=tree&title=%E5%A4%A7%E6%A8%A1%E5%9E%8B%E6%8A%80%E6%9C%AF%E5%85%A8%E6%99%AF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E6%B8%85%E6%B4%97%E5%8E%BB%E9%87%8D&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E5%90%88%E6%88%90%E6%95%B0%E6%8D%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E8%AE%AD%E7%BB%83/MoE%E6%9E%B6%E6%9E%84&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/SFT&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/RLHF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/DPO&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/temperature&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/top-p&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/KV%20Cache&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E6%8A%95%E6%9C%BA%E8%A7%A3%E7%A0%81&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E9%87%8F%E5%8C%96&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%83%A8%E7%BD%B2/vLLM&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%90%91%E9%87%8F%E5%BA%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%B5%8C%E5%85%A5%E6%A8%A1%E5%9E%8B&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E9%87%8D%E6%8E%92%E5%BA%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%B7%A5%E5%85%B7%E8%B0%83%E7%94%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E4%BB%BB%E5%8A%A1%E8%A7%84%E5%88%92&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%A4%9A%E6%99%BA%E8%83%BD%E4%BD%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/MCP%E5%8D%8F%E8%AE%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/LoRA&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E5%85%A8%E5%8F%82%E6%95%B0%E5%BE%AE%E8%B0%83&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E7%9F%A5%E8%AF%86%E8%92%B8%E9%A6%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/MMLU&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/HumanEval&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/LLM%E8%AF%84%E5%AE%A1&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E8%A7%89%E7%BC%96%E7%A0%81%E5%99%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%AF%AD%E9%9F%B3&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E9%A2%91" width="280" alt="mindmap tree: LLM landscape"></a> <a href="https://po6.sh/draw/mindmap?style=radial&title=%E5%A4%A7%E6%A8%A1%E5%9E%8B%E6%8A%80%E6%9C%AF%E5%85%A8%E6%99%AF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E6%B8%85%E6%B4%97%E5%8E%BB%E9%87%8D&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E5%90%88%E6%88%90%E6%95%B0%E6%8D%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E8%AE%AD%E7%BB%83/MoE%E6%9E%B6%E6%9E%84&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/SFT&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/RLHF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/DPO&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/temperature&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/top-p&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/KV%20Cache&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E6%8A%95%E6%9C%BA%E8%A7%A3%E7%A0%81&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E9%87%8F%E5%8C%96&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%83%A8%E7%BD%B2/vLLM&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%90%91%E9%87%8F%E5%BA%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%B5%8C%E5%85%A5%E6%A8%A1%E5%9E%8B&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E9%87%8D%E6%8E%92%E5%BA%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%B7%A5%E5%85%B7%E8%B0%83%E7%94%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E4%BB%BB%E5%8A%A1%E8%A7%84%E5%88%92&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%A4%9A%E6%99%BA%E8%83%BD%E4%BD%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/MCP%E5%8D%8F%E8%AE%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/LoRA&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E5%85%A8%E5%8F%82%E6%95%B0%E5%BE%AE%E8%B0%83&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E7%9F%A5%E8%AF%86%E8%92%B8%E9%A6%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/MMLU&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/HumanEval&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/LLM%E8%AF%84%E5%AE%A1&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E8%A7%89%E7%BC%96%E7%A0%81%E5%99%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%AF%AD%E9%9F%B3&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E9%A2%91"><img src="https://po6.sh/draw/mindmap?style=radial&title=%E5%A4%A7%E6%A8%A1%E5%9E%8B%E6%8A%80%E6%9C%AF%E5%85%A8%E6%99%AF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E6%B8%85%E6%B4%97%E5%8E%BB%E9%87%8D&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E5%90%88%E6%88%90%E6%95%B0%E6%8D%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E8%AE%AD%E7%BB%83/MoE%E6%9E%B6%E6%9E%84&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/SFT&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/RLHF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/DPO&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/temperature&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/top-p&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/KV%20Cache&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E6%8A%95%E6%9C%BA%E8%A7%A3%E7%A0%81&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E9%87%8F%E5%8C%96&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%83%A8%E7%BD%B2/vLLM&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%90%91%E9%87%8F%E5%BA%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%B5%8C%E5%85%A5%E6%A8%A1%E5%9E%8B&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E9%87%8D%E6%8E%92%E5%BA%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%B7%A5%E5%85%B7%E8%B0%83%E7%94%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E4%BB%BB%E5%8A%A1%E8%A7%84%E5%88%92&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%A4%9A%E6%99%BA%E8%83%BD%E4%BD%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/MCP%E5%8D%8F%E8%AE%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/LoRA&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E5%85%A8%E5%8F%82%E6%95%B0%E5%BE%AE%E8%B0%83&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E7%9F%A5%E8%AF%86%E8%92%B8%E9%A6%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/MMLU&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/HumanEval&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/LLM%E8%AF%84%E5%AE%A1&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E8%A7%89%E7%BC%96%E7%A0%81%E5%99%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%AF%AD%E9%9F%B3&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E9%A2%91" width="280" alt="mindmap radial: LLM landscape"></a> |

**`GET /draw`** (no params) or `?tab=pie` — the demo page (11 chart types, all style variants, dual URL forms)
**`GET /draw/archmap?n=...`** (alias `/draw/arch`) — architecture map sub-path, same params as `type=archmap`
**`GET /draw/mindmap?n=...`** — mind map sub-path, same params as `type=mindmap`
**`GET /draw/banner?theme=cli-release-v1&title=<...>&cmd=<...>[&tagline=<...>]`** — themed OG cover (1200×630): paper texture, big title, fake terminal, version ribbon; `&format=png` rasterizes for og:image. [Try it](https://po6.sh/draw/banner?theme=cli-release-v1&title=Release%20v0.10.13&tagline=bug%20fixes%20and%20stability&cmd=x%20upgrade)
**`POST /draw?type=...`** — submit a JSON/CSV body to create a permanent short link
**`GET /draw/c/<hash>`** — short-link render (immutable)

Common parameters:

- `t` style family (per chart type, see below; falls back to default when not built for that type)
- `scheme` `auto` (default, follows system) / `dark` / `light`
- `v` pin a version; `w`/`h` size (200–1600 / 140–1200; qr is 120–1000 / 140–1000)
- `format=png` rasterize instead of SVG (`scale=1–3` pixel ratio; scheme is baked — omitting it means light). Latin text only: the embedded Inter subset has no CJK glyphs
- `num` value labels: `all` / `peak` (highest only) / `none`. Defaults follow the style; applies to pie/bar/hbar/line/area/scatter/combo (radar/gauge/sankey/qr ignore it)
- `subtitle` editorial subtitle (only rendered by area's editorial style `t=opendata`), `source` data-source footnote (area only, any `t`); other types parse but ignore these

## Styles (`?t=`)

Per-type reference: [pie](docs/2-chart-types/01-pie/en.md) · [bar](docs/2-chart-types/02-bar/en.md) · [hbar](docs/2-chart-types/03-hbar/en.md) · [line](docs/2-chart-types/04-line/en.md) · [area](docs/2-chart-types/05-area/en.md) · [radar](docs/2-chart-types/06-radar/en.md) · [gauge](docs/2-chart-types/07-gauge/en.md) · [scatter](docs/2-chart-types/08-scatter/en.md) · [combo](docs/2-chart-types/09-combo/en.md) · [sankey](docs/2-chart-types/10-sankey/en.md) · [qr](docs/2-chart-types/11-qr/en.md) — each page has the parameters, the style families, the pitfalls and its own `faq.yml`.


Per chart type, with automatic light/dark palettes:

| type | available families |
|---|---|
| `pie` | `opendata` (default, all labels outside), `evil` (rounded ring + inner values), `evil-mono` (solid pie + leader lines), `market-mono` (grayscale + ring total), `progress` (dotted progress ring), `revenue` (gradient wedges + dashed inner ring) |
| `bar` | `evil` (default, grouped), `base` (card), `grid` (table bars) |
| `hbar` | `base` (default), `opendata` (supports `ref=`/`reflabel=` reference line), `xcmd` (pixel bars, %), `xcmd-issue` (two-series butterfly), `rank` (two-series solid + hatching) |
| `line` | `shadcn` (default), `evil`, `evil-glow` (glow), `evil-mono`, `opendata` (line-end labels) |
| `area` | `evil` (default, two-series dashed areas), `star` (hand-drawn), `opendata` (dense gradient + editorial title), `pixel`, `polka` |
| `radar` | `base` (default), `evil` (multi-series), `xcmd` |
| `sankey` | `base` (default), `fund`, `pipeline` |
| `gauge` | `base` (default), `gradient`, `reliability` (zoned ring gauge) |
| `scatter` / `combo` / `qr` | `base` (combo also has `evil`) |

## Two ways to pass data

Full catalogue with one row per type: [styles quick reference](docs/3-styles/01-style-families/en.md).


**Flat params** (URL stays readable — recommended):

```
/draw?type=pie&title=Stars by language&unit=stars&labels=TypeScript,Python,Go,Rust&values=4821,2312,980,645
/draw?type=bar&title=Weekly downloads&labels=Mon,Tue&values=1200,1800
```

When labels contain commas, use repeated params: `labels=Q1, 2024&labels=Q2&values=1&values=2`

**Multi-series comparison** (type=bar grouped/stacked, type=line, type=area, ≤6 series):

```
/draw?type=area&labels=Mon,Tue,Wed&series=Desktop:120,180,150&series=Mobile:80,90,85
```

**JSON form** (complex data): `?d=` + URL-encoded JSON:

```json
{"title":"Stars by language","unit":"stars","data":[{"label":"TypeScript","value":4821},{"label":"Python","value":2312}]}
```

Multi-series JSON: `{"labels":["Mon","Tue"],"series":[{"name":"draw","values":[120,180]},{"name":"qc","values":[80,90]}]}`

QR code: `/draw?type=qr&d=https://github.com/tzw&fg=%236366f1`

Gauge: `/draw?type=gauge&title=Build pass rate&value=87&max=100`

Scatter: `/draw?type=scatter&x=10,20,30&y=5,8,7`

Combo: `/draw?type=combo&labels=Mon,Tue&series=dl:120,180&line=growth:5,8` (dual y-axes kick in automatically when bars and lines differ by >5×)

## Short links (data stored in a GitHub repo; content-addressed, never expires)

Per-type JSON schemas: [data formats](docs/4-data-and-api/01-data-formats/en.md).


```
POST /draw?type=pie                body = chart spec JSON
POST /draw?type=bar&t=evil         body = CSV (text/csv, header row)
→ 201 {"hash":"a3f9c2d4e5f60718","url":"https://x-cmd.com/draw/c/a3f9c2d4e5f60718"}

GET /draw/c/<hash>                 → SVG, cached immutable forever
```

- The fingerprint is the first 16 hex chars of SHA-256 over canonicalized data (template+theme+spec, keys recursively sorted); identical data → identical short link (dedup, idempotent). On read the fingerprint is re-verified — tampered archives are rejected
- Multi-series is supported for bar/line/area/radar, plus hbar (only `t=xcmd-issue`/`t=rank`, exactly 2 series); other types reject multi-series bodies with 400. POST is rate-limited to 30/min/IP
- Server-side config: `DATA_REPO` (public repo, `owner/name`, in wrangler.jsonc) and `GITHUB_TOKEN` (secret; fine-grained PAT with **Contents: write** on that repo only — reads go through raw, tokenless). Data files live at `charts/<hash>.json`
- Visibility: the data repo is public and browsable — **do not create short links with sensitive data** (private storage is planned, as a paid feature)
- Compared to quickchart: their short links expire (6 months / days); ours never do

## Version semantics

- No `v`: renders the **latest** version, `Cache-Control: max-age=300` (output changes as the service upgrades)
- `?v=1`: pins a version, `Cache-Control: max-age=86400` (1 day; rendering still evolves with deploys — not frozen forever). `v` accepts 1..current; out of range → 400
- `immutable` is reserved for short links `/c/<hash>` (content-addressed, truly unchanging; `v` is ignored there)

## AI-friendly

Every SVG embeds `<metadata>` (escaped JSON): `{generator, template, version, spec}` — data and params round-trip directly. All text is real `<text>` elements.

## One-shot self-deploy

Deploy your own draw to your Cloudflare account (free tier works; you just need a CF account):

```sh
curl -fsSL https://raw.githubusercontent.com/x-cmd/draw/main/scripts/setup.sh | bash
```

The script: clones the repo → browser login for wrangler → deploys → smoke test → prints your `*.workers.dev` URL. All GET rendering (11 chart types, every style) works out of the box.

- **Short links (POST) are not enabled by default** — calls return a "not configured" message. To enable: create a public data repo → set `DATA_REPO=owner/name` in the local wrangler.jsonc vars → `npx wrangler secret put GITHUB_TOKEN` (fine-grained PAT, Contents: write on that repo only) → redeploy
- Already cloned the repo? Run `npm run setup` inside it (skips the clone)
- Path prefix auto-adapts: both the workers.dev root and a `/draw` sub-route work with zero code changes; or pin it explicitly with the `BASE_PATH` var
- Custom domain: dashboard → Workers → Settings → Domains & Routes, add a route (any path prefix)
- On Windows, run under WSL or Git Bash

## Development

Full deployment guide (Workers, local Node, npm library, short links): [deploy it yourself](docs/5-self-hosting/01-deploy/en.md).


```sh
npm install
npm run dev      # wrangler dev, local server
npm test         # vitest
npm run check    # tsc --noEmit × 3 (worker / node / build)
npm run build    # emit dist/ (npm library + CLI)
npm run deploy   # wrangler deploy
```

## License

Code is [Apache-2.0](LICENSE). Bundled fonts keep their own licenses: Inter (OFL, full text in `src/styles/inter-OFL.txt`) and Handlee (OFL).

## Documentation

Reference pages live in [`docs/`](docs/README.md), grouped the same way this README is: what the endpoint is, then one page per chart type, then styles, data formats and self-hosting. Every page exists in 19 languages and ships its own `faq.yml` with the questions that page raises.

| section | pages |
|---|---|
| 1 · Overview | [What is draw](docs/1-overview/01-what-is-draw/en.md) · [Quick start](docs/1-overview/02-quick-start/en.md) |
| 2 · Chart types | [pie](docs/2-chart-types/01-pie/en.md) · [bar](docs/2-chart-types/02-bar/en.md) · [hbar](docs/2-chart-types/03-hbar/en.md) · [line](docs/2-chart-types/04-line/en.md) · [area](docs/2-chart-types/05-area/en.md) · [radar](docs/2-chart-types/06-radar/en.md) · [gauge](docs/2-chart-types/07-gauge/en.md) · [scatter](docs/2-chart-types/08-scatter/en.md) · [combo](docs/2-chart-types/09-combo/en.md) · [sankey](docs/2-chart-types/10-sankey/en.md) · [qr](docs/2-chart-types/11-qr/en.md) |
| 3 · Styles | [Style families](docs/3-styles/01-style-families/en.md) |
| 4 · Data and API | [Data formats](docs/4-data-and-api/01-data-formats/en.md) |
| 5 · Self-hosting | [Deploy it yourself](docs/5-self-hosting/01-deploy/en.md) |

Start with [quick start](docs/1-overview/02-quick-start/en.md) for a first chart, or the per-type page when you already know which chart you want.
