// /draw/arch —— 架构图 v2:同一套 URL 模型(data 和布局都写在 URL 里),换一张更像架构图的脸。
//
// 与 /draw/archmap 的关系:模型一模一样(n=/e=/b=),只是长相不同:
//   - 节点按语义类型着色(淡填色 + 同色描边),不再是一根色条
//   - 左上角一个类型角标(F/B/D/C/S/M/V/X)
//   - 底部一行图例:类型 + 个数
//   - 轨道间距、节点尺寸、画布留白都更松,图能撑到该有的那么大
//   - 边标签带底衬,线不再从字上穿过
//   - 边界用虚线框 + 标签胶囊
//
// 老路径 /draw/archmap 一行未动(它的输出与 v2 之前逐字节相同)。
import { ApiError } from '../specs/index.js';
import type { ArchBoundary, ArchEdge, ArchNode } from './archmap.js';
import {
  boundaryBox, packGrid, parseBoundaries, parseEdges, parseNodes, port, step,
  TYPE_COLOR, type Box, type Placed, type Side,
} from './archmap.js';
import { gridLayout, labelGaps, type LayoutEngine } from './layout.js';
import { resolveSkin } from '../styles/index.js';
import { clampInt, dirParam, schemeParam, type DrawResult } from './query.js';
import { esc, r2, svgDoc, textW, trunc} from './svg.js';
import { iconOf } from './icons.js';
import { groupIcon } from './orgicon.js';

/**
 * `org:` 前缀 = 公司/机构图标。那族图标在私有仓的内部图库里(商标图形不能公开分发),
 * 公开请求查不到 → 画组图标(自绘的通用机构剪影),不是"图片挂了"。
 * 其余前缀(aws/azure/gcp)是云服务图标,公开可用,行为不变。
 */
const isOrgIcon = (name: string): boolean => name.startsWith('org:');


/* ---------------------------------------------------------------- 视觉常量 */
const PAD = 44;          // 画布留白
const GAP_X = 64;        // 轨道横距
const GAP_Y = 56;        // 轨道纵距
const LEGEND_H = 46;     // 图例带的高度
const NODE_MIN_W = 176;
const NODE_R = 12;       // 节点圆角
const BADGE = 20;        // 角标边长
const LABEL_FS = 14;     // 节点标题字号
const SUB_FS = 11.5;     // 节点副标题字号
const EDGE_FS = 11.5;    // 边标签字号

/** 一套语义类型词汇:类型 → (展示名, 角标字母, 颜色序号);图种换词汇,引擎不变 */
export interface HouseTypes {
  meta: Record<string, { name: string; badge: string; color: number }>;
  order: string[];
  /** 类型 → 形状(rect / round / cylinder / diamond) */
  shape?: Record<string, 'rect' | 'round' | 'cylinder' | 'diamond'>;
  /** 节点里的多行内容按「字段表」画:键标记 + 名字(左)+ 类型(右) */
  rows?: 'fields';
  /** 边按 ERD 记号画:标签写 1:N 时,两端画「一」与「多」 */
  crows?: 'erd';
  /** 边按 UML 记号画:标签写 extends / implements 时用空心三角 */
  uml?: boolean;
  /** 节点画成大图标(diagrams + 那种云架构海报):图标在上,名字在下 */
  icons?: 'big';
}

/** 语义类型 → (展示名, 角标字母) */
export const TYPE_META: Record<string, { name: string; badge: string; color: number }> = {
  fe: { name: 'Frontend', badge: 'F', color: 0 },
  be: { name: 'Backend', badge: 'B', color: 1 },
  db: { name: 'Database', badge: 'D', color: 2 },
  cloud: { name: 'Cloud', badge: 'C', color: 3 },
  sec: { name: 'Security', badge: 'S', color: 4 },
  bus: { name: 'Message bus', badge: 'M', color: 5 },
  svc: { name: 'Service', badge: 'V', color: 6 },
  ext: { name: 'External', badge: 'X', color: -1 },
};
const TYPE_ORDER = ['fe', 'be', 'db', 'cloud', 'sec', 'bus', 'svc', 'ext'] as const;

/** 架构图这套词汇(别的图种传自己的一套进来) */
export const ARCH_TYPES: HouseTypes = { meta: TYPE_META, order: [...TYPE_ORDER] };
/** 云架构(大图标版):节点就是图标,名字在下面 —— diagrams + 那种海报的画法 */
export const CLOUD_TYPES: HouseTypes = { ...ARCH_TYPES, icons: 'big' };

const sVar = (i: number): string => `var(--d-s${i + 1})`;

/** v2 的节点尺寸:更宽更松,标题 14px;副标题多行时按行数长高 */
// 大图标节点的排版:图标 → 名字 → 副标题,每一步都留够空当
// (图标底到名字的字头 10px;名字的伸部到副标题的字头 7px)
const ICON_BIG = 64;      // 图标边长
const ICON_GAP = 10;      // 图标底 → 名字字头
const CAP = (fs: number): number => fs * 0.72;   // 字头高
const DESC = (fs: number): number => fs * 0.22;  // 伸部高
const ICON_NAME_DY = ICON_BIG + ICON_GAP + CAP(14);   // 名字基线(相对框顶)
const ICON_SUB_DY = ICON_NAME_DY + DESC(14) + 7 + CAP(11.5); // 副标题基线

/** 节点副标题可以多行(用 \n 分隔)—— ERD 的字段表、class 的成员表靠它 */
const linesOf = (n: { sub?: string }): string[] =>
  n.sub ? n.sub.split('\n').filter((l) => l !== '') : [];

const v2Size = (n: ArchNode, types: HouseTypes): { w: number; h: number } => {
  if (types.rows === 'fields') return fieldsSize(n);
  const lines = linesOf(n);
  // 大图标节点:图标占一块,名字在下面 —— 宽度由名字决定(图标不会更宽)
  // 图标库里没有这个图标 → 按普通节点算,别在顶上留一块空地(很难看)
  // (org: 查不到也有图标 —— 画组图标,节点还是图标节点,不是普通方框)
  if (types.icons === 'big' && n.icon && (n.iconData || isOrgIcon(n.icon))) {
    const w = Math.max(ICON_BIG, textW(n.label, LABEL_FS) + 8, ...lines.map((l) => textW(l, SUB_FS) + 8));
    const h = n.sub ? ICON_SUB_DY + DESC(11.5) + 4 : ICON_NAME_DY + DESC(14) + 4;
    return { w, h };
  }
  const w = Math.max(
    NODE_MIN_W,
    textW(n.label, LABEL_FS) + 52,
    ...lines.map((l) => textW(l, SUB_FS) + 52),
  );
  const h = lines.length > 1 ? 34 + lines.length * 17 : n.sub ? 62 : 48;
  return { w: Math.min(w, 420), h };
};

/* ---------------------------------------------------------------- 字段表
   ERD 的字段、class 的成员 —— 一行一项:键标记 + 名字(左)+ 类型(右)。 */
interface FieldRow {
  name: string;
  type?: string;
  /** 主键 / 外键 / 唯一键 */
  key?: 'pk' | 'fk' | 'uk';
  /** UML 可见性:+ 公有 / - 私有 / # 保护 */
  vis?: '+' | '-' | '#';
}

const KEY_MARK_RE = /\((pk|fk|uk)\)\s*$/i;
const VIS_MARK_RE = /^([+\-#])\s+/;

/**
 * 解析字段表的一行:
 *   id:int (pk)        → 名字 id,类型 int,主键
 *   user_id:int (fk)   → 外键
 *   + gateway: Payment → UML 公有成员
 *   greet(): void      → 方法
 *   charge(amount: Money): Result → 参数里的冒号不算,类型是 Result
 */
function parseFieldRow(line: string): FieldRow {
  let s = line.trim();
  const row: FieldRow = { name: s };
  const vm = VIS_MARK_RE.exec(s);
  if (vm) {
    row.vis = vm[1] as '+' | '-' | '#';
    s = s.slice(vm[0].length).trim();
  }
  const km = KEY_MARK_RE.exec(s);
  if (km) {
    row.key = km[1].toLowerCase() as 'pk' | 'fk' | 'uk';
    s = s.slice(0, km.index).trim();
  }
  // 括号外的第一个冒号才是「名字 : 类型」的分界
  let depth = 0;
  let ci = -1;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '(' || ch === '<' || ch === '[') depth++;
    else if (ch === ')' || ch === '>' || ch === ']') depth--;
    else if (ch === ':' && depth === 0) { ci = i; break; }
  }
  row.name = ci < 0 ? s : s.slice(0, ci).trim();
  const type = ci < 0 ? '' : s.slice(ci + 1).trim();
  if (type) row.type = type;
  return row;
}

const fieldRowsOf = (n: { sub?: string }): FieldRow[] =>
  n.sub ? n.sub.split('\n').filter((l) => l.trim() !== '').map(parseFieldRow) : [];

const KEY_BADGE_W = 26;   // 键标记(PK/FK/UK)那一列的宽
const VIS_W = 14;         // 可见性标记那一列的宽
const ROW_H = 19;         // 一行字段的高
const HEAD_H = 30;        // 标题条的高
const COL_GAP = 18;       // 名字列与类型列之间的空档
const ROW_TOP = HEAD_H + 16; // 第一行字段的基线:离标题条下沿留一口气(贴着看不清)

/** 字段表模式的节点尺寸:名字左、类型右,两列都要放得下 */
function fieldsSize(n: ArchNode): { w: number; h: number } {
  const rows = fieldRowsOf(n);
  const keyCol = rows.some((r) => r.key) ? KEY_BADGE_W : 0;
  const visCol = rows.some((r) => r.vis) ? VIS_W : 0;
  const nameW = Math.max(0, ...rows.map((r) => textW(r.name, SUB_FS)));
  const typeW = Math.max(0, ...rows.map((r) => textW(r.type ?? '', SUB_FS)));
  const bodyW = keyCol + visCol + nameW + (typeW ? COL_GAP + typeW : 0);
  const w = Math.max(NODE_MIN_W, textW(n.label, LABEL_FS) + 52, bodyW + 26);
  const h = rows.length ? ROW_TOP + (rows.length - 1) * ROW_H + 12 : HEAD_H + 24;
  return { w: Math.min(w, 460), h };
}

