// /draw/echarts 覆盖层(x-cmd-hub/draw#12 工作项 1):echarts 官方 SSR 路线 —
// init(null, null, { ssr: true }) + renderToSVGString,option 明文走 ?d=(URL 即语义,
// AI 直读),补齐核心手写渲染器未覆盖的长尾图种(agent 母语 = 原生 echarts option)。
//
// 风格接入不做 theme 二次开发:把皮肤变量(var(--d-s1)/var(--d-grid)…)当作颜色
// 默认值注入 option —— echarts 会把颜色字符串原样写进 fill/stroke,明暗切换由
// 内嵌 <style> 的 vars + media query 承接,单次渲染即得 auto/dark/light 三态,
// 与核心手写渲染器同一机制(skinStyle 同源)。所有默认值仅在用户未写处落值。
import { ApiError, clip } from '../specs/index.js';
import { resolveVersion } from '../version.js';
import { resolveSkin } from '../styles/index.js';
import type { Skin } from '../styles/index.js';
import { FONT } from '../theme.js';
import { esc, metaTag, skinStyle } from './svg.js';
import { clampInt, schemeParam, type DrawResult } from './query.js';
import type { EChartsOption } from 'echarts';

// ?d= 上限:再大就撞各端 URL 长度红线(Workers/代理 ~16KB);超限直接拒绝,
// 而不是静默截断(数据在 URL 上是产品第一性原则,不可悄悄丢)
const D_MAX = 16000;

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);

// 深度补缺省:只在用户未写的键上落值(用户值恒优先);true 视作 {} 下钻
// (axisLine: true 与 axisLine: {} 语义等价,展开后才能注入颜色)
function fillDefaults(target: Obj, defaults: Obj): void {
  for (const [k, d] of Object.entries(defaults)) {
    const t = target[k];
    if (t === undefined || t === true) {
      target[k] = structuredClone(d);
    } else if (isObj(t) && isObj(d)) {
      fillDefaults(t, d);
    }
  }
}

// 中性色令牌 → echarts 组件默认值(均为"缺省才补",不覆盖用户指定色)
const AXIS_NEUTRALS: Obj = {
  axisLabel: { color: 'var(--d-muted)' },
  axisLine: { lineStyle: { color: 'var(--d-baseline)' } },
  axisTick: { lineStyle: { color: 'var(--d-baseline)' } },
  splitLine: { lineStyle: { color: 'var(--d-grid)' } },
};
const AXES = ['xAxis', 'yAxis', 'radiusAxis', 'angleAxis', 'singleAxis'] as const;

// 需要笛卡尔坐标系的系列:这些系列的裸 option 在 SSR 下不会自动建轴(见 withDrawDefaults)
const CARTESIAN = new Set(['bar', 'line', 'scatter', 'effectScatter', 'boxplot', 'candlestick', 'heatmap', 'pictorialBar', 'custom']);

function withDrawDefaults(user: Obj, skin: Skin): EChartsOption {
  const option: Obj = {
    animation: false, // 静态 SVG:开动画只会输出第 0 帧
    color: skin.series.map((_, i) => `var(--d-s${i + 1})`), // 皮肤系列色板(padSeries 已补足 10 色)
    textStyle: { fontFamily: FONT, color: 'var(--d-text)' },
    ...user,
  };
  // spread 会整体覆盖子对象,用户的半成品 textStyle 也要补齐字体/文字色缺省
  if (isObj(option.textStyle)) fillDefaults(option.textStyle, { fontFamily: FONT, color: 'var(--d-text)' });
  if (isObj(option.title)) fillDefaults(option.title, { textStyle: { color: 'var(--d-ink)' }, subtextStyle: { color: 'var(--d-muted)' } });
  if (isObj(option.legend)) fillDefaults(option.legend, { textStyle: { color: 'var(--d-muted)' } });
  // SSR 补轴:echarts SSR 不像浏览器那样为笛卡尔系列自动建坐标系,裸 option 会抛
  // 'xAxis "0" not found'。按浏览器对等行为补空轴对象({} = 缺省 x=category/y=value),
  // 仅在用户完全没写该轴时落;写了一根(多轴场景)也不动
  const seriesArr = Array.isArray(option.series) ? option.series : isObj(option.series) ? [option.series] : [];
  if (seriesArr.some((s) => isObj(s) && typeof s.type === 'string' && CARTESIAN.has(s.type))) {
    if (option.xAxis === undefined) option.xAxis = {};
    if (option.yAxis === undefined) option.yAxis = {};
  }
  for (const key of AXES) {
    const v = option[key];
    if (v === undefined) continue; // 没有该轴就不补
    for (const axis of Array.isArray(v) ? v : [v]) {
      if (isObj(axis)) fillDefaults(axis, AXIS_NEUTRALS);
    }
  }
  return option as EChartsOption;
}

