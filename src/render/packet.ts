// /draw/packet —— 数据包图(bit field 图):一条横带,按比特区间切成一段段字段。
//
// 报文头那种图:「源端口 16 位、目标端口 16 位、序列号 32 位」——
// 段的宽度必须按比特数成比例(16 位的那段是 32 位那段的一半宽),不然图就在骗人。
// 顶上再画一把比特标尺(0 … 63),读者一眼知道每段有多宽。
//
// 参数语法(field= 可重复,段内用 | 分隔):
//   field=<start>|<end>|<name>     比特区间(单个比特写 start|start 或只写 start)
//   title=<标题>
// 例:/draw/packet?field=0|15|Source%20Port&field=16|31|Destination%20Port
import { ApiError } from '../specs/index.js';
import { resolveVersion } from '../version.js';
import { resolveSkin } from '../styles/index.js';
import { card } from '../theme.js';
import { clampInt, schemeParam, type DrawResult } from './query.js';
import { esc, r2, sVar, svgDoc, subtitleBlock, textW, titleBlock, trunc } from './svg.js';

const PAD = 24;
const RULER_H = 26;        // 顶部比特标尺带的高
const BAR_H = 58;          // 字段条的高
const NAME_GAP = 8;        // 字段名与条顶的空档(名字写在条上方时)
const BIT_MIN = 14;        // 一比特至少这么宽(不然标尺上的数字挤成一坨)
const N_EXAMPLE = 'field=0|15|Source Port&field=16|31|Destination Port&field=32|63|Sequence Number';

/** 一个比特区间 */
export interface PacketField {
  /** 起始比特(含) */
  start: number;
  /** 结束比特(含) */
  end: number;
  /** 字段名 */
  name: string;
}

/** 数据包图的规格 */
export interface PacketSpec {
  title?: string;
  subtitle?: string;
  fields: PacketField[];
}

function bad(detail: string): never {
  throw new ApiError(400, `${detail} Example: /draw/packet?${N_EXAMPLE}`);
}

/**
 * 切 field= 的一段:`start|end|name`。
 *
 * 名字里可以带 | 吗?不可以 —— 名字就是最后一段,前面两段必须是数字。
 * 名字自己带竖线时用 %7C 转义?不必 —— 名字里本来就不该有竖线。
 */
function parseField(raw: string, i: number): PacketField {
  const f = raw.split('|');
  if (f.length < 2) {
    bad(`"field" #${i + 1} must be "start|end|name" (a bit range and a field name), got ${JSON.stringify(raw)}`);
  }
  const start = Number(f[0].trim());
  const end = f.length >= 3 && f[1].trim() !== '' ? Number(f[1].trim()) : start;
  const name = (f.length >= 3 ? f.slice(2).join('|') : '').trim();
  if (!Number.isInteger(start) || start < 0) {
    bad(`"field" #${i + 1}: start must be a non-negative integer, got ${JSON.stringify(f[0])}`);
  }
  if (!Number.isInteger(end) || end < start) {
    bad(`"field" #${i + 1}: end must be an integer >= start, got ${JSON.stringify(f[1])}`);
  }
  if (!name) {
    bad(`"field" #${i + 1}: the field name is required`);
  }
  return { start, end, name };
}

/** 规格的 JSON 形态 → 规格(短链/库用户直接给结构) */
export function parsePacketSpec(raw: string): PacketSpec {
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    bad(`packet spec must be JSON, got ${JSON.stringify(raw.slice(0, 60))}`);
  }
  const o = (obj ?? {}) as Partial<PacketSpec>;
  const fields = Array.isArray(o.fields) ? o.fields : [];
  if (!fields.length) bad('packet spec needs at least one field');
  return {
    ...(typeof o.title === 'string' && o.title.trim() ? { title: o.title.trim() } : {}),
    ...(typeof o.subtitle === 'string' && o.subtitle.trim() ? { subtitle: o.subtitle.trim() } : {}),
    fields: fields.map((f, i) => {
      const start = Number((f as PacketField).start);
      const end = Number((f as PacketField).end ?? (f as PacketField).start);
      const name = String((f as PacketField).name ?? '').trim();
      if (!Number.isInteger(start) || start < 0) bad(`field #${i + 1}: start must be a non-negative integer`);
      if (!Number.isInteger(end) || end < start) bad(`field #${i + 1}: end must be an integer >= start`);
      if (!name) bad(`field #${i + 1}: name is required`);
      return { start, end, name };
    }),
  };
}

