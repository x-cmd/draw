// 日历风格变体:base = 苹果风(白底、细线、日期号克制,今天是红底白字);
// mono = 墨水风(灰阶,适合印在纸上)。
import { duo, makeVariant, type Variant } from './types.js';

export const CALENDAR_VARIANTS: Variant[] = [
  makeVariant({
    family: 'base',
    label: '日历(苹果风)',
    series: [
      duo('#60A5FA'), // 工作 · 蓝
      duo('#A78BFA'), // 会议 · 紫
      duo('#FBBF24'), // 评审 · 琥珀
      duo('#34D399'), // 发布 · 绿
      duo('#2DD4BF'), // 专注 · 青绿
      duo('#FB923C'), // 出行 · 橙
      duo('#FB7185'), // 健康 · 玫瑰
      duo('#818CF8'), // 个人 · 靛
      duo('#22D3EE'), // 课程 · 青
      duo('#F87171'), // 值班 · 红
    ],
    neutrals: {
      grid: duo('#EFEFF1', '#232326'),
      border: duo('#E4E4E7', '#27272A'),
      faint: duo('#C4C4CB', '#52525B'),
    },
    size: [760, 520],
    rules: {
      canvas: 'card',
      title: 'plain',
      num: 'none',
    },
  }),
  makeVariant({
    family: 'mono',
    label: '日历(墨水风)',
    series: [
      duo('#52525B'), duo('#71717A'), duo('#8A8A94'), duo('#A1A1AA'), duo('#B4B4BC'),
      duo('#8A8A94'), duo('#71717A'), duo('#5F5F69'), duo('#9E9EA8'), duo('#3F3F46'),
    ],
    neutrals: {
      grid: duo('#EFEFF1', '#232326'),
      border: duo('#E4E4E7', '#27272A'),
      faint: duo('#C4C4CB', '#52525B'),
    },
    size: [760, 520],
    rules: {
      canvas: 'card',
      title: 'plain',
      num: 'none',
    },
  }),
];
