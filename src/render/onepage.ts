// /draw/x-cmd/onepage 一页纸模式(x-cmd-hub/draw#28):markdown(+yfm 头)进,
// 一张手机分享条状长图出 —— 1800 宽、高度随内容生长。
//
// v3:对照用户原图 X-CMD一页纸.png(1800×14180)逐项像素实测重写(v2 的比例是错的):
//   左边距 216 / 内容宽 ~1340;正文 73.6px 蓝灰(#808fa5),行距 108,段距 ~122
//   标题(即 wordmark)/副标题/顶级节左缘装饰条 蓝 #3f78f6;节头黑粗,无序号
//   页脚白底居中:联系方式黑行 + 居中 QR(530)+ 灰小字 —— 无深色块
// 独立模块(仅公共工具);SVG 端 CJK 走系统字体栈,PNG 端由 png.ts 挂 Noto 子集。
import { ApiError } from '../specs/index.js';
import { resolveVersion } from '../version.js';
import { esc, textW } from './svg.js';
import { renderQR } from './qr.js';
import { resolveSkin } from '../styles/index.js';
import { INTER_FACE_CSS } from '../styles/inter.js';
import { BANNER_FACE_CSS } from './banner.js';   // 标题品牌字重(浏览器端 @font-face;resvg 端 png.ts 已挂)
import { FONT } from '../theme.js';
import type { DrawResult } from './query.js';

const W = 1800;                     // 与原图同宽(手机 2x)
const MX = 216;                     // 左边距(原图实测 x=216)
const CR = 1554;                    // 内容右缘(原图右边距 ~246,刻意不对称,同原图)
const CW = CR - MX;                 // 内容宽 ~1338 → 正文每行 ~20 字(微信长图节奏)
const H_MAX = 40000;                // 条状 sanity 上限
const PAD_BOTTOM = 300;             // 底部留白(原图 ~330)

// 原图取色(RGB 实测 —— 勿转灰度分析,v3 曾把蓝色全丢):标题/副标题/左缘装饰条
// 是蓝 #3f78f6;节头纯黑粗体;正文蓝灰 #808fa5;页头要点 #686868;页脚联系行黑;
// QR 说明 #9e9d9d;QR 模块黑。原图列表点近不可见(≥250),这里给极浅蓝灰仅作分隔
const C_ACCENT = '#3f78f6';
const C_BULLET = '#686868';
const C_BODY = '#808fa5';
const C_HEAD = '#000000';
const C_DOT = '#b8bfcc';
const C_NOTE = '#9e9d9d';

const F_TITLE = "'DrawInterBold','DrawCJKBold',Inter,'PingFang SC','Hiragino Sans GB','Microsoft YaHei','Noto Sans CJK SC',sans-serif"; // 原图标题为重字重
const F_REG = "'DrawInter','DrawCJK',Inter,'PingFang SC','Hiragino Sans GB','Microsoft YaHei','Noto Sans CJK SC',sans-serif";
const F_BOLD = "'DrawInterBold','DrawCJKBold',Inter,'PingFang SC','Hiragino Sans GB','Microsoft YaHei','Noto Sans CJK SC',sans-serif";
const F_MONO = "'DrawMono',ui-monospace,Menlo,Consolas,monospace";

