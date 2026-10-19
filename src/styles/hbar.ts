// 水平柱(base 待设计补充;规范款:hbar-1 opendata、hbar-2/3 xcmd、hbar-4 rank)。
import { duo, makeVariant, type Variant } from './types.js';
import { C_shadcn, C_openHbar, C_xcmd, C_scoreHbar } from './common.js';

export const HBAR_VARIANTS: Variant[] = [
  makeVariant({
    family: 'base',
    label: 'shadcn 蓝阶',
    series: (['blue3','blue1','blue4','blue2','blue5'] as const).map((c) => duo(C_shadcn[c])),
  }),
  // 水平柱 1 · OpenData:逐行分类色、数值内标白字、竖直虚线网格、参考线(规范 hbar-1,960×480)
  makeVariant({
    family: 'opendata',
    label: 'OpenData 风格',
    series: ['slate', 'green', 'red', 'orange', 'teal', 'blue', 'purple'].map((c) => duo(C_openHbar[c])),
    neutrals: { faint: duo(C_openHbar['slate']) }, // 参考线用石板灰
    size: [960, 480],
    rules: {
      canvas: 'plain',
      hbarMode: 'rows',
      grid: 'dashed', gridDash: '4 6',
      num: 'none',
    },
  }),
  // 水平柱 2 · X-CMD 语言分布:紧凑像素格,不足一格保留部分填充(规范 hbar-2,920×300)
  makeVariant({
    family: 'xcmd',
    label: 'X-CMD 像素条',
    series: [duo(C_xcmd['blue'])],
    neutrals: { faint: duo(C_xcmd['track-light'], C_xcmd['track']) },
    size: [920, 300],
    rules: {
      canvas: 'plain',
      hbarMode: 'cells',
      grid: 'none', baseline: 'none',
      num: 'none',
    },
  }),
  // 水平柱 3 · X-CMD Issue:中轴蝴蝶,左新建右关闭,数值直读(规范 hbar-3,820×370)
  makeVariant({
    family: 'xcmd-issue',
    label: 'X-CMD 蝴蝶图',
    series: [duo(C_xcmd['blue']), duo(C_xcmd['cyan'])],
    neutrals: { faint: duo(C_xcmd['track-light'], C_xcmd['track']) },
    size: [820, 370],
    rules: {
      canvas: 'plain',
      hbarMode: 'diverging',
      grid: 'none', baseline: 'none',
      legend: 'top-left', legendShape: 'circle',
      num: 'none',
    },
  }),
  // 水平柱 4 · Search Intelligence 排行:实色基础分+斜纹搜索增益,数值直读(规范 hbar-4,960×560)
  makeVariant({
    family: 'rank',
    label: 'Search Intelligence 排行',
    series: [duo(C_scoreHbar['black'], '#E4E4E7')],
    size: [960, 560],
    rules: {
      canvas: 'plain',
      hbarMode: 'lift',
      grid: 'dashed', gridDash: '3 5',
      num: 'none',
    },
  }),
];
