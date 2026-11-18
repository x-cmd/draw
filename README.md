# draw

> **English** | [简体中文](readme/cn.md) | [Deutsch](readme/de.md) | [Español](readme/es.md) | [Français](readme/fr.md) | [Italiano](readme/it.md) | [Português](readme/pt.md) | [Русский](readme/ru.md) | [Українська](readme/uk.md) | [日本語](readme/ja.md) | [한국어](readme/ko.md) | [Čeština](readme/cs.md) | [Polski](readme/pl.md) | [Română](readme/ro.md) | [Türkçe](readme/tr.md) | [Tiếng Việt](readme/vi.md) | [ไทย](readme/th.md) | [Bahasa Indonesia](readme/id.md)

[![JSR score](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.jsr.io%2Fscopes%2Fx-cmd%2Fpackages%2Fdraw&query=%24.score&label=JSR%20score&color=yellowgreen)](https://jsr.io/@x-cmd/draw/score)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/x-cmd/draw/badge)](https://securityscorecards.dev/viewer/?uri=github.com/x-cmd/draw)


X-CMD Draw is an open-source SVG chart generator: put your data and styling in a URL to create bar charts, line charts, Sankey diagrams, system architecture diagrams, mind maps, and more.

Embed charts directly in READMEs, issues, PRs, blog posts, and web pages without exporting or uploading image files. Links and SVGs retain machine-readable data and parameters: readers see the chart, while AI agents can read, modify, and regenerate it without image recognition.

## Sneak peek

From performance analysis to architecture design, and from maps to schedules, the complete chart definition lives in the link. Click an image to inspect the data, adjust the styling, and regenerate it. [Explore more chart examples ↗](https://x-cmd.com/draw)

| | |
| --- | --- |
| **Downloads and growth**<br>[![Downloads and growth](https://www.x-cmd.com/draw?type=combo&title=Downloads+and+growth&labels=Jan%2CFeb%2CMar%2CApr%2CMay%2CJun%2CJul%2CAug%2CSep%2COct%2CNov%2CDec&series=downloads%3A900%2C1200%2C1050%2C1600%2C1400%2C1800%2C2100%2C1950%2C2200%2C2500%2C2300%2C2700&line=growth%3A5%2C8%2C6%2C12%2C10%2C15%2C18%2C16%2C20%2C23%2C21%2C26)](https://www.x-cmd.com/draw/explore?type=combo&title=Downloads+and+growth&labels=Jan%2CFeb%2CMar%2CApr%2CMay%2CJun%2CJul%2CAug%2CSep%2COct%2CNov%2CDec&series=downloads%3A900%2C1200%2C1050%2C1600%2C1400%2C1800%2C2100%2C1950%2C2200%2C2500%2C2300%2C2700&line=growth%3A5%2C8%2C6%2C12%2C10%2C15%2C18%2C16%2C20%2C23%2C21%2C26) | **Compression algorithm comparison**<br>[![Compression: speed vs ratio](https://www.x-cmd.com/draw/echarts?d=%7B%22backgroundColor%22%3A%22%230f172a%22%2C%22title%22%3A%7B%22text%22%3A%22Compression%3A%20speed%20vs%20ratio%22%2C%22subtext%22%3A%22Silesia%20%C2%B7%20i7-9700K%20%C2%B7%20lzbench%20%C2%B7%20bubble%20size%20%3D%20decompression%20speed%22%2C%22left%22%3A%22center%22%2C%22textStyle%22%3A%7B%22color%22%3A%22%23f8fafc%22%7D%2C%22subtextStyle%22%3A%7B%22color%22%3A%22%2394a3b8%22%7D%7D%2C%22grid%22%3A%7B%22left%22%3A70%2C%22right%22%3A40%2C%22top%22%3A80%2C%22bottom%22%3A60%7D%2C%22xAxis%22%3A%7B%22name%22%3A%22Compression%20speed%20MB%2Fs%20(faster%20%E2%86%92)%22%2C%22min%22%3A0%2C%22max%22%3A800%2C%22nameLocation%22%3A%22middle%22%2C%22nameGap%22%3A32%2C%22nameTextStyle%22%3A%7B%22color%22%3A%22%2394a3b8%22%7D%2C%22axisLabel%22%3A%7B%22color%22%3A%22%2394a3b8%22%7D%2C%22splitLine%22%3A%7B%22lineStyle%22%3A%7B%22color%22%3A%22%231e293b%22%7D%7D%7D%2C%22yAxis%22%3A%7B%22name%22%3A%22Ratio%20(smaller%20output%20%E2%86%91)%22%2C%22min%22%3A1.9%2C%22max%22%3A3%2C%22nameLocation%22%3A%22middle%22%2C%22nameGap%22%3A45%2C%22nameTextStyle%22%3A%7B%22color%22%3A%22%2394a3b8%22%7D%2C%22axisLabel%22%3A%7B%22color%22%3A%22%2394a3b8%22%7D%2C%22splitLine%22%3A%7B%22lineStyle%22%3A%7B%22color%22%3A%22%231e293b%22%7D%7D%7D%2C%22series%22%3A%5B%7B%22type%22%3A%22scatter%22%2C%22data%22%3A%5B%7B%22name%22%3A%22zstd%20-1%22%2C%22value%22%3A%5B510%2C2.896%5D%2C%22symbolSize%22%3A28%2C%22itemStyle%22%3A%7B%22color%22%3A%22%2322d3ee%22%7D%2C%22label%22%3A%7B%22position%22%3A%22top%22%7D%7D%2C%7B%22name%22%3A%22zstd%20--fast%3D1%22%2C%22value%22%3A%5B545%2C2.439%5D%2C%22symbolSize%22%3A30%2C%22itemStyle%22%3A%7B%22color%22%3A%22%2322d3ee%22%7D%2C%22label%22%3A%7B%22position%22%3A%22top%22%7D%7D%2C%7B%22name%22%3A%22zstd%20--fast%3D4%22%2C%22value%22%3A%5B665%2C2.146%5D%2C%22symbolSize%22%3A31%2C%22itemStyle%22%3A%7B%22color%22%3A%22%2322d3ee%22%7D%2C%22label%22%3A%7B%22position%22%3A%22top%22%7D%7D%2C%7B%22name%22%3A%22brotli%20-1%22%2C%22value%22%3A%5B290%2C2.883%5D%2C%22symbolSize%22%3A21%2C%22itemStyle%22%3A%7B%22color%22%3A%22%23a78bfa%22%7D%2C%22label%22%3A%7B%22position%22%3A%22top%22%7D%7D%2C%7B%22name%22%3A%22zlib%20-1%22%2C%22value%22%3A%5B105%2C2.743%5D%2C%22symbolSize%22%3A20%2C%22itemStyle%22%3A%7B%22color%22%3A%22%23f87171%22%7D%2C%22label%22%3A%7B%22position%22%3A%22top%22%7D%7D%2C%7B%22name%22%3A%22lz4%22%2C%22value%22%3A%5B675%2C2.101%5D%2C%22symbolSize%22%3A38%2C%22itemStyle%22%3A%7B%22color%22%3A%22%23fbbf24%22%7D%2C%22label%22%3A%7B%22position%22%3A%22right%22%7D%7D%2C%7B%22name%22%3A%22lzo1x%22%2C%22value%22%3A%5B650%2C2.106%5D%2C%22symbolSize%22%3A24%2C%22itemStyle%22%3A%7B%22color%22%3A%22%2394a3b8%22%7D%2C%22label%22%3A%7B%22position%22%3A%22left%22%7D%7D%2C%7B%22name%22%3A%22snappy%22%2C%22value%22%3A%5B520%2C2.089%5D%2C%22symbolSize%22%3A28%2C%22itemStyle%22%3A%7B%22color%22%3A%22%2394a3b8%22%7D%2C%22label%22%3A%7B%22position%22%3A%22bottom%22%7D%7D%2C%7B%22name%22%3A%22quicklz%22%2C%22value%22%3A%5B520%2C2.238%5D%2C%22symbolSize%22%3A23%2C%22itemStyle%22%3A%7B%22color%22%3A%22%2394a3b8%22%7D%2C%22label%22%3A%7B%22position%22%3A%22top%22%7D%7D%2C%7B%22name%22%3A%22lzf%22%2C%22value%22%3A%5B410%2C2.077%5D%2C%22symbolSize%22%3A24%2C%22itemStyle%22%3A%7B%22color%22%3A%22%2394a3b8%22%7D%2C%22label%22%3A%7B%22position%22%3A%22bottom%22%7D%7D%5D%2C%22itemStyle%22%3A%7B%22opacity%22%3A0.85%2C%22borderColor%22%3A%22%23fff%22%2C%22borderWidth%22%3A1%7D%2C%22label%22%3A%7B%22show%22%3Atrue%2C%22formatter%22%3A%22%7Bb%7D%22%2C%22color%22%3A%22%23e2e8f0%22%2C%22fontSize%22%3A12%7D%7D%5D%7D&w=960&h=540)](https://www.x-cmd.com/draw/explore/echarts?d=%7B%22backgroundColor%22%3A%22%230f172a%22%2C%22title%22%3A%7B%22text%22%3A%22Compression%3A%20speed%20vs%20ratio%22%2C%22subtext%22%3A%22Silesia%20%C2%B7%20i7-9700K%20%C2%B7%20lzbench%20%C2%B7%20bubble%20size%20%3D%20decompression%20speed%22%2C%22left%22%3A%22center%22%2C%22textStyle%22%3A%7B%22color%22%3A%22%23f8fafc%22%7D%2C%22subtextStyle%22%3A%7B%22color%22%3A%22%2394a3b8%22%7D%7D%2C%22grid%22%3A%7B%22left%22%3A70%2C%22right%22%3A40%2C%22top%22%3A80%2C%22bottom%22%3A60%7D%2C%22xAxis%22%3A%7B%22name%22%3A%22Compression%20speed%20MB%2Fs%20(faster%20%E2%86%92)%22%2C%22min%22%3A0%2C%22max%22%3A800%2C%22nameLocation%22%3A%22middle%22%2C%22nameGap%22%3A32%2C%22nameTextStyle%22%3A%7B%22color%22%3A%22%2394a3b8%22%7D%2C%22axisLabel%22%3A%7B%22color%22%3A%22%2394a3b8%22%7D%2C%22splitLine%22%3A%7B%22lineStyle%22%3A%7B%22color%22%3A%22%231e293b%22%7D%7D%7D%2C%22yAxis%22%3A%7B%22name%22%3A%22Ratio%20(smaller%20output%20%E2%86%91)%22%2C%22min%22%3A1.9%2C%22max%22%3A3%2C%22nameLocation%22%3A%22middle%22%2C%22nameGap%22%3A45%2C%22nameTextStyle%22%3A%7B%22color%22%3A%22%2394a3b8%22%7D%2C%22axisLabel%22%3A%7B%22color%22%3A%22%2394a3b8%22%7D%2C%22splitLine%22%3A%7B%22lineStyle%22%3A%7B%22color%22%3A%22%231e293b%22%7D%7D%7D%2C%22series%22%3A%5B%7B%22type%22%3A%22scatter%22%2C%22data%22%3A%5B%7B%22name%22%3A%22zstd%20-1%22%2C%22value%22%3A%5B510%2C2.896%5D%2C%22symbolSize%22%3A28%2C%22itemStyle%22%3A%7B%22color%22%3A%22%2322d3ee%22%7D%2C%22label%22%3A%7B%22position%22%3A%22top%22%7D%7D%2C%7B%22name%22%3A%22zstd%20--fast%3D1%22%2C%22value%22%3A%5B545%2C2.439%5D%2C%22symbolSize%22%3A30%2C%22itemStyle%22%3A%7B%22color%22%3A%22%2322d3ee%22%7D%2C%22label%22%3A%7B%22position%22%3A%22top%22%7D%7D%2C%7B%22name%22%3A%22zstd%20--fast%3D4%22%2C%22value%22%3A%5B665%2C2.146%5D%2C%22symbolSize%22%3A31%2C%22itemStyle%22%3A%7B%22color%22%3A%22%2322d3ee%22%7D%2C%22label%22%3A%7B%22position%22%3A%22top%22%7D%7D%2C%7B%22name%22%3A%22brotli%20-1%22%2C%22value%22%3A%5B290%2C2.883%5D%2C%22symbolSize%22%3A21%2C%22itemStyle%22%3A%7B%22color%22%3A%22%23a78bfa%22%7D%2C%22label%22%3A%7B%22position%22%3A%22top%22%7D%7D%2C%7B%22name%22%3A%22zlib%20-1%22%2C%22value%22%3A%5B105%2C2.743%5D%2C%22symbolSize%22%3A20%2C%22itemStyle%22%3A%7B%22color%22%3A%22%23f87171%22%7D%2C%22label%22%3A%7B%22position%22%3A%22top%22%7D%7D%2C%7B%22name%22%3A%22lz4%22%2C%22value%22%3A%5B675%2C2.101%5D%2C%22symbolSize%22%3A38%2C%22itemStyle%22%3A%7B%22color%22%3A%22%23fbbf24%22%7D%2C%22label%22%3A%7B%22position%22%3A%22right%22%7D%7D%2C%7B%22name%22%3A%22lzo1x%22%2C%22value%22%3A%5B650%2C2.106%5D%2C%22symbolSize%22%3A24%2C%22itemStyle%22%3A%7B%22color%22%3A%22%2394a3b8%22%7D%2C%22label%22%3A%7B%22position%22%3A%22left%22%7D%7D%2C%7B%22name%22%3A%22snappy%22%2C%22value%22%3A%5B520%2C2.089%5D%2C%22symbolSize%22%3A28%2C%22itemStyle%22%3A%7B%22color%22%3A%22%2394a3b8%22%7D%2C%22label%22%3A%7B%22position%22%3A%22bottom%22%7D%7D%2C%7B%22name%22%3A%22quicklz%22%2C%22value%22%3A%5B520%2C2.238%5D%2C%22symbolSize%22%3A23%2C%22itemStyle%22%3A%7B%22color%22%3A%22%2394a3b8%22%7D%2C%22label%22%3A%7B%22position%22%3A%22top%22%7D%7D%2C%7B%22name%22%3A%22lzf%22%2C%22value%22%3A%5B410%2C2.077%5D%2C%22symbolSize%22%3A24%2C%22itemStyle%22%3A%7B%22color%22%3A%22%2394a3b8%22%7D%2C%22label%22%3A%7B%22position%22%3A%22bottom%22%7D%7D%5D%2C%22itemStyle%22%3A%7B%22opacity%22%3A0.85%2C%22borderColor%22%3A%22%23fff%22%2C%22borderWidth%22%3A1%7D%2C%22label%22%3A%7B%22show%22%3Atrue%2C%22formatter%22%3A%22%7Bb%7D%22%2C%22color%22%3A%22%23e2e8f0%22%2C%22fontSize%22%3A12%7D%7D%5D%7D) |
| [![OpenCode project architecture](https://www.x-cmd.com/draw/arch2?title=OpenCode+Project+Architecture&t=shadcn&n=tui%3Bfe%3BTerminal+UI%3BCommand-line+interface%3Br0c0&n=web%3Bfe%3BWeb+UI%3BBrowser+access%3Br0c1&n=desktop%3Bfe%3BDesktop+App%3BElectron+client%3Br0c2&n=sdk%3Bbe%3BJavaScript+SDK%3BProgrammatic+access%3Br1c0&n=server%3Bsvc%3BOpenCode+Core+Service%3BCLI+and+HTTP+server%3Br1c1&n=session%3Bsvc%3BSessions+%26+Messages%3BContext+management%3Br2c0&n=agent%3Bsvc%3BAgent+System%3BBuild+and+Plan+subagents%3Br2c1&n=provider%3Bsvc%3BModel+Providers%3BModel+requests+and+responses%3Br2c2&n=tools%3Bsvc%3BTool+System%3BFile+I%2FO%2C+Bash+and+search%3Br3c0&n=mcp%3Bsvc%3BMCP+Services%3BExternal+tool+integrations%3Br3c1&n=plugin%3Bsvc%3BPlugins+%26+Extensions%3BEvent+hooks+and+custom+capabilities%3Br3c2&n=storage%3Bdb%3BLocal+Storage%3BSQLite+session+data%3Br4c1&e=tui%3Bserver%3BTerminal+request&e=web%3Bserver%3BHTTP+API&e=desktop%3Bserver%3BClient+request&e=sdk%3Bserver%3BAPI+call&e=server%3Bsession%3BManage+sessions&e=server%3Bagent%3BCoordinate+agents&e=agent%3Bprovider%3BModel+request&e=agent%3Btools%3BInvoke+tools&e=tools%3Bmcp%3BExternal+tool+sources&e=server%3Bplugin%3BLoad+plugins&e=session%3Bstorage%3BRead%2Fwrite+sessions&e=agent%3Bsession%3BMessage+context&b=Client+Interfaces%3B+tui+web+desktop+sdk&b=Core+Runtime%3B+server+session+agent+provider&b=Extensions+%26+Execution%3B+tools+mcp+plugin&b=Data+Persistence%3B+storage)](https://www.x-cmd.com/draw/explore/arch2?title=OpenCode+Project+Architecture&t=shadcn&n=tui%3Bfe%3BTerminal+UI%3BCommand-line+interface%3Br0c0&n=web%3Bfe%3BWeb+UI%3BBrowser+access%3Br0c1&n=desktop%3Bfe%3BDesktop+App%3BElectron+client%3Br0c2&n=sdk%3Bbe%3BJavaScript+SDK%3BProgrammatic+access%3Br1c0&n=server%3Bsvc%3BOpenCode+Core+Service%3BCLI+and+HTTP+server%3Br1c1&n=session%3Bsvc%3BSessions+%26+Messages%3BContext+management%3Br2c0&n=agent%3Bsvc%3BAgent+System%3BBuild+and+Plan+subagents%3Br2c1&n=provider%3Bsvc%3BModel+Providers%3BModel+requests+and+responses%3Br2c2&n=tools%3Bsvc%3BTool+System%3BFile+I%2FO%2C+Bash+and+search%3Br3c0&n=mcp%3Bsvc%3BMCP+Services%3BExternal+tool+integrations%3Br3c1&n=plugin%3Bsvc%3BPlugins+%26+Extensions%3BEvent+hooks+and+custom+capabilities%3Br3c2&n=storage%3Bdb%3BLocal+Storage%3BSQLite+session+data%3Br4c1&e=tui%3Bserver%3BTerminal+request&e=web%3Bserver%3BHTTP+API&e=desktop%3Bserver%3BClient+request&e=sdk%3Bserver%3BAPI+call&e=server%3Bsession%3BManage+sessions&e=server%3Bagent%3BCoordinate+agents&e=agent%3Bprovider%3BModel+request&e=agent%3Btools%3BInvoke+tools&e=tools%3Bmcp%3BExternal+tool+sources&e=server%3Bplugin%3BLoad+plugins&e=session%3Bstorage%3BRead%2Fwrite+sessions&e=agent%3Bsession%3BMessage+context&b=Client+Interfaces%3B+tui+web+desktop+sdk&b=Core+Runtime%3B+server+session+agent+provider&b=Extensions+%26+Execution%3B+tools+mcp+plugin&b=Data+Persistence%3B+storage) | [![Chemical structure](https://www.x-cmd.com/draw/chem?smiles=CC%28%3DO%29Oc1ccccc1C%28%3DO%29O)](https://www.x-cmd.com/draw/explore/chem?smiles=CC%28%3DO%29Oc1ccccc1C%28%3DO%29O) |
| [![LLM technology landscape](https://www.x-cmd.com/draw/mindmap?style=radial&title=LLM+Technology+Landscape&n=LLM%2FPretraining%2FData%2FCleaning+%26+Deduplication&n=LLM%2FPretraining%2FData%2FSynthetic+Data&n=LLM%2FPretraining%2FTraining%2FMoE+Architecture&n=LLM%2FAlignment%2FSFT&n=LLM%2FAlignment%2FRLHF&n=LLM%2FAlignment%2FDPO&n=LLM%2FInference%2FSampling%2Ftemperature&n=LLM%2FInference%2FSampling%2Ftop-p&n=LLM%2FInference%2FAcceleration%2FKV+Cache&n=LLM%2FInference%2FAcceleration%2FSpeculative+Decoding&n=LLM%2FInference%2FAcceleration%2FQuantization&n=LLM%2FInference%2FDeployment%2FvLLM&n=LLM%2FRAG%2FVector+Database&n=LLM%2FRAG%2FEmbedding+Models&n=LLM%2FRAG%2FReranking&n=LLM%2FAgent%2FTool+Calling&n=LLM%2FAgent%2FTask+Planning&n=LLM%2FAgent%2FMulti-Agent+Systems&n=LLM%2FAgent%2FMCP+Protocol&n=LLM%2FFine-tuning%2FLoRA&n=LLM%2FFine-tuning%2FFull-Parameter+Fine-Tuning&n=LLM%2FFine-tuning%2FKnowledge+Distillation&n=LLM%2FEvaluation%2FMMLU&n=LLM%2FEvaluation%2FHumanEval&n=LLM%2FEvaluation%2FLLM-as-a-Judge&n=LLM%2FMultimodal%2FVision+Encoders&n=LLM%2FMultimodal%2FSpeech&n=LLM%2FMultimodal%2FVideo)](https://www.x-cmd.com/draw/explore/mindmap?style=radial&title=LLM+Technology+Landscape&n=LLM%2FPretraining%2FData%2FCleaning+%26+Deduplication&n=LLM%2FPretraining%2FData%2FSynthetic+Data&n=LLM%2FPretraining%2FTraining%2FMoE+Architecture&n=LLM%2FAlignment%2FSFT&n=LLM%2FAlignment%2FRLHF&n=LLM%2FAlignment%2FDPO&n=LLM%2FInference%2FSampling%2Ftemperature&n=LLM%2FInference%2FSampling%2Ftop-p&n=LLM%2FInference%2FAcceleration%2FKV+Cache&n=LLM%2FInference%2FAcceleration%2FSpeculative+Decoding&n=LLM%2FInference%2FAcceleration%2FQuantization&n=LLM%2FInference%2FDeployment%2FvLLM&n=LLM%2FRAG%2FVector+Database&n=LLM%2FRAG%2FEmbedding+Models&n=LLM%2FRAG%2FReranking&n=LLM%2FAgent%2FTool+Calling&n=LLM%2FAgent%2FTask+Planning&n=LLM%2FAgent%2FMulti-Agent+Systems&n=LLM%2FAgent%2FMCP+Protocol&n=LLM%2FFine-tuning%2FLoRA&n=LLM%2FFine-tuning%2FFull-Parameter+Fine-Tuning&n=LLM%2FFine-tuning%2FKnowledge+Distillation&n=LLM%2FEvaluation%2FMMLU&n=LLM%2FEvaluation%2FHumanEval&n=LLM%2FEvaluation%2FLLM-as-a-Judge&n=LLM%2FMultimodal%2FVision+Encoders&n=LLM%2FMultimodal%2FSpeech&n=LLM%2FMultimodal%2FVideo) | [![Cinema releases · November 2026](https://www.x-cmd.com/draw?type=calendar&lang=en&layout=month&start=2026-11-01&w=1000&h=700&scheme=dark&title=Cinema+Release+Schedule+%C2%B7+November+2026&source=Example+data+%C2%B7+Release+cadence+based+on+the+US+theatrical+schedule&day=2026-11-11%3Bholiday%3BVeterans+Day&day=2026-11-26%3Bholiday%3BThanksgiving&day=2026-11-27%3Bholiday%3BBlack+Friday&ev=2026-11-06%3Bfocus%3BStar+Orbit%3B19%3A30&ev=2026-11-06%3Breview%3BEchoes+of+the+Deep%3B21%3A00&ev=2026-11-11%3Bmeeting%3BOld+Town%3B14%3A00&ev=2026-11-13%3Breview%3BMurder+in+the+Fog%3B21%3A00&ev=2026-11-13%3Bpersonal%3BThe+Little+Bear%27s+Winter%3B10%3A30&ev=2026-11-13%3Bhealth%3BThe+Last+Chapter+of+Summer%3B19%3A00&ev=2026-11-14%3Bclass%3BMemories+of+the+Old+South+4K%3B15%3A00&ev=2026-11-20%3Brelease%3BBlazing+Pursuit+IMAX%3B20%3A00&ev=2026-11-20%3Bfocus%3BMoonlight+Messenger%3B19%3A30&ev=2026-11-20%3Btravel%3BLove+in+the+Kitchen%3B18%3A30&ev=2026-11-22%3Bmeeting%3BJazz+at+Dusk%3B16%3A00&ev=2026-11-25%3Bpersonal%3BA+Winter+Wonderland+Night%3B10%3A00&ev=2026-11-25%3Btravel%3BFather-in-Law+2%3B19%3A00&ev=2026-11-25%3Brelease%3BThe+Lost+Star+Map+IMAX%3B20%3A30&ev=2026-11-26%3Bmeeting%3BFamily+Reunion+Dinner%3B13%3A00&ev=2026-11-27%3Breview%3BAgainst+the+Light%3B22%3A00&ev=2026-11-27%3Boncall%3BMurder+in+the+Dark+Alley%3B20%3A00&ev=2026-11-28%3Bclass%3BInterstellar+Voyage+10th+Anniversary%3B19%3A30&note=2026-11%3BThanksgiving+slate+%C2%B7+Three+releases+on+11%2F25%3B11%2F20+is+the+biggest+release+day+this+month)](https://www.x-cmd.com/draw/explore/?type=calendar&lang=en&layout=month&start=2026-11-01&w=1000&h=700&scheme=dark&title=Cinema+Release+Schedule+%C2%B7+November+2026&source=Example+data+%C2%B7+Release+cadence+based+on+the+US+theatrical+schedule&day=2026-11-11%3Bholiday%3BVeterans+Day&day=2026-11-26%3Bholiday%3BThanksgiving&day=2026-11-27%3Bholiday%3BBlack+Friday&ev=2026-11-06%3Bfocus%3BStar+Orbit%3B19%3A30&ev=2026-11-06%3Breview%3BEchoes+of+the+Deep%3B21%3A00&ev=2026-11-11%3Bmeeting%3BOld+Town%3B14%3A00&ev=2026-11-13%3Breview%3BMurder+in+the+Fog%3B21%3A00&ev=2026-11-13%3Bpersonal%3BThe+Little+Bear%27s+Winter%3B10%3A30&ev=2026-11-13%3Bhealth%3BThe+Last+Chapter+of+Summer%3B19%3A00&ev=2026-11-14%3Bclass%3BMemories+of+the+Old+South+4K%3B15%3A00&ev=2026-11-20%3Brelease%3BBlazing+Pursuit+IMAX%3B20%3A00&ev=2026-11-20%3Bfocus%3BMoonlight+Messenger%3B19%3A30&ev=2026-11-20%3Btravel%3BLove+in+the+Kitchen%3B18%3A30&ev=2026-11-22%3Bmeeting%3BJazz+at+Dusk%3B16%3A00&ev=2026-11-25%3Bpersonal%3BA+Winter+Wonderland+Night%3B10%3A00&ev=2026-11-25%3Btravel%3BFather-in-Law+2%3B19%3A00&ev=2026-11-25%3Brelease%3BThe+Lost+Star+Map+IMAX%3B20%3A30&ev=2026-11-26%3Bmeeting%3BFamily+Reunion+Dinner%3B13%3A00&ev=2026-11-27%3Breview%3BAgainst+the+Light%3B22%3A00&ev=2026-11-27%3Boncall%3BMurder+in+the+Dark+Alley%3B20%3A00&ev=2026-11-28%3Bclass%3BInterstellar+Voyage+10th+Anniversary%3B19%3A30&note=2026-11%3BThanksgiving+slate+%C2%B7+Three+releases+on+11%2F25%3B11%2F20+is+the+biggest+release+day+this+month) |

## Quick start

### 1. Teach your agent to use draw

Give the following prompt to an agent that can read web pages. The hosted draw service requires no account registration or API key:

```text
Read and follow https://raw.githubusercontent.com/x-cmd/draw/main/SKILL.md. From now on, whenever you write a README, issue, pull request, blog post, or chat message and need a chart, use x-cmd Draw to generate a link and embed it with image syntax instead of attaching image files.
```

### 2. Describe what you need

Tell the agent what data to use, what relationship to express, and where the chart will go:

> I want to add an architecture diagram to this PR. Read the code changes and discussion first, then map the request path from the CLI through the API to the database. Identify the modules involved and where this change fits, and embed the diagram directly in the PR description.

For regular use, install [`SKILL.md`](SKILL.md) in an agent that supports local skills. For Claude Code, save it as `~/.claude/skills/draw/SKILL.md`; after this one-time setup, you can describe your request directly.

## Features

- **🔗 A URL is a chart**: Data and styling remain readable, comparable, version-controlled text, and the link embeds directly in Markdown and web pages.
- **🤖 Readable by people and AI**: SVG handles presentation while machine-readable data and parameters support modification and regeneration—no need to infer data from an image.
- **📊 Broad visualization support**: Create data charts, flowcharts, architecture diagrams, mind maps, maps, and schedules, or use ECharts for more complex data relationships.
- **🖱️ Interactive editing**: Open an example in the interactive editor to inspect data, adjust parameters and styles, and copy the updated chart link.
- **🚀 Open and self-hostable**: Built with TypeScript and licensed under Apache-2.0, with a hosted service, CLI, npm / JSR libraries, and Cloudflare Workers deployment.

## Not using an agent? Choose your workflow

### Make a quick chart: use a URL

Ideal for documentation, sharing, and ad-hoc visualization. Open the [demo and interactive editor](https://x-cmd.com/draw), adjust the data and styling, then copy the link—or edit the URL parameters directly:

```md
![Share example](https://x-cmd.com/draw?type=pie&labels=A,B&values=3,2)
```

Your readers see a chart; you keep text that is easy to modify and review.

### Generate charts in bulk or integrate them: use the CLI or a library

Ideal for updating charts in CI, generating reports in bulk, working offline, and integrating charts into applications. The CLI, libraries, and hosted service share the same parameters:

```sh
npx @x-cmd/draw --type pie --labels A,B --values 3,2 --out pie.svg
```

To generate SVG synchronously in code, install the library and call `draw`:

```sh
npm install @x-cmd/draw
```
```ts
import { draw } from '@x-cmd/draw';

const { svg } = draw({ type: 'pie', labels: 'A,B', values: '3,2', t: 'evil', scheme: 'dark' });
```

Deno users can run `deno add jsr:@x-cmd/draw` and import from `jsr:@x-cmd/draw`. The rendering core accesses neither the network nor the filesystem, making it suitable for restricted environments.

### Control the endpoint and data boundary: run your own service

Ideal for a shared team endpoint, internal networks, or avoiding dependence on a public service:

```sh
git clone https://github.com/x-cmd/draw && cd draw && npm install
npm run serve           # Local service: http://localhost:8787/draw
bash scripts/setup.sh   # One-command deployment to your Cloudflare account
```

Configure `DATA_REPO`, `DATA_BRANCH`, and `GITHUB_TOKEN` to enable permanent short links; regular GET rendering works without them. See the [self-hosting guide](docs/1-overview/05-self-hosting/en.md).

## Documentation and API

Complete chart references, parameters, and examples are organized by topic:

| Topic | Documentation |
| --- | --- |
| Browse all chart types and scenarios | [Documentation index](docs/README.md) · [Reference charts](docs/9-showcases/12-reference-examples/en.md) · [Cloud architecture examples](docs/9-showcases/14-cloud-architecture/en.md) |
| Common parameters and URL encoding | [Parameters](docs/1-overview/07-params/en.md) |
| JSON data | [Data formats and API](docs/1-overview/04-data-and-api/en.md) |
| Create short links or configure their storage | [Self-hosting and short-link configuration](docs/1-overview/05-self-hosting/en.md) |
| Architecture, sequence, ERD, and other structural diagrams | [Diagram URL grammar](docs/1-overview/06-diagram-urls/en.md) |
| Run locally or deploy to Cloudflare | [Self-hosting guide](docs/1-overview/05-self-hosting/en.md) |
| Generate charts with an AI agent | [Agent skill](SKILL.md) |

<details>
<summary>Inside draw: generated project diagrams</summary>

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

</details>

## Development

```sh
npm install
npm run dev      # Start wrangler dev locally
npm test         # Vitest
npm run check    # tsc --noEmit × 3 (worker / node / build)
npm run build    # Build dist/ (npm library + CLI)
npm run deploy   # wrangler deploy
```

## License

Code is licensed under [Apache-2.0](LICENSE). Bundled fonts retain their own licenses: Inter (OFL, see [`inter-OFL.txt`](src/styles/inter-OFL.txt)) and Handlee (OFL, see [`handlee-OFL.txt`](src/styles/handlee-OFL.txt)).
