// dagre 无官方类型,自绘最小面(我们只消费布局坐标)。
//
// 写成普通模块(有 export)而不是 `declare module 'dagre'`:ambient 模块声明属于
// 全局类型改动,JSR 不允许发布(「modifying global types is not allowed」)。
// 引用方用 `// @ts-types=` 指向本文件(Deno/JSR 侧),tsc 侧走 dagre-ambient.d.ts。
export interface GraphLabel {
  rankdir?: string;
  nodesep?: number;
  ranksep?: number;
  marginx?: number;
  marginy?: number;
  [k: string]: unknown;
}
export interface GraphNode {
  width: number;
  height: number;
  x: number;
  y: number;
  [k: string]: unknown;
}
export interface Graph {
  setGraph(label: GraphLabel): void;
  setDefaultEdgeLabel(fn: () => unknown): void;
  setNode(id: string, label: { width: number; height: number; [k: string]: unknown }): void;
  setEdge(from: string, to: string, label?: unknown): void;
  nodes(): string[];
  node(id: string): GraphNode;
  layout(): void;
}
export interface Dagre {
  layout: (g: Graph) => void;
  graphlib: { Graph: new () => Graph };
}
export declare const graphlib: { Graph: new () => Graph };
// 默认导出只作类型面的载体(这个模块运行时不会被加载)
const dagreTypeOnly = undefined as unknown as Dagre;
export default dagreTypeOnly;
