// /draw/x-cmd/onepage 一页纸模式(x-cmd-hub/draw#28/#30):markdown(+yfm)进,
// 一张手机分享条状长图出 —— 1800 宽、高度随内容生长。
//
// ── 排版模型(2026-11 重写:清晰的 md 排版引擎,替代像素对位的散常数) ────────
//
// 1. 行盒(line box):每行占「字号 × 行高」的高度;字形在行盒内垂直居中
//    (half-leading 模型),基线 = 行盒顶 + 行高/2 + 0.34em。
// 2. 字号阶梯:全部是基准字号 BODY 的倍数;BODY = 画布宽/25(1800 画布 → 72px,
//    阅读页 420px 下 ≈ 16.8px,恰为手机正文标准)。
// 3. 块间距:全部以「正文行高 UNIT = BODY × LINE」为单位(before/after,支持 0.5)。
//    引擎里没有任何与内容或原图相关的魔法数 —— 想改节奏只动 STYLE 表。
// 4. 折行:atom(拉丁词/CJK 单字)+ 避头尾禁则;行宽按内容宽实测。
// 5. 颜色/字体族集中在 THEME 表(取色源自原图 RGB 实测,仅作主题,不作版式依据)。
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
const PAD_TOP = 96;
const PAD_BOTTOM = 280;

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
// BODY 是唯一基准:字号 = BODY × r;行高 = 字号 × lineH;间距 = UNIT × n
const BODY = W / 25;                  // 72px @1800
const LINE = 1.5;                     // 正文行高(微信文章标准节奏)
const UNIT = BODY * LINE;             // 行距单位 108 —— 所有块间距以此计量

interface Style {
  size: number;                       // 字号(px,已含倍率)
  lineH: number;                      // 行高(倍)
  weight: 400 | 700;
  family: string;
  color: string;
  before?: number;                    // 块上间距(UNIT 倍数)
  after?: number;                     // 块下间距(UNIT 倍数)
  bar?: boolean;                      // 顶级节左缘装饰条
}

