// 图上的标注层:在图上圈一个椭圆、写一句话。
//
// 用途:AI(或人)拿到一张图,想在上面指出点东西 —— 「那次抖动是发布引起的」。
// 于是 URL 后面可以再挂两个参数:
//
//   &oval=70,25,12,8            圈一个椭圆(中心 70,25;半径 12,8)
//   &oval=70,25,12,8,#22d3ee    同上,换个颜色
//   &text=70,12;发布抖动        写一句话
//   &text=70,12,#22d3ee;发布抖动
//
// 坐标是**百分比**(0-100),相对整张画布 —— 换尺寸、换图种,标注都还在原来的地方。
// 颜色只收 6 位 hex(# 要 URL 编码成 %23)。
//
// 这层是画在图**上面**的一层(g.anno),不改动图本身 —— 图还是那张图,只是上面多了几笔。

import { ApiError } from '../specs/index.js';

export interface Anno {
  kind: 'oval' | 'text';
  /** 椭圆:中心;文字:标签中心(都是百分比) */
  x: number;
  y: number;
  /** 椭圆的半径(百分比) */
  rx?: number;
  ry?: number;
  text?: string;
  color?: string;
}

const HEX_RE = /^#?[0-9a-fA-F]{6}$/;
const DEFAULT_COLOR = '#F87171';

const r2 = (v: number): number => Math.round(v * 100) / 100;

function colorOf(raw: string | undefined, name: string): string | undefined {
  if (raw === undefined || raw === '') return undefined;
  if (!HEX_RE.test(raw)) {
    throw new ApiError(400, `"${name}" color must be a 6-digit hex like %23F87171 — got ${JSON.stringify(raw)}`);
  }
  return '#' + raw.replace('#', '').toLowerCase();
}

/** 百分比坐标 → 画布坐标 */
function pct(v: number, name: string, raw: string): number {
  if (!Number.isFinite(v) || v < -50 || v > 150) {
    throw new ApiError(400, `"${name}" coordinates are percent of the canvas (0-100), got ${JSON.stringify(raw)}`);
  }
  return v;
}

/**
 * 解析标注参数(两个都可以写多次)。
 * 约定:第一个字段是逗号分隔的数,后面用分号分隔别的字段。
 */
export function parseAnnos(params: URLSearchParams): Anno[] | undefined {
  const ovals = params.getAll('oval');
  const texts = params.getAll('text');
  if (!ovals.length && !texts.length) return undefined;
  const out: Anno[] = [];

  for (const raw of ovals) {
    const parts = raw.split(';');
    const nums = parts[0].split(',');
    if (nums.length < 4 || nums.length > 5 || nums.slice(0, 4).some((n) => !Number.isFinite(Number(n)))) {
      throw new ApiError(400, `"oval" expects cx,cy,rx,ry in percent of the canvas (a ,#color may follow), e.g. oval=70,25,12,8 — got ${JSON.stringify(raw)}`);
    }
    out.push({
      kind: 'oval',
      x: pct(Number(nums[0]), 'oval', raw),
      y: pct(Number(nums[1]), 'oval', raw),
      rx: Math.abs(Number(nums[2])),
      ry: Math.abs(Number(nums[3])),
      color: colorOf(nums[4] ?? parts[1], 'oval'),
    });
  }

  for (const raw of texts) {
    const i = raw.indexOf(';');
    const head = i < 0 ? raw : raw.slice(0, i);
    const body = i < 0 ? '' : raw.slice(i + 1);
    const nums = head.split(',');
    if (nums.length < 2 || nums.length > 3 || nums.slice(0, 2).some((n) => !Number.isFinite(Number(n)))) {
      throw new ApiError(400, `"text" expects x,y in percent of the canvas (a ,#color may follow), then the text after ";", e.g. text=70,12;the spike — got ${JSON.stringify(raw)}`);
    }
    const text = body.slice(0, 80);
    if (!text.trim()) {
      throw new ApiError(400, `"text" needs some text after ";", e.g. text=70,12;the spike — got ${JSON.stringify(raw)}`);
    }
    out.push({
      kind: 'text',
      x: pct(Number(nums[0]), 'text', raw),
      y: pct(Number(nums[1]), 'text', raw),
      text,
      color: colorOf(nums[2], 'text'),
    });
  }
  return out;
}

