// 表格(base = 卡片底 + 细网格线 + 表头弱化 + 数字右对齐)。
// 表格的排版跟别的 kind 用同一套排版件(svgDoc / textW / skin),所以同一页里
// 表格与图表长得是一家人(见 x-cmd/draw#24)。
import { duo, makeVariant, type Variant } from './types.js';

export const TABLE_VARIANTS: Variant[] = [
  makeVariant({
    family: 'base',
    label: '简洁表格',
    series: [duo('#2563EB', '#60A5FA')],
    size: [640, 320],
  }),
];
