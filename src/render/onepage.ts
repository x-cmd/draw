// /draw/x-cmd/onepage 一页纸模式(x-cmd-hub/draw#28):markdown(+yfm 头)进,
// 一张手机分享条状长图出 —— 窄固定宽、高度随内容自动生长,纯白底极简黑白编辑风
// (miracle-v1,对照用户原图 X-CMD一页纸.png 1800×14180 逐项复刻):
//   页头 = wordmark + 灰描述 + 大黑标题(2-3 行)+ 要点列表
//   节头 = 中文序号「一、」粗体,无色条无分隔线,大留白分隔
//   正文 = 35px/1.8,行内加粗即强调(非卡片);独立粗体小节 44px
//   页脚 = 全宽深色块:左联系方式白字,右白底 QR 卡
// 独立模块(仅公共工具);SVG 端 CJK 走系统字体栈,PNG 端由 png.ts 挂 Noto 子集。
import { ApiError } from '../specs/index.js';
import { resolveVersion } from '../version.js';
import { esc, textW } from './svg.js';
import { renderQR } from './qr.js';
import { resolveSkin } from '../styles/index.js';
import { INTER_FACE_CSS } from '../styles/inter.js';
import { FONT } from '../theme.js';
import type { DrawResult } from './query.js';

const W = 1800;                     // 与原图同宽(手机 2x),矢量无谓缩放
const MX = 150;                     // 左右页边(原图内容宽 ~83%)
const MT = 150;
const GAP_SEC_ABOVE = 180;          // 节头上方大留白(原图节奏)
const GAP_SEC_BELOW = 80;
const FOOT_H = 1150;                // 全宽深色页脚块
const H_MAX = 40000;                // 条状 sanity 上限

const INK = '#1a1a2e';
const BODY_C = '#333333';
const MUTE = '#666666';
const FOOT_BG = '#16161e';

const F_REG = "'DrawInter','DrawCJK',Inter,'PingFang SC','Hiragino Sans GB','Microsoft YaHei','Noto Sans CJK SC',sans-serif";
const F_BOLD = "'DrawInterBold','DrawCJKBold',Inter,'PingFang SC','Hiragino Sans GB','Microsoft YaHei','Noto Sans CJK SC',sans-serif";

const CN_ORD = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五'];

// ── 文本测量与折行(中西混排:CJK 逐字断,拉丁按词断) ─────────────────────────