/** 文本宽度估算(CJK 一个字宽,拉丁半个左右) */
function textWidth(text: string, fontSize: number): number {
  let w = 0;
  for (const ch of text) {
    const c = ch.codePointAt(0) ?? 0;
    const wide = c >= 0x1100 && (c <= 0x115f || (c >= 0x2e80 && c <= 0xa4cf && c !== 0x303f)
      || (c >= 0xac00 && c <= 0xd7a3) || (c >= 0xf900 && c <= 0xfaff)
      || (c >= 0xfe30 && c <= 0xfe6f) || (c >= 0xff00 && c <= 0xff60));
    w += wide ? fontSize : fontSize * 0.55;
  }
  return w;
}

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * 标注层 → SVG(画在画布坐标上)。
 * frame 是画布在 viewBox 里的位置与大小(标注的百分比按它换算)。
 */
export function annoLayer(annos: Anno[], frame: { x: number; y: number; w: number; h: number }): string {
  if (!annos.length) return '';
  const parts: string[] = [];
  for (const a of annos) {
    const color = a.color ?? DEFAULT_COLOR;
    if (a.kind === 'oval') {
      const cx = frame.x + (a.x / 100) * frame.w;
      const cy = frame.y + (a.y / 100) * frame.h;
      const rx = ((a.rx ?? 0) / 100) * frame.w;
      const ry = ((a.ry ?? 0) / 100) * frame.h;
      parts.push(
        `<ellipse cx="${r2(cx)}" cy="${r2(cy)}" rx="${r2(rx)}" ry="${r2(ry)}" fill="${color}" fill-opacity="0.08" stroke="${color}" stroke-width="2.5" stroke-opacity="0.95"/>`,
      );
      continue;
    }
    // 文字:一颗胶囊(底下垫一块半透明的底,压在什么颜色上都读得出)
    const fs = 13;
    const text = a.text ?? '';
    const tw = textWidth(text, fs);
    const padX = 8;
    const padY = 5;
    const bw = tw + padX * 2;
    const bh = fs + padY * 2;
    const cx = frame.x + (a.x / 100) * frame.w;
    const cy = frame.y + (a.y / 100) * frame.h;
    const x = cx - bw / 2;
    const y = cy - bh / 2;
    parts.push(
      `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(bw)}" height="${r2(bh)}" rx="${r2(bh / 2)}" fill="${color}" fill-opacity="0.16" stroke="${color}" stroke-opacity="0.5" stroke-width="1"/>`,
    );
    parts.push(
      `<text x="${r2(cx)}" y="${r2(cy + fs * 0.35)}" text-anchor="middle" font-size="${fs}" font-weight="500" fill="${color}">${esc(text)}</text>`,
    );
  }
  return `<g class="anno" data-anno="1">${parts.join('')}</g>`;
}

/**
 * 把标注层塞进一张已经画好的 SVG(盖在最后面 = 最上面)。
 * 坐标按 viewBox 换算 —— 画布尺寸变了,百分比的位置不变。
 */
export function injectAnnos(svg: string, annos: Anno[] | undefined): string {
  if (!annos?.length) return svg;
  if (svg.includes('data-anno="1"')) return svg;      // 已经注过(别叠两层)
  const tag = /<svg\b[^>]*>/.exec(svg);
  if (!tag) return svg;
  const attrs = tag[0];
  const vb = /viewBox="([^"]+)"/.exec(attrs);
  let x0 = 0;
  let y0 = 0;
  let vw = 0;
  let vh = 0;
  if (vb) {
    const n = vb[1].split(/[\s,]+/).map(Number);
    if (n.length === 4 && n.every((v) => Number.isFinite(v))) {
      [x0, y0, vw, vh] = n;
    }
  }
  if (!vw || !vh) {
    const w = /width="([\d.]+)"/.exec(attrs);
    const h = /height="([\d.]+)"/.exec(attrs);
    vw = w ? Number(w[1]) : 0;
    vh = h ? Number(h[1]) : 0;
  }
  if (!vw || !vh) return svg;
  // 百分比按 viewBox 换算(viewBox 原点不一定在 0,0)
  const layer = annoLayer(annos, { x: x0, y: y0, w: vw, h: vh });
  const at = svg.lastIndexOf('</svg>');
  if (at < 0) return svg;
  return svg.slice(0, at) + layer + svg.slice(at);
}
