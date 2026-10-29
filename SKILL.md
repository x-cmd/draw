# Skill: 用 draw 生成图表

把结构化数据变成可嵌入的 SVG 图表 URL——只需拼 URL,无需安装。返回的 SVG 内嵌完整数据(`<metadata>`),可解析还原;输出可缓存(`v=N` 钉版本,短链永久 immutable)。

```
https://x-cmd.com/draw?type=<图种>&labels=A,B,C&values=1,2,3
```

数据用扁平参数(如上,AI 可读、免转义);复杂数据可用 `?d=` + URL 编码 JSON(结构见文末)。标签含逗号时用重复参数 `labels=Q1, 2024&labels=Q2`。

## 按数据形状选图

| 数据形状 | type | 示例(可直接复制) |
|---|---|---|
| 占比 | `pie` | `type=pie&labels=TS,Py,Go&values=4821,2312,980` |
| 分类对比 | `bar` | `type=bar&labels=Mon,Tue&values=120,180` |
| 多系列对比 | `bar` | `type=bar&labels=Mon,Tue&series=a:12,18&series=b:9,10` |
| 排行/长标签 | `hbar` | `type=hbar&labels=TS,Py,Go&values=4821,2312,980` |
| 趋势 | `line` / `area` | `type=line&labels=Jan,Feb&series=a:120,180&series=b:80,90` |
| 多维评估 | `radar` | `type=radar&t=evil&labels=速度,稳定,生态&series=a:8,9,7&series=b:6,7,8` |
| 完成度/得分 | `gauge` | `type=gauge&title=Pass rate&value=87&max=100` |
| 相关性/分布 | `scatter` | `type=scatter&x=1,2,3&y=4,5,6` |
| 柱+线混合 | `combo` | `type=combo&labels=Mon,Tue&series=dl:120,180&line=growth:5,8` |
| 流向 | `sankey` | `type=sankey&labels=Ads,Web,Buy&links=Ads>Buy:30;Web>Buy:20` |
| 二维码 | `qr` | `type=qr&d=https://x-cmd.com` |

## 每图种要点

- **pie**:≤100 类(>9 自动并入 Other);`donut=0` 实心饼
- **bar**:≤30 组、≤6 系列;`stack=1` 堆叠;量级差悬殊时自动切百分比堆叠
- **hbar**:≤30 条,单系列(部分风格支持双系列,见风格表);`t=opendata` 支持 `ref=`/`reflabel=` 参考线
- **line / area**:≤60 点;多系列折线数值只标各线峰值(防拥挤)
- **radar**:3–12 维;多系列需 `t=evil`
- **gauge**:单值 `value=&max=`;多环 `labels=&values=`(值为百分比,≤8 环)
- **scatter**:≤200 点/系列,支持负值;重复 `x=`/`y=` 参数各成一系列
- **combo**:柱用 `series=`(单系列可 `values=`)、线用 `line=`;量级差 >5× 自动双 y 轴;支持 `stack=1`
- **sankey**:≤24 节点/60 链接,`links=A>B:30` 分号分隔,禁止环
- **qr**:`d=` 文本 ≤1000 字符;`fg`/`bg` 六位 hex(`#` 写成 `%23`);`title`/`unit` 为码下标注

## 通用参数

- `t` 风格(见下)/ `scheme=light|dark|auto` / `title=` / `unit=`
- `w=` / `h=` 尺寸(缺省用该风格规范画布,数据密集时自动微调;范围 200–1600 / 140–1200,短链 w 可至 120,qr 为 120–1000)
- `num=all|peak|none` 数值标注(pie/bar/hbar/line/area/scatter/combo;radar/gauge/sankey/qr 忽略)
- `v=N` 钉住版本,缓存 1 天(N 为 1..当前版本);不带 = 最新版(短缓存 300s)
- `format=png` 输出位图(配 `scale=1–3` 倍率;scheme 固化,缺省 light;仅内嵌拉丁字体子集,中文在 PNG 中无字形)

## 风格家族(可选 `t=`)