/** URL 参数 → 规格 */
export function packetSpecFromParams(params: URLSearchParams): PacketSpec {
  const raw = params.getAll('field').filter((v) => v.trim() !== '');
  if (!raw.length) {
    bad(`at least one "field" is required (e.g. field=0|15|Source Port)`);
  }
  const fields = raw.map(parseField);
  // 区间不许重叠 —— 重叠的字段图上是画不出来的(一段里塞两个字段?)
  const sorted = [...fields].sort((a, b) => a.start - b.start);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].start <= sorted[i - 1].end) {
      bad(`fields "${sorted[i - 1].name}" (${sorted[i - 1].start}-${sorted[i - 1].end}) and "${sorted[i].name}" (${sorted[i].start}-${sorted[i].end}) overlap`);
    }
  }
  const title = params.get('title')?.trim() || undefined;
  const subtitle = params.get('subtitle')?.trim() || undefined;
  return { ...(title ? { title } : {}), ...(subtitle ? { subtitle } : {}), fields };
}

/**
 * 比特标尺上要标出来的刻度(比特序号,相对 lo 的偏移)。
 *
 * 步长取 1/2/5×10ⁿ 的整数 —— 报文是按字节读的,8/16/32 这类刻度读者一眼认得。
 */
function rulerTicks(span: number): number[] {
  const out = new Set<number>([0]);
  const step = Math.max(1, niceStep(span / 8));
  for (let v = step; v < span; v += step) out.add(v);
  return [...out].sort((a, b) => a - b);
}

/** "好看"的步长(1/2/5×10ⁿ) */
function niceStep(raw: number): number {
  if (!(raw > 0)) return 1;
  const e = Math.floor(Math.log10(raw));
  const base = Math.pow(10, e);
  const n = raw / base;
  const m = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return m * base;
}

const DEFS =
  `<defs>` +
  `<marker id="pk-a" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--d-muted)"/></marker>` +
  `</defs>`;

/**
 * 画一张数据包图。
 *
 * 段的宽度 = 比特跨度 × 每比特像素宽(每比特像素宽取「画布宽 ÷ 总比特数」与
 * 最小比特宽的较大者 —— 比特少的时候也要保证每段看得清)。
 * 字段名写在段里(段够宽)或段上方(段太窄),两处都不会压到邻居。
 */
