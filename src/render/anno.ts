// 图上的标注层:在图上圈一个椭圆、写一句话、标一块区域、写一条评论。
//
// 用途:AI(或人)拿到一张图,想在上面指出点东西 —— 「那次抖动是发布引起的」。
// 于是 URL 后面可以再挂几个参数(都能写多次):
//
//   &_oval=70,25,12,8           圈一个椭圆(中心 70,25;半径 12,8)
//   &_oval=70,25,12,8,#22d3ee   同上,换个颜色
//   &_text=70,12;发布抖动       写一句话
//   &_text=70,12,#22d3ee;发布抖动
//   &_hl=20,30,40,25            高亮一块区域(左上角 x,y;宽 w;高 h)
//   &_hl=20,30,40,25,#fbbf24    同上,换个颜色
//   &_note=62,44;这个尖峰是发布引起的   一条评论(从 62,44 拉一条线过去)
//   &_note=62,44,#60a5fa;…      同上,换个颜色
//   &_arrow=20,60,60,20          一支箭头(起点 20,60;终点 60,20)
//   &_arrow=20,60,60,20,#60a5fa  同上,换个颜色
//   &_path=12,30,20,25,31,28,…  手绘的一笔(折线,坐标连着写)
//   &_path=12,30,20,25,#F87171   同上,换个颜色
//
// 坐标是**百分比**(0-100),相对整张画布 —— 换尺寸、换图种,标注都还在原来的地方。
// 颜色只收 6 位 hex(# 要 URL 编码成 %23)。
//
// 通用扩展一律用 `_` 开头:这样不会跟各图种自己的参数(smiles= d= theme= …)打架
// —— 见 x-cmd/draw#33。
//
// 老名字(`oval=` / `text=`,没有下划线)**继续能用**(兼容旧链接 ✓),但正式名是
// `_oval=` / `_text=` ✓;用了老名字会在日志里留一句(便于以后统计、什么时候下掉)✓。
//
// 这层是画在图**上面**的一层(g.anno),不改动图本身 —— 图还是那张图,只是上面多了几笔。

import { ApiError } from '../specs/index.js';

export interface Anno {
  kind: 'oval' | 'text' | 'hl' | 'note' | 'arrow' | 'path';
  /** 椭圆:中心;文字:标签中心;高亮:左上角;评论:引线的落点;箭头:起点;折线:第一点(都是百分比) */
  x: number;
  y: number;
  /** 椭圆的半径(百分比) */
  rx?: number;
  ry?: number;
  /** 高亮的宽高(百分比) */
  w?: number;
  h?: number;
  /** 箭头的终点 */
  x2?: number;
  y2?: number;
  /** 手绘的折线(百分比坐标) */
  pts?: [number, number][];
  text?: string;
  color?: string;
}

const HEX_RE = /^#?[0-9a-fA-F]{6}$/;
const DEFAULT_COLOR = '#F87171';
/** 高亮默认取荧光黄的底色(像荧光笔) */
const HL_COLOR = '#FBBF24';
/** 评论默认取站上的强调色(蓝) */
const NOTE_COLOR = '#60A5FA';
/** 箭头也用强调色(蓝)—— 跟评论一族 */
const ARROW_COLOR = '#60A5FA';

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
 * 解析标注参数(都能写多次)。
 * 约定:第一个字段是逗号分隔的数,后面用分号分隔别的字段。
 */
