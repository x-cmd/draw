// 画出 draw 自己的三张图:代码结构、请求时序、用户用例。
//
//   node scripts/diagrams.mjs            打印 README 要用的 markdown
//   node scripts/diagrams.mjs --check    对比 README 里的那段,不一致就退出 1(CI 用)
//
// 结构图不是手抄的:节点从真实的 src/ 树里取(模块名对不上就报错),
// 所以改了代码结构,这张图也跟着变。
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://x-cmd.com/draw';

/** src/ 下真实存在的模块 —— 结构图的节点来源 */
const modules = (dir) =>
  readdirSync(join(ROOT, 'src', dir))
    .filter((f) => f.endsWith('.ts') && !f.endsWith('.d.ts'))
    .map((f) => f.replace(/\.ts$/, ''));

const top = readdirSync(join(ROOT, 'src')).filter((f) => f.endsWith('.ts') && !f.endsWith('.d.ts'));
const need = (list, what) => {
  for (const x of list) if (!top.includes(`${x}.ts`)) throw new Error(`src/${x}.ts 不在了(${what})`);
};

need(['index', 'handler', 'lib', 'demo'], '结构图');
need(['store'], '结构图');
for (const d of ['specs', 'render', 'styles']) {
  const dir = join(ROOT, 'src', d);
  if (!statSync(dir).isDirectory()) throw new Error(`src/${d}/ 不在了(结构图)`);
}

/** 空格要编码;`;` `,` `=` 是 archmap 的分隔符,原样留着 */
const arch = (params) => `${BASE}/archmap?${params.replace(/ /g, '%20')}`;

/* ---------------------------------------------------------------- 结构图
   行 = 层:入口 → 路由 → 解析/存储 → 渲染/皮肤。边界圈住「跑在 Worker 上的部分」。 */
const structure = arch([
  'n=entry;fe;Worker entry;src/index.ts;r0c0',
  'n=node;svc;Node server + CLI;src/node/;r0c1',
  'n=handler;be;handler.ts;routing + responses;r1c0',
  'n=demo;fe;demo/;gallery + landing;r1c1',
  'n=specs;be;specs/;parse + validate;r2c0',
  'n=store;db;store.ts;short links in a Git repo;r2c1',
  'n=render;be;render/;draw the SVG;r3c0',
  'n=styles;be;styles/;skins + families;r3c1',
  'e=entry;handler', 'e=node;handler', 'e=handler;specs', 'e=handler;store',
  'e=handler;demo', 'e=handler;render', 'e=render;styles',
  'b=Edge worker;handler specs store render styles',
  'title=Inside%20draw',
].join('&'));

/* ---------------------------------------------------------------- 时序图
   行 = 参与方,列 = 时间。一条请求从 URL 走到 SVG 的每一步。 */
const sequence = arch([
  'n=app;fe;Your app;r0c0',
  'n=svgback;fe;SVG in your page;r0c5',
  'n=worker;be;Worker;r1c1',
  'n=resp;fe;200 + <metadata>;r1c4',
  'n=specs;be;specs/ parse;r2c2',
  'n=styles;be;styles/ skin;r3c3',
  'n=render;be;render/ draw;r4c4',
  'e=app;worker', 'e=worker;specs', 'e=specs;styles', 'e=styles;render',
  'e=render;resp', 'e=resp;svgback',
  'b=Your app;app svgback',
  'b=Worker;worker resp',
  'b=specs/;specs',
  'b=styles/;styles',
  'b=render/;render',
  'title=One%20request',
].join('&'));

/* ---------------------------------------------------------------- 用例图
   外面是使用的人,里面是 draw 提供的用例。 */
const usecase = arch([
  'n=caller;ext;Your app or CI;r0c0',
  'n=agent;ext;AI agent;r0c1',
  'n=writer;ext;README or docs;r0c2',
  'n=ops;sec;Self-host operator;r0c3',
  'n=uc1;be;Render a chart;GET /draw?type=...;r1c0',
  'n=uc2;be;Store a short link;POST /draw;r1c1',
  'n=uc3;be;Embed the SVG;markdown + img;r1c2',
  'n=uc4;be;Run it yourself;npm + wrangler;r1c3',
  'e=caller;uc1', 'e=caller;uc2', 'e=agent;uc1', 'e=writer;uc3', 'e=ops;uc4',
  'b=draw;uc1 uc2 uc3 uc4',
  'title=What%20draw%20is%20for',
].join('&'));

/* ---------------------------------------------------------------- markdown */
const block = (title, sub, url, alt) => `### ${title}

${sub}

\`\`\`text
${url}
\`\`\`

![${alt}](${url})`;

const markdown = [
  '<!-- BEGIN draw-diagrams -->',
  '<!-- 由 scripts/diagrams.mjs 生成:node scripts/diagrams.mjs(改完用 --check 对一遍) -->',
  '',
  block(
    'Inside draw — the code structure',
    'One edge worker, one render core, four directories that matter: `specs/` parses, `styles/` skins, `render/` draws, `store.ts` keeps the short links.',
    structure,
    'draw 的代码结构',
  ),
  '',
  block(
    'One request, step by step',
    'The URL is parsed, a skin is picked, the SVG is drawn, and it comes back with `<metadata>` inside — one path for every chart type.',
    sequence,
    '一次请求的时序',
  ),
  '',
  block(
    'What draw is for',
    'Four kinds of callers: your code, an AI agent, your README, and whoever runs their own copy.',
    usecase,
    'draw 的用户用例',
  ),
  '<!-- END draw-diagrams -->',
].join('\n');

const readme = join(ROOT, 'README.md');
if (process.argv.includes('--check')) {
  const text = readFileSync(readme, 'utf-8');
  const m = /<!-- BEGIN draw-diagrams -->[\s\S]*?<!-- END draw-diagrams -->/.exec(text);
  if (!m) {
    console.error('README.md 里没有 draw-diagrams 段落');
    process.exit(1);
  }
  if (m[0] !== markdown) {
    console.error('README.md 的图和 scripts/diagrams.mjs 生成的对不上 —— 跑 node scripts/diagrams.mjs 更新');
    process.exit(1);
  }
  console.log('README 的图是最新的');
} else {
  console.log(markdown);
}
