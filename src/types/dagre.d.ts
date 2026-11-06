// dagre 无官方类型,自绘最小面(我们只消费布局坐标)
declare module 'dagre' {
  export interface GraphLabel { rankdir?: string; nodesep?: number; ranksep?: number; marginx?: number; marginy?: number; [k: string]: unknown }
  interface Node { width: number; height: number; x: number; y: number; [k: string]: unknown }
  interface Graph {
    setGraph(label: GraphLabel): void;
    setDefaultEdgeLabel(fn: () => unknown): void;
    setNode(id: string, label: { width: number; height: number; [k: string]: unknown }): void;
    setEdge(from: string, to: string, label?: unknown): void;
    nodes(): string[];
    node(id: string): Node;
    layout(): void;
  }
  export function graphlib(opts?: { compound?: boolean; multigraph?: boolean }): { Graph: new () => Graph };
  const dagre: { layout: (g: Graph) => void; graphlib: { Graph: new () => Graph } };
  export default dagre;
}
