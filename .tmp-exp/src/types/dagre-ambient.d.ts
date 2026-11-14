// tsc 侧的 'dagre' 模块声明 —— 只给 tsc 看。
// ambient 声明属于全局类型改动,JSR 不许发布,所以这个文件不进发布包
// (deno.json publish.exclude);Deno 侧走 // @ts-types=。
// 用内联 import type 取类型:本文件仍是「脚本」而非模块,declare module 才算
// ambient 声明而不是模块增补。
declare module 'dagre' {
  const dagre: import('./dagre.js').Dagre;
  export default dagre;
}
