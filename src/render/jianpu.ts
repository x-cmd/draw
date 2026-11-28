// 简谱(数字谱)—— 同一段 ABC,换成中国人看得懂的记法。
//
// 简谱的规矩:
//   1 2 3 4 5 6 7  = do re mi fa sol la ti(相对主音,不是固定的音名)
//   1=C            = 调号:1 是 C(小调写 1=Am 那套:1=a)
//   高音点/低音点  = 圆点在上/在下,一个点高八度
//   减时线        = 数字下面的横线:一条是八分,两条是十六分
//   附点          = 数字右边的点
//   延音线        = 数字后面的横线(半音符一个,全音符三个)
//   0             = 休止
//
// 音高从 ABC 推:字母在音阶上的位置(相对主音)+ 八度。
// 调号里的升降由 "1=C" 隐含;跟调号不一样的临时升降号,写在数字前面。
//
// 谱面是**文字 + 线**,不依赖任何字体文件(数字是 ASCII,点与线是图元)——
// 出来的 SVG 自足,浏览器和 PNG 光栅化一个样。

import { ApiError, clip } from '../specs/base.js';
import {
  THEMES, FONT_STACK, withBackground, withFont, setSize, ensureSvgNs, ensureViewBox,
  type Scheme,
} from './source-theme.js';
import { parseAbc, keyAlterations, beatsOf, transposeKey, AbcError, type AbcNote, type AbcTune } from './abc-parse.js';

/* ---------------------------------------------------------------- 布局常数 */

/** 一个音符占多宽 */
const SLOT = 26;
/** 数字多大 */
const FONT_SIZE = 21;
/** 一行放几个音符 */
const PER_LINE = 24;
/** 行与行之间 */
const LINE_GAP = 54;

export interface SourceOpts {
  scheme?: Scheme;
  width?: number;
  height?: number;
  /** 移调(半音) */
  transpose?: number;
}

/* ---------------------------------------------------------------- 小工具 */

/** 音名字母在自然音阶上的序号(C=0 … B=6) */
const DEG: Record<string, number> = { c: 0, d: 1, e: 2, f: 3, g: 4, a: 5, b: 6 };
/** 调号(大调)的主音字母 */
const TONIC: Record<string, string> = {
  C: 'c/4', G: 'g/4', D: 'd/4', A: 'a/4', E: 'e/4', B: 'b/4', 'F#': 'f/4', 'C#': 'c/4',
  F: 'f/4', Bb: 'b/4', Eb: 'e/4', Ab: 'a/4', Db: 'd/4', Gb: 'g/4', Cb: 'c/4',
};

const r2 = (v: number): number => Math.round(v * 100) / 100;

