// .wasm 模块声明:Workers 入口静态 import '@resvg/resvg-wasm/index_bg.wasm' 用。
// wrangler 打包规则把 .wasm 识别为 WebAssembly.Module;Node/Deno 路径不 import 它。
declare module '*.wasm' {
  const wasmModule: WebAssembly.Module;
  export default wasmModule;
}
