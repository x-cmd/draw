// /draw/banner 主题化 OG 封面:复刻 codeberg x-cmd/img 的 satori 版发布封面为
// draw 手写 SVG 路线。v2 按 render.mjs JSX 逐项对照重写 —— 标题=release 功能口号
// (Inter Bold 72 #000),左下角 tag = "X-CMD - v<version>"(Inter Medium #4f514c),
// 终端 #181818 r18 只有三色点 + "❯ bin rest" 命令(FiraCode,#28c840/#4fb9f3/#f4f4f4,
// 白色块光标),纸底 = 对角 #fff→#F0EDD8 暖黄渐变 + 点阵颗粒(滤镜会撞免费档 CPU,
// 见 git 史:feTurbulence/feDropShadow 在 3MP 光栅化实测 1102)。
import { ApiError, clip } from '../specs/index.js';
import { resolveVersion } from '../version.js';
import { esc, textW } from './svg.js';
import { FONT, TAB } from '../theme.js';
import { INTER_FACE_CSS } from '../styles/inter.js';
import { FONT_FILES_B64 } from '../styles/fonts-banner.js';
import type { DrawResult } from './query.js';

const W = 1200;
const H = 630;

// ── cli-release-v1 视觉锁(全部数值对照 render.mjs 常量) ─────────────────────
const TITLE = { size: 72, left: 64, inkTop: 83, lh: 1.1, ls: -1.4, cap: 52 }; // cap≈0.727em
const TAG = { size: 34, bottom: 75 };             // 左下 "X-CMD - vX.Y.Z"
const TERM = { x: 553, y: 328, w: 720, h: 400, r: 18, pad: 24, dot: 17, dotGap: 10, barH: 18, mb: 52 };
const CMD = { size: 34 };                          // FiraCode 0.6em 等宽 advance
const CURSOR = { w: 24, h: 47 };
const TINT = '#f0edd8';                            // 锁定色,勿调(paper-bg.mjs)

const INK = '#000000';
const TAG_C = '#4f514c';
const TERM_BG = '#181818';
const C_GREEN = '#28c840';
const C_BLUE = '#4fb9f3';
const C_FG = '#f4f4f4';

// banner 字体的 @font-face(浏览器端);resvg 端走 png.ts 的 fontBuffers
const BANNER_FACE_CSS = FONT_FILES_B64
  .map((f) => `@font-face{font-family:'${f.family}';src:url(data:font/woff2;base64,${f.woff2}) format('woff2');font-weight:500 700}`)
  .join('');

