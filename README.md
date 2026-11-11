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

[![Sankey: PR lifecycle](https://x-cmd.com/draw?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y+&links=feat>merged:38;feat>closed:12;feat>rejected:8;fix>merged:33;fix>closed:6;fix>rejected:2;docs>merged:16;docs>closed:4;chore>merged:5;chore>closed:6;chore>rejected:6;merged>0-1y:52;merged>1-2y:28;merged>2y+:12;closed>0-1y:14;closed>1-2y:9;closed>2y+:5;rejected>0-1y:9;rejected>1-2y:5;rejected>2y+:2&title=Pull%20requests%20lifecycle&unit=prs)](https://x-cmd.com/draw/explore?type=sankey&t=pipeline&labels=feat,fix,docs,chore,merged,closed,rejected,0-1y,1-2y,2y+&links=feat>merged:38;feat>closed:12;feat>rejected:8;fix>merged:33;fix>closed:6;fix>rejected:2;docs>merged:16;docs>closed:4;chore>merged:5;chore>closed:6;chore>rejected:6;merged>0-1y:52;merged>1-2y:28;merged>2y+:12;closed>0-1y:14;closed>1-2y:9;closed>2y+:5;rejected>0-1y:9;rejected>1-2y:5;rejected>2y+:2&title=Pull%20requests%20lifecycle&unit=prs)

### Radar — three-way software comparison (`type=radar&t=evil`, multi-series)

```text
https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison
```

[![Radar: editor comparison](https://x-cmd.com/draw?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison)](https://x-cmd.com/draw/explore?type=radar&t=evil&labels=startup,ecosystem,extensibility,memory,ease&series=vscode:60,95,90,55,80&series=neovim:95,65,85,95,35&series=zed:92,50,55,90,60&title=Editor%20comparison)

### Combo — weekly downloads vs star-growth rate (`type=combo`, dual y-axis)

```text
https://x-cmd.com/draw?type=combo&labels=Mon,Tue,Wed,Thu,Fri,Sat,Sun&series=Downloads:120,180,150,210,240,200,260&line=Star%20growth:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Weekly%20npm%20downloads&unit=dl
```

[![Combo: downloads + star growth](https://x-cmd.com/draw?type=combo&labels=Mon,Tue,Wed,Thu,Fri,Sat,Sun&series=Downloads:120,180,150,210,240,200,260&line=Star%20growth:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Weekly%20npm%20downloads&unit=dl)](https://x-cmd.com/draw/explore?type=combo&labels=Mon,Tue,Wed,Thu,Fri,Sat,Sun&series=Downloads:120,180,150,210,240,200,260&line=Star%20growth:3.1,3.4,3.2,3.8,4.1,3.9,4.5&title=Weekly%20npm%20downloads&unit=dl)

### Archmap — three-tier web app (`/draw/archmap`: grid cells you author, the engine packs & routes)

```text
https://x-cmd.com/draw/archmap?title=Web%20App&n=user;ext;User;;r0c0&n=cdn;cloud;CDN;;r0c1&n=web;fe;Web%20App;SSR;r0c2&n=api;be;API;;r1c1&n=db;db;Postgres;;r2c1&n=redis;db;Redis;;r2c2&e=user;cdn;https&e=cdn;web&e=web;api;json&e=api;db;sql;dash&e=api;redis&b=Data%20Layer;db%20redis
```

[![Archmap: web app three tiers](https://x-cmd.com/draw/archmap?title=Web%20App&n=user;ext;User;;r0c0&n=cdn;cloud;CDN;;r0c1&n=web;fe;Web%20App;SSR;r0c2&n=api;be;API;;r1c1&n=db;db;Postgres;;r2c1&n=redis;db;Redis;;r2c2&e=user;cdn;https&e=cdn;web&e=web;api;json&e=api;db;sql;dash&e=api;redis&b=Data%20Layer;db%20redis)](https://x-cmd.com/draw/explore/archmap?title=Web%20App&n=user;ext;User;;r0c0&n=cdn;cloud;CDN;;r0c1&n=web;fe;Web%20App;SSR;r0c2&n=api;be;API;;r1c1&n=db;db;Postgres;;r2c1&n=redis;db;Redis;;r2c2&e=user;cdn;https&e=cdn;web&e=web;api;json&e=api;db;sql;dash&e=api;redis&b=Data%20Layer;db%20redis)

`n=id;type;label;sublabel;r0c1` — the cell address **is** the layout: rows read as tiers, adjacency is legible straight from the URL. `ext/fe/be/db/cloud/sec/bus/svc` map to semantic colors; `b=` wraps a boundary; `e=` takes `main`/`dash` variants.

### Archmap — RAG pipeline (`t=evil`; spans `w2`, two boundaries, emphasis + dashed edges)

```text
https://x-cmd.com/draw/archmap?title=RAG%20Pipeline&t=evil&n=user;ext;User;Chat%20API;r0c0&n=gw;be;API%20Gateway;rate%20limit;r0c1w2&n=guard;sec;Guardrail;;r1c1&n=llm;be;LLM;embed+rerank;r1c2&n=vec;db;Vector%20Store;;r2c1&n=kb;db;Knowledge%20Base;docs;r2c2&n=obs;cloud;Object%20Storage;;r3c0w2&e=user;gw;question;main&e=gw;guard&e=gw;llm;context&e=guard;llm&e=llm;vec;knn&e=kb;vec;index;dash&e=llm;obs;artifacts&b=Retrieval;vec%20kb&b=Query%20Runtime;gw%20guard%20llm
```

[![Archmap: RAG pipeline](https://x-cmd.com/draw/archmap?title=RAG%20Pipeline&t=evil&n=user;ext;User;Chat%20API;r0c0&n=gw;be;API%20Gateway;rate%20limit;r0c1w2&n=guard;sec;Guardrail;;r1c1&n=llm;be;LLM;embed+rerank;r1c2&n=vec;db;Vector%20Store;;r2c1&n=kb;db;Knowledge%20Base;docs;r2c2&n=obs;cloud;Object%20Storage;;r3c0w2&e=user;gw;question;main&e=gw;guard&e=gw;llm;context&e=guard;llm&e=llm;vec;knn&e=kb;vec;index;dash&e=llm;obs;artifacts&b=Retrieval;vec%20kb&b=Query%20Runtime;gw%20guard%20llm)](https://x-cmd.com/draw/explore/archmap?title=RAG%20Pipeline&t=evil&n=user;ext;User;Chat%20API;r0c0&n=gw;be;API%20Gateway;rate%20limit;r0c1w2&n=guard;sec;Guardrail;;r1c1&n=llm;be;LLM;embed+rerank;r1c2&n=vec;db;Vector%20Store;;r2c1&n=kb;db;Knowledge%20Base;docs;r2c2&n=obs;cloud;Object%20Storage;;r3c0w2&e=user;gw;question;main&e=gw;guard&e=gw;llm;context&e=guard;llm&e=llm;vec;knn&e=kb;vec;index;dash&e=llm;obs;artifacts&b=Retrieval;vec%20kb&b=Query%20Runtime;gw%20guard%20llm)

### Archmap — Codex CLI, inside the agent (`/draw/archmap`; process + OS-sandbox boundaries)

```text
https://x-cmd.com/draw/archmap?title=Codex%20CLI%20architecture&n=user;ext;Developer;terminal;r0c0&n=cli;fe;Codex%20CLI;Rust%20%C2%B7%20TUI;r0c1&n=api;cloud;OpenAI;responses%20API;r0c2&n=cfg;svc;config.toml;profiles%20%C2%B7%20sandbox;r1c0&n=core;be;Agent%20Core;turns%20%C2%B7%20tools;r1c1&n=auth;sec;Auth;ChatGPT%20%C2%B7%20API%20key;r1c2&n=agents;svc;AGENTS.md;repo%20context;r2c0&n=tools;svc;Tools;shell%20%C2%B7%20web;r2c1&n=mcp;bus;MCP;servers;r2c2&n=sandbox;sec;Sandbox;seatbelt%20%C2%B7%20landlock;r3c1&e=user;cli;prompt;main&e=cli;core&e=core;api;model;main&e=api;auth;OAuth;dash&e=cli;cfg;load&e=core;tools;exec&e=tools;sandbox;isolated;dash&e=core;mcp&e=agents;core;context&b=CLI%20process;cli%20cfg%20core%20tools%20agents%20mcp&b=OS%20sandbox;sandbox
```

[![Archmap: Codex CLI architecture](https://x-cmd.com/draw/archmap?title=Codex%20CLI%20architecture&n=user;ext;Developer;terminal;r0c0&n=cli;fe;Codex%20CLI;Rust%20%C2%B7%20TUI;r0c1&n=api;cloud;OpenAI;responses%20API;r0c2&n=cfg;svc;config.toml;profiles%20%C2%B7%20sandbox;r1c0&n=core;be;Agent%20Core;turns%20%C2%B7%20tools;r1c1&n=auth;sec;Auth;ChatGPT%20%C2%B7%20API%20key;r1c2&n=agents;svc;AGENTS.md;repo%20context;r2c0&n=tools;svc;Tools;shell%20%C2%B7%20web;r2c1&n=mcp;bus;MCP;servers;r2c2&n=sandbox;sec;Sandbox;seatbelt%20%C2%B7%20landlock;r3c1&e=user;cli;prompt;main&e=cli;core&e=core;api;model;main&e=api;auth;OAuth;dash&e=cli;cfg;load&e=core;tools;exec&e=tools;sandbox;isolated;dash&e=core;mcp&e=agents;core;context&b=CLI%20process;cli%20cfg%20core%20tools%20agents%20mcp&b=OS%20sandbox;sandbox)](https://x-cmd.com/draw/explore/archmap?title=Codex%20CLI%20architecture&n=user;ext;Developer;terminal;r0c0&n=cli;fe;Codex%20CLI;Rust%20%C2%B7%20TUI;r0c1&n=api;cloud;OpenAI;responses%20API;r0c2&n=cfg;svc;config.toml;profiles%20%C2%B7%20sandbox;r1c0&n=core;be;Agent%20Core;turns%20%C2%B7%20tools;r1c1&n=auth;sec;Auth;ChatGPT%20%C2%B7%20API%20key;r1c2&n=agents;svc;AGENTS.md;repo%20context;r2c0&n=tools;svc;Tools;shell%20%C2%B7%20web;r2c1&n=mcp;bus;MCP;servers;r2c2&n=sandbox;sec;Sandbox;seatbelt%20%C2%B7%20landlock;r3c1&e=user;cli;prompt;main&e=cli;core&e=core;api;model;main&e=api;auth;OAuth;dash&e=cli;cfg;load&e=core;tools;exec&e=tools;sandbox;isolated;dash&e=core;mcp&e=agents;core;context&b=CLI%20process;cli%20cfg%20core%20tools%20agents%20mcp&b=OS%20sandbox;sandbox)

A row per tier: terminal → the CLI process (TUI · config · core · tools · MCP · AGENTS.md inside one boundary) → OpenAI; tool exec drops one row further into the OS sandbox.

### Mindmap — LLM technology landscape, 42 nodes (`/draw/mindmap`: `n=root/branch/leaf` paths)

```text
https://x-cmd.com/draw/mindmap?title=%E5%A4%A7%E6%A8%A1%E5%9E%8B%E6%8A%80%E6%9C%AF%E5%85%A8%E6%99%AF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E6%B8%85%E6%B4%97%E5%8E%BB%E9%87%8D&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E5%90%88%E6%88%90%E6%95%B0%E6%8D%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E8%AE%AD%E7%BB%83/MoE%E6%9E%B6%E6%9E%84&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/SFT&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/RLHF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/DPO&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/temperature&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/top-p&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/KV%20Cache&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E6%8A%95%E6%9C%BA%E8%A7%A3%E7%A0%81&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E9%87%8F%E5%8C%96&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%83%A8%E7%BD%B2/vLLM&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%90%91%E9%87%8F%E5%BA%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%B5%8C%E5%85%A5%E6%A8%A1%E5%9E%8B&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E9%87%8D%E6%8E%92%E5%BA%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%B7%A5%E5%85%B7%E8%B0%83%E7%94%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E4%BB%BB%E5%8A%A1%E8%A7%84%E5%88%92&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%A4%9A%E6%99%BA%E8%83%BD%E4%BD%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/MCP%E5%8D%8F%E8%AE%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/LoRA&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E5%85%A8%E5%8F%82%E6%95%B0%E5%BE%AE%E8%B0%83&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E7%9F%A5%E8%AF%86%E8%92%B8%E9%A6%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/MMLU&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/HumanEval&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/LLM%E8%AF%84%E5%AE%A1&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E8%A7%89%E7%BC%96%E7%A0%81%E5%99%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%AF%AD%E9%9F%B3&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E9%A2%91
```

[![Mindmap: LLM technology landscape](https://x-cmd.com/draw/mindmap?title=%E5%A4%A7%E6%A8%A1%E5%9E%8B%E6%8A%80%E6%9C%AF%E5%85%A8%E6%99%AF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E6%B8%85%E6%B4%97%E5%8E%BB%E9%87%8D&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E5%90%88%E6%88%90%E6%95%B0%E6%8D%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E8%AE%AD%E7%BB%83/MoE%E6%9E%B6%E6%9E%84&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/SFT&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/RLHF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/DPO&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/temperature&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/top-p&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/KV%20Cache&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E6%8A%95%E6%9C%BA%E8%A7%A3%E7%A0%81&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E9%87%8F%E5%8C%96&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%83%A8%E7%BD%B2/vLLM&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%90%91%E9%87%8F%E5%BA%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%B5%8C%E5%85%A5%E6%A8%A1%E5%9E%8B&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E9%87%8D%E6%8E%92%E5%BA%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%B7%A5%E5%85%B7%E8%B0%83%E7%94%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E4%BB%BB%E5%8A%A1%E8%A7%84%E5%88%92&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%A4%9A%E6%99%BA%E8%83%BD%E4%BD%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/MCP%E5%8D%8F%E8%AE%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/LoRA&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E5%85%A8%E5%8F%82%E6%95%B0%E5%BE%AE%E8%B0%83&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E7%9F%A5%E8%AF%86%E8%92%B8%E9%A6%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/MMLU&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/HumanEval&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/LLM%E8%AF%84%E5%AE%A1&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E8%A7%89%E7%BC%96%E7%A0%81%E5%99%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%AF%AD%E9%9F%B3&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E9%A2%91)](https://x-cmd.com/draw/explore/mindmap?title=%E5%A4%A7%E6%A8%A1%E5%9E%8B%E6%8A%80%E6%9C%AF%E5%85%A8%E6%99%AF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E6%B8%85%E6%B4%97%E5%8E%BB%E9%87%8D&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E5%90%88%E6%88%90%E6%95%B0%E6%8D%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E8%AE%AD%E7%BB%83/MoE%E6%9E%B6%E6%9E%84&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/SFT&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/RLHF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/DPO&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/temperature&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/top-p&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/KV%20Cache&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E6%8A%95%E6%9C%BA%E8%A7%A3%E7%A0%81&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E9%87%8F%E5%8C%96&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%83%A8%E7%BD%B2/vLLM&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%90%91%E9%87%8F%E5%BA%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%B5%8C%E5%85%A5%E6%A8%A1%E5%9E%8B&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E9%87%8D%E6%8E%92%E5%BA%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%B7%A5%E5%85%B7%E8%B0%83%E7%94%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E4%BB%BB%E5%8A%A1%E8%A7%84%E5%88%92&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%A4%9A%E6%99%BA%E8%83%BD%E4%BD%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/MCP%E5%8D%8F%E8%AE%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/LoRA&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E5%85%A8%E5%8F%82%E6%95%B0%E5%BE%AE%E8%B0%83&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E7%9F%A5%E8%AF%86%E8%92%B8%E9%A6%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/MMLU&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/HumanEval&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/LLM%E8%AF%84%E5%AE%A1&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E8%A7%89%E7%BC%96%E7%A0%81%E5%99%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%AF%AD%E9%9F%B3&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E9%A2%91)

Every `n=` is one root-to-leaf path — an agent reading the URL rebuilds the whole tree without ever rendering it. CJK and Latin labels mix freely.

### Mindmap — the same 42-node tree, three forms (`style=organic|tree|radial`)

```text
https://x-cmd.com/draw/mindmap?style=radial&title=%E5%A4%A7%E6%A8%A1%E5%9E%8B%E6%8A%80%E6%9C%AF%E5%85%A8%E6%99%AF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E6%B8%85%E6%B4%97%E5%8E%BB%E9%87%8D&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E5%90%88%E6%88%90%E6%95%B0%E6%8D%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E8%AE%AD%E7%BB%83/MoE%E6%9E%B6%E6%9E%84&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/SFT&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/RLHF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/DPO&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/temperature&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/top-p&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/KV%20Cache&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E6%8A%95%E6%9C%BA%E8%A7%A3%E7%A0%81&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E9%87%8F%E5%8C%96&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%83%A8%E7%BD%B2/vLLM&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%90%91%E9%87%8F%E5%BA%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%B5%8C%E5%85%A5%E6%A8%A1%E5%9E%8B&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E9%87%8D%E6%8E%92%E5%BA%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%B7%A5%E5%85%B7%E8%B0%83%E7%94%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E4%BB%BB%E5%8A%A1%E8%A7%84%E5%88%92&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%A4%9A%E6%99%BA%E8%83%BD%E4%BD%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/MCP%E5%8D%8F%E8%AE%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/LoRA&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E5%85%A8%E5%8F%82%E6%95%B0%E5%BE%AE%E8%B0%83&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E7%9F%A5%E8%AF%86%E8%92%B8%E9%A6%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/MMLU&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/HumanEval&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/LLM%E8%AF%84%E5%AE%A1&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E8%A7%89%E7%BC%96%E7%A0%81%E5%99%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%AF%AD%E9%9F%B3&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E9%A2%91
```

[![Mindmap: LLM landscape, radial form](https://x-cmd.com/draw/mindmap?style=radial&title=%E5%A4%A7%E6%A8%A1%E5%9E%8B%E6%8A%80%E6%9C%AF%E5%85%A8%E6%99%AF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E6%B8%85%E6%B4%97%E5%8E%BB%E9%87%8D&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E5%90%88%E6%88%90%E6%95%B0%E6%8D%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E8%AE%AD%E7%BB%83/MoE%E6%9E%B6%E6%9E%84&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/SFT&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/RLHF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/DPO&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/temperature&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/top-p&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/KV%20Cache&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E6%8A%95%E6%9C%BA%E8%A7%A3%E7%A0%81&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E9%87%8F%E5%8C%96&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%83%A8%E7%BD%B2/vLLM&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%90%91%E9%87%8F%E5%BA%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%B5%8C%E5%85%A5%E6%A8%A1%E5%9E%8B&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E9%87%8D%E6%8E%92%E5%BA%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%B7%A5%E5%85%B7%E8%B0%83%E7%94%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E4%BB%BB%E5%8A%A1%E8%A7%84%E5%88%92&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%A4%9A%E6%99%BA%E8%83%BD%E4%BD%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/MCP%E5%8D%8F%E8%AE%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/LoRA&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E5%85%A8%E5%8F%82%E6%95%B0%E5%BE%AE%E8%B0%83&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E7%9F%A5%E8%AF%86%E8%92%B8%E9%A6%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/MMLU&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/HumanEval&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/LLM%E8%AF%84%E5%AE%A1&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E8%A7%89%E7%BC%96%E7%A0%81%E5%99%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%AF%AD%E9%9F%B3&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E9%A2%91)](https://x-cmd.com/draw/explore/mindmap?style=radial&title=%E5%A4%A7%E6%A8%A1%E5%9E%8B%E6%8A%80%E6%9C%AF%E5%85%A8%E6%99%AF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E6%B8%85%E6%B4%97%E5%8E%BB%E9%87%8D&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E5%90%88%E6%88%90%E6%95%B0%E6%8D%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E8%AE%AD%E7%BB%83/MoE%E6%9E%B6%E6%9E%84&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/SFT&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/RLHF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/DPO&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/temperature&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/top-p&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/KV%20Cache&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E6%8A%95%E6%9C%BA%E8%A7%A3%E7%A0%81&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E9%87%8F%E5%8C%96&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%83%A8%E7%BD%B2/vLLM&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%90%91%E9%87%8F%E5%BA%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%B5%8C%E5%85%A5%E6%A8%A1%E5%9E%8B&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E9%87%8D%E6%8E%92%E5%BA%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%B7%A5%E5%85%B7%E8%B0%83%E7%94%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E4%BB%BB%E5%8A%A1%E8%A7%84%E5%88%92&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%A4%9A%E6%99%BA%E8%83%BD%E4%BD%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/MCP%E5%8D%8F%E8%AE%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/LoRA&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E5%85%A8%E5%8F%82%E6%95%B0%E5%BE%AE%E8%B0%83&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E7%9F%A5%E8%AF%86%E8%92%B8%E9%A6%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/MMLU&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/HumanEval&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/LLM%E8%AF%84%E5%AE%A1&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E8%A7%89%E7%BC%96%E7%A0%81%E5%99%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%AF%AD%E9%9F%B3&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E9%A2%91)

Same paths as the tree above — swap `style=`: `organic` (bezier), `tree` (boxes + elbows), `radial` (root-centred fan; leaf slots size themselves to label width). All three sit side by side in the Endpoints table below.

## Inside draw

Three pictures worth having: what the code is, what one request does, and who draws with it.

<!-- BEGIN draw-diagrams -->
<!-- 由 scripts/diagrams.mjs 生成:node scripts/diagrams.mjs(改完用 --check 对一遍) -->

### Inside draw — the code structure

One edge worker, one render core, four directories that matter: `specs/` parses, `styles/` skins, `render/` draws, `store.ts` keeps the short links.

```text
https://x-cmd.com/draw/arch2?n=entry;fe;Worker%20entry;src/index.ts;r0c0&n=node;svc;Node%20server%20%2B%20CLI;src/node/;r0c1&n=handler;be;handler.ts;routing%20%2B%20responses;r1c0&n=demo;fe;demo/;gallery%20%2B%20landing;r1c1&n=specs;be;specs/;parse%20%2B%20validate;r2c0&n=store;db;store.ts;short%20links%20in%20a%20Git%20repo;r2c1&n=render;be;render/;draw%20the%20SVG;r3c0&n=styles;be;styles/;skins%20%2B%20families;r3c1&e=entry;handler&e=node;handler&e=handler;specs&e=handler;store&e=handler;demo&e=handler;render&e=render;styles&b=Edge%20worker;handler%20specs%20store%20render%20styles&title=Inside%20draw
```

![draw 的代码结构](https://x-cmd.com/draw/arch2?n=entry;fe;Worker%20entry;src/index.ts;r0c0&n=node;svc;Node%20server%20%2B%20CLI;src/node/;r0c1&n=handler;be;handler.ts;routing%20%2B%20responses;r1c0&n=demo;fe;demo/;gallery%20%2B%20landing;r1c1&n=specs;be;specs/;parse%20%2B%20validate;r2c0&n=store;db;store.ts;short%20links%20in%20a%20Git%20repo;r2c1&n=render;be;render/;draw%20the%20SVG;r3c0&n=styles;be;styles/;skins%20%2B%20families;r3c1&e=entry;handler&e=node;handler&e=handler;specs&e=handler;store&e=handler;demo&e=handler;render&e=render;styles&b=Edge%20worker;handler%20specs%20store%20render%20styles&title=Inside%20draw)

### One request, step by step

The URL is parsed, a skin is picked, the SVG is drawn, and it comes back with `<metadata>` inside — one path for every chart type.

```text
https://x-cmd.com/draw/seq?n=app;fe;Your%20app;;r0c0&n=worker;be;Worker;;r0c1&n=specs;be;specs/;parse%20%2B%20validate;r0c2&n=render;be;render/;draw%20the%20SVG;r0c3&e=app;worker;GET%20/draw%3Ftype=pie&e=worker;specs;parse%20the%20spec&e=specs;worker;spec;dash&e=worker;render;draw&e=render;worker;SVG;dash&e=worker;app;200%20%2B%20%3Cmetadata%3E;dash&title=One%20request
```

![一次请求的时序](https://x-cmd.com/draw/seq?n=app;fe;Your%20app;;r0c0&n=worker;be;Worker;;r0c1&n=specs;be;specs/;parse%20%2B%20validate;r0c2&n=render;be;render/;draw%20the%20SVG;r0c3&e=app;worker;GET%20/draw%3Ftype=pie&e=worker;specs;parse%20the%20spec&e=specs;worker;spec;dash&e=worker;render;draw&e=render;worker;SVG;dash&e=worker;app;200%20%2B%20%3Cmetadata%3E;dash&title=One%20request)

### What draw is for

Four kinds of callers: your code, an AI agent, your README, and whoever runs their own copy.

```text
https://x-cmd.com/draw/uc?n=caller;actor;Your%20app%20or%20CI&n=agent;actor;AI%20agent&n=writer;actor;README%20or%20docs&n=ops;actor;Self-host%20operator&n=uc1;uc;Render%20a%20chart;GET%20/draw%3Ftype=...&n=uc2;uc;Store%20a%20short%20link;POST%20/draw&n=uc3;uc;Embed%20the%20SVG;markdown%20%2B%20img&n=uc4;uc;Run%20it%20yourself;npm%20%2B%20wrangler&e=caller;uc1&e=caller;uc2&e=agent;uc1&e=writer;uc3&e=ops;uc4&b=draw;uc1%20uc2%20uc3%20uc4&title=What%20draw%20is%20for
```

![draw 的用户用例](https://x-cmd.com/draw/uc?n=caller;actor;Your%20app%20or%20CI&n=agent;actor;AI%20agent&n=writer;actor;README%20or%20docs&n=ops;actor;Self-host%20operator&n=uc1;uc;Render%20a%20chart;GET%20/draw%3Ftype=...&n=uc2;uc;Store%20a%20short%20link;POST%20/draw&n=uc3;uc;Embed%20the%20SVG;markdown%20%2B%20img&n=uc4;uc;Run%20it%20yourself;npm%20%2B%20wrangler&e=caller;uc1&e=caller;uc2&e=agent;uc1&e=writer;uc3&e=ops;uc4&b=draw;uc1%20uc2%20uc3%20uc4&title=What%20draw%20is%20for)
<!-- END draw-diagrams -->
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

**`GET /draw?type=<pie|bar|hbar|line|area|radar|gauge|scatter|combo|sankey|qr|quadrant|compass|butterfly|archmap|mindmap>`** — render a chart

| type | chart | example |
|---|---|---|
| `pie` | donut; `donut=0` for a solid pie<br><br>**<u>≤100 categories (>9 auto-merge into Other)</u>** | [![pie example](https://x-cmd.com/draw?type=pie&t=market-mono&title=Languages&unit=%25&labels=TypeScript,Shell,JavaScript,Rust,Other&values=68,14,9,6,3&w=360)](https://x-cmd.com/draw/explore?type=pie&t=market-mono&title=Languages&unit=%25&labels=TypeScript,Shell,JavaScript,Rust,Other&values=68,14,9,6,3) |
| `bar` | grouped columns; multi-series with `stack=1` for stacked<br><br>**<u>≤30 groups</u>** | [![bar example](https://x-cmd.com/draw?type=bar&labels=Mon,Tue,Wed&series=dev:12,18,9&series=ci:8,11,6&w=360)](https://x-cmd.com/draw/explore?type=bar&labels=Mon,Tue,Wed&series=dev:12,18,9&series=ci:8,11,6) |
| `hbar` | horizontal bars (rankings; labels left, values right)<br><br>**<u>≤30 bars, single series (some styles take two)</u>** | [![hbar butterfly example](https://x-cmd.com/draw?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=open:12,8,15,4,9&series=closed:38,52,20,11,26&title=Issues%20by%20area&w=360)](https://x-cmd.com/draw/explore?type=hbar&t=xcmd-issue&labels=cli,core,docs,ci,ui&series=open:12,8,15,4,9&series=closed:38,52,20,11,26&title=Issues%20by%20area) [![hbar throughput example](https://x-cmd.com/draw?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs&w=360)](https://x-cmd.com/draw/explore?type=hbar&labels=deno,node,bun&values=7238,6553,4972&title=Runtime%20throughput&unit=ops%2Fs) |
| `line` | smooth line + gradient area / multi-line<br><br>**<u>≤60 points</u>** | [![line example](https://x-cmd.com/draw?type=line&labels=Jan,Feb,Mar,Apr,May,Jun&values=12,19,15,25,22,30&title=Stars&w=360)](https://x-cmd.com/draw/explore?type=line&labels=Jan,Feb,Mar,Apr,May,Jun&values=12,19,15,25,22,30&title=Stars) |
| `area` | area / multi-series area (gradient fill)<br><br>**<u>≤60 points</u>** | [![area example](https://x-cmd.com/draw?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=Downloads&w=360)](https://x-cmd.com/draw/explore?type=area&labels=Q1,Q2,Q3,Q4&values=8,14,23,37&title=Downloads) |
| `radar` | radar chart<br><br>**<u>3–12 axes</u>** | [![radar example](https://x-cmd.com/draw?type=radar&t=evil&labels=perf,docs,tests,dx&series=v1:7,5,8,6&series=v2:8,8,9,8&w=360)](https://x-cmd.com/draw/explore?type=radar&t=evil&labels=perf,docs,tests,dx&series=v1:7,5,8,6&series=v2:8,8,9,8) |
| `gauge` | gauge (240° arc + center value)<br><br>**<u>`value`+`max` (default 100), value ≤ max; multi-ring ≤8</u>** | [![gauge example](https://x-cmd.com/draw?type=gauge&title=CI%20pass%20rate&value=87&max=100&w=360)](https://x-cmd.com/draw/explore?type=gauge&title=CI%20pass%20rate&value=87&max=100) |
| `scatter` | scatter (two numeric axes, negatives supported; no value labels by default)<br><br>**<u>`x=&y=`, ≤200 points</u>** | [![scatter example](https://x-cmd.com/draw?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latency&w=360)](https://x-cmd.com/draw/explore?type=scatter&x=1,2,3,4,5&y=4,5,3,6,5&title=Latency) |
| `combo` | bars (`series=`) + line (`line=`) in one chart; `stack=1` to stack the bars<br><br>**<u>≤30 groups, ≤6 series total</u>** | [![combo example](https://x-cmd.com/draw?type=combo&labels=Mon,Tue,Wed,Thu,Fri&series=dl:120,180,150,210,240&line=growth:3.1,3.4,3.2,3.8,4.1&title=Downloads&w=360)](https://x-cmd.com/draw/explore?type=combo&labels=Mon,Tue,Wed,Thu,Fri&series=dl:120,180,150,210,240&line=growth:3.1,3.4,3.2,3.8,4.1&title=Downloads) |
| `sankey` | flow diagram with weighted bands<br><br>**<u>`labels=`+`links=A>B:30`, ≤24 nodes/60 links</u>** | [![sankey example](https://x-cmd.com/draw?type=sankey&labels=Visitors,Stars,Forks,PRs,Merged&links=Visitors>Stars:84;Stars>Forks:17;Forks>PRs:9;PRs>Merged:7&title=Contributor%20funnel&w=360)](https://x-cmd.com/draw/explore?type=sankey&labels=Visitors,Stars,Forks,PRs,Merged&links=Visitors>Stars:84;Stars>Forks:17;Forks>PRs:9;PRs>Merged:7&title=Contributor%20funnel) |
| `qr` | QR code<br><br>**<u>`d`=text (≤1000 chars), `fg`/`bg` colors, `title`/`unit` captions</u>** | [![qr example](https://x-cmd.com/draw?type=qr&d=https://github.com/x-cmd/draw&title=scan%20me&w=360)](https://x-cmd.com/draw/explore?type=qr&d=https://github.com/x-cmd/draw&title=scan%20me) |
| `quadrant` | 2×2 decision matrix: the BCG growth-share and Eisenhower urgent-important frames, or a two-axis cross for ranking items<br><br>**<u>`quadrants=` four cell names (top-left, top-right, bottom-left, bottom-right), `quaddescs=` four notes (`;`-separated), `frame=box|cross`, `items=name@x,y` points (0..1)</u>** | [![quadrant example](https://x-cmd.com/draw?type=quadrant&title=BCG+%E5%A2%9E%E9%95%BF-%E4%BB%BD%E9%A2%9D%E7%9F%A9%E9%98%B5&quadrants=%E9%97%AE%E9%A2%98%E4%B8%9A%E5%8A%A1%2C%E6%98%8E%E6%98%9F%E4%B8%9A%E5%8A%A1%2C%E7%98%A6%E7%8B%97%E4%B8%9A%E5%8A%A1%2C%E7%8E%B0%E9%87%91%E7%89%9B&quaddescs=%E9%AB%98%E5%A2%9E%E9%95%BF+%C2%B7+%E4%BD%8E%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E8%A6%81%E4%B9%88%E6%8A%95%E9%92%B1%E7%BF%BB%E7%9B%98%2C%E8%A6%81%E4%B9%88%E5%8F%8A%E6%97%B6%E6%AD%A2%E6%8D%9F%3B%E9%AB%98%E5%A2%9E%E9%95%BF+%C2%B7+%E9%AB%98%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E5%8A%A0%E6%8A%95%E8%B5%84%E6%BA%90%E5%AE%88%E4%BD%8F%E4%BB%BD%E9%A2%9D%3B%E4%BD%8E%E5%A2%9E%E9%95%BF+%C2%B7+%E4%BD%8E%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E6%94%B6%E7%BC%A9%E6%88%96%E5%89%A5%E7%A6%BB%2C%E5%88%AB%E5%86%8D%E6%8A%95%E9%92%B1%3B%E4%BD%8E%E5%A2%9E%E9%95%BF+%C2%B7+%E9%AB%98%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E6%94%B6%E5%89%B2%E7%8E%B0%E9%87%91%2C%E5%8F%8D%E5%93%BA%E4%B8%BB%E4%B8%9A&xlabel=%E7%9B%B8%E5%AF%B9%E5%B8%82%E5%9C%BA%E4%BB%BD%E9%A2%9D&ylabel=%E5%B8%82%E5%9C%BA%E5%A2%9E%E9%95%BF%E7%8E%87&xlow=%E4%BD%8E&xhigh=%E9%AB%98&ylow=%E4%BD%8E&yhigh=%E9%AB%98)](https://x-cmd.com/draw/explore?type=quadrant&title=BCG+%E5%A2%9E%E9%95%BF-%E4%BB%BD%E9%A2%9D%E7%9F%A9%E9%98%B5&quadrants=%E9%97%AE%E9%A2%98%E4%B8%9A%E5%8A%A1%2C%E6%98%8E%E6%98%9F%E4%B8%9A%E5%8A%A1%2C%E7%98%A6%E7%8B%97%E4%B8%9A%E5%8A%A1%2C%E7%8E%B0%E9%87%91%E7%89%9B&quaddescs=%E9%AB%98%E5%A2%9E%E9%95%BF+%C2%B7+%E4%BD%8E%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E8%A6%81%E4%B9%88%E6%8A%95%E9%92%B1%E7%BF%BB%E7%9B%98%2C%E8%A6%81%E4%B9%88%E5%8F%8A%E6%97%B6%E6%AD%A2%E6%8D%9F%3B%E9%AB%98%E5%A2%9E%E9%95%BF+%C2%B7+%E9%AB%98%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E5%8A%A0%E6%8A%95%E8%B5%84%E6%BA%90%E5%AE%88%E4%BD%8F%E4%BB%BD%E9%A2%9D%3B%E4%BD%8E%E5%A2%9E%E9%95%BF+%C2%B7+%E4%BD%8E%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E6%94%B6%E7%BC%A9%E6%88%96%E5%89%A5%E7%A6%BB%2C%E5%88%AB%E5%86%8D%E6%8A%95%E9%92%B1%3B%E4%BD%8E%E5%A2%9E%E9%95%BF+%C2%B7+%E9%AB%98%E4%BB%BD%E9%A2%9D+%E2%80%94%E2%80%94+%E6%94%B6%E5%89%B2%E7%8E%B0%E9%87%91%2C%E5%8F%8D%E5%93%BA%E4%B8%BB%E4%B8%9A&xlabel=%E7%9B%B8%E5%AF%B9%E5%B8%82%E5%9C%BA%E4%BB%BD%E9%A2%9D&ylabel=%E5%B8%82%E5%9C%BA%E5%A2%9E%E9%95%BF%E7%8E%87&xlow=%E4%BD%8E&xhigh=%E9%AB%98&ylow=%E4%BD%8E&yhigh=%E9%AB%98) |
| `compass` | four-arrow compass: a centre with one labelled arrow per direction — the four options of a business unit<br><br>**<u>`up=`/`right=`/`down=`/`left=` (`label` or `label:note`), `center=`</u>** | [![compass example](https://x-cmd.com/draw?type=compass&title=%E4%B8%9A%E5%8A%A1%E5%8D%95%E5%85%83%E7%9A%84%E5%9B%9B%E4%B8%AA%E9%80%89%E9%A1%B9&center=%E6%A0%B8%E5%BF%83%E4%B8%9A%E5%8A%A1&up=%E5%8A%A0%E5%A4%A7%E6%8A%95%E5%85%A5%3A%E6%8A%A2%E4%BB%BD%E9%A2%9D&right=%E7%BB%B4%E6%8C%81%E7%8E%B0%E7%8A%B6%3A%E5%AE%88%E7%8E%B0%E9%87%91%E6%B5%81&down=%E6%94%B6%E7%BC%A9%E8%A7%84%E6%A8%A1%3A%E9%99%8D%E6%88%90%E6%9C%AC&left=%E9%80%80%E5%87%BA%E5%B8%82%E5%9C%BA%3A%E8%85%BE%E8%B5%84%E6%BA%90)](https://x-cmd.com/draw/explore?type=compass&title=%E4%B8%9A%E5%8A%A1%E5%8D%95%E5%85%83%E7%9A%84%E5%9B%9B%E4%B8%AA%E9%80%89%E9%A1%B9&center=%E6%A0%B8%E5%BF%83%E4%B8%9A%E5%8A%A1&up=%E5%8A%A0%E5%A4%A7%E6%8A%95%E5%85%A5%3A%E6%8A%A2%E4%BB%BD%E9%A2%9D&right=%E7%BB%B4%E6%8C%81%E7%8E%B0%E7%8A%B6%3A%E5%AE%88%E7%8E%B0%E9%87%91%E6%B5%81&down=%E6%94%B6%E7%BC%A9%E8%A7%84%E6%A8%A1%3A%E9%99%8D%E6%88%90%E6%9C%AC&left=%E9%80%80%E5%87%BA%E5%B8%82%E5%9C%BA%3A%E8%85%BE%E8%B5%84%E6%BA%90) |
| `butterfly` | butterfly chart: two bar series mirrored around a shared centre axis — each side can stack segments, and either side can carry a line on its own scale (`dir=tb` stands the chart up)<br><br>**<u>`labels=` the categories, `left=`/`right=` each side (`Name:v,v,v`, `name:v,v;name:v,v` to stack), `line=`+`lineside=` a line on one side, `dir=lr|tb`</u>** | [![butterfly example](https://x-cmd.com/draw?type=butterfly&title=Issues%20opened%20vs%20closed&labels=0-30d,30-60d,60-90d,90-180d,180-360d,360-720d&left=Opened:7,8,2,7,6,7&right=Closed:5,6,2,7,5,6&w=560&h=320)](https://x-cmd.com/draw/explore?type=butterfly&title=Issues%20opened%20vs%20closed&labels=0-30d,30-60d,60-90d,90-180d,180-360d,360-720d&left=Opened:7,8,2,7,6,7&right=Closed:5,6,2,7,5,6) |
| `calendar` | calendar: month / week / year / two-month / three-month views, plus a course timetable and a schedule board — the content (events, holidays, notes) is in the URL<br><br>**<u>`ev=` per event, `day=` per holiday or make-up workday, `note=` per note</u>** | [![calendar example](https://x-cmd.com/draw?type=calendar&layout=month&start=2026-11-01&w=360)](https://x-cmd.com/draw/explore?type=calendar&layout=month&start=2026-11-01) |
| `archmap` | architecture map: you author grid cells (`r0c1`, `w`/`h` spans ≤3, pixel escape `p40,80`), the engine auto-sizes tracks and routes orthogonal edges<br><br>**<u>`n=id;type;label[;sub][;pos]` (types `ext/fe/be/db/cloud/sec/bus/svc`), `e=from;to[;label[;main\|dash]]`, `b=label;ids`; ≤500 nodes</u>** | <a href="https://x-cmd.com/draw/explore/archmap?title=Web%20App&n=user;ext;User;;r0c0&n=cdn;cloud;CDN;;r0c1&n=web;fe;Web%20App;SSR;r0c2&n=api;be;API;;r1c1&n=db;db;Postgres;;r2c1&n=redis;db;Redis;;r2c2&e=user;cdn;https&e=cdn;web&e=web;api;json&e=api;db;sql;dash&e=api;redis&b=Data%20Layer;db%20redis"><img src="https://x-cmd.com/draw/archmap?title=Web%20App&n=user;ext;User;;r0c0&n=cdn;cloud;CDN;;r0c1&n=web;fe;Web%20App;SSR;r0c2&n=api;be;API;;r1c1&n=db;db;Postgres;;r2c1&n=redis;db;Redis;;r2c2&e=user;cdn;https&e=cdn;web&e=web;api;json&e=api;db;sql;dash&e=api;redis&b=Data%20Layer;db%20redis" width="300" alt="archmap: web app"></a> <a href="https://x-cmd.com/draw/explore/archmap?title=Codex%20CLI%20architecture&n=user;ext;Developer;terminal;r0c0&n=cli;fe;Codex%20CLI;Rust%20%C2%B7%20TUI;r0c1&n=api;cloud;OpenAI;responses%20API;r0c2&n=cfg;svc;config.toml;profiles%20%C2%B7%20sandbox;r1c0&n=core;be;Agent%20Core;turns%20%C2%B7%20tools;r1c1&n=auth;sec;Auth;ChatGPT%20%C2%B7%20API%20key;r1c2&n=agents;svc;AGENTS.md;repo%20context;r2c0&n=tools;svc;Tools;shell%20%C2%B7%20web;r2c1&n=mcp;bus;MCP;servers;r2c2&n=sandbox;sec;Sandbox;seatbelt%20%C2%B7%20landlock;r3c1&e=user;cli;prompt;main&e=cli;core&e=core;api;model;main&e=api;auth;OAuth;dash&e=cli;cfg;load&e=core;tools;exec&e=tools;sandbox;isolated;dash&e=core;mcp&e=agents;core;context&b=CLI%20process;cli%20cfg%20core%20tools%20agents%20mcp&b=OS%20sandbox;sandbox"><img src="https://x-cmd.com/draw/archmap?title=Codex%20CLI%20architecture&n=user;ext;Developer;terminal;r0c0&n=cli;fe;Codex%20CLI;Rust%20%C2%B7%20TUI;r0c1&n=api;cloud;OpenAI;responses%20API;r0c2&n=cfg;svc;config.toml;profiles%20%C2%B7%20sandbox;r1c0&n=core;be;Agent%20Core;turns%20%C2%B7%20tools;r1c1&n=auth;sec;Auth;ChatGPT%20%C2%B7%20API%20key;r1c2&n=agents;svc;AGENTS.md;repo%20context;r2c0&n=tools;svc;Tools;shell%20%C2%B7%20web;r2c1&n=mcp;bus;MCP;servers;r2c2&n=sandbox;sec;Sandbox;seatbelt%20%C2%B7%20landlock;r3c1&e=user;cli;prompt;main&e=cli;core&e=core;api;model;main&e=api;auth;OAuth;dash&e=cli;cfg;load&e=core;tools;exec&e=tools;sandbox;isolated;dash&e=core;mcp&e=agents;core;context&b=CLI%20process;cli%20cfg%20core%20tools%20agents%20mcp&b=OS%20sandbox;sandbox" width="300" alt="archmap: codex cli"></a> |
| `mindmap` | mind map: repeated `n=root/branch/leaf` paths, shared prefixes merge, engine lays out the tree<br><br>**<u>`style=organic\|tree\|radial`; ≤500 nodes, ≤8 levels</u>** | <a href="https://x-cmd.com/draw/explore/mindmap?title=%E5%A4%A7%E6%A8%A1%E5%9E%8B%E6%8A%80%E6%9C%AF%E5%85%A8%E6%99%AF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E6%B8%85%E6%B4%97%E5%8E%BB%E9%87%8D&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E5%90%88%E6%88%90%E6%95%B0%E6%8D%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E8%AE%AD%E7%BB%83/MoE%E6%9E%B6%E6%9E%84&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/SFT&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/RLHF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/DPO&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/temperature&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/top-p&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/KV%20Cache&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E6%8A%95%E6%9C%BA%E8%A7%A3%E7%A0%81&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E9%87%8F%E5%8C%96&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%83%A8%E7%BD%B2/vLLM&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%90%91%E9%87%8F%E5%BA%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%B5%8C%E5%85%A5%E6%A8%A1%E5%9E%8B&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E9%87%8D%E6%8E%92%E5%BA%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%B7%A5%E5%85%B7%E8%B0%83%E7%94%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E4%BB%BB%E5%8A%A1%E8%A7%84%E5%88%92&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%A4%9A%E6%99%BA%E8%83%BD%E4%BD%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/MCP%E5%8D%8F%E8%AE%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/LoRA&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E5%85%A8%E5%8F%82%E6%95%B0%E5%BE%AE%E8%B0%83&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E7%9F%A5%E8%AF%86%E8%92%B8%E9%A6%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/MMLU&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/HumanEval&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/LLM%E8%AF%84%E5%AE%A1&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E8%A7%89%E7%BC%96%E7%A0%81%E5%99%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%AF%AD%E9%9F%B3&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E9%A2%91"><img src="https://x-cmd.com/draw/mindmap?title=%E5%A4%A7%E6%A8%A1%E5%9E%8B%E6%8A%80%E6%9C%AF%E5%85%A8%E6%99%AF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E6%B8%85%E6%B4%97%E5%8E%BB%E9%87%8D&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E5%90%88%E6%88%90%E6%95%B0%E6%8D%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E8%AE%AD%E7%BB%83/MoE%E6%9E%B6%E6%9E%84&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/SFT&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/RLHF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/DPO&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/temperature&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/top-p&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/KV%20Cache&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E6%8A%95%E6%9C%BA%E8%A7%A3%E7%A0%81&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E9%87%8F%E5%8C%96&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%83%A8%E7%BD%B2/vLLM&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%90%91%E9%87%8F%E5%BA%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%B5%8C%E5%85%A5%E6%A8%A1%E5%9E%8B&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E9%87%8D%E6%8E%92%E5%BA%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%B7%A5%E5%85%B7%E8%B0%83%E7%94%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E4%BB%BB%E5%8A%A1%E8%A7%84%E5%88%92&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%A4%9A%E6%99%BA%E8%83%BD%E4%BD%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/MCP%E5%8D%8F%E8%AE%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/LoRA&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E5%85%A8%E5%8F%82%E6%95%B0%E5%BE%AE%E8%B0%83&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E7%9F%A5%E8%AF%86%E8%92%B8%E9%A6%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/MMLU&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/HumanEval&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/LLM%E8%AF%84%E5%AE%A1&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E8%A7%89%E7%BC%96%E7%A0%81%E5%99%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%AF%AD%E9%9F%B3&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E9%A2%91" width="230" alt="mindmap organic: LLM landscape"></a> <a href="https://x-cmd.com/draw/explore/mindmap?style=tree&title=%E5%A4%A7%E6%A8%A1%E5%9E%8B%E6%8A%80%E6%9C%AF%E5%85%A8%E6%99%AF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E6%B8%85%E6%B4%97%E5%8E%BB%E9%87%8D&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E5%90%88%E6%88%90%E6%95%B0%E6%8D%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E8%AE%AD%E7%BB%83/MoE%E6%9E%B6%E6%9E%84&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/SFT&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/RLHF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/DPO&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/temperature&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/top-p&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/KV%20Cache&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E6%8A%95%E6%9C%BA%E8%A7%A3%E7%A0%81&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E9%87%8F%E5%8C%96&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%83%A8%E7%BD%B2/vLLM&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%90%91%E9%87%8F%E5%BA%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%B5%8C%E5%85%A5%E6%A8%A1%E5%9E%8B&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E9%87%8D%E6%8E%92%E5%BA%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%B7%A5%E5%85%B7%E8%B0%83%E7%94%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E4%BB%BB%E5%8A%A1%E8%A7%84%E5%88%92&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%A4%9A%E6%99%BA%E8%83%BD%E4%BD%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/MCP%E5%8D%8F%E8%AE%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/LoRA&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E5%85%A8%E5%8F%82%E6%95%B0%E5%BE%AE%E8%B0%83&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E7%9F%A5%E8%AF%86%E8%92%B8%E9%A6%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/MMLU&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/HumanEval&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/LLM%E8%AF%84%E5%AE%A1&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E8%A7%89%E7%BC%96%E7%A0%81%E5%99%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%AF%AD%E9%9F%B3&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E9%A2%91"><img src="https://x-cmd.com/draw/mindmap?style=tree&title=%E5%A4%A7%E6%A8%A1%E5%9E%8B%E6%8A%80%E6%9C%AF%E5%85%A8%E6%99%AF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E6%B8%85%E6%B4%97%E5%8E%BB%E9%87%8D&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E5%90%88%E6%88%90%E6%95%B0%E6%8D%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E8%AE%AD%E7%BB%83/MoE%E6%9E%B6%E6%9E%84&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/SFT&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/RLHF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/DPO&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/temperature&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/top-p&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/KV%20Cache&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E6%8A%95%E6%9C%BA%E8%A7%A3%E7%A0%81&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E9%87%8F%E5%8C%96&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%83%A8%E7%BD%B2/vLLM&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%90%91%E9%87%8F%E5%BA%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%B5%8C%E5%85%A5%E6%A8%A1%E5%9E%8B&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E9%87%8D%E6%8E%92%E5%BA%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%B7%A5%E5%85%B7%E8%B0%83%E7%94%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E4%BB%BB%E5%8A%A1%E8%A7%84%E5%88%92&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%A4%9A%E6%99%BA%E8%83%BD%E4%BD%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/MCP%E5%8D%8F%E8%AE%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/LoRA&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E5%85%A8%E5%8F%82%E6%95%B0%E5%BE%AE%E8%B0%83&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E7%9F%A5%E8%AF%86%E8%92%B8%E9%A6%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/MMLU&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/HumanEval&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/LLM%E8%AF%84%E5%AE%A1&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E8%A7%89%E7%BC%96%E7%A0%81%E5%99%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%AF%AD%E9%9F%B3&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E9%A2%91" width="280" alt="mindmap tree: LLM landscape"></a> <a href="https://x-cmd.com/draw/explore/mindmap?style=radial&title=%E5%A4%A7%E6%A8%A1%E5%9E%8B%E6%8A%80%E6%9C%AF%E5%85%A8%E6%99%AF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E6%B8%85%E6%B4%97%E5%8E%BB%E9%87%8D&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E5%90%88%E6%88%90%E6%95%B0%E6%8D%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E8%AE%AD%E7%BB%83/MoE%E6%9E%B6%E6%9E%84&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/SFT&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/RLHF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/DPO&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/temperature&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/top-p&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/KV%20Cache&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E6%8A%95%E6%9C%BA%E8%A7%A3%E7%A0%81&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E9%87%8F%E5%8C%96&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%83%A8%E7%BD%B2/vLLM&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%90%91%E9%87%8F%E5%BA%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%B5%8C%E5%85%A5%E6%A8%A1%E5%9E%8B&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E9%87%8D%E6%8E%92%E5%BA%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%B7%A5%E5%85%B7%E8%B0%83%E7%94%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E4%BB%BB%E5%8A%A1%E8%A7%84%E5%88%92&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%A4%9A%E6%99%BA%E8%83%BD%E4%BD%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/MCP%E5%8D%8F%E8%AE%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/LoRA&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E5%85%A8%E5%8F%82%E6%95%B0%E5%BE%AE%E8%B0%83&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E7%9F%A5%E8%AF%86%E8%92%B8%E9%A6%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/MMLU&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/HumanEval&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/LLM%E8%AF%84%E5%AE%A1&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E8%A7%89%E7%BC%96%E7%A0%81%E5%99%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%AF%AD%E9%9F%B3&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E9%A2%91"><img src="https://x-cmd.com/draw/mindmap?style=radial&title=%E5%A4%A7%E6%A8%A1%E5%9E%8B%E6%8A%80%E6%9C%AF%E5%85%A8%E6%99%AF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E6%B8%85%E6%B4%97%E5%8E%BB%E9%87%8D&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E6%95%B0%E6%8D%AE/%E5%90%88%E6%88%90%E6%95%B0%E6%8D%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E9%A2%84%E8%AE%AD%E7%BB%83/%E8%AE%AD%E7%BB%83/MoE%E6%9E%B6%E6%9E%84&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/SFT&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/RLHF&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%AF%B9%E9%BD%90/DPO&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/temperature&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%87%87%E6%A0%B7/top-p&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/KV%20Cache&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E6%8A%95%E6%9C%BA%E8%A7%A3%E7%A0%81&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E5%8A%A0%E9%80%9F/%E9%87%8F%E5%8C%96&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E6%8E%A8%E7%90%86/%E9%83%A8%E7%BD%B2/vLLM&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%90%91%E9%87%8F%E5%BA%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E5%B5%8C%E5%85%A5%E6%A8%A1%E5%9E%8B&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/RAG/%E9%87%8D%E6%8E%92%E5%BA%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%B7%A5%E5%85%B7%E8%B0%83%E7%94%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E4%BB%BB%E5%8A%A1%E8%A7%84%E5%88%92&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/%E5%A4%9A%E6%99%BA%E8%83%BD%E4%BD%93&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/Agent/MCP%E5%8D%8F%E8%AE%AE&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/LoRA&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E5%85%A8%E5%8F%82%E6%95%B0%E5%BE%AE%E8%B0%83&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%BE%AE%E8%B0%83/%E7%9F%A5%E8%AF%86%E8%92%B8%E9%A6%8F&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/MMLU&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/HumanEval&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E8%AF%84%E6%B5%8B/LLM%E8%AF%84%E5%AE%A1&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E8%A7%89%E7%BC%96%E7%A0%81%E5%99%A8&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%AF%AD%E9%9F%B3&n=%E5%A4%A7%E6%A8%A1%E5%9E%8B/%E5%A4%9A%E6%A8%A1%E6%80%81/%E8%A7%86%E9%A2%91" width="280" alt="mindmap radial: LLM landscape"></a> |

**`GET /draw`** (no params) or `?tab=pie` — the demo page (13 chart types, all style variants, dual URL forms)
**`GET /draw/archmap?n=...`** (alias `/draw/arch`) — architecture map sub-path, same params as `type=archmap`
**`GET /draw/mindmap?n=...`** — mind map sub-path, same params as `type=mindmap`
**`GET /draw/x-cmd/release-banner?title=<slogan|slogan2>&version=<x.y.z>&cmd=<cmd>[&paper=<yellow|orange|pink|purple|green|cyan|blue|gray|apple>]`** — x-cmd release OG cover (1200×630): paper wash + grain, Inter-Bold slogan, `X-CMD - vX.Y.Z` tag bottom-left, bare terminal with `❯` prompt; `paper=apple` for Apple-white. `&format=png` rasterizes for og:image. [Try it](https://po6.sh/draw/x-cmd/release-banner?title=Validate%20files%7Cagainst%20JSON%20Schema&version=0.10.13&cmd=x%20ajv)
**`GET/POST /draw/x-cmd/onepage?d=<markdown>`** — mobile long-image one-pager (#28): markdown (+yfm `title/subtitle/tagline/website/contact/qr`) in, a 1800px-wide strip that grows as tall as the content (white editorial style, Chinese-ordinal section heads, inline bold, full-width dark footer with contact + QR card). POST the body for long docs. `&format=png` rasterizes for phone sharing (very tall CJK strips may exceed free-tier CPU — SVG always works).
**`POST /draw?type=...`** — submit a JSON/CSV body to create a permanent short link
**`GET /draw/c/<hash>`** — short-link render (immutable)

**Diagram paths** — every diagram kind reads the **same three parameters**, so you only learn the grammar once:

```text
n=id;type;label[;sub][;pos]     node   (id;type;label[;sub][;grid cell or pixels])
e=from;to[;label][;variant]      edge   (variant: main | dash)
b=label;id id …                  group  (a boundary or a swim lane)
```

| path | kind | node types |
|---|---|---|
| `/draw/arch2` | architecture — coloured boxes, type badges, legend | `fe` `be` `db` `cloud` `sec` `bus` `svc` `ext` |
| `/draw/archmap` | architecture — the plain version | same |
| `/draw/seq` | sequence — participants, messages, lanes | same |
| `/draw/uc` | use case — actors, use cases, system box | `actor` `uc` |
| `/draw/dataflow` | data flow — processes, stores, sources, sinks | `process` `store` `source` `sink` |
| `/draw/lifecycle` | lifecycle — states, decisions, terminal | `state` `decision` `terminal` |
| `/draw/erd` | ERD — tables and views, fields in the box | `table` `view` |
| `/draw/class` | class — classes, interfaces, enums | `class` `iface` `enum` |

```text
https://x-cmd.com/draw/arch2?n=web;fe;Web app;your browser;r0c0&n=api;be;API;Cloudflare Worker;r0c1&e=web;api;GET /draw?type=pie
```

Full manual — positions, multi-line text, encoding rules, per-kind table: [Diagram URLs](docs/1-overview/06-diagram-urls/en.md).

Common parameters:

- `t` style family (per chart type, see below; falls back to default when not built for that type)
- `scheme` `auto` (default, follows system) / `dark` / `light`
- `v` pin a version; `w`/`h` size (200–1600 / 140–1200; qr is 120–1000 / 140–1000)
- `format=png` rasterize instead of SVG (`scale=1–3` pixel ratio; scheme is baked — omitting it means light). CJK is bundled as a Noto Sans SC subset (GB2312 level 1 — 3755 common hanzi plus punctuation) and mounted only when the SVG actually contains CJK, so common Chinese renders fine; rarer hanzi outside the subset still have no glyph
- `num` value labels: `all` / `peak` (highest only) / `none`. Defaults follow the style; applies to pie/bar/hbar/line/area/scatter/combo (radar/gauge/sankey/qr ignore it)
- `subtitle` editorial subtitle (only rendered by area's editorial style `t=opendata`), `source` data-source footnote (area only, any `t`); other types parse but ignore these

## Styles (`?t=`)

Per-type reference: [pie](docs/2-data-charts/01-pie/en.md) · [bar](docs/2-data-charts/02-bar/en.md) · [hbar](docs/2-data-charts/03-hbar/en.md) · [line](docs/2-data-charts/04-line/en.md) · [area](docs/2-data-charts/05-area/en.md) · [radar](docs/2-data-charts/06-radar/en.md) · [gauge](docs/2-data-charts/07-gauge/en.md) · [scatter](docs/2-data-charts/08-scatter/en.md) · [combo](docs/2-data-charts/09-combo/en.md) · [sankey](docs/3-relations/01-sankey/en.md) · [qr](docs/7-infographics/01-qr/en.md) · [quadrant](docs/4-strategy/01-quadrant/en.md) · [compass](docs/4-strategy/02-compass/en.md) — each page has the parameters, the style families, the pitfalls and its own `faq.yml`.


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
| `butterfly` | `base` (default, clean: no track, no tick lines), `track` (adds the track), `grid` (adds the tick lines), `scale` (both) |
| `calendar` | `base` (default, Apple-like: white card, hairline rules, today in a red disc), `mono` (greyscale, for print) |
| `scatter` / `combo` / `qr` | `base` (combo also has `evil`) |

## Two ways to pass data

Full catalogue with one row per type: [styles quick reference](docs/1-overview/03-styles/en.md).


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

## Maps (ECharts layer)

`/draw/echarts?d=<option>` renders any ECharts option server-side — heatmaps, boxplots, treemaps, and maps. The US states GeoJSON ships with the service (50 states + DC, Albers-projected), so a choropleth is one option away:

```json
{"title":"GDP per capita 2024",
 "visualMap":{"min":50000,"max":120000,"inRange":{"color":["#dbeafe","#1d4ed8"]}},
 "series":[{"type":"map","map":"USA","data":[{"name":"California","value":102662},{"name":"Mississippi","value":53751}]}]}
```

[![US map — GDP per capita](https://po6.sh/draw/echarts?d=%7B%22title%22%3A%7B%22text%22%3A%22US%20states%20%C2%B7%20GDP%20per%20capita%202024%20%C2%B7%20thousand%20USD%22%7D%2C%22visualMap%22%3A%7B%22min%22%3A50%2C%22max%22%3A120%2C%22orient%22%3A%22horizontal%22%2C%22left%22%3A%22center%22%2C%22bottom%22%3A8%2C%22text%22%3A%5B%22high%22%2C%22low%22%5D%2C%22itemWidth%22%3A12%2C%22itemHeight%22%3A200%2C%22inRange%22%3A%7B%22color%22%3A%5B%22%23eff6ff%22%2C%22%23bfdbfe%22%2C%22%2393c5fd%22%2C%22%2360a5fa%22%5D%7D%7D%2C%22series%22%3A%5B%7B%22type%22%3A%22map%22%2C%22map%22%3A%22USA%22%2C%22label%22%3A%7B%22show%22%3Atrue%2C%22fontSize%22%3A9%2C%22formatter%22%3A%22%7Bb%7D%5Cn%7Bc%7D%22%2C%22color%22%3A%22%230f172a%22%7D%2C%22labelLayout%22%3A%7B%22hideOverlap%22%3Atrue%7D%2C%22itemStyle%22%3A%7B%22areaColor%22%3A%22%23f1f5f9%22%2C%22borderColor%22%3A%22%23ffffff%22%2C%22borderWidth%22%3A0.6%7D%2C%22data%22%3A%5B%7B%22name%22%3A%22New%20York%22%2C%22value%22%3A117%7D%2C%7B%22name%22%3A%22Massachusetts%22%2C%22value%22%3A109%7D%2C%7B%22name%22%3A%22Washington%22%2C%22value%22%3A108%7D%2C%7B%22name%22%3A%22Delaware%22%2C%22value%22%3A105%7D%2C%7B%22name%22%3A%22California%22%2C%22value%22%3A103%7D%2C%7B%22name%22%3A%22North%20Dakota%22%2C%22value%22%3A101%7D%2C%7B%22name%22%3A%22Connecticut%22%2C%22value%22%3A97%7D%2C%7B%22name%22%3A%22Alaska%22%2C%22value%22%3A97%7D%2C%7B%22name%22%3A%22Nebraska%22%2C%22value%22%3A94%7D%2C%7B%22name%22%3A%22Colorado%22%2C%22value%22%3A94%7D%2C%7B%22name%22%3A%22Illinois%22%2C%22value%22%3A90%7D%2C%7B%22name%22%3A%22New%20Jersey%22%2C%22value%22%3A89%7D%2C%7B%22name%22%3A%22Texas%22%2C%22value%22%3A89%7D%2C%7B%22name%22%3A%22Wyoming%22%2C%22value%22%3A88%7D%2C%7B%22name%22%3A%22Minnesota%22%2C%22value%22%3A88%7D%2C%7B%22name%22%3A%22Maryland%22%2C%22value%22%3A87%7D%2C%7B%22name%22%3A%22Virginia%22%2C%22value%22%3A86%7D%2C%7B%22name%22%3A%22Utah%22%2C%22value%22%3A85%7D%2C%7B%22name%22%3A%22New%20Hampshire%22%2C%22value%22%3A85%7D%2C%7B%22name%22%3A%22South%20Dakota%22%2C%22value%22%3A83%7D%2C%7B%22name%22%3A%22Nevada%22%2C%22value%22%3A82%7D%2C%7B%22name%22%3A%22Iowa%22%2C%22value%22%3A82%7D%2C%7B%22name%22%3A%22Hawaii%22%2C%22value%22%3A81%7D%2C%7B%22name%22%3A%22Georgia%22%2C%22value%22%3A79%7D%2C%7B%22name%22%3A%22Ohio%22%2C%22value%22%3A78%7D%2C%7B%22name%22%3A%22Tennessee%22%2C%22value%22%3A78%7D%2C%7B%22name%22%3A%22Kansas%22%2C%22value%22%3A78%7D%2C%7B%22name%22%3A%22Oregon%22%2C%22value%22%3A77%7D%2C%7B%22name%22%3A%22Pennsylvania%22%2C%22value%22%3A77%7D%2C%7B%22name%22%3A%22North%20Carolina%22%2C%22value%22%3A76%7D%2C%7B%22name%22%3A%22Wisconsin%22%2C%22value%22%3A76%7D%2C%7B%22name%22%3A%22Arizona%22%2C%22value%22%3A75%7D%2C%7B%22name%22%3A%22Indiana%22%2C%22value%22%3A75%7D%2C%7B%22name%22%3A%22Florida%22%2C%22value%22%3A74%7D%2C%7B%22name%22%3A%22Rhode%20Island%22%2C%22value%22%3A72%7D%2C%7B%22name%22%3A%22Missouri%22%2C%22value%22%3A72%7D%2C%7B%22name%22%3A%22Louisiana%22%2C%22value%22%3A72%7D%2C%7B%22name%22%3A%22Vermont%22%2C%22value%22%3A71%7D%2C%7B%22name%22%3A%22Maine%22%2C%22value%22%3A71%7D%2C%7B%22name%22%3A%22Michigan%22%2C%22value%22%3A69%7D%2C%7B%22name%22%3A%22New%20Mexico%22%2C%22value%22%3A69%7D%2C%7B%22name%22%3A%22Montana%22%2C%22value%22%3A69%7D%2C%7B%22name%22%3A%22South%20Carolina%22%2C%22value%22%3A65%7D%2C%7B%22name%22%3A%22Idaho%22%2C%22value%22%3A64%7D%2C%7B%22name%22%3A%22Oklahoma%22%2C%22value%22%3A64%7D%2C%7B%22name%22%3A%22Kentucky%22%2C%22value%22%3A64%7D%2C%7B%22name%22%3A%22Alabama%22%2C%22value%22%3A63%7D%2C%7B%22name%22%3A%22Arkansas%22%2C%22value%22%3A61%7D%2C%7B%22name%22%3A%22West%20Virginia%22%2C%22value%22%3A60%7D%2C%7B%22name%22%3A%22Mississippi%22%2C%22value%22%3A54%7D%5D%7D%5D%7D&w=760&h=520)](https://po6.sh/draw/explore/echarts?d=%7B%22title%22%3A%7B%22text%22%3A%22US%20states%20%C2%B7%20GDP%20per%20capita%202024%20%C2%B7%20thousand%20USD%22%7D%2C%22visualMap%22%3A%7B%22min%22%3A50%2C%22max%22%3A120%2C%22orient%22%3A%22horizontal%22%2C%22left%22%3A%22center%22%2C%22bottom%22%3A8%2C%22text%22%3A%5B%22high%22%2C%22low%22%5D%2C%22itemWidth%22%3A12%2C%22itemHeight%22%3A200%2C%22inRange%22%3A%7B%22color%22%3A%5B%22%23eff6ff%22%2C%22%23bfdbfe%22%2C%22%2393c5fd%22%2C%22%2360a5fa%22%5D%7D%7D%2C%22series%22%3A%5B%7B%22type%22%3A%22map%22%2C%22map%22%3A%22USA%22%2C%22label%22%3A%7B%22show%22%3Atrue%2C%22fontSize%22%3A9%2C%22formatter%22%3A%22%7Bb%7D%5Cn%7Bc%7D%22%2C%22color%22%3A%22%230f172a%22%7D%2C%22labelLayout%22%3A%7B%22hideOverlap%22%3Atrue%7D%2C%22itemStyle%22%3A%7B%22areaColor%22%3A%22%23f1f5f9%22%2C%22borderColor%22%3A%22%23ffffff%22%2C%22borderWidth%22%3A0.6%7D%2C%22data%22%3A%5B%7B%22name%22%3A%22New%20York%22%2C%22value%22%3A117%7D%2C%7B%22name%22%3A%22Massachusetts%22%2C%22value%22%3A109%7D%2C%7B%22name%22%3A%22Washington%22%2C%22value%22%3A108%7D%2C%7B%22name%22%3A%22Delaware%22%2C%22value%22%3A105%7D%2C%7B%22name%22%3A%22California%22%2C%22value%22%3A103%7D%2C%7B%22name%22%3A%22North%20Dakota%22%2C%22value%22%3A101%7D%2C%7B%22name%22%3A%22Connecticut%22%2C%22value%22%3A97%7D%2C%7B%22name%22%3A%22Alaska%22%2C%22value%22%3A97%7D%2C%7B%22name%22%3A%22Nebraska%22%2C%22value%22%3A94%7D%2C%7B%22name%22%3A%22Colorado%22%2C%22value%22%3A94%7D%2C%7B%22name%22%3A%22Illinois%22%2C%22value%22%3A90%7D%2C%7B%22name%22%3A%22New%20Jersey%22%2C%22value%22%3A89%7D%2C%7B%22name%22%3A%22Texas%22%2C%22value%22%3A89%7D%2C%7B%22name%22%3A%22Wyoming%22%2C%22value%22%3A88%7D%2C%7B%22name%22%3A%22Minnesota%22%2C%22value%22%3A88%7D%2C%7B%22name%22%3A%22Maryland%22%2C%22value%22%3A87%7D%2C%7B%22name%22%3A%22Virginia%22%2C%22value%22%3A86%7D%2C%7B%22name%22%3A%22Utah%22%2C%22value%22%3A85%7D%2C%7B%22name%22%3A%22New%20Hampshire%22%2C%22value%22%3A85%7D%2C%7B%22name%22%3A%22South%20Dakota%22%2C%22value%22%3A83%7D%2C%7B%22name%22%3A%22Nevada%22%2C%22value%22%3A82%7D%2C%7B%22name%22%3A%22Iowa%22%2C%22value%22%3A82%7D%2C%7B%22name%22%3A%22Hawaii%22%2C%22value%22%3A81%7D%2C%7B%22name%22%3A%22Georgia%22%2C%22value%22%3A79%7D%2C%7B%22name%22%3A%22Ohio%22%2C%22value%22%3A78%7D%2C%7B%22name%22%3A%22Tennessee%22%2C%22value%22%3A78%7D%2C%7B%22name%22%3A%22Kansas%22%2C%22value%22%3A78%7D%2C%7B%22name%22%3A%22Oregon%22%2C%22value%22%3A77%7D%2C%7B%22name%22%3A%22Pennsylvania%22%2C%22value%22%3A77%7D%2C%7B%22name%22%3A%22North%20Carolina%22%2C%22value%22%3A76%7D%2C%7B%22name%22%3A%22Wisconsin%22%2C%22value%22%3A76%7D%2C%7B%22name%22%3A%22Arizona%22%2C%22value%22%3A75%7D%2C%7B%22name%22%3A%22Indiana%22%2C%22value%22%3A75%7D%2C%7B%22name%22%3A%22Florida%22%2C%22value%22%3A74%7D%2C%7B%22name%22%3A%22Rhode%20Island%22%2C%22value%22%3A72%7D%2C%7B%22name%22%3A%22Missouri%22%2C%22value%22%3A72%7D%2C%7B%22name%22%3A%22Louisiana%22%2C%22value%22%3A72%7D%2C%7B%22name%22%3A%22Vermont%22%2C%22value%22%3A71%7D%2C%7B%22name%22%3A%22Maine%22%2C%22value%22%3A71%7D%2C%7B%22name%22%3A%22Michigan%22%2C%22value%22%3A69%7D%2C%7B%22name%22%3A%22New%20Mexico%22%2C%22value%22%3A69%7D%2C%7B%22name%22%3A%22Montana%22%2C%22value%22%3A69%7D%2C%7B%22name%22%3A%22South%20Carolina%22%2C%22value%22%3A65%7D%2C%7B%22name%22%3A%22Idaho%22%2C%22value%22%3A64%7D%2C%7B%22name%22%3A%22Oklahoma%22%2C%22value%22%3A64%7D%2C%7B%22name%22%3A%22Kentucky%22%2C%22value%22%3A64%7D%2C%7B%22name%22%3A%22Alabama%22%2C%22value%22%3A63%7D%2C%7B%22name%22%3A%22Arkansas%22%2C%22value%22%3A61%7D%2C%7B%22name%22%3A%22West%20Virginia%22%2C%22value%22%3A60%7D%2C%7B%22name%22%3A%22Mississippi%22%2C%22value%22%3A54%7D%5D%7D%5D%7D)

`map:"USA"` is the only registered map; `data[].name` uses full state names (`California`, `New York`, …). Layout defaults fill the canvas — override with `layoutCenter` / `layoutSize` / `zoom` on the series.

Per-state numbers ride along in the labels: `series.label` turns them on (`{"show":true,"fontSize":9}`), `series.labelLayout.hideOverlap` drops the ones that do not fit, and a per-item `label` overrides the text and the colour of one state:

```json
{"name":"California","value":116882.8,"label":{"formatter":"CA\n$117k","color":"#ffffff"}}
```

Pick the label colour by the fill it lands on — dark text on the pale end of the ramp, white on the deep end.

## Short links (data stored in a GitHub repo; content-addressed, never expires)

Per-type JSON schemas: [data formats](docs/1-overview/04-data-and-api/en.md).


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

Full deployment guide (Workers, local Node, npm library, short links): [deploy it yourself](docs/1-overview/05-self-hosting/en.md).


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

Reference pages live in [`docs/`](docs/README.md), grouped the same way this README is: the endpoint itself plus the styles, data-format and self-hosting chapters, then one section per chart family, then ready-made scenarios. Every page exists in 19 languages and ships its own `faq.yml` with the questions that page raises.

| section | pages |
|---|---|
| 1 · Overview | [What is draw](docs/1-overview/01-what-is-draw/en.md) · [Quick start](docs/1-overview/02-quick-start/en.md) · [Style families](docs/1-overview/03-styles/en.md) · [Data formats](docs/1-overview/04-data-and-api/en.md) · [Deploy it yourself](docs/1-overview/05-self-hosting/en.md) · [Parameters](docs/1-overview/07-params/en.md) |
| 2 · Data charts | [pie](docs/2-data-charts/01-pie/en.md) · [bar](docs/2-data-charts/02-bar/en.md) · [hbar](docs/2-data-charts/03-hbar/en.md) · [line](docs/2-data-charts/04-line/en.md) · [area](docs/2-data-charts/05-area/en.md) · [radar](docs/2-data-charts/06-radar/en.md) · [gauge](docs/2-data-charts/07-gauge/en.md) · [scatter](docs/2-data-charts/08-scatter/en.md) · [combo](docs/2-data-charts/09-combo/en.md) · [tokei](docs/2-data-charts/10-tokei/en.md) · [butterfly](docs/2-data-charts/11-butterfly/en.md) | · [calendar](docs/2-data-charts/12-calendar/en.md) |
| 3 · Relations | [sankey](docs/3-relations/01-sankey/en.md) · [dataflow](docs/3-relations/02-dataflow/en.md) |
| 4 · Strategy and decision | [quadrant](docs/4-strategy/01-quadrant/en.md) · [compass](docs/4-strategy/02-compass/en.md) · [use case](docs/4-strategy/03-uc/en.md) · [lifecycle](docs/4-strategy/04-lifecycle/en.md) |
| 5 · Architecture | [archmap](docs/5-architecture/01-archmap/en.md) · [mindmap](docs/5-architecture/02-mindmap/en.md) · [mermaid](docs/5-architecture/03-mermaid/en.md) · [sequence](docs/5-architecture/04-seq/en.md) · [erd](docs/5-architecture/05-erd/en.md) · [class](docs/5-architecture/06-class/en.md) |
| 6 · Schedule | [gantt](docs/6-schedule/01-gantt/en.md) · [gantt v2](docs/6-schedule/02-gantt2/en.md) |
| 7 · Infographics | [qr](docs/7-infographics/01-qr/en.md) |
| 8 · Maps | [maps](docs/8-maps/01-maps/en.md) |
| 9 · Showcases | [github](docs/9-showcases/01-github/en.md) · [analysis report](docs/9-showcases/02-analysis-report/en.md) · [macro economics](docs/9-showcases/03-macro-economics/en.md) · [marketing](docs/9-showcases/04-marketing/en.md) · [product roadmap](docs/9-showcases/05-product-roadmap/en.md) · [ops and reliability](docs/9-showcases/06-ops-reliability/en.md) · [education](docs/9-showcases/07-education/en.md) · [healthcare](docs/9-showcases/08-healthcare/en.md) · [finance](docs/9-showcases/09-finance/en.md) · [logistics](docs/9-showcases/10-logistics/en.md) · [ai-coding era](docs/9-showcases/11-ai-coding-era/en.md) · [reference charts](docs/9-showcases/12-reference-examples/en.md) | · [calendar](docs/9-showcases/13-calendar/en.md) |

Start with [quick start](docs/1-overview/02-quick-start/en.md) for a first chart, or the per-type page when you already know which chart you want.
