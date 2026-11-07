// dagre 无官方类型,自绘最小面(我们只消费布局坐标)。
//
// 写成普通模块而不是 `declare module 'dagre'`:ambient 模块声明属于全局类型改动,
// JSR 不允许发布(「modifying global types is not allowed」)。这里改为导出类型,
// 由引用方用 `// @ts-types=` 指向本文件。
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
export function graphlib(opts?: { compound?: boolean; multigraph?: boolean }): { Graph: new () => Graph };
declare const dagre: { layout: (g: Graph) => void; graphlib: { Graph: new () => Graph } };
export default dagre;