export function parseAnnos(params: URLSearchParams): Anno[] | undefined {
  // 标注层总开关(explore 页那个按钮):画布标注与数据点标注一起藏 ✓
  if (params.get('markhide') === '1') return undefined;
  // 新名(_oval/_text)是正式名;老名(oval/text)继续收 —— 旧链接不能断 ✓
  const legacyOvals = params.getAll('oval');
  const legacyTexts = params.getAll('text');
  if (legacyOvals.length || legacyTexts.length) {
    console.warn('[draw] 标注层用了老名字(oval=/text=);正式名是 _oval=/_text= —— 见 x-cmd/draw#33');
  }
  const ovals = [...params.getAll('_oval'), ...legacyOvals];
  const texts = [...params.getAll('_text'), ...legacyTexts];
  const hls = params.getAll('_hl');
  const notes = params.getAll('_note');
  const arrows = params.getAll('_arrow');
  const paths = params.getAll('_path');
  if (!ovals.length && !texts.length && !hls.length && !notes.length && !arrows.length && !paths.length) {
    return undefined;
  }
  // 藏起来的:`_hide=0,2`(序号 = 解析出来的顺序,跨种类;explore 页的标注面板写这个参数)
  const hidden = new Set(
    (params.get('_hide') ?? '').split(',').filter(Boolean).map((n) => Number(n)).filter((n) => Number.isFinite(n)),
  );
  const out: Anno[] = [];
  // 序号按「本来会有几条」算(跳过的也算进去)—— 否则藏掉一条,后面的序号全错位
  let seq = 0;
  const skip = (): boolean => hidden.has(seq++);

  for (const raw of ovals) {
    const parts = raw.split(';');
    const nums = parts[0].split(',');
    if (nums.length < 4 || nums.length > 5 || nums.slice(0, 4).some((n) => !Number.isFinite(Number(n)))) {
      throw new ApiError(400, `"_oval" expects cx,cy,rx,ry in percent of the canvas (a ,#color may follow), e.g. _oval=70,25,12,8 — got ${JSON.stringify(raw)}`);
    }
    if (skip()) continue;
    out.push({
      kind: 'oval',
      x: pct(Number(nums[0]), '_oval', raw),
      y: pct(Number(nums[1]), '_oval', raw),
      rx: Math.abs(Number(nums[2])),
      ry: Math.abs(Number(nums[3])),
      color: colorOf(nums[4] ?? parts[1], '_oval'),
    });
  }

  for (const raw of texts) {
    const i = raw.indexOf(';');
    const head = i < 0 ? raw : raw.slice(0, i);
    const body = i < 0 ? '' : raw.slice(i + 1);
    const nums = head.split(',');
    if (nums.length < 2 || nums.length > 3 || nums.slice(0, 2).some((n) => !Number.isFinite(Number(n)))) {
      throw new ApiError(400, `"_text" expects x,y in percent of the canvas (a ,#color may follow), then the text after ";", e.g. _text=70,12;the spike — got ${JSON.stringify(raw)}`);
    }
    const text = body.slice(0, 80);
    if (!text.trim()) {
      throw new ApiError(400, `"_text" needs some text after ";", e.g. _text=70,12;the spike — got ${JSON.stringify(raw)}`);
    }
    if (skip()) continue;
    out.push({
      kind: 'text',
      x: pct(Number(nums[0]), '_text', raw),
      y: pct(Number(nums[1]), '_text', raw),
      text,
      color: colorOf(nums[2], '_text'),
    });
  }

  // 高亮一块区域:_hl=x,y,w,h(左上角 + 宽高,都是百分比)
  for (const raw of hls) {
    const parts = raw.split(';');
    const nums = parts[0].split(',');
    if (nums.length < 4 || nums.length > 5 || nums.slice(0, 4).some((n) => !Number.isFinite(Number(n)))) {
      throw new ApiError(400, `"_hl" expects x,y,w,h in percent of the canvas (a ,#color may follow), e.g. _hl=20,30,40,25 — got ${JSON.stringify(raw)}`);
    }
    const w = Number(nums[2]);
    const h = Number(nums[3]);
    if (w <= 0 || h <= 0) {
      throw new ApiError(400, `"_hl" width and height must be positive, e.g. _hl=20,30,40,25 — got ${JSON.stringify(raw)}`);
    }
    if (skip()) continue;
    out.push({
      kind: 'hl',
      x: pct(Number(nums[0]), '_hl', raw),
      y: pct(Number(nums[1]), '_hl', raw),
      w,
      h,
      color: colorOf(nums[4] ?? parts[1], '_hl'),
    });
  }

  // 一条评论:_note=x,y;评论正文(引线落在 x,y 上)
  for (const raw of notes) {
    const i = raw.indexOf(';');
    const head = i < 0 ? raw : raw.slice(0, i);
    const body = i < 0 ? '' : raw.slice(i + 1);
    const nums = head.split(',');
    if (nums.length < 2 || nums.length > 3 || nums.slice(0, 2).some((n) => !Number.isFinite(Number(n)))) {
      throw new ApiError(400, `"_note" expects x,y in percent of the canvas (a ,#color may follow), then the comment after ";", e.g. _note=62,44;this spike came from the release — got ${JSON.stringify(raw)}`);
    }
    const text = body.slice(0, 200);
    if (!text.trim()) {
      throw new ApiError(400, `"_note" needs some text after ";", e.g. _note=62,44;this spike came from the release — got ${JSON.stringify(raw)}`);
    }
    if (skip()) continue;
    out.push({
      kind: 'note',
      x: pct(Number(nums[0]), '_note', raw),
      y: pct(Number(nums[1]), '_note', raw),
      text,
      color: colorOf(nums[2], '_note'),
    });
  }

  // 一支箭头:_arrow=x1,y1,x2,y2(起点、终点;# 之后可带颜色)
  for (const raw of arrows) {
    const parts = raw.split(';');
    const nums = parts[0].split(',');
    if (nums.length < 4 || nums.length > 5 || nums.slice(0, 4).some((n) => !Number.isFinite(Number(n)))) {
      throw new ApiError(400, `"_arrow" expects x1,y1,x2,y2 in percent of the canvas (a ,#color may follow), e.g. _arrow=20,60,60,20 — got ${JSON.stringify(raw)}`);
    }
    if (skip()) continue;
    out.push({
      kind: 'arrow',
      x: pct(Number(nums[0]), '_arrow', raw),
      y: pct(Number(nums[1]), '_arrow', raw),
      x2: pct(Number(nums[2]), '_arrow', raw),
      y2: pct(Number(nums[3]), '_arrow', raw),
      color: colorOf(nums[4] ?? parts[1], '_arrow'),
    });
  }

  // 手绘的一笔:_path=x1,y1,x2,y2,…(折线;末尾若带 # 就是颜色)
  for (const raw of paths) {
    const parts = raw.split(';');
    const nums = parts[0].split(',');
    // 末尾那一段若带 # ⇒ 是颜色,摘出来
    let colorRaw: string | undefined;
    if (nums.length > 3 && nums[nums.length - 1].trim().startsWith('#')) {
      colorRaw = nums.pop();
    }
    if (nums.length < 4 || nums.length % 2 !== 0 || nums.some((n) => !Number.isFinite(Number(n)))) {
      throw new ApiError(400, `"_path" expects a polyline x1,y1,x2,y2,… in percent of the canvas (a ,#color may follow), e.g. _path=12,30,20,25,31,28 — got ${JSON.stringify(raw)}`);
    }
    const pts: [number, number][] = [];
    for (let i = 0; i + 1 < nums.length; i += 2) {
      pts.push([pct(Number(nums[i]), '_path', raw), pct(Number(nums[i + 1]), '_path', raw)]);
    }
    if (skip()) continue;
    out.push({
      kind: 'path',
      x: pts[0][0],
      y: pts[0][1],
      pts,
      color: colorOf(colorRaw ?? parts[1], '_path'),
    });
  }
  return out;
}