/* ---------------------------------------------------------------- 节点 */
function drawNodeV2(n: Placed, interactive: boolean, degree: number, types: HouseTypes): string {
  const b = n.box;
  const icon = n.iconData;
  // org: 前缀但图库里查不到 → 组图标(公开层的默认长相:这是个机构,但不给你看 mark)
  const orgFallback = !!n.icon && !icon && isOrgIcon(n.icon);
  const meta = types.meta[n.type] ?? { name: n.type, badge: '?', color: -1 };
  const neutral = meta.color < 0;
  const color = neutral ? 'var(--d-muted)' : sVar(meta.color);
  const fill = neutral ? 'var(--d-card)' : color;
  const fillOp = neutral ? 1 : 0.1;
  const strokeOp = neutral ? 1 : 0.5;
  const dash = neutral ? ' stroke-dasharray="5 3"' : '';
  const titleW = textW(n.label, LABEL_FS);
  const subW = n.sub ? textW(n.sub, SUB_FS) : 0;
  // 角标在左上角;标题居中,若会撞上角标就右移半个角标
  const bx = b.x + 12;
  const by = b.y + 12;
  const badgeRight = bx + BADGE;
  let tx = b.x + b.w / 2;
  if (n.sub) {
    if (tx - titleW / 2 < badgeRight + 6) tx = badgeRight + 6 + titleW / 2;
  } else if (tx - titleW / 2 < badgeRight + 6 && bx < b.x + b.w / 2) {
    tx = badgeRight + 6 + titleW / 2;
  }
  const lines = linesOf(n);
  const titleY = n.sub ? b.y + 26 : b.y + b.h / 2 + 5;
  const tip = `${n.label}${n.sub ? ` · ${n.sub.replace(/\n/g, ', ')}` : ''} · ${meta.name}${degree ? ` · ${degree} link${degree > 1 ? 's' : ''}` : ''}`;
  const ia = interactive
    ? ` data-node="${esc(n.id)}" data-tip="${esc(tip)}" tabindex="0"`
    : '';
  const badgeFill = neutral ? 'var(--d-muted)' : color;
  const shape = types.shape?.[n.type] ?? 'rect';
  const fillAttrs = ` fill="${fill}" fill-opacity="${fillOp}" stroke="${color}" stroke-opacity="${strokeOp}" stroke-width="1.3"${dash}`;
  let frame: string;
  if (shape === 'cylinder') {
    const ry = 9;
    frame =
      `<path d="M${r2(b.x)} ${r2(b.y + ry)}A${r2(b.w / 2)} ${ry} 0 0 1 ${r2(b.x + b.w)} ${r2(b.y + ry)}V${r2(b.y + b.h - ry)}A${r2(b.w / 2)} ${ry} 0 0 1 ${r2(b.x)} ${r2(b.y + b.h - ry)}Z"${fillAttrs}/>` +
      `<ellipse cx="${r2(b.x + b.w / 2)}" cy="${r2(b.y + ry)}" rx="${r2(b.w / 2)}" ry="${ry}" fill="none" stroke="${color}" stroke-opacity="${strokeOp}" stroke-width="1.3"/>`;
  } else if (shape === 'diamond') {
    const cx = b.x + b.w / 2;
    const cy = b.y + b.h / 2;
    frame = `<polygon points="${r2(cx)},${r2(b.y)} ${r2(b.x + b.w)},${r2(cy)} ${r2(cx)},${r2(b.y + b.h)} ${r2(b.x)},${r2(cy)}"${fillAttrs}/>`;
  } else if (shape === 'round') {
    frame = `<rect x="${r2(b.x)}" y="${r2(b.y)}" width="${r2(b.w)}" height="${r2(b.h)}" rx="${r2(b.h / 2)}"${fillAttrs}/>`;
  } else {
    frame = `<rect x="${r2(b.x)}" y="${r2(b.y)}" width="${r2(b.w)}" height="${r2(b.h)}" rx="${NODE_R}"${fillAttrs}/>`;
  }
  // 字段表模式(ERD 的字段、class 的成员):标题条 + 一行一项
  if (types.rows === 'fields') {
    return drawFieldNodeV2(n, frame, badgeFill, color, neutral, meta, ia, titleW, badgeRight);
  }
  // 大图标模式(diagrams + 那种云架构海报):图标就是节点,名字在下面
  if (types.icons === 'big' && (icon || orgFallback)) {
    const ix = b.x + (b.w - ICON_BIG) / 2;
    const name = trunc(n.label, 22);
    const sub = n.sub ? trunc(n.sub, 26) : '';
    // 名字垫一块画布色:竖着下来的连线会从名字后面过,垫一下字才读得清
    const cw = Math.max(textW(name, LABEL_FS), sub ? textW(sub, SUB_FS) : 0) + 10;
    const chip = (y: number, h: number): string =>
      `<rect x="${r2(b.x + b.w / 2 - cw / 2)}" y="${r2(y)}" width="${r2(cw)}" height="${r2(h)}" rx="4" fill="var(--d-card)"/>`;
    // 没有真 logo → 组图标(自绘,跟节点的语义色走)
    const graphic = icon
      ? `<image href="${icon}" x="${r2(ix)}" y="${r2(b.y)}" width="${ICON_BIG}" height="${ICON_BIG}" preserveAspectRatio="xMidYMid meet"/>`
      : groupIcon(ix, b.y, ICON_BIG, color);
    return (
      `<g${ia}>` +
      graphic +
      chip(b.y + ICON_NAME_DY - 11, 15) +
      `<text x="${r2(b.x + b.w / 2)}" y="${r2(b.y + ICON_NAME_DY)}" text-anchor="middle" font-size="${LABEL_FS}" font-weight="600" fill="var(--d-ink)">${esc(name)}</text>` +
      (sub ? chip(b.y + ICON_SUB_DY - 9, 13) + `<text x="${r2(b.x + b.w / 2)}" y="${r2(b.y + ICON_SUB_DY)}" text-anchor="middle" font-size="${SUB_FS}" fill="var(--d-muted)">${esc(sub)}</text>` : '') +
      `</g>`
    );
  }
  // 角标:有图标(diagrams 图标库)就用图标,没有才画类型字母
  const badge = icon
    ? `<image href="${icon}" x="${r2(bx - 2)}" y="${r2(by - 2)}" width="${r2(BADGE + 4)}" height="${r2(BADGE + 4)}" preserveAspectRatio="xMidYMid meet"/>`
    : `<rect x="${r2(bx)}" y="${r2(by)}" width="${BADGE}" height="${BADGE}" rx="6"` +
      ` fill="${badgeFill}" fill-opacity="${neutral ? 0.18 : 0.2}" stroke="${badgeFill}" stroke-opacity="${neutral ? 0.5 : 0.55}" stroke-width="1"/>` +
      `<text x="${r2(bx + BADGE / 2)}" y="${r2(by + BADGE / 2 + 3.6)}" text-anchor="middle" font-size="10.5" font-weight="700" fill="${color}">${esc(meta.badge)}</text>`;
  return (
    `<g${ia}>` +
    frame +
    badge +
    `<text x="${r2(tx)}" y="${r2(titleY)}" text-anchor="middle" font-size="${LABEL_FS}" font-weight="600" fill="var(--d-ink)">${esc(n.label)}</text>` +
    (n.sub
      ? lines.length
        ? lines.map((l, i) => `<text x="${r2(b.x + b.w / 2)}" y="${r2(b.y + 44 + i * 17)}" text-anchor="middle" font-size="${SUB_FS}" fill="var(--d-muted)">${esc(l)}</text>`).join('')
        : `<text x="${r2(b.x + b.w / 2)}" y="${r2(b.y + 44)}" text-anchor="middle" font-size="${SUB_FS}" fill="var(--d-muted)">${esc(n.sub)}</text>`
      : '') +
    `</g>`
  );
}

/**
 * 字段表节点(ERD 的表、class 的类):标题条 + 一行一项
 * —— 键标记(PK/FK/UK)在最左,名字靠左,类型靠右(等宽字体,一眼能对上行)。
 */
function drawFieldNodeV2(
  n: Placed,
  frame: string,
  badgeFill: string,
  color: string,
  neutral: boolean,
  meta: { badge: string },
  ia: string,
  titleW: number,
  badgeRight: number,
): string {
  const b = n.box;
  const rows = fieldRowsOf(n);
  const keyCol = rows.some((r) => r.key) ? KEY_BADGE_W : 0;
  const visCol = rows.some((r) => r.vis) ? VIS_W : 0;
  const nameX = b.x + 12 + keyCol + visCol;
  const typeX = b.x + b.w - 12;
  const parts: string[] = [];
  // 标题条:上圆角、下直角,正好贴住盒子的上边
  const barOp = neutral ? 0.1 : 0.16;
  parts.push(
    `<path d="M${r2(b.x)} ${r2(b.y + NODE_R)}A${NODE_R} ${NODE_R} 0 0 1 ${r2(b.x + NODE_R)} ${r2(b.y)}` +
    `H${r2(b.x + b.w - NODE_R)}A${NODE_R} ${NODE_R} 0 0 1 ${r2(b.x + b.w)} ${r2(b.y + NODE_R)}` +
    `V${r2(b.y + HEAD_H)}H${r2(b.x)}Z" fill="${color}" fill-opacity="${barOp}"/>`,
  );
  // 角标 + 标题(标题左对齐,跟在角标后面)
  const bx = b.x + 12;
  const by = b.y + (HEAD_H - BADGE) / 2;
  parts.push(
    `<rect x="${r2(bx)}" y="${r2(by)}" width="${BADGE}" height="${BADGE}" rx="6"` +
    ` fill="${badgeFill}" fill-opacity="${neutral ? 0.18 : 0.2}" stroke="${badgeFill}" stroke-opacity="${neutral ? 0.5 : 0.55}" stroke-width="1"/>`,
    `<text x="${r2(bx + BADGE / 2)}" y="${r2(by + BADGE / 2 + 3.6)}" text-anchor="middle" font-size="10.5" font-weight="700" fill="${color}">${esc(meta.badge)}</text>`,
    `<text x="${r2(badgeRight + 8)}" y="${r2(b.y + HEAD_H / 2 + 5)}" font-size="${LABEL_FS}" font-weight="600" fill="var(--d-ink)">${esc(n.label)}</text>`,
  );
  // 字段行
  rows.forEach((r, i) => {
    const y = b.y + ROW_TOP + i * ROW_H;
    let x = b.x + 12;
    if (keyCol) {
      if (r.key) {
        const keyColor = r.key === 'pk' ? 'var(--d-s3)' : r.key === 'fk' ? 'var(--d-s5)' : 'var(--d-s4)';
        parts.push(
          `<rect x="${r2(x)}" y="${r2(y - 8)}" width="21" height="12" rx="4" fill="${keyColor}" fill-opacity="0.18" stroke="${keyColor}" stroke-opacity="0.5" stroke-width="1"/>`,
          `<text x="${r2(x + 10.5)}" y="${r2(y + 1)}" text-anchor="middle" font-size="8" font-weight="700" letter-spacing="0.4" fill="${keyColor}">${esc(r.key.toUpperCase())}</text>`,
        );
      }
      x += keyCol;
    }
    if (visCol) {
      if (r.vis) {
        parts.push(
          `<text x="${r2(x + 8)}" y="${r2(y)}" text-anchor="middle" font-size="11" font-weight="700" fill="var(--d-faint)">${esc(r.vis)}</text>`,
        );
      }
      x += visCol;
    }
    parts.push(
      `<text x="${r2(nameX)}" y="${r2(y)}" font-size="${SUB_FS}" fill="var(--d-ink)">${esc(r.name)}</text>`,
    );
    if (r.type) {
      parts.push(
        `<text x="${r2(typeX)}" y="${r2(y)}" text-anchor="end" font-size="${SUB_FS}" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" fill="var(--d-muted)">${esc(r.type)}</text>`,
      );
    }
  });
  return `<g${ia}>` + frame + parts.join('') + `</g>`;
}

