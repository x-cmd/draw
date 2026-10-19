// 水平柱状图:标签左侧、条向右延伸、数值在条尾、竖向网格。排行/长标签场景。
import type { ChartSpec } from '../specs';
import { TAB, card } from '../theme';
import { esc, fmtNum, niceTicks, r2, svgDoc, textW, titleBlock, trunc, type RenderOpts } from './svg';

export function renderHBar(spec: ChartSpec, o: RenderOpts): string {
  const { width, version, skin } = o;
  let height = o.height;
  // 行距过密时行标签会重叠 → 自动拉高(封顶 2.5×)
  if (o.autoHeight && spec.data.length > 0) {
    const step0 = (height - 24 - 28 - (24 + (spec.title ? 32 : 0) + 8)) / spec.data.length;
    if (step0 > 0 && step0 < 20) height = Math.round(height * Math.min(2.5, 20 / step0));
  }
  const values = spec.data.map((d) => d.value);
  const max = Math.max(...values);
  const peakIdx = values.indexOf(max);
  const n = spec.data.length;

  const pad = 24;
  const contentTop = pad + (spec.title ? 32 : 0) + 8;
  const labelW = Math.min(160, Math.max(...spec.data.map((d) => textW(trunc(d.label, 16), 12.5))) + 4);
  const left = pad + labelW + 14;
  const right = width - pad - 44; // 右侧留给数值标注
  const bottom = height - pad - 28;

  const ticks = niceTicks(max, 4);
  const xMax = ticks[ticks.length - 1];
  const x = (v: number): number => left + (v / xMax) * (right - left);

  const parts: string[] = [card(width, height)];

  // 竖向网格 + 底部刻度
  for (const t of ticks) {
    const gx = r2(x(t));
    if (t > 0) parts.push(`<line x1="${gx}" y1="${contentTop}" x2="${gx}" y2="${bottom}" stroke="var(--d-grid)" stroke-width="1"/>`);
    parts.push(`<text x="${gx}" y="${r2(bottom + 16)}" text-anchor="middle" font-size="12" fill="var(--d-muted)" style="${TAB}">${fmtNum(t)}</text>`);
  }
  parts.push(`<line x1="${r2(left)}" y1="${contentTop}" x2="${r2(left)}" y2="${bottom}" stroke="var(--d-baseline)" stroke-width="1"/>`);

  const step = (bottom - contentTop) / n;
  const barH = Math.min(22, Math.max(5, step * 0.55));
  const num = o.valueLabels ?? skin.rules.num;
  spec.data.forEach((d, i) => {
    const y = contentTop + step * i + (step - barH) / 2;
    const x0 = left;
    const x1 = x(d.value);
    const m = Math.min(4, barH / 2, x1 - x0);
    const isPeak = i === peakIdx;
    // 仅右端(leading端)圆角
    const path =
      `M${r2(x0)} ${r2(y)}H${r2(x1 - m)}Q${r2(x1)} ${r2(y)} ${r2(x1)} ${r2(y + m)}` +
      `V${r2(y + barH - m)}Q${r2(x1)} ${r2(y + barH)} ${r2(x1 - m)} ${r2(y + barH)}H${r2(x0)}Z`;
    parts.push(`<path d="${path}" fill="url(#dg-bar)"/>`);
    parts.push(`<text x="${r2(pad + labelW)}" y="${r2(y + barH / 2 + 4)}" text-anchor="end" font-size="12.5" fill="var(--d-text)">${esc(trunc(d.label, 16))}</text>`);
    if (d.value > 0 && (num === 'all' || (num === 'peak' && isPeak))) { // 零值不标(标注克制)
      parts.push(`<text x="${r2(x1 + 8)}" y="${r2(y + barH / 2 + 4)}" font-size="${isPeak ? 13 : 11}" ${isPeak ? 'font-weight="600" fill="' + 'var(--d-ink)' + '"' : 'fill="' + 'var(--d-text)' + '"'} style="${TAB}">${fmtNum(d.value)}</text>`);
    }
  });

  const defs =
    `<defs><linearGradient id="dg-bar" x1="0" y1="0" x2="1" y2="0">` +
    `<stop offset="0" stop-color="var(--d-ramp-b)"/><stop offset="1" stop-color="var(--d-ramp-a)"/></linearGradient></defs>`;
  return svgDoc(width, height, 'hbar', version, spec.title ?? 'horizontal bar chart', spec, skin, titleBlock(spec.title) + defs + parts.join(''));
}