const S: Record<string, Style> = {
  title:    { size: BODY * 1.4,  lineH: 1.3, weight: 700, family: F_TITLE, color: THEME.accent, after: 0.5 },
  subtitle: { size: BODY * 0.95, lineH: 1.6, weight: 400, family: F_REG,   color: THEME.accent, before: 0.25, after: 0.4 },
  meta:     { size: BODY * 0.92, lineH: 1.85, weight: 400, family: F_REG,  color: THEME.meta },             // 页头要点:行距即分隔
  h2:       { size: BODY * 1.05, lineH: 1.35, weight: 700, family: F_BOLD, color: THEME.ink, before: 1.4, after: 0.5, bar: true },
  h3:       { size: BODY * 1.0,  lineH: 1.35, weight: 700, family: F_BOLD, color: THEME.ink, before: 1.0, after: 0.4 },
  h4:       { size: BODY * 0.95, lineH: 1.35, weight: 700, family: F_BOLD, color: THEME.meta, before: 0.9, after: 0.4 },
  quote:    { size: BODY * 0.95, lineH: 1.7,  weight: 400, family: F_REG,  color: THEME.meta, before: 0.4, after: 0.6 },
  figcap:   { size: BODY * 0.5,  lineH: 1.5,  weight: 400, family: F_REG,  color: THEME.note, before: 0.25 },
  body:     { size: BODY,        lineH: LINE, weight: 400, family: F_REG,  color: THEME.body, after: 0.5 },
  li:       { size: BODY,        lineH: LINE, weight: 400, family: F_REG,  color: THEME.body, after: 0.2 },
  code:     { size: BODY * 0.7,  lineH: 1.55, weight: 400, family: F_MONO, color: THEME.code, before: 0.4, after: 0.6 },
  footHead: { size: BODY * 1.0,  lineH: 1.35, weight: 700, family: F_BOLD, color: THEME.ink, before: 1.4, after: 0.6, bar: true },
  contact:  { size: BODY,        lineH: LINE, weight: 700, family: F_BOLD, color: THEME.ink, after: 0.3 },
  contactSub: { size: BODY * 0.95, lineH: LINE, weight: 400, family: F_REG, color: THEME.body, after: 0.2 },
  caption:  { size: BODY * 0.45, lineH: 1.5, weight: 400, family: F_REG,  color: THEME.note },
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

function runs(text: string): Run[] {
  const out: Run[] = [];
  for (const m of text.matchAll(/\*\*([^*]+)\*\*|`([^`]+)`|([^*`]+)/g)) {
    if (m[1] !== undefined) out.push({ t: m[1], b: true });
    else if (m[2] !== undefined) out.push({ t: m[2], b: false, m: true });
    else if (m[3] !== undefined && m[3] !== '') out.push({ t: m[3], b: false });
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

// ── 布局器:行盒 → 基线(half-leading),间距全由 STYLE 表推导 ─────────────────

/** 行盒顶 → 该行基线:字形在行盒内垂直居中,基线在 em 中心下方 0.34em。 */
const baseline = (top: number, st: Style): number => top + st.size * st.lineH / 2 + st.size * 0.34;

interface Item { s: string }

/** 居中单行(页脚联系区专用)。 */
function centerLine(text: string, st: Style, y: number): string {
  return `<text x="${W / 2}" y="${baseline(y, st).toFixed(0)}" text-anchor="middle" font-family="${st.family}" font-size="${st.size.toFixed(0)}"${st.weight === 700 ? ' font-weight="700"' : ''} fill="${st.color}">${esc(text)}</text>`;
}

interface ImgInfo { w: number; h: number; data?: string }
function layout(doc: Doc, v: number, imgMap: Record<string, ImgInfo> = {}): { items: Item[]; total: number } {
  const items: Item[] = [];
  const push = (s: string): void => { items.push({ s }); };
  let y = PAD_TOP;

  // 文本块通用:runs → 行 → 逐行 <text>(基线由行盒推导)
  const emitRuns = (rs: Run[], st: Style, maxW = CONTENT, x = MARGIN): void => {
    for (const lineRuns of wrapRuns(rs, st.size, maxW)) {
      const body = lineRuns
        .map((r) => {
          if (r.b) return `<tspan font-family="${F_BOLD}" fill="${THEME.ink}">${esc(r.t)}</tspan>`;
          if (r.m) return `<tspan font-family="${F_MONO}">${esc(r.t)}</tspan>`;
          return esc(r.t);
        })
        .join('');
      push(`<text x="${x}" y="${baseline(y, st).toFixed(0)}" font-family="${st.family}" font-size="${st.size.toFixed(0)}" font-weight="${st.weight}" fill="${st.color}">${body}</text>`);
      y += st.size * st.lineH;
    }
  };
  const emitPlain = (text: string, st: Style, maxW = CONTENT, x = MARGIN): void =>
    emitRuns(runs(text), st, maxW, x);

  // 左缘装饰条:与节头首行行盒同高,左缘出血(主题元素)
  const bar = (top: number, st: Style): void => {
    push(`<rect x="0" y="${(top + st.size * st.lineH * 0.06).toFixed(0)}" width="${W * 0.045}" height="${(st.size * st.lineH * 0.88).toFixed(0)}" fill="${THEME.accent}"/>`);
  };

  // 页头:标题 → 副标题 → 要点 → 分隔带
  const ts = S.title;
  emitPlain(doc.title, ts);
  y += (ts.after ?? 0) * UNIT;
  if (doc.subtitle !== '') {
    y += (S.subtitle.before ?? 0) * UNIT;
    emitPlain(doc.subtitle, S.subtitle);
    y += (S.subtitle.after ?? 0) * UNIT;
  }
  if (doc.bullets.length > 0) {
    for (const b of doc.bullets) emitPlain(b, S.meta);
    y += 0.25 * UNIT;
    push(`<rect x="0" y="${y.toFixed(0)}" width="${W}" height="${(0.5 * UNIT).toFixed(0)}" fill="${THEME.rule}"/>`);
    y += 0.5 * UNIT + 0.6 * UNIT;
  }

  // 正文节
  for (const sec of doc.sections) {
    if (sec.name !== '') {
      const st = sec.minor4 === true ? S.h4 : sec.major ? S.h2 : S.h3;
      y += (st.before ?? 0) * UNIT;
      if (st.bar === true) bar(y, st);
      emitPlain(sec.name, st);
      y += (st.after ?? 0) * UNIT;
    }
    for (const blk of sec.blocks) {
      if (blk.k === 'li') {
        for (const it of blk.items) {
          const numbered = /^\d+[.、)]/.test(it);
          const text = numbered ? it.slice(it.indexOf('.') + 1).trim() : it.replace(/^[-*]\s+/, '');
          const markerW = 0.75 * BODY;
          const lines = wrapRuns(runs(text), S.li.size, CONTENT - markerW);
          lines.forEach((lineRuns, i) => {
            const mk = i === 0
              ? `<text x="${MARGIN}" y="${baseline(y, S.li).toFixed(0)}" font-family="${S.li.family}" font-size="${S.li.size.toFixed(0)}" font-weight="700" fill="${THEME.accent}">${numbered ? it.slice(0, it.indexOf('.')) + '.' : '•'}</text>`
              : '';
            const body = lineRuns
              .map((r) => (r.b ? `<tspan font-family="${F_BOLD}" fill="${THEME.ink}">${esc(r.t)}</tspan>` : esc(r.t)))
              .join('');
            push(`${mk}<text x="${MARGIN + markerW}" y="${baseline(y, S.li).toFixed(0)}" font-family="${S.li.family}" font-size="${S.li.size.toFixed(0)}" font-weight="${S.li.weight}" fill="${S.li.color}">${body}</text>`);
            y += S.li.size * S.li.lineH;
          });
          y += (S.li.after ?? 0) * UNIT;
        }
      } else if (blk.k === 'code') {
        const st = S.code;
        y += (st.before ?? 0) * UNIT;
        const pad = 0.35 * UNIT;
        const lines = wrapCode(blk.lines, st.size, CONTENT - pad * 2);
        const boxH = pad * 2 + lines.length * st.size * st.lineH;
        push(`<rect x="${MARGIN}" y="${y.toFixed(0)}" width="${CONTENT}" height="${boxH.toFixed(0)}" rx="${(0.2 * UNIT).toFixed(0)}" fill="${THEME.codeBg}"/>`);
        for (const l of lines) {
          push(`<text x="${(MARGIN + pad).toFixed(0)}" y="${baseline(y + pad, st).toFixed(0)}" font-family="${st.family}" font-size="${st.size.toFixed(0)}" fill="${st.color}">${esc(l)}</text>`);
          y += st.size * st.lineH;
        }
        y += pad * 2;
        y += (st.after ?? 0) * UNIT;
      } else if (blk.k === 'quote') {
        const st = S.quote;
        y += (st.before ?? 0) * UNIT;
        const indent = 0.5 * UNIT;
        const lines = wrapRuns(runs(blk.text), st.size, CONTENT - indent - 0.4 * UNIT);
        const boxH = lines.length * st.size * st.lineH;
        push(`<rect x="${MARGIN + indent * 0.35}" y="${y.toFixed(0)}" width="6" height="${boxH.toFixed(0)}" fill="${THEME.accent}"/>`);
        for (const lineRuns of lines) {
          const body = lineRuns.map((r) => esc(r.t)).join('');
          push(`<text x="${MARGIN + indent}" y="${baseline(y, st).toFixed(0)}" font-family="${st.family}" font-size="${st.size.toFixed(0)}" fill="${st.color}">${body}</text>`);
          y += st.size * st.lineH;
        }
        y += (st.after ?? 0) * UNIT;
      } else if (blk.k === 'hr') {
        y += 0.5 * UNIT;
        push(`<rect x="${MARGIN}" y="${y.toFixed(0)}" width="${CONTENT}" height="2" fill="#e5e7eb"/>`);
        y += 2 + 0.6 * UNIT;
      } else if (blk.k === 'img') {
        // 图表:居中图块(图表居中规则)。imgMap 提供尺寸与 data-URI;缺省占位
        const info = imgMap[blk.url];
        const maxW = CONTENT;
        let iw = blk.w ?? info?.w ?? maxW * 0.7;
        let ih = blk.h ?? info?.h ?? iw * 0.62;
        if (iw > maxW) { ih = ih * maxW / iw; iw = maxW; }
        const fs = S.figcap;
        y += (0.5 * UNIT);
        const ix = MARGIN + (CONTENT - iw) / 2;
        if (info !== undefined && info.data !== undefined) {
          push(`<image href="${info.data}" x="${ix.toFixed(0)}" y="${y.toFixed(0)}" width="${iw.toFixed(0)}" height="${ih.toFixed(0)}"/>`);
        } else {
          push(`<rect x="${ix.toFixed(0)}" y="${y.toFixed(0)}" width="${iw.toFixed(0)}" height="${ih.toFixed(0)}" rx="8" fill="${THEME.codeBg}"/>`);
          push(`<text x="${(ix + iw / 2).toFixed(0)}" y="${(y + ih / 2).toFixed(0)}" text-anchor="middle" font-family="${F_REG}" font-size="${(BODY * 0.5).toFixed(0)}" fill="${THEME.note}">${esc(blk.alt || 'figure')}</text>`);
        }
        y += ih;
        if (blk.alt !== '') {
          y += (fs.before ?? 0) * UNIT;
          push(centerLine(blk.alt, fs, y));
          y += fs.size * fs.lineH;
        }
        y += 0.5 * UNIT;
      } else if (blk.k === 'table') {
        // 表格轻量呈现:表头粗 + 行内 " · " 连接(真网格排版在路线图)
        const st = S.body;
        y += (st.before ?? 0) * 0.5 * UNIT;
        emitRuns(runs(blk.head.map((h) => `**${h}**`).join('  ·  ')), st);
        for (const row of blk.rows) {
          emitRuns(runs(row.join('  ·  ')), st);
        }
        y += (st.after ?? 0) * UNIT;
      } else if (blk.k === 'p') {
        emitRuns(runs(blk.text), S.body);
        y += (S.body.after ?? 0) * UNIT;
      }
    }
  }

  // 页脚:联系方式(带条)→ 居中联系行 → 居中 QR → 小字说明
  const contact = doc.meta.contact;
  const subLines = [doc.meta.location, doc.meta.website].filter((s): s is string => typeof s === 'string' && s !== '');
  const qrUrl = doc.meta.qr;
  if (contact !== undefined || subLines.length > 0 || qrUrl !== undefined) {
    y += (S.footHead.before ?? 0) * UNIT;
    bar(y, S.footHead);
    emitPlain(doc.meta['contact-title'] ?? '联系方式', S.footHead);
    y += (S.footHead.after ?? 0) * UNIT + 0.4 * UNIT;
    if (contact !== undefined) {
      push(centerLine(contact, S.contact, y));
      y += S.contact.size * S.contact.lineH + (S.contact.after ?? 0) * UNIT;
    }
    for (const sl of subLines) {
      push(centerLine(sl, S.contactSub, y));
      y += S.contactSub.size * S.contactSub.lineH + (S.contactSub.after ?? 0) * UNIT;
    }
    if (qrUrl !== undefined) {
      y += 0.5 * UNIT;
      const q = 0.36 * W;                 // QR 边长 = 画布 36%(≈650,扫码距离友好)
      const qx = (W - q) / 2;
      const qr = renderQR(qrUrl.slice(0, 500), '#000000', '#ffffff', q, q, v, resolveSkin('qr', null, 'light'), undefined, undefined)
        .replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')
        .replace(/<style[\s\S]*?<\/style>/g, '')
        .replace(/<metadata>[\s\S]*?<\/metadata>/g, '')
        .replace(/<a href=[^>]*><text[^>]*>Edit @X-CMD<\/text><\/a>/g, '');
      push(`<g transform="translate(${qx.toFixed(0)}, ${y.toFixed(0)})">${qr}</g>`);
      y += q + 0.4 * UNIT;
      push(centerLine(doc.meta['qr-note'] ?? '扫码了解更多', S.caption, y));
      y += S.caption.size * S.caption.lineH;
    }
  }
  return { items, total: y + PAD_BOTTOM };
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
    `<metadata>${esc(JSON.stringify({ generator: 'draw', template: 'onepage', namespace: 'x-cmd', theme: 'md-engine-v2', version: v.version, title: doc.title }))}</metadata>` +
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
