// 混合图:柱系列(分组并排)+ 线系列共用 y 轴与类别轴(量级差大时线走右轴)。
import type { ComboSpec } from '../specs';
import { TAB, card } from '../theme';
import { esc, fmtNum, niceTicks, r2, topLegend, trunc, textW, LabelPlacer, pushLineLabel, pushBarLabelsAllOrNothing, smoothPath, type RenderOpts, svgDoc, titleBlock, findPeak, onVar, sVar, labelStride, reserveBands, reserveEdges, toSegments, type LineSeg } from './svg';
import { yTickInset, tickColW } from './measure';

export function renderCombo(spec: ComboSpec, o: RenderOpts): string {
  if (o.skin.rules.comboMode === 'evil') return renderComboEvil(spec, o);
  const { height, version, skin } = o;
  let width = o.width;
  const n = spec.labels.length;
  const colors = spec.series.map((_, i) => sVar(i % skin.series.length));
  const bars = spec.series.filter((s) => s.kind === 'bar');
  const lines = spec.series.filter((s) => s.kind === 'line');
  const gMax = Math.max(...spec.series.flatMap((s) => s.values));
  const [peakS, peakP] = findPeak(spec.series);

  const pad = 24;
  // 双轴:量级差 >5 倍时线系列走右侧独立 y 轴
  const stacked = spec.stack === true && bars.length > 0;
  const barTotals = stacked ? spec.labels.map((_, pi) => bars.reduce((s, b) => s + b.values[pi], 0)) : [];
  const barMax = stacked ? Math.max(...barTotals) : bars.length ? Math.max(...bars.flatMap((s) => s.values)) : 0;
  const lineMax = lines.length ? Math.max(...lines.flatMap((s) => s.values)) : 0;
  const dual = bars.length > 0 && lines.length > 0 && (lineMax * 5 < barMax || barMax * 5 < lineMax);
  // 双轴时绘图区下移,避免图例压顶部刻度
  const contentTop = pad + (spec.title ? 32 : 0) + (spec.unit ? 18 : 0) + 24 + (dual ? 16 : 0);
  const ticks = niceTicks(dual ? barMax : gMax, stacked ? 5 : 4); // 双轴时左轴只管柱;堆叠用 5 档收紧上限
  const lineTicks = dual ? niceTicks(lineMax, 4) : ticks;
  // 组数少(<5)时宽度贴内容收缩(下限 320)
  if (o.autoWidth && n < 5) {
    const leftIns = Math.max(pad + 48, yTickInset({ ticks }));
    const rightIns = dual ? pad + Math.max(36, tickColW(lineTicks, 12, 8) + 4) : pad;
    const need = leftIns + rightIns + n * 93.6;
    if (need < width) width = Math.round(Math.max(320, need));
  }
  // 左列 = max(规范 48, 实测刻度);双轴右带 = max(规范 36, 实测右轴刻度列)
  const left = Math.max(pad + 48, yTickInset({ ticks }));
  const right = dual ? width - pad - Math.max(36, tickColW(lineTicks, 12, 8) + 4) : width - pad;
  const bottom = height - pad - 30;

  const yMax = ticks[ticks.length - 1];
  const y = (v: number): number => bottom - (v / yMax) * (bottom - contentTop);

  const lineYMax = lineTicks[lineTicks.length - 1];
  const yLine = (v: number): number => bottom - (v / lineYMax) * (bottom - contentTop);

  const parts: string[] = [
    card(width, height),
    topLegend(spec.series.map((s, i) => ({ name: s.name, color: colors[i] })), width - pad, pad + 16),
  ];
  for (const t of ticks) {
    const gy = r2(y(t));
    if (t > 0) parts.push(`<line x1="${left}" y1="${gy}" x2="${right}" y2="${gy}" stroke="var(--d-grid)" stroke-width="1"/>`);
    parts.push(`<text x="${left - 8}" y="${r2(y(t) + 4)}" text-anchor="end" font-size="12" fill="var(--d-muted)" style="${TAB}">${fmtNum(t)}</text>`);
  }
  if (dual) {
    // 右轴刻度(线系列),颜色取首个线系列以示归属
    const lineColor = colors[spec.series.findIndex((s) => s.kind === 'line')];
    for (const t of lineTicks) {
      parts.push(`<text x="${right + 8}" y="${r2(yLine(t) + 4)}" font-size="12" fill="${lineColor}" style="${TAB}">${fmtNum(t)}</text>`);
    }
  }
  parts.push(`<line x1="${left}" y1="${bottom}" x2="${right}" y2="${bottom}" stroke="var(--d-baseline)" stroke-width="1"/>`);

  const step = (right - left) / n;
  const num = o.valueLabels ?? skin.rules.num;

  // 线穿过各组中心;先画线再画柱,线始终连续
  const cx = (pi: number): number => left + step * pi + step / 2;
  const lineLabels: { px: number; py: number; text: string; isPeak: boolean }[] = [];
  const lineSvg: string[] = [];
  const lineSegs: LineSeg[] = [];
  lines.forEach((s) => {
    const gIdx = spec.series.indexOf(s);
    const pts = s.values.map((v, pi) => [cx(pi), (dual ? yLine : y)(v)] as [number, number]);
    lineSegs.push(...toSegments(pts));
    lineSvg.push(`<path d="${smoothPath(pts)}" fill="none" stroke="${colors[gIdx]}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`);
    pts.forEach(([lx, ly], pi) => {
      lineSvg.push(`<circle cx="${r2(lx)}" cy="${r2(ly)}" r="2.5" fill="${colors[gIdx]}" stroke="#ffffff" stroke-width="1.5"/>`);
      const isPeak = gIdx === peakS && pi === peakP;
      if (num === 'all' || (num === 'peak' && isPeak)) {
        lineLabels.push({ px: lx, py: ly, text: fmtNum(s.values[pi]), isPeak });
      }
    });
  });

  // 柱系列:stack 时上下堆叠(段内标值,微小段不标),否则并排分组
  const k = bars.length;
  const placer = new LabelPlacer();
  const barLabels: { x: number; yt: number; v: number; color: string; isPeak: boolean; barW: number; row: number; fx: number; fyt: number }[] = [];
  const withinStack: { x: number; yt: number; w: number; hAvail: number; text: string; fs: number; peak: boolean; fill: string; center: boolean; haloColor?: string }[] = [];
  const pendingBarLabels: string[] = []; // 折线之后才输出的柱内标签
  if (k > 0) {
    const barW = stacked ? Math.min(56, Math.max(6, step * 0.55)) : Math.max(4, Math.min(40, (step * 0.66) / k));
    // 回退位:组中线 + 组内最高柱顶(同组标签在组上方单列堆叠)
    const groupTop = spec.labels.map((_, pi) => Math.min(...bars.map((s) => y(s.values[pi]))));
    const cursor: number[] = spec.labels.map(() => bottom);
    bars.forEach((s, bi) => {
      const gIdx = spec.series.indexOf(s);
      s.values.forEach((v, pi) => {
        if (stacked && v <= 0) return;
        const isPeak = gIdx === peakS && pi === peakP;
        if (stacked) {
          const x = left + step * pi + (step - barW) / 2;
          const segH = (v / yMax) * (bottom - contentTop);
          const drawH = Math.max(segH, 1.6);
          const yTop = cursor[pi] - drawH;
          cursor[pi] = yTop;
          const isTopSeg = bi === k - 1 || bars.slice(bi + 1).every((ss) => ss.values[pi] === 0);
          const m = isTopSeg ? Math.min(4, barW / 2, drawH) : 0;
          // 细段描边会吃掉颜色,够高才画
          const sw = segH >= 12 ? 2 : 0;
          parts.push(
            `<path d="M${r2(x)} ${r2(yTop + drawH)}V${r2(yTop + m)}Q${r2(x)} ${r2(yTop)} ${r2(x + m)} ${r2(yTop)}` +
            `H${r2(x + barW - m)}Q${r2(x + barW)} ${r2(yTop)} ${r2(x + barW)} ${r2(yTop + m)}V${r2(yTop + drawH)}Z" fill="${colors[gIdx]}"${sw ? ` stroke="var(--d-card)" stroke-width="${sw}"` : ''}/>`,
          );
          // 堆叠段一律入柱,微小段不标
          if (num === 'all' || (num === 'peak' && isPeak)) {
            const text = fmtNum(v);
            if (barW >= textW(text, 7) + 4 && segH >= 7 + 4) {
              withinStack.push({ x, yt: yTop, w: barW, hAvail: segH, text, fs: isPeak ? 12 : 11, peak: isPeak, fill: onVar(gIdx % skin.series.length), center: true, haloColor: colors[gIdx] });
            }
          }
        } else {
          const groupX = left + step * pi + step / 2 - (barW * k) / 2;
          const x = groupX + bi * barW;
          const yt = y(v);
          const m = Math.min(3, barW / 2, bottom - yt);
          parts.push(
            `<path d="M${r2(x)} ${r2(bottom)}V${r2(yt + m)}Q${r2(x)} ${r2(yt)} ${r2(x + m)} ${r2(yt)}` +
            `H${r2(x + barW - m)}Q${r2(x + barW)} ${r2(yt)} ${r2(x + barW)} ${r2(yt + m)}V${r2(bottom)}Z" fill="${colors[gIdx]}"/>`,
          );
          // 零值不标(标注克制原则:零高柱上飘"0"是噪音)
          if (v > 0 && (num === 'all' || (num === 'peak' && isPeak))) {
            barLabels.push({ x, yt, v, color: colors[gIdx], isPeak, barW, row: bi, fx: left + step * pi + step / 2, fyt: groupTop[pi] });
          }
        }
      });
    });
  }



  parts.push(...lineSvg); // 折线在柱之上:始终连续、形状完整

  // 堆叠柱内标签:规划(占用 placer 供线标签避让),输出延后到折线之后
  if (stacked && withinStack.length > 0) {
    reserveBands(placer, left, right, contentTop, bottom, null, spec.series, width - pad, pad + 16);
    // 折线始终在上且连续;堆叠柱内标签靠同色描边遮线,不传 lineSegs(传了会整层放弃)
    pushBarLabelsAllOrNothing(pendingBarLabels, withinStack, placer);
  }

  // 数值标注:全有或全无——任一标签放不下(回退位也相撞)则整层不标,
  // 避免"有些标了有些没标"(2026-09-24 用户反馈);矮柱回退柱顶上方。
  // 顺序:柱标签先放(位置受约束),线标签四候选位弹性后放
  if (!stacked) {
    // 分组路径同样要预留 Y 刻度带/X 标签带/图例带(此前只有堆叠分支预留,
    // 分组密集时柱标签回退位可压图例,线标签峰值位可撞右轴刻度)
    reserveBands(placer, left, right, contentTop, bottom, bottom + 20, spec.series, width - pad, pad + 16);
    if (dual) placer.reserve(right + 2, contentTop - 10, Math.max(width - pad - right - 2, 1), bottom - contentTop + 20); // 双轴右刻度带
    reserveEdges(placer, width, height);
  }
  if (num !== 'none' && (barLabels.length > 0 || lineLabels.length > 0)) {
    const out: string[] = [];
    let allPlaced = true;
    if (barLabels.length > 0) {
      const barOut: string[] = [];
      const ok = pushBarLabelsAllOrNothing(
        barOut,
        barLabels.map((l) => ({ x: l.x, yt: l.yt, w: l.barW, hAvail: bottom - l.yt, text: fmtNum(l.v), fs: l.isPeak ? 12 : 10.5, peak: l.isPeak, fill: onVar(0), row: l.row, fx: l.fx, fyt: l.fyt, insideOnly: true })), // 只进柱:放不下整层不标(同 bar-grouped)
        placer,
        lineSegs,
      );
      if (!ok) allPlaced = false;
      else out.push(...barOut);
    }
    if (allPlaced) {
      const sorted = [...lineLabels].sort((a, b) => Number(b.isPeak) - Number(a.isPeak));
      for (const l of sorted) {
        const probe: string[] = [];
        pushLineLabel(probe, placer, l.px, l.py, l.text, l.isPeak, lineSegs);
        if (probe.length === 0) {
          allPlaced = false;
          break;
        }
        out.push(...probe); // 带引线时是"引线+文字"两个元素
      }
    }
    if (allPlaced) parts.push(...out);
  }

  parts.push(...pendingBarLabels); // 堆叠柱内标签(规划时已横向避开折线)

  // 类别标签
  const xStride = labelStride(spec.labels, step);
  spec.labels.forEach((l, pi) => {
    if (pi % xStride === 0) parts.push(`<text x="${r2(cx(pi))}" y="${r2(bottom + 20)}" text-anchor="middle" font-size="12" fill="var(--d-muted)">${esc(trunc(l, 12))}</text>`);
  });

  return svgDoc(width, height, 'combo', version, spec.title ?? 'combo chart', spec, skin, titleBlock(spec.title) + parts.join(''));
}