/* ---------------------------------------------------------------- 走线
   v2 自己走线:横向的线遇到挡路的盒子就绕行(下一条空通道),不横穿别人的框。
   老路径的 computeRoutes 一行未动 —— 那是老图的形状,不能变。 */
interface V2Routed { e: ArchEdge; pts: [number, number][]; dash: string; marker: string }

const segHits = (x1: number, y1: number, x2: number, y2: number, b: Box): boolean => {
  if (y1 === y2) return y1 > b.y && y1 < b.y + b.h && x2 > b.x && x1 < b.x + b.w;
  return x1 > b.x && x1 < b.x + b.w && y2 > b.y && y1 < b.y + b.h;
};

const hitBox = (x1: number, y1: number, x2: number, y2: number, boxes: Box[]): boolean =>
  boxes.some((b) => segHits(x1, y1, x2, y2, b));

/** 在 a/b 之外找一条横向通道:先往下找,再往上找,取第一条不撞盒子的 */
/**
 * 绕行通道:横向的线撞到挡路的盒子就换一条空通道走。
 * `inside` = 两端共同所属的边界(有的话)—— 通道优先待在框里,
 * 否则那条线看起来像是从「区域」里跑出去了。
 */
function detourY(a: Box, b: Box, x1: number, x2: number, boxes: Box[], inside?: Box): number {
  const lo = Math.min(x1, x2);
  const hi = Math.max(x1, x2);
  const below = Math.max(a.y + a.h, b.y + b.h);
  const above = Math.min(a.y, b.y);
  const cands = [below + 20, below + 52, above - 20, above - 52];
  const free = (y: number): boolean => !hitBox(lo, y, hi, y, boxes);
  const fits = (y: number): boolean => !inside || (y > inside.y + 4 && y < inside.y + inside.h - 4);
  for (const y of cands) if (fits(y) && free(y)) return y;
  for (const y of cands) if (free(y)) return y;
  return cands[0];
}

/** 竖着的那一段被挡住了 → 在两端之间找一条空通道(从目标那侧往外扫) */
function freeChannelX(
  fromX: number,
  toX: number,
  y1: number,
  y2: number,
  boxes: Box[],
  targetX: number,
): number | null {
  const lo = Math.min(fromX, toX);
  const hi = Math.max(fromX, toX);
  const yTop = Math.min(y1, y2);
  const yBot = Math.max(y1, y2);
  const order: number[] = [];
  if (targetX <= (lo + hi) / 2) {
    for (let x = targetX; x <= hi; x += 2) order.push(x);
  } else {
    for (let x = targetX; x >= lo; x -= 2) order.push(x);
  }
  for (const x of order) {
    if (hitBox(x, yTop, x, yBot, boxes)) continue;                                  // 竖着的那段
    if (hitBox(Math.min(fromX, x), y1, Math.max(fromX, x), y1, boxes)) continue;   // 源那侧的横段
    if (hitBox(Math.min(toX, x), y2, Math.max(toX, x), y2, boxes)) continue;       // 目标那侧的横段
    return x;
  }
  return null;
}

/** 端口位置:偏移由调用方给(0 = 正中)—— 直着来的那条走正中,绕过来的往边上让 */
function portAt(b: Box, side: Side, off: number): [number, number] {
  const cx = b.x + b.w / 2;
  const cy = b.y + b.h / 2;
  switch (side) {
    case 'left': return [b.x, cy + off];
    case 'right': return [b.x + b.w, cy + off];
    case 'top': return [cx + off, b.y];
    case 'bottom': return [cx + off, b.y + b.h];
  }
}

/** 一侧上第 i 个端口的默认偏移(n 个端口均分这一侧) */
function portOffset(len: number, i: number, n: number): number {
  return ((i + 1) / (n + 1) - 0.5) * len;
}

/** 两端都在哪个边界里(取最小的那个)—— 绕行时别跑出这个框 */
function enclosingBoundary(a: Box, b: Box, bounds: Box[]): Box | undefined {
  let best: Box | undefined;
  for (const bb of bounds) {
    const holds = (o: Box): boolean =>
      o.x >= bb.x - 1 && o.y >= bb.y - 1 && o.x + o.w <= bb.x + bb.w + 1 && o.y + o.h <= bb.y + bb.h + 1;
    if (!holds(a) || !holds(b)) continue;
    if (!best || bb.w * bb.h < best.w * best.h) best = bb;
  }
  return best;
}

/** 两段线是否真交叉(共线、端点相接不算) */
function segsCross(
  p1: [number, number], p2: [number, number],
  p3: [number, number], p4: [number, number],
): boolean {
  const d = (a: [number, number], b: [number, number], c: [number, number]): number =>
    (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  const d1 = d(p3, p4, p1);
  const d2 = d(p3, p4, p2);
  const d3 = d(p1, p2, p3);
  const d4 = d(p1, p2, p4);
  return d1 * d2 < 0 && d3 * d4 < 0;
}

/* ---------------------------------------------------------------- 布线
   正交布线:Hanan 网格 + A*(带拐弯惩罚)。

   为什么不是「先横再竖」:那种写法只能处理几种摆法,碰上绕远的边就只能猜。
   这里的做法(KiCad / libavoid 那一类)是正经的:

   1. **Hanan 网格** —— 候选坐标只有两拨:每个障碍框的左右边、上下边。
      路径的每一段只可能落在这些坐标上(正交路径的最优解一定如此)✓
   2. **A\*** —— 在网格上找一条总代价最低的路。代价 = 长度 + **拐弯惩罚**
      (拐一次弯贵一点,所以路会尽量直)+ **压别的线的惩罚**(软约束)✓
   3. 框都往外胀一点(MARGIN),路就不会贴着框走 ✓

   找不到路(被框堵死)就退回老路 —— 宁可交叉,也不能没有线。 */

const ROUTE_MARGIN = 8;      // 障碍胀开的距离:路不贴着框
const ROUTE_BEND = 30;       // 拐一次弯的代价(像素当量)
const ROUTE_CROSS = 5000;    // 压到别的线的代价 —— 大到「除非没别的路,否则不压」

/** 端口朝外的方向 */
const OUT_DIR: Record<Side, [number, number]> = {
  left: [-1, 0], right: [1, 0], top: [0, -1], bottom: [0, 1],
};

/**
 * 一条线段是否穿过某个框。
 * 贴着框边走不算 —— 那些格子正是路径要用的(不然网格上就没有能走的线了)。
 */
function segInBox(a: [number, number], b: [number, number], box: Box): boolean {
  const EPS = 0.01;
  const x0 = Math.min(a[0], b[0]);
  const x1 = Math.max(a[0], b[0]);
  const y0 = Math.min(a[1], b[1]);
  const y1 = Math.max(a[1], b[1]);
  if (a[1] === b[1]) {
    // 横线:整条都在框的上下沿之间,且横向有重叠
    if (!(a[1] > box.y + EPS && a[1] < box.y + box.h - EPS)) return false;
    return x0 < box.x + box.w - EPS && x1 > box.x + EPS;
  }
  // 竖线
  if (!(a[0] > box.x + EPS && a[0] < box.x + box.w - EPS)) return false;
  return y0 < box.y + box.h - EPS && y1 > box.y + EPS;
}

/**
 * 正交布线:Hanan 网格 + A*(长度 + 拐弯惩罚 + 压线惩罚)。
 *
 * @param p0 起点端口 @param side0 起点在哪一侧
 * @param p4 终点端口 @param side4 终点在哪一侧
 * @param boxes 障碍(其它节点的框)
 * @param drawn 已经画好的线段(软约束:压上去要加钱,不是禁止)
 * @returns 折点(从 p0 到 p4),无路可走时返回 null
 */
function routeOrthogonal(
  p0: [number, number], side0: Side,
  p4: [number, number], side4: Side,
  boxes: Box[],
  drawn: number[][],
  outer: Box,
): [number, number][] | null {
  // 障碍:往外胀一点,路就不会贴着框
  const obs: Box[] = boxes.map((b) => ({
    x: b.x - ROUTE_MARGIN, y: b.y - ROUTE_MARGIN,
    w: b.w + ROUTE_MARGIN * 2, h: b.h + ROUTE_MARGIN * 2,
  }));
  // 端口往外伸一小段(起点和终点)
  const d0 = OUT_DIR[side0];
  const d4 = OUT_DIR[side4];
  const s: [number, number] = [p0[0] + d0[0] * ROUTE_MARGIN, p0[1] + d0[1] * ROUTE_MARGIN];
  const t: [number, number] = [p4[0] + d4[0] * ROUTE_MARGIN, p4[1] + d4[1] * ROUTE_MARGIN];

  // Hanan 网格:候选坐标 = 障碍的边 + 两端
  const xsSet = new Set<number>([s[0], t[0]]);
  const ysSet = new Set<number>([s[1], t[1]]);
  for (const b of obs) {
    xsSet.add(b.x); xsSet.add(b.x + b.w);
    ysSet.add(b.y); ysSet.add(b.y + b.h);
  }
  // 图的外框也算候选 —— 绕远的那条边要能从图的外面绕过去
  xsSet.add(outer.x); xsSet.add(outer.x + outer.w);
  ysSet.add(outer.y); ysSet.add(outer.y + outer.h);
  const xs = [...xsSet].sort((a, b) => a - b);
  const ys = [...ysSet].sort((a, b) => a - b);
  const xi = (x: number): number => xs.indexOf(x);
  const yi = (y: number): number => ys.indexOf(y);
  const si = xi(s[0]);
  const sj = yi(s[1]);
  const ti = xi(t[0]);
  const tj = yi(t[1]);
  if (si < 0 || sj < 0 || ti < 0 || tj < 0) return null;

  const blocked = (i: number, j: number): boolean => {
    const x = xs[i];
    const y = ys[j];
    return obs.some((b) => x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h);
  };

  // A*(状态 = 网格点 × 方向,方向用来算拐弯惩罚)
  const W = xs.length;
  const H = ys.length;
  const DIRS: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const cost = new Float64Array(W * H * 4).fill(Infinity);
  const prev = new Int32Array(W * H * 4).fill(-1);
  const startIdx = (i: number, j: number, d: number): number => ((j * W + i) * 4 + d);
  const gx = (i: number): number => xs[i];
  const gy = (j: number): number => ys[j];

  // 起点/终点本身在障碍边上(不算在里面)✓
  // 优先队列:二叉堆(线性扫一遍找最小是 O(V²) —— 状态数本身是 O(n²),那样就成 O(n⁴) 了)
  const heap: number[] = [];
  const heapPush = (v: number): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (cost[heap[p]] <= cost[heap[i]]) break;
      [heap[p], heap[i]] = [heap[i], heap[p]];
      i = p;
    }
  };
  const heapPop = (): number | undefined => {
    if (!heap.length) return undefined;
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length) {
      heap[0] = last;
      let i = 0;
      for (;;) {
        const l = i * 2 + 1;
        const r = l + 1;
        let m = i;
        if (l < heap.length && cost[heap[l]] < cost[heap[m]]) m = l;
        if (r < heap.length && cost[heap[r]] < cost[heap[m]]) m = r;
        if (m === i) break;
        [heap[m], heap[i]] = [heap[i], heap[m]];
        i = m;
      }
    }
    return top;
  };
  const closed = new Set<number>();
  for (let d = 0; d < 4; d++) {
    const idx = startIdx(si, sj, d);
    cost[idx] = 0;
    heapPush(idx);
  }
  const goal = (i: number, j: number): boolean => i === ti && j === tj;

  let guard = 0;
  while (heap.length && guard++ < W * H * 8) {
    // 用 Dijkstra 而不是 A*:拐弯惩罚让「曼哈顿距离」这个启发式不再一致,
    // A* 会提前把终点弹出来、给出次优的路线 —— 这里要的就是最优路线。
    const idx = heapPop()!;
    if (closed.has(idx)) continue;
    closed.add(idx);
    const d = idx % 4;
    const cell = (idx - d) / 4;
    const j = Math.floor(cell / W);
    const i = cell % W;
    if (goal(i, j)) {
      // 回溯
      const path: [number, number][] = [];
      let cur = idx;
      while (cur >= 0) {
        const dd = cur % 4;
        const cc = (cur - dd) / 4;
        const jj = Math.floor(cc / W);
        const ii = cc % W;
        path.push([gx(ii), gy(jj)]);
        cur = prev[cur];
      }
      path.reverse();
      // 去掉重复点
      const clean: [number, number][] = [];
      for (const p of path) {
        const last = clean[clean.length - 1];
        if (!last || last[0] !== p[0] || last[1] !== p[1]) clean.push(p);
      }
      return [[p0[0], p0[1]], ...clean, [p4[0], p4[1]]];
    }
    const [dx, dy] = DIRS[d];
    const ni = i + dx;
    const nj = j + dy;
    if (ni < 0 || nj < 0 || ni >= W || nj >= H) continue;
    if (blocked(ni, nj)) continue;
    // 这一段会不会从别的框里穿过去(网格点不在线段中间 ✓)
    const a: [number, number] = [gx(i), gy(j)];
    const b: [number, number] = [gx(ni), gy(nj)];
    if (obs.some((box) => segInBox(a, b, box))) continue;
    // 压到别的线:加钱(软约束)✓
    let cross = 0;
    for (const seg of drawn) {
      if (segsCross(a, b, [seg[0], seg[1]], [seg[2], seg[3]])) { cross++; break; }
    }
    const step = Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]);
    for (let nd = 0; nd < 4; nd++) {
      const nIdx = startIdx(ni, nj, nd);
      const bend = nd === d ? 0 : ROUTE_BEND;
      const nc = cost[idx] + step + bend + cross * ROUTE_CROSS;
      if (nc < cost[nIdx]) {
        const wasNew = cost[nIdx] === Infinity;
        cost[nIdx] = nc;
        prev[nIdx] = idx;
        if (wasNew) heapPush(nIdx);
      }
    }
  }
  return null;
}

