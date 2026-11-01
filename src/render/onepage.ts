// /draw/x-cmd/onepage 一页纸模式(x-cmd-hub/draw#28):markdown(+yfm 头)进,
// 一张 A4 密排单页 SVG 出;?format=png 出位图(og/打印)。首个主题 miracle-v1
// 复刻奇绩融资一页纸风格 —— 黑字密排、节标题加粗、信息密度极高。
// 独立模块:不依赖其它图表渲染器(仅公共工具 esc/textW 与 qr 部件);
// SVG 端 CJK 走系统字体栈,PNG 端由 png.ts 检测 CJK 后挂 Noto 子集(fonts-cjk.ts)。
// og:yfm `og:` 字段收图片 URL 或 data:image/webp;base64(默认图待定,见 #28);
// data: 形态全端可渲,远程 URL 仅浏览器 SVG 可见(PNG 光栅不回源)。
import { ApiError } from '../specs/index.js';
import { resolveVersion } from '../version.js';
import { esc, textW } from './svg.js';
import { renderQR } from './qr.js';
import { resolveSkin } from '../styles/index.js';
import { INTER_FACE_CSS } from '../styles/inter.js';
import { FONT, TAB } from '../theme.js';
import type { DrawResult } from './query.js';

const W = 1240;                    // A4 纵向(CSS px 基准;scale=2 → 2480×3508 打印)
const H = 1754;
const MX = 88;                     // 左右页边
const MT = 84;                     // 上边
const MB = 72;                     // 下边(页脚带之上)
const FOOT_H = 116;                // 页脚带高度(website/contact + QR)

const INK = '#111111';
const BODY_C = '#1a1a1a';
const MUTE = '#5a5a5a';
const RULE = '#d8d8d8';

// 中西混排字体栈:浏览器走系统 CJK;resvg 走 fontdb 的 DrawCJK/DrawCJKBold
const F_REG = "'DrawInter','DrawCJK',Inter,'PingFang SC','Hiragino Sans GB','Microsoft YaHei','Noto Sans CJK SC',sans-serif";
const F_BOLD = "'DrawInterBold','DrawCJKBold',Inter,'PingFang SC','Hiragino Sans GB','Microsoft YaHei','Noto Sans CJK SC',sans-serif";

// ── 文本测量与折行 ──────────────────────────────────────────────────────────

// 中西混排折行:CJK 逐字可断,拉丁按词断
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

// 行内 **bold** → runs
function runs(text: string): { t: string; b: boolean }[] {
  const out: { t: string; b: boolean }[] = [];
  for (const m of text.matchAll(/\*\*([^*]+)\*\*|([^*]+)/g)) {
    if (m[1] !== undefined) out.push({ t: m[1], b: true });
    else if (m[2] !== undefined && m[2] !== '') out.push({ t: m[2], b: false });
  }
  return out;
}

// ── markdown 子集解析(yfm 头 + 标题块 + H2 节 + 段落/加粗引块/列表) ──────────

interface Doc {
  meta: Record<string, string>;      // yfm:title/subtitle/website/contact/qr/og
  title: string;
  subtitle: string;
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

