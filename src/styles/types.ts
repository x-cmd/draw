// 风格体系类型:变体 = 色板(明暗双值)+ 视觉规则(词汇表归纳自规范 13 张 SVG)。

/** 明暗双值;两态同色时 light === dark */
export interface Duo {
  light: string;
  dark: string;
}

export const duo = (light: string, dark: string = light): Duo => ({ light, dark });

/** 中性色令牌(网格/文字/卡片等),全部支持明暗 */
export interface Neutrals {
  ink: Duo;      // 标题/主文字
  text: Duo;     // 次级文字
  muted: Duo;    // 刻度/副标题
  faint: Duo;    // 弱化文字
  grid: Duo;     // 网格线
  baseline: Duo; // 基线
  border: Duo;   // 卡片边框
  card: Duo;     // 画布底色
  halo: Duo;     // 标签白描边/点空心填充的"底色"
}

/** 视觉规则(缺省值见 DEFAULT_RULES;词汇表来自规范 SVG 的实际行为) */
export interface Rules {
  // 画布与标题
  canvas: 'card' | 'plain';          // plain = 透明背景,页面承接底色(规范约定)
  title: 'plain' | 'editorial' | 'center'; // center = 手绘风居中标题(star)
  // 网格与坐标
  grid: 'solid' | 'dashed' | 'none';
  gridDash: string;                  // 虚线间隔,如 '3 8'
  axisTitle: boolean;                // 旋转 Y 轴标题(取 spec.unit)
  baseline: 'line' | 'dots' | 'none'; // X 基线形态:实线/刻度点(Evil)/无
  axisInline: boolean;               // Y 刻度悬于网格线上方(OpenData)
  // 折线/面积
  points: 'filled' | 'hollow' | 'none';
  pointR: number;                    // 数据点半径
  lineWidth: number;                 // 折线宽度
  lineDash: string;                  // 系列虚线('' = 实线;Evil 面积图 5 5)
  dashSecondary: boolean;            // 第 2+ 系列虚线对比(evil-mono)
  smooth: boolean;
  glow: boolean;                     // 渐变描边+发光(Evil Glow 风)
  areaGradient: boolean;             // 面积渐变填充
  areaTop: number;                   // 渐变顶部不透明度
  areaBottom: number;                // 渐变底部不透明度
  endLabels: boolean;                // 线端系列名(OpenData,替代图例)
  sketch: boolean;                   // 手绘风滤镜+手写字体(GitHub Star)
  comboMode: 'base' | 'evil';        // evil = 规范 combo-1(紫柱绿线双轴,960×500)
  areaMode: 'auto' | 'pixel' | 'polka';
  // auto=常规折线面积 pixel=像素格轨迹(area-3) polka=波点 pattern 填充阶梯面积(area-4)
  yFromZero: boolean;                // Y 轴从 0 起(规范 area-3 反例:120-240 区间)
  refAvg: boolean;                   // 均值参考虚线+右端标注(规范 area-3)
  endValue: boolean;                 // 末点数值标注+空心圆标记(规范 area-3)
  tickFont: number;                  // 轴刻度字号(规范 opendata 系 = 14)
  // 仪表盘
  gauge: 'semi' | 'rings' | 'zones'; // semi=半圆多环(默认) rings=渐变整圆多环 zones=分区环+刻度条(reliability)
  // 柱状图
  barMode: 'bars' | 'grid';          // grid = 单元格柱(规范 bar-2,一格一单位)
  barCorner: number;                 // 柱角半径(规范 bar-1 = 4,四角全圆)
  // 水平柱
  hbarMode: 'plain' | 'rows' | 'cells' | 'diverging' | 'lift';
  // rows=逐行配色+内标值(opendata) cells=像素格(xcmd) diverging=蝴蝶新建/关闭 lift=实底+斜纹增益(rank)
  // 雷达图
  radarMode: 'web' | 'evil' | 'xcmd';
  // web=自制蛛网(默认) evil=规范 radar-1(多系列+轴端内嵌数值) xcmd=规范 radar-2(手绘五维)
  radarMax: number;                    // 量程上限(0=按数据自适应;规范两款均 0-100)
  // 桑基图
  sankeyMode: 'basic' | 'fund' | 'pipeline';
  // basic=细节点+源色流带 fund=盒节点+渐变流带+表头表尾 pipeline=双渐变流带+中央总额
  // 饼图
  pieLabels: 'legend' | 'onSlice' | 'insideValue' | 'insidePct' | 'outside' | 'dots';
  pieCenter: 'none' | 'total' | 'value';
  pieSliceGap: number;               // 扇区分隔描边宽度(0 = 不分隔)
  pieCorner: number;                 // 扇区圆角半径(Evil 系)
  pieRadius: number;                 // 内半径比例(0 = 实心饼)
  pieGradient: boolean;              // 扇区对角渐变(revenue)
  pieDashedInner: boolean;           // 虚线内圈(revenue)
  pieDir: 'cw' | 'ccw';              // 扇区推进方向(Evil 系 = ccw 逆时针)
  pieStart: number;                  // 起始角(ECharts 度:0=3 点钟,90=12 点钟,逆时针为正)
  pieOrder: 'data' | 'reverse';      // 扇区绘制顺序(market-mono 倒排,图例仍按数据序)
  // 图例
  legend: 'none' | 'top-left' | 'top-right' | 'bottom' | 'right';
  legendShape: 'circle' | 'square';
  legendValue: boolean;              // 图例带数值/占比
  legendCols: number;                // 底部图例列数(0 = 单行自适应)
  // 数值标注默认(?num= 覆盖)
  num: 'all' | 'peak' | 'none';
}

