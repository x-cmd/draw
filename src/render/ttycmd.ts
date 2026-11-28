// 终端里那个小 shell:一行命令 → 一段带颜色的输出。
//
// 认这几件事:
//   help                              用法
//   echo <话>                         回声
//   draw <图种> --labels A,B --values 1,2   把图画成 Unicode 的图(带颜色)
//   clear                             清屏(只是句提示)
//
// 输出的都是 ANSI 转义序列 —— 由 ansi.ts 负责还原成颜色。
// 同一段输出既能进网页(实时看),也能进 SVG(截图进 README)。

/** 站上的色板(暗色一套) */
const SERIES = ['#34D399', '#F87171', '#A78BFA', '#22D3EE', '#60A5FA', '#FB923C'];

const fg = (hex: string): string => `\x1b[38;2;${rgb(hex)}m`;
const bg = (hex: string): string => `\x1b[48;2;${rgb(hex)}m`;
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

function rgb(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r};${g};${b}`;
}

/** 八个字符的方块,按高低取值 */
const BLOCKS = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];

/** 把一行命令拆成「命令 + 参数」;引号里的空格算一个参数 */
export function splitArgs(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let quote: string | null = null;
  for (const ch of line) {
    if (quote) {
      if (ch === quote) quote = null;
      else cur += ch;
      continue;
    }
    if (ch === '"' || ch === "'") { quote = ch; continue; }
    if (ch === ' ') {
      if (cur) { out.push(cur); cur = ''; }
      continue;
    }
    cur += ch;
  }
  if (cur) out.push(cur);
  return out;
}

/** 从参数里取值:--labels A,B / --values 1,2 */
function opt(args: string[], name: string): string | undefined {
  const i = args.indexOf(name);
  if (i < 0) return undefined;
  return args[i + 1];
}

/**
 * 跑一条命令,返回带 ANSI 的输出。
 * 认不得的命令 → 一句「command not found」(这也是终端的老规矩)。
 */
export function runCommand(line: string): string {
  const cmd = line.trim();
  if (!cmd) return '';
  const args = splitArgs(cmd);
  const head = args[0];

  if (head === 'help' || head === '?') {
    return [
      `${BOLD}draw tty${RESET} —— 终端里的小 shell`,
      '',
      '  help                     这份说明',
      '  echo <话>                回声',
      '  draw <图种> --labels A,B --values 1,2',
      '                           把图画成 Unicode 的图',
      '',
      `${DIM}图种:bar hbar pie line area gauge${RESET}`,
      `${DIM}例:draw bar --labels Mon,Tue,Wed --values 12,30,18${RESET}`,
    ].join('\n');
  }

  if (head === 'echo') {
    return args.slice(1).join(' ');
  }

  if (head === 'clear') {
    return `${DIM}(屏幕清空了 —— 这里是静态图,清屏就这一步)${RESET}`;
  }

  if (head === 'draw') {
    return drawInTerminal(args.slice(1));
  }

  return `${fg('#F87171')}command not found: ${head}${RESET}\n${DIM}输入 help 看看能做什么${RESET}`;
}

/** draw <图种> --labels … --values … → Unicode 图 */
function drawInTerminal(args: string[]): string {
  const kind = (args[0] ?? 'bar').toLowerCase();
  const labels = (opt(args, '--labels') ?? opt(args, '-l') ?? 'A,B,C').split(',').map((s) => s.trim());
  const values = (opt(args, '--values') ?? opt(args, '-v') ?? '1,2,3')
    .split(',').map((s) => Number.parseFloat(s.trim()))
    .filter((n) => Number.isFinite(n));
  const title = opt(args, '--title');
  if (!values.length) return `${fg('#F87171')}draw: --values 是空的${RESET}`;

  const n = Math.min(labels.length, values.length);
  const ls = labels.slice(0, n);
  const vs = values.slice(0, n);
  const out: string[] = [];
  if (title) out.push(`${BOLD}${title}${RESET}`);

  if (kind === 'pie') {
    // 饼图 → 一条按比例分段的彩色带(终端里画不出圆)
    const total = vs.reduce((a, b) => a + b, 0) || 1;
    const width = 40;
    const cells: string[] = [];
    vs.forEach((v, i) => {
      const w = Math.max(1, Math.round((v / total) * width));
      cells.push(`${bg(SERIES[i % SERIES.length])} ${' '.repeat(Math.max(0, w - 1))}${RESET}`);
    });
    out.push(cells.join(''));
    vs.forEach((v, i) => {
      const pct = ((v / total) * 100).toFixed(1);
      out.push(`${fg(SERIES[i % SERIES.length])}●${RESET} ${ls[i]} ${DIM}${v}${RESET} ${DIM}(${pct}%)${RESET}`);
    });
    return out.join('\n');
  }

  if (kind === 'line' || kind === 'area') {
    const max = Math.max(...vs);
    const min = Math.min(...vs);
    const span = max - min || 1;
    const spark = vs.map((v) => {
      const idx = Math.round(((v - min) / span) * (BLOCKS.length - 1));
      return BLOCKS[Math.max(0, Math.min(BLOCKS.length - 1, idx))];
    }).join('');
    out.push(`${fg(SERIES[0])}${spark}${RESET}`);
    out.push(`${DIM}${min} → ${max}${RESET}`);
    vs.forEach((v, i) => out.push(`${DIM}${ls[i].padEnd(8)}${RESET}${v}`));
    return out.join('\n');
  }

  // bar / hbar / gauge:横着的条,条长按最大值归一
  const max = Math.max(...vs);
  const width = 28;
  const labelW = Math.max(...ls.map((l) => l.length));
  vs.forEach((v, i) => {
    const w = Math.max(1, Math.round((v / (max || 1)) * width));
    out.push(
      `${ls[i].padEnd(labelW)} ${fg(SERIES[i % SERIES.length])}${'█'.repeat(w)}${RESET} ${DIM}${v}${RESET}`,
    );
  });
  return out.join('\n');
}
