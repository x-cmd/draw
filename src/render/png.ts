// PNG 导出层(x-cmd-hub/draw#24):SVG → 渲染期烘焙 → resvg-wasm 光栅化。
//
// 烘焙 = 从 SVG 自带的皮肤 <style> 解析 var→色值映射(亮/暗两套),按 scheme 固化,
// 替换全部 var() 引用并剥离 <style>(含 @font-face 与 echarts 的 hover CSS——光栅
// 化都不需要)。这对核心手写层 / echarts / archmap / mindmap / 短链的全部产出通用,
// 渲染器零改动。位图没有"自适应明暗",PNG 强制固化 scheme(缺省 light)。
//
// resvg-wasm 是仓库第一个 wasm 依赖,全运行时同一份(Node/Deno/Workers),lazy init:
// Node/Deno 从 node_modules 读 index_bg.wasm(exports 显式暴露该子路径);
// Workers 由入口(src/index.ts)静态 import 拿 WebAssembly.Module 后注入 —— 两种
// 来源 initWasm 通吃。字体喂仓内 base64 TTF 子集(Inter + 手绘 Handlee;fontdb
// 不认 woff2,故用 fonts-ttf.ts 的解压版,家族名同源),不读系统字体(wasm 沙盒内
// 本就无系统字体;子集外字符——如 CJK——PNG 中无回退,见 #24 已知边界)。
import { ApiError } from '../specs/index.js';
import { INTER_TTF_B64, HANDEE_TTF_B64 } from '../styles/fonts-ttf.js';
import { FONT_FILES_B64 } from '../styles/fonts-banner.js';

// ── 烘焙:var() → 具体色值,产出平面 SVG ─────────────────────────────────────
// Edit @X-CMD 角标已上移至 svgDoc(核心/archmap/mindmap)与 decorate(echarts),
// SVG 层统一注入 → PNG 烘焙后自动保留,此处不再重复注入(#27)

/**
 * Bake a rendered SVG into a flat SVG: resolve every `var(--d-*)` to a concrete
 * color for the given scheme and strip all `<style>` blocks (skin vars, font
 * faces, hover CSS). Works on any renderer's output — core, echarts, archmap,
 * mindmap — because the var table is parsed from the SVG itself.
 */
export function bakeFlatSvg(svg: string, scheme: 'light' | 'dark'): string {
  const styles = [...svg.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
  const lightCss = styles.replace(/@media[\s\S]*$/, ''); // @media(prefers-color-scheme: dark){...} 截掉
  const darkCss = /@media[^{]*prefers-color-scheme[^{]*\{([\s\S]*)\}\s*$/.exec(styles)?.[1] ?? '';
  const varsOf = (css: string): Record<string, string> => {
    const m: Record<string, string> = {};
    for (const [, k, v] of css.matchAll(/(--d-[a-z0-9-]+)\s*:\s*([^;}]+)/g)) m[k] = v.trim();
    return m;
  };
  const map = varsOf(lightCss); // 单 scheme 渲染(scheme=dark)时唯一一套即暗色
  if (scheme === 'dark') Object.assign(map, varsOf(darkCss));
  let out = svg.replace(/<style[^>]*>[\s\S]*?<\/style>/g, '');
  for (const [k, v] of Object.entries(map)) {
    out = out.replaceAll(`var(${k})`, v); // 闭括号定界,var(--d-s1) 不会误伤 var(--d-s10)
  }
  return out;
}

// ── wasm 引擎:一次 init,四运行时 ──────────────────────────────────────────

let injected: WebAssembly.Module | undefined; // Workers 入口注入(打包期静态 import)
let engine: Promise<typeof import('@resvg/resvg-wasm')> | undefined;

/** Workers 入口专用:把打包期拿到的 wasm Module 注入(见 src/index.ts)。 */
export function injectResvgWasm(mod: WebAssembly.Module): void {
  injected = mod;
}

async function wasmSource(): Promise<Uint8Array | WebAssembly.Module> {
  if (injected !== undefined) return injected;
  // Node / Deno:exports 显式暴露 ./index_bg.wasm,resolve 后读文件
  const { createRequire } = await import('node:module');
  const { readFileSync } = await import('node:fs');
  const req = createRequire(import.meta.url);
  return readFileSync(req.resolve('@resvg/resvg-wasm/index_bg.wasm'));
}

function resvgEngine(): Promise<typeof import('@resvg/resvg-wasm')> {
  engine ??= (async () => {
    const m = await import('@resvg/resvg-wasm');
    await m.initWasm(await wasmSource());
    return m;
  })();
  return engine;
}

// base64 TTF → 字节(与 SVG 内嵌 woff2 子集同源,宽度测量与渲染零偏差)
const fontBytes = (b64: string): Uint8Array => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
let fonts: Uint8Array[] | undefined;

export interface PngOptions {
  /** 像素倍率(2 = retina);画布尺寸取 SVG 固有 width/height × scale */
  scale?: number;
}

/**
 * Rasterize a rendered draw SVG to PNG. The SVG is baked flat for `scheme`
 * first (var() colors resolved, style blocks stripped), then rendered by
 * resvg with the repo's embedded Inter/Handlee subsets.
 *
 * @throws ApiError(400/500) when the rasterizer is unavailable or fails
 */
export async function svgToPng(svg: string, scheme: 'light' | 'dark', opts: PngOptions = {}): Promise<Uint8Array> {
  const scale = opts.scale ?? 1;
  if (!(scale >= 1 && scale <= 3)) {
    throw new ApiError(400, `"scale" must be between 1 and 3, got ${JSON.stringify(scale)}`);
  }
  fonts ??= [fontBytes(INTER_TTF_B64), fontBytes(HANDEE_TTF_B64), ...FONT_FILES_B64.map((f) => fontBytes(f.native))];
  let Resvg: (typeof import('@resvg/resvg-wasm'))['Resvg'];
  try {
    ({ Resvg } = await resvgEngine());
  } catch (e) {
    throw new ApiError(500, `png engine failed to load (${e instanceof Error ? e.message : 'wasm init error'})`);
  }
  try {
    const r = new Resvg(bakeFlatSvg(svg, scheme), {
      fitTo: scale === 1 ? { mode: 'original' } : { mode: 'zoom', value: scale },
      background: 'rgba(0,0,0,0)',
      font: { fontBuffers: fonts, defaultFontFamily: 'DrawInter', loadSystemFonts: false },
    });
    return r.render().asPng();
  } catch (e) {
    throw new ApiError(400, `png rendering failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}