// 无障碍标签:取 title.text(与核心层 aria=标题 的约定一致)
function ariaOf(option: Obj): string {
  const t = option.title;
  const first = Array.isArray(t) ? t[0] : t;
  const text = isObj(first) && typeof first.text === 'string' ? first.text : '';
  return clip(text, 80) || 'echarts chart';
}

// 后处理:根 svg 补 role/aria/font-family,内嵌皮肤变量(含 Inter 子集)+ metadata
function decorate(svg: string, skin: Skin, version: number, option: unknown): string {
  const m = /^<svg\b[^>]*>/.exec(svg);
  if (!m) return svg; // echarts 输出恒为 <svg ...> 开头,防御而已
  const root = m[0].replace('<svg', `<svg role="img" aria-label="${esc(ariaOf(option as Obj))}" font-family="${FONT}"`);
  return root + skinStyle(skin) + metaTag('echarts', version, option) + svg.slice(m[0].length);
}

const EXAMPLE_D = encodeURIComponent(
  JSON.stringify({ xAxis: { type: 'category', data: ['A', 'B'] }, yAxis: { type: 'value' }, series: [{ type: 'bar', data: [1, 2] }] }),
);

/**
 * Render a parsed ECharts option object to a skinned SVG — shared by the HTTP
 * layer (`?d=` urlencoded JSON) and the CLI (inline JSON / file / stdin, where
 * no URL-length cap applies). `params` carries the shared `w`/`h`/`t`/`scheme`/
 * `v` knobs; style defaults are injected only where the option leaves them unset.
 *
 * @throws ApiError(400) if echarts rejects the option
 */
export async function renderEchartsOption(user: Obj, params: URLSearchParams): Promise<DrawResult> {
  const v = resolveVersion(params.get('v'));
  const skin = resolveSkin('line', params.get('t'), schemeParam(params)); // echarts 无专属变体,借用 line 的家族注册表
  const width = clampInt(params, 'w', 560, 200, 1600);
  const height = clampInt(params, 'h', 320, 140, 1200);
  const option = withDrawDefaults(user, skin);

  // 动态加载:核心 /draw 路径(含 Worker 冷启动)不为 echarts 付 ~1MB 的加载成本
  const echarts = await import('echarts');
  const chart = echarts.init(null, null, { renderer: 'svg', ssr: true, width, height });
  // echarts 对 var() 调色板会打 "illegal color" 警告(派生色 parseColor 不认 CSS 变量),
  // 但直写路径(fill/stroke)原样透传、输出正确——渲染成功时这些警告纯属噪音,吞掉;
  // 失败时并入错误消息辅助排障。setOption/render 同步执行,swap 期间无并发交错。
  const warned: string[] = [];
  const origWarn = console.warn;
  console.warn = (...a: unknown[]) => { warned.push(a.map(String).join(' ')); };
  try {
    chart.setOption(option);
    const svg = chart.renderToSVGString();
    return { svg: decorate(svg, skin, v.version, user), version: v.version, cacheControl: v.cacheControl };
  } catch (e) {
    const extra = warned.length > 0 ? `; echarts warnings: ${clip(warned.slice(0, 3).join(' | '), 300)}` : '';
    throw new ApiError(400, `echarts could not render this option: ${clip(e instanceof Error ? e.message : String(e), 200)}${extra}`);
  } finally {
    console.warn = origWarn;
    chart.dispose();
  }
}

/**
 * Render an ECharts option (`?d=` urlencoded JSON) to a skinned SVG — the
 * `GET /draw/echarts` semantics: `d` required, plus the shared `w`/`h`/`t`/
 * `scheme`/`v` params. Style defaults (palette, fonts, neutral axis colors)
 * are injected only where the option leaves them unset.
 *
 * @throws ApiError(400) with a corrective example on bad input
 */
export async function renderEchartsFromUrl(url: URL): Promise<DrawResult> {
  const raw = url.searchParams.get('d');
  if (raw === null || raw === '') {
    throw new ApiError(400, `"d" is required: the urlencoded ECharts option JSON, e.g. /draw/echarts?d=${EXAMPLE_D}`);
  }
  if (raw.length > D_MAX) {
    throw new ApiError(400, `"d" is too long for URL rendering (max ${D_MAX} chars); trim the option`);
  }
  let user: unknown;
  try {
    user = JSON.parse(raw);
  } catch (e) {
    throw new ApiError(400, `"d" is not valid JSON (${e instanceof Error ? e.message : 'parse error'}); pass the urlencoded ECharts option object, e.g. d=${EXAMPLE_D}`);
  }
  if (!isObj(user)) {
    throw new ApiError(400, `"d" must be a JSON object (the ECharts option), got ${Array.isArray(user) ? 'an array' : typeof user}`);
  }
  return renderEchartsOption(user, url.searchParams);
}
