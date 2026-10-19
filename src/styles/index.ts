// 风格注册表:?t=<family> 作用于任意图种;该图种无此家族变体时回退默认(第一个);
// family 完全未知(拼写错误)报 400 并列出有效家族。
import { ApiError } from '../specs/index.js';
import type { ChartTemplate } from '../store.js';
import { duo, type Duo, type Scheme, type Skin, type Variant } from './types.js';
import { LINE_VARIANTS } from './line.js';
import { PIE_VARIANTS } from './pie.js';
import { AREA_VARIANTS } from './area.js';
import { BAR_VARIANTS } from './bar.js';
import { HBAR_VARIANTS } from './hbar.js';
import { RADAR_VARIANTS } from './radar.js';
import { SANKEY_VARIANTS } from './sankey.js';
import { GAUGE_VARIANTS } from './gauge.js';
import { SCATTER_VARIANTS } from './scatter.js';
import { COMBO_VARIANTS } from './combo.js';
import { QR_VARIANTS } from './qr.js';

export const VARIANTS: Record<ChartTemplate, Variant[]> = {
  pie: PIE_VARIANTS,
  bar: BAR_VARIANTS,
  hbar: HBAR_VARIANTS,
  line: LINE_VARIANTS,
  area: AREA_VARIANTS,
  radar: RADAR_VARIANTS,
  sankey: SANKEY_VARIANTS,
  gauge: GAUGE_VARIANTS,
  scatter: SCATTER_VARIANTS,
  combo: COMBO_VARIANTS,
  qr: QR_VARIANTS,
};

/** 全部有效风格家族(错误提示/演示页用) */
export const FAMILIES = [...new Set(Object.values(VARIANTS).flat().map((v) => v.family))];

// 系列色兜底:规范稿色板多为 2-5 色(按稿上的系列数设计),系列更多时逐对撞色。
// 补齐到 8 色分类板(跳过皮肤已有色),确定性输出;渲染器 i % 色板长 循环自然取到互异色
const OVERFLOW_SERIES: Duo[] = [
  duo('#F59E0B', '#FBBF24'), // amber
  duo('#0EA5E9', '#38BDF8'), // sky
  duo('#8B5CF6', '#A78BFA'), // violet
  duo('#EC4899', '#F472B6'), // pink
  duo('#14B8A6', '#2DD4BF'), // teal
  duo('#6366F1', '#818CF8'), // indigo
  duo('#F97316', '#FB923C'), // orange
  duo('#84CC16', '#A3E635'), // lime
  duo('#E11D48', '#FB7185'), // rose
  duo('#06B6D4', '#22D3EE'), // cyan
];
function padSeries(series: Duo[]): Duo[] {
  const MIN = 10; // 饼图按扇区着色:9 类 + Other = 10 色,末扇与首扇相邻不得同色
  if (series.length >= MIN) return series;
  const have = new Set(series.map((d) => d.light));
  const out = [...series];
  for (const d of OVERFLOW_SERIES) {
    if (out.length >= MIN) break;
    if (!have.has(d.light)) {
      out.push(d);
      have.add(d.light);
    }
  }
  return out;
}

export function resolveSkin(type: ChartTemplate, family: string | null, scheme: Scheme): Skin {
  const variants = VARIANTS[type];
  let variant = variants[0]; // 默认 = 第一个变体
  // 'base' 是正式家族(可显式 ?t=base 精确命中);图种未提供该家族时照旧静默回退默认
  if (family !== null && family !== '') {
    const found = variants.find((v) => v.family === family);
    if (found) {
      variant = found;
    } else if (FAMILIES.includes(family)) {
      // 家族存在但该图种未做 → 静默回退默认(约定)
    } else {
      throw new ApiError(400, `"t" must be one of: ${FAMILIES.join(', ')}. Got: ${JSON.stringify(family)}`);
    }
  }
  const [a, b = a] = variant.series;
  return { scheme, series: padSeries(variant.series), ramp: variant.ramp ?? [a, b], rules: variant.rules, neutrals: variant.neutrals, ...(variant.size ? { size: variant.size } : {}) };
}


export { type Skin, type Scheme, type Variant } from './types.js';