function wrap(text: string, fs: number, maxW: number): string[] {
  const atoms: string[] = [];
  for (const m of text.matchAll(/[A-Za-z0-9'’\-@.:/#%&+]+|\s+|[^\s]/gu)) atoms.push(m[0]);
  const lines: string[] = [];
  let cur = '';
  let curW = 0;
  for (const a of atoms) {
    const w = textW(a, fs);
    if (curW + w > maxW && cur.trim() !== '') {
      lines.push(cur.trimEnd());
      cur = a.trim() === '' ? '' : a;
      curW = a.trim() === '' ? 0 : w;
    } else if (!(a.trim() === '' && cur === '')) {
      cur += a;
      curW += w;
    }
  }
  if (cur.trim() !== '') lines.push(cur.trimEnd());
  return lines;
}

// 行内 **bold** → runs;行内混排需要逐段 tspan
function runs(text: string): { t: string; b: boolean }[] {
  const out: { t: string; b: boolean }[] = [];
  for (const m of text.matchAll(/\*\*([^*]+)\*\*|([^*]+)/g)) {
    if (m[1] !== undefined) out.push({ t: m[1], b: true });
    else if (m[2] !== undefined && m[2] !== '') out.push({ t: m[2], b: false });
  }
  return out;
}

// ── markdown 子集解析(yfm + 页头 + 中文序号节 + 段落/粗体小节/列表) ───────────

interface Doc {
  meta: Record<string, string>;
  title: string;
  subtitle: string;
  bullets: string[];                 // 页头要点列表(首个节之前的 - 列表)
  sections: { name: string; blocks: Block[] }[];
}
type Block = { k: 'p'; text: string } | { k: 'li'; items: string[] };

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
  body = body.replace(/^\*\*标题\*\*\s*[:：]\s*(.+)\n?/m, (_s, v: string) => { if (!title) title = v.trim(); return ''; });
  body = body.replace(/^\*\*副标题\*\*\s*[:：]\s*(.+)\n?/m, (_s, v: string) => { if (!subtitle) subtitle = v.trim(); return ''; });
  if (!title) throw new ApiError(400, 'onepage needs a title: yfm `title:` field or a `# heading` line');

  const bullets: string[] = [];
  const sections: Doc['sections'] = [];
  let cur: Doc['sections'][number] | undefined;
  for (const raw of body.split(/\n{2,}/)) {
    const lines = raw.split('\n').map((l) => l.trim()).filter((l) => l !== '' && l !== '---');
    if (lines.length === 0) continue;
    if (/^##\s+/.test(lines[0])) {
      cur = { name: lines[0].replace(/^##\s+/, '').replace(/\*\*/g, '').trim(), blocks: [] };
      sections.push(cur);
      lines.shift();
      if (lines.length === 0) continue;
    }
    const listItems = lines.filter((l) => /^[-*]\s+/.test(l));
    if (listItems.length === lines.length) {
      const items = listItems.map((l) => l.replace(/^[-*]\s+/, ''));
      if (!cur) bullets.push(...items);            // 首节前的列表 = 页头要点
      else cur.blocks.push({ k: 'li', items });
    } else if (!cur) {
      // 首节前的散段归入无名节(副标题只来自 yfm/**副标题** 行,不吞正文)
      cur = { name: '', blocks: [{ k: 'p', text: lines.join(' ') }] };
      sections.push(cur);
    } else {
      cur.blocks.push({ k: 'p', text: lines.join(' ') });
    }
  }
  if (sections.length === 0 && bullets.length === 0) throw new ApiError(400, 'onepage needs content: sections (`## heading`), paragraphs, or lists');
  return { meta, title, subtitle, bullets, sections };
}

// ── 版式:一次走版产出带绝对 y 的图元;高度自然生长(条状无缩放) ───────────────

interface Item { s: string }
function layout(doc: Doc, v: number): { items: Item[]; total: number } {
  const items: Item[] = [];
  const push = (s: string): void => { items.push({ s }); };
  const maxW = W - MX * 2;
  let y = MT;

  // 页头:wordmark + 灰描述(website 或 subtitle 前置一行?)
  push(`<text x="${MX}" y="${y + 56}" font-family="${F_BOLD}" font-size="64" fill="${INK}">X-CMD</text>`);
  y += 110;
  if (doc.meta.tagline) {
    push(`<text x="${MX}" y="${y + 30}" font-family="${F_REG}" font-size="30" fill="${MUTE}">${esc(doc.meta.tagline)}</text>`);
    y += 66;
  }
  // 大标题:粗黑 96px,lh 1.25
  const tFs = 96;
  for (const l of wrap(doc.title, tFs, maxW)) {
    push(`<text x="${MX}" y="${(y + tFs).toFixed(0)}" font-family="${F_BOLD}" font-size="${tFs}" fill="${INK}" letter-spacing="-1">${esc(l)}</text>`);
    y += tFs * 1.25;
  }
  y += 26;
  if (doc.subtitle) {
    const sFs = 34;
    for (const l of wrap(doc.subtitle, sFs, maxW)) {
      push(`<text x="${MX}" y="${(y + sFs).toFixed(0)}" font-family="${F_REG}" font-size="${sFs}" fill="${MUTE}">${esc(l)}</text>`);
      y += sFs * 1.6;
    }
  }
  // 页头要点列表(36px,点标,间距 ~70 含行高)
  if (doc.bullets.length > 0) {
    y += 46;
    const bFs = 36;
    for (const b of doc.bullets) {
      const ls = wrap(b, bFs, maxW - 56);
      ls.forEach((l, i) => {
        const dot = i === 0 ? `<circle cx="${MX + 14}" cy="${(y + bFs * 0.62).toFixed(0)}" r="8" fill="${INK}"/>` : '';
        push(`${dot}<text x="${MX + 56}" y="${(y + bFs).toFixed(0)}" font-family="${F_REG}" font-size="${bFs}" fill="${BODY_C}">${esc(l)}</text>`);
        y += bFs * 1.55;
      });
    }
  }

  // 节:中文序号 + 名(62px 粗,无装饰);正文 35px/1.8;独立粗体小节 44px
  const hFs = 62;
  const leadFs = 44;
  const bFs = 35;
  doc.sections.forEach((sec, si) => {
    if (sec.name !== '') {
      y += si === 0 ? GAP_SEC_BELOW : GAP_SEC_ABOVE;
      const label = `${CN_ORD[si] ?? ''}、${sec.name}`;
      push(`<text x="${MX}" y="${(y + hFs * 0.86).toFixed(0)}" font-family="${F_BOLD}" font-size="${hFs}" fill="${INK}">${esc(label)}</text>`);
      y += hFs * 0.86 + GAP_SEC_BELOW;
    }
    for (const blk of sec.blocks) {
      if (blk.k === 'li') {
        for (const it of blk.items) {
          const ls = wrap(it, bFs, maxW - 56);
          ls.forEach((l, i) => {
            const dot = i === 0 ? `<circle cx="${MX + 12}" cy="${(y + bFs * 0.6).toFixed(0)}" r="7" fill="${BODY_C}"/>` : '';
            push(`${dot}<text x="${MX + 50}" y="${(y + bFs).toFixed(0)}" font-family="${F_REG}" font-size="${bFs}" fill="${BODY_C}">${esc(l)}</text>`);
            y += bFs * 1.7;
          });
          y += 18;
        }
      } else {
        const rs = runs(blk.text);
        const onlyBold = rs.length === 1 && rs[0].b;          // 整段加粗 → 独立粗体小节(44px)
        if (onlyBold) {
          for (const l of wrap(rs[0].t, leadFs, maxW)) {
            push(`<text x="${MX}" y="${(y + leadFs).toFixed(0)}" font-family="${F_BOLD}" font-size="${leadFs}" fill="${INK}">${esc(l)}</text>`);
            y += leadFs * 1.5;
          }
        } else {
          for (const l of wrapMixed(blk.text, bFs, maxW)) {
            push(`<text x="${MX}" y="${(y + bFs).toFixed(0)}" font-family="${F_REG}" font-size="${bFs}" fill="${BODY_C}">${l}</text>`);
            y += bFs * 1.8;
          }
        }
      }
      y += 36; // 段间
    }
  });
  y += 90; // 页脚前空

  // 全宽深色页脚块:左联系方式白字堆叠,右白底 QR 卡
  const fy = y;
  push(`<rect x="0" y="${fy}" width="${W}" height="${FOOT_H}" fill="${FOOT_BG}"/>`);
  const fl: string[] = [];
  if (doc.meta.website) fl.push(doc.meta.website);
  if (doc.meta.contact) fl.push(doc.meta.contact);
  fl.forEach((line, i) => {
    push(`<text x="${MX}" y="${(fy + 300 + i * 74).toFixed(0)}" font-family="${F_REG}" font-size="32" fill="#c9c9d4">${esc(line)}</text>`);
  });
  push(`<text x="${MX}" y="${(fy + 300 + fl.length * 74 + 60).toFixed(0)}" font-family="${F_BOLD}" font-size="40" fill="#ffffff">X-CMD</text>`);
  if (doc.meta.qr) {
    const q = 450;
    const qx = W - MX - q;
    push(`<rect x="${qx - 40}" y="${fy + 180}" width="${q + 80}" height="${q + 190}" rx="24" fill="#ffffff"/>`);
    const qr = renderQR(doc.meta.qr.slice(0, 500), '#16161e', '#ffffff', q, q, v, resolveSkin('qr', null, 'light'), undefined, undefined)
      .replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    push(`<g transform="translate(${qx}, ${fy + 220})">${qr}</g>`);
    push(`<text x="${qx + q / 2}" y="${fy + 220 + q + 90}" text-anchor="middle" font-family="${F_REG}" font-size="28" fill="#666666">扫码了解更多</text>`);
  }
  return { items, total: fy + FOOT_H };
}

// 行内混排折行(带粗体标记):先剥标记折行,再按行重织 tspan
function wrapMixed(text: string, fs: number, maxW: number): string[] {
  const plain = text.replace(/\*\*/g, '');
  const lines = wrap(plain, fs, maxW);
  // 逐行重织:把 runs 按字符顺序分配到各行(粗体段用 tspan 包裹)
  const rs = runs(text);
  const flat: { ch: string; b: boolean }[] = [];
  for (const r of rs) for (const ch of r.t) flat.push({ ch, b: r.b });
  const out: string[] = [];
  let idx = 0;
  for (const line of lines) {
    const take = [...line].length;
    let svg = '';
    let curB: boolean | null = null;
    let buf = '';
    for (let i = 0; i < take && idx < flat.length; i++, idx++) {
      const f = flat[idx];
      if (f.b !== curB) {
        if (buf !== '') svg += curB === true ? `<tspan font-family="${F_BOLD}">${esc(buf)}</tspan>` : esc(buf);
        curB = f.b;
        buf = '';
      }
      buf += f.ch;
    }
    if (buf !== '') svg += curB === true ? `<tspan font-family="${F_BOLD}">${esc(buf)}</tspan>` : esc(buf);
    out.push(svg);
  }
  return out;
}

// ── 渲染 ───────────────────────────────────────────────────────────────────

function render(md: string, url: URL): DrawResult {
  const v = resolveVersion(url.searchParams.get('v'));
  const doc = parse(md);
  const lay = layout(doc, v.version);
  if (lay.total > H_MAX) {
    throw new ApiError(400, `onepage is ${Math.round(lay.total)}px tall (max ${H_MAX}); split the doc`);
  }
  const HT = Math.ceil(lay.total);   // 高度取整(条状高度随内容;浮点属性难看且难匹配)
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${HT}" viewBox="0 0 ${W} ${HT}" font-family="${FONT}" role="img" aria-label="${esc(doc.title)}">` +
    `<style>${INTER_FACE_CSS}</style>` +
    `<metadata>${esc(JSON.stringify({ generator: 'draw', template: 'onepage', namespace: 'x-cmd', theme: 'strip-v1', version: v.version, title: doc.title }))}</metadata>` +
    `<rect width="${W}" height="${HT}" fill="#ffffff"/>` +
    lay.items.map((it) => it.s).join('') +
    `</svg>`;
  return { svg, version: v.version, cacheControl: v.cacheControl };
}

/**
 * GET /draw/x-cmd/onepage?d=<urlencoded markdown> — ≤16000 字符(CJK percent-encoding
 * 放大 ~3 倍,长文走 POST)。POST /draw/x-cmd/onepage:body 即 markdown,直接渲染返回
 * SVG(不存储)。条状长图:1800 宽,高度随内容生长;?format=png 出位图(手机分享)。
 * yfm:title/subtitle/tagline/website/contact/qr。
 * @throws ApiError(400) with a corrective example on bad input
 */
export function renderOnepageFromUrl(url: URL): DrawResult {
  const raw = url.searchParams.get('d');
  if (raw === null || raw.trim() === '') {
    throw new ApiError(400, '"d" is required: urlencoded markdown, e.g. d=' + encodeURIComponent('---\ntitle: Hello\n---\n## 简介\n第一段…') + ' (long docs: POST the body)');
  }
  if (raw.length > 16000) throw new ApiError(400, `"d" is ${raw.length} chars (max 16000); POST the markdown instead`);
  return render(raw, url);
}

/** POST 通道:body 即 markdown(长度由 readBody 上限兜底),长文/CJK 全文走这里。 */
export function renderOnepageFromMarkdown(md: string, url: URL): DrawResult {
  return render(md, url);
}
