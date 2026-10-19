// 字体许可文本随 npm 包分发(OFL 1.1 硬性要求): 拷贝 src/styles/*-OFL.txt → dist/
import { copyFileSync, readdirSync } from 'node:fs';
for (const f of readdirSync('src/styles')) {
  if (f.endsWith('-OFL.txt')) copyFileSync(`src/styles/${f}`, `dist/${f}`);
}
