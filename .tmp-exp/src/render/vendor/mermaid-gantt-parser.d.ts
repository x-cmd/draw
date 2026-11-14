// vendored gantt jison 产物的最小类型面
export interface MermaidGanttParser {
  yy: Record<string, unknown>;
  parse(input: string): boolean;
}
export declare const mermaidGanttParser: MermaidGanttParser;
