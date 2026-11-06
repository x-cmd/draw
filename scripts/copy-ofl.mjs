// 字体许可文本随 npm 包分发(OFL 1.1 硬性要求): 拷贝 src/styles/*-OFL.txt → dist/
import { copyFileSync, readdirSync } from 'node:fs';
for (const f of readdirSync('src/styles')) {
  if (f.endsWith('-OFL.txt')) copyFileSync(`src/styles/${f}`, `dist/${f}`);
}
// vendored jison 解析器随包分发: dist/render/vendor/ 与 import 路径对齐
// (同名 .d.ts 使 tsc 不把 .js 当输入,须显式拷贝)
import { mkdirSync, cpSync } from 'node:fs';
mkdirSync('dist/render/vendor', { recursive: true });
cpSync('src/render/vendor/mermaid-flow-parser.js', 'dist/render/vendor/mermaid-flow-parser.js');
cpSync('src/render/vendor/mermaid-gantt-parser.js', 'dist/render/vendor/mermaid-gantt-parser.js');
