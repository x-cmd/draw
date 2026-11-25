// 球面图的入口(单独的子路径 ✓)——
// 浏览器端只要投影 + 底图,不必把整个库都打进包里 ✓(d3-geo + 底图 ~15KB gzip ✓)。
export {
  globeProjection, globeLandPath, globeCountryPath, globeGraticule, globePoint, globeArc,
  globeAngle, globeCentroid, GLOBE_COUNTRIES, DEFAULT_VIEW,
  type GlobeView, type GlobeCountry,
} from './render/globe-proj.js';
export {
  COUNTRIES, resolveCountry, regionKey, parseRegionKey,
  type CountryKeys,
} from './render/globe-keys.js';
