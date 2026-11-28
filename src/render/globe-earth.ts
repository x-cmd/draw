// globe · 地球那一套:正射投影(公共仓那份 ✓)
//
// 原来的球面图是**自己造投影**:陆地的边是屏幕上的直线弦(不是球面 ✓)、
// 正反面只看一个点判(俄罗斯横跨 11 个时区必然判错 ✗)、大陆不跟着球转 ✗
// ⇒ 42% 的国家压根没画出来(issue #155 ✓)。
//
// 现在用 d3-geo 的正射投影(公共仓 src/render/globe-proj.ts ✓):
//   · 陆地贴着球面走(precision ✓)
//   · 背面自动裁掉(clipAngle(90) ✓;单点投影自己判球面角距 ✓)
//   · 弧走大圆(geoInterpolate ✓)
//   · 球随视角转(rot= ✓)
//
// URL 语言:
//   n=id;type;label[;sub][;p<纬度>,<经度>]   城市(节点)
//   e=<键>;<键>[;label]                     连线(两端可以是节点 id 或国家码 ✓)
//   val=<键>;<值>[;标签]                     量值:国家 → 国土着色;城市 → 点着色 ✓
//   data=gdp|pop                             全球统计 ⇒ 国土着色 ✓
//   rot=<经度>,<纬度>   zoom=<倍数>          视角 ✓
//   hl=<id,id>                              点名
//
// 键:**主键一律 ISO 3166**(国家 alpha-2 ✓,别名 alpha-3 / 名字 / 世行码 ✓)。

import {
  globeProjection, globeLandPath, globeAreaPath, globePoint, globeArc, globeCentroid,
  resolveCountry, resolveGlobeArea, GLOBE_COUNTRIES, DEFAULT_VIEW, ARC_LABEL_MAX,
  type GlobeView, type GlobeCountry,
} from '@x-cmd/draw/globe';
import { WORLD_COUNTRIES, type WorldCountry } from '../world-data.js';

/** 转义(标签与名字要进 SVG ✓)—— 自己写一份,免得为它把整个库拖进来 ✓ */
const esc = (v: string): string =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** 类型 → 色(跟结构图那一族一致 ✓) */
const TYPE_COLOR: Record<string, string> = {
  fe: '#34D399', be: '#F87171', db: '#A78BFA', cloud: '#22D3EE',
  sec: '#60A5FA', bus: '#FB923C', svc: '#4ADE80',
  city: '#F8FAFC',                                   // 城市:亮白(跟琥珀的国土拉开 ✓)
};

/** 国界的描边色(中性 ✓)—— 不用各国自己的颜色(会被两个邻居各描一次 ⇒ 两条线 ✗) */
const EDGE = '#0B1220';

/**
 * 分段色标 —— **跟平面世界地图那套 visualMap 同一套** ✓
 *
 * 为什么要同一套:同一个数据在平面图与球面上得是同一个颜色 ⇒
 * 「3D 视图」切过去才认得出是同一张图 ✓(explore 页的页内切换就靠这个 ✓)。
 * (之前球面用琥珀→红 ⇒ 跟平面图的蓝对不上 ⇒ 看着像两张不同的图 ✗)
 */
export interface ScalePiece { min: number; max: number; color: string; label: string }

const SCALES: Record<string, ScalePiece[]> = {
  // 人均 GDP:跟 ECharts 世界地图那份 visualMap 逐段相同 ✓
  gdp: [
    { min: 0, max: 1000, color: '#dbeafe', label: '< $1k' },
    { min: 1000, max: 5000, color: '#93c5fd', label: '$1k–5k' },
    { min: 5000, max: 20000, color: '#3b82f6', label: '$5k–20k' },
    { min: 20000, max: 60000, color: '#1e40af', label: '$20k–60k' },
    { min: 60000, max: Infinity, color: '#172554', label: '> $60k' },
  ],
  // 人口:同一套蓝色,分段按人口 ✓
  pop: [
    { min: 0, max: 10e6, color: '#dbeafe', label: '< 10M' },
    { min: 10e6, max: 50e6, color: '#93c5fd', label: '10M–50M' },
    { min: 50e6, max: 200e6, color: '#3b82f6', label: '50M–200M' },
    { min: 200e6, max: 1e9, color: '#1e40af', label: '200M–1B' },
    { min: 1e9, max: Infinity, color: '#172554', label: '> 1B' },
  ],
};

