// /draw/x-cmd/onepage 一页纸模式(x-cmd-hub/draw#28/#30):markdown(+yfm)进,
// 一张手机分享条状长图出 —— 1800 宽、高度随内容生长。
//
// ── 排版模型 v2.1(墨迹空隙记账) ───────────────────────────────────────────
//
// 1. 韵律唯一:所有字号是 BODY(画布/25)的倍数,所有空隙以 UNIT(一行正文)
//    计量 —— 全页只有一个尺度来源。
// 2. 墨迹记账:块间空隙指「墨迹到墨迹」的视觉距离 —— 引擎自动扣掉行盒
//    half-leading,STYLE 表里的数字就是设计师心智里的数字,不随字号漂移。
// 3. 接近性分组(格式塔):标题 before >> after(≈2.4:1),标题永远归属下文;
//    组内(副标题/列表项)紧,组间(节)松 —— 空隙即结构。
// 4. 对比即层次:字号阶梯 ≥1.25 才可感知(1.5/1.28/1.12/1.0),粗细与颜色
//    只作辅助,不承担层级。
// 5. 折叠不叠加:相邻块空隙取 max(CSS margin-collapse 语义),节奏可预测。
// 6. 行盒:每行占「字号 × 行高」,字形以 1em 居中,基线 = 行盒顶 + 行高/2 + 0.34em;
//    折行 atom(拉丁词/CJK 单字)+ 避头尾禁则,行宽按内容宽实测。
import { ApiError } from '../specs/index.js';
import { resolveVersion } from '../version.js';
import { esc, textW } from './svg.js';
import { renderQR } from './qr.js';
import { resolveSkin } from '../styles/index.js';
import { INTER_FACE_CSS } from '../styles/inter.js';
import { BANNER_FACE_CSS } from './banner.js';   // 标题品牌字重(浏览器端 @font-face;resvg 端 png.ts 已挂)
import { FONT } from '../theme.js';
import type { DrawResult } from './query.js';

// ── 画布与版心 ───────────────────────────────────────────────────────────────
const W = 1800;                        // 画布宽(手机 2x)
const MARGIN = W * 0.12;               // 页边 = 画布 12%(216)
const CONTENT = W - MARGIN * 2;        // 版心 1368
const H_MAX = 40000;
const PAD_TOP = 120;                   // 顶部留白(大标题需呼吸;略小于底部)
const PAD_BOTTOM = 280;                // 底部留白 > 顶部(页面是容器,下缘更松)

// ── 主题(取色源自原图 RGB 实测;只定义"用什么颜色",不定义版式) ────────────────
const THEME = {
  accent: '#3f78f6',     // 标题/副标题/顶级节左缘装饰条
  ink: '#000000',        // 节头、页脚联系行
  body: '#808fa5',       // 正文(蓝灰)
  meta: '#686868',       // 页头要点
  code: '#374151',
  codeBg: '#f5f7fa',
  note: '#9e9d9d',       // 页脚小字
  rule: '#f5f5f5',       // 页头下分隔带
  bg: '#ffffff',
} as const;

const F_TITLE = "'DrawInterBold','DrawCJKBold',Inter,'PingFang SC','Hiragino Sans GB','Microsoft YaHei','Noto Sans CJK SC',sans-serif";
const F_REG = "'DrawInter','DrawCJK',Inter,'PingFang SC','Hiragino Sans GB','Microsoft YaHei','Noto Sans CJK SC',sans-serif";
const F_BOLD = "'DrawInterBold','DrawCJKBold',Inter,'PingFang SC','Hiragino Sans GB','Microsoft YaHei','Noto Sans CJK SC',sans-serif";
const F_MONO = "'DrawMono',ui-monospace,Menlo,Consolas,monospace";

// ── 字号阶梯与样式表 ────────────────────────────────────────────────────────
// BODY 是唯一基准:字号 = BODY × r;行高 = 字号 × lineH。
// 间距 = 视觉空隙(墨迹到墨迹,UNIT 倍数)—— 引擎扣掉 half-leading 后落位,
// 表里的数字即设计稿,不随字号/行高漂移。块间空隙 = max(prev.after, this.before)。
const BODY = W / 25;                  // 72px @1800
const LINE = 1.5;                     // 正文行高(微信文章标准节奏)
const UNIT = BODY * LINE;             // 韵律单位:一行正文(108)—— 所有空隙以此计量

interface Style {
  size: number;                       // 字号(px,已含倍率)
  lineH: number;                      // 行高(倍)
  weight: 400 | 700;
  family: string;
  color: string;
  before?: number;                    // 与上一块墨迹的视觉空隙(UNIT 倍数)
  after?: number;                     // 留给下一块的空隙愿望(UNIT 倍数)
  bar?: boolean;                      // 顶级节左缘装饰条
}