function seedOf(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rng(seed: number): () => number {
  let s = seed || 1;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}

// 标题:显式换行(\n 或 |)优先;单串则单行放不下再按词拆两行(最均衡断点)
function titleLines(title: string): string[] {
  const raw = title.trim();
  if (raw === '') throw new ApiError(400, '"title" is required, e.g. title=Validate files|against JSON Schema');
  const maxW = W - TITLE.left - 24;
  if (raw.includes('\n') || raw.includes('|')) {
    const ls = raw.split(/\n|\|/).map((l) => l.trim()).filter(Boolean);
    if (ls.length > 2) throw new ApiError(400, 'title takes at most 2 lines');
    for (const l of ls) {
      if (textW(l, TITLE.size) > maxW) throw new ApiError(400, `title line "${clip(l, 24)}" is too wide at 72px; shorten it`);
    }
    return ls;
  }
  const words = raw.split(/\s+/);
  for (const w of words) {
    if (textW(w, TITLE.size) > maxW) throw new ApiError(400, `title word "${clip(w, 24)}" is too wide at 72px; shorten it`);
  }
  if (textW(raw, TITLE.size) <= maxW) return [raw];
  if (words.length === 1) throw new ApiError(400, 'title is too long for one line at 72px; use fewer/shorter words');
  let best: [string, string] | undefined;
  let bestGap = Infinity;
  for (let i = 1; i < words.length; i++) {
    const l1 = words.slice(0, i).join(' ');
    const l2 = words.slice(i).join(' ');
    if (textW(l1, TITLE.size) > maxW || textW(l2, TITLE.size) > maxW) continue;
    const gap = Math.abs(textW(l1, TITLE.size) - textW(l2, TITLE.size));
    if (gap < bestGap) { bestGap = gap; best = [l1, l2]; }
  }
  if (best === undefined) throw new ApiError(400, 'title cannot be split into two lines that both fit at 72px; shorten it');
  return best;
}

// 纸底:复刻 paper-bg.mjs 的渐变数学 —— t = clip(yy + lean*(xx-0.5)*yy),hold 区恒白,
// 再 γ0.82 下沉;lean ∈ ±{0,0.22,0.42} 由种子决定。SVG 侧用「倾斜线性渐变 + 按曲线
// 采样停靠点」等价表达(纯矢量零滤镜),叠加原有点阵颗粒。
function paper(seed: number): string {
  const r = rng(seed);
  const leans = [-0.42, -0.22, 0, 0.22, 0.42];
  const lean = leans[Math.floor(r() * leans.length)];
  const hold = 0.28 + Math.floor(r() * 3) * 0.02;
  const T = 64;
  let dots = '';
  for (let i = 0; i < 12; i++) {
    dots += `<circle cx="${(r() * T).toFixed(1)}" cy="${(r() * T).toFixed(1)}" r="0.7" fill="#6b5d3f" fill-opacity="${(0.03 + r() * 0.07).toFixed(3)}"/>`;
  }
  // 停靠点:t 均匀采样 9 点,经 hold + γ0.82 映射后与 #F0EDD8 混色
  const stops: string[] = [];
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    const tt = Math.pow(Math.min(1, Math.max(0, (t - hold) / (1 - hold))), 0.82);
    const mix = (c: number): number => Math.round(255 + (c - 255) * tt);
    const hex = (n: number): string => n.toString(16).padStart(2, '0');
    const [tr, tg, tb] = [0xf0, 0xed, 0xd8]; // #F0EDD8 锁定色
    stops.push(`<stop offset="${t.toFixed(3)}" stop-color="#${hex(mix(tr))}${hex(mix(tg))}${hex(mix(tb))}"/>`);
  }
  return (
    `<linearGradient id="tint" x1="0" y1="0" x2="${lean.toFixed(2)}" y2="1">${stops.join('')}</linearGradient>` +
    `<rect width="${W}" height="${H}" fill="url(#tint)"/>` +
    `<pattern id="grain" width="${T}" height="${T}" patternUnits="userSpaceOnUse">${dots}</pattern>` +
    `<rect width="${W}" height="${H}" fill="url(#grain)"/>`
  );
}

// 终端投影:参考 = BLUR56 左重 diffuse halo。矢量等价 = 椭圆径向渐变光晕
// (中心左移 90px + OFFSET_Y 8,向外透明衰减)——柔和无边线,零滤镜零位图。
function termShadow(): string {
  const { x, y, w, h } = TERM;
  const cx = Math.round(x + w / 2 - 50);
  const cy = y + h / 2 + 8;
  return (
    `<radialGradient id="halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#3a3325" stop-opacity="0.08"/><stop offset="0.5" stop-color="#3a3325" stop-opacity="0.045"/><stop offset="1" stop-color="#3a3325" stop-opacity="0"/></radialGradient>` +
    `<ellipse cx="${cx}" cy="${cy}" rx="${Math.round(w * 0.72)}" ry="${Math.round(h * 0.68)}" fill="url(#halo)"/>`
  );
}

// 终端:#181818 圆角出血 + 三色点 + ❯ bin rest + 白块光标(FiraCode 真等宽 0.6em)
function terminal(cmd: string): string {
  const { x, y, w, h, r, pad, dot, dotGap, barH, mb } = TERM;
  const innerX = x + pad;
  const dotsY = y + pad + barH / 2;
  const cmdTop = y + pad + barH + mb;                 // 命令行顶部
  const cmdBase = Math.round(cmdTop + CURSOR.h / 2 + CMD.size * 0.36);
  const parts = cmd.trim().split(/\s+/);
  const bin = parts[0] ?? '';
  const restStr = parts.slice(1).join(' ');
  const em = 0.6 * CMD.size;                          // FiraCode 每字符 advance
  const seq = `❯ ${bin}${restStr ? ` ${restStr}` : ''} `;
  const cursorX = innerX + Math.round(seq.length * em);
  return (
    termShadow() +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${TERM_BG}"/>` +
    `<circle cx="${x + pad + dot / 2}" cy="${dotsY}" r="${dot / 2}" fill="#ff5f57"/>` +
    `<circle cx="${x + pad + dot / 2 + dot + dotGap}" cy="${dotsY}" r="${dot / 2}" fill="#febc2e"/>` +
    `<circle cx="${x + pad + dot / 2 + 2 * (dot + dotGap)}" cy="${dotsY}" r="${dot / 2}" fill="#28c840"/>` +
    `<text x="${innerX}" y="${cmdBase}" font-family="DrawMono" font-size="${CMD.size}" fill="${C_FG}"><tspan fill="${C_GREEN}">❯</tspan> <tspan fill="${C_BLUE}">${esc(bin)}</tspan>${restStr ? ` <tspan>${esc(restStr)}</tspan>` : ''}</text>` +
    `<rect x="${cursorX}" y="${cmdTop}" width="${CURSOR.w}" height="${CURSOR.h}" fill="${C_FG}"/>`
  );
}