  const sections: Doc['sections'] = [];
  let cur: Doc['sections'][number] | undefined;
  for (const raw of body.split(/\n{2,}/)) {
    const lines = raw.split('\n').map((l) => l.trim()).filter((l) => l !== '' && l !== '---');
    if (lines.length === 0) continue;
    // 判型在原始行上(段落合并之前):## 节 / 列表 / 段落
    if (/^##\s+/.test(lines[0])) {
      cur = { name: lines[0].replace(/^##\s+/, '').replace(/\*\*/g, '').trim(), blocks: [] };
      sections.push(cur);
      lines.shift();
      if (lines.length === 0) continue;
    }
    if (!cur) { cur = { name: '', blocks: [] }; sections.push(cur); }
    const listItems = lines.filter((l) => /^[-*]\s+/.test(l));
    if (listItems.length === lines.length) {
      cur.blocks.push({ k: 'li', items: listItems.map((l) => l.replace(/^[-*]\s+/, '')) });
    } else {
      cur.blocks.push({ k: 'p', text: lines.join(' ') });
    }
  }
  if (sections.length === 0) throw new ApiError(400, 'onepage needs content: sections (`## heading`), paragraphs, or lists');
  return { meta, title, subtitle, sections };
}

// ── 版式引擎:一次走版,产出带 y 的图元;总高超限先整体缩字号(≥82%),仍超 400 ──

interface Item { s: string; y: number }   // 直接产 SVG 片段 + 基线 y,渲染只做排序拼接
function layout(doc: Doc, mult: number): { items: Item[]; total: number } {
  const fs = (b: number): number => b * mult;
  const maxW = W - MX * 2;
  const items: Item[] = [];
  const push = (s: string, y: number): void => { items.push({ s, y }); };
  let y = MT;

  // og 封面带(data: 全端;远程 URL 浏览器可见)
  if (doc.meta.og) {
    const ogH = 236;
    push(`<image x="${MX}" y="${y}" width="${maxW}" height="${ogH}" href="${esc(doc.meta.og)}" preserveAspectRatio="xMidYMin slice"/>`, y);
    y += ogH + 20 * mult;
  }
  // 页头:主标题 + 副标题 + 粗规
  const tFs = fs(46);
  const tLines = wrap(doc.title, tFs, maxW);
  tLines.forEach((l, i) => {
    push(`<text x="${MX}" y="${(y + tFs * 1.05 + i * tFs * 1.16).toFixed(1)}" font-family="${F_BOLD}" font-size="${tFs.toFixed(1)}" fill="${INK}" letter-spacing="-0.5">${esc(l)}</text>`, y + i * tFs * 1.16);
  });
  y += tLines.length * tFs * 1.16 + 6 * mult;
  if (doc.subtitle) {
    const sFs = fs(23);
    for (const l of wrap(doc.subtitle, sFs, maxW)) {
      push(`<text x="${MX}" y="${(y + sFs).toFixed(1)}" font-family="${F_REG}" font-size="${sFs.toFixed(1)}" fill="${MUTE}">${esc(l)}</text>`, y);
      y += sFs * 1.5;
    }
  }
  y += 8 * mult;
  push(`<line x1="${MX}" y1="${y.toFixed(1)}" x2="${W - MX}" y2="${y.toFixed(1)}" stroke="${INK}" stroke-width="2.5"/>`, y);
  y += 22 * mult;

  // 节:标题(下规)+ 块
  const hFs = fs(21);
  const lFs = fs(17);
  const bFs = fs(15);
  for (const sec of doc.sections) {
    if (sec.name !== '') {
      push(`<text x="${MX}" y="${(y + hFs * 0.9).toFixed(1)}" font-family="${F_BOLD}" font-size="${hFs.toFixed(1)}" fill="${INK}">${esc(sec.name)}</text>`, y);
      y += hFs * 0.9 + 5;
      push(`<line x1="${MX}" y1="${y.toFixed(1)}" x2="${W - MX}" y2="${y.toFixed(1)}" stroke="${RULE}" stroke-width="1"/>`, y);
      y += 13 * mult;
    }
    for (const blk of sec.blocks) {
      if (blk.k === 'li') {
        for (const it of blk.items) {
          const ls = wrap(it, bFs, maxW - 24 * mult);
          ls.forEach((l, i) => {
            push(`<text x="${MX + 24 * mult}" y="${(y + bFs * 0.95).toFixed(1)}" font-family="${F_REG}" font-size="${bFs.toFixed(1)}" fill="${BODY_C}">${i === 0 ? '· ' : ''}${esc(l)}</text>`, y);
            y += bFs * 1.42;
          });
          y += 2 * mult;
        }
      } else {
        const rs = runs(blk.text);
        const lead = rs[0]?.b === true;
        const leadText = lead ? rs[0].t : '';
        const restText = rs.slice(lead ? 1 : 0).map((r) => r.t).join('').trim();
        if (lead && restText) {
          for (const l of wrap(leadText, lFs, maxW)) {
            push(`<text x="${MX}" y="${(y + lFs * 0.95).toFixed(1)}" font-family="${F_BOLD}" font-size="${lFs.toFixed(1)}" fill="${INK}">${esc(l)}</text>`, y);
            y += lFs * 1.5;
          }
          for (const l of wrap(restText, bFs, maxW)) {
            push(`<text x="${MX}" y="${(y + bFs * 0.95).toFixed(1)}" font-family="${F_REG}" font-size="${bFs.toFixed(1)}" fill="${BODY_C}">${esc(l)}</text>`, y);
            y += bFs * 1.42;
          }
        } else {
          for (const l of wrap(blk.text.replace(/\*\*/g, ''), bFs, maxW)) {
            push(`<text x="${MX}" y="${(y + bFs * 0.95).toFixed(1)}" font-family="${F_REG}" font-size="${bFs.toFixed(1)}" fill="${BODY_C}">${esc(l)}</text>`, y);
            y += bFs * 1.42;
          }
        }
      }
      y += 8 * mult; // 块间
    }
    y += 8 * mult; // 节间
  }
  return { items, total: y };
}

// ── 渲染(miracle-v1) ───────────────────────────────────────────────────────

function render(md: string, url: URL): DrawResult {
  const v = resolveVersion(url.searchParams.get('v'));
  const doc = parse(md);
  const availH = H - MB - FOOT_H;
  let lay = layout(doc, 1);
  if (lay.total > availH) {
    const shrink = availH / lay.total;
    if (shrink < 0.82) {
      const over = Math.round((lay.total * 0.82 - availH) / 10) * 10;
      throw new ApiError(400, `onepage overflow: ~${over}px too much even at min font (82%). Cut something — sections: ${doc.sections.map((x) => x.name || '(无名)').join(' / ')}`);
    }
    lay = layout(doc, shrink);
  }

  const parts: string[] = [];
  // 纸底:极淡暖白 + 点阵颗粒(零滤镜纪律)
  const seed = [...doc.title].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  let dots = '';
  for (let i = 0; i < 14; i++) {
    dots += `<circle cx="${((seed * (i + 3) * 977) % 640 / 10).toFixed(1)}" cy="${((seed * (i + 7) * 331) % 640 / 10).toFixed(1)}" r="0.7" fill="#6b5d3f" fill-opacity="0.04"/>`;
  }
  parts.push(
    `<linearGradient id="pw" x1="0" y1="0" x2="0.08" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#faf8f2"/></linearGradient>` +
    `<rect width="${W}" height="${H}" fill="url(#pw)"/>` +
    `<pattern id="gr" width="64" height="64" patternUnits="userSpaceOnUse">${dots}</pattern>` +
    `<rect width="${W}" height="${H}" fill="url(#gr)"/>`,
  );
  parts.push(...lay.items.map((it) => it.s));

  // 页脚带:website/contact + QR(yfm qr:)
  const fy = H - MB - 6;
  parts.push(`<line x1="${MX}" y1="${fy}" x2="${W - MX}" y2="${fy}" stroke="${RULE}" stroke-width="1"/>`);
  const fl = [doc.meta.website, doc.meta.contact].filter(Boolean).join('   ·   ');
  if (fl) parts.push(`<text x="${MX}" y="${fy + 30}" font-family="${F_REG}" font-size="14" fill="${MUTE}">${esc(fl)}</text>`);
  if (doc.meta.qr) {
    const q = 116;
    const qr = renderQR(doc.meta.qr.slice(0, 500), '#1a1a1a', '#ffffff', q, q, v.version, resolveSkin('qr', null, 'light'), undefined, undefined)
      .replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    parts.push(`<g transform="translate(${W - MX - q}, ${fy + 12})">${qr}</g>`);
  }

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}" role="img" aria-label="${esc(doc.title)}">` +
    `<style>${INTER_FACE_CSS}</style>` +
    `<metadata>${esc(JSON.stringify({ generator: 'draw', template: 'onepage', namespace: 'x-cmd', theme: 'miracle-v1', version: v.version, title: doc.title }))}</metadata>` +
    parts.join('') + `</svg>`;
  return { svg, version: v.version, cacheControl: v.cacheControl };
}

/**
 * GET /draw/x-cmd/onepage?d=<urlencoded markdown> — ≤16000 字符(CJK 会被
 * percent-encoding 放大约 3 倍,长文走 POST)。POST /draw/x-cmd/onepage:body 即
 * markdown,直接渲染返回 SVG(不存储)。`?format=png&scale=1|2` 出位图。
 * yfm 头:title/subtitle/website/contact/qr/og(URL 或 data:image/webp;base64)。
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
