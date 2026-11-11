// /draw/tokei —— 代码统计图:把 tokei 的统计结果画成「代码 / 注释 / 空行」三段堆叠柱。
//
// 输入是 tokei --output json 的输出(整份或裁剪过的子集都行):
//   {"TypeScript":{"code":1200,"comments":300,"blanks":150}, ...}
// 每种语言一根柱,三段自下而上:代码、注释、空行。
import { ApiError } from '../specs/index.js';
import type { MultiSpec } from '../specs/index.js';
import { renderBarStacked } from './bar-stacked.js';
import { renderCombo } from './combo.js';
import { renderButterfly } from './butterfly.js';
import type { ButterflySpec } from '../specs/butterfly.js';
import type { ComboSpec } from '../specs/combo.js';
import { resolveSkin } from '../styles/index.js';
import { clampInt, schemeParam, type DrawResult } from './query.js';
import type { RenderOpts } from './svg.js';

const EXAMPLE = 'd={"TypeScript":{"code":1200,"comments":300,"blanks":150}}';

/** 一门语言的三项计数 */
interface LangCounts {
  code: number;
  comments: number;
  blanks: number;
  /** 文件数(有就算;没有就是 0) */
  files: number;
}

const total = (c: LangCounts): number => c.code + c.comments + c.blanks;

const num = (v: unknown): number =>
  typeof v === 'number' && Number.isFinite(v) && v > 0 ? Math.round(v) : 0;

/**
 * 解析 tokei 的 JSON,转成堆叠柱要用的多系列 spec。
 *
 * 接受 tokei 的完整输出(含每个文件的 reports / children)——这里只取每门语言的
 * 三项合计;也接受裁剪过的 {"TypeScript":{"code":…,"comments":…,"blanks":…}}。
 */
export function parseTokei(raw: string): MultiSpec {
  if (!raw || !raw.trim()) {
    throw new ApiError(400, `Missing data. Use ?${EXAMPLE}`);
  }
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    throw new ApiError(400, `"d" is not valid JSON (remember to URL-encode it). Example: ?${EXAMPLE}`);
  }
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    throw new ApiError(400, `"d" must be an object of language → {code, comments, blanks}. Example: ?${EXAMPLE}`);
  }
  const rows: [string, LangCounts][] = [];
  for (const [name, v] of Object.entries(obj as Record<string, unknown>)) {
    if (name === 'Total') continue; // 合计行不画成一根柱
    if (!v || typeof v !== 'object' || Array.isArray(v)) continue;
    const r = v as Record<string, unknown>;
    const c: LangCounts = { code: num(r.code), comments: num(r.comments), blanks: num(r.blanks), files: num(r.files) };
    if (total(c) === 0) continue;
    rows.push([name, c]);
  }
  if (!rows.length) {
    throw new ApiError(400, `No language with any code in "d". Example: ?${EXAMPLE}`);
  }
  // 总量大的在前 —— 柱状图从大到小读起来最顺
  rows.sort((a, b) => total(b[1]) - total(a[1]));
  const labels = rows.map(([name]) => name);
  const values = (k: keyof LangCounts) => rows.map(([, c]) => c[k]);
  return {
    labels,
    series: [
      { name: 'code', values: values('code') },
      { name: 'comments', values: values('comments') },
      { name: 'blanks', values: values('blanks') },
    ],
  };
}

/**
 * 一门语言的文件数:
 *   - 直接写了 files(裁剪过的 JSON 可以自己填)
 *   - tokei 整份输出里是 reports(每个文件一条),老版本是 children(一个对象)
 */
function fileCountOf(r: Record<string, unknown>): number {
  if (typeof r.files === 'number' && Number.isFinite(r.files)) return Math.max(0, Math.round(r.files));
  const reports = r.reports;
  if (Array.isArray(reports)) return reports.length;
  const kids = r.children;
  if (kids && typeof kids === 'object' && !Array.isArray(kids)) return Object.keys(kids).length;
  return 0;
}

/** tokei 的数据:三项计数 + 文件数(有的话) */
export interface TokeiData {
  spec: MultiSpec;
  /** 每种语言的文件数;输入里没有文件信息时是 null */
  files: number[] | null;
}

/** 解析 tokei 的 JSON(整份或裁剪过的),顺带把文件数取出来 */
export function parseTokeiData(raw: string): TokeiData {
  const spec = parseTokei(raw);
  let obj: unknown;
  try { obj = JSON.parse(raw); } catch { return { spec, files: null }; }
  const rows: [string, number][] = [];
  let any = false;
  for (const [name, v] of Object.entries(obj as Record<string, unknown>)) {
    if (name === 'Total' || !v || typeof v !== 'object' || Array.isArray(v)) continue;
    const r = v as Record<string, unknown>;
    const n = fileCountOf(r);
    if (n > 0) any = true;
    rows.push([name, n]);
  }
  if (!any) return { spec, files: null };
  // 跟着柱的顺序排(柱按总量从大到小)
  const byName = new Map(rows);
  const files = spec.labels.map((l) => byName.get(l) ?? 0);
  return { spec, files };
}

/**
 * /draw/tokei 入口:GET ?d=<tokei json>,或 POST(body 就是 tokei 的 json)。
 */