function computeRoutesV2(placed: Placed[], edges: ArchEdge[], bounds: Box[] = [], iconsBig = false): V2Routed[] {
  // 大图标节点:连线只接图标那块(名字在图标下面,别从名字里穿过去)
  const portBoxOf = (p: Placed): Box =>
    iconsBig && p.iconData ? { x: p.box.x, y: p.box.y, w: p.box.w, h: ICON_BIG } : p.box;
  const byId = new Map(placed.map((p) => [p.id, p]));
  const boxes = placed.map((p) => p.box);
  const cx = (b: Box) => b.x + b.w / 2;
  const cy = (b: Box) => b.y + b.h / 2;

  // 选边:横向优先(和 archmap 一致),再决定出/入口在哪一侧
  const sides: { exit: Side; entry: Side }[] = edges.map((e) => {
    const a = byId.get(e.from)!.box;
    const b = byId.get(e.to)!.box;
    // 目标(或源)横跨在自己的正下方/正上方 → 竖着走,别从侧面绕
    const stacked = (b.x <= cx(a) && cx(a) <= b.x + b.w) || (a.x <= cx(b) && cx(b) <= a.x + a.w);
    // 比的是两个框**之间留出多远**,不是中心差多少 ——
    // 宽框(比如一整列宽的标题块)中心离得远,照中心算会把线甩到侧面绕一大圈,
    // 明明上下就隔一条线。
    const gapX = Math.max(0, Math.max(a.x, b.x) - Math.min(a.x + a.w, b.x + b.w));
    const gapY = Math.max(0, Math.max(a.y, b.y) - Math.min(a.y + a.h, b.y + b.h));
    const horiz = !stacked && gapX >= gapY;
    const toRight = cx(b) >= cx(a);
    const down = cy(b) >= cy(a);
    return {
      exit: horiz ? (toRight ? 'right' : 'left') : down ? 'bottom' : 'top',
      entry: horiz ? (toRight ? 'left' : 'right') : down ? 'top' : 'bottom',
    };
  });

  // 扇出组:同一个源、多条边、目标在同一行且都在源下面 —— 走一条公共的横向通道
  // (像总线),谁也不横穿别人的盒子
  const groups = new Map<string, number[]>();
  edges.forEach((e, i) => {
    const a = byId.get(e.from)!.box;
    const b = byId.get(e.to)!.box;
    // 目标在源的下面(目标彼此在同一行 —— 由 key 归组)
    if (cy(b) <= cy(a) + 8) return;
    const key = `${e.from}|${Math.round(cy(b))}`;
    const g = groups.get(key) ?? [];
    g.push(i);
    groups.set(key, g);
  });

  const exitSeen = new Map<string, number>();
  const entrySeen = new Map<string, number>();
  const exitAt: number[] = [];
  const entryAt: number[] = [];
  edges.forEach((e, i) => {
    const ek = `${e.from}|${sides[i].exit}`;
    exitAt[i] = exitSeen.get(ek) ?? 0;
    exitSeen.set(ek, exitAt[i] + 1);
    const rk = `${e.to}|${sides[i].entry}`;
    entryAt[i] = entrySeen.get(rk) ?? 0;
    entrySeen.set(rk, entryAt[i] + 1);
  });

  // 端口偏移:同一张脸上有几条线,谁走正中?
  // 「直着来的」—— 源和目标在同一行(左右两侧)/同一列(上下两侧)—— 走正中,
  // 别的线往边上让。不这样处理的话,一条绕远路的线会把本来笔直的线顶歪
  // (读者看到的是「没必要的一折」)。
  //
  // **进和出一起排**:同一个节点的同一张脸,进来的线跟出去的线如果落在同一个点,
  // 看着就像一根线穿过了这个节点(两条边共用一段)。所以按「节点+脸」分组,
  // 不分进出 —— 出去的线互相让开(扇出),进来的线跟出去的线也互相让开。
  const exitOff: number[] = [];
  const entryOff: number[] = [];
  {
    const groups = new Map<string, { i: number; out: boolean }[]>();
    const put = (k: string, i: number, out: boolean): void => {
      groups.set(k, [...(groups.get(k) ?? []), { i, out }]);
    };
    edges.forEach((e, i) => put(`${e.from}|${sides[i].exit}`, i, true));
    edges.forEach((e, i) => put(`${e.to}|${sides[i].entry}`, i, false));
    for (const [k, members] of groups) {
      const sep = k.lastIndexOf('|');
      const nodeId = k.slice(0, sep);
      const side = k.slice(sep + 1) as Side;
      const box = byId.get(nodeId)!.box;
      const len = side === 'left' || side === 'right' ? box.h : box.w;
      const aligned = members.filter((m) => {
        const src = byId.get(edges[m.i].from)!.box;
        const dst = byId.get(edges[m.i].to)!.box;
        return side === 'left' || side === 'right'
          ? Math.abs(src.y + src.h / 2 - (dst.y + dst.h / 2)) < 8
          : Math.abs(src.x + src.w / 2 - (dst.x + dst.w / 2)) < 8;
      });
      // 「直着来/直着走」的那条走正中,别的分到两边 —— 分完还得跟它错开,
      // 否则中间的槽位正好也是 0,两条线又撞在一个点上
      const ai = aligned.length === 1 ? members.findIndex((m) => m.i === aligned[0].i) : -1;
      const above = ai >= 0 ? ai : 0;
      const below = ai >= 0 ? members.length - ai - 1 : 0;
      members.forEach((m, slot) => {
        let off: number;
        if (ai < 0) off = portOffset(len, slot, members.length);
        else if (slot < ai) off = -len / 2 + ((slot + 0.5) / above) * (len / 2);
        else if (slot === ai) off = 0;
        else off = ((slot - ai - 0.5) / below) * (len / 2);
        if (m.out) exitOff[m.i] = off;
        else entryOff[m.i] = off;
      });
    }
  }

  const OUT = 16;
  const routed: V2Routed[] = [];
  const busOf = new Map<number, { channelY: number; n: number }>();
  // 已经画过的线段 —— 后画的线要避开它们
  const drawn: number[][] = [];
  // 图的外框:绕外面走的时候用(比节点框再胀开一点,留出走线的位置)
  const ob: Box = boxes.length
    ? {
        x: Math.min(...boxes.map((b) => b.x)) - ROUTE_MARGIN,
        y: Math.min(...boxes.map((b) => b.y)) - ROUTE_MARGIN,
        w: Math.max(...boxes.map((b) => b.x + b.w)) + ROUTE_MARGIN * 2 - (Math.min(...boxes.map((b) => b.x)) - ROUTE_MARGIN),
        h: Math.max(...boxes.map((b) => b.y + b.h)) + ROUTE_MARGIN * 2 - (Math.min(...boxes.map((b) => b.y)) - ROUTE_MARGIN),
      }
    : { x: 0, y: 0, w: 0, h: 0 };

  for (const [key, idxs] of groups) {
    if (idxs.length < 2) continue;
    const src = byId.get(edges[idxs[0]].from)!.box;
    const channelY = src.y + src.h + 20;
    idxs.forEach((i) => busOf.set(i, { channelY, n: idxs.length }));
  }

  edges.forEach((e, i) => {
    const a = byId.get(e.from)!;
    const b = byId.get(e.to)!;
    const style = e.variant === 'main'
      ? { stroke: 'var(--d-ink)', width: 1.8, marker: 'am-m', dash: '' }
      : e.variant === 'dash'
        ? { stroke: 'var(--d-faint)', width: 1.4, marker: 'am-d', dash: ' stroke-dasharray="5 4"' }
        : { stroke: 'var(--d-muted)', width: 1.4, marker: 'am-p', dash: '' };

    const bus = busOf.get(i);
    if (bus) {
      // 总线:从源底边下来 → 走到目标的横向位置 → 落进目标顶边
      const p0 = port(portBoxOf(a), 'bottom', exitAt[i], bus.n);
      const p4 = port(portBoxOf(b), 'top', entryAt[i], bus.n);
      const busPts: [number, number][] = [p0, [p0[0], bus.channelY], [p4[0], bus.channelY], p4];
      routed.push({ e, pts: busPts, ...style } as V2Routed & { stroke: string; width: number });
      for (let i = 1; i < busPts.length; i++) drawn.push([busPts[i - 1][0], busPts[i - 1][1], busPts[i][0], busPts[i][1]]);
      return;
    }

    const { exit, entry } = sides[i];
    const p0 = portAt(portBoxOf(a), exit, exitOff[i]);
    const p4 = portAt(portBoxOf(b), entry, entryOff[i]);
    const p1 = step(p0, exit, OUT);
    const p3 = step(p4, entry, OUT);
    const others = boxes.filter((x) => x !== a.box && x !== b.box);
    // 候选路线:先直连;直连会撞到盒子或别的线,就绕图的外面走一圈
    const direct: [number, number][] = (() => {
      if (exit === 'left' || exit === 'right') {
        // 横向:中间那段若横穿别人的盒子,改走下方(或上方)的通道
        if (hitBox(Math.min(p1[0], p3[0]), p1[1], Math.max(p1[0], p3[0]), p1[1], others)) {
          const dy = detourY(a.box, b.box, p1[0], p3[0], others, enclosingBoundary(a.box, b.box, bounds));
          return [p0, p1, [p1[0], dy], [p3[0], dy], p3, p4];
        }
        // 竖着的那一段贴着目标走(落在目标端口的正上方/下方)——
        // 放在两端的中间,会从中间的盒子上横穿过去(看着像接到了别的框上)
        const vx = p3[0];
        if (!hitBox(vx, Math.min(p1[1], p3[1]), vx, Math.max(p1[1], p3[1]), others)) {
          return [p0, p1, [vx, p1[1]], [vx, p3[1]], p3, p4];
        }
        const ch = freeChannelX(p1[0], p3[0], p1[1], p3[1], others, p3[0]);
        const cx = ch ?? (p1[0] + p3[0]) / 2;
        return [p0, p1, [cx, p1[1]], [cx, p3[1]], p3, p4];
      }
      const mid = (p1[1] + p3[1]) / 2;
      return [p0, p1, [p1[0], mid], [p3[0], mid], p3, p4];
    })();

    // 正交布线(Hanan 网格 + A*)—— 找不到路才退回老路
    // 障碍是全部的框(含源和目标 —— 线不能从自己的框里穿过去)
    let pts: [number, number][] | null =
      routeOrthogonal(p0, exit, p4, entry, boxes, drawn, ob);
    if (!pts) pts = direct;
    routed.push({ e, pts, ...style } as V2Routed & { stroke: string; width: number });
    for (let i = 1; i < pts.length; i++) drawn.push([pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]]);
  });
  return routed;
}

