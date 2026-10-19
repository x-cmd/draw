// 单元格柱(规范 bar-2 · Grid):每列自底向上点亮,一格一个单位;
// 等宽字体表头直接给出总量与峰值,静态可读不依赖 hover。
import type { ChartSpec } from '../specs/index.js';
import { card } from '../theme.js';
import { esc, fmtFull, r2, trunc, type RenderOpts, svgDoc, sVar } from './svg.js';

const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace";

/**
 * Table-style bar chart (`t=grid`): rows of label + inline bar + value.
 */
export function renderBarGrid(spec: ChartSpec, o: RenderOpts): string {
  const { width, height, version, skin } = o;
  const plain = skin.rules.canvas === 'plain';
  const n = spec.data.length;
  const levels = spec.data.map((d) => Math.max(0, Math.round(d.value)));
  const rows = Math.max(1, ...levels);
  const total = spec.data.reduce((s, d) => s + d.value, 0);
  let peakIdx = 0;
  spec.data.forEach((d, i) => {
    if (d.value > spec.data[peakIdx].value) peakIdx = i;
  });

  // 几何(规范 960×520 实测):起点 78/214,格 14×12,横距 18 纵距 6
  const sx = Math.round(width * 0.0604);
  const startX = Math.round(width * 0.0813);
  const startY = Math.round(height * 0.4115);
  const pitch = Math.min(32, (width - startX * 2) / Math.max(n, 1));
  const cellW = pitch * (14 / 32);
  const vs = height / 520;
  const cellH = 12 * vs;
  const gapY = 6 * vs;
  const headR = Math.round(width * 0.9396);

  const parts: string[] = [card(width, height, plain)];
  // 表头(等宽):[Σ] Total | [◆] Peak | 右侧注释行
  const mono = (x: number, y: number, fs: number, text: string, cls = 'muted', anchor = 'start') =>
    `<text x="${r2(x)}" y="${r2(y)}" text-anchor="${anchor}" font-family="${MONO}" font-size="${r2(fs)}" fill="var(--d-${cls === 'muted' ? 'muted' : 'text'})"${cls === 'value' ? ' style="font-variant-numeric:tabular-nums"' : ''}>${esc(text)}</text>`;
  parts.push(mono(sx, Math.round(72 * vs), 15 * vs, '[Σ] Total'));
  parts.push(mono(sx, Math.round(122 * vs), 36 * vs, fmtFull(total), 'value'));
  parts.push(`<line x1="${r2(Math.round(width * 0.2125))}" y1="${r2(Math.round(58 * vs))}" x2="${r2(Math.round(width * 0.2125))}" y2="${r2(Math.round(124 * vs))}" stroke="var(--d-grid)" stroke-dasharray="4 5"/>`);
  parts.push(mono(Math.round(width * 0.2375), Math.round(72 * vs), 15 * vs, '[◆] Peak'));
  parts.push(mono(Math.round(width * 0.2375), Math.round(122 * vs), 36 * vs, trunc(spec.data[peakIdx].label, 12), 'value'));
  parts.push(mono(headR, Math.round(74 * vs), 12, '// CELL: 1:1', 'muted', 'end'));
  parts.push(mono(headR, Math.round(98 * vs), 12, '// TYPE: GRID', 'muted', 'end'));
  parts.push(`<line x1="${r2(sx)}" y1="${r2(Math.round(154 * vs))}" x2="${r2(headR)}" y2="${r2(Math.round(154 * vs))}" stroke="var(--d-grid)" stroke-dasharray="4 5"/>`);

  // 单元格:行 0 在顶,active = 自底向上 levels[col] 格
  for (let col = 0; col < n; col++) {
    for (let row = 0; row < rows; row++) {
      const active = row >= rows - levels[col];
      parts.push(
        `<rect x="${r2(startX + col * pitch)}" y="${r2(startY + row * (cellH + gapY))}" width="${r2(cellW)}" height="${r2(cellH)}" rx="1" fill="${active ? sVar(0) : 'var(--d-faint)'}"/>`,
      );
    }
  }
  // 时间刻度:约每 n/12 列一个(规范 24 列 → 每隔 1 列)
  const tickSkip = Math.max(1, Math.ceil(n / 12));
  spec.data.forEach((d, i) => {
    if (i % tickSkip !== 0) return;
    parts.push(
      `<text x="${r2(startX + i * pitch + cellW / 2)}" y="${r2(Math.round(height * 0.9))}" text-anchor="middle" font-family="${MONO}" font-size="12" fill="var(--d-muted)" style="font-variant-numeric:tabular-nums">${esc(trunc(d.label, 12))}</text>`,
    );
  });

  return svgDoc(width, height, 'bar', version, spec.title ?? 'grid bar', spec, skin, parts.join(''));
}