// 混合图 1 · Evil 柱线组合(规范 combo-1,960×500):
// 紫色圆角柱(0-100)+ 绿色折线(独立量程),虚线网格,右上方块图例,无数值标注
function renderComboEvil(spec: ComboSpec, o: RenderOpts): string {
  const { width, height, version, skin } = o;
  const n = spec.labels.length;
  const bars = spec.series.filter((s) => s.kind === 'bar');
  const lines = spec.series.filter((s) => s.kind === 'line');
  const barMax = bars.length ? Math.max(...bars.flatMap((s) => s.values)) : 0;
  const lineMax = lines.length ? Math.max(...lines.flatMap((s) => s.values)) : 0;
  const barIdx = spec.series.findIndex((s) => s.kind === 'bar');
  const lineIdx = spec.series.findIndex((s) => s.kind === 'line');
  const barColor = barIdx >= 0 ? sVar(barIdx % skin.series.length) : 'var(--d-s1)';
  const lineColor = lineIdx >= 0 ? sVar(lineIdx % skin.series.length) : 'var(--d-s2)';

  // 几何(规范 960×500 实测):绘图区 72..892 × 118..438,网格 0-100 步 20
  const x0 = Math.round(width * 0.075);
  const y0 = Math.round(height * 0.876);
  const w = width * 0.854;
  const h = height * 0.64;
  const contentTop = y0 - h;
  const slot = w / n;

  const ticks = niceTicks(barMax, 5);
  const barYMax = ticks[ticks.length - 1];
  const yBar = (v: number): number => y0 - (v / barYMax) * h;
  const lineTicks = niceTicks(lineMax, 4);
  const lineYMax = lineTicks[lineTicks.length - 1];
  const yLine = (v: number): number => y0 - (v / lineYMax) * h;

  const parts: string[] = [card(width, height, true)];
  for (const t of ticks) {
    const gyN = yBar(t);
    parts.push(`<line x1="${x0}" y1="${r2(gyN)}" x2="${r2(x0 + w)}" y2="${r2(gyN)}" stroke="var(--d-grid)" stroke-dasharray="4 6"/>`);
    parts.push(`<text x="${r2(x0 - 18)}" y="${r2(gyN + 4)}" text-anchor="end" font-size="11" fill="var(--d-muted)" style="${TAB}">${fmtNum(t)}</text>`);
  }
  // 柱:圆角 rx5,槽内缩 12
  const barW = Math.max(4, slot - Math.min(24, width * 0.025));
  bars.forEach((s) => {
    s.values.forEach((v, i) => {
      if (v <= 0) return;
      parts.push(`<rect x="${r2(x0 + i * slot + (slot - barW) / 2)}" y="${r2(yBar(v))}" width="${r2(barW)}" height="${r2(y0 - yBar(v))}" rx="5" fill="${barColor}"/>`);
    });
  });
  // 线:独立量程,平滑折线 + r4 实心点
  lines.forEach((s) => {
    const pts = s.values.map((v, i) => [x0 + i * slot + slot / 2, yLine(v)] as [number, number]);
    parts.push(`<path d="${smoothPath(pts)}" fill="none" stroke="${lineColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`);
    pts.forEach(([px, py]) => {
      parts.push(`<circle cx="${r2(px)}" cy="${r2(py)}" r="4" fill="${lineColor}"/>`);
    });
  });
  const xStride = labelStride(spec.labels, slot);
  spec.labels.forEach((l, i) => {
    if (i % xStride === 0) parts.push(`<text x="${r2(x0 + i * slot + slot / 2)}" y="${r2(height * 0.936)}" text-anchor="middle" font-size="12" fill="var(--d-muted)">${esc(trunc(l, 12))}</text>`);
  });
  // 右上图例(方块 11×11 rx3,13px)
  const items = [
    ...(bars.length ? [{ name: bars[0].name, color: barColor }] : []),
    ...(lines.length ? [{ name: lines[0].name, color: lineColor }] : []),
  ];
  let lx = x0 + w;
  const legendY = Math.round(height * 0.116);
  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i];
    const tw = textW(it.name, 13);
    parts.push(`<text x="${r2(lx)}" y="${r2(legendY)}" text-anchor="end" font-size="13" fill="var(--d-muted)">${esc(it.name)}</text>`);
    lx -= tw + 16;
    parts.push(`<rect x="${r2(lx)}" y="${r2(legendY - 9)}" width="11" height="11" rx="3" fill="${it.color}"/>`);
    lx -= 27;
  }

  return svgDoc(width, height, 'combo', version, spec.title ?? 'combo chart', spec, skin, parts.join(''));
}