const S: Record<string, Style> = {
  // ── 页头组:title/subtitle/要点/灰带是一个视觉组(组内紧,组间松) ──
  title:      { size: BODY * 1.5,  lineH: 1.25, weight: 700, family: F_TITLE, color: THEME.accent, after: 1.1 },            // 大字下至少留一整行
  subtitle:   { size: BODY * 0.95, lineH: 1.55, weight: 400, family: F_REG,   color: '#7aa3f7', before: 0.4, after: 0.6 },  // 紧跟标题(结组)
  meta:       { size: BODY * 0.92, lineH: 1.85, weight: 400, family: F_REG,   color: '#8894a8', before: 0.6 },  // 要点连排:项间 0.6 UNIT ≈ 2 倍行距节奏
  // ── 节头:before >> after(≈2.4:1)—— 接近性:标题永远归属下文 ──
  h2:         { size: BODY * 1.28, lineH: 1.3,  weight: 700, family: F_BOLD,  color: THEME.ink, before: 2.2, after: 1.0, bar: true },
  h3:         { size: BODY * 1.12, lineH: 1.35, weight: 700, family: F_BOLD,  color: THEME.ink, before: 1.6, after: 0.8 },
  h4:         { size: BODY,        lineH: 1.35, weight: 700, family: F_BOLD,  color: THEME.meta, before: 1.2, after: 0.6 },
  // ── 流体块:段间 ≈ 2× 行间;列表项间略大于行间(结组) ──
  body:       { size: BODY,        lineH: LINE, weight: 400, family: F_REG,   color: THEME.body, after: 0.7 },   // 段间空隙在 after 侧(不声明 before:标题 after 才能精确绑定下文)
  li:         { size: BODY,        lineH: 1.45, weight: 400, family: F_REG,   color: THEME.body, before: 0.4 },
  quote:      { size: BODY * 0.95, lineH: 1.7,  weight: 400, family: F_REG,   color: THEME.meta, before: 0.55, after: 0.7 },
  code:       { size: BODY * 0.78, lineH: 1.55, weight: 400, family: F_MONO,  color: THEME.code, before: 0.55, after: 0.7 },
  boldHead:   { size: BODY,        lineH: 1.4,  weight: 700, family: F_BOLD,  color: THEME.ink,  before: 1.1, after: 0.55 },  // 独立粗体行 = 小节头(上松 2:1 紧)
  figcap:     { size: BODY * 0.5,  lineH: 1.5,  weight: 400, family: F_REG,   color: THEME.note, before: 0.3 },
  // ── 页脚组 ──
  footHead:   { size: BODY,        lineH: 1.35, weight: 700, family: F_BOLD,  color: THEME.ink, before: 2.2, after: 0.7, bar: true },
  contact:    { size: BODY,        lineH: LINE, weight: 700, family: F_BOLD,  color: THEME.ink, before: 0.35 },
  contactSub: { size: BODY * 0.95, lineH: LINE, weight: 400, family: F_REG,   color: THEME.body, before: 0.25 },
  caption:    { size: BODY * 0.45, lineH: 1.5,  weight: 400, family: F_REG,   color: THEME.note, before: 0.35 },
};

// ── 文档模型与 markdown 子集解析(yfm/节/块;onesvg 同用) ──────────────────────

export interface Doc {
  meta: Record<string, string>;
  title: string;
  subtitle: string;
  bullets: string[];                 // 页头要点列表(首个节之前的 - 列表)
  sections: { name: string; major: boolean; minor4?: boolean; blocks: Block[] }[];
}
type Block =
  | { k: 'p'; text: string }              // 段落(行内 **粗** 与 `code`)
  | { k: 'li'; items: string[] }          // 列表(无序/有序)
  | { k: 'code'; lines: string[] }        // 围栏代码块
  | { k: 'quote'; text: string }          // 引用块 > …
  | { k: 'hr' }                           // 水平线 ---/***
  | { k: 'img'; url: string; alt: string; w?: number; h?: number } // 图表:居中图块
  | { k: 'table'; head: string[]; rows: string[][] };              // 表格(轻量呈现)

/** markdown 子集 → Doc。onesvg(Satori 内核)同用此解析。 */
export function parseOnepageDoc(md: string): Doc {
  return parse(md);
}

