// ABC 记谱法 —— 一个够用的小解析器。
//
// 只为 /draw/vexflow 服务:vexflow 自己不带 ABC 解析器(它的 Parser 是个通用文本解析器,
// 不是 ABC),而 /draw/abcjs 那边是 abcjs 自己解析 —— 两边输入一样(同一段 ABC),
// 画出来是两种记谱风格,那才叫「共鸣」。
//
// 支持的子集(够画绝大多数民谣/练习曲):
//   头:X: 参考号  T: 标题  C: 作曲  K: 调号  M: 拍号  L: 单位时值  Q: 速度
//   体:音 A-G + 升降(# _ =) + 八度(' ,) + 时值(数字 / + 点 / / 减半)
//       休止 z(可见) x(不可见)  和弦 [CEG]  小节线 | || |] [| ||:
// 不支持的(遇到就当没看见,别报错):歌词行、装饰音、演奏指示、多声部。

/** 一个音(和弦就是 chord 里有几个音) */
export interface AbcNote {
  /** 和弦里的各个音(vexflow 的写法:'c/4'、'eb/5'、'f#/4') */
  keys: string[];
  /** 时值:以 L 为单位,几个单位长 */
  units: number;
  /** 休止? */
  rest: boolean;
  /** 明确写出来的升降号:'#' 升 / 'b' 降 / 'n' 还原;没有 = 跟着调号 */
  accidental?: string;
  /** 这个音在**原源码**里的起止位置(点谱上的音 → 选中源码) */
  start: number;
  end: number;
}

export interface AbcTune {
  title?: string;
  composer?: string;
  /** 调号(大调名;'Am' 这种小调会换成它的关系大调) */
  key: string;
  /** 拍号,如 '4/4' */
  meter: string;
  /** 单位时值(全音符 = 1),默认 1/8 */
  unit: number;
  /** 速度标记,原样留着(Q: 那一行) */
  tempo?: string;
  notes: AbcNote[];
  /** 小节线的位置(notes 的下标):bars[i] 之前的音属于第 i 个小节 */
  bars: number[];
}

/** 升号的添加顺序:F C G D A E B */
const SHARP_ORDER = ['f', 'c', 'g', 'd', 'a', 'e', 'b'];
/** 降号的添加顺序:B E A D G C F */
const FLAT_ORDER = ['b', 'e', 'a', 'd', 'g', 'c', 'f'];
/** 五度圈上的大调 —— 下标就是调号里几个升号(几个降号) */
const SHARP_KEYS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#'];
const FLAT_KEYS = ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'];

/** 小调 → 关系大调(画调号用大调那一套) */
const MINOR_TO_MAJOR: Record<string, string> = {
  Am: 'C', Em: 'G', Bm: 'D', Fm: 'Ab', Cm: 'Eb', Gm: 'Bb', Dm: 'F',
  'A#m': 'C#', 'D#m': 'F#', 'G#m': 'B', 'C#m': 'A', 'F#m': 'A#',
};

/** 调号 → 每个字母被升降了什么(没提到的就是自然的) */
export function keyAlterations(key: string): Record<string, string> {
  const out: Record<string, string> = {};
  const s = SHARP_KEYS.indexOf(key);
  if (s > 0) {
    for (const l of SHARP_ORDER.slice(0, s)) out[l] = '#';
    return out;
  }
  const f = FLAT_KEYS.indexOf(key);
  if (f > 0) {
    for (const l of FLAT_ORDER.slice(0, f)) out[l] = 'b';
  }
  return out;
}

