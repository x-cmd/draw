// 终端窗口(苹果风格)→ SVG。
//
// 一个圆角窗口:顶上一排红黄绿按钮 + 标题,下面一行命令(带提示符和光标),
// 再下面是输出 —— 输出里的 ANSI 转义序列还原成颜色(ansi.ts)。
//
// 这张图是给人贴进 README 的:一段命令行会话,长得像真的终端截图。

import { parseAnsi, stripAnsi, type AnsRun } from './ansi.js';

export interface TtyOpts {
  /** 窗口宽(字符数)—— 内容的列数上限 */
  cols?: number;
  /** 窗口高(行数)—— 装不下就截断 */
  rows?: number;
  /** 标题栏上的字(缺省用命令) */
  title?: string;
  /** 提示符(缺省 "$ ") */
  prompt?: string;
  theme?: 'dark' | 'light';
  fontSize?: number;
}

const r2 = (v: number): number => Math.round(v * 100) / 100;

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** 两套配色:暗色(终端默认)和亮色 */
const SKIN = {
  dark: {
    bg: '#1C1C1E', bar: '#2A2A2D', border: '#3A3A3E', sep: '#343438',
    text: '#D7D7DC', dim: '#8E8E93', prompt: '#33D17A',
    dot: ['#FF5F57', '#FEBC2E', '#28C840'], shadow: '#000000',
  },
  light: {
    bg: '#F7F7F8', bar: '#ECECEE', border: '#D6D6DA', sep: '#E0E0E4',
    text: '#2A2A2E', dim: '#8A8A8F', prompt: '#1A7F37',
    dot: ['#FF5F57', '#FEBC2E', '#28C840'], shadow: '#000000',
  },
};

/** 一行的显示宽度(东亚宽字符算两格) */
function widthOf(s: string): number {
  let w = 0;
  for (const ch of s) {
    const c = ch.codePointAt(0) ?? 0;
    w += (c >= 0x1100 && (c <= 0x115f || c === 0x2329 || c === 0x232a
      || (c >= 0x2e80 && c <= 0xa4cf && c !== 0x303f)
      || (c >= 0xac00 && c <= 0xd7a3) || (c >= 0xf900 && c <= 0xfaff)
      || (c >= 0xfe30 && c <= 0xfe6f) || (c >= 0xff00 && c <= 0xff60)
      || (c >= 0xffe0 && c <= 0xffe6))) ? 2 : 1;
  }
  return w;
}

/**
 * 按显示宽度切行 —— 终端的老规矩:尽量在空格处断,断不了就硬断。
 * 命令太长时绕到下一行,输出太长也一样。
 */
function wrapCells(text: string, maxCols: number): string[] {
  if (maxCols < 8) return [text];
  const out: string[] = [];
  let line = '';
  let w = 0;
  let lastSpace = -1;
  for (const ch of text) {
    const cw = widthOf(ch);
    if (w + cw > maxCols && line) {
      if (lastSpace > 0) {
        out.push(line.slice(0, lastSpace));
        line = line.slice(lastSpace + 1);
        w = widthOf(line);
      } else {
        out.push(line);
        line = '';
        w = 0;
      }
      lastSpace = -1;
    }
    line += ch;
    w += cw;
    if (ch === ' ') lastSpace = line.length - 1;
  }
  if (line) out.push(line);
  return out.length ? out : [''];
}

/** 片段 → 一行 SVG(每段一个 <text>;带底色的段,底下垫一块 <rect>) */
function lineSvg(runs: AnsRun[], x0: number, y: number, charW: number, fs: number, lineH: number, skin: (typeof SKIN)['dark']): string {
  let x = x0;
  const parts: string[] = [];
  for (const r of runs) {
    const w = widthOf(r.text) * charW;
    // 底色:SVG 的文字没有背景 —— 用一块 rect 垫在字底下(终端里就是这个样子)
    if (r.bg) {
      parts.push(
        `<rect x="${r2(x)}" y="${r2(y - fs * 0.92)}" width="${r2(w)}" height="${r2(lineH - 3)}" fill="${r.bg}"/>`,
      );
    }
    const st: string[] = [`fill="${r.fg ?? skin.text}"`];
    if (r.bold) st.push('font-weight="700"');
    if (r.dim) st.push('fill-opacity="0.62"');
    if (r.italic) st.push('font-style="italic"');
    if (r.underline) st.push('text-decoration="underline"');
    parts.push(`<text x="${r2(x)}" y="${r2(y)}" font-size="${fs}" ${st.join(' ')} xml:space="preserve">${esc(r.text)}</text>`);
    x += w;
  }
  return parts.join('');
}

