// 球面图的入口(单独的子路径 ✓)——
// 浏览器端只要投影 + 底图,不必把整个库都打进包里 ✓(d3-geo + 底图 ~15KB gzip ✓)。
export {
  globeProjection, globeLandPath, globeCountryPath, globeAreaPath, globeGraticule, globePoint, globeArc,
  globeAngle, globeCentroid, globeCountryLabels, GLOBE_COUNTRIES, DEFAULT_VIEW, ARC_LABEL_MAX,
  type GlobeView, type GlobeCountry, type GlobePathOpts, type GlobeLabel,
} from './render/globe-proj.js';
export {
  COUNTRIES, resolveCountry, regionKey, parseRegionKey,
  type CountryKeys,
} from './render/globe-keys.js';
export {
  GLOBE_REGIONS, resolveRegion,
  type GlobeRegion,
} from './render/globe-regions.js';
export {
  resolveGlobeArea, allGlobeAreas,
  type GlobeArea,
} from './render/globe-areas.js';