/** 调名 → vexflow 的调名(小调换成关系大调) */
export function keyOf(key: string): string {
  const raw = key.trim();
  const rel = MINOR_TO_MAJOR[raw];
  if (rel) return rel;
  return /^[A-G](#|b)?$/.test(raw) ? raw : 'C';
}

/** 单位时值:'1/8' → 0.125(全音符 = 1) */
function unitOf(s: string | undefined): number {
  if (!s) return 0.125;
  const m = /^(\d+)\s*\/\s*(\d+)$/.exec(s.trim());
  if (!m) return 0.125;
  const n = Number(m[1]);
  const d = Number(m[2]);
  if (!n || !d) return 0.125;
  return n / d;
}

/** 拍号:'C' → '4/4','C|' → '2/2' */
function meterOf(s: string | undefined): string {
  if (!s) return '4/4';
  const t = s.trim();
  if (/^c\|?$/i.test(t)) return t.endsWith('|') ? '2/2' : '4/4';
  const m = /^(\d+)\s*\/\s*(\d+)/.exec(t);
  return m ? `${m[1]}/${m[2]}` : '4/4';
}

export class AbcError extends Error {}

/**
 * 解析一段 ABC。
 *
 * @throws AbcError 语法不对的时候(消息里带位置)
 */
export function parseAbc(src: string): AbcTune {
  // 每一行在**原源码**里的起点(点谱上的音要能反查回源码的那几个字)
  const head: Record<string, string> = {};
  const body: { text: string; orig: number }[] = [];
  let inHeader = true;
  let pos = 0;
  for (const seg of src.split(/(?<=\n)/)) {
    const raw = seg.replace(/\r?\n$/, '');
    const start = pos;
    pos += seg.length;
    const line = raw.replace(/%.*$/, '').trim();
    if (!line) continue;
    const m = /^([A-Za-z]):\s*(.*)$/.exec(line);
    if (inHeader && m) {
      const k = m[1].toLowerCase();
      // 同一个头出现多次:后面的覆盖前面的(K: 变调也认)
      head[k] = (head[k] ? head[k] + ' ' : '') + m[2].trim();
      continue;
    }
    inHeader = false;
    body.push({ text: line, orig: start + (raw.length - raw.trimStart().length) });
  }
  // 正文拼起来(用 \n),同时记住每行在正文里的起点 —— 音符的偏移再映射回原源码
  const text = body.map((b) => b.text).join('\n');
  const lineAt = (off: number): number => {
    let acc = 0;
    for (const b of body) {
      if (off < acc + b.text.length) return b.orig + (off - acc);
      acc += b.text.length + 1;
    }
    return body.length ? body[body.length - 1].orig : 0;
  };

  const key = keyOf(head.k ?? 'C');
  const meter = meterOf(head.m);
  const unit = unitOf(head.l);

  const notes: AbcNote[] = [];
  const bars: number[] = [];
  let lastUnits = 1;         // ABC:没写时值的音,沿用上一个音的时值

  let i = 0;
  const isLetter = (c: string): boolean => /[A-Ga-g]/.test(c);

  while (i < text.length) {
    const c = text[i];
    if (c === ' ' || c === '\t') { i++; continue; }
    if (c === '|') {
      // 小节线(|] 结束、||: 反复、[| 开始)—— 记下来,画的时候要断开
      bars.push(notes.length);
      i++;
      while (i < text.length && /[\[\]:|]/.test(text[i])) i++;
      continue;
    }
    if (c === '!') { while (i < text.length && text[i] !== '\n') i++; continue; }
    if (c === '%') { while (i < text.length && text[i] !== '\n') i++; continue; }
    if (c === '"') { // 演奏指示,跳过引号里的
      i++;
      while (i < text.length && text[i] !== '"') i++;
      i++;
      continue;
    }
    if (c === '[') {
      // 和弦:[CEG] —— 每个音各自算时值(和弦里的音时值一样)
      const end = text.indexOf(']', i);
      if (end < 0) throw new AbcError('和弦没有闭合的 "]"');
      const inner = text.slice(i + 1, end);
      const keys: string[] = [];
      let accidental: string | undefined;
      let j = 0;
      while (j < inner.length) {
        const ch = inner[j];
        if (!isLetter(ch)) { j++; continue; }
        const parsed = readPitch(inner, j);
        keys.push(parsed.key);
        accidental = accidental ?? parsed.accidental;
        j = parsed.next;
      }
      // 和弦后面的时值写在 ] 后面
      const dur = readDuration(text, end + 1);
      lastUnits = dur.units ?? lastUnits;
      notes.push({ keys, units: lastUnits, rest: false, accidental, start: lineAt(i), end: lineAt(dur.next) });
      i = dur.next;
      continue;
    }
    if (c === 'z' || c === 'x') {
      const dur = readDuration(text, i + 1);
      lastUnits = dur.units ?? lastUnits;
      notes.push({ keys: [], units: lastUnits, rest: true, start: lineAt(i), end: lineAt(dur.next) });
      i = dur.next;
      continue;
    }
    if (isLetter(c)) {
      const parsed = readPitch(text, i);
      const dur = readDuration(text, parsed.next);
      lastUnits = dur.units ?? lastUnits;
      notes.push({ keys: [parsed.key], units: lastUnits, rest: false, accidental: parsed.accidental, start: lineAt(i), end: lineAt(dur.next) });
      i = dur.next;
      continue;
    }
    // 认不出来的字符:跳过
    i++;
  }

  if (!notes.length) throw new AbcError('这段 ABC 里没有音符');

  return {
    title: head.t,
    composer: head.c,
    key,
    meter,
    unit,
    tempo: head.q,
    notes,
    bars,
  };
}

/**
 * 读一个音:字母 + 升降号 + 八度。
 * ABC 里 C 是中央 C(= c/4),' 升八度 , 降八度。
 */
function readPitch(s: string, i: number): { key: string; accidental?: string; octave: number; next: number } {
  const letter = s[i].toUpperCase();
  let j = i + 1;
  let accidental: string | undefined;
  while (j < s.length && '#_='.includes(s[j])) {
    accidental = s[j] === '#' ? '#' : s[j] === '_' ? 'b' : 'n';
    j++;
  }
  let octave = 0;
  while (j < s.length && (s[j] === "'" || s[j] === ',')) {
    octave += s[j] === "'" ? 1 : -1;
    j++;
  }
  // 音高:小写字母 + 升降号 + /八度(跟 ABC 一致:c/4 是中央 C)
  const key = `${letter.toLowerCase()}${accidental ?? ''}/${4 + octave}`;
  return { key, accidental, octave, next: j };
}

/**
 * 读时值:数字(倍数)、+ 点、/ 减半。
 * 没写就返回 undefined(调用方沿用上一个音的时值)。
 */
function readDuration(s: string, i: number): { units?: number; next: number } {
  let mult = 1;
  let dots = 0;
  let halves = 0;
  let j = i;
  while (j < s.length && /[0-9]/.test(s[j])) {
    mult = mult * Number(s[j]);
    j++;
  }
  while (j < s.length && s[j] === '+') { dots++; j++; }
  while (j < s.length && s[j] === '/') { halves++; j++; }
  if (j === i) return { next: i };
  const units = mult * (1 + 0.5 * dots) / Math.pow(2, halves);
  return { units, next: j };
}

/**
 * 每个音的最终音高,以及**要不要画升降号**。
 *
 * 调号里的升降由谱号处的调号标出,音上不重复画;小节里写出来的才画。
 * 换小节时,小节里的临时升降号作废(调号里的留下)—— 这是 ABC 的规矩。
 */
export interface PitchInfo {
  /** 音高(vexflow 的写法:'c/4'、'f#/4') */
  keys: string[];
  /** 要画的临时升降号:'#' / 'b' / 'n';没有 = 不画 */
  acc?: string;
}

/** 把调号与小节内的临时升降号落到每个音上 */
export function pitchInfo(tune: AbcTune): PitchInfo[] {
  const keyAlts = keyAlterations(tune.key);
  const barAt = new Set(tune.bars);
  const out: PitchInfo[] = [];
  let state: Record<string, string> = { ...keyAlts };
  tune.notes.forEach((n, i) => {
    if (barAt.has(i)) state = { ...keyAlts };
    const keys: string[] = [];
    let acc: string | undefined;
    for (const k of n.keys) {
      const letter = k[0];
      const explicit = k.length > 1 && '#bn'.includes(k[1]) ? k[1] : undefined;
      const implied = state[letter];
      if (explicit !== undefined) state[letter] = explicit;
      const eff = explicit ?? implied ?? 'n';
      const oct = k.slice(k.indexOf('/') + 1);
      keys.push(`${letter}${eff === 'n' ? '' : eff}/${oct}`);
      if (explicit !== undefined && explicit !== implied) acc = explicit;
    }
    out.push({ keys, acc });
  });
  return out;
}

/** 时值(以 L 为单位) → 四分音符拍数 */
export function beatsOf(units: number, unit: number): number {
  return units * unit * 4;
}

/**
 * 四分音符拍数 → vexflow 的时值 + 附点数。
 *
 * 带 n 个附点的时值 = 基本时值 × (2 − 2⁻ⁿ):一个附点 1.5 倍、两个 1.75 倍。
 * 先按「不超过它的最大基本值」定基本时值,再试附点 —— 别用「不是整数就是附点」那种
 * 粗判断:八分音符(0.5 拍)也不是整数,那不是附点(附点是 1.5 / 3 / 0.75 …)。
 */
export function vexDuration(beats: number): { duration: string; dots: number } {
  const table: [number, string][] = [[4, 'w'], [2, 'h'], [1, 'q'], [0.5, '8'], [0.25, '16']];
  for (const [len, name] of table) {
    if (beats < len - 1e-9) continue;
    for (let dots = 0; dots <= 2; dots++) {
      if (Math.abs(len * (2 - Math.pow(2, -dots)) - beats) < 1e-6) return { duration: name, dots };
    }
    // 不是附点:基本值的整数倍
    const ratio = beats / len;
    const rounded = Math.round(ratio);
    if (rounded >= 1 && Math.abs(ratio - rounded) < 1e-6) return { duration: name, dots: 0 };
  }
  return { duration: '16', dots: 0 };
}

/** 音名 → MIDI 号(C4 = 60) */
const SEMITONE: Record<string, number> = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };

/**
 * 把一个音名移调 semis 个半音('c/4' + 2 → 'd/4';'b/4' + 1 → "c/5")。
 *
 * 移调是**半音级的**:调号不变,变了的高度按临时升降号写出来
 * (abcjs 的 visualTranspose 也是这个路子)。
 */
export function transposeKey(key: string, semis: number): string {
  if (!semis) return key;
  const m = /^([a-g])([#b]?)\/(\d+)$/.exec(key);
  if (!m) return key;
  const letter = m[1];
  const acc = m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0;
  const oct = Number(m[3]);
  let n = SEMITONE[letter] + acc + semis;
  let o = oct;
  while (n < 0) { n += 12; o -= 1; }
  while (n > 11) { n -= 12; o += 1; }
  // 用字母 + 临时升降号表示(黑键升号记,白键还原号记)
  const sharp = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];   // 每个半音对应哪个字母升号
  const base = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];     // 每个半音对应的自然音级
  const l = base[n];
  const isSharp = sharp[n] === 1;
  const name = 'cdefgab'[l];
  return `${name}${isSharp ? '#' : ''}/${o}`;
}
