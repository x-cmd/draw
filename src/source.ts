// **source 入口**:「源码图」那一族 —— 分子图 / 乐谱 / 波形 / UML / 时序 / 终端 / 地球仪 / 三维架构图。
//
// 为什么单独一个入口:这几个渲染器要**外部库**(smiles-drawer / abcjs / nomnoml / vexflow / wavedrom)
// 与真 DOM(浏览器里)或垫片(Worker 里)⇒ 体积大、依赖多 ⇒
//   - 只想画图表的宿主(core 入口)不必背这些
//   - 浏览器端想要图族 ⇒ 单独按需加载这个入口
//
// **一份实现** —— 渲染器只有一份(就在 src/render/),不许在别处再抄一遍。

export { renderAbcjs, type SourceOpts as AbcjsOpts } from './render/abcjs.js';
export { renderJianpu, type SourceOpts as JianpuOpts } from './render/jianpu.js';
export { renderNomnoml, type SourceOpts as NomnomlOpts } from './render/nomnoml.js';
export { renderVexflow, type SourceOpts as VexflowOpts } from './render/vexflow.js';
export { renderWavedrom, type SourceOpts as WavedromOpts } from './render/wavedrom.js';
export { renderChem, type ChemOpts } from './render/chem.js';
export { renderChord, parseChordLinks, type ChordLink, type ChordOpts } from './render/chord.js';
export { renderTty, type TtyOpts } from './render/tty.js';
export { renderGlobe, globeFromUrl, type GlobeOpts } from './render/globe.js';
export { GLOBE_R } from './render/globe3d.js';
export { renderEarthGlobe, earthSceneFromUrl, type EarthScene, type EarthOpts } from './render/globe-earth.js';
export {
  renderArch3d, renderArch3dFlat, bstyleOf, planesOf, auxOf, type Arch3dOpts,
} from './render/arch3d.js';
export { sceneFromUrl } from './render/arch3d.js';
export type { Scene } from './render/scene3d.js';
export {
  centerByName, parseCenter, globeCamera, projectedCenter, type Center,
} from './render/center.js';
export { THEMES, type Scheme, type SvgTheme } from './render/source-theme.js';
export { clusterLayout, layeredLayout } from './layout/index.js';
export { WORLD_COUNTRIES, WORLD_YEAR, type WorldCountry } from './world-data.js';
export { installSvgDom } from './render/svgdom.js';
export { parseAbc, type AbcTune, type AbcNote } from './render/abc-parse.js';