/**
 * property 形态:langs=TypeScript:4820:1180:940,JavaScript:1687:298:71
 * 每项是 语言:代码:注释:空行,后两个可省。主推这个 —— 短,而且一眼能读。
 */
function parseLangs(raw: string): Record<string, { code: number; comments: number; blanks: number; files: number }> {
  const out: Record<string, { code: number; comments: number; blanks: number; files: number }> = {};
  for (const item of raw.split(',')) {
    const s = item.trim();
    if (!s) continue;
    const f = s.split(':').map((x) => x.trim());
    if (f.length < 2) {
      throw new ApiError(400, `"langs" must be "lang:code[:comments[:blanks][:files]]" per language, comma separated. Example: langs=TypeScript:4820:1180:940:45,Shell:640:120:88:6`);
    }
    const name = f[0];
    if (!name) {
      throw new ApiError(400, `"langs": language name is missing. Example: langs=TypeScript:4820:1180:940`);
    }
    const nums = f.slice(1).map((x) => Number(x));
    if (nums.some((n) => !Number.isFinite(n) || n < 0)) {
      throw new ApiError(400, `"langs": counts must be numbers ≥ 0. Example: langs=TypeScript:4820:1180:940`);
    }
    out[name] = {
      code: Math.round(nums[0]),
      comments: Math.round(nums[1] ?? 0),
      blanks: Math.round(nums[2] ?? 0),
      files: Math.round(nums[3] ?? 0),
    };
  }
  if (!Object.keys(out).length) {
    throw new ApiError(400, `"langs" is empty. Example: langs=TypeScript:4820:1180:940`);
  }
  return out;
}

export function renderTokeiFromUrl(url: URL, body?: string): DrawResult {
  const params = url.searchParams;
  const langs = params.get('langs');
  const raw = langs !== null && langs !== ''
    ? JSON.stringify(parseLangs(langs))
    : (body ?? params.get('d') ?? '');
  const { spec, files } = parseTokeiData(raw);
  const title = params.get('title')?.trim();
  const unit = params.get('unit')?.trim();
  const layout = (params.get('layout') ?? 'bar').toLowerCase();
  if (!['bar', 'butterfly', 'files', 'tb'].includes(layout)) {
    throw new ApiError(400, `"layout" must be one of bar, butterfly, files, tb. Got: ${JSON.stringify(layout)}`);
  }
  const skin = resolveSkin('bar', params.get('t'), schemeParam(params));
  const o = {
    width: clampInt(params, 'w', 760, 200, 2400),
    height: clampInt(params, 'h', 420, 140, 2000),
    version: 1,
    skin,
  };
  const withTitle = { ...spec, ...(title ? { title } : {}), ...(unit ? { unit } : {}) };
  const svg = layout === 'butterfly' || layout === 'files' || layout === 'tb'
    ? renderTokeiButterfly(withTitle, files, layout, o)
    : renderTokeiBar(withTitle, files, o);
  return { svg, version: o.version, cacheControl: 'public, max-age=300' };
}

/**
 * 柱状:三项堆叠的柱,文件数有的话叠一条自己的标尺的折线
 * (文件数和行数不是一个量级 —— 放同一根轴上会骗人)。
 */
function renderTokeiBar(spec: MultiSpec, files: number[] | null, o: RenderOpts): string {
  if (!files) return renderBarStacked(spec, o);
  const combo: ComboSpec = {
    labels: spec.labels,
    stack: true,
    series: [
      ...spec.series.map((s) => ({ ...s, kind: 'bar' as const })),
      { name: 'files', values: files, kind: 'line' as const },
    ],
  };
  return renderCombo(combo, { ...o, skin: resolveSkin('combo', null, 'light') });
}

/**
 * 双翼(#55 的做法):数据往左右(或上下)展开。
 *   butterfly —— 左代码、右注释+空行(同一个量级,长度可比),文件数叠一条折线
 *   files     —— 左文件数、右三项行数(两侧各一套标尺)
 *   tb        —— butterfly 站起来
 */
function renderTokeiButterfly(
  spec: MultiSpec,
  files: number[] | null,
  layout: 'butterfly' | 'files' | 'tb',
  o: RenderOpts,
): string {
  const [code, comments, blanks] = spec.series;
  const tb = layout === 'tb';
  const bfly: ButterflySpec = {
    labels: spec.labels,
    dir: tb ? 'tb' : 'lr',
    ...(spec.title ? { title: spec.title } : {}),
  };
  if (layout === 'files') {
    // 左:文件数;右:三项行数(两侧各一套标尺 —— 单位不一样)
    bfly.scale = 'each';
    bfly.left = { name: 'files', values: files ?? spec.labels.map(() => 0) };
    bfly.right = {
      segments: [
        { name: 'code', values: code.values },
        { name: 'comments', values: comments.values },
        { name: 'blanks', values: blanks.values },
      ],
    };
  } else {
    // 左:代码;右:注释+空行(同一个量级,共用标尺,长度可比)
    bfly.left = { name: 'code', values: code.values };
    bfly.right = {
      segments: [
        { name: 'comments', values: comments.values },
        { name: 'blanks', values: blanks.values },
      ],
    };
    // 文件数叠在左侧(自己的标尺)
    if (files) bfly.line = { name: 'files', values: files, side: 'left' };
  }
  return renderButterfly(bfly, o);
}