function parse(md: string): Doc {
  const meta: Record<string, string> = {};
  let body = md.replace(/\r\n/g, '\n');
  const yfm = /^---\n([\s\S]*?)\n---\n?/.exec(body);
  if (yfm) {
    body = body.slice(yfm[0].length);
    for (const m of yfm[1].matchAll(/^([A-Za-z_][\w-]*)\s*:\s*(.+)$/gm)) meta[m[1].toLowerCase()] = m[2].trim();
  }
  let title = meta.title ?? '';
  let subtitle = meta.subtitle ?? '';
  body = body.replace(/^#\s+.+\n?/, (h) => { if (!title) title = h.replace(/^#\s+/, '').trim(); return ''; });
  if (!title) throw new ApiError(400, 'onepage needs a title: yfm `title:` field or a `# heading` line');

  const bullets: string[] = [];
  const sections: Doc['sections'] = [];
  let cur: Doc['sections'][number] | undefined;
  const ensureBody = (): Doc['sections'][number] => {
    if (cur === undefined) {
      cur = { name: '', major: false, blocks: [] };
      sections.push(cur);
    }
    return cur;
  };
  const IMG_RE = /^!\[([^\]]*)\]\((\S+?)(?:\s+=(\d+)x(\d+))?\)$/;
  for (const raw of body.split(/\n{2,}/)) {
    const lines = raw.split('\n').map((l) => l.trim()).filter((l) => l !== '');
    if (lines.length === 0) continue;
    if (/^```/.test(lines[0])) {
      const codeLines = raw.split('\n').slice(1).filter((l) => !/^```/.test(l.trim()));
      ensureBody().blocks.push({ k: 'code', lines: codeLines });
      continue;
    }
    // 水平线:整块只有 --- / *** / ___
    if (lines.every((l) => /^(-{3,}|\*{3,}|_{3,})$/.test(l))) {
      ensureBody().blocks.push({ k: 'hr' });
      continue;
    }
    // 引用块:整块每行以 > 开头
    if (lines.every((l) => l.startsWith('>'))) {
      ensureBody().blocks.push({ k: 'quote', text: lines.map((l) => l.replace(/^>\s?/, '')).join(' ') });
      continue;
    }
    // 表格:首行为 |a|b| 且次行为 |---|---|
    if (lines.length >= 2 && /^\|.*\|$/.test(lines[0]) && /^\|[-: |]+$/.test(lines[1])) {
      const cells = (l: string): string[] => l.slice(1, -1).split('|').map((c) => c.trim());
      ensureBody().blocks.push({ k: 'table', head: cells(lines[0]), rows: lines.slice(2).map(cells) });
      continue;
    }
    if (/^#{1,4}\s+/.test(lines[0])) {
      const lvl = lines[0].match(/^#+/)![0].length; // #/## = 顶级(带装饰条),### 次级,#### 小节
      cur = { name: lines[0].replace(/^#+\s+/, '').replace(/\*\*/g, '').replace(/`([^`]*)`/g, '$1').trim(), major: lvl <= 2, minor4: lvl === 4, blocks: [] } as never;
      sections.push(cur);
      lines.shift();
      if (lines.length === 0) continue;
    }
    // 图表:整块单行 ![alt](url[=WxH])
    if (lines.length === 1) {
      const im = IMG_RE.exec(lines[0]);
      if (im !== null) {
        ensureBody().blocks.push({ k: 'img', url: im[2], alt: im[1], ...(im[3] !== undefined ? { w: Number(im[3]), h: Number(im[4]) } : {}) });
        continue;
      }
    }
    const listItems = lines.filter((l) => /^([-*]|\d+[.、)])\s+/.test(l));
    if (listItems.length === lines.length) {
      const items = listItems.map((l) => l.replace(/^([-*])\s+/, '').replace(/^(\d+[.、)])\s+/, '$1 '));
      if (cur === undefined) bullets.push(...items); // 首节前的列表 = 页头要点
      else cur.blocks.push({ k: 'li', items });
    } else {
      ensureBody().blocks.push({ k: 'p', text: lines.join(' ') });
    }
  }
  if (sections.length === 0 && bullets.length === 0) throw new ApiError(400, 'onepage needs content: sections (`## heading`), paragraphs, or lists');
  return { meta, title, subtitle, bullets, sections };
}

// ── 折行器:atom(拉丁词/CJK 单字)+ 避头尾禁则 ────────────────────────────────
// 行首禁则:这些字符不可居行首;行末禁则:这些字符不可居行末。
// 触发行首禁则时,把上一行行末最后一 atom 带下,标点不孤悬。

const NO_START = new Set([...'。，、；：？！,.:;?)）]】」』”’…%‰']);
const NO_END = new Set([...'([（[【「『“‘$#']);
const ATOM_RE = /[A-Za-z0-9'’\-@.:/#%&+]+|\s+|[^\s]/gu;

interface Run { t: string; b: boolean; m?: boolean }  // b=粗体 m=行内代码(等宽)

// 盘古之白:汉字与拉丁/数字之间自动加一个空格(中文排版惯例;mdnice 等微信
// 排版器同款)。行内 code run 不动(命令必须逐字)。
const HAN = '\u4e00-\u9fff';
function hanSpace(t: string): string {
  return t
    .replace(new RegExp(`([${HAN}])([A-Za-z0-9])`, 'gu'), '$1 $2')
    .replace(new RegExp(`([A-Za-z0-9])([${HAN}])`, 'gu'), '$1 $2');
}

function runs(text: string): Run[] {
  const out: Run[] = [];
  for (const m of text.matchAll(/\*\*([^*]+)\*\*|`([^`]+)`|([^*`]+)/g)) {
    if (m[1] !== undefined) out.push({ t: hanSpace(m[1]), b: true });
    else if (m[2] !== undefined) out.push({ t: m[2], b: false, m: true });
    else if (m[3] !== undefined && m[3] !== '') out.push({ t: hanSpace(m[3]), b: false });
  }
  return out;
}

