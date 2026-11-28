// ANSI 转义序列 → 一段段带样式的文本。
//
// 命令行的输出里带 ESC[31m 这样的颜色码,网页上要把它还原成颜色。
// 这里只认 SGR(选图形)那几类 —— 光标移动、清屏之类在静态图里没意义。
//
// 输出是一串「片段」(run):一段同样式的一段文字。渲染器(HTML / SVG)各自决定
// 怎么画 —— 这里只管把样式解析出来。

export interface AnsRun {
  text: string;
  fg?: string;
  bg?: string;
  bold?: boolean;
  dim?: boolean;
  italic?: boolean;
  underline?: boolean;
}

/** xterm 的 16 色(标准色 + 亮色) */
const PALETTE = [
  '#000000', '#cd3131', '#0dbc79', '#e5e510', '#2472c8', '#bc3fbc', '#11a8cd', '#e5e5e5',
  '#666666', '#f14c4c', '#23d18b', '#f5f543', '#3b8eea', '#d670d6', '#29b8db', '#ffffff',
];

/** 256 色:0-15 是上面的调色板,16-231 是 6×6×6 的立方,232-255 是灰阶 */
function color256(n: number): string {
  if (n < 16) return PALETTE[n];
  if (n < 232) {
    const i = n - 16;
    const steps = [0, 95, 135, 175, 215, 255];
    const r = steps[Math.floor(i / 36) % 6];
    const g = steps[Math.floor(i / 6) % 6];
    const b = steps[i % 6];
    return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
  }
  const v = 8 + (n - 232) * 10;
  return `#${v.toString(16).padStart(2, '0').repeat(3)}`;
}

interface Style {
  fg?: string;
  bg?: string;
  bold?: boolean;
  dim?: boolean;
  italic?: boolean;
  underline?: boolean;
}

/** 解析一段带 ANSI 的文本 → 片段列表 */
export function parseAnsi(input: string): AnsRun[] {
  const runs: AnsRun[] = [];
  let style: Style = {};
  let buf = '';
  // eslint-disable-next-line no-control-regex
  const re = /\x1b\[([0-9;]*)m/g;
  let last = 0;
  let m: RegExpExecArray | null;

  const flush = (): void => {
    if (!buf) return;
    runs.push({ text: buf, ...style });
    buf = '';
  };

  while ((m = re.exec(input)) !== null) {
    buf += input.slice(last, m.index);
    last = m.index + m[0].length;
    flush();
    style = applySgr(style, m[1]);
  }
  buf += input.slice(last);
  flush();
  return runs;
}

/** 一条 SGR 序列作用到当前样式上 */
function applySgr(style: Style, params: string): Style {
  const s: Style = { ...style };
  const nums = params === '' ? [0] : params.split(';').map((p) => Number.parseInt(p, 10) || 0);
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if (n === 0) {
      s.fg = undefined; s.bg = undefined; s.bold = false; s.dim = false; s.italic = false; s.underline = false;
    } else if (n === 1) s.bold = true;
    else if (n === 2) s.dim = true;
    else if (n === 3) s.italic = true;
    else if (n === 4) s.underline = true;
    else if (n === 22) { s.bold = false; s.dim = false; }
    else if (n === 23) s.italic = false;
    else if (n === 24) s.underline = false;
    else if (n >= 30 && n <= 37) s.fg = PALETTE[n - 30];
    else if (n === 39) s.fg = undefined;
    else if (n >= 40 && n <= 47) s.bg = PALETTE[n - 40];
    else if (n === 49) s.bg = undefined;
    else if (n >= 90 && n <= 97) s.fg = PALETTE[n - 90 + 8];
    else if (n >= 100 && n <= 107) s.bg = PALETTE[n - 100 + 8];
    else if (n === 38 || n === 48) {
      // 38;5;n(256 色)/ 38;2;r;g;b(真彩)
      const mode = nums[i + 1];
      let color: string | undefined;
      if (mode === 5) { color = color256(nums[i + 2] ?? 0); i += 2; }
      else if (mode === 2) {
        const [r, g, b] = [nums[i + 2] ?? 0, nums[i + 3] ?? 0, nums[i + 4] ?? 0];
        color = `#${[r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('')}`;
        i += 4;
      }
      if (n === 38) s.fg = color; else s.bg = color;
    }
  }
  return s;
}

/** 片段列表 → HTML(给网页里的终端用) */
export function ansiToHtml(runs: AnsRun[]): string {
  const esc = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return runs.map((r) => {
    const st: string[] = [];
    if (r.fg) st.push(`color:${r.fg}`);
    if (r.bg) st.push(`background:${r.bg}`);
    if (r.bold) st.push('font-weight:700');
    if (r.dim) st.push('opacity:.65');
    if (r.italic) st.push('font-style:italic');
    if (r.underline) st.push('text-decoration:underline');
    if (!st.length) return esc(r.text);
    return `<span style="${st.join(';')}">${esc(r.text)}</span>`;
  }).join('');
}

/** 把纯文本里的其它控制字符清掉(剩下能显示的) */
export function stripAnsi(input: string): string {
  // eslint-disable-next-line no-control-regex
  return input.replace(/\x1b\[[0-9;?]*[a-zA-Z]/g, '').replace(/\r/g, '');
}
