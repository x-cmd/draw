// 文档里的图表图片统一成「图 → explore」形态:图是 SVG,点击进 explore 交互页。
//
//   ![alt](https://x-cmd.com/draw?Q)
//     → [![alt](https://x-cmd.com/draw?Q)](https://x-cmd.com/draw/explore?Q)
//
//   <a href="https://x-cmd.com/draw?Q"><img src="https://x-cmd.com/draw?Q" width="360" alt="alt"></a>
//     → [![alt](https://x-cmd.com/draw?Q&w=360)](https://x-cmd.com/draw/explore?Q)
//   (根路径的图表,width 落到 URL 的 w= 参数上,图仍是 360px 宽)
//
// 子路径入口(archmap / mindmap / echarts)explore 在 /draw/explore/<sub> 下:
//   <a href="https://x-cmd.com/draw/archmap?Q"><img src="..." width="300" alt="alt"></a>
//     → <a href="https://x-cmd.com/draw/explore/archmap?Q"><img src="..." width="300" alt="alt"></a>
//   (archmap/mindmap 的尺寸由内容决定,w= 只是下限,缩不到 300px —— 保留 HTML 的 width 属性)
//
// 幂等:已带 explore 链接的、非 x-cmd.com 主机、非图表 URL 一律不动。
// 用法:node scripts/link-explore.mjs [路径…](默认 docs/ + readme/ + README.md)
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;

// explore 落地页覆盖的入口:根路径(11 图种,?type=)+ archmap / mindmap / echarts;
// gantt、x-cmd/release-banner 等子路径 explore 没有对应页 → 链回 SVG 本身。
const EXPLORE_SUBS = new Set(['', 'archmap', 'mindmap', 'echarts']);

// 拆 https://x-cmd.com/draw/<sub>?<query> → { sub, query };非 draw 主机返回 null
function splitDraw(u) {
  const m = /^https:\/\/x-cmd\.com\/draw(\/[^?]*)?(\?.*)?$/.exec(u);
  if (!m) return null;
  return { sub: (m[1] ?? '').replace(/^\//, ''), query: m[2] ?? '' };
}

const isChartUrl = (u) => {
  const p = splitDraw(u);
  return p !== null && p.sub !== 'explore';
};

// draw URL → explore URL:同参数,路径多一段 /explore;explore 没有的入口原样返回
function exploreUrl(u) {
  const p = splitDraw(u);
  if (!p || !EXPLORE_SUBS.has(p.sub)) return u;
  return `https://x-cmd.com/draw/explore${p.sub ? '/' + p.sub : ''}${p.query}`;
}

// markdown 图片:![alt](url)。目标允许一层成对括号(gauge 的 label=Memory%20(GB));
// 前视否定 (?<!\[) 跳过已被链接包住的内层 ![alt](url),避免二次包裹。
const MD_IMG = /(?<!\[)!\[([^\]\n]*)\]\(((?:[^()\s]|\([^()\s]*\))+)\)/g;
// HTML 图文链接:<a href="u"><img src="u" width="N" alt="a"></a>
const HTML_IMG = /<a href="([^"]+)"><img src="([^"]+)" width="(\d+)" alt="([^"]*)"><\/a>/g;

let links = 0;

function linkHtml(text) {
  return text.replace(HTML_IMG, (all, href, src, width, alt) => {
    if (!isChartUrl(href) || !isChartUrl(src)) return all;
    const target = exploreUrl(href);
    if (target === href) return all;                       // 无 explore 页 → 不动
    const p = splitDraw(src);
    if (p && p.sub === '') {
      // 根路径图表:w= 是精确宽度,折进 markdown 后仍是同样大小
      const img = /[?&]w=/.test(src) ? src : `${src}&w=${width}`;
      links++;
      return `[![${alt}](${img})](${target})`;
    }
    // 子路径(archmap/mindmap):尺寸由内容决定,markdown 表达不了 width → 留 HTML,只换 href
    links++;
    return `<a href="${target}"><img src="${src}" width="${width}" alt="${alt}"></a>`;
  });
}

function linkMd(text) {
  return text.replace(MD_IMG, (all, alt, url) => {
    if (!isChartUrl(url)) return all;
    links++;
    return `[![${alt}](${url})](${exploreUrl(url)})`;
  });
}

function walk(p) {
  const st = statSync(p);
  if (st.isFile()) return p.endsWith('.md') ? [p] : [];
  const out = [];
  for (const name of readdirSync(p)) out.push(...walk(join(p, name)));
  return out;
}

const targets = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['docs', 'readme', 'README.md'];

let changed = 0;
for (const t of targets) {
  for (const file of walk(join(ROOT, t))) {
    const before = readFileSync(file, 'utf8');
    const after = linkMd(linkHtml(before));
    if (after === before) continue;
    writeFileSync(file, after);
    changed++;
    console.log(`${relative(ROOT, file)}`);
  }
}
console.log(`\n${changed} file(s) changed, ${links} image link(s) rewritten`);
