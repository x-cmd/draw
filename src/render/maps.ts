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
};

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
    echarts.registerMap(name, mod.usStatesGeoJson);
  }
}
