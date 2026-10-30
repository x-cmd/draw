// /draw/banner 主题化 OG 封面:复刻 codeberg x-cmd/img 的 satori 版发布封面为
// draw 手写 SVG 路线 —— 1200×630 纸纹底 + Inter 大标题 + 假终端窗 + 版本黄旗。
// 零 satori/零 DOM;文字测宽用 textW(Inter advance 表),字体走内嵌子集,
// 位图经共用 ?format=png 通道(OG 封面用 &scale=2)。
import { ApiError, clip } from '../specs/index.js';
import { resolveVersion } from '../version.js';
import { esc, textW } from './svg.js';
import { FONT, TAB } from '../theme.js';
import { INTER_FACE_CSS } from '../styles/inter.js';
import type { DrawResult } from './query.js';

const W = 1200;
const H = 630;
const TITLE_SIZE = 72;
const TITLE_LEFT = 64;
const TITLE_TOP = 72;
const TAG_SIZE = 34;
const CMD_SIZE = 34;
const MONO = "'DrawInter','Fira Code',ui-monospace,SFMono-Regular,Menlo,monospace";

// 终端窗:右下,窗底探出画布(参考实现的视觉锁)
const TERM = { x: 553, y: 328, w: 594, h: 318, r: 14 };
// 黄旗版本徽章:终端左上角平行四边形
const RIBBON = { x: 505, y: 300, w: 168, h: 46, skew: 14 };

const INK = '#1f2328';
const MUTE = '#6b7280';
const PAPER = '#f7f4ed';
const TERM_BG = '#1e2127';
const TERM_FG = '#e6edf3';
const PROMPT_C = '#27c93f';