/**
 * 命令 + 输出 → 终端窗口 SVG。
 * out 里可以带 ANSI 转义序列(自己给,或用 ttycmd.ts 的小 shell 生成)。
 */
export function renderTty(cmd: string, out: string, opts: TtyOpts = {}): string {
  const skin = opts.theme === 'light' ? SKIN.light : SKIN.dark;
  const fs = opts.fontSize ?? 13;
  const lineH = Math.round(fs * 1.55);
  const charW = fs * 0.6;              // 等宽字体的步进(近似)
  const padX = 16;
  const barH = 34;
  const padTop = 12;
  const prompt = opts.prompt ?? '$ ';
  const cols = Math.max(20, opts.cols ?? 72);
  const maxRows = Math.max(1, opts.rows ?? 24);

  // 命令太长 → 绕到下一行(终端的老规矩)
  const promptW = widthOf(prompt);
  const cmdChunks = wrapCells(cmd, Math.max(8, cols - promptW));
  // 输出按行拆;每行再按 ANSI 片段拆(太长的行也绕)
  const outLines = out.replace(/\r/g, '').split('\n');
  const lines: string[] = [];
  for (const l of outLines) {
    if (lines.length >= maxRows) break;
    for (const chunk of wrapCells(l, cols)) {
      if (lines.length >= maxRows) break;
      lines.push(chunk);
    }
  }

  const width = Math.round(padX * 2 + cols * charW);
  const height = barH + padTop + lineH * (lines.length + cmdChunks.length) + 14;

  const parts: string[] = [];

  // 阴影(高斯模糊一张黑底 —— feDropShadow 光栅化太慢,不用)
  parts.push(
    `<rect x="8" y="10" width="${width - 16}" height="${height - 16}" rx="14" fill="${skin.shadow}" opacity="0.45" filter="url(#tty-shadow)"/>`,
  );
  // 窗口
  parts.push(`<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="12" fill="${skin.bg}" stroke="${skin.border}"/>`);
  // 标题栏
  parts.push(`<path d="M12 0.5H${width - 12}a12 12 0 0 1 12 12V${barH}H0.5V12.5A12 12 0 0 1 12 0.5Z" fill="${skin.bar}"/>`);
  parts.push(`<line x1="0" y1="${barH}" x2="${width}" y2="${barH}" stroke="${skin.sep}"/>`);
  skin.dot.forEach((c, i) => {
    parts.push(`<circle cx="${20 + i * 20}" cy="${barH / 2}" r="6" fill="${c}"/>`);
  });
  const title = (opts.title ?? stripAnsi(cmd).trim() ?? '').slice(0, 60);
  if (title) {
    parts.push(
      `<text x="${width / 2}" y="${barH / 2 + 4}" text-anchor="middle" font-size="12" fill="${skin.dim}">${esc(title)}</text>`,
    );
  }

  // 命令行:提示符 + 命令 + 光标(命令太长就绕到下一行)
  let y = barH + padTop + fs;
  parts.push(
    `<text x="${padX}" y="${y}" font-size="${fs}" fill="${skin.prompt}" xml:space="preserve">${esc(prompt)}</text>`,
  );
  cmdChunks.forEach((chunk, i) => {
    if (i > 0) {
      y += lineH;
      // 绕行的那几行:顶头对齐(没有提示符)
      parts.push(lineSvg(parseAnsi(chunk), padX, y, charW, fs, lineH, skin));
      return;
    }
    parts.push(lineSvg(parseAnsi(chunk), padX + promptW * charW, y, charW, fs, lineH, skin));
  });
  const lastChunk = cmdChunks[cmdChunks.length - 1] ?? '';
  const cursorX = padX + (cmdChunks.length > 1 ? widthOf(lastChunk) : promptW + widthOf(lastChunk)) * charW;
  parts.push(`<rect x="${cursorX}" y="${y - fs + 2}" width="${charW}" height="${fs}" fill="${skin.text}" opacity="0.75"/>`);

  // 输出
  y += lineH;
  for (const line of lines) {
    if (!line) { y += lineH; continue; }
    parts.push(lineSvg(parseAnsi(line), padX, y, charW, fs, lineH, skin));
    y += lineH;
  }

  const font = "ui-monospace,SFMono-Regular,Menlo,Monaco,'Cascadia Mono','Courier New',monospace";
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" ` +
    `font-family="${font}" role="img" aria-label="terminal">` +
    `<defs><filter id="tty-shadow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter></defs>` +
    parts.join('') +
    `</svg>`
  );
}