/** 一个字符占几个字宽(CJK 一个字宽,拉丁半个左右) */
function charUnits(ch: string): number {
  const c = ch.codePointAt(0) ?? 0;
  const wide = c >= 0x1100 && (c <= 0x115f || (c >= 0x2e80 && c <= 0xa4cf && c !== 0x303f)
    || (c >= 0xac00 && c <= 0xd7a3) || (c >= 0xf900 && c <= 0xfaff)
    || (c >= 0xfe30 && c <= 0xfe6f) || (c >= 0xff00 && c <= 0xff60));
  return wide ? 1 : 0.55;
}

/** 一段文字占几个字宽 */
function unitsOf(text: string): number {
  let w = 0;
  for (const ch of text) w += charUnits(ch);
  return w;
}

/** 文本宽度估算(CJK 一个字宽,拉丁半个左右) */
function textWidth(text: string, fontSize: number): number {
  return unitsOf(text) * fontSize;
}

/**
 * 折行:中文随处断,西文按空格断(找不到空格就硬断)。
 * maxEm 是「多少字宽」一行 —— 不是多少个字符。
 */
function wrapText(text: string, maxEm: number): string[] {
  const lines: string[] = [];
  // 显式换行先切开,每段各自折行
  for (const para of text.replace(/\r/g, '').split('\n')) {
    let rest = para;
    while (rest.length) {
      if (unitsOf(rest) <= maxEm) {
        lines.push(rest);
        break;
      }
      // 断点:宽度之内最后一个空格
      let cut = -1;
      let w = 0;
      for (let i = 0; i < rest.length; i++) {
        w += charUnits(rest[i]);
        if (w > maxEm) break;
        if (rest[i] === ' ') cut = i;
      }
      if (cut > 0) {
        lines.push(rest.slice(0, cut).trimEnd());
        rest = rest.slice(cut + 1).trimStart();
        continue;
      }
      // 没有空格:按宽度硬断
      let i = 0;
      w = 0;
      while (i < rest.length && w + charUnits(rest[i]) <= maxEm) {
        w += charUnits(rest[i]);
        i++;
      }
      if (i === 0) i = 1;
      lines.push(rest.slice(0, i));
      rest = rest.slice(i);
    }
  }
  return lines.filter((l) => l.length);
}

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * 标注层 → SVG(画在画布坐标上)。
 * frame 是画布在 viewBox 里的位置与大小(标注的百分比按它换算)。
 *
 * 画的时候按kind分批:高亮(区域)在最底下,圈、笔、箭头居中,文字与评论(带引线)最上。
 *
 * k 是「一个用户单位 = 多少像素」的倒数 —— 画布的 viewBox 跟它的像素尺寸
 * 不一定一样(化学结构那张:viewBox 只有 119 个单位,画布 560 像素),
 * 不按它折算,标注会跟着图一起被放大四倍(字变得比分子还大)。
 */
