// ECharts 地图数据注册表。
//
// echarts 6 不再自带地图数据(v4 的 map/ 目录已从 npm 包移除),地图 GeoJSON 随包分发。
// 地图数据几十 KB,只在 option 真用到 map/geo 系列时动态载入 —— 不进 Worker 冷启动路径。
//
// 名字即 option 里的地图名:series.type=map 的 map 字段、geo 组件的 map 字段都填它。
//   {"type":"map","map":"USA","data":[{"name":"California","value":1}]}
// 未收录的地图名不注册,echarts 自己报 "Map xxx not exists"(错误消息更贴切)。

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);

/** registerMap 的最小结构面(不引 echarts 内部类型) */
interface MapRegistrar {
  registerMap(name: string, geo: unknown): void;
}

/** 地图名 → GeoJSON 载入器(动态 import:未用到就不下载) */
const MAPS: Record<string, () => Promise<{ [k: string]: unknown }>> = {
  USA: () => import('./vendor/us-states.js'),
  CN: () => import('./vendor/china.js'),
};

/** 地图 GeoJSON(按地图名取):浏览器端注册地图要用同一份数据 */
export async function loadMapGeoJson(name: string): Promise<unknown> {
  const load = MAPS[name];
  if (!load) throw new Error(`unknown map: ${name}`);
  const mod = await load();
  return mod.usStatesGeoJson ?? mod.chinaGeoJson;
}

/**
 * US 各州的 GeoJSON(Albers USA 投影,50 州 + DC)—— 随包分发,随取随用。
 * 浏览器端的 echarts 也要注册同一份地图数据,自己那一份没有地图 —— 用这个。
 * 按需载入(静态 import 会把 68KB 拖进冷启动路径)。
 */
export async function loadUsStatesGeoJson(): Promise<unknown> {
  const mod = await import('./vendor/us-states.js');
  return mod.usStatesGeoJson;
}

/** 已注册地图的纵横比(投影平面坐标的 bbox 宽高比):布局缺省按它算尺寸 */
const aspects = new Map<string, number>();

/** GeoJSON 平面坐标的 bbox 纵横比(地图的真实形状比) */
function aspectOf(geo: unknown): number {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const walk = (v: unknown): void => {
    if (!Array.isArray(v)) return;
    if (typeof v[0] === 'number') {
      const x = v[0] as number, y = v[1] as number;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
      return;
    }
    v.forEach(walk);
  };
  const feats = (geo as { features?: Array<{ geometry?: { coordinates?: unknown } }> }).features ?? [];
  for (const f of feats) walk(f.geometry?.coordinates);
  const h = y1 - y0;
  return h > 0 ? (x1 - x0) / h : 1;
}

/** 已注册地图的纵横比(未注册返回 undefined) */
export function mapAspect(name: string): number | undefined {
  return aspects.get(name);
}

/** option 里引用到的地图名:series.type=map 的 map 字段 + geo 组件的 map 字段 */
export function mapNamesOf(option: unknown): string[] {
  const names = new Set<string>();
  const o = (option ?? {}) as Obj;
  const series = Array.isArray(o.series) ? o.series : isObj(o.series) ? [o.series] : [];
  for (const s of series) {
    if (isObj(s) && s.type === 'map' && typeof s.map === 'string') names.add(s.map);
  }
  const geo = Array.isArray(o.geo) ? o.geo : isObj(o.geo) ? [o.geo] : [];
  for (const g of geo) {
    if (isObj(g) && typeof g.map === 'string') names.add(g.map);
  }
  return [...names];
}

/**
 * Register the map data an ECharts option refers to. Must run before `setOption`:
 * echarts resolves `series.map` / `geo.map` against its registered map table.
 */
export async function registerMaps(echarts: MapRegistrar, option: unknown): Promise<void> {
  for (const name of mapNamesOf(option)) {
    const load = MAPS[name];
    if (!load) continue;
    const mod = await load();
    const geo = mod.usStatesGeoJson ?? mod.chinaGeoJson;
    echarts.registerMap(name, geo);
    if (!aspects.has(name)) aspects.set(name, aspectOf(geo));
  }
}
