// vendored jison 产物的最小类型面
export interface MermaidFlowParser {
  yy: Record<string, unknown>;
  parse(input: string): boolean;
}
export declare const mermaidFlowParser: MermaidFlowParser;
