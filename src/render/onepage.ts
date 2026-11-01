// /draw/x-cmd/onepage 一页纸模式(x-cmd-hub/draw#28):markdown(+yfm 头)进,
// 一张手机分享条状长图出 —— 1800 宽、高度随内容生长。
//
// v3:对照用户原图 X-CMD一页纸.png(1800×14180)逐项像素实测重写(v2 的比例是错的):
//   左边距 216 / 内容宽 ~1340;正文 65px 灰(#8d8d8d),行距 108,段距 ~122
//   标题(即 wordmark)100px 灰 #757575,副标题 68px 同灰
//   节头与正文同字号、仅加粗变深(#2f2f2f),无「一、二、」序号(原图没有)
//   顶级节(##)左缘灰色装饰条(x3-82,h110);次级节(###/整段粗体)无条
//   页脚白底居中:联系方式粗体行 + 灰行 + 居中 QR(530)+ 小字说明 —— 无深色块
// 独立模块(仅公共工具);SVG 端 CJK 走系统字体栈,PNG 端由 png.ts 挂 Noto 子集。
import { ApiError } from '../specs/index.js';
import { resolveVersion } from '../version.js';
import { esc, textW } from './svg.js';
import { renderQR } from './qr.js';
import { resolveSkin } from '../styles/index.js';
import { INTER_FACE_CSS } from '../styles/inter.js';
import { FONT } from '../theme.js';
import type { DrawResult } from './query.js';

const W = 1800;                     // 与原图同宽(手机 2x)
const MX = 216;                     // 左边距(原图实测 x=216)
const CR = 1554;                    // 内容右缘(原图右边距 ~246,刻意不对称,同原图)
const CW = CR - MX;                 // 内容宽 ~1338 → 正文每行 ~20 字(微信长图节奏)
const H_MAX = 40000;                // 条状 sanity 上限
const PAD_BOTTOM = 300;             // 底部留白(原图 ~330)

// 原图取色(墨色像素中位数实测):标题/副标题 #757575,要点 #686868,正文 #8d8d8d,
// 粗体节头 <#3a → #2f2f2f,装饰条 #5a5a5a,页脚小字 #989898
const C_TITLE = '#757575';
const C_BULLET = '#686868';
const C_BODY = '#8d8d8d';
const C_HEAD = '#2f2f2f';
const C_BAR = '#5a5a5a';
const C_DOT = '#9e9e9e';
const C_NOTE = '#989898';

const F_REG = "'DrawInter','DrawCJK',Inter,'PingFang SC','Hiragino Sans GB','Microsoft YaHei','Noto Sans CJK SC',sans-serif";
const F_BOLD = "'DrawInterBold','DrawCJKBold',Inter,'PingFang SC','Hiragino Sans GB','Microsoft YaHei','Noto Sans CJK SC',sans-serif";
const F_MONO = "'DrawMono',ui-monospace,Menlo,Consolas,monospace";

// 字号/节奏(全部原图实测):正文 65/行距108/段extra 79;标题 100;副标题 68/90;
// 要点 65/135;节头 65 粗;代码 54/76;页脚说明 32
// 字号/节奏(原图实测):正文 73.6(18 字填满 1324px)/行距108/段extra 79;标题 120
// (Inter cap≈87 同原图);副标题 73/90;要点 73/135;节头 73 粗;代码 58/80;页脚说明 32
const FS_TITLE = 120, P_TITLE = 150;
const FS_SUB = 73, P_SUB = 90;
const FS_BODY = 73, P_BODY = 108, X_PARA = 79;
const P_BULLET = 135;
const FS_CODE = 58, P_CODE = 80;
const GAP_MAJOR = 330;              // 顶级节(带装饰条)上方 extra,同原图(~300-400)

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