/** 一个音在自然音阶上的位置(音名 + 八度)→ 序号(C4 = 28) */
function degOf(key: string): number {
  const m = /^([a-g])([#b]?)\/(\d+)$/.exec(key);
  if (!m) return 28;
  return DEG[m[1]] + 7 * (Number(m[3]) - 4);
}

/** 音名 + 八度 → 简谱的「数字 + 高低音点」 */
function numOf(key: string, tonic: string): { num: number; dots: number } {
  const step = degOf(key) - degOf(tonic);
  const oct = Math.floor(step / 7);
  const num = ((step % 7) + 7) % 7 + 1;
  return { num, dots: oct };
}

/* ---------------------------------------------------------------- 渲染 */

/** ABC 源码 → 简谱 SVG */
export async function renderJianpu(src: string, opts: SourceOpts = {}): Promise<string> {
  const s = src.trim();
  if (!s) {
    throw new ApiError(400, '"d" is required: the ABC notation source, e.g. d=' + encodeURIComponent('X:1\\nT:Air\\nK:C\\nCDEF|GABc|'));
  }

  let tune: AbcTune;
  try {
    tune = parseAbc(s);
  } catch (e) {
    if (e instanceof AbcError) throw new ApiError(400, `this ABC source could not be read: ${e.message}`);
    throw new ApiError(400, `this ABC source could not be read: ${clip(e instanceof Error ? e.message : String(e), 200)}`);
  }

  const scheme = opts.scheme ?? 'dark';
  const theme = THEMES[scheme];
  const tonic = TONIC[tune.key] ?? 'c';
  const keyAlts = keyAlterations(tune.key);
  const transpose = opts.transpose ?? 0;

  // 头:调号(1=C)、拍号、速度、标题
  const head: string[] = [];
  head.push(`<text x="14" y="26" font-size="17" font-weight="600" fill="${theme.ink}">1=${tune.key}</text>`);
  const meter = /^(\d+)\/(\d+)$/.exec(tune.meter);
  head.push(`<text x="86" y="26" font-size="15" fill="${theme.muted}">${meter ? `${meter[1]}/${meter[2]}` : tune.meter}</text>`);
  if (tune.tempo) head.push(`<text x="140" y="26" font-size="14" fill="${theme.muted}">${esc(tune.tempo)}</text>`);
  if (tune.title) head.push(`<text x="${(opts.width ?? 560) / 2}" y="26" text-anchor="middle" font-size="16" font-weight="600" fill="${theme.ink}">${esc(tune.title)}</text>`);

  // 正文:一格一个音符
  const cells: string[] = [];
  const state: Record<string, string> = { ...keyAlts };
  let x = 14;
  let y = 74;
  let col = 0;

  const bar = (): void => {
    cells.push(`<line x1="${r2(x - 5)}" y1="${y - 22}" x2="${r2(x - 5)}" y2="${y + 18}" stroke="${theme.line}" stroke-width="1"/>`);
  };

  // 谱杠的位置(ABC 里小节线前面的音符个数)
  const barAt = new Set(tune.bars);
  tune.notes.forEach((n, i) => {
    if (col >= PER_LINE) {
      col = 0;
      y += LINE_GAP;
      x = 14;
    }
    if (barAt.has(i)) bar();
    cells.push(...cellOf(n, state, tune, tonic, x, y, theme, i, transpose));
    x += SLOT;
    col++;
  });
  bar();

  const width = opts.width ?? 560;
  const height = y + 40;

  let out = `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(width)}" height="${r2(height)}" viewBox="0 0 ${r2(width)} ${r2(height)}">`;
  out += head.join('');
  out += cells.join('');
  out += '</svg>';
  out = withFont(out, FONT_STACK);
  out = withBackground(out, theme, width, height);
  out = setSize(out, width, height);
  out = ensureSvgNs(out);
  out = ensureViewBox(out);
  return out;
}

/** 这个时值是不是附点(1.5 倍、3 拍、0.75 拍…) */
function isDottedBeats(beats: number): boolean {
  let x = Math.abs(beats);
  if (x === 0) return false;
  for (let i = 0; i < 12 && !Number.isInteger(x); i++) x *= 2;
  return Number.isInteger(x) && x === 3;
}

/** 一个音符画成一格简谱 */
function cellOf(
  n: AbcNote, state: Record<string, string>, tune: AbcTune, tonic: string,
  x: number, y: number, theme: { ink: string; muted: string; line: string }, idx: number,
  transpose = 0,
): string[] {
  // 源码位置:点这个数字 → 选中源码里对应的音
  const pos = ` data-cstart="${n.start}" data-cend="${n.end}"`;
  const out: string[] = [];
  const beats = beatsOf(n.units, tune.unit);

  // 休止:一个 0
  if (n.rest || !n.keys.length) {
    out.push(`<text x="${r2(x)}" y="${y}" font-size="${FONT_SIZE}" fill="${theme.muted}" data-index="${idx}"${pos}>0</text>`);
    return out;
  }

  // 和弦:上下叠着写(简谱里和弦就是上下两个数字)
  const parts = n.keys.map((k) => {
    const letter = k[0];
    const explicit = k.length > 1 && '#bn'.includes(k[1]) ? k[1] : undefined;
    const implied = state[letter];
    if (explicit !== undefined) state[letter] = explicit;
    const { num, dots } = numOf(transposeKey(k, transpose), tonic);
    return { num, dots, acc: explicit !== undefined && explicit !== implied ? explicit : undefined };
  });
  parts.sort((a, b) => a.num - b.num);

  parts.forEach((p, i) => {
    const dy = (i - (parts.length - 1) / 2) * 17;
    const ty = y + dy;
    if (p.acc) {
      // 临时升降号:写在数字前面
      out.push(`<text x="${r2(x - 9)}" y="${r2(ty)}" font-size="13" fill="${theme.ink}">${p.acc === '#' ? '♯' : '♭'}</text>`);
    }
    out.push(`<text x="${r2(x)}" y="${r2(ty)}" font-size="${FONT_SIZE}" font-weight="600" fill="${theme.ink}" data-index="${idx}"${pos}>${p.num}</text>`);
    // 高音点在上,低音点在下
    if (p.dots > 0) {
      for (let i2 = 0; i2 < p.dots; i2++) {
        out.push(`<circle cx="${r2(x + 5)}" cy="${r2(ty - 22 - i2 * 8)}" r="2.2" fill="${theme.ink}"/>`);
      }
    } else if (p.dots < 0) {
      for (let i2 = 0; i2 < -p.dots; i2++) {
        out.push(`<circle cx="${r2(x + 5)}" cy="${r2(ty + 12 + i2 * 8)}" r="2.2" fill="${theme.ink}"/>`);
      }
    }
  });

  // 时值:减时线(下划线)、附点(右边的点)、延音线(后面的横线)
  const underlines = beats < 1 ? (beats <= 0.25 ? 2 : 1) : 0;
  for (let i = 0; i < underlines; i++) {
    const ly = y + 9 + i * 4;
    out.push(`<line x1="${r2(x)}" y1="${r2(ly)}" x2="${r2(x + 11)}" y2="${r2(ly)}" stroke="${theme.ink}" stroke-width="1.4"/>`);
  }
  // 附点:时值是「基本值的 1.5 倍」(1.5 / 3 / 0.75 …),
  // 不能只看「不是整数」—— 八分音符(0.5)也不是整数,那不是附点
  const isDotted = isDottedBeats(beats);
  if (isDotted) {
    out.push(`<circle cx="${r2(x + 15)}" cy="${r2(y - 5)}" r="2" fill="${theme.ink}"/>`);
  }
  // 延音线:半音符一个,全音符三个
  const dashes = beats >= 3 ? 3 : beats >= 1.5 ? 1 : 0;
  for (let i = 0; i < dashes; i++) {
    const dx = x + 16 + i * 12;
    out.push(`<line x1="${r2(dx)}" y1="${r2(y - 6)}" x2="${r2(dx + 8)}" y2="${r2(y - 6)}" stroke="${theme.ink}" stroke-width="1.4"/>`);
  }
  return out;
}

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