/* ---------------------------------------------------------------- 边 */
function drawRoutesV2(routed: V2Routed[], interactive: boolean, types: HouseTypes): string {
  return routed.map((rt) => {
    const d = rt.pts.map((p, j) => `${j === 0 ? 'M' : 'L'}${r2(p[0])} ${r2(p[1])}`).join('');
    const ia = interactive ? ` data-from="${esc(rt.e.from)}" data-to="${esc(rt.e.to)}"` : '';
    const s = rt as V2Routed & { stroke: string; width: number };
    const feet = types.crows === 'erd' ? crowFeetV2(rt, s.stroke) : '';
    // UML 记号:extends 用实线空心三角,implements 用虚线空心三角
    const uml = types.uml ? umlKind(rt.e.label) : undefined;
    const marker = feet ? '' : ` marker-end="url(#${uml ? 'am-h' : rt.marker})"`;
    const dash = uml === 'implements' ? ' stroke-dasharray="5 4"' : rt.dash;
    return `<path d="${d}"${ia} fill="none" stroke="${s.stroke}" stroke-width="${s.width}"${dash}${marker}/>` + feet;
  }).join('');
}

/** 边的标签写的是什么,就画什么记号(继承=实线空心三角,实现=虚线空心三角) */
function umlKind(label: string | undefined): 'extends' | 'implements' | undefined {
  if (!label) return undefined;
  const t = label.trim().toLowerCase();
  if (/^(extends|inherit|inherits|继承)$/.test(t)) return 'extends';
  if (/^(implements|realize|realizes|实现)$/.test(t)) return 'implements';
  return undefined;
}

/* ---------------------------------------------------------------- 鱼尾符号
   ERD 的基数记号:一端一根竖杠(「一」),另一端三根岔开的爪(「多」)。
   基数写在边的标签上(1:N / N:1 / 1:1 / N:M),画在边上,不另设参数。 */
// 基数可以在标签的前面,后面跟动词:「1:N」「1:N placed by」
const CARD_RE = /^\s*(1|n|zero|many|\*)\s*[:/]\s*(1|n|zero|many|\*)\b/i;

/**
 * 边的标签是不是一个基数(1:N 这种)?是的话返回 [源端, 目标端]。
 * 基数后面可以跟一个动词(「1:N placed by」)—— 动词留给标签,基数画鱼尾。
 */
function cardinalityOf(label: string | undefined): ('one' | 'many')[] | undefined {
  if (!label) return undefined;
  const m = CARD_RE.exec(label);
  if (!m) return undefined;
  const side = (s: string): 'one' | 'many' => (s === '1' || s.toLowerCase() === 'zero' ? 'one' : 'many');
  return [side(m[1]), side(m[2])];
}

/** 标签里的基数部分(「1:N placed by」→「1:N」);没有基数就原样返回 */
function cardinalityPart(label: string): string {
  const m = CARD_RE.exec(label);
  return m ? m[0].trim() : label;
}

/** 一端的记号:「一」是一根横杠,「多」是三根爪(爪尖落在实体边上,爪根在线上) */
function footMarks(p: [number, number], into: [number, number], kind: 'one' | 'many', color: string): string {
  const len = Math.hypot(into[0], into[1]) || 1;
  const ux = into[0] / len;
  const uy = into[1] / len;
  const px = -uy;
  const py = ux;
  if (kind === 'one') {
    // 横杠:垂直于线的方向,画在端点上
    const h = 6;
    return `<path d="M${r2(p[0] - px * h)} ${r2(p[1] - py * h)}L${r2(p[0] + px * h)} ${r2(p[1] + py * h)}" fill="none" stroke="${color}" stroke-width="1.5"/>`;
  }
  // 三根爪:爪根在线上(离实体边 12px),爪尖落在实体边上,中间那根与线重合
  const L = 12;
  const spread = 9;
  const heel: [number, number] = [p[0] - ux * L, p[1] - uy * L];
  const toes: [number, number][] = [
    [p[0] + px * spread, p[1] + py * spread],
    [p[0], p[1]],
    [p[0] - px * spread, p[1] - py * spread],
  ];
  return toes
    .map((t) => `<path d="M${r2(heel[0])} ${r2(heel[1])}L${r2(t[0])} ${r2(t[1])}" fill="none" stroke="${color}" stroke-width="1.5"/>`)
    .join('');
}

/** 一条边两端的鱼尾:标签写 1:N,源端是「一」,目标端是「多」 */
function crowFeetV2(rt: V2Routed, color: string): string {
  const card = cardinalityOf(rt.e.label);
  if (!card) return '';
  const pts = rt.pts;
  if (pts.length < 2) return '';
  const p0 = pts[0];
  const pN = pts[pts.length - 1];
  const p1 = pts[1];
  const pM = pts[pts.length - 2];
  // 端点处「进入实体」的方向:源端是 p1→p0,目标端是 pM→pN
  const d0: [number, number] = [p0[0] - p1[0], p0[1] - p1[1]];
  const dN: [number, number] = [pN[0] - pM[0], pN[1] - pM[1]];
  return footMarks(p0, d0, card[0], color) + footMarks(pN, dN, card[1], color);
}

/* ---------------------------------------------------------------- 边标签(带底衬) */
interface Spot { text: string; x: number; y: number; anchor: 'start' | 'middle' | 'end'; horiz: boolean; edge: ArchEdge }

