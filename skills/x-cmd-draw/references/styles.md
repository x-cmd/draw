# 风格与图表组合

需要选择 `t=` 或组织 README / 报告中的图表时读取。

## 1. 风格家族（可选 `t=`）

默认 = 各家族表第一个（标 ⭐）；`t=` 拼错报 400 并列出有效家族，家族存在但该图种未做则静默回退默认。

| 图种 | 可选家族 |
|---|---|
| pie | ⭐`opendata` `evil` `evil-mono` `market-mono` `progress` `revenue` |
| bar | ⭐`evil` `base` `grid` |
| hbar | ⭐`base` `opendata`（支持老写法 `ref=` / `reflabel=`） `xcmd`（像素条，值为 %） `xcmd-issue`（双系列蝴蝶） `rank`（双系列实底+斜纹） |
| line | ⭐`shadcn` `evil` `evil-glow`（发光） `evil-mono` `opendata`（线端标签） |
| area | ⭐`evil` `star`（手绘） `pixel` `polka` `opendata`（支持 `subtitle=` `source=`） |
| radar | ⭐`base` `evil`（支持多系列） `xcmd` |
| gauge | ⭐`base` `gradient` `reliability` |
| sankey | ⭐`base` `fund` `pipeline` |
| combo | ⭐`base` `evil` |
| butterfly | ⭐`base` `track` `grid` `scale` |
| calendar | ⭐`base` `mono`（墨水风） |
| table | ⭐`base`（仅此） |
| scatter / qr / quadrant / compass | ⭐`base`（仅此） |

## 2. README 图表设计原则

- 信息清晰优先于装饰复杂；尺寸可读、标签简短。
- 同一份报告里的图保持单位、颜色、命名一致。
- 表格已说清的，别再用图重复一遍。
- 写有意义的图片 alt 文本；有 explore 入口的，把图链接到编辑器。
- 优先选能用项目真实数据重新生成的图，别把一次性数字永久写死。

## 3. 多图组合

一个任务需要多张图时：不同问题拆成不同图，一张图说一件事；共享单位、颜色和命名；同一份数据别在多张图里重复；按有意义的阅读顺序排；图之间用说明文字衔接。