export function annoLayer(annos: Anno[], frame: { x: number; y: number; w: number; h: number }, k = 1): string {
  if (!annos.length) return '';
  const parts: string[] = [];
  const of = (kind: Anno['kind']): Anno[] => annos.filter((a) => a.kind === kind);

  // 一、高亮:一块区域(荧光笔那一笔)
  for (const a of of('hl')) {
    const color = a.color ?? HL_COLOR;
    const x = frame.x + (a.x / 100) * frame.w;
    const y = frame.y + (a.y / 100) * frame.h;
    const w = ((a.w ?? 0) / 100) * frame.w;
    const h = ((a.h ?? 0) / 100) * frame.h;
    parts.push(
      `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(w)}" height="${r2(h)}" rx="${r2(10 * k)}" fill="${color}" fill-opacity="0.13" stroke="${color}" stroke-opacity="0.85" stroke-width="${r2(1.5 * k)}"/>`,
    );
  }

  // 二、圈一个点
  for (const a of of('oval')) {
    const color = a.color ?? DEFAULT_COLOR;
    const cx = frame.x + (a.x / 100) * frame.w;
    const cy = frame.y + (a.y / 100) * frame.h;
    const rx = ((a.rx ?? 0) / 100) * frame.w;
    const ry = ((a.ry ?? 0) / 100) * frame.h;
    parts.push(
      `<ellipse cx="${r2(cx)}" cy="${r2(cy)}" rx="${r2(rx)}" ry="${r2(ry)}" fill="${color}" fill-opacity="0.08" stroke="${color}" stroke-width="${r2(2.5 * k)}" stroke-opacity="0.95"/>`,
    );
  }

  // 三、手绘的一笔:_path= 折线(笔触)
  for (const a of of('path')) {
    const color = a.color ?? DEFAULT_COLOR;
    const pts = a.pts ?? [];
    if (pts.length < 2) continue;
    const d = pts
      .map(([px, py], i) => `${i ? 'L' : 'M'}${r2(frame.x + (px / 100) * frame.w)},${r2(frame.y + (py / 100) * frame.h)}`)
      .join(' ');
    parts.push(
      `<path d="${d}" fill="none" stroke="${color}" stroke-width="${r2(2.2 * k)}" stroke-opacity="0.95" stroke-linecap="round" stroke-linejoin="round"/>`,
    );
  }

  // 四、一支箭头:_arrow= 起点、终点(末端一个箭头)
  for (const a of of('arrow')) {
    const color = a.color ?? ARROW_COLOR;
    const x1 = frame.x + (a.x / 100) * frame.w;
    const y1 = frame.y + (a.y / 100) * frame.h;
    const x2 = frame.x + ((a.x2 ?? a.x) / 100) * frame.w;
    const y2 = frame.y + ((a.y2 ?? a.y) / 100) * frame.h;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    if (len < 1e-6) {
      parts.push(`<circle cx="${r2(x2)}" cy="${r2(y2)}" r="${r2(3 * k)}" fill="${color}"/>`);
      continue;
    }
    const ux = dx / len;
    const uy = dy / len;
    const head = Math.min(12 * k, len * 0.7);       // 箭头别比线还长
    const bx = x2 - ux * head;
    const by = y2 - uy * head;
    const half = head * 0.42;                       // 张开的角度
    parts.push(
      `<line x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(x2)}" y2="${r2(y2)}" stroke="${color}" stroke-width="${r2(2 * k)}" stroke-opacity="0.95" stroke-linecap="round"/>`,
      `<path d="M${r2(x2)},${r2(y2)}L${r2(bx - uy * half)},${r2(by + ux * half)}L${r2(bx + uy * half)},${r2(by - ux * half)}" fill="none" stroke="${color}" stroke-width="${r2(2 * k)}" stroke-opacity="0.95" stroke-linecap="round" stroke-linejoin="round"/>`,
    );
  }

  // 五、一句话:一颗胶囊(底下垫一块半透明的底,压在什么颜色上都读得出)
  for (const a of of('text')) {
    const color = a.color ?? DEFAULT_COLOR;
    const fs = 13 * k;
    const text = a.text ?? '';
    const tw = textWidth(text, fs);
    const padX = 8 * k;
    const padY = 5 * k;
    const bw = tw + padX * 2;
    const bh = fs + padY * 2;
    const cx = frame.x + (a.x / 100) * frame.w;
    const cy = frame.y + (a.y / 100) * frame.h;
    const x = cx - bw / 2;
    const y = cy - bh / 2;
    parts.push(
      `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(bw)}" height="${r2(bh)}" rx="${r2(bh / 2)}" fill="${color}" fill-opacity="0.16" stroke="${color}" stroke-opacity="0.5" stroke-width="${r2(k)}"/>`,
    );
    parts.push(
      `<text x="${r2(cx)}" y="${r2(cy + fs * 0.35)}" text-anchor="middle" font-size="${r2(fs)}" font-weight="500" fill="${color}">${esc(text)}</text>`,
    );
  }

  // 六、一条评论:一条引线 + 一个多行的框(框自己挑位置:右边放不下就放左边)
  for (const a of of('note')) {
    const color = a.color ?? NOTE_COLOR;
    const fs = 13 * k;
    const text = a.text ?? '';
    const lines = wrapText(text, 20).slice(0, 4);
    if (!lines.length) continue;
    const lh = fs * 1.35;
    const padX = 10 * k;
    const padY = 8 * k;
    const bw = Math.max(...lines.map((l) => unitsOf(l) * fs)) + padX * 2;
    const bh = lines.length * lh + padY * 2;
    const ax = frame.x + (a.x / 100) * frame.w;
    const ay = frame.y + (a.y / 100) * frame.h;
    const gap = 16 * k;
    // 框放在引线的哪一侧:先试右边,再试左边;上面放不下就放下面
    let bx = ax + gap;
    if (bx + bw > frame.x + frame.w) bx = ax - gap - bw;
    let by = ay - gap - bh;
    if (by < frame.y) by = ay + gap;
    // 夹回画布(太小放不下时宁可压边,也不能跑出去)
    bx = Math.min(Math.max(bx, frame.x), Math.max(frame.x, frame.x + frame.w - bw));
    by = Math.min(Math.max(by, frame.y), Math.max(frame.y, frame.y + frame.h - bh));
    // 引线:从落点连到框上最近的那一点
    const px = Math.min(Math.max(ax, bx), bx + bw);
    const py = Math.min(Math.max(ay, by), by + bh);
    parts.push(
      `<line x1="${r2(ax)}" y1="${r2(ay)}" x2="${r2(px)}" y2="${r2(py)}" stroke="${color}" stroke-width="${r2(1.4 * k)}" stroke-opacity="0.85"/>`,
      `<circle cx="${r2(ax)}" cy="${r2(ay)}" r="${r2(3.2 * k)}" fill="${color}"/>`,
      // 垫色:底下垫一块近黑的底 —— 压在什么颜色的图上都读得出(亮底上是深色小牌,暗底上融进背景)
      `<rect x="${r2(bx)}" y="${r2(by)}" width="${r2(bw)}" height="${r2(bh)}" rx="${r2(10 * k)}" fill="#0b0c0f" fill-opacity="0.86" stroke="${color}" stroke-opacity="0.6" stroke-width="${r2(k)}"/>`,
    );
    lines.forEach((l, i) => {
      parts.push(
        `<text x="${r2(bx + padX)}" y="${r2(by + padY + lh * i + fs * 0.82)}" font-size="${r2(fs)}" fill="${color}">${esc(l)}</text>`,
      );
    });
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
  // 画布的像素尺寸跟 viewBox 不一定一样(化学结构那张:viewBox 119 个单位、
  // 画布 560 像素 —— 图被放大了四倍多)。标注的字号、线宽得按同一个比例折算,
  // 否则标注会跟着图一起被放大(字比分子还大)。
  const px = /width="([\d.]+)"/.exec(attrs);
  const scale = px && vw > 0 ? Number(px[1]) / vw : 1;
  const k = scale > 0 ? 1 / scale : 1;
  // 百分比按 viewBox 换算(viewBox 原点不一定在 0,0)
  const layer = annoLayer(annos, { x: x0, y: y0, w: vw, h: vh }, k);
  const at = svg.lastIndexOf('</svg>');
  if (at < 0) return svg;
  return svg.slice(0, at) + layer + svg.slice(at);
}
