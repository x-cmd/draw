// ABC 记谱(vexflow)—— 乐谱的另一种画法。
//
// 输入跟 /draw/abcjs **一样是 ABC**(同一段谱,两种记谱风格 —— 那才叫共鸣),
// 但 vexflow 自己不带 ABC 解析器,所以头里那套小解析器是我们自己的
// (src/render/abc-parse.ts)。
//
// vexflow 4 的谱面是**路径**:它内建了 Bravura 的 SVG 字体数据,音符、谱号、
// 升降号画出来都是 <path> —— 出来的 SVG 是自足的,不依赖系统字体,
// 浏览器和 resvg(PNG 光栅化)画出来一个样。
//
// 库是**动态载入**的:只有真来 /draw/vexflow 才付这份下载(≈1MB)。

import { ApiError, clip } from '../specs/base.js';
import { installSvgDom, ShimElement } from './svgdom.js';
import {
  THEMES, FONT_STACK, SERIF_STACK, withBackground, withFont, setSize,
  ensureSvgNs, ensureViewBox, annotateNotes,
  type Scheme,
} from './source-theme.js';
import { parseAbc, keyAlterations, beatsOf, vexDuration, transposeKey, AbcError, type AbcNote, type AbcTune } from './abc-parse.js';

/* ------------------------------------------------------------ vexflow 的类型 */

interface StaveNoteLike {
  addModifier: (m: unknown, index?: number) => unknown;
}
interface VexNS {
  Renderer: {
    new (el: unknown, backend: number): { resize: (w: number, h: number) => void; getContext: () => unknown };
    Backends: { CANVAS: number; SVG: number };
  };
  Stave: new (x: number, y: number, width: number) => {
    addClef: (c: string) => unknown;
    addTimeSignature: (t: string) => unknown;
    addKeySignature: (k: string) => unknown;
    setContext: (c: unknown) => unknown;
    draw: () => unknown;
  };
  StaveNote: new (opts: { keys: string[]; duration: string }) => StaveNoteLike;
  Accidental: new (accid: string) => unknown;
  Formatter: new () => {
    joinVoices: (v: unknown[]) => { formatToStave: (v: unknown[], stave: unknown) => unknown };
  };
  Voice: new (opts: { num_beats: number; beat_value: number }) => {
    setStrict: (b: boolean) => unknown;
    addTickables: (t: unknown[]) => unknown;
    draw: (ctx: unknown, stave?: unknown) => unknown;
  };
  Beam: { generateBeams: (notes: unknown[], cfg?: { groups?: unknown[] }) => { setContext: (c: unknown) => unknown; draw: () => unknown }[] };
  Fraction: new (n: number, d: number) => unknown;
}

export interface SourceOpts {
  scheme?: Scheme;
  width?: number;
  height?: number;
  /** 移调(半音) */
  transpose?: number;
}

/* ---------------------------------------------------------------- 布局常数 */

/** 画布左右留白 */
const MARGIN = 12;
/** 每行(一行谱)之间的距离 */
const SYSTEM_GAP = 100;
/** 第一行谱离顶部的距离 */
const TOP = 46;
/** 一个四分音符大概多宽(用来算一行放几个小节) */
const PX_PER_BEAT = 34;

/* ---------------------------------------------------------------- 小工具 */

/** '4/4' → [4, 4] */
function meterOf(meter: string): [number, number] {
  const m = /^(\d+)\s*\/\s*(\d+)/.exec(meter);
  return m ? [Number(m[1]), Number(m[2])] : [4, 4];
}

/**
 * 一拍多长(以全音符为 1)—— 用来给音符连桁(beam)分组。
 *
 * 简单拍(4/4、3/4):一拍 = 1/den,共 num 拍。
 * 复合拍(6/8、9/8):一拍 = 附点八分(3/8),共 num/3 拍 —— 6/8 是两拍,不是六拍。
 */
function beatGroups(num: number, den: number): number[] {
  const compound = (den === 8 || den === 16) && num % 3 === 0 && num > 3;
  const groupLen = compound ? 3 / den : 1 / den;
  const count = compound ? num / 3 : num;
  return new Array(Math.max(1, Math.round(count))).fill(groupLen);
}

/** 把音按小节线切开 */
function splitMeasures(tune: AbcTune): AbcNote[][] {
  const out: AbcNote[][] = [];
  let start = 0;
  for (const b of [...tune.bars, tune.notes.length]) {
    if (b > start) out.push(tune.notes.slice(start, b));
    start = b;
  }
  return out.length ? out : [tune.notes];
}

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ---------------------------------------------------------------- 渲染 */