// 确定性种子:同参数同图(缓存友好);纸纹/晕染位置随内容变化
function seedOf(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rng(seed: number): () => number {
  let s = seed || 1;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}

// 标题按词折行:单行优先,装不下拆两行(宽度最均衡断点);单词超宽 400
function wrapTitle(title: string): string[] {
  const words = title.trim().split(/\s+/);
  if (words.length === 0 || words[0] === '') throw new ApiError(400, '"title" is required for theme=cli-release-v1, e.g. title=Release v0.10.13');
  const maxW = W - TITLE_LEFT - 24;
  for (const w of words) {
    if (textW(w, TITLE_SIZE) > maxW) throw new ApiError(400, `title word "${clip(w, 24)}" is too wide at 72px; shorten it`);
  }
  const whole = words.join(' ');
  if (textW(whole, TITLE_SIZE) <= maxW) return [whole];
  if (words.length === 1) throw new ApiError(400, 'title is too long for one line at 72px; use fewer/shorter words');
  let best: [string, string] | undefined;
  let bestGap = Infinity;
  for (let i = 1; i < words.length; i++) {
    const l1 = words.slice(0, i).join(' ');
    const l2 = words.slice(i).join(' ');
    if (textW(l1, TITLE_SIZE) > maxW || textW(l2, TITLE_SIZE) > maxW) continue;
    const gap = Math.abs(textW(l1, TITLE_SIZE) - textW(l2, TITLE_SIZE));
    if (gap < bestGap) { bestGap = gap; best = [l1, l2]; }
  }
  if (best === undefined) throw new ApiError(400, 'title cannot be split into two lines that both fit at 72px; shorten it');
  return best;
}

// 纸底:暖白 + 两团极淡暖晕(种子摆放)+ 点阵颗粒。
// 颗粒用 <pattern> 平铺小点阵而非 feTurbulence —— 滤镜在 2400×1260(scale=2)上
// 光栅化会撞爆 Workers 免费档 10ms CPU(实测 1102),点阵是纯贴图,近零成本。
function paper(seed: number): string {
  const r = rng(seed);
  const w1x = Math.round(200 + r() * 800), w1y = Math.round(120 + r() * 200);
  const w2x = Math.round(200 + r() * 800), w2y = Math.round(260 + r() * 220);
  const T = 64; // 点阵 tile
  let dots = '';
  for (let i = 0; i < 12; i++) {
    const dx = (r() * T).toFixed(1);
    const dy = (r() * T).toFixed(1);
    const op = (0.03 + r() * 0.07).toFixed(3);
    dots += `<circle cx="${dx}" cy="${dy}" r="0.7" fill="#6b5d3f" fill-opacity="${op}"/>`;
  }
  return (
    `<rect width="${W}" height="${H}" fill="${PAPER}"/>` +
    `<radialGradient id="w1"><stop offset="0" stop-color="#f5e9c8" stop-opacity="0.55"/><stop offset="1" stop-color="#f5e9c8" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="w2"><stop offset="0" stop-color="#f3ead9" stop-opacity="0.5"/><stop offset="1" stop-color="#f3ead9" stop-opacity="0"/></radialGradient>` +
    `<circle cx="${w1x}" cy="${w1y}" r="420" fill="url(#w1)"/>` +
    `<circle cx="${w2x}" cy="${w2y}" r="380" fill="url(#w2)"/>` +
    `<pattern id="grain" width="${T}" height="${T}" patternUnits="userSpaceOnUse">${dots}</pattern>` +
    `<rect width="${W}" height="${H}" fill="url(#grain)"/>`
  );
}

// 黄旗版本徽章:平行四边形 + 版本号(从 title 抽 vX.Y.Z,抽不到用 tagline 首词)
function ribbon(version: string): string {
  const { x, y, w, h, skew } = RIBBON;
  const p = `M${x + skew} ${y} L${x + w} ${y} L${x + w - skew} ${y + h} L${x} ${y + h} Z`;
  return (
    `<path d="${p}" fill="#ffd866" stroke="#e8b923" stroke-width="1"/>` +
    `<text x="${x + w / 2}" y="${y + h / 2 + 12}" text-anchor="middle" font-size="26" font-weight="600" fill="${INK}" style="${TAB}">${esc(version)}</text>`
  );
}

// 假终端窗:圆角深底 + 双层廉价投影(feDropShadow 的高斯模糊在 scale=2 的 3MP
// 光栅化上撞爆免费档 10ms CPU,实测 1102 —— 用两层偏移半透明圆角矩形叠出软影)
// + 三色点 + x-cmd/bash 标 + 命令 + 块光标
function terminal(cmd: string): string {
  const { x, y, w, h, r } = TERM;
  const barH = 52;
  const innerX = x + 28;
  const innerY = y + barH + 34;
  const parts = cmd.trim().split(/\s+/);
  const bin = parts[0] ?? '';
  const restStr = parts.slice(1).join(' ');
  const prompt = '~ $';
  // 光标定位用 textW(与渲染同一 DrawInter advance 表)——tspan 间空白折叠为单空格,
  // 按实际渲染宽度走,光标才贴住命令末端
  const cursorX = innerX + textW(`${prompt} ${cmd.trim()}`, CMD_SIZE) + 14;
  const shadow =
    `<rect x="${x + 12}" y="${y + 20}" width="${w}" height="${h}" rx="${r}" fill="#3a3325" fill-opacity="0.1"/>` +
    `<rect x="${x + 6}" y="${y + 10}" width="${w}" height="${h}" rx="${r}" fill="#3a3325" fill-opacity="0.12"/>`;
  return (
    shadow +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${TERM_BG}"/>` +
    `<circle cx="${x + 26}" cy="${y + barH / 2}" r="7" fill="#ff5f56"/><circle cx="${x + 50}" cy="${y + barH / 2}" r="7" fill="#ffbd2e"/><circle cx="${x + 74}" cy="${y + barH / 2}" r="7" fill="#27c93f"/>` +
    `<text x="${x + 100}" y="${y + barH / 2 + 11}" font-size="20" font-weight="600" fill="#ffd866">x-cmd</text>` +
    `<text x="${x + w - 24}" y="${y + barH / 2 + 10}" text-anchor="end" font-size="18" fill="#8b949e">bash</text>` +
    `<line x1="${x}" y1="${y + barH}" x2="${x + w}" y2="${y + barH}" stroke="#00000055" stroke-width="1"/>` +
    `<text x="${innerX}" y="${innerY}" font-family="${MONO}" font-size="${CMD_SIZE}" fill="${TERM_FG}"><tspan fill="${PROMPT_C}" font-weight="600">${esc(prompt)}</tspan>  <tspan fill="#79c0ff">${esc(bin)}</tspan>${restStr ? ` <tspan fill="${TERM_FG}">${esc(restStr)}</tspan>` : ''}</text>` +
    `<rect x="${Math.round(cursorX)}" y="${innerY - CMD_SIZE}" width="${Math.round(CMD_SIZE * 0.56)}" height="${CMD_SIZE + 4}" fill="${PROMPT_C}"/>`
  );
}

// 主题注册表:未知 theme 400 列出可用项;新主题 = 注册一个纯函数
interface BannerParams { title: string; tagline?: string; cmd: string; }
const THEMES: Record<string, (p: BannerParams, url: URL) => DrawResult> = {
  'cli-release-v1'(p, url) {
    const v = resolveVersion(url.searchParams.get('v'));
    const cmd = p.cmd.trim();
    if (cmd.length === 0) throw new ApiError(400, '"cmd" is required for theme=cli-release-v1, e.g. cmd=x upgrade');
    if (cmd.length > 30) throw new ApiError(400, `"cmd" is ${cmd.length} chars; the terminal keeps at most 30`);
    const lines = wrapTitle(p.title);
    const seed = seedOf(`${p.title}|${p.tagline ?? ''}|${cmd}`);
    const m = /v\d+\.\d+(\.\d+)?/i.exec(p.title);
    const badge = m ? m[0] : (p.tagline ? clip(p.tagline.split(/\s+/)[0] ?? '', 12) : 'x-cmd');
    const parts: string[] = [paper(seed), ribbon(badge), terminal(cmd)];
    lines.forEach((l, i) => {
      parts.push(`<text x="${TITLE_LEFT}" y="${TITLE_TOP + TITLE_SIZE * (i + 1) - 6}" font-size="${TITLE_SIZE}" font-weight="700" fill="${INK}" letter-spacing="-1" stroke="${INK}" stroke-width="1.2" paint-order="stroke">${esc(l)}</text>`);
    });
    if (p.tagline) {
      parts.push(`<text x="${TITLE_LEFT}" y="${TITLE_TOP + TITLE_SIZE * lines.length + 46}" font-size="${TAG_SIZE}" font-weight="500" fill="${MUTE}">${esc(clip(p.tagline, 60))}</text>`);
    }
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}" role="img" aria-label="${esc(p.title)}">` +
      `<style>${INTER_FACE_CSS}</style>` +
      `<metadata>${esc(JSON.stringify({ generator: 'draw', template: 'banner', theme: 'cli-release-v1', version: v.version, title: p.title, tagline: p.tagline ?? null, cmd }))}</metadata>` +
      parts.join('') + `</svg>`;
    return { svg, version: v.version, cacheControl: v.cacheControl };
  },
};

/**
 * GET /draw/banner?theme=cli-release-v1&title=<...>&cmd=<...>[&tagline=<...>]
 * 主题化 OG 封面;位图加 &format=png&scale=2(2400×1260)。
 * @throws ApiError(400) with a corrective example on bad input
 */
export function renderBannerFromUrl(url: URL): DrawResult {
  const theme = url.searchParams.get('theme') ?? 'cli-release-v1';
  const render = THEMES[theme];
  if (!render) {
    throw new ApiError(400, `"theme" must be one of: ${Object.keys(THEMES).join(', ')}. Got: ${JSON.stringify(theme)}`);
  }
  return render({ title: url.searchParams.get('title') ?? '', tagline: url.searchParams.get('tagline') ?? undefined, cmd: url.searchParams.get('cmd') ?? '' }, url);
}