const polyAt = (pts: [number, number][], t: number): { p: [number, number]; horiz: boolean } => {
  let total = 0;
  const segs: number[] = [];
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    segs.push(d); total += d;
  }
  let want = total * t;
  for (let i = 0; i < segs.length; i++) {
    if (want <= segs[i] || i === segs.length - 1) {
      const f = segs[i] ? want / segs[i] : 0;
      const x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f;
      const y = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f;
      return { p: [x, y], horiz: Math.abs(pts[i + 1][0] - pts[i][0]) >= Math.abs(pts[i + 1][1] - pts[i][1]) };
    }
    want -= segs[i];
  }
  return { p: pts[0], horiz: true };
};

const overlap = (a: Box, b: Box): boolean =>
  a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

/** 两个矩形压在一起的面积(用来挑「最不糟」的位置) */
const overlapArea = (a: Box, b: Box): number => {
  const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  return w > 0 && h > 0 ? w * h : 0;
};

/**
 * 边标签往哪儿放 —— 一套办法,不是一堆补丁:
 *
 * 1. **槽位**:折线的每一段都提供几个位置(段中 + 段的两侧偏一点),
 *    每个位置有「线的两侧」两种方向。标签只落在槽位上 —— 它永远贴着
 *    自己那条线,读者一眼认得出这是哪条边的说明。
 * 2. **代价**:槽位压住多少东西(节点框、分组的框线、已经放下的标签)。
 *    代价 = 重叠面积之和。
 * 3. **挑**:第一个代价为 0 的槽位直接用;都没有就挑代价最小的
 *    (标签比两个节点之间的空档还宽时,只能压着点,挑最不糟的)。
 *
 * 放下的标签占住位置,后面的标签要避开 —— 两段线挨着时,标签不会叠在一起。
 */
function labelSlots(pts: [number, number][]): { p: [number, number]; horiz: boolean }[] {
  const out: { p: [number, number]; horiz: boolean }[] = [];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const horiz = Math.abs(b[0] - a[0]) >= Math.abs(b[1] - a[1]);
    const len = Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]);
    if (len < 1) continue;
    // 太短的段落放不下标签,跳过(免得标签骑在拐角上)
    if (horiz && len < 40) continue;
    if (!horiz && len < 24) continue;
    for (const f of [0.5, 0.3, 0.7]) {
      out.push({
        p: [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f],
        horiz,
      });
    }
  }
  return out;
}

function placeEdgeLabels(routed: V2Routed[], avoid: Box[], splitCardinality = false): Spot[] {
  const out: Spot[] = [];
  // 已经放下的标签 —— 后面的标签要避开它们(不然两个标签会叠在一起)
  const taken: Box[] = [];
  for (const rt of routed) {
    let text = rt.e.label;
    if (!text) continue;
    // ERD:标签写成「1:N placed by」时,基数画鱼尾,标签只留动词
    if (splitCardinality) {
      const card = cardinalityPart(text);
      if (card !== text.trim()) text = text.slice(card.length).trim() || card;
    }
    const w = textW(text, EDGE_FS) + 12;
    const h = EDGE_FS + 8;
    // 标签的框:横线上的压在线的上方/下方,竖线上的放在线的左/右
    const rectOf = (p: [number, number], horiz: boolean, mirror: boolean): Box =>
      horiz
        ? { x: p[0] - w / 2, y: mirror ? p[1] + 3 : p[1] - 3 - h, w, h }
        : { x: mirror ? p[0] - 3 - w : p[0] + 3, y: p[1] - h / 2, w, h };
    const blockers = [...avoid, ...taken];
    let place: { p: [number, number]; horiz: boolean; mirror: boolean } | undefined;
    let best: { p: [number, number]; horiz: boolean; mirror: boolean } | undefined;
    let bestCost = Infinity;
    for (const slot of labelSlots(rt.pts)) {
      for (const mirror of [false, true]) {
        const cost = blockers.reduce((s, b) => s + overlapArea(rectOf(slot.p, slot.horiz, mirror), b), 0);
        if (cost === 0) {
          place = { ...slot, mirror };
          break;
        }
        if (cost < bestCost) {
          bestCost = cost;
          best = { ...slot, mirror };
        }
      }
      if (place) break;
    }
    // 实在没地方放(标签比两个节点之间的空档还宽),挑压得最少的那个
    if (!place) {
      const mid = labelSlots(rt.pts)[0] ?? { p: rt.pts[0], horiz: true };
      place = best ?? { ...mid, mirror: false };
    }
    const p = place.p;
    const x = place.horiz ? p[0] : p[0] + (place.mirror ? -8 : 8);
    const y = place.horiz ? p[1] + (place.mirror ? 15 : -7) : p[1] + 4;
    const anchor: Spot['anchor'] = place.horiz ? 'middle' : place.mirror ? 'end' : 'start';
    out.push({ text, x, y, anchor, horiz: place.horiz, edge: rt.e });
    // 这个标签占的位置,后面的标签也得避开
    taken.push({
      x: anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x,
      y: y - EDGE_FS - 3, w, h,
    });
  }
  return out;
}
function drawEdgeLabelsV2(spots: Spot[], interactive: boolean): string {
  return spots.map((s) => {
    const w = textW(s.text, EDGE_FS) + 12;
    const h = EDGE_FS + 8;
    const rx = s.anchor === 'middle' ? s.x - w / 2 : s.anchor === 'end' ? s.x - w : s.x;
    const ry = s.y - EDGE_FS - 1;
    const ia = interactive ? ` data-edge-label="${esc(s.edge.from)} ${esc(s.edge.to)}"` : '';
    return (
      `<g${ia}>` +
      `<rect x="${r2(rx)}" y="${r2(ry)}" width="${r2(w)}" height="${r2(h)}" rx="5" fill="var(--d-card)" stroke="var(--d-border)" stroke-width="1"/>` +
      `<text x="${r2(s.x)}" y="${r2(s.y)}" text-anchor="${s.anchor}" font-size="${EDGE_FS}" fill="var(--d-text)">${esc(s.text)}</text>` +
      `</g>`
    );
  }).join('');
}

/* ---------------------------------------------------------------- 边界 */
/**
 * 边界的颜色:
 * - 作者在 b= 的第三段指定了色板编号就用它(b=名称;id id…;9)
 * - 没指定就按顺序取「这套词汇里没被类型占用的颜色」——
 *   边界是框,盒子是类型,两者撞色就分不清了。
 */
function boundaryColors(boundaries: ArchBoundary[], types: HouseTypes): string[] {
  const used = new Set(Object.values(types.meta).map((m) => m.color).filter((c) => c >= 0));
  const free: number[] = [];
  for (let i = 0; i < 10; i++) if (!used.has(i)) free.push(i);
  return boundaries.map((bd, i) => {
    if (bd.color) return sVar(bd.color - 1);
    if (!free.length) return 'var(--d-faint)';
    return sVar(free[i % free.length]);
  });
}

/**
 * v2 的边界盒:比 v1 多留一圈 —— 边要从「区域」里绕行时,通道得待在框内,
 * 否则那条线看起来像是跑出了这个区域。
 */
const BOUNDARY_PAD = 30;

const grow = (b: Box, p: number): Box => ({ x: b.x - p, y: b.y - p, w: b.w + p * 2, h: b.h + p * 2 });

/**
 * 分组框:成员的包围盒 + 边距。
 *
 * 边距默认 30px(给绕行的线留出通道,牌子也放得下),但**两个框会撞上时一起收** ——
 * 收到刚好不撞为止。收的是边距,不是成员的位置(成员是作者摆的,不动)。
 * 成员本身就交叠的,收不了 —— 那是摆位的问题。
 */
function boundaryBoxes(placed: Placed[], boundaries: ArchBoundary[]): Box[] {
  const byId = new Map(placed.map((p) => [p.id, p]));
  const inner = boundaries.map((bd) => {
    const boxes = bd.ids.map((id) => byId.get(id)!.box);
    const x = Math.min(...boxes.map((o) => o.x));
    const y = Math.min(...boxes.map((o) => o.y));
    return {
      x, y,
      w: Math.max(...boxes.map((o) => o.x + o.w)) - x,
      h: Math.max(...boxes.map((o) => o.y + o.h)) - y,
    };
  });
  const pads = inner.map(() => BOUNDARY_PAD);
  for (let round = 0; round < 8; round++) {
    let hit = false;
    for (let i = 0; i < inner.length; i++) {
      for (let j = i + 1; j < inner.length; j++) {
        const a = grow(inner[i], pads[i]);
        const b = grow(inner[j], pads[j]);
        const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
        const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
        if (ox > 0 && oy > 0) {
          const d = Math.min(ox, oy) / 2 + 0.5; // 撞上多少,两边各让一半
          pads[i] = Math.max(0, pads[i] - d);
          pads[j] = Math.max(0, pads[j] - d);
          hit = true;
        }
      }
    }
    if (!hit) break;
  }
  return inner.map((b, i) => grow(b, pads[i]));
}

/**
 * 分组(b=)的显示样式:
 * - `tint`  区域底色(默认):一块淡色,不用边 —— 线多的时候框不抢戏
 * - `dash`  虚线框
 * - `faint` 更虚更淡的边
 * - `glow`  荧光线(几层叠出来的光晕)
 * - `plain` 不画框,只留小牌子
 */
export type BoundaryStyle = 'dash' | 'faint' | 'glow' | 'tint' | 'plain';
export const BOUNDARY_STYLES: BoundaryStyle[] = ['dash', 'faint', 'glow', 'tint', 'plain'];

/** bstyle= —— 分组怎么画;不写就是默认那套(区域底色) */
export function boundaryStyleParam(params: URLSearchParams): BoundaryStyle | undefined {
  const raw = params.get('bstyle');
  if (raw === null || raw === '') return undefined;
  const v = raw.trim().toLowerCase();
  if ((BOUNDARY_STYLES as string[]).includes(v)) return v as BoundaryStyle;
  throw new ApiError(400, `"bstyle" must be one of: ${BOUNDARY_STYLES.join(', ')}. Got: ${JSON.stringify(raw)}`);
}

