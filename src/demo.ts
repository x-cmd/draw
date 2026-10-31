// 演示页:按图种分类 tab(仿设计师规范页布局)——每个风格变体一个工作区,
// 左侧图表预览、右侧双 URL 写法(扁平参数 / JSON ?d=)tab + 复制;明暗切换联动 ?scheme=。
interface Ex {
  name: string;
  flat: string;
  json?: string;
  hint: string;
}
interface Tab {
  type: string;
  label: string;
  icon: string;
  examples: Ex[];
}

const TABS: Tab[] = [
  {
    type: 'combo',
    label: '混合图',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20v-7h4v7M10 20V9h4v11"/><path d="m3 8 5-4 5 3 7-5"/></svg>',
    examples: [
      {
        name: '混合图 1 · evil 风(紫柱+绿线)',
        flat: 'type=combo&t=evil&labels=Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec&series=Revenue:42,58,41,62,54,78,61,82,59,68,72,91&line=Profit:18,24,16,29,22,35,27,39,25,31,33,43',
        json: 'type=combo&t=evil&d={"labels":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"series":[{"name":"Revenue","values":[42,58,41,62,54,78,61,82,59,68,72,91]},{"name":"Profit","values":[18,24,16,29,22,35,27,39,25,31,33,43],"type":"line"}]}',
        hint: '紫柱绿线各自量程,虚线网格+右上图例。',
      },
      {
        name: '混合图(柱+线同图)',
        flat: 'type=combo&title=Downloads&labels=Mon,Tue,Wed,Thu,Fri&series=draw:1200,1800,1500,2400,2100&series=qc:900,1000,1100,1150,1200&line=growth:5,8,6,12,10',
        json: 'type=combo&d={"labels":["Mon","Tue","Wed","Thu","Fri"],"series":[{"name":"draw","values":[1200,1800,1500,2400,2100]},{"name":"qc","values":[900,1000,1100,1150,1200]},{"name":"growth","values":[5,8,6,12,10],"type":"line"}]}',
        hint: '柱 series= + 线 line=;量级差 >5 倍自动双 y 轴。',
      },
    ],
  },
  {
    type: 'pie',
    label: '饼图',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M11 3a9 9 0 1 0 9 9h-9Z"/><path d="M14 3.5A7 7 0 0 1 20.5 10H14Z"/></svg>',
    examples: [
      {
        name: '饼图 1 · OpenData 风(标签圈外+编辑式标题)',
        flat: 'type=pie&title=Chrome%20holds%20the%20browser%20market&labels=Chrome,Safari,Firefox,Edge,Other&values=65,18,7,6,4',
        json: 'type=pie&d={"data":[{"label":"Chrome","value":65},{"label":"Safari","value":18},{"label":"Firefox","value":7},{"label":"Edge","value":6},{"label":"Other","value":4}],"title":"Chrome holds the browser market"}',
        hint: '全部标签置于圈外;≤100 类,>9 自动合并 Other。',
      },
      {
        name: '饼图 2 · Evil 风(圆角扇区+数值内标+底部图例)',
        flat: 'type=pie&t=evil&title=Browser%20market&labels=Chrome,Safari,Firefox,Edge,Other&values=275,200,187,173,90',
        json: 'type=pie&t=evil&d={"data":[{"label":"Chrome","value":275},{"label":"Safari","value":200},{"label":"Firefox","value":187},{"label":"Edge","value":173},{"label":"Other","value":90}],"title":"Browser market"}',
        hint: '圆角扇区、白缝分隔,数值直标环带。',
      },
      {
        name: '饼图 3 · Evil 外标风(引线+名值分色)',
        flat: 'type=pie&t=evil-mono&title=Browser%20market&labels=Chrome,Safari,Firefox,Edge,Other&values=275,200,187,173,90',
        json: 'type=pie&t=evil-mono&d={"data":[{"label":"Chrome","value":275},{"label":"Safari","value":200},{"label":"Firefox","value":187},{"label":"Edge","value":173},{"label":"Other","value":90}],"title":"Browser market"}',
        hint: '实心饼+引线外标,名称灰、数值墨。',
      },
      {
        name: '饼图 4 · Market Mono 风(灰阶+环心总计+两列图例)',
        flat: 'type=pie&t=market-mono&unit=B&title=Market%20share&labels=Skyline,Datawell,Cloudpeak,Taskbridge,Streamforge&values=27,21,13,21,12',
        json: 'type=pie&t=market-mono&d={"data":[{"label":"Skyline","value":27},{"label":"Datawell","value":21},{"label":"Cloudpeak","value":13},{"label":"Taskbridge","value":21},{"label":"Streamforge","value":12}],"title":"Market share","unit":"B"}',
        hint: '灰阶按份额深浅,图例带数值与占比。',
      },
      {
        name: '饼图 5 · Progress 风(点状进度环)',
        flat: 'type=pie&t=progress&unit=responses&title=Where%20the%20workday%20leaks&labels=Additional support requests,Inaccurate forecasts&values=48,67',
        json: 'type=pie&t=progress&d={"data":[{"label":"Additional support requests","value":48},{"label":"Inaccurate forecasts","value":67}],"title":"Where the workday leaks","unit":"responses"}',
        hint: '每行数据一个点阵环,环心大百分比。',
      },
      {
        name: '饼图 7 · Revenue 风(渐变扇区+虚线内圈+右图例)',
        flat: 'type=pie&t=revenue&unit=orders&title=Revenue&labels=Direct,Marketplace,Wholesale,Affiliate&values=52400,38900,24150,16300',
        json: 'type=pie&t=revenue&d={"data":[{"label":"Direct","value":52400},{"label":"Marketplace","value":38900},{"label":"Wholesale","value":24150},{"label":"Affiliate","value":16300}],"title":"Revenue","unit":"orders"}',
        hint: '扇区对角渐变,环心总计,右图例带数值。',
      },
      {
        name: '实心饼(donut=0)',
        flat: 'type=pie&donut=0&title=Share&labels=TS,Py,Go&values=48,23,9',
        json: 'type=pie&donut=0&d={"title":"Share","data":[{"label":"TS","value":48},{"label":"Py","value":23},{"label":"Go","value":9}]}',
        hint: '同一模板,一个参数切换形态。',
      },
    ],
  },
  {
    type: 'bar',
    label: '柱状图',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20V10h4v10M10 20V4h4v16M16 20v-7h4v7M2 20h20"/></svg>',
    examples: [
      {
        name: '柱状图 1 · evil 风(分组柱)',
        flat: 'type=bar&t=evil&labels=Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec&series=Desktop:34,87,51,63,45,78,39,92,65,53,80,27&series=Mobile:18,49,29,39,31,45,23,56,37,36,51,14',
        json: 'type=bar&t=evil&d={"labels":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"series":[{"name":"Desktop","values":[34,87,51,63,45,78,39,92,65,53,80,27]},{"name":"Mobile","values":[18,49,29,39,31,45,23,56,37,36,51,14]}]}',
        hint: '四角圆角柱+虚线网格+右上方块图例。',
      },
      {
        name: '柱状图 2 · grid 风(单元格柱)',
        flat: 'type=bar&t=grid&labels=00:00,02:00,04:00,06:00,08:00,10:00,12:00,14:00,16:00,18:00,20:00,22:00,00:00,02:00,04:00,06:00,08:00,10:00,12:00,14:00,16:00,18:00,20:00,22:00&values=3,2,1,1,2,2,3,5,7,9,10,11,10,12,11,10,9,8,7,6,5,4,3,2',
        json: 'type=bar&t=grid&d={"data":[{"label":"00:00","value":3},{"label":"02:00","value":2},{"label":"04:00","value":1},{"label":"06:00","value":1},{"label":"08:00","value":2},{"label":"10:00","value":2},{"label":"12:00","value":3},{"label":"14:00","value":5},{"label":"16:00","value":7},{"label":"18:00","value":9},{"label":"20:00","value":10},{"label":"22:00","value":11},{"label":"00:00","value":10},{"label":"02:00","value":12},{"label":"04:00","value":11},{"label":"06:00","value":10},{"label":"08:00","value":9},{"label":"10:00","value":8},{"label":"12:00","value":7},{"label":"14:00","value":6},{"label":"16:00","value":5},{"label":"18:00","value":4},{"label":"20:00","value":3},{"label":"22:00","value":2}]}',
        hint: '一格一个单位,自底向上点亮;表头直接给出总量与峰值。',
      },
      {
        name: '柱状图 · base 风(t=base,数值入柱)',
        flat: 'type=bar&t=base&title=Weekly downloads&labels=Mon,Tue,Wed,Thu,Fri&values=1200,1800,1500,2400,2100',
        json: 'type=bar&t=base&d={"title":"Weekly downloads","data":[{"label":"Mon","value":1200},{"label":"Tue","value":1800},{"label":"Wed","value":1500},{"label":"Thu","value":2400},{"label":"Fri","value":2100}]}',
        hint: '≤30 组;数值入柱,矮柱自动移柱顶上方,过密则整体不标。',
      },
      {
        name: '分组并排(多系列)',
        flat: 'type=bar&title=Weekly downloads&labels=Mon,Tue,Wed&series=draw:1200,1800,1500&series=quickchart:900,1000,1100',
        json: 'type=bar&d={"labels":["Mon","Tue","Wed"],"series":[{"name":"draw","values":[1200,1800,1500]},{"name":"quickchart","values":[900,1000,1100]}]}',
        hint: '≤6 系列;含逗号的标签用重复参数 labels=Q1, 2024&labels=Q2。',
      },
      {
        name: '堆叠柱(stack=1)',
        flat: 'type=bar&title=Traffic&stack=1&labels=Mon,Tue,Wed&series=direct:30,25,40&series=organic:20,35,25',
        json: 'type=bar&stack=1&d={"labels":["Mon","Tue","Wed"],"series":[{"name":"direct","values":[30,25,40]},{"name":"organic","values":[20,35,25]}]}',
        hint: '数值入柱段内;量级差过大时自动切百分比堆叠并在柱顶标总量。',
      },
    ],
  },
  {
    type: 'hbar',
    label: '水平柱状图',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5h10v3H4zM4 11h16v3H4zM4 17h7v3H4z"/></svg>',
    examples: [
      {
        name: '水平柱 1 · opendata 风(逐行配色+参考线)',
        flat: 'type=hbar&t=opendata&unit=Contrast%20ratio%20vs%20white&ref=4.5&reflabel=WCAG%20AA%20%C2%B7%204.5%3A1&labels=Slate Gray,Green,Red,Orange,Teal,Blue,Deep Purple&values=2.8,3.9,4.2,4.6,4.8,5.3,8.6',
        json: 'type=hbar&t=opendata&d={"unit":"Contrast ratio vs white","data":[{"label":"Slate Gray","value":2.8},{"label":"Green","value":3.9},{"label":"Red","value":4.2},{"label":"Orange","value":4.6},{"label":"Teal","value":4.8},{"label":"Blue","value":5.3},{"label":"Deep Purple","value":8.6}]}',
        hint: '竖虚线网格+数值内标;?ref= 画参考线,?reflabel= 配文案。',
      },
      {
        name: '水平柱 2 · xcmd 风(语言像素格)',
        flat: 'type=hbar&t=xcmd&title=%3C%2F%3E%20%E4%BB%A5%20C%20%E4%B8%BA%E4%B8%BB&labels=C,CHeader,Sh,其他&values=80.4,11.1,2.5,6.0',
        json: 'type=hbar&t=xcmd&d={"title":"</> 以 C 为主","data":[{"label":"C","value":80.4},{"label":"CHeader","value":11.1},{"label":"Sh","value":2.5},{"label":"其他","value":6}]}',
        hint: '值为百分比;不足一格保留部分填充。',
      },
      {
        name: '水平柱 3 · xcmd-issue 风(新建/关闭蝴蝶)',
        flat: 'type=hbar&t=xcmd-issue&labels=0-30d,30-60d,60-90d,90-180d,180-360d,360-720d&series=新建:2,1,12,5,7,7&series=关闭:2,1,9,4,5,6',
        json: 'type=hbar&t=xcmd-issue&d={"labels":["0-30d","30-60d","60-90d","90-180d","180-360d","360-720d"],"series":[{"name":"新建","values":[2,1,12,5,7,7]},{"name":"关闭","values":[2,1,9,4,5,6]}]}',
        hint: '双系列:左新建右关闭,数值直读。',
      },
      {
        name: '水平柱 4 · rank 风(实底+斜纹增益)',
        flat: 'type=hbar&t=rank&labels=GPT-6 (Astra),GPT-5.6 Sol,DeepSeek V4.1 Flash,Muse Spark 1.3,Claude Fable 5.1,Claude Opus 5,Kimi K3,GLM 5.3,GPT-5.6 Luna,Gemini 3.7 Flash&series=基础得分:35,31.4,20.3,31,31.9,34,24,20,22.4,29&series=搜索增益:35.3,35.3,45,34.3,29.1,25.3,32.3,35.3,32.3,25.3',
        json: 'type=hbar&t=rank&d={"labels":["GPT-6 (Astra)","GPT-5.6 Sol","DeepSeek V4.1 Flash","Muse Spark 1.3","Claude Fable 5.1","Claude Opus 5","Kimi K3","GLM 5.3","GPT-5.6 Luna","Gemini 3.7 Flash"],"series":[{"name":"基础得分","values":[35,31.4,20.3,31,31.9,34,24,20,22.4,29]},{"name":"搜索增益","values":[35.3,35.3,45,34.3,29.1,25.3,32.3,35.3,32.3,25.3]}]}',
        hint: '双系列:第一系列实色基础,第二系列斜纹增益。',
      },
      {
        name: '水平柱(排行场景,标签左值右)',
        flat: 'type=hbar&title=Stars&labels=TypeScript,Python,Go,Rust&values=4821,2312,980,645',
        json: 'type=hbar&d={"title":"Stars","data":[{"label":"TypeScript","value":4821},{"label":"Python","value":2312},{"label":"Go","value":980},{"label":"Rust","value":645}]}',
        hint: '≤30 条,仅单系列。',
      },
    ],
  },
  {
    type: 'line',
    label: '折线图',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m3 17 5-6 4 3 7-8 2 2"/><path d="M3 21h18"/></svg>',
    examples: [
      {
        name: '折线图 1 · shadcn 风(默认:虚线网格+空心点)',
        flat: 'type=line&title=Trend&labels=Jan,Feb,Mar,Apr,May,Jun&series=draw:20,27,25,32,30,38&series=qc:15,17,17,19,20,18',
        json: 'type=line&d={"title":"Trend","labels":["Jan","Feb","Mar","Apr","May","Jun"],"series":[{"name":"draw","values":[20,27,25,32,30,38]},{"name":"qc","values":[15,17,17,19,20,18]}]}',
        hint: '≤60 点;num=peak 仅标峰值,num=none 不标。',
      },
      {
        name: '折线图 2 · evil 风(直线+大点+右上图例)',
        flat: 'type=line&t=evil&labels=Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec&series=Desktop:524,902,663,749,587,420,690,905,730,590,388,262&series=Mobile:342,458,400,433,382,290,391,467,405,362,299,218',
        json: 'type=line&t=evil&d={"labels":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"series":[{"name":"Desktop","values":[524,902,663,749,587,420,690,905,730,590,388,262]},{"name":"Mobile","values":[342,458,400,433,382,290,391,467,405,362,299,218]}]}',
        hint: '直线段、实心大点、基线刻度点。',
      },
      {
        name: '折线图 3 · evil-glow 风(渐变发光)',
        flat: 'type=line&t=evil-glow&labels=Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec&series=Payouts:430,430,470,530,670,770,700,730,810,860,880,910&series=Pending:600,540,500,380,320,210,250,230,180,150,130,110',
        json: 'type=line&t=evil-glow&d={"labels":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"series":[{"name":"Payouts","values":[430,430,470,530,670,770,700,730,810,860,880,910]},{"name":"Pending","values":[600,540,500,380,320,210,250,230,180,150,130,110]}]}',
        hint: '模糊底层+水平渐变描边。',
      },
      {
        name: '折线图 4 · evil-mono 风(当前 vs 上周)',
        flat: 'type=line&t=evil-mono&labels=Mon,Tue,Wed,Thu,Fri,Sat&series=this week:34,40,42,38,30,44&series=last week:44,49,43,35,31,52',
        json: 'type=line&t=evil-mono&d={"labels":["Mon","Tue","Wed","Thu","Fri","Sat"],"series":[{"name":"this week","values":[34,40,42,38,30,44]},{"name":"last week","values":[44,49,43,35,31,52]}]}',
        hint: '当前实线墨色,对比系列虚线灰。',
      },
      {
        name: '折线图 5 · opendata 风(线端标签+Y轴标题)',
        flat: 'type=line&t=opendata&title=Python%20overtook%20Java%20around%202018&labels=2015,2016,2017,2018,2019,2020,2021,2022&series=Python:28,33,40,52,62,70,78,84&series=Java:72,70,65,58,52,48,45,42&series=JavaScript:45,48,50,52,54,55,56,53',
        json: 'type=line&t=opendata&d={"labels":["2015","2016","2017","2018","2019","2020","2021","2022"],"series":[{"name":"Python","values":[28,33,40,52,62,70,78,84]},{"name":"Java","values":[72,70,65,58,52,48,45,42]},{"name":"JavaScript","values":[45,48,50,52,54,55,56,53]}],"title":"Python overtook Java around 2018"}',
        hint: '线端系列名、实网格、旋转 Y 轴标题。',
      },
    ],
  },
  {
    type: 'area',
    label: '面积图',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 20V4M3 20h18"/><path d="m4 16 5-6 4 3 7-8v15H4Z" fill="currentColor" fill-opacity=".12"/><path d="m4 16 5-6 4 3 7-8"/></svg>',
    examples: [
      {
        name: '面积图 1 · evil 风(默认:双系列虚线面积)',
        flat: 'type=area&labels=Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec&series=Desktop:342,876,512,630,458,782,394,924,646,533,806,270&series=Mobile:185,491,291,391,309,448,233,558,367,358,515,148',
        json: 'type=area&d={"labels":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"series":[{"name":"Desktop","values":[342,876,512,630,458,782,394,924,646,533,806,270]},{"name":"Mobile","values":[185,491,291,391,309,448,233,558,367,358,515,148]}]}',
        hint: '双系列渐变面积+虚线描边+大实心点+右上方块图例。',
      },
      {
        name: '面积图 2 · GitHub Star 风(手绘)',
        flat: 'type=area&t=star&title=Star%20History&unit=stars&labels=Dec,Jan,Feb,Mar,Apr,May,Jun&values=120,300,520,900,1300,1500,1750',
        json: 'type=area&t=star&d={"data":[{"label":"Dec","value":120},{"label":"Jan","value":300},{"label":"Feb","value":520},{"label":"Mar","value":900},{"label":"Apr","value":1300},{"label":"May","value":1500},{"label":"Jun","value":1750}],"title":"Star History","unit":"stars"}',
        hint: '手绘抖动滤镜+手写字体+黑色粗坐标轴+端点标注。',
      },
      {
        name: '面积图 3 · pixel 风(像素 GitHub Star)',
        flat: 'type=area&t=pixel&unit=GitHub%20Stars&labels=Dec%202024,Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec%202025,Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep&values=0,18,52,98,160,245,360,480,610,735,850,960,1060,1140,1210,1270,1320,1360,1395,1420,1440,1458',
        json: 'type=area&t=pixel&d={"unit":"GitHub Stars","data":[{"label":"Dec 2024","value":0},{"label":"Jan","value":18},{"label":"Feb","value":52},{"label":"Mar","value":98},{"label":"Apr","value":160},{"label":"May","value":245},{"label":"Jun","value":360},{"label":"Jul","value":480},{"label":"Aug","value":610},{"label":"Sep","value":735},{"label":"Oct","value":850},{"label":"Nov","value":960},{"label":"Dec 2025","value":1060},{"label":"Jan","value":1140},{"label":"Feb","value":1210},{"label":"Mar","value":1270},{"label":"Apr","value":1320},{"label":"May","value":1360},{"label":"Jun","value":1395},{"label":"Jul","value":1420},{"label":"Aug","value":1440},{"label":"Sep","value":1458}]}',
        hint: '累计量线性插值到 100 列像素格;双层发光轨迹+手写标注。',
      },
      {
        name: '面积图 4 · polka 风(波点 GitHub Star 对比)',
        flat: 'type=area&t=polka&labels=Dec%202024,Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec%202025,Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep&series=x-cmd/x-cmd:0,18,52,98,160,245,360,480,610,735,850,960,1060,1140,1210,1270,1320,1360,1395,1420,1440,1458&series=x-cmd/llm:0,8,22,48,82,126,190,270,360,455,545,630,705,770,825,870,905,932,951,965,978,986',
        json: 'type=area&t=polka&d={"labels":["Dec 2024","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec 2025","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep"],"series":[{"name":"x-cmd/x-cmd","values":[0,18,52,98,160,245,360,480,610,735,850,960,1060,1140,1210,1270,1320,1360,1395,1420,1440,1458]},{"name":"x-cmd/llm","values":[0,8,22,48,82,126,190,270,360,455,545,630,705,770,825,870,905,932,951,965,978,986]}]}',
        hint: '阶梯面积+波点 pattern 填充,圆圈图例+大数值。',
      },
      {
        name: '面积图 5 · opendata 风(浓渐变+编辑式标题)',
        flat: 'type=area&t=opendata&title=Apple%20Shares%20Hit%20Record%20After%20AI-Fuelled%20Rally&subtitle=AAPL%20monthly%20closing%20price%2C%20Jan%202023%20to%20Dec%202024&source=Source%3A%20Nasdaq%20historical%20data&unit=Share%20Price&labels=Jan%2023,Feb%2023,Mar%2023,Apr%2023,May%2023,Jun%2023,Jul%2023,Aug%2023,Sep%2023,Oct%2023,Nov%2023,Dec%2023,Jan%2024,Feb%2024,Mar%2024,Apr%2024,May%2024,Jun%2024,Jul%2024,Aug%2024,Sep%2024,Oct%2024,Nov%2024,Dec%2024&values=130,147,125,170,177,194,196,188,171,171,190,193,186,188,171,170,192,211,222,227,226,226,237,243',
        json: 'type=area&t=opendata&d={"data":[{"label":"Jan 23","value":130},{"label":"Feb 23","value":147},{"label":"Mar 23","value":125},{"label":"Apr 23","value":170},{"label":"May 23","value":177},{"label":"Jun 23","value":194},{"label":"Jul 23","value":196},{"label":"Aug 23","value":188},{"label":"Sep 23","value":171},{"label":"Oct 23","value":171},{"label":"Nov 23","value":190},{"label":"Dec 23","value":193},{"label":"Jan 24","value":186},{"label":"Feb 24","value":188},{"label":"Mar 24","value":171},{"label":"Apr 24","value":170},{"label":"May 24","value":192},{"label":"Jun 24","value":211},{"label":"Jul 24","value":222},{"label":"Aug 24","value":227},{"label":"Sep 24","value":226},{"label":"Oct 24","value":226},{"label":"Nov 24","value":237},{"label":"Dec 24","value":243}],"title":"Apple Shares Hit Record After AI-Fuelled Rally","subtitle":"AAPL monthly closing price, Jan 2023 to Dec 2024","source":"Source: Nasdaq historical data","unit":"Share Price"}',
        hint: '浓渐变+副标题/来源脚注+均值参考线+末点标注,Y 轴按数据区间。',
      },
    ],
  },
  {
    type: 'radar',
    label: '雷达图',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m12 3 8.5 6.2-3.2 10H6.7l-3.2-10Z"/><path d="m12 8 3.8 2.8-1.5 4.4H9.7l-1.5-4.4Z"/></svg>',
    examples: [
      {
        name: '雷达图 1 · evil 风(双系列+轴端数值)',
        flat: 'type=radar&t=evil&labels=JavaScript,Python,CSS,Node.js,React,TypeScript&series=Desktop:58,72,70,76,68,84&series=Mobile:34,48,44,81,38,66',
        json: 'type=radar&t=evil&d={"labels":["JavaScript","Python","CSS","Node.js","React","TypeScript"],"series":[{"name":"Desktop","values":[58,72,70,76,68,84]},{"name":"Mobile","values":[34,48,44,81,38,66]}]}',
        hint: '0-100 量程,轴端标签内嵌各系列数值。',
      },
      {
        name: '雷达图 2 · xcmd 风(手绘五维)',
        flat: 'type=radar&t=xcmd&labels=性能,易用性,功能,可移植性,可靠性&values=68,54,62,76,73',
        json: 'type=radar&t=xcmd&d={"data":[{"label":"性能","value":68},{"label":"易用性","value":54},{"label":"功能","value":62},{"label":"可移植性","value":76},{"label":"可靠性","value":73}]}',
        hint: '手写体维度标签+方形顶点标记。',
      },
      {
        name: '雷达图(3-12 维)',
        flat: 'type=radar&title=Skills&labels=TS,Rust,Go,Python,SQL&values=90,60,45,80,70',
        json: 'type=radar&d={"title":"Skills","data":[{"label":"TS","value":90},{"label":"Rust","value":60},{"label":"Go","value":45},{"label":"Python","value":80},{"label":"SQL","value":70}]}',
        hint: '3-12 维。',
      },
    ],
  },
  {
    type: 'gauge',
    label: '仪表盘',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4.2 18a9 9 0 1 1 15.6 0"/><path d="m12 12 4-4"/><circle cx="12" cy="12" r="1.5"/></svg>',
    examples: [
      {
        name: '仪表盘 1 · 半圆多环(默认)',
        flat: 'type=gauge&labels=Chrome,Safari,Firefox,Edge,Other&values=86,72,64,58,31',
        json: 'type=gauge&d={"max":100,"data":[{"label":"Chrome","value":86},{"label":"Safari","value":72},{"label":"Firefox","value":64},{"label":"Edge","value":58},{"label":"Other","value":31}]}',
        hint: '每行一环,值为百分比;单值 value=/max= 渲染单环。',
      },
      {
        name: '仪表盘 2 · gradient 风(渐变多环)',
        flat: 'type=gauge&t=gradient&labels=Chrome,Safari,Firefox,Edge,Other&values=88,76,69,61,43',
        json: 'type=gauge&t=gradient&d={"max":100,"data":[{"label":"Chrome","value":88},{"label":"Safari","value":76},{"label":"Firefox","value":69},{"label":"Edge","value":61},{"label":"Other","value":43}]}',
        hint: '整圆环按百分比点亮,环环双色渐变。',
      },
      {
        name: '可靠性评分(四分区环+底部刻度条,规范饼图 6)',
        flat: 'type=gauge&t=reliability&title=Delivery%20Reliability&value=842&max=1000',
        json: 'type=gauge&t=reliability&d={"value":842,"max":1000,"title":"Delivery Reliability"}',
        hint: '红/黄/青柠/绿四区,中心分值+区判词。',
      },
    ],
  },
  {
    type: 'scatter',
    label: '散点图',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 3v17h17"/><circle cx="9" cy="14" r="1.5"/><circle cx="14" cy="9" r="1.5"/><circle cx="18" cy="14" r="1.5"/><circle cx="11" cy="6" r="1.5"/></svg>',
    examples: [
      {
        name: '散点图 1 · 双系列对比(规范款)',
        flat: 'type=scatter&x=-18,-14,-11,-8,-5,-2,2,5,8,11,15,18&x=-17,-13,-10,-6,-3,1,4,7,10,13,16,19&y=-8,4,-2,12,8,19,14,25,18,31,27,39&y=15,10,22,16,28,23,34,30,42,38,49,44',
        json: 'type=scatter&d={"series":[{"name":"Current","points":[[-18,-8],[-14,4],[-11,-2],[-8,12],[-5,8],[-2,19],[2,14],[5,25],[8,18],[11,31],[15,27],[18,39]]},{"name":"Baseline","points":[[-17,15],[-13,10],[-10,22],[-6,16],[-3,28],[1,23],[4,34],[7,30],[10,42],[13,38],[16,49],[19,44]]}]}',
        hint: '重复 x=/y= 各为一组系列;深浅蓝区分,完整双数值轴。',
      },
      {
        name: '散点图(双数值轴)',
        flat: 'type=scatter&title=Latency vs load&x=10,20,30,40,50,60&y=5,8,7,12,18,30',
        json: 'type=scatter&d={"title":"Latency vs load","points":[[10,5],[20,8],[30,7],[40,12],[50,18],[60,30]]}',
        hint: '≤200 点/系列;支持负值;默认不标数值。',
      },
    ],
  },

  {
    type: 'sankey',
    label: '桑基图',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 4h4v5H3zM17 3h4v5h-4zM17 16h4v5h-4zM3 15h4v5H3z"/><path d="M7 6.5c5 0 5-1 10-1M7 17.5c5 0 5 1 10 1M7 6.5c6 0 4 12 10 12M7 17.5c6 0 4-12 10-12"/></svg>',
    examples: [
      {
        name: '桑基图 1 · 基础款(营销漏斗)',
        flat: 'type=sankey&labels=Organic Search,Paid Ads,Social Media,Landing Page,Product Page,Cart,Bounced,Purchase&links=Organic Search>Landing Page:42000;Paid Ads>Landing Page:28000;Social Media>Landing Page:18000;Landing Page>Product Page:52000;Landing Page>Bounced:36000;Product Page>Cart:31000;Product Page>Bounced:21000;Cart>Purchase:24000;Cart>Bounced:7000',
        json: 'type=sankey&d={"labels":["Organic Search","Paid Ads","Social Media","Landing Page","Product Page","Cart","Bounced","Purchase"],"links":[{"from":"Organic Search","to":"Landing Page","value":42000},{"from":"Paid Ads","to":"Landing Page","value":28000},{"from":"Social Media","to":"Landing Page","value":18000},{"from":"Landing Page","to":"Product Page","value":52000},{"from":"Landing Page","to":"Bounced","value":36000},{"from":"Product Page","to":"Cart","value":31000},{"from":"Product Page","to":"Bounced","value":21000},{"from":"Cart","to":"Purchase","value":24000},{"from":"Cart","to":"Bounced","value":7000}]}',
        hint: '节点高∝数值;labels= 列节点,links=A>B:30(分号分隔)。左右外置标签直读数值。',
      },
      {
        name: '桑基图 2 · fund 风(Fund Allocation)',
        flat: 'type=sankey&t=fund&title=Where%20the%20fund%20flows&unit=Quarter%20to%20date&labels=Inflow,Equities,Bonds,Cash,Growth,Income,Reserve&links=Inflow>Equities:78000;Inflow>Bonds:46000;Inflow>Cash:24000;Equities>Growth:52000;Equities>Income:26000;Bonds>Income:19000;Bonds>Reserve:27000;Cash>Growth:9000;Cash>Reserve:15000',
        json: 'type=sankey&t=fund&d={"title":"Where the fund flows","unit":"Quarter to date","labels":["Inflow","Equities","Bonds","Cash","Growth","Income","Reserve"],"links":[{"from":"Inflow","to":"Equities","value":78000},{"from":"Inflow","to":"Bonds","value":46000},{"from":"Inflow","to":"Cash","value":24000},{"from":"Equities","to":"Growth","value":52000},{"from":"Equities","to":"Income","value":26000},{"from":"Bonds","to":"Income","value":19000},{"from":"Bonds","to":"Reserve","value":27000},{"from":"Cash","to":"Growth","value":9000},{"from":"Cash","to":"Reserve","value":15000}]}',
        hint: '盒节点标签内置;流带按源→目标渐变;表尾三统计。',
      },
      {
        name: '桑基图 3 · pipeline 风(Revenue Pipeline)',
        flat: 'type=sankey&t=pipeline&labels=Wholesale,Retail,Services,Licensing,Expansion,Reserve,Support,Tooling&links=Wholesale>Expansion:46220;Retail>Expansion:6420;Retail>Reserve:25060;Services>Reserve:21650;Services>Support:6690;Licensing>Support:5780;Licensing>Tooling:9180',
        json: 'type=sankey&t=pipeline&d={"labels":["Wholesale","Retail","Services","Licensing","Expansion","Reserve","Support","Tooling"],"links":[{"from":"Wholesale","to":"Expansion","value":46220},{"from":"Retail","to":"Expansion","value":6420},{"from":"Retail","to":"Reserve","value":25060},{"from":"Services","to":"Reserve","value":21650},{"from":"Services","to":"Support","value":6690},{"from":"Licensing","to":"Support","value":5780},{"from":"Licensing","to":"Tooling","value":9180}]}',
        hint: '入流蓝系/出流红系渐变;中央渐隐面板显示管线总额。',
      },
    ],
  },
  {
    type: 'qr',
    label: '二维码',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM15 14h2v2h-2zM19 14h2v4h-2zM14 19h4v2h-4zM20 20h1v1h-1z"/></svg>',
    examples: [
      {
        name: '二维码 1 · 简洁蓝色(规范款)',
        flat: 'type=qr&d=https://x-cmd.com/draw&title=x-cmd.com&unit=%E6%89%AB%E7%A0%81%E6%89%93%E5%BC%80%E5%9B%BE%E8%A1%A8%E6%9C%8D%E5%8A%A1',
        hint: '高对比蓝模块+白卡静区;title/unit 作卡下标题与副标题。',
      },
      {
        name: '二维码(d 直接跟文本,自配色)',
        flat: 'type=qr&d=https://x-cmd.com/draw&fg=%236366f1',
        hint: 'd=文本;fg/bg 控制配色。',
      },
    ],
  },
];