/** 折行内核:atom 序列 → 行(atom 携带宽度;禁则在断点处生效)。 */
function breakAtoms<T extends { a: string; w: number }>(atoms: T[], maxW: number): T[][] {
  const lines: T[][] = [];
  let line: T[] = [];
  let w = 0;
  for (const at of atoms) {
    if (w + at.w > maxW && line.some((x) => x.a.trim() !== '')) {
      let take = line;
      if (at.a.trim() !== '' && NO_START.has(at.a[0]) && line.length > 1) {
        const last = line[line.length - 1];
        take = line.slice(0, -1);
        line = [last];
        w = last.w;
        if (NO_END.has(last.a[last.a.length - 1]) && take.length > 1) {
          const prev = take[take.length - 1];
          line.unshift(prev);
          w += prev.w;
          take = take.slice(0, -1);
        }
      } else {
        line = [];
        w = 0;
      }
      lines.push(take);
    }
    if (at.a.trim() !== '' || line.some((x) => x.a.trim() !== '')) {
      line.push(at);
      w += at.w;
    }
  }
  if (line.some((x) => x.a.trim() !== '')) lines.push(line);
  return lines;
}

const toAtoms = (text: string, fs: number): { a: string; w: number }[] =>
  [...text.matchAll(ATOM_RE)].map((m) => ({ a: m[0], w: textW(m[0], fs) }));

/** 纯文本折行(标题/要点等)。 */
function wrap(text: string, fs: number, maxW: number): string[] {
  return breakAtoms(toAtoms(text, fs), maxW).map((l) => l.map((x) => x.a).join(''));
}

/** 带粗体标记的段落折行 → 每行 Run[](行内容与禁则一致,粗体位不漂移)。 */
function wrapRuns(rs: Run[], fs: number, maxW: number): Run[][] {
  const atoms: { a: string; w: number; b: boolean; m?: boolean }[] = [];
  for (const r of rs) {
    for (const m of r.t.matchAll(ATOM_RE)) atoms.push({ a: m[0], b: r.b, m: r.m, w: textW(m[0], fs) });
  }
  return breakAtoms(atoms, maxW).map((ls) => {
    const out: Run[] = [];
    for (const x of ls) {
      const lastR = out[out.length - 1];
      if (lastR !== undefined && lastR.b === x.b && lastR.m === x.m) lastR.t += x.a;
      else out.push({ t: x.a, b: x.b, m: x.m });
    }
    return out;
  });
}

// 代码行折行:无禁则(逐字符硬折,续行缩进两空格)
function wrapCode(lines: string[], fs: number, maxW: number): string[] {
  const out: string[] = [];
  for (const l of lines) {
    const hard = l.replace(/\s+$/, '');
    if (hard === '') { out.push(''); continue; }
    let cur = '';
    let w = 0;
    let cont = false;
    for (const ch of hard) {
      const cw = textW(ch, fs);
      if (w + cw > maxW && cur !== '') {
        out.push((cont ? '  ' : '') + cur);
        cont = true;
        cur = ch;
        w = cw;
      } else {
        cur += ch;
        w += cw;
      }
    }
    if (cur !== '') out.push((cont ? '  ' : '') + cur);
  }
  return out;
}

// ── 布局器:墨迹记账 + 空隙折叠 ─────────────────────────────────────────────
// 游标 ink 记「上一块墨迹底」(文本以 1em 计,盒块以盒边计);块间空隙
//   gap = max(prev.after, this.before) × UNIT
// 是纯视觉距离(墨迹到墨迹)—— STYLE 表的数字即设计稿,不随字号漂移。

/** 行盒顶/底到墨迹边缘的 half-leading(字形以 1em 居中于行盒)。 */
const hl = (st: Style): number => st.size * (st.lineH - 1) / 2;

/** 行盒顶 → 该行基线:字形在行盒内垂直居中,基线在 em 中心下方 0.34em。 */
const baseline = (top: number, st: Style): number => top + st.size * st.lineH / 2 + st.size * 0.34;

interface Item { s: string }

/** 居中单行(页脚联系区/图题注专用)。 */
function centerLine(text: string, st: Style, y: number): string {
  return `<text x="${W / 2}" y="${baseline(y, st).toFixed(0)}" text-anchor="middle" font-family="${st.family}" font-size="${st.size.toFixed(0)}"${st.weight === 700 ? ' font-weight="700"' : ''} fill="${st.color}">${esc(text)}</text>`;
}