function drawBoundariesV2(
  boundaries: ArchBoundary[],
  bboxes: Box[],
  interactive: boolean,
  colors: string[],
  style: BoundaryStyle = 'tint',
): string {
  return boundaries.map((bd, i) => {
    const box = bboxes[i];
    const ia = interactive ? ` data-boundary="${esc(bd.ids.join(' '))}"` : '';
    const c = colors[i];
    const rect =
      `<rect x="${r2(box.x)}" y="${r2(box.y)}" width="${r2(box.w)}" height="${r2(box.h)}" rx="14"`;
    let body: string;
    switch (style) {
      case 'faint':
        body = `${rect} fill="none" stroke="${c}" stroke-opacity="0.28" stroke-width="1" stroke-dasharray="3 5"/>`;
        break;
      case 'glow':
        // 荧光线:宽而淡的几层叠出光晕,底下那几层不吃字
        body =
          `${rect} fill="none" stroke="${c}" stroke-opacity="0.10" stroke-width="7"/>` +
          `${rect} fill="none" stroke="${c}" stroke-opacity="0.16" stroke-width="3.5"/>` +
          `${rect} fill="none" stroke="${c}" stroke-opacity="0.85" stroke-width="1.4"/>`;
        break;
      case 'tint':
        // 区域底色:只有一块淡色,没有边 —— 边会跟线打架
        body = `${rect} fill="${c}" fill-opacity="0.07"/>`;
        break;
      case 'plain':
        body = '';
        break;
      default:
        body = `${rect} fill="none" stroke="${c}" stroke-opacity="0.65" stroke-width="1.4" stroke-dasharray="7 5"/>`;
    }
    return `<g${ia}>${body}</g>`;
  }).join('');
}

/** 边界的标签胶囊:画在走线之上,线不会压在字上 */
function drawBoundaryLabelsV2(
  boundaries: ArchBoundary[],
  bboxes: Box[],
  colors: string[],
  style: BoundaryStyle = 'tint',
): string {
  return boundaries.map((bd, i) => {
    const box = bboxes[i];
    const label = bd.label.toUpperCase();
    const w = textW(label, 10) + bd.label.length * 1.2 + 20;
    const c = colors[i];
    // 区域底色那套:牌子直接用底色垫,不再垫画布色(否则白方块浮在色块上)
    const chip = style === 'tint'
      ? `<rect x="${r2(box.x + 14)}" y="${r2(box.y - 9)}" width="${r2(w)}" height="20" rx="6" fill="${c}" fill-opacity="0.14"/>`
      : `<rect x="${r2(box.x + 14)}" y="${r2(box.y - 9)}" width="${r2(w)}" height="20" rx="6" fill="var(--d-card)"/>` +
        `<rect x="${r2(box.x + 15)}" y="${r2(box.y - 8)}" width="${r2(w - 2)}" height="18" rx="5" fill="${c}" fill-opacity="0.16"/>`;
    return (
      `<g>` +
      chip +
      `<text x="${r2(box.x + 14 + w / 2)}" y="${r2(box.y + 4)}" text-anchor="middle" font-size="10" font-weight="700" letter-spacing="1.2" fill="${c}">${esc(label)}</text>` +
      `</g>`
    );
  }).join('');
}

/* ---------------------------------------------------------------- 图例 */
function drawLegend(placed: Placed[], vocab: HouseTypes): { svg: string; h: number } {
  const counts = new Map<string, number>();
  for (const p of placed) counts.set(p.type, (counts.get(p.type) ?? 0) + 1);
  const types = vocab.order.filter((t) => counts.has(t));
  if (!types.length) return { svg: '', h: 0 };
  let x = PAD;
  let y = 0;
  const parts: string[] = [];
  for (const t of types) {
    const meta = vocab.meta[t];
    const neutral = meta.color < 0;
    const color = neutral ? 'var(--d-muted)' : sVar(meta.color);
    const n = counts.get(t) ?? 0;
    const nameW = textW(meta.name, 11.5);
    const countW = textW(String(n), 11.5);
    parts.push(
      `<rect x="${r2(x)}" y="${r2(y - 10)}" width="14" height="14" rx="4" fill="${color}" fill-opacity="${neutral ? 0.18 : 0.2}" stroke="${color}" stroke-opacity="0.55" stroke-width="1"/>`,
      `<text x="${r2(x + 20)}" y="${r2(y + 1)}" font-size="11.5" fill="var(--d-muted)">${esc(meta.name)}</text>`,
      `<text x="${r2(x + 26 + nameW)}" y="${r2(y + 1)}" font-size="11.5" font-weight="700" fill="var(--d-ink)">${n}</text>`,
    );
    x += 20 + nameW + 8 + countW + 26;
  }
  return { svg: `<g data-legend="types">${parts.join('')}</g>`, h: LEGEND_H };
}

/* ---------------------------------------------------------------- 入口 */
const DEFS =
  `<defs>` +
  `<marker id="am-p" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--d-muted)"/></marker>` +
  `<marker id="am-m" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--d-ink)"/></marker>` +
  `<marker id="am-d" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--d-faint)"/></marker>` +
  // UML 记号:空心三角(继承用实线,实现用虚线)
  `<marker id="am-h" viewBox="0 0 14 14" refX="13" refY="7" markerWidth="11" markerHeight="11" orient="auto-start-reverse"><path d="M1.5 1.5L13 7L1.5 12.5z" fill="var(--d-card)" stroke="var(--d-muted)" stroke-width="1.6"/></marker>` +
  // 画布纸:很淡的方格,让大图有个「纸」的感觉
  `<pattern id="am-paper" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M26 0H0V26" fill="none" stroke="var(--d-grid)" stroke-width="1"/></pattern>` +
  `</defs>`;

export interface ArchOpts {
  nodes: ArchNode[];
  edges: ArchEdge[];
  boundaries: ArchBoundary[];
  /** 语义类型词汇(默认架构图那套) */
  types?: HouseTypes;
  /** 图种名(进 metadata 与角标链接):arch2 / dataflow / lifecycle / erd / class */
  template?: string;
  /** 原始 URL 查询串:角标直链 explore 落地页用 */
  tagQuery?: string;
  /**
   * 外部注入的图标:名字 → data URI(如 org:verisign)。优先于内置图标库。
   * 公开仓自己不带第三方素材 —— 这一族图标在调用方(私有仓)手里,由它注入。
   */
  icons?: Record<string, string>;
  title?: string;
  gridCols: number;
  /** grid= 明确指定了列数 → 走格子布局,不用自动分层 */
  gridForced?: boolean;
  /** 自动布局的方向:LR = 层往右走(默认),TB = 层往下走 */
  dir?: 'LR' | 'TB';
  /**
   * 摆位引擎(没写位置的节点怎么摆)。
   * 不给就用库里那个通用的;站上装的是更好的那个 —— 调用方的事,URL 里不暴露。
   */
  layout?: LayoutEngine;
  /** 分组(b=)的显示样式 */
  boundaryStyle?: BoundaryStyle;
  legend: boolean;
  /** 画布纸:底下铺一层很淡的方格(默认关) */
  paper: boolean;
  interactive: boolean;
  version: number;
  cacheControl: string;
  skin: ReturnType<typeof resolveSkin>;
  minW?: number;
  minH?: number;
  aria?: string;
}

/**
 * 渲染 v2 架构图。
 */
/**
 * ERD 的自动摆位:按外键关系分层。
 *
 * 一张真实的表有十几张,按作者写的顺序往网格里塞,读者看不出谁引谁 ——
 * 把「被引用的表」放左边、「引用别人的表」放右边,关系就顺下来了。
 * 深度 = 从根表(没人引用它)算起最长的一条引用链。
 */
function placeErdByRelation(nodes: ArchNode[], edges: ArchEdge[]): void {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const depth = new Map<string, number>();
  const calc = (id: string, seen: Set<string>): number => {
    const cached = depth.get(id);
    if (cached !== undefined) return cached;
    if (seen.has(id)) return 0;   // 环:兜底,别无限递归
    seen.add(id);
    const parents = edges.filter((e) => e.to === id).map((e) => e.from).filter((p) => byId.has(p));
    const d = parents.length ? Math.max(...parents.map((p) => calc(p, seen))) + 1 : 0;
    depth.set(id, d);
    return d;
  };
  for (const n of nodes) calc(n.id, new Set());
  // 已经占掉的格子(作者自己写了位置的)
  const taken = new Set<string>();
  for (const n of nodes) {
    if (!n.grid) continue;
    for (let r = n.grid.row; r < n.grid.row + n.grid.h; r++)
      for (let c = n.grid.col; c < n.grid.col + n.grid.w; c++) taken.add(`${r},${c}`);
  }
  const byDepth = new Map<number, string[]>();
  for (const n of nodes) {
    const d = depth.get(n.id) ?? 0;
    byDepth.set(d, [...(byDepth.get(d) ?? []), n.id]);
  }
  for (const d of [...byDepth.keys()].sort((a, b) => a - b)) {
    (byDepth.get(d) ?? []).forEach((id, i) => {
      const n = byId.get(id)!;
      if (n.grid || n.px) return;
      let r = i;
      let c = d;
      while (taken.has(`${r},${c}`)) {
        r++;
        if (r > 60) { r = 0; c++; }
      }
      n.grid = { row: r, col: c, w: 1, h: 1 };
      taken.add(`${r},${c}`);
    });
  }
}