/** 分段色标:值 → 那一段的颜色 ✓ */
export function rampAt(t: number, pieces: ScalePiece[]): string {
  for (const p of pieces) {
    if (t >= p.min && t < p.max) return p.color;
  }
  return pieces[pieces.length - 1]?.color ?? '#3b82f6';
}

/** 地球上的一个点(城市)✓ */
export interface EarthNode {
  id: string;
  label: string;
  sub?: string;
  /** 类型(db/cloud/ext/… ⇒ 点的颜色 ✓)—— 侧栏改完要重写 URL ⇒ 得留着 ✓ */
  kind?: string;
  lat: number;
  lon: number;
  /** 量值(来自 val= ✓) */
  value?: number;
  color: string;
  hl?: boolean;
}

/** 地球上的连线(两端可以是节点 id,也可以是国家码 ✓) */
export interface EarthLink {
  from: string;
  to: string;
  label?: string;
  /** 两端的经纬度 ✓ */
  a: [number, number];
  b: [number, number];
}

/**
 * 有值的一块地(要上色的 ✓)
 *
 * 键有两种形状 ✓:国家(`US` ✓)或一级区划(`CN-44` ✓)——
 * 主键一律 ISO ✓(ISO 3166-1 / ISO 3166-2 ✓);老名字也认 ✓。
 */
export interface EarthCountry {
  /** ISO 键(国家 alpha-2 ✓ / 区划 `<alpha2>-<code>` ✓) */
  key: string;
  /** ISO alpha-3(国家才有 ✓;区划为空 ✓) */
  iso3: string;
  /** 显示名 ✓ */
  name: string;
  value: number;
  /** 上好的色(量值越大越暖 ✓)—— 客户端补画背面的国家时用同一个色 ✓ */
  color: string;
}

/** 地球的场景(视角也是场景的一部分 ✓) */
export interface EarthScene {
  mode: 'earth';
  nodes: EarthNode[];
  links: EarthLink[];
  countries: EarthCountry[];
  view: GlobeView;
  legend?: { title: string; min: string; max: string; pieces?: ScalePiece[] };
}

/** 全球统计那一档(data=gdp|pop)✓ */
interface Metric {
  key: 'gdp' | 'pop';
  label: string;
  zh: string;
  get: (c: WorldCountry) => number;
  fmt: (v: number) => string;
}