| 图种 | 可选家族(默认为各图种首个:pie=opendata、bar=evil、line=shadcn、area=evil,其余 base) |
|---|---|
| pie | `evil` `evil-mono` `market-mono` `progress` `revenue` |
| bar | `evil` `grid` |
| hbar | `opendata`(支持 `ref=`/`reflabel=`) `xcmd`(像素条,值为 %) `xcmd-issue`(双系列蝴蝶) `rank`(双系列实底+斜纹) |
| line | `evil` `evil-glow`(发光) `evil-mono` `opendata`(线端标签) |
| area | `star`(手绘) `pixel` `polka` `opendata`(支持 `subtitle=` `source=`) |
| radar | `evil`(支持多系列) `xcmd` |
| gauge | `gradient` `reliability` |
| sankey | `fund` `pipeline` |
| combo | `evil` |

## 长尾图种:`/draw/echarts`(echarts option 直渲)

核心 11 种外的图(热力图/箱线/烛台/旭日/漏斗/关系图/仪表盘…)直接把 echarts option 放进 `?d=`(URL 编码 JSON):

```
https://x-cmd.com/draw/echarts?d=%7B%22xAxis%22%3A%7B%22type%22%3A%22category%22%2C%22data%22%3A%5B%22A%22%2C%22B%22%5D%7D%2C%22yAxis%22%3A%7B%22type%22%3A%22value%22%7D%2C%22series%22%3A%5B%7B%22type%22%3A%22bar%22%2C%22data%22%3A%5B1%2C2%5D%7D%5D%7D
```

- 最简 option 即可出图(bar/line/scatter/boxplot 裸 option 自动补轴);`?d=` 之外共用 `w/h/t/scheme/v`
- 风格自动注入(系列色板/轴中性色/Inter 字体/明暗 auto),option 里显式写的样式恒优先;`?d=` ≤16000 字符
- 输出同嵌 `<metadata>`(option 原文,可解析还原);离线等价:`draw echarts '<option json>'`(文件/stdin 亦可,无 URL 长度限制)

## JSON 形态(`?d=`,URL 编码)

| 适用 | 结构 |
|---|---|
| 单系列(pie/bar/hbar/line/area/radar) | `{"title":"","data":[{"label":"A","value":1}]}` |
| 多系列(bar/line/area/radar) | `{"labels":["A","B"],"series":[{"name":"x","values":[1,2]}]}` |
| gauge 单值 | `{"value":87,"max":100}` |
| gauge 多环 | `{"max":100,"data":[{"label":"A","value":86}]}` |
| scatter | `{"points":[[1,4]]}` 或 `{"series":[{"name":"","points":[[1,4]]}]}` |
| combo | `{"labels":[],"series":[{"name":"","values":[]},{"name":"","values":[],"type":"line"}]}` |
| sankey | `{"labels":[],"links":[{"from":"A","to":"B","value":30}]}` |
| qr | `{"text":"https://...","fg":"#333333","bg":"#ffffff"}` |

## 创建短链(POST /draw?type=...)

body 用与 `?d=` 同一套 JSON(上表);`type`/`t`/`scheme`/`w`/`h`/`num` 放 URL,不进 body:

```sh
curl -X POST 'https://x-cmd.com/draw?type=pie&title=Stars' \
  -H 'content-type: application/json' \
  --data '{"data":[{"label":"TypeScript","value":4821},{"label":"Python","value":2312}]}'
# → 201 {"hash":"5168...","url":"https://x-cmd.com/draw/c/5168...","template":"pie"}
```

也接受 CSV(`text/csv`,首行表头,表头即系列名):

```
label,Desktop,Mobile
Mon,120,80
Tue,180,90
```

同数据重复 POST 返回同 hash(幂等,不重复存储)。

## 其他

- 错误返回 4xx 纯文本并附修正示例,按提示重拼即可
- POST 限 30 次/分钟/IP
- 文字绝不重叠(放不下会整层省略);数值必须 ≥0(scatter 可负)
- 无网络/离线场景:`npm install @x-cmd/draw` 后用 `draw(params)` 同步渲染(参数与 URL 完全一致),或 `npx @x-cmd/draw --type pie --labels A,B --values 3,2`(echarts 层:`npx @x-cmd/draw echarts '<option json>'`);自托管见仓库 README(`npm run serve` 起本地服务,`scripts/setup.sh` 一键部署 Cloudflare)