export function renderArchCore(o: ArchOpts): DrawResult {
  const types = o.types ?? ARCH_TYPES;
  // 图标解析一次(渲染前填进节点):调用方注入的优先 —— 那是有权限的一方带进来的真 logo
  // (比如私有仓里的公司图标库);否则查内置图标库。org: 前缀两处都没有 → 画组图标。
  for (const n of o.nodes) {
    if (!n.icon) continue;
    const hit = o.icons?.[n.icon] || iconOf(n.icon);
    if (hit) n.iconData = hit;
  }
  const sizeOf = (n: ArchNode): { w: number; h: number } => v2Size(n, types);
  // 大图标的节点窄(64px 的图标),列与列之间要多留一点空当,不然挤成一坨
  const gapX = types.icons === 'big' ? 52 : GAP_X;
  // 行与行之间:图标模式下要给边界框的小牌子留位置(两个边界挨着,牌子会压到对方的框线上)
  const gapY = types.icons === 'big' ? 58 : GAP_Y;
  // 边标签有多宽(渲染层按字体量好,引擎不碰字体)
  const labelW = (e: ArchEdge): number => (e.label ? textW(e.label, EDGE_FS) + 44 : 0);
  // 没人写位置 → 交给摆位引擎(站上装的是更好的那个;库里是通用的);
  // 写了位置 → 照旧按格子摆(作者说了算);grid= 明确要格子也走格子
  const explicit = o.nodes.some((n) => n.grid || n.px);
  const auto = !explicit && types.crows !== 'erd' && !o.gridForced;
  let placed: Placed[];
  let W: number;
  let H: number;
  if (auto) {
    const engine = o.layout ?? gridLayout;
    const res = engine({
      nodes: o.nodes,
      edges: o.edges,
      boundaries: o.boundaries,
      sizeOf,
      gapX,
      gapY,
      pad: PAD,
      dir: o.dir ?? 'LR',
      labelW,
    });
    placed = o.nodes.map((n) => ({
      ...n,
      box: res.boxes.get(n.id)!,
      color: TYPE_COLOR[n.type] ?? -1,
    }));
    W = res.W;
    H = res.H;
  } else {
    // ERD:没写位置的表按关系摆 —— 被引用的在左,引用别人的在右(按外键深度分层)
    if (types.crows === 'erd') placeErdByRelation(o.nodes, o.edges);
    // 第一遍:定格子(没写位置的节点会被自动放进去);第二遍:按边标签把列撑开
    packGrid(o.nodes, o.gridCols, { gapX, gapY, pad: PAD, sizeOf, edges: o.edges });
    const r = packGrid(o.nodes, o.gridCols, {
      gapX, gapY, pad: PAD, sizeOf, gapAfter: labelGaps(o.nodes, o.edges, labelW),
    });
    placed = r.placed;
    W = r.W;
    H = r.H;
  }
  const titleH = o.title ? 46 : 0;
  let width = Math.max(W, 320);
  let bodyH = H;
  const byIdEarly = new Map(placed.map((p) => [p.id, p]));
  for (const p of placed) {
    width = Math.max(width, p.box.x + p.box.w + PAD);
    bodyH = Math.max(bodyH, p.box.y + p.box.h + PAD);
  }
  // 分组框:算一次,画框、画牌子、算画布、给标签避让,都用同一份
  const bboxes = boundaryBoxes(placed, o.boundaries);
  // 边界框比它的成员大一圈:画布要给它留出位置,不然图例会压在边界上
  for (const bb of bboxes) {
    width = Math.max(width, bb.x + bb.w + PAD);
    bodyH = Math.max(bodyH, bb.y + bb.h + PAD);
  }
  const legend = o.legend ? drawLegend(placed, types) : { svg: '', h: 0 };

  const byId = new Map(placed.map((p) => [p.id, p]));
  const boxes = placed.map((p) => p.box);
  const routed = computeRoutesV2(placed, o.edges, bboxes, types.icons === 'big');
  const avoid: Box[] = [
    ...boxes.map((b) => ({ x: b.x - 2, y: b.y - 2, w: b.w + 4, h: b.h + 4 })),
    ...o.boundaries.map((bd, i) => {
      const bb = bboxes[i];
      const w = textW(bd.label.toUpperCase(), 10) + bd.label.length * 1.2 + 20;
      return { x: bb.x + 14, y: bb.y - 12, w, h: 22 };
    }),
    // 分组的框线:只挡「边框那一圈」—— 框里的标签是正常的,压在框线上才是压线
    ...bboxes.flatMap((bb) => {
      const t = 4;
      return [
        { x: bb.x - t, y: bb.y - t, w: bb.w + t * 2, h: t * 2 },
        { x: bb.x - t, y: bb.y + bb.h - t, w: bb.w + t * 2, h: t * 2 },
        { x: bb.x - t, y: bb.y + t, w: t * 2, h: bb.h - t * 2 },
        { x: bb.x + bb.w - t, y: bb.y + t, w: t * 2, h: bb.h - t * 2 },
      ];
    }),
  ];
  const spots = placeEdgeLabels(routed, avoid, types.crows === 'erd');
  // 画布要盖住走线和边标签:绕行的边会走到节点盒外面,标签又贴在走线上 ——
  // 只按节点盒算尺寸,那一段就会被裁掉(字看不全)。
  for (const rt of routed) {
    for (const p of rt.pts) {
      width = Math.max(width, p[0] + PAD);
      bodyH = Math.max(bodyH, p[1] + PAD);
    }
  }
  for (const s of spots) {
    const w = textW(s.text, EDGE_FS) + 12;
    const h = EDGE_FS + 8;
    const rx = s.anchor === 'middle' ? s.x - w / 2 : s.anchor === 'end' ? s.x - w : s.x;
    width = Math.max(width, rx + w + PAD);
    bodyH = Math.max(bodyH, s.y - EDGE_FS - 1 + h + PAD);
  }
  width = Math.max(width, o.minW ?? 0);
  // 边界的小牌子探出边界框 9px;标题的字底也在这一带 —— 身子要让开,
  // 不然牌子会压在标题上(「Inside draw」那张就压住了)。
  const bTop = bboxes.length ? Math.min(...bboxes.map((bb) => bb.y - 9)) : 0;
  const titleBottom = o.title ? PAD + 26 : 0;   // 标题的字底(含下伸部)
  const headH = o.boundaries.length ? Math.max(titleH, titleBottom - bTop) : titleH;
  const height = Math.max(bodyH + headH + legend.h + 14, o.minH ?? 0);
  const degree = new Map<string, number>();
  if (o.interactive) for (const e of o.edges) {
    degree.set(e.from, (degree.get(e.from) ?? 0) + 1);
    degree.set(e.to, (degree.get(e.to) ?? 0) + 1);
  }
  const iStyle = o.interactive
    ? `<style>#am g[data-node]{cursor:pointer;transition:filter .12s ease,opacity .15s ease}` +
      `#am g[data-node]:focus{outline:none}` +
      `#am g[data-node]:hover,#am g[data-node]:focus-visible{filter:brightness(1.25)}` +
      `#am g[data-node].on{filter:brightness(1.25)}` +
      `#am.hl g[data-node]{opacity:.4}#am.hl g[data-node].on{opacity:1}` +
      `#am.hl g[data-boundary]{opacity:.35}#am.hl g[data-boundary].on{opacity:1}` +
      `#am.hl path[data-from]{opacity:.22}#am.hl path[data-from].on{opacity:1}` +
      `#am.hl g[data-edge-label]{opacity:.3}#am.hl g[data-edge-label].on{opacity:1}</style>`
    : '';
  const titleSvg = o.title
    ? `<text x="${PAD}" y="${PAD + 16}" font-size="19" font-weight="600" letter-spacing="-0.02em" fill="var(--d-ink)">${esc(o.title)}</text>`
    : '';
  const bColors = boundaryColors(o.boundaries, types);
  const paperSvg = o.paper
    ? `<rect x="0" y="0" width="${r2(width)}" height="${r2(height)}" fill="url(#am-paper)"/>`
    : '';
  const body = iStyle + DEFS
    + drawBoundariesV2(o.boundaries, bboxes, o.interactive, bColors, o.boundaryStyle)
    + drawRoutesV2(routed, o.interactive, types)
    + drawEdgeLabelsV2(spots, o.interactive)
    + placed.map((p) => drawNodeV2(p, o.interactive, degree.get(p.id) ?? 0, types)).join('')
    + drawBoundaryLabelsV2(o.boundaries, bboxes, bColors, o.boundaryStyle);
  // 图例在身子下面 —— 要跟着身子一起往下挪(dy),不然身子一被推下去,
  // 图例就留在原地、压进身子里面
  const dy = headH + Math.max(0, (height - headH - legend.h - bodyH) / 2);
  const legendSvg = legend.svg
    ? `<g transform="translate(0 ${r2(dy + bodyH + 14)})">${legend.svg}</g>`
    : '';
  const children = paperSvg + titleSvg + `<g id="am" transform="translate(0 ${r2(dy)})">${body}</g>` + legendSvg;
  // 身子被往下推了,画布也得跟着长(不然底下的图例会被切掉)
  const spec = { type: 'arch', title: o.title, nodes: o.nodes, edges: o.edges, boundaries: o.boundaries };
  const svg = svgDoc(width, height, o.template ?? 'arch2', o.version, o.aria ?? o.title ?? `architecture map, ${o.nodes.length} nodes`, spec, o.skin, children, o.tagQuery, o.template ?? 'arch2');
  return { svg, version: o.version, cacheControl: o.cacheControl };
}

/**
 * `/draw/arch` 入口:GET ?n=…&e=…&b=…(和 /draw/archmap 同一套参数)。
 */
/** URL 入口的额外选项(不是 URL 参数 —— 是调用方的事) */
export interface ArchUrlOpts {
  /** 摆位引擎(见 LayoutEngine):没写位置的节点怎么摆 */
  layout?: LayoutEngine;
  /** 外部注入的图标:名字 → data URI(优先于内置图标库) */
  icons?: Record<string, string>;
}

/** /draw/cloud —— 大图标版的架构图(节点就是图标) */
export function renderCloudFromUrl(url: URL, interactive = false, opts: ArchUrlOpts = {}): DrawResult {
  return renderArchFromUrl(url, interactive, CLOUD_TYPES, opts);
}

export function renderArchFromUrl(
  url: URL,
  interactive = false,
  types: HouseTypes = ARCH_TYPES,
  opts: ArchUrlOpts = {},
): DrawResult {
  const params = url.searchParams;
  const nRaw = params.getAll('n');
  if (!nRaw.length) throw new ApiError(400, `at least one node is required. Example: /draw/arch?n=api;be;API Gateway;auth;r1c0w2`);
  const nodes = parseNodes(nRaw);
  const seen = new Set<string>();
  for (const n of nodes) {
    if (seen.has(n.id)) throw new ApiError(400, `duplicate node id "${n.id}"`);
    seen.add(n.id);
  }
  const edges = parseEdges(params.getAll('e'), seen);
  const boundaries = parseBoundaries(params.getAll('b'), seen);
  const title = params.get('title')?.trim() || undefined;
  const gridCols = clampInt(params, 'grid', 0, 1, 12);
  const dir = dirParam(params);
  const boundaryStyle = boundaryStyleParam(params);
  const legendRaw = params.get('legend');
  const legend = legendRaw === null || legendRaw === '' ? true : legendRaw !== '0' && legendRaw !== 'false';
  const paperRaw = params.get('paper');
  const paper = paperRaw !== null && paperRaw !== '' && paperRaw !== '0' && paperRaw !== 'false';
  const v = parseInt(params.get('v') ?? '1', 10) || 1;
  const skin = resolveSkin('sankey', params.get('t'), schemeParam(params));
  return renderArchCore({
    nodes, edges, boundaries, title, gridCols, legend, paper, interactive,
    types,
    gridForced: gridCols > 0,
    dir,
    boundaryStyle,
    layout: opts.layout,
    icons: opts.icons,
    template: 'arch2', tagQuery: url.search,
    version: v,
    cacheControl: 'public, max-age=300',
    skin,
    minW: clampInt(params, 'w', 0, 200, 2400),
    minH: clampInt(params, 'h', 0, 140, 2400),
  });
}