const METRICS: Record<string, Metric> = {
  gdp: {
    key: 'gdp',
    label: 'GDP per capita',
    zh: '人均 GDP',
    get: (c) => c.gdp,
    fmt: (v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(Math.round(v))}`,
  },
  pop: {
    key: 'pop',
    label: 'Population',
    zh: '人口',
    get: (c) => c.pop,
    fmt: (v) => (v >= 1e9 ? `${(v / 1e9).toFixed(2)}B` : v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : `${Math.round(v / 1e3)}k`),
  },
};

/** 端点:节点 id 优先,再当国家码(国家 → 质心 ✓) */
function endpointOf(key: string, nodes: Map<string, EarthNode>): { at: [number, number]; label: string } | undefined {
  const n = nodes.get(key);
  if (n) return { at: [n.lon, n.lat], label: n.label };
  const c = resolveCountry(key);
  if (!c) return undefined;
  const at = globeCentroid(c);
  if (!at) return undefined;
  return { at, label: c.name };
}

/** val=<键>;<值>[;标签] —— 量值 ✓ */
function parseValues(raw: string[]): { key: string; value: number; label?: string }[] {
  const out: { key: string; value: number; label?: string }[] = [];
  for (const s of raw) {
    const f = s.split(';');
    if (f.length < 2) continue;
    const v = Number(f[1]);
    if (!Number.isFinite(v)) continue;
    out.push({ key: f[0].trim(), value: v, label: f[2]?.trim() || undefined });
  }
  return out;
}

/** 视角:rot=<经度>,<纬度> · zoom=<倍数> ✓ */
function viewOf(url: URL): GlobeView {
  // 没写 rot ⇒ 用默认视角(⚠️ ''.split(',')[0] 是 '' ⇒ Number('') = 0 ⇒
  // 写成「没写就是 0」的话,球心会莫名其妙停在几内亚湾 ✗)
  const raw = (url.searchParams.get('rot') ?? '').trim();
  const rot = raw ? raw.split(',').map(Number) : [];
  const zoom = Number(url.searchParams.get('zoom') ?? '1');
  return {
    lon: rot.length && Number.isFinite(rot[0]) ? rot[0] : DEFAULT_VIEW.lon,
    lat: rot.length > 1 && Number.isFinite(rot[1]) ? rot[1] : DEFAULT_VIEW.lat,
    zoom: Number.isFinite(zoom) && zoom > 0 ? Math.min(8, zoom) : DEFAULT_VIEW.zoom,
  };
}

/**
 * 黄金角铺球面(给「没写位置」的点用 ✓)
 *
 * 旧的那份球面图用黄金角把没位置的点摊开;这份也得摊 —— 否则
 * 「只给名字不给坐标」的链接画出来是空的 ✗。
 */
function fibonacciLL(i: number, n: number): { lat: number; lon: number } {
  if (n <= 1) return { lat: 0, lon: 0 };
  const golden = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (i / (n - 1)) * 2;            // 1 → -1
  const rad = Math.sqrt(Math.max(0, 1 - y * y));
  const th = golden * i;
  return {
    lat: Math.asin(y) * (180 / Math.PI),
    lon: Math.atan2(Math.sin(th) * rad, Math.cos(th) * rad) * (180 / Math.PI),
  };
}

/** 按 ISO 码找国家(世行数据 ⇒ NE 底图 ✓ 同一个键 ✓) */
function countryByIso(iso3: string): GlobeCountry | null {
  return GLOBE_COUNTRIES.find((c) => c.iso3 === iso3 || c.wb === iso3) ?? null;
}

/** URL → 地球场景 ✓ */
export function earthSceneFromUrl(url: URL): EarthScene {
  // —— 点(城市)——
  const nodes: EarthNode[] = [];
  const free: EarthNode[] = [];          // 没写位置的点 ⇒ 摊到球面上 ✓
  for (const raw of url.searchParams.getAll('n')) {
    const f = raw.split(';');
    const id = f[0];
    if (!id) continue;
    // 位置字段(以 p 开头 ✓)⇒ 之前的那些才是「类型/区/名字」
    const pi = f.findIndex((x) => /^p-?\d/.test(x));
    const before = pi >= 0 ? f.slice(1, pi) : f.slice(1);
    const type = before[0] ?? '';
    // **名字 = 位置前面最后一段** ✓
    // (三种写法都认:`id;kind;名字` / `id;kind;区;名字` / `id;kind;区 · 名字` ——
    //  之前固定取第三段 ⇒ 四段那种把「区」当成了名字 ✗ 显示成 us-east-1 ✗)
    const label = before[before.length - 1] ?? '';
    if (!label) continue;
    const pos = pi >= 0 ? f[pi] : undefined;
    const m = pos?.match(/^p(-?[\d.]+),(-?[\d.]+)$/);
    // 「区 · 名字」那种写法 ⇒ 名字取后半截、区名进副标题
    // (表里显示「us-east-1 · Ashburn」太长 ✗ 显示「Ashburn」才认得出是哪个 ✓)
    const dot = label.indexOf('·');
    const name = dot > 0 ? label.slice(dot + 1).trim() : label;
    const region = dot > 0 ? label.slice(0, dot).trim() : (before.length >= 3 ? before[before.length - 2] : undefined);
    const node: EarthNode = {
      id,
      label: name,
      lat: 0,
      lon: 0,
      kind: type,
      color: TYPE_COLOR[type] ?? '#A1A1AA',
      // 有「区」那一段就带上(提示里多一行 ✓)
      sub: region,
    };
    if (m) {
      node.lat = Number(m[1]);
      node.lon = Number(m[2]);
    } else {
      free.push(node);                   // 没位置 ⇒ 后面摊开 ✓
    }
    nodes.push(node);
  }
  // 没写位置的点:黄金角摊开(跟旧的那份一样 ✓)
  free.forEach((n, i) => {
    const at = fibonacciLL(i, free.length);
    n.lat = at.lat;
    n.lon = at.lon;
  });
  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  const hl = new Set((url.searchParams.get('hl') ?? '').split(',').map((s) => s.trim()).filter(Boolean));

  // —— 量值(val=)——
  // (参数名不叫 v —— v 是站的**版本号**参数(v=1.2.3 ✓),撞了会被当成版本 ✗)
  const values = parseValues(url.searchParams.getAll('val'));
  const valueByKey = new Map(values.map((v) => [v.key.toUpperCase(), v.value]));
  for (const n of nodes) {
    const v = valueByKey.get(n.id.toUpperCase());
    if (v !== undefined) n.value = v;
    if (hl.has(n.id)) n.hl = true;
  }
  const countries: EarthCountry[] = [];
  const seen = new Set<string>();
  const nodeIds = new Set(nodes.map((n) => n.id.toUpperCase()));
  for (const v of values) {
    if (nodeIds.has(v.key.toUpperCase())) continue;   // 城市上的量值 ⇒ 点着色 ✓
    // 国家(US ✓)或一级区划(CN-44 ✓)都认 ⇒ 键统一成 ISO ✓
    const area = resolveGlobeArea(v.key);
    if (!area) continue;                     // 认不出来的键 ⇒ 忽略 ✓
    if (seen.has(area.key)) continue;
    seen.add(area.key);
    const c = resolveCountry(area.key);
    countries.push({
      key: area.key,
      iso3: c?.iso3 ?? '',
      name: v.label ?? area.name,
      value: v.value,
      color: '',
    });
  }

  // —— 全球统计(data=gdp|pop)⇒ 国土着色 ✓(不再是「另开一套气泡」✗)
  const metric = METRICS[url.searchParams.get('data') ?? ''];
  let legend: EarthScene['legend'];
  if (metric) {
    const rows = WORLD_COUNTRIES
      .map((c) => ({ c, v: metric.get(c) }))
      .filter((r) => Number.isFinite(r.v) && r.v > 0)
      .map((r) => {
        const country = countryByIso(r.c.iso);
        return country ? { ...r, key: country.iso2 } : null;
      })
      .filter((r): r is { c: WorldCountry; v: number; key: string } => !!r);
    if (rows.length) {
      const max = Math.max(...rows.map((r) => r.v));
      const min = Math.min(...rows.map((r) => r.v));
      for (const { c, v, key } of rows) {
        if (seen.has(key)) continue;          // val= 显式给的值优先 ✓
        seen.add(key);
        countries.push({ key, iso3: c.iso, name: c.n, value: v, color: '' });
      }
      legend = { title: metric.label, min: metric.fmt(min), max: metric.fmt(max) };
    }
  }

  // 上色:分段 ✓(客户端补画背面的国家时用同一个色 ✓)
  if (countries.length) {
    let pieces = metric ? SCALES[metric.key] ?? [] : [];
    // 没有 data= (只有 val=)时,色阶**按值的范围自己分段** ✓
    // (省份人均 GDP 落在国家那套分段里只有两档 ⇒ 全是一个蓝,看不出差别 ✗)
    if (!pieces.length) {
      const vals = countries.map((c) => c.value).filter((v) => Number.isFinite(v));
      if (vals.length) {
        const min = Math.min(...vals);
        const max = Math.max(...vals);
        if (max > min) {
          pieces = Array.from({ length: 5 }, (_, i) => ({
            min: min + ((max - min) * i) / 5,
            max: min + ((max - min) * (i + 1)) / 5,
            color: ['#dbeafe', '#93c5fd', '#3b82f6', '#1e40af', '#172554'][i],
            label: '',
          }));
          legend = legend ?? { title: 'Value', min: String(Math.round(min)), max: String(Math.round(max)) };
        }
      }
    }
    for (const c of countries) {
      c.color = pieces.length ? rampAt(c.value, pieces) : '#3b82f6';
    }
    if (legend && pieces.length) legend = { ...legend, pieces };
  }

  // —— 连线(e=):两端可以是节点 id,也可以是国家码 ✓
  const links: EarthLink[] = [];
  for (const raw of url.searchParams.getAll('e')) {
    const f = raw.split(';');
    const a = endpointOf(f[0] ?? '', nodeById);
    const b = endpointOf(f[1] ?? '', nodeById);
    if (!a || !b) continue;
    links.push({ from: f[0], to: f[1], label: f[2], a: a.at, b: b.at });
  }

  return { mode: 'earth', nodes, links, countries, view: viewOf(url), legend };
}

export interface EarthOpts {
  interactive?: boolean;
  width?: number;
}

/** 出图时按像素抽稀的容差(形状 <1px 不变 ✓ 字串小一半 ✓) */
const TOL_PX = 0.8;

/** 地球场景 → SVG ✓(正射投影 ✓) */
export function renderEarthGlobe(scene: EarthScene, opts: EarthOpts = {}): string {
  // **正方形** ✓ —— 球是正圆,画布成正方形它才铺得满(7:4 的框里球只占一半宽 ✗)
  const width = opts.width ?? 900;
  const height = width;
  const view = scene.view;
  const proj = globeProjection(width, height, view);
  const rad = proj.scale();
  const cx = width / 2;
  const cy = height / 2;
  const r2 = (v: number): number => Math.round(v * 100) / 100;
  const base: string[] = [];

  // 球:正圆的剪影(转起来剪影还是自己 ✓)+ 一圈大气
  // 大气圈的外沿**不超过球的半径** ✓ —— 伸到画布外会被切掉 ⇒ 看着像「地球超出画面」✗
  base.push(`<circle class="g-atmo" cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(rad)}" fill="url(#g-atmo)"/>`);
  base.push(`<circle class="g-glow" cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(rad)}" fill="none" stroke="var(--d-link)" stroke-opacity="0.25" stroke-width="10"/>`);
  base.push(`<circle class="g-sphere" cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(rad)}" fill="url(#g-grad)"/>`);

  // 陆地:整个球面拼成一条(没有国界的接缝 ✓)
  const land = globeLandPath(width, height, view, { tolPx: TOL_PX });
  if (land) base.push(`<path class="g-land" d="${land}"/>`);

  // 有值的一块地:国土着色 ✓(量值越大越暖 ✓)
  // 分层(g-l-countries)—— 客户端转球时要把背面转过来的**补画**进去 ✓
  const countryParts: string[] = [];
  for (const c of scene.countries) {
    const area = resolveGlobeArea(c.key);       // 国家(US ✓)或一级区划(CN-44 ✓)
    if (!area) continue;
    const d = globeAreaPath(area.polygon, width, height, view, { tolPx: TOL_PX });
    if (!d) continue;                       // 整个在背面 ⇒ 这张图上先不画 ✓(转过来再补)
    countryParts.push(
      // 填充**不透明** ✓(半透明 ⇒ 陆地那层的描边透出来 ⇒ 国界又是两遍 ✗)
      // 描边用**同一个中性色** ✓ —— 每条边界本来会被**两个邻居各描一次**,
      // 各用自己的颜色 ⇒ 变成两条颜色不同的平行线 ⇒ 重影 ✗;同色就重合回一条 ✓
      `<path class="g-country" data-country="${esc(c.key)}" d="${d}" fill="${c.color}" stroke="${EDGE}" stroke-opacity="0.55" stroke-width="0.7"/>`,
    );
  }

  // 连线:大圆弧 ✓(贴着球面走 ✓);有一端在背面 ⇒ 只画到地平线 ✓
  // 边多的时候**不标字**:三十多条弧各挂一个「回源」⇒ 半个球都是字 ✗
  // 边多的时候弧也画细一点、淡一点 ⇒ 底图还看得见 ✗(不然球被白线糊住 ✗)
  const showEdgeLabels = scene.links.length <= ARC_LABEL_MAX;
  const manyEdges = scene.links.length > 12;
  const edgeParts: string[] = [];
  for (const e of scene.links) {
    const ia = opts.interactive ? ` data-from="${esc(e.from)}" data-to="${esc(e.to)}"` : '';
    const arc = globeArc(e.a, e.b, width, height, view);
    if (!arc.d) continue;
    // 悬停出提示:这条边连的是谁、叫什么 ✓(边的信息也要看得见 ✗)
    const tip = opts.interactive
      ? ` data-tip="${esc(`${e.from} → ${e.to}${e.label ? ` · ${e.label}` : ''}`)}"` : '';
    edgeParts.push(
      `<g class="g-edge${manyEdges ? ' many' : ''}"${ia}>` +
      // 命中区:一条粗的透明线(2px 的线太细,悬停不着 ✗)
      `<path class="g-edge-hit" d="${arc.d}" fill="none"/>` +
      `<path d="${arc.d}"${ia}${tip} fill="none"/>` +
      // 标签摆在**弧的中点**(不是两端经纬度的平均 —— 那不在弧上 ✗)
      (e.label && showEdgeLabels && arc.mid
        ? `<text class="g-edge-label" x="${r2(arc.mid.x)}" y="${r2(arc.mid.y - 12)}" font-size="20" text-anchor="middle">${esc(e.label)}</text>`
        : '') +
      `</g>`,
    );
  }

  // 点:背面的不画 ✓;点名的画大一点 + 一圈圈 ✓
  // **点的大小带着信息** ✓:量值越大点越大、边多的枢纽也大一点
  // (跟浏览器端那份同一套规则 ✓ —— 出图与预览要对得上 ✓)
  const maxVal = Math.max(1, ...scene.nodes.map((n) => (typeof n.value === 'number' && n.value > 0 ? n.value : 0)));
  const degree = new Map<string, number>();
  for (const e of scene.links) {
    degree.set(e.from, (degree.get(e.from) ?? 0) + 1);
    degree.set(e.to, (degree.get(e.to) ?? 0) + 1);
  }
  const nodeParts: string[] = [];
  // 标签避让:两个城市挨得近时,两个名字会叠成一团糊字 ⇒
  // 后来的那个**不画**(少一个名字好过糊成一团 —— 读者还能看图猜位置)
  const labelBoxes: [number, number, number, number][] = [];
  const hits = (b: [number, number, number, number]): boolean =>
    labelBoxes.some((o) => !(b[2] < o[0] || b[0] > o[2] || b[3] < o[1] || b[1] > o[3]));
  for (const n of scene.nodes) {
    const at = globePoint(n.lon, n.lat, width, height, view);
    if (!at) continue;                       // 背面 ⇒ 不画 ✓(转过来再补 ✓)
    const ia = opts.interactive ? ` data-node="${esc(n.id)}" data-tip="${esc(tipOf(n))}" tabindex="0"` : '';
    const byVal = typeof n.value === 'number' && n.value > 0 ? 12 * Math.sqrt(n.value / maxVal) : 0;
    const byDeg = Math.min(7, (degree.get(n.id) ?? 0) * 0.9);
    const rr = (n.hl ? 15 : 7) + byVal + byDeg;
    nodeParts.push(
      `<g class="g-node${n.hl ? ' hl' : ''}"${ia}>` +
      (n.hl ? `<circle class="g-ring" cx="${r2(at.x)}" cy="${r2(at.y)}" r="${r2(rr + 8)}" fill="none" stroke="${n.color}" stroke-width="2.5"/>` : '') +
      `<circle class="g-dot-halo" cx="${r2(at.x)}" cy="${r2(at.y)}" r="${r2(rr + 4)}" fill="${n.color}"/>` +
      `<circle class="g-dot" cx="${r2(at.x)}" cy="${r2(at.y)}" r="${r2(rr)}" fill="${n.color}"/>` +
      (() => {
        const lw = Math.max(24, n.label.length * 15);
        const box: [number, number, number, number] = [at.x - lw / 2, at.y - 52, at.x + lw / 2, at.y - 18];
        if (hits(box)) return '';            // 跟旁边的名字撞上了 ⇒ 这一个不画
        labelBoxes.push(box);
        return `<text class="g-label" x="${r2(at.x)}" y="${r2(at.y - 26)}" font-size="28" text-anchor="middle">${esc(n.label)}</text>`;
      })() +
      `</g>`,
    );
  }

  // 色标 ✓ —— 分段块(跟平面地图的 visualMap 一个样 ✓)
  const legendParts: string[] = [];
  if (scene.legend) {
    const lg = scene.legend;
    const x = 26;
    const y = height - 34;
    const w = 168;
    const pieces = lg.pieces ?? [];
    let bar = '';
    if (pieces.length) {
      const bw = w / pieces.length;
      pieces.forEach((p, i) => {
        bar += `<rect x="${r2(x + bw * i)}" y="${r2(y)}" width="${r2(bw + 0.6)}" height="8" fill="${p.color}"/>`;
      });
    }
    legendParts.push(
      `<g class="g-legend">` +
      `<text x="${r2(x)}" y="${r2(y - 10)}" font-size="15" fill="#E2E8F0">${esc(lg.title)}</text>` +
      bar +
      `<text x="${r2(x)}" y="${r2(y + 24)}" font-size="13" fill="#94A3B8">${esc(lg.min)}</text>` +
      `<text x="${r2(x + w)}" y="${r2(y + 24)}" font-size="13" fill="#94A3B8" text-anchor="end">${esc(lg.max)}</text>` +
      `</g>`,
    );
  }

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
    `viewBox="0 0 ${width} ${height}" ` +
    `font-family="ui-sans-serif,-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif" ` +
    `role="img" aria-label="globe">` +
    globeStyle() +
    `<g id="am">` +
    `<g class="g-l-base">${base.join('')}</g>` +
    `<g class="g-l-countries">${countryParts.join('')}</g>` +
    `<g class="g-l-edges">${edgeParts.join('')}</g>` +
    `<g class="g-l-nodes">${nodeParts.join('')}</g>` +
    `<g class="g-l-legend">${legendParts.join('')}</g>` +
    `</g>` +
    `</svg>`
  );
}