interface ImgInfo { w: number; h: number; data?: string }
function layout(doc: Doc, v: number, imgMap: Record<string, ImgInfo> = {}): { items: Item[]; total: number } {
  const items: Item[] = [];
  const push = (s: string): void => { items.push({ s }); };
  let ink = PAD_TOP;                     // 上一块墨迹底
  let post = 0;                          // 上一块留下的 after 愿望(UNIT 倍数)

  // 开文本块:视觉空隙 → 首行行盒顶(扣本块 half-leading)
  const openText = (st: Style, before?: number): number => {
    const g = Math.max(post, before ?? st.before ?? 0);
    post = 0;
    return ink + g * UNIT - hl(st);
  };
  const closeText = (st: Style, boxBottom: number): void => { ink = boxBottom - hl(st); };
  // 开盒块(代码框/图/线):墨迹即盒边,无需扣 leading
  const openBox = (before: number): number => {
    const g = Math.max(post, before);
    post = 0;
    return ink + g * UNIT;
  };
  const leave = (n: number): void => { post = n; };

  // 行链:逐行 <text>(基线由行盒推导);返回末行行盒底
  const emitRuns = (rs: Run[], st: Style, top: number, maxW = CONTENT, x = MARGIN): number => {
    for (const lineRuns of wrapRuns(rs, st.size, maxW)) {
      const body = lineRuns
        .map((r) => {
          if (r.b) return `<tspan font-family="${F_BOLD}" fill="${THEME.ink}">${esc(r.t)}</tspan>`;
          if (r.m) return `<tspan font-family="${F_MONO}">${esc(r.t)}</tspan>`;
          return esc(r.t);
        })
        .join('');
      push(`<text x="${x}" y="${baseline(top, st).toFixed(0)}" font-family="${st.family}" font-size="${st.size.toFixed(0)}" font-weight="${st.weight}" fill="${st.color}">${body}</text>`);
      top += st.size * st.lineH;
    }
    return top;
  };
  // 文本块一步到位(段落/标题/要点)
  const textBlock = (rs: Run[], st: Style, maxW = CONTENT, x = MARGIN): void => {
    closeText(st, emitRuns(rs, st, openText(st), maxW, x));
    leave(st.after ?? 0);
  };
  const plainBlock = (text: string, st: Style, maxW = CONTENT, x = MARGIN): void =>
    textBlock(runs(text), st, maxW, x);

  // 左缘装饰条:与节头首行行盒同高,左缘出血(主题元素)
  const bar = (top: number, st: Style): void => {
    push(`<rect x="0" y="${(top + st.size * st.lineH * 0.06).toFixed(0)}" width="${W * 0.045}" height="${(st.size * st.lineH * 0.88).toFixed(0)}" fill="${THEME.accent}"/>`);
  };

  // ── 页头组:标题 → 副标题 → 要点 → 灰带收边 ──
  plainBlock(doc.title, S.title);
  if (doc.subtitle !== '') plainBlock(doc.subtitle, S.subtitle);
  if (doc.bullets.length > 0) {
    for (const b of doc.bullets) plainBlock(b, S.meta);
    const ry = openBox(0.5);
    push(`<rect x="0" y="${ry.toFixed(0)}" width="${W}" height="${(0.5 * UNIT).toFixed(0)}" fill="${THEME.rule}"/>`);
    ink = ry + 0.5 * UNIT;
    leave(0.8);
  }

  // ── 正文节 ──
  for (const sec of doc.sections) {
    if (sec.name !== '') {
      const st = sec.minor4 === true ? S.h4 : sec.major ? S.h2 : S.h3;
      const top = openText(st);
      if (st.bar === true) bar(top, st);
      closeText(st, emitRuns(runs(sec.name), st, top));
      leave(st.after ?? 0);
    }
    for (const blk of sec.blocks) {
      if (blk.k === 'li') {
        const st = S.li;
        for (const it of blk.items) {
          const numbered = /^\d+[.、)]/.test(it);
          const text = numbered ? it.slice(it.indexOf('.') + 1).trim() : it.replace(/^[-*]\s+/, '');
          const markerW = 0.75 * BODY;
          let top = openText(st);
          const mk = `<text x="${MARGIN}" y="${baseline(top, st).toFixed(0)}" font-family="${st.family}" font-size="${st.size.toFixed(0)}" font-weight="700" fill="${THEME.accent}">${numbered ? it.slice(0, it.indexOf('.')) + '.' : '•'}</text>`;
          wrapRuns(runs(text), st.size, CONTENT - markerW).forEach((lineRuns, i) => {
            const body = lineRuns
              .map((r) => (r.b ? `<tspan font-family="${F_BOLD}" fill="${THEME.ink}">${esc(r.t)}</tspan>` : esc(r.t)))
              .join('');
            push(`${i === 0 ? mk : ''}<text x="${MARGIN + markerW}" y="${baseline(top, st).toFixed(0)}" font-family="${st.family}" font-size="${st.size.toFixed(0)}" font-weight="${st.weight}" fill="${st.color}">${body}</text>`);
            top += st.size * st.lineH;
          });
          closeText(st, top);
          leave(0);                         // 项间空隙由下一项的 before(0.4)承担
        }
        leave(S.body.after ?? 0.7);         // 列表块尾:与段落块同级的分离空隙
      } else if (blk.k === 'code') {
        const st = S.code;
        const y = openBox(st.before ?? 0);
        const pad = 0.35 * UNIT;
        const clines = wrapCode(blk.lines, st.size, CONTENT - pad * 2);
        const boxH = pad * 2 + clines.length * st.size * st.lineH;
        push(`<rect x="${MARGIN}" y="${y.toFixed(0)}" width="${CONTENT}" height="${boxH.toFixed(0)}" rx="${(0.2 * UNIT).toFixed(0)}" fill="${THEME.codeBg}"/>`);
        let ty = y + pad;
        for (const l of clines) {
          push(`<text x="${(MARGIN + pad).toFixed(0)}" y="${baseline(ty, st).toFixed(0)}" font-family="${st.family}" font-size="${st.size.toFixed(0)}" fill="${st.color}">${esc(l)}</text>`);
          ty += st.size * st.lineH;
        }
        ink = y + boxH;
        leave(st.after ?? 0);
      } else if (blk.k === 'quote') {
        const st = S.quote;
        const top = openText(st);
        const indent = 0.5 * UNIT;
        const lineList = wrapRuns(runs(blk.text), st.size, CONTENT - indent - 0.4 * UNIT);
        let ty = top;
        for (const lineRuns of lineList) {
          const body = lineRuns.map((r) => esc(r.t)).join('');
          push(`<text x="${MARGIN + indent}" y="${baseline(ty, st).toFixed(0)}" font-family="${st.family}" font-size="${st.size.toFixed(0)}" fill="${st.color}">${body}</text>`);
          ty += st.size * st.lineH;
        }
        // 竖线:墨迹链两端各延伸 0.1 UNIT(光学 padding,消除贴边感)
        const qy = top + hl(st) - 0.1 * UNIT;
        push(`<rect x="${MARGIN + indent * 0.35}" y="${qy.toFixed(0)}" width="6" height="${(ty - hl(st) + 0.2 * UNIT - qy).toFixed(0)}" fill="${THEME.accent}"/>`);
        closeText(st, ty);
        leave(st.after ?? 0);
      } else if (blk.k === 'hr') {
        const y = openBox(0.5);
        push(`<rect x="${MARGIN}" y="${y.toFixed(0)}" width="${CONTENT}" height="2" fill="#e5e7eb"/>`);
        ink = y + 2;
        leave(0.8);
      } else if (blk.k === 'img') {
        // 图表:居中图块(图表居中规则)。imgMap 提供尺寸与 data-URI;缺省占位
        const info = imgMap[blk.url];
        const maxW = CONTENT;
        let iw = blk.w ?? info?.w ?? maxW * 0.7;
        let ih = blk.h ?? info?.h ?? iw * 0.62;
        if (iw > maxW) { ih = ih * maxW / iw; iw = maxW; }
        const y = openBox(0.6);
        const ix = MARGIN + (CONTENT - iw) / 2;
        if (info !== undefined && info.data !== undefined) {
          push(`<image href="${info.data}" x="${ix.toFixed(0)}" y="${y.toFixed(0)}" width="${iw.toFixed(0)}" height="${ih.toFixed(0)}"/>`);
        } else {
          push(`<rect x="${ix.toFixed(0)}" y="${y.toFixed(0)}" width="${iw.toFixed(0)}" height="${ih.toFixed(0)}" rx="8" fill="${THEME.codeBg}"/>`);
          push(`<text x="${(ix + iw / 2).toFixed(0)}" y="${(y + ih / 2).toFixed(0)}" text-anchor="middle" font-family="${F_REG}" font-size="${(BODY * 0.5).toFixed(0)}" fill="${THEME.note}">${esc(blk.alt || 'figure')}</text>`);
        }
        ink = y + ih;
        if (blk.alt !== '') {
          const st = S.figcap;
          const top = openText(st);       // figcap.before 0.3:题注与图结组
          push(centerLine(blk.alt, st, top));
          closeText(st, top + st.size * st.lineH);
          leave(0.5);
        } else {
          leave(0.6);
        }
      } else if (blk.k === 'table') {
        // 表格轻量呈现:表头粗 + 行内 " · " 连接;表头下划线 + 行间发丝线
        const st = S.body;
        let top = openText(st, 0.55);
        top = emitRuns(runs(blk.head.map((h) => `**${h}**`).join('  ·  ')), st, top);
        push(`<rect x="${MARGIN}" y="${(top + 0.06 * UNIT).toFixed(0)}" width="${CONTENT}" height="3" fill="#d8dce4"/>`);
        top += 0.22 * UNIT;
        for (const row of blk.rows) {
          top = emitRuns(runs(row.join('  ·  ')), st, top);
          push(`<rect x="${MARGIN}" y="${(top + 0.03 * UNIT).toFixed(0)}" width="${CONTENT}" height="1" fill="#eef0f4"/>`);
          top += 0.10 * UNIT;
        }
        closeText(st, top);
        leave(0.65);
      } else if (blk.k === 'p') {
        // 独立粗体行(**小节**)按小节头排版:获得「上松下紧」的分组语义
        const st = /^\*\*[^*]+\*\*$/.test(blk.text.trim()) ? S.boldHead : S.body;
        textBlock(runs(blk.text), st);
      }
    }
  }

  // ── 页脚组:联系方式(带条)→ 居中联系行 → 居中 QR → 小字说明 ──
  const contact = doc.meta.contact;
  const subLines = [doc.meta.location, doc.meta.website].filter((s): s is string => typeof s === 'string' && s !== '');
  const qrUrl = doc.meta.qr;
  if (contact !== undefined || subLines.length > 0 || qrUrl !== undefined) {
    const fst = S.footHead;
    const ftop = openText(fst);
    bar(ftop, fst);
    closeText(fst, emitRuns(runs(doc.meta['contact-title'] ?? '联系方式'), fst, ftop));
    leave(fst.after ?? 0);
    for (const [st, text] of [
      ...(contact !== undefined ? [[S.contact, contact] as const] : []),
      ...subLines.map((sl) => [S.contactSub, sl] as const),
    ]) {
      const cy = openText(st);
      push(centerLine(text, st, cy));
      closeText(st, cy + st.size * st.lineH);
      leave(st.after ?? 0);
    }
    if (qrUrl !== undefined) {
      const qy = openBox(0.5);
      const q = 0.36 * W;                 // QR 边长 = 画布 36%(≈650,扫码距离友好)
      const qx = (W - q) / 2;
      const qr = renderQR(qrUrl.slice(0, 500), '#000000', '#ffffff', q, q, v, resolveSkin('qr', null, 'light'), undefined, undefined)
        .replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')
        .replace(/<style[\s\S]*?<\/style>/g, '')
        .replace(/<metadata>[\s\S]*?<\/metadata>/g, '')
        .replace(/<a href=[^>]*><text[^>]*>Edit @X-CMD<\/text><\/a>/g, '');
      push(`<g transform="translate(${qx.toFixed(0)}, ${qy.toFixed(0)})">${qr}</g>`);
      ink = qy + q;
      const capY = openText(S.caption);
      push(centerLine(doc.meta['qr-note'] ?? '扫码了解更多', S.caption, capY));
      closeText(S.caption, capY + S.caption.size * S.caption.lineH);
    }
  }
  return { items, total: ink + PAD_BOTTOM };
}

