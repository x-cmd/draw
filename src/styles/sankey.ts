// 桑基图三变体:base=规范 sankey-1 基础款(细节点+源色流带)、
// fund=规范 sankey-2 渐变 Fund Allocation(盒节点+渐变流带+表头表尾)、
// pipeline=规范 sankey-3 Revenue Pipeline(双渐变流带+中央总额面板)。
import { duo, makeVariant, type Variant } from './types';
import { C_sankey, C_sankeyGradient, C_sankeyPipeline } from './common';

const S = (keys: string[]) => keys.map((c) => duo(c));

export const SANKEY_VARIANTS: Variant[] = [
  makeVariant({
    family: 'base',
    label: 'Evil Charts 基础款',
    series: S(['green', 'red', 'purple', 'cyan', 'blue', 'orange', 'lime', 'rose'].map((k) => (C_sankey as Record<string, string>)[k] ?? k)),
    size: [720, 420],
    rules: { canvas: 'plain', sankeyMode: 'basic', num: 'none' },
  }),
  makeVariant({
    family: 'fund',
    label: 'Evil Charts Fund Allocation',
    series: S(['teal', 'yellow', 'orange', 'amber', 'purple', 'violet', 'indigo'].map((k) => (C_sankeyGradient as Record<string, string>)[k] ?? k)),
    size: [760, 460],
    rules: { canvas: 'plain', sankeyMode: 'fund', num: 'none' },
  }),
  makeVariant({
    family: 'pipeline',
    label: 'Evil Charts Revenue Pipeline',
    series: S(['blue', 'indigo', 'violet', 'rose', 'red', 'pink', 'orange'].map((k) => (C_sankeyPipeline as Record<string, string>)[k] ?? k)),
    size: [760, 400],
    rules: { canvas: 'plain', sankeyMode: 'pipeline', num: 'none' },
  }),
];