// base = 服务路径前缀('/draw' 或自部署根路径 '');页内所有示例 URL 随之生成
export function indexHandler(base: string): Response {
  const ep = (q: string): string => base + '?' + q;

  const h = (s: string): string =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const enc = (q: string): string => q.replace(/ /g, '%20').replace(/#/g, '%23').replace(/"/g, '%22');


  const copyIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>';
  const infoIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>';

  const tabsNav = TABS.map(
    (t) =>
      `<button class="tab" role="tab" aria-selected="false" data-chart="${t.type}">${t.icon}${h(t.label)}</button>`,
  ).join('');

  const sections = TABS.map((t) =>
    t.examples
      .map((ex) => {
        const hasJson = !!ex.json;
        return `<section class="workspace" data-type="${t.type}" hidden>
  <article class="preview">
    <div class="panel-head"><h2 class="panel-title">${h(ex.name)}</h2></div>
    <div class="chart-stage"><img class="chart-asset" alt="${h(ex.name)}" data-src="${h(ep(enc(ex.flat)))}"></div>
  </article>
  <aside class="code-panel">
    <div class="panel-head"><h2 class="panel-title">URL</h2><div style="display:flex;gap:6px"><button class="make-short" type="button" aria-label="生成短链">${copyIcon}生成短链</button><button class="copy-all" type="button" aria-label="复制链接">${copyIcon}复制链接</button></div></div>
    <div class="code-box">
      <div class="code-tabs"><button class="code-tab active" data-format="flat">扁平参数</button>${
        hasJson ? '<button class="code-tab" data-format="json">JSON</button>' : ''
      }</div>
      <div class="code-view active" data-format="flat" data-url="${h(ep(enc(ex.flat)))}"><pre>${h(ep(ex.flat))}</pre></div>
      ${
        hasJson
          ? `<div class="code-view" data-format="json" data-url="${h(ep(enc(ex.json!)))}"><pre>${h(ep(ex.json!))}</pre></div>`
          : ''
      }
    </div>
    <p class="hint">${infoIcon}${h(ex.hint)}</p>
  </aside>
</section>`;
      })
      .join('\n'),
  ).join('\n');

  const html = `<!doctype html>
<html lang="zh-CN" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>draw — SVG chart endpoint</title>
<style>
:root{--page:#f8f9fb;--surface:#fff;--chart-bg:#fff;--ink:#17191d;--muted:#626873;--faint:#666c76;--line:#e4e7ec;--line-strong:#d8dce3;--accent:#1858d2;--shadow:0 18px 48px rgba(24,31,46,.07);--radius:20px}
html[data-theme=dark]{--page:#0a0a0a;--surface:#141516;--chart-bg:#0e0f11;--ink:#f3f4f6;--muted:#969ba5;--faint:#666b74;--line:#292b2f;--line-strong:#34373c;--accent:#579dff;--shadow:0 22px 60px rgba(0,0,0,.22)}
*{box-sizing:border-box}
html{color-scheme:light;background:var(--page)}
html[data-theme=dark]{color-scheme:dark}
body{margin:0;min-width:320px;color:var(--ink);background:var(--page);font-family:Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased;transition:background-color .25s ease,color .25s ease}
button{font:inherit}
button:focus-visible{outline:3px solid color-mix(in srgb,var(--accent) 30%,transparent);outline-offset:2px}
.shell{width:min(1440px,calc(100% - 64px));margin:0 auto;padding:22px 0 36px}
header{display:flex;align-items:center;justify-content:space-between;gap:24px;min-height:48px}
.brand{display:flex;align-items:center;gap:12px;font-size:15px;font-weight:760;letter-spacing:-.02em}
.brand-mark{display:grid;grid-template-columns:repeat(3,5px);align-items:end;gap:3px;width:28px;height:28px;padding:6px;border-radius:8px;color:#fff;background:var(--ink)}
.brand-mark i{display:block;background:currentColor;border-radius:2px}
.brand-mark i:nth-child(1){height:7px;opacity:.62}
.brand-mark i:nth-child(2){height:12px;opacity:.8}
.brand-mark i:nth-child(3){height:16px}
.brand small{margin-left:4px;color:var(--muted);font-size:12px;font-weight:560}
.theme-toggle{position:relative;display:flex;align-items:center;justify-content:space-between;width:68px;height:36px;padding:5px 7px;border:1px solid var(--line);border-radius:999px;color:var(--muted);background:var(--surface);cursor:pointer;box-shadow:0 4px 16px rgba(24,31,46,.04)}
.theme-toggle svg{position:relative;z-index:1;width:15px;height:15px}
.toggle-dot{position:absolute;left:4px;top:4px;width:26px;height:26px;border-radius:50%;background:var(--ink);transition:transform .25s ease}
html[data-theme=dark] .toggle-dot{transform:translateX(32px)}
html[data-theme=light] .sun,html[data-theme=dark] .moon{color:var(--surface)}
.intro{margin:40px 0 26px}
.intro p{max-width:720px;margin:0;color:var(--muted);font-size:14px;line-height:1.75}
.intro code{background:var(--surface);border:1px solid var(--line);border-radius:4px;padding:1px 5px;font-size:12px}
.tabs-wrap{position:relative;min-width:0;margin:0 0 14px;overflow:hidden}
.tabs-wrap::after{content:"";position:absolute;right:0;top:0;width:36px;height:100%;pointer-events:none;background:linear-gradient(90deg,transparent,var(--page))}
.tabs{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding-right:28px}
.tabs::-webkit-scrollbar{display:none}
.tab{flex:0 0 auto;display:inline-flex;align-items:center;gap:8px;min-height:40px;padding:0 16px;border:1px solid transparent;border-radius:10px;color:var(--muted);background:transparent;cursor:pointer;font-size:13px;font-weight:650;transition:.2s ease}
.tab:hover{color:var(--ink);background:var(--surface)}
.tab[aria-selected=true]{color:var(--ink);border-color:var(--line);background:var(--surface);box-shadow:0 5px 18px rgba(20,29,47,.05)}
.tab svg{width:15px;height:15px}
.workspace{display:grid;grid-template-columns:minmax(0,1.65fr) minmax(340px,.75fr);gap:0;align-items:stretch;border:1px solid var(--line);border-radius:var(--radius);background:var(--surface);overflow:hidden;box-shadow:var(--shadow)}
.workspace[hidden]{display:none}
.workspace + .workspace{margin-top:14px}
.preview{display:flex;min-width:0;flex-direction:column;min-height:440px;border-right:1px solid var(--line)}
.panel-head{display:flex;align-items:center;justify-content:space-between;gap:20px;min-height:52px;padding:14px 20px 8px}
.panel-title{margin:0;font-size:15px;line-height:1.35;letter-spacing:-.015em}
.chart-stage{position:relative;display:grid;place-items:center;flex:1;min-height:330px;margin:0 14px 14px;padding:14px;border-radius:12px;overflow:hidden;background:var(--chart-bg)}
.chart-asset{position:relative;display:block;width:100%;height:auto;max-height:430px}
.code-panel{display:flex;min-width:0;flex-direction:column;min-height:440px}
.code-panel .panel-head{border-bottom:1px solid var(--line)}
.copy-all,.make-short{display:inline-flex;align-items:center;gap:7px;height:34px;padding:0 11px;border:1px solid var(--line-strong);border-radius:8px;color:var(--ink);background:var(--surface);cursor:pointer;font-size:12px;font-weight:670;transition:.2s ease}
.copy-all:hover,.make-short:hover{border-color:var(--accent);color:var(--accent)}
.copy-all svg,.make-short svg{width:14px;height:14px}
.make-short:disabled{opacity:.55;cursor:default}
.code-box{position:relative;margin:8px 14px 12px;border:1px solid var(--line);border-radius:12px;overflow:hidden;background:var(--surface)}
.code-tabs{display:flex;gap:4px;padding:5px;border-bottom:1px solid var(--line)}
.code-tab{padding:5px 8px;border:0;border-radius:6px;color:var(--muted);background:transparent;cursor:pointer;font-size:10px;font-weight:700}
.code-tab.active{color:var(--ink);background:var(--surface);box-shadow:0 1px 5px rgba(0,0,0,.06)}
.code-view{display:none}
.code-view.active{display:block}
pre{min-height:98px;margin:0;padding:10px 12px 12px;overflow:auto;color:var(--muted);font:10px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap;word-break:break-all}
.hint{display:flex;align-items:center;gap:7px;margin:0 16px 13px;color:var(--faint);font-size:10px;line-height:1.45}
.hint svg{flex:0 0 auto;width:13px;height:13px}
.toast{position:fixed;left:50%;bottom:26px;z-index:10;display:flex;align-items:center;gap:8px;padding:11px 15px;border:1px solid var(--line);border-radius:10px;color:var(--ink);background:var(--surface);box-shadow:0 16px 50px rgba(0,0,0,.16);font-size:12px;font-weight:650;opacity:0;transform:translate(-50%,12px);pointer-events:none;transition:.22s ease}
.toast.show{opacity:1;transform:translate(-50%,0)}
.toast b{display:grid;place-items:center;width:17px;height:17px;border-radius:50%;color:#fff;background:#35b67a;font-size:10px}
@media (max-width:920px){.shell{width:min(100% - 36px,760px);padding-top:20px}.workspace{grid-template-columns:1fr}.preview,.code-panel{min-height:0}.preview{border-right:0;border-bottom:1px solid var(--line)}.chart-stage{min-height:410px}}
@media (max-width:620px){.shell{width:calc(100% - 24px);padding-bottom:28px}.workspace{border-radius:14px}.panel-head{padding:20px 18px 15px}.chart-stage{min-height:325px;margin:0 10px 10px;padding:8px}.code-box{margin:8px 10px 14px}.hint{margin:0 14px 16px}}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{transition-duration:.01ms !important}}
</style>
</head>
<body>
<div class="shell">
  <header>
    <div class="brand"><span class="brand-mark"><i></i><i></i><i></i></span>draw<small>SVG chart endpoint</small></div>
    <button class="theme-toggle" type="button" aria-label="切换明暗模式" aria-pressed="false">
      <span class="toggle-dot" aria-hidden="true"></span>
      <svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/></svg>
      <svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20 15.2A8.5 8.5 0 0 1 8.8 4a8.5 8.5 0 1 0 11.2 11.2Z"/></svg>
    </button>
  </header>
  <div class="intro">
    <p>单端点 <code>GET ${h(base || '/')}?type=...</code>,两种数据写法:<b>扁平参数</b>(URL 永远可读)与 <code>?d=</code> JSON。
    通用参数:<code>t=</code>风格、<code>scheme=dark|light</code>(默认跟随系统)、<code>num=all|peak|none</code> 数值标注、<code>v=1</code> 冻结版本、<code>w/h=</code> 尺寸。
    <code>POST ${h(base || '/')}?type=...</code> 创建永久短链;每个 SVG 内嵌 <code>&lt;metadata&gt;</code>,全部真文本。</p>
  </div>
  <nav class="tabs-wrap" aria-label="图表类型">
    <div class="tabs" role="tablist">${tabsNav}</div>
  </nav>
  <main id="sections">
${sections}
  </main>
</div>
<div class="toast" role="status" aria-live="polite"><b>✓</b><span id="toastText">已复制</span></div>
<script>
(function () {
  var tabs = document.querySelectorAll('.tab');
  var sections = document.querySelectorAll('.workspace');
  var toggle = document.querySelector('.theme-toggle');
  var scheme = 'light';
  var toastTimer;

  function withScheme(url) {
    return url + (url.indexOf('?') >= 0 ? '&' : '?') + 'scheme=' + scheme;
  }
  // 手机:图表默认按桌面宽度(960)出,塞进 ~328px 的卡片只有 0.34 倍 ——
  // 12px 的字缩成 4px,一片糊。窄屏把画布缩到屏宽(矢量,字就正常大了)。
  var NARROW =
    window.matchMedia && window.matchMedia('(max-width: 720px)').matches
      ? Math.min(Math.round(window.innerWidth), 640)
      : 0;
  function finalUrl(url) {
    var u = url;
    if (NARROW && !/[?&]w=/.test(u)) u += (u.indexOf('?') >= 0 ? '&' : '?') + 'w=' + NARROW;
    return withScheme(u);
  }
  function loadImg(img) {
    if (!img.getAttribute('src')) img.setAttribute('src', finalUrl(img.dataset.src));
  }
  function setScheme(next) {
    scheme = next;
    document.documentElement.dataset.theme = next;
    document.querySelectorAll('img[data-src]').forEach(function (img) {
      if (img.getAttribute('src')) img.setAttribute('src', finalUrl(img.dataset.src));
    });
  }
  function selectTab(type, push) {
    tabs.forEach(function (t) { t.setAttribute('aria-selected', String(t.dataset.chart === type)); });
    sections.forEach(function (s) {
      var show = s.dataset.type === type;
      s.hidden = !show;
      if (show) s.querySelectorAll('img[data-src]').forEach(loadImg);
    });
    if (push) {
      var url = new URL(location.href);
      url.searchParams.set('tab', type);
      history.pushState({ type: type }, '', url);
    }
  }
  function toast(msg) {
    document.getElementById('toastText').textContent = msg;
    var el = document.querySelector('.toast');
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 1800);
  }
  function copyText(value) {
    (navigator.clipboard ? navigator.clipboard.writeText(value) : Promise.reject()).catch(function () {
      var area = document.createElement('textarea');
      area.value = value;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.append(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }).then(function () { toast('已复制链接'); }, function () { toast('已复制链接'); });
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      selectTab(t.dataset.chart, true);
      t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  });
  addEventListener('popstate', function () {
    selectTab(new URLSearchParams(location.search).get('tab') || 'combo');
  });
  document.querySelectorAll('.code-box').forEach(function (box) {
    var btns = box.querySelectorAll('.code-tab');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.classList.toggle('active', x === b); });
        box.querySelectorAll('.code-view').forEach(function (v) {
          v.classList.toggle('active', v.dataset.format === b.dataset.format);
        });
      });
    });
  });
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.copy-all');
    if (!btn) return;
    var view = btn.closest('.code-panel').querySelector('.code-view.active');
    if (view) copyText(location.origin + view.dataset.url);
  });
  // 生成短链:POST 示例的 JSON 形态 → /draw/c/<hash>(同数据幂等,重复点击同链接)
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.make-short');
    if (!btn) return;
    var panel = btn.closest('.code-panel');
    var jsonView = panel.querySelector('.code-view[data-format="json"]');
    if (!jsonView) { toast('该示例无 JSON 形态,暂不能建短链'); return; }
    var label = btn.textContent;
    btn.textContent = '创建中…';
    btn.disabled = true;
    var raw = jsonView.dataset.url; // "type=pie&d=%7B…%7D"(URL 编码)
    var i = raw.indexOf('&d=');
    var query = i >= 0 ? raw.slice(0, i) : 'type=pie';
    var body = i >= 0 ? decodeURIComponent(raw.slice(i + 3)) : '{}';
    fetch(query, { method: 'POST', headers: { 'content-type': 'application/json' }, body: body }) // query 已含 base? 前缀(data-url 原样)
      .then(function (r) { return r.ok ? r.json() : r.text().then(function (t) { throw new Error(t || r.status); }); })
      .then(function (d) {
        copyText(d.url);
        // 模板字符串里正则的 \/ 转义会被吃掉(曾致全页 JS 解析失败),用 split 取路径段
        toast('短链已复制:' + d.url.split('/').slice(3).join('/'));
      })
      .catch(function (err) { toast('创建失败:' + String(err.message || err).slice(0, 60)); })
      .then(function () { btn.textContent = label; btn.disabled = false; });
  });
  toggle.addEventListener('click', function () {
    setScheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
    toggle.setAttribute('aria-pressed', String(scheme === 'dark'));
    try { localStorage.setItem('draw-theme', scheme); } catch (err) {}
  });

  var saved = null;
  try { saved = localStorage.getItem('draw-theme'); } catch (err) {}
  setScheme(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  toggle.setAttribute('aria-pressed', String(scheme === 'dark'));
  selectTab(new URLSearchParams(location.search).get('tab') || 'combo');
  requestAnimationFrame(function () {
    var active = document.querySelector('.tab[aria-selected=true]');
    if (active) active.scrollIntoView({ block: 'nearest', inline: 'center' });
  });
})();
</script>
</body>
</html>`;
  // 演示页 HTML 静态(tab 参数由前端 JS 读取),可短缓存;变动随部署生效
  // 页面壳不缓存:边缘的缓存规则会把 max-age 改写成 4 小时,部署完用户还拿旧页
  // (ppt 踩过同一个坑)。壳是现生成的,不贵;图表 SVG 自己有缓存。
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
}