// ── 渲染入口 ───────────────────────────────────────────────────────────────

function render(md: string, url: URL, imgMap: Record<string, ImgInfo> = {}): DrawResult {
  const v = resolveVersion(url.searchParams.get('v'));
  const doc = parse(md);
  const lay = layout(doc, v.version, imgMap);
  if (lay.total > H_MAX) {
    throw new ApiError(400, `onepage is ${Math.round(lay.total)}px tall (max ${H_MAX}); split the doc`);
  }
  const HT = Math.ceil(lay.total);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${HT}" viewBox="0 0 ${W} ${HT}" font-family="${FONT}" role="img" aria-label="${esc(doc.title)}">` +
    `<style>${INTER_FACE_CSS}${BANNER_FACE_CSS}</style>` +
    `<metadata>${esc(JSON.stringify({ generator: 'draw', template: 'onepage', namespace: 'x-cmd', theme: 'md-engine-v2.1', version: v.version, title: doc.title }))}</metadata>` +
    `<rect width="${W}" height="${HT}" fill="${THEME.bg}"/>` +
    lay.items.map((it) => it.s).join('') +
    `</svg>`;
  return { svg, version: v.version, cacheControl: v.cacheControl };
}

/**
 * GET /draw/x-cmd/onepage?d=<urlencoded markdown> — ≤16000 字符(CJK percent-encoding
 * 放大 ~3 倍,长文走 POST 或 ?src=<github url>)。POST /draw/x-cmd/onepage:body 即
 * markdown,直接渲染返回 SVG(不存储)。条状长图:1800 宽,高度随内容生长;yfm:
 * title/subtitle/contact/location/website/qr/qr-note。
 * @throws ApiError(400) with a corrective example on bad input
 */