export function renderPacket(spec: PacketSpec, o: {
  width: number;
  height: number;
  version: number;
  skin: ReturnType<typeof resolveSkin>;
  interactive?: boolean;
}): string {
  const width = o.width;
  const height = o.height;
  const skin = o.skin;
  const fields = spec.fields;
  if (!fields.length) bad('packet needs at least one field');

  // 比特轴:从最小的 start 到最大的 end(通常 0 起)
  const lo = Math.min(...fields.map((f) => f.start));
  const hi = Math.max(...fields.map((f) => f.end));
  // 位数:hi - lo + 1(第 0 位到第 63 位是 64 位,不是 63 位)
  const span = Math.max(1, hi - lo + 1);

  // 标题区高度:有标题就给它留出位置(跟别的图种一样:标题在最上,身子往下让)
  const titleH = spec.title ? 40 : 30; // 没标题也留一条带:右上角那枚角标在那儿
  const subH = spec.subtitle ? 18 : 0;

  // 每比特的像素宽:先按「画布装得下」算;装不下就把画布撑宽 ——
  // 段宽必须与比特数成比例,那就宁可画布大一点,也不能裁掉一段。
  const endW = textW(String(hi + 1), 10) + 14;
  const perBit = Math.max(BIT_MIN, (width - PAD * 2 - endW) / span);
  const barW = perBit * span;
  // 画布右侧留一点:末尾那个「到这儿为止」的刻度数字要写在条外面
  const canvasW = Math.max(width, Math.ceil(PAD * 2 + barW + endW));
  const barX = PAD;

  // 字段名写在段上方还是段里:段够宽(名字 + 内边距)就写段里,否则写上面
  const nameFs = 13;
  const inside: boolean[] = fields.map((f) => {
    const w = (f.end - f.start + 1) * perBit;
    return w >= textW(f.name, nameFs) + 12;
  });
  // 有字段写上面 → 名字带要占一行
  const needNameBand = inside.some((v) => !v);
  const barY = PAD + titleH + subH + RULER_H + (needNameBand ? NAME_GAP + 16 : 0);
  const barH = Math.max(BAR_H, height - barY - PAD);
  const canvasH = Math.max(height, Math.ceil(barY + barH + PAD));

  const parts: string[] = [];
  parts.push(DEFS);

  // 比特标尺:一条细线 + 刻度数字(刻度落在比特的左沿上)
  const rulerY = PAD + titleH + subH + RULER_H - 8;
  parts.push(`<line x1="${r2(barX)}" y1="${r2(rulerY)}" x2="${r2(barX + barW)}" y2="${r2(rulerY)}" stroke="var(--d-grid)" stroke-width="1"/>`);
  const ticks = rulerTicks(span);
  for (const t of ticks) {
    const x = barX + t * perBit;
    const label = String(t + lo);
    // 刻度数字太宽就左右挪一点,免得压到邻居
    const w = textW(label, 10);
    const anchor = x - w / 2 < barX - 2 ? 'start' : x + w / 2 > barX + barW + 2 ? 'end' : 'middle';
    parts.push(
      `<text x="${r2(x)}" y="${r2(rulerY - 6)}" text-anchor="${anchor}" font-size="10" fill="var(--d-muted)">${esc(label)}</text>`,
    );
  }
  // 末尾:最后一位的右沿(标出「到这儿为止」)—— 画布右侧留了 PAD,放得下
  const endLabel = String(hi + 1);
  parts.push(
    `<text x="${r2(barX + barW + 6)}" y="${r2(rulerY - 6)}" text-anchor="start" font-size="10" fill="var(--d-faint)">${esc(endLabel)}</text>`,
  );

  // 字段段:同一个色相、深浅交替 —— 一眼看得出是「一条报文」,
  // 不是一行告警(红绿交替会让人以为有的字段有问题)。
  fields.forEach((f, i) => {
    const x = barX + (f.start - lo) * perBit;
    const w = Math.max(2, (f.end - f.start + 1) * perBit);
    const fill = sVar(0);
    const op = i % 2 === 0 ? 0.2 : 0.1;
    const tip = o.interactive
      ? ` data-tip="${esc(`${f.name} · bits ${f.start}-${f.end} (${f.end - f.start + 1} bits)`)}" tabindex="0"`
      : '';
    parts.push(
      `<g${tip}>` +
      `<rect x="${r2(x)}" y="${r2(barY)}" width="${r2(w)}" height="${r2(barH)}" fill="${fill}" fill-opacity="${op}" stroke="${fill}" stroke-opacity="0.45" stroke-width="1"/>` +
      `</g>`,
    );
    // 名字:段里放得下就放段里(竖排居中),否则放到段上方
    if (inside[i]) {
      const label = trunc(f.name, Math.max(4, Math.floor((w - 12) / 7)));
      parts.push(
        `<text x="${r2(x + w / 2)}" y="${r2(barY + barH / 2 + 4.5)}" text-anchor="middle" font-size="${nameFs}" font-weight="500" fill="var(--d-ink)">${esc(label)}</text>`,
      );
    } else {
      const label = trunc(f.name, 18);
      parts.push(
        `<text x="${r2(x + w / 2)}" y="${r2(barY - 8)}" text-anchor="middle" font-size="11.5" fill="var(--d-text)">${esc(label)}</text>`,
      );
    }
    // 比特区间标在段的下面(小字):0-15
    parts.push(
      `<text x="${r2(x + w / 2)}" y="${r2(barY + barH + 15)}" text-anchor="middle" font-size="10" fill="var(--d-faint)">${esc(`${f.start}-${f.end}`)}</text>`,
    );
  });

  // 交互层:悬停时提亮那一段
  const iStyle = o.interactive
    ? `<style>#pk g[data-tip]{cursor:pointer;transition:filter .12s ease}#pk g[data-tip]:hover{filter:brightness(1.25)}</style>`
    : '';
  parts.unshift(iStyle);

  const head = titleBlock(spec.title, PAD) + subtitleBlock(spec.subtitle, PAD, !!spec.title);
  const bg = skin.rules.canvas === 'card' ? card(canvasW, canvasH) : '';
  const meta = o.interactive
    ? `<metadata id="pfields">${esc(JSON.stringify(spec))}</metadata>`
    : '';
  const aria = spec.title ?? `packet diagram, ${fields.length} fields`;
  return svgDoc(canvasW, canvasH, 'packet', o.version, aria, spec, skin, bg + meta + head + `<g id="pk">${parts.join('')}</g>`);
}

/**
 * `/draw/packet` 入口:GET ?field=…&field=…&title=…
 */
export function renderPacketFromUrl(url: URL, interactive = false): DrawResult {
  const params = url.searchParams;
  const spec = packetSpecFromParams(params);
  const v = resolveVersion(params.get('v'));
  const skin = resolveSkin('sankey', params.get('t'), schemeParam(params));
  const width = clampInt(params, 'w', 720, 200, 2400);
  const height = clampInt(params, 'h', 220, 140, 2400);
  const svg = renderPacket(spec, { width, height, version: v.version, skin, interactive });
  return { svg, version: v.version, cacheControl: v.cacheControl };
}