// 字号/节奏(原图实测):正文 73.6(18 字填满 1324px)/行距108/段extra 79;标题 120
// (Inter cap≈87 同原图);副标题 73/90;要点 73/135;节头 73 粗;代码 58/80;页脚说明 32
const FS_TITLE = 100, P_TITLE = 128;  // 原图标题 cap 实测 73px(Inter Bold cap 比 0.727 → 100)
const FS_SUB = 73, P_SUB = 90;
const FS_BODY = 73, P_BODY = 108, X_PARA = 79;
const P_BULLET = 135;
const FS_CODE = 48, P_CODE = 66;  // 代码块比正文小一档(58 太大,长 URL 折行碎)
const GAP_MAJOR = 290;              // 顶级节(带装饰条)上方 extra(原图 300-400;短文档取下限免稀疏)

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
    // 行内 `code` 反引号仅是 markdown 标记,长图上按纯文本呈现(围栏行除外)
    if (!/^```/.test(lines[0])) {
      for (let i = 0; i < lines.length; i++) lines[i] = lines[i].replace(/`([^`]*)`/g, '$1');
    }
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
    const listItems = lines.filter((l) => /^([-*]|\d+[.、)])\s+/.test(l));
    if (listItems.length === lines.length) {
      // 有序列表保留「1.」标记随文渲染;无序列表由版式画点
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

// ── 版式:一次走版产出带绝对 y 的图元;高度自然生长(条状无缩放) ───────────────

interface Item { s: string }
function layout(doc: Doc, v: number): { items: Item[]; total: number } {
  const items: Item[] = [];
  const push = (s: string): void => { items.push({ s }); };
  let y = 180;                        // 原图标题带顶 ~180(顶部留白同量级)

  // 标题即 wordmark:100px 灰;左缘灰装饰条(x3-82,h110)与标题带对齐
  const barAt = (bandTop: number): void => {
    push(`<rect x="3" y="${(bandTop - 30).toFixed(0)}" width="80" height="110" fill="${C_ACCENT}"/>`); // 原图:条顶高出字面 ~30-37,底至基线
  };
  const titleText = doc.title.replace(/[–—]/g, '-');  // 原图用短横(en/em dash 在该字号太宽)
  for (const l of wrap(titleText, FS_TITLE, CW)) {
    barAt(y);
    push(`<text x="${MX}" y="${(y + FS_TITLE * 0.87).toFixed(0)}" font-family="${F_TITLE}" font-size="${FS_TITLE}" fill="${C_ACCENT}">${esc(l)}</text>`);
    y += P_TITLE;
  }
  y += 30;
  if (doc.subtitle) {
    for (const l of wrap(doc.subtitle, FS_SUB, CW)) {
      push(`<text x="${MX}" y="${(y + FS_SUB * 0.87).toFixed(0)}" font-family="${F_REG}" font-size="${FS_SUB}" fill="${C_ACCENT}">${esc(l)}</text>`);
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
          const numbered = /^\d+[.、)]/.test(it);        // 有序列表自带「1.」标记,不再画点
          ls.forEach((l, i) => {
            const dot = i === 0 && !numbered ? `<circle cx="${MX - 19}" cy="${(y + FS_BODY * 0.5).toFixed(0)}" r="7" fill="${C_DOT}"/>` : '';
            push(`${dot}<text x="${MX}" y="${(y + FS_BODY * 0.87).toFixed(0)}" font-family="${F_REG}" font-size="${FS_BODY}" fill="${C_BODY}">${esc(l)}</text>`);
            y += i === ls.length - 1 ? P_BULLET : P_BODY;
          });
        }
        y += X_PARA - (P_BULLET - P_BODY);
      } else if (blk.k === 'code') {
        // 代码块:比正文小一档,词优先折行(URL 等超长 token 才硬切),续行悬挂
        // 缩进 60 —— 一眼看出哪些行是同一条命令的延续。
        // 宽度按 textW(Inter)计:PNG 端 resvg 的 DrawMono 家族名不匹配会回退
        // Inter(浏览器端真 mono 0.6em 只会更窄),两引擎都不溢出(#24 待修字体名)
        y += 24;
        const IND = 60;                 // 续行悬挂缩进
        const emitCode = (t: string, cont: boolean): void => {
          push(`<text x="${MX + 8 + (cont ? IND : 0)}" y="${(y + FS_CODE * 0.9).toFixed(0)}" font-family="${F_MONO}" font-size="${FS_CODE}" fill="${C_BULLET}">${esc(t)}</text>`);
          y += P_CODE;
        };
        for (const l of blk.lines) {
          const hard = l.replace(/\s+$/, '');
          if (hard === '') { y += P_CODE / 2; continue; }
          let cur = '';
          let w = 0;
          let cont = false;
          const limit = (): number => CW - 16 - (cont ? IND : 0);
          for (const word of hard.split(' ')) {
            const ww = textW(word, FS_CODE);
            if (ww > limit()) {
              // 超长 token(整条 URL 一类):先吐已积累,再逐字符硬切
              if (cur !== '') { emitCode(cur, cont); cont = true; cur = ''; w = 0; }
              let piece = '';
              let pw = 0;
              for (const ch of word) {
                const c = textW(ch, FS_CODE);
                if (pw + c > limit() && piece !== '') {
                  emitCode(piece, cont);
                  cont = true;
                  piece = ch;
                  pw = c;
                } else {
                  piece += ch;
                  pw += c;
                }
              }
              cur = piece;
              w = pw;
              continue;
            }
            const sp = cur === '' ? 0 : textW(' ', FS_CODE);
            if (w + sp + ww > limit() && cur !== '') {
              emitCode(cur, cont);
              cont = true;
              cur = word;
              w = ww;
            } else {
              cur += (cur === '' ? '' : ' ') + word;
              w += sp + ww;
            }
          }
          if (cur !== '') emitCode(cur, cont);
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
      const qr = renderQR(qrUrl.slice(0, 500), '#000000', '#ffffff', bw, bh, v, resolveSkin('qr', null, 'light'), undefined, undefined)
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
    `<style>${INTER_FACE_CSS}${BANNER_FACE_CSS}</style>` +
    `<metadata>${esc(JSON.stringify({ generator: 'draw', template: 'onepage', namespace: 'x-cmd', theme: 'strip-v3', version: v.version, title: doc.title }))}</metadata>` +
    `<rect width="${W}" height="${HT}" fill="#ffffff"/>` +
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
export function renderOnepageFromUrl(url: URL): DrawResult {
  const raw = url.searchParams.get('d');
  if (raw === null || raw.trim() === '') {
    throw new ApiError(400, '"d" (urlencoded markdown) or "src" (http url of the markdown) is required, e.g. d=' + encodeURIComponent('---\ntitle: Hello\n---\n## 简介\n第一段…') + ' (long docs: POST the body or src=<github blob url>)');
  }
  if (raw.length > 16000) throw new ApiError(400, `"d" is ${raw.length} chars (max 16000); POST the markdown or use ?src= instead`);
  return render(raw, url);
}

/** POST 通道:body 即 markdown(长度由 readBody 上限兜底),长文/CJK 全文走这里。 */
export function renderOnepageFromMarkdown(md: string, url: URL): DrawResult {
  return render(md, url);
}

// ── ?src= 远程取文(参考 x-cmd/ppt 的三步逻辑,#28) ────────────────────────────
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
    // /{owner}/{repo}/(blob|raw)/{ref}/{path...} → raw 直链
    const m = u.pathname.match(/^\/([^/]+)\/([^/]+)\/(?:blob|raw)\/(.+)$/);
    if (m) return `https://raw.githubusercontent.com/${m[1]}/${m[2]}/${m[3]}${u.search}`;
  }
  return u.toString();
}

/** GET ?src=<http url>:服务端取 markdown(≤64KB,文本类)再渲染 —— 长文放 GitHub,链接进 one。 */
export async function renderOnepageFromSrc(src: string, url: URL): Promise<DrawResult> {
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
  return render(body, url);
}