export async function renderOnepageFromUrl(url: URL): Promise<DrawResult> {
  const raw = url.searchParams.get('d');
  if (raw === null || raw.trim() === '') {
    throw new ApiError(400, '"d" (urlencoded markdown) or "src" (http url of the markdown) is required, e.g. d=' + encodeURIComponent('---\ntitle: Hello\n---\n## 简介\n第一段…') + ' (long docs: POST the body or src=<github blob url>)');
  }
  if (raw.length > 16000) throw new ApiError(400, `"d" is ${raw.length} chars (max 16000); POST the markdown or use ?src= instead`);
  return renderDoc(raw, url);
}

/** POST 通道:body 即 markdown(长度由 readBody 上限兜底),长文/CJK 全文走这里。 */
export async function renderOnepageFromMarkdown(md: string, url: URL): Promise<DrawResult> {
  return renderDoc(md, url);
}

// ── 图表资源:服务端并行取图 + 尺寸探测(居中图块需先知宽高) ────────────────────

const IMG_MAX = 2 * 1024 * 1024;
const IMG_MAX_COUNT = 8;

/** PNG/JPEG/GIF/WebP 头部尺寸探测(无需解码)。 */
export function imgDims(b: Uint8Array): { w: number; h: number } | undefined {
  const v = new DataView(b.buffer, b.byteOffset, b.byteLength);
  if (b.length > 24 && v.getUint32(0) === 0x89504e47) return { w: v.getUint32(16), h: v.getUint32(20) };          // PNG IHDR
  if (b.length > 10 && b[0] === 0x47 && b[1] === 0x49) return { w: v.getUint16(6, true), h: v.getUint16(8, true) }; // GIF
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {                                                            // JPEG SOF
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
        return { h: v.getUint16(i + 5), w: v.getUint16(i + 7) };
      }
      i += 2 + v.getUint16(i + 2);
    }
    return undefined;
  }
  if (b.length > 30 && v.getUint32(0) === 0x52494646) {                                                            // RIFF…WebP
    const tag = String.fromCharCode(b[12], b[13], b[14]);
    if (tag === 'VP8 ') return { w: v.getUint16(26, true) & 0x3fff, h: v.getUint16(28, true) & 0x3fff };
    if (tag === 'VP8L') {
      const bits = v.getUint32(21, true);
      return { w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (tag === 'VP8X') return { w: (v.getUint32(24, true) & 0xffffff) + 1, h: (v.getUint32(27, true) & 0xffffff) + 1 };
  }
  return undefined;
}

async function resolveImages(md: string): Promise<Record<string, ImgInfo>> {
  const urls = [...md.matchAll(/^!\[[^\]]*\]\((\S+?)(?:\s+=\d+x\d+)?\)$/gm)].map((m) => m[1]).slice(0, IMG_MAX_COUNT);
  const out: Record<string, ImgInfo> = {};
  await Promise.all(urls.map(async (u) => {
    if (!/^https?:\/\//.test(u)) return;
    try {
      const r = await fetch(u, { redirect: 'follow' });
      if (!r.ok) return;
      const buf = new Uint8Array(await r.arrayBuffer());
      if (buf.byteLength > IMG_MAX) return;
      const dims = imgDims(buf);
      if (dims === undefined) return;
      const kind = (r.headers.get('content-type') ?? 'image/png').split(';')[0];
      out[u] = { ...dims, data: `data:${kind};base64,${b64(buf)}` };
    } catch { /* 取不到 → 占位框 */ }
  }));
  return out;
}

const b64 = (b: Uint8Array): string => {
  let s = '';
  const CH = 0x8000;
  for (let i = 0; i < b.length; i += CH) s += String.fromCharCode(...b.subarray(i, i + CH));
  return btoa(s);
};

/** 渲染入口:先并行取图(图表居中需要尺寸),再同步走版。 */
async function renderDoc(md: string, url: URL): Promise<DrawResult> {
  return render(md, url, md.includes('](') ? await resolveImages(md) : {});
}

// ── ?src= 远程取文(参考 x-cmd/ppt 的三步逻辑) ────────────────────────────────
// ① github 地址自动转 raw;② client 端能取就自取(raw.githubusercontent 自带
// ACAO:*);③ 跨域取不到 → /draw/nocors?url= 服务端代取。onepage 的 ?src= 走
// 服务端 fetch,天然无跨域,①只负责把 blob 链接规范成 raw 直链。

const SRC_MAX = 65536; // 源文档上限(比 ?d= 的 16000 放宽一档,POST 仍最宽)

/** github blob/raw 页面链接 → raw.githubusercontent.com 直链;其余原样返回。 */
export function toRawGithub(src: string): string {
  let u: URL;
  try {
    u = new URL(src);
  } catch {
    throw new ApiError(400, `"src" is not a valid URL: ${JSON.stringify(src.slice(0, 120))}`);
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') {
    throw new ApiError(400, `"src" must be http(s), got ${u.protocol}`);
  }
  if (u.hostname === 'github.com' || u.hostname === 'www.github.com') {
    const m = u.pathname.match(/^\/([^/]+)\/([^/]+)\/(?:blob|raw)\/(.+)$/);
    if (m) return `https://raw.githubusercontent.com/${m[1]}/${m[2]}/${m[3]}${u.search}`;
  }
  return u.toString();
}

/** GET ?src=<http url>:服务端取 markdown(≤64KB,文本类)再渲染 —— 长文放 GitHub,链接进 one。 */
export async function renderOnepageFromSrc(src: string, url: URL): Promise<DrawResult> {
  return render(await fetchSrcDoc(src), url);
}

/** ?src= 的取文部分(onepage 与 onesvg 共用):github blob 自动转 raw,校验类型与大小。 */
export async function fetchSrcDoc(src: string): Promise<string> {
  const target = toRawGithub(src);
  let res: Response;
  try {
    res = await fetch(target, {
      headers: { 'user-agent': 'x-cmd-draw/onepage', accept: 'text/plain, text/markdown;q=0.9, */*;q=0.1' },
      redirect: 'follow',
    });
  } catch (e) {
    throw new ApiError(400, `src fetch failed (${e instanceof Error ? e.message : 'network error'}): ${target}`);
  }
  if (!res.ok) {
    throw new ApiError(res.status === 404 ? 404 : 400, `src fetch got ${res.status} for ${target}`);
  }
  const ct = res.headers.get('content-type') ?? '';
  if (/(image|audio|video|font)\//i.test(ct)) {
    throw new ApiError(400, `src is ${ct}, expected markdown/text (github blob links are converted to raw automatically)`);
  }
  const body = await res.text();
  if (body.length > SRC_MAX) {
    throw new ApiError(400, `src doc is ${body.length} chars (max ${SRC_MAX}); POST the markdown instead`);
  }
  return body;
}