export const DEFAULT_RULES: Rules = {
  canvas: 'card',
  title: 'plain',
  grid: 'solid',
  gridDash: '3 8',
  axisTitle: false,
  baseline: 'line',
  axisInline: false,
  points: 'filled',
  pointR: 3,
  lineWidth: 2.5,
  lineDash: '',
  dashSecondary: false,
  smooth: true,
  glow: false,
  areaGradient: true,
  areaTop: 0.28,
  areaBottom: 0,
  endLabels: false,
  sketch: false,
  comboMode: 'base',
  areaMode: 'auto',
  yFromZero: true,
  refAvg: false,
  endValue: false,
  tickFont: 12,
  gauge: 'semi',
  barMode: 'bars',
  barCorner: 0,
  hbarMode: 'plain',
  radarMode: 'web',
  radarMax: 0,
  sankeyMode: 'basic',
  pieLabels: 'legend',
  pieCenter: 'total',
  pieSliceGap: 3,
  pieCorner: 0,
  pieRadius: 0.6,
  pieGradient: false,
  pieDashedInner: false,
  pieDir: 'cw',
  pieStart: 90,
  pieOrder: 'data',
  legend: 'top-right',
  legendShape: 'square',
  legendValue: false,
  legendCols: 0,
  num: 'all',
};

/** 基础中性色(规范页页面底色体系:#F8F9FB/#FFFFFF · #0A0A0A/#0E0F11) */
export const NEUTRALS: Neutrals = {
  ink: duo('#09090B', '#FAFAFA'),
  text: duo('#3F3F46', '#D4D4D8'),
  muted: duo('#71717A', '#A1A1AA'),
  faint: duo('#A1A1AA', '#71717A'),
  grid: duo('#ECECEF', '#29292E'),
  baseline: duo('#D4D4D8', '#3F3F46'),
  border: duo('#E4E4E7', '#27272A'),
  card: duo('#FFFFFF', '#0E0F11'),
  halo: duo('#FFFFFF', '#1A1B1D'),
};

/** 变体输入(宽松):rules/neutrals 只给差异,makeVariant 补全默认 */
export interface VariantInput {
  family: string;   // 风格家族(?t= 参数值)
  label: string;    // 展示名,如 'OpenData 风格'
  series: Duo[];    // 系列色(多系列按序取用)
  rules?: Partial<Rules>;
  neutrals?: Partial<Neutrals>;
  /** 单系列主渐变(柱/面积),默认由 series[0]/series[1] 推导 */
  ramp?: [Duo, Duo];
  /** 默认画布(设计变体 = 规范 SVG 的 viewBox;不填用模板默认) */
  size?: [number, number];
}

/** 归一化后的变体(注册表中存储的形态) */
export interface Variant {
  family: string;
  label: string;
  series: Duo[];
  rules: Rules;
  neutrals: Neutrals;
  ramp: [Duo, Duo];
  size?: [number, number];
}

export function makeVariant(v: VariantInput): Variant {
  const rules = { ...DEFAULT_RULES, ...v.rules };
  const neutrals = { ...NEUTRALS, ...v.neutrals };
  const [a, b = a] = v.series;
  const ramp = v.ramp ?? [a, b];
  return { family: v.family, label: v.label, series: v.series, rules, neutrals, ramp, ...(v.size ? { size: v.size } : {}) };
}

/** 渲染期皮肤:变体 + 明暗模式 → 渲染器直接消费 */
export type Scheme = 'auto' | 'dark' | 'light';

export interface Skin {
  scheme: Scheme;
  series: Duo[];
  ramp: [Duo, Duo];
  rules: Rules;
  neutrals: Neutrals;
  /** 设计变体 = 规范画布,作为该风格的默认 w/h(?w/?h 仍可覆盖) */
  size?: [number, number];
}