function tipOf(n: EarthNode): string {
  const at = `${Math.abs(n.lat).toFixed(1)}°${n.lat >= 0 ? 'N' : 'S'} ${Math.abs(n.lon).toFixed(1)}°${n.lon >= 0 ? 'E' : 'W'}`;
  return n.sub ? `${n.label} · ${n.sub} · ${at}` : `${n.label} · ${at}`;
}

/** 球的样子(与 globe.ts 那份共用 ✓ —— 两张画才对得上 ✓) */
function globeStyle(): string {
  return (
    `<style>:root{color-scheme:dark;` +
    `--d-s1:#34D399;--d-s2:#F87171;--d-s3:#A78BFA;--d-s4:#22D3EE;--d-s5:#60A5FA;--d-s6:#FB923C;` +
    `--d-s7:#4ADE80;--d-s8:#FB7185;--d-s9:#F59E0B;--d-s10:#0EA5E9;` +
    `--d-ink:#FAFAFA;--d-text:#D4D4D8;--d-muted:#A1A1AA;--d-faint:#71717A;--d-grid:#29292E;--d-card:#0E0F11;--d-link:#60A5FA;` +
    `#am .g-sphere{fill-opacity:.92}` +
    `#am .g-land{fill:#2A3444;fill-opacity:.75;stroke:#7C8CA5;stroke-opacity:.5;stroke-width:.9}` +
    `#am .g-land.back{fill-opacity:.16;stroke-opacity:.12}` +
    `#am .g-grid{stroke:#7DD3FC;stroke-opacity:.18;stroke-width:2}` +
    `#am .g-edge path{stroke:#DBEAFE;stroke-opacity:.92;stroke-width:3}` +
    // 命中区:看不见的粗线 —— 弧太细悬停不着 ⇒ 给它一条 12px 的透明线接着 ✓
    `#am .g-edge path.g-edge-hit{stroke:transparent;stroke-width:12;pointer-events:stroke}` +
    // 边多 ⇒ 画细、画淡(不然三十多条白线把球糊住 ✗)
    `#am .g-edge.many path{stroke-opacity:.8;stroke-width:2.4}` +
    `#am .g-edge.back path{stroke-opacity:.2}` +
    `#am .g-edge-label{fill:#DBEAFE;fill-opacity:.9}` +
    `#am .g-node .g-dot-halo{fill-opacity:.2}` +
    `#am .g-node .g-dot{stroke:#050B1C;stroke-width:1.5}` +
    `#am .g-node .g-label{fill:#F0F9FF;fill-opacity:.95;paint-order:stroke;stroke:#050B1C;stroke-width:3;stroke-opacity:.55}` +
    `#am .g-node.back{opacity:.4}` +
    `#am .g-node.hl .g-label{font-weight:600}` +
    `#am .g-node.hl .g-dot-halo{fill-opacity:.3}` +
    `#am g[data-node]{cursor:pointer;transition:filter .12s ease,opacity .15s ease}` +
    `#am g[data-node]:hover,#am g[data-node]:focus-visible{filter:brightness(1.3)}` +
    `#am g[data-node].on{filter:brightness(1.3)}` +
    `#am.hl g[data-node]{opacity:.25}#am.hl g[data-node].on{opacity:1}` +
    `#am.hl path[data-from]{opacity:.1}#am.hl path[data-from].on{opacity:1}` +
    `}</style>` +
    `<defs><radialGradient id="g-grad" cx="35%" cy="28%" r="78%">` +
    `<stop offset="0%" stop-color="#1E3A8A"/><stop offset="55%" stop-color="#0C1E45"/><stop offset="100%" stop-color="#050B1C"/>` +
    `</radialGradient>` +
    `<radialGradient id="g-atmo" cx="50%" cy="50%" r="50%">` +
    `<stop offset="76%" stop-color="#60A5FA" stop-opacity="0"/>` +
    `<stop offset="88%" stop-color="#60A5FA" stop-opacity="0.16"/>` +
    `<stop offset="100%" stop-color="#60A5FA" stop-opacity="0"/>` +
    `</radialGradient></defs>`
  );
}
