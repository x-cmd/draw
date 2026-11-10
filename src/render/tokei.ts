// /draw/tokei —— 代码统计图:把 tokei 的统计结果画成「代码 / 注释 / 空行」三段堆叠柱。
//
// 输入是 tokei --output json 的输出(整份或裁剪过的子集都行):
//   {"TypeScript":{"code":1200,"comments":300,"blanks":150}, ...}
// 每种语言一根柱,三段自下而上:代码、注释、空行。
import { ApiError } from '../specs/index.js';
import type { MultiSpec } from '../specs/index.js';
import { renderBarStacked } from './bar-stacked.js';
import { resolveSkin } from '../styles/index.js';
import { clampInt, schemeParam, type DrawResult } from './query.js';

const EXAMPLE = 'd={"TypeScript":{"code":1200,"comments":300,"blanks":150}}';

/** 一门语言的三项计数 */
interface LangCounts {
  code: number;
  comments: number;
  blanks: number;
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
    const c: LangCounts = { code: num(r.code), comments: num(r.comments), blanks: num(r.blanks) };
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
 * /draw/tokei 入口:GET ?d=<tokei json>,或 POST(body 就是 tokei 的 json)。
 */
/**
 * property 形态:langs=TypeScript:4820:1180:940,JavaScript:1687:298:71
 * 每项是 语言:代码:注释:空行,后两个可省。主推这个 —— 短,而且一眼能读。
 */
function parseLangs(raw: string): Record<string, { code: number; comments: number; blanks: number }> {
  const out: Record<string, { code: number; comments: number; blanks: number }> = {};
  for (const item of raw.split(',')) {
    const s = item.trim();
    if (!s) continue;
    const f = s.split(':').map((x) => x.trim());
    if (f.length < 2) {
      throw new ApiError(400, `"langs" must be "lang:code[:comments[:blanks]]" per language, comma separated. Example: langs=TypeScript:4820:1180:940,Shell:640:120:88`);
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
  const spec = langs !== null && langs !== ''
    ? parseTokei(JSON.stringify(parseLangs(langs)))
    : parseTokei(body ?? params.get('d') ?? '');
  const title = params.get('title')?.trim();
  const unit = params.get('unit')?.trim();
  const skin = resolveSkin('bar', params.get('t'), schemeParam(params));
  const o = {
    width: clampInt(params, 'w', 760, 200, 2400),
    height: clampInt(params, 'h', 420, 140, 2000),
    version: 1,
    skin,
  };
  const svg = renderBarStacked(
    { ...spec, ...(title ? { title } : {}), ...(unit ? { unit } : {}) },
    o,
  );
  return { svg, version: o.version, cacheControl: 'public, max-age=300' };
}