/** ABC 源码 → SVG */
export async function renderVexflow(src: string, opts: SourceOpts = {}): Promise<string> {
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

  installSvgDom();
  const mod = await import('vexflow');
  const Vex = ((mod as unknown as { Flow?: VexNS }).Flow ?? (mod.default ?? mod)) as unknown as VexNS;

  const scheme = opts.scheme ?? 'dark';
  const theme = THEMES[scheme];
  const width = Math.max(200, Math.min(1600, opts.width ?? 560));
  const [num, den] = meterOf(tune.meter);
  const beatsPerMeasure = (num * 4) / den;
  const measures = splitMeasures(tune);

  // 一行放几个小节:按拍数估宽度
  const perSystem = Math.max(1, Math.floor((width - 2 * MARGIN - 130) / (beatsPerMeasure * PX_PER_BEAT)) || 1);
  const systems: AbcNote[][][] = [];
  for (let i = 0; i < measures.length; i += perSystem) {
    systems.push(measures.slice(i, i + perSystem));
  }

  // 画布高度:第一行谱在 TOP,每行之间 SYSTEM_GAP,最后一行谱高 40(五条线)
  const height = TOP + (systems.length - 1) * SYSTEM_GAP + 40 + 24;

  const host = new ShimElement('div');
  const renderer = new Vex.Renderer(host, Vex.Renderer.Backends.SVG);
  renderer.resize(width, height);
  const ctx = renderer.getContext();

  const keyAlts = keyAlterations(tune.key);
  const transpose = opts.transpose ?? 0;
  const groups = beatGroups(num, den).map((len) => new Vex.Fraction(Math.round(len * 96), 96));

  systems.forEach((sysMeasures, si) => {
    const y = TOP + si * SYSTEM_GAP;
    const stave = new Vex.Stave(MARGIN, y, width - 2 * MARGIN);
    if (si === 0) {
      stave.addClef('treble');
      stave.addTimeSignature(`${num}/${den}`);
      if (tune.key !== 'C') stave.addKeySignature(tune.key);
    }
    stave.setContext(ctx);
    stave.draw();

    // 这一行里的音:小节内的升降号状态(ABC 里显式写出的升降号管到小节末)
    const state: Record<string, string> = { ...keyAlts };
    const vexNotes: StaveNoteLike[] = [];
    for (const m of sysMeasures) {
      for (const n of m) {
        vexNotes.push(makeNote(Vex, n, state, tune, transpose));
      }
    }
    if (!vexNotes.length) return;

    const voice = new Vex.Voice({ num_beats: num, beat_value: den });
    voice.setStrict(false);
    voice.addTickables(vexNotes);

    const fmt = new Vex.Formatter();
    fmt.joinVoices([voice]).formatToStave([voice], stave);
    voice.draw(ctx, stave);

    // 连桁:八分、十六分连成一条
    for (const b of Vex.Beam.generateBeams(vexNotes, { groups })) {
      b.setContext(ctx);
      b.draw();
    }
  });

  // 标题与速度:用 SVG 文字直接写
  const textBits: string[] = [];
  let ty = 26;
  if (tune.title) {
    textBits.push(`<text x="${width / 2}" y="${ty}" text-anchor="middle" font-family="${SERIF_STACK}" font-size="17" font-weight="600">${esc(tune.title)}</text>`);
    ty += 18;
  }
  if (tune.tempo) {
    textBits.push(`<text x="${MARGIN}" y="${ty}" font-family="${SERIF_STACK}" font-size="12" fill="${theme.muted}">${esc(tune.tempo)}</text>`);
  }

  let out = host.childNodes.map((c) => (c as ShimElement).outerHTML).join('');
  // vexflow 把颜色写死成黑 —— 换成站上的配色
  out = out.replace(/fill="black"/g, 'fill="currentColor"').replace(/stroke="black"/g, 'stroke="currentColor"');
  out = out.replace(/fill="#999999"/g, `fill="${theme.stave}"`).replace(/stroke="#999999"/g, `stroke="${theme.stave}"`);
  out = withFont(out, FONT_STACK);
  // svg 根上的 style="width:…;height:…" 会把尺寸钉死 —— 去掉
  out = out.replace(/\sstyle="[^"]*"/, '');
  // 文字插在 <svg> 之后
  out = out.replace(/(<svg\b[^>]*>)/, `$1${textBits.join('')}`);
  // currentColor → 具体颜色(SVG 单独存在时 currentColor 就是黑)
  out = out.replace(/currentColor/g, theme.ink);
  // 点谱上的音 → 选中源码里的对应几个字
  out = annotateNotes(out, tune.notes, /<g class="vf-stavenote"[^>]*>/g);
  out = withBackground(out, theme, width, height);
  out = setSize(out, width, height);
  out = ensureSvgNs(out);
  out = ensureViewBox(out);
  return out;
}

/**
 * 一个 ABC 音 → 一个 vexflow 的音。
 *
 * 升降号:ABC 里显式写出的才画(而且跟调号不一样才画);调号里的那个
 * 由谱号处的调号标出,音上不重复画。小节里出现过一次之后,同名的音不再画。
 */
function makeNote(Vex: VexNS, n: AbcNote, state: Record<string, string>, tune: AbcTune, transpose = 0): StaveNoteLike {
  const beats = beatsOf(n.units, tune.unit);
  const { duration, dots } = vexDuration(beats);
  // vexflow 的时值写法:基本值 + 附点('d' 一个/两个)+ 类型('r' 是休止)
  // —— 不是 "q." 那种写法(那是 abcjs 的记法)
  const durStr = duration + (dots ? 'd'.repeat(dots) : '') + (n.rest ? 'r' : '');

  const keys: string[] = [];
  const accidentals: (string | undefined)[] = [];
  for (const k of n.keys) {
    const letter = k[0];
    const explicit = k.length > 1 && '#bn'.includes(k[1]) ? k[1] : undefined;
    const implied = state[letter];
    const eff = explicit ?? implied ?? 'n';
    // 音高带上实际的升降(调号里的也算),但不重复画;有移调时先挪音高
    keys.push(transposeKey(`${letter}${eff === 'n' ? '' : eff}/${k.slice(k.indexOf('/') + 1)}`, transpose));
    const showAcc = explicit !== undefined && explicit !== implied;
    if (showAcc) state[letter] = explicit;
    accidentals.push(showAcc ? explicit : undefined);
  }

  const note = new Vex.StaveNote({ keys, duration: durStr });
  accidentals.forEach((a, i) => {
    if (a) note.addModifier(new Vex.Accidental(a), i);
  });
  return note;
}