// 行内混排折行(带粗体标记):先剥标记折行,再按行重织 tspan
function wrapMixed(text: string, fs: number, maxW: number): string[] {
  const plain = text.replace(/\*\*/g, '');
  const lines = wrap(plain, fs, maxW);
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
        if (buf !== '') svg += curB === true ? `<tspan font-family="${F_BOLD}" fill="${C_HEAD}">${esc(buf)}</tspan>` : esc(buf);
        curB = f.b;
        buf = '';
      }
      buf += f.ch;
    }
    if (buf !== '') svg += curB === true ? `<tspan font-family="${F_BOLD}" fill="${C_HEAD}">${esc(buf)}</tspan>` : esc(buf);
    out.push(svg);
  }
  return out;
}

// ── markdown 子集解析(yfm + 页头 + 节 + 段落/粗体小节/列表/代码块) ─────────────

interface Doc {
  meta: Record<string, string>;
  title: string;
  subtitle: string;
  bullets: string[];                 // 页头要点列表(首个节之前的 - 列表)
  sections: { name: string; major: boolean; blocks: Block[] }[];
}
type Block = { k: 'p'; text: string } | { k: 'li'; items: string[] } | { k: 'code'; lines: string[] };

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
  // 首节前的散段归入无名节(副标题只来自 yfm,不吞正文)
  const ensureBody = (): Doc['sections'][number] => {
    if (cur === undefined) {
      cur = { name: '', major: false, blocks: [] };
      sections.push(cur);
    }
    return cur;
  };
  for (const raw of body.split(/\n{2,}/)) {
    const lines = raw.split('\n').map((l) => l.trim()).filter((l) => l !== '' && l !== '---');
    if (lines.length === 0) continue;
    // 围栏代码块:首行 ``` 开,块内空行并入代码(逐行剥围栏)
    if (/^```/.test(lines[0])) {
      const codeLines = raw.split('\n').slice(1).filter((l) => !/^```/.test(l.trim()));
      ensureBody().blocks.push({ k: 'code', lines: codeLines });
      continue;
    }
    if (/^#{1,3}\s+/.test(lines[0])) {
      const lvl = lines[0].match(/^#+/)![0].length; // ##/# = 顶级(带装饰条),### = 次级
      cur = { name: lines[0].replace(/^#+\s+/, '').replace(/\*\*/g, '').trim(), major: lvl <= 2, blocks: [] };
      sections.push(cur);
      lines.shift();
      if (lines.length === 0) continue;
    }
    const listItems = lines.filter((l) => /^[-*]\s+/.test(l));
    if (listItems.length === lines.length) {
      const items = listItems.map((l) => l.replace(/^[-*]\s+/, ''));
      if (cur === undefined) bullets.push(...items); // 首节前的列表 = 页头要点
      else cur.blocks.push({ k: 'li', items });
    } else {
      ensureBody().blocks.push({ k: 'p', text: lines.join(' ') });
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
  let y = 180;                        // 原图标题带顶 ~180(顶部留白同量级)

  // 标题即 wordmark:100px 灰;左缘灰装饰条(x3-82,h110)与标题带对齐
  const barAt = (bandTop: number): void => {
    push(`<rect x="3" y="${(bandTop - 22).toFixed(0)}" width="80" height="110" fill="${C_BAR}"/>`);
  };
  for (const l of wrap(doc.title, FS_TITLE, CW)) {
    barAt(y);
    push(`<text x="${MX}" y="${(y + FS_TITLE * 0.87).toFixed(0)}" font-family="${F_REG}" font-size="${FS_TITLE}" fill="${C_TITLE}">${esc(l)}</text>`);
    y += P_TITLE;
  }
  y += 30;
  if (doc.subtitle) {
    for (const l of wrap(doc.subtitle, FS_SUB, CW)) {
      push(`<text x="${MX}" y="${(y + FS_SUB * 0.87).toFixed(0)}" font-family="${F_REG}" font-size="${FS_SUB}" fill="${C_TITLE}">${esc(l)}</text>`);
      y += P_SUB;
    }
    y -= 12;                          // 原图:副标题末行带底 → 首要点带顶 ~15px
  }
  // 页头要点列表:浅灰圆点 + #686868 文本(原图:点 ~13px 紧贴文本左)
  if (doc.bullets.length > 0) {
    for (const b of doc.bullets) {
      const ls = wrap(b, FS_BODY, CW);
      ls.forEach((l, i) => {
        const dot = i === 0 ? `<circle cx="${MX - 19}" cy="${(y + FS_BODY * 0.5).toFixed(0)}" r="7" fill="${C_DOT}"/>` : '';
        push(`${dot}<text x="${MX}" y="${(y + FS_BODY * 0.87).toFixed(0)}" font-family="${F_REG}" font-size="${FS_BODY}" fill="${C_BULLET}">${esc(l)}</text>`);
        y += i === ls.length - 1 ? P_BULLET : P_BODY;
      });
    }
  }

  // 节:## = 顶级(左缘装饰条 + 粗体),###/整段粗体 = 次级(仅粗体);节头与正文
  // 同字号(原图如此,层级靠粗细与颜色,不靠字号)
  doc.sections.forEach((sec, si) => {
    if (sec.name !== '') {
      y += sec.major ? GAP_MAJOR - P_BODY : X_PARA;
      if (sec.major) barAt(y);
      for (const l of wrap(sec.name, FS_BODY, CW)) {
        push(`<text x="${MX}" y="${(y + FS_BODY * 0.87).toFixed(0)}" font-family="${F_BOLD}" font-size="${FS_BODY}" fill="${C_HEAD}">${esc(l)}</text>`);
        y += P_BODY;
      }
      y += X_PARA;                    // 节头下方 ~80(原图 125-65)
    } else if (si > 0) {
      y += X_PARA;
    }
    for (const blk of sec.blocks) {
      if (blk.k === 'li') {
        for (const it of blk.items) {
          const ls = wrap(it, FS_BODY, CW);
          ls.forEach((l, i) => {
            const dot = i === 0 ? `<circle cx="${MX - 19}" cy="${(y + FS_BODY * 0.5).toFixed(0)}" r="7" fill="${C_DOT}"/>` : '';
            push(`${dot}<text x="${MX}" y="${(y + FS_BODY * 0.87).toFixed(0)}" font-family="${F_REG}" font-size="${FS_BODY}" fill="${C_BODY}">${esc(l)}</text>`);
            y += i === ls.length - 1 ? P_BULLET : P_BODY;
          });
        }
        y += X_PARA - (P_BULLET - P_BODY);
      } else if (blk.k === 'code') {
        y += 20;
        for (const l of blk.lines) {
          push(`<text x="${MX + 8}" y="${(y + FS_CODE).toFixed(0)}" font-family="${F_MONO}" font-size="${FS_CODE}" fill="${C_BULLET}">${esc(l.replace(/\s+$/, ''))}</text>`);
          y += P_CODE;
        }
        y += 60;
      } else {
        const rs = runs(blk.text);
        const onlyBold = rs.length === 1 && rs[0].b;          // 整段加粗 → 次级节头
        if (onlyBold) {
          for (const l of wrap(rs[0].t, FS_BODY, CW)) {
            push(`<text x="${MX}" y="${(y + FS_BODY * 0.87).toFixed(0)}" font-family="${F_BOLD}" font-size="${FS_BODY}" fill="${C_HEAD}">${esc(l)}</text>`);
            y += P_BODY;
          }
          y += X_PARA;
        } else {
          for (const l of wrapMixed(blk.text, FS_BODY, CW)) {
            push(`<text x="${MX}" y="${(y + FS_BODY * 0.87).toFixed(0)}" font-family="${F_REG}" font-size="${FS_BODY}" fill="${C_BODY}">${l}</text>`);
            y += P_BODY;
          }
          y += X_PARA;
        }
      }
    }
  });

  // 页脚(白底,同原图):「联系方式」顶级节(带条)→ 居中 粗体联系行 + 灰行
  // → 居中 QR(视觉 530)→ 居中小字说明。无深色块。
  const contact = doc.meta.contact;
  const subLines = [doc.meta.location, doc.meta.website].filter((s): s is string => typeof s === 'string' && s !== '');
  const qrUrl = doc.meta.qr;
  if (contact !== undefined || subLines.length > 0 || qrUrl !== undefined) {
    y += 130;                          // 原图:末段带底 → 联系方式带顶 ~174
    barAt(y);
    push(`<text x="${MX}" y="${(y + FS_BODY * 0.87).toFixed(0)}" font-family="${F_BOLD}" font-size="${FS_BODY}" fill="${C_HEAD}">${esc(doc.meta['contact-title'] ?? '联系方式')}</text>`);
    y += P_BODY + X_PARA + 90;
    if (contact !== undefined) {
      push(`<text x="${W / 2}" y="${(y + FS_BODY * 0.87).toFixed(0)}" text-anchor="middle" font-family="${F_BOLD}" font-size="${FS_BODY}" fill="${C_HEAD}">${esc(contact)}</text>`);
      y += P_BODY + 20;
    }
    for (const s of subLines) {
      push(`<text x="${W / 2}" y="${(y + FS_BODY * 0.87).toFixed(0)}" text-anchor="middle" font-family="${F_REG}" font-size="${FS_BODY}" fill="${C_BODY}">${esc(s)}</text>`);
      y += P_BODY + 20;
    }
    if (qrUrl !== undefined) {
      // renderQR 卡片几何:码区仅占盒宽 0.42/盒高 0.71,按目标视觉 530 反推盒尺寸;
      // 剥掉 svgDoc 外壳带入的 Edit 角标/皮肤 vars/metadata(#27 角标不适用于一页纸)
      const q = 530;
      const bw = Math.ceil(q / 0.42), bh = Math.ceil(q / 0.71);
      const qrTop = y + 20;           // 上一行带底 → 码顶(原图几乎紧贴,~50)
      const qr = renderQR(qrUrl.slice(0, 500), '#1a1a1a', '#ffffff', bw, bh, v, resolveSkin('qr', null, 'light'), undefined, undefined)
        .replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')
        .replace(/<style[\s\S]*?<\/style>/g, '')
        .replace(/<metadata>[\s\S]*?<\/metadata>/g, '')
        .replace(/<a href=[^>]*><text[^>]*>Edit @X-CMD<\/text><\/a>/g, '');
      push(`<g transform="translate(${((W - bw) / 2).toFixed(0)}, ${(qrTop - (bh - q) / 2).toFixed(0)})">${qr}</g>`);
      y = qrTop + q + 85;             // 码底 → 说明行带顶(原图 ~84)
      push(`<text x="${W / 2}" y="${(y + 30).toFixed(0)}" text-anchor="middle" font-family="${F_REG}" font-size="32" fill="${C_NOTE}">${esc(doc.meta['qr-note'] ?? '扫码了解更多')}</text>`);
      y += 32;
    }
  }
  return { items, total: y + PAD_BOTTOM };
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
    `<metadata>${esc(JSON.stringify({ generator: 'draw', template: 'onepage', namespace: 'x-cmd', theme: 'strip-v3', version: v.version, title: doc.title }))}</metadata>` +
    `<rect width="${W}" height="${HT}" fill="#ffffff"/>` +
    lay.items.map((it) => it.s).join('') +
    `</svg>`;
  return { svg, version: v.version, cacheControl: v.cacheControl };
}

/**
 * GET /draw/x-cmd/onepage?d=<urlencoded markdown> — ≤16000 字符(CJK percent-encoding
 * 放大 ~3 倍,长文走 POST)。POST /draw/x-cmd/onepage:body 即 markdown,直接渲染返回
 * SVG(不存储)。条状长图:1800 宽,高度随内容生长;yfm:title/subtitle/contact/
 * location/website/qr/qr-note。
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