// 主题注册表:新主题 = 注册一个纯函数;未知 theme 400 列出可用项
interface BannerParams { title: string; version: string; cmd: string; }
const THEMES: Record<string, (p: BannerParams, url: URL) => DrawResult> = {
  'cli-release-v1'(p, url) {
    const v = resolveVersion(url.searchParams.get('v'));
    const cmd = p.cmd.trim();
    if (cmd.length === 0) throw new ApiError(400, '"cmd" is required, e.g. cmd=x upgrade');
    if (cmd.length > 28) throw new ApiError(400, `"cmd" is ${cmd.length} chars; the terminal keeps at most 28`);
    const ver = p.version.trim();
    if (ver === '') throw new ApiError(400, '"version" is required, e.g. version=0.10.13 (shown as X-CMD - vX.Y.Z)');
    const version = ver.startsWith('v') ? ver : `v${ver}`;
    const lines = titleLines(p.title.replace(/%0A/gi, '\n'));
    const seed = seedOf(`${lines.join(' ')}|${version}|${cmd}`);

    const parts: string[] = [paper(seed), terminal(cmd)];
    // 标题:Inter Bold 72 #000,ink 顶 83,行距 1.1(baseline = inkTop + cap + i*lh*size)
    const base1 = TITLE.inkTop + TITLE.cap;
    lines.forEach((l, i) => {
      const y = Math.round(base1 + i * TITLE.lh * TITLE.size);
      parts.push(`<text x="${TITLE.left}" y="${y}" font-family="DrawInterBold" font-size="${TITLE.size}" letter-spacing="${TITLE.ls}" fill="${INK}">${esc(l)}</text>`);
    });
    // 左下 tag: X-CMD - vX.Y.Z
    const tagY = H - TAG.bottom;
    parts.push(`<text x="${TITLE.left}" y="${tagY}" font-family="DrawInterMedium" font-size="${TAG.size}" letter-spacing="-0.1" fill="${TAG_C}" style="${TAB}">X-CMD - ${esc(version)}</text>`);

    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}" role="img" aria-label="${esc(lines.join(' '))}">` +
      `<style>${INTER_FACE_CSS}${BANNER_FACE_CSS}</style>` +
      `<metadata>${esc(JSON.stringify({ generator: 'draw', template: 'banner', theme: 'cli-release-v1', version: v.version, title: lines.join('\n'), release: version, cmd }))}</metadata>` +
      parts.join('') + `</svg>`;
    return { svg, version: v.version, cacheControl: v.cacheControl };
  },
};

/**
 * GET /draw/banner?theme=cli-release-v1&title=<slogan[|slogan2]>&version=<x.y.z>&cmd=<cmd>
 * 主题化 OG 封面(1200×630);位图加 &format=png(og:image 尺寸,scale=2 为 retina)。
 * @throws ApiError(400) with a corrective example on bad input
 */
export function renderBannerFromUrl(url: URL): DrawResult {
  const theme = url.searchParams.get('theme') ?? 'cli-release-v1';
  const render = THEMES[theme];
  if (!render) {
    throw new ApiError(400, `"theme" must be one of: ${Object.keys(THEMES).join(', ')}. Got: ${JSON.stringify(theme)}`);
  }
  return render(
    { title: url.searchParams.get('title') ?? '', version: url.searchParams.get('version') ?? '', cmd: url.searchParams.get('cmd') ?? '' },
    url,
  );
}
