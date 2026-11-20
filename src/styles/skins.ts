// 三张跨图种「皮肤」:macaron(马卡龙)/ wabi-sabi(侘寂)/ primer(GitHub)。
// 色值数据源:x-cmd/color 仓 data/palettes.json(families.macaron / families.wabi-sabi /
// schemes.primer);暗面 Duo 值是本仓的派生 —— macaron 粉彩明暗同值(暗底上反而更亮,
// Apple 暗色模式的粉彩即此用法),wabi-sabi 暗底微提对比度,primer 按实测明暗同值。
// 与「设计规范色板」(common.ts,同步自规范页)是两个来源,不混。
import { duo, type Duo, type Neutrals, type Rules } from './types.js';

/** 家族皮肤:跨图种共享的部分;各图种在此基础上做少量规则增补 */
export interface FamilySkin {
  family: string;
  label: string;
  series: Duo[];
  /** 溢出档:类目数超出色板时的补位 —— 全局 Tailwind 表会击穿粉彩/土色气质(#133) */
  overflow: Duo[];
  neutrals: Partial<Neutrals>;
  rules: Partial<Rules>;
  ramp?: [Duo, Duo];
}

// ── macaron:粉彩糖果。暖白奶油纸卡 + 墨梅字;网格一律不要(软就是信息);
//    数值不放在粉彩柱内(粉彩 1.4:1 读不了),一律外标 —— hbar 保持 plain 模式 ✓
const MACARON_NEUTRALS: Partial<Neutrals> = {
  ink: duo('#4A4045', '#FAF0F3'),      // 墨梅 / 粉白
  text: duo('#6B5F66', '#E5D5DB'),
  muted: duo('#8C7F84', '#B79FAB'),    // 灰玫瑰(palette 的 muted 原值)
  faint: duo('#B6A9AE', '#8F7A85'),
  grid: duo('#F2E7E9', '#3D3238'),     // 暖调发丝
  baseline: duo('#E8D9DC', '#4A3D44'),
  border: duo('#EFE0E3', '#463A41'),
  card: duo('#FFFDFB', '#2B2227'),     // 奶油纸 / 深暖梅
  halo: duo('#FFFDFB', '#362B31'),
};

export const MACARON: FamilySkin = {
  family: 'macaron',
  label: '马卡龙粉彩',
  series: [
    duo('#F8C8DC'), // 草莓牛奶
    duo('#A8E6CF'), // 薄荷
    duo('#C3B1E1'), // 薰衣草
    duo('#FFF1A8'), // 柠檬
    duo('#FFD3B6'), // 蜜桃
    duo('#AED6F1'), // 天空
    duo('#FFAAA5'), // 珊瑚(accent)
  ],
  // 溢出 = 同色系粉彩的加深/掺灰步进(长春花蓝/雾玉/灰玫瑰/深草莓),不引鲜艳色
  overflow: [duo('#C9D4F2'), duo('#B5DFD3'), duo('#D8C7CB'), duo('#F3B7CE')],
  neutrals: MACARON_NEUTRALS,
  rules: {
    canvas: 'card',
    grid: 'none',
    barCorner: 8,
    legendShape: 'circle',
    pieCorner: 6,
    pieSliceGap: 2,
  },
};

// ── wabi-sabi:暖土。石灰墙卡 + 暖墨;近直角(手作感)、不要网格;
//    系列色 L 0.45-0.80 中段,明暗基本同值(暗底把过深的林/苔微提一档保对比度)
const WABI_NEUTRALS: Partial<Neutrals> = {
  ink: duo('#3B342E', '#EDE7DD'),      // 暖墨 / 暖白
  text: duo('#5C5347', '#D8CFC2'),
  muted: duo('#7A7062', '#ABA08E'),
  faint: duo('#9C917F', '#857B6A'),
  grid: duo('#D8CFC0', '#3A342B'),     // 暖沙 / 暖炭
  baseline: duo('#C9BBA6', '#453E33'),
  border: duo('#DDD3C4', '#3E382F'),
  card: duo('#E8E0D5', '#262019'),     // 石灰墙 / 深暖炭
  halo: duo('#E8E0D5', '#2E2822'),
};

export const WABI_SABI: FamilySkin = {
  family: 'wabi-sabi',
  label: '侘寂土色',
  series: [
    duo('#7D8471', '#8A9180'), // 苔
    duo('#4A5A45', '#647561'), // 林(暗底 2.2:1 过深,提到 3.3)
    duo('#8C6D5B', '#9C7D69'), // 树皮
    duo('#A08C7D'),            // 陶土
    duo('#C9BBA6'),            // 沙
  ],
  // 溢出 = 沙→深陶的土色步进(浅沙灰/深树皮/陶棕/灰苔/灰石)
  overflow: [
    duo('#B5A48C'), duo('#6E5C4C', '#85715F'), duo('#96785F', '#A08368'),
    duo('#5E6B57', '#74806A'), duo('#D3C9B6'),
  ],
  neutrals: WABI_NEUTRALS,
  rules: {
    canvas: 'card',
    grid: 'none',
    barCorner: 2,
    pieSliceGap: 2,
  },
};

// ── primer:GitHub 原生。功能八色(链接/合并/issue/review 那组色),明暗同值
//    (OKLCH L 0.52-0.57,白底全 AA —— 暗底免费双用);中性色直接用 GitHub 自家 token,
//    意图与默认底相反:默认底带 indigo 相为了「浮出页面」,primer 要「融入 GitHub」
const PRIMER_NEUTRALS: Partial<Neutrals> = {
  ink: duo('#1F2328', '#E6EDF3'),
  text: duo('#59636E', '#B0B8C1'),
  muted: duo('#656D76', '#8C959F'),
  faint: duo('#8C959F', '#6E7681'),
  grid: duo('#D0D7DE', '#30363D'),     // GitHub border.default
  baseline: duo('#AFB8C1', '#3D444D'),
  border: duo('#D0D7DE', '#262C36'),
  card: duo('#FFFFFF', '#0D1117'),
  halo: duo('#FFFFFF', '#161B22'),
};

export const PRIMER: FamilySkin = {
  family: 'primer',
  label: 'GitHub Primer',
  series: [
    duo('#0969DA'), // blue(链接)
    duo('#1A7F37'), // green(合并)
    duo('#BC4C00'), // orange
    duo('#8250DF'), // purple(合并图标紫)
    duo('#CF222E'), // red(破坏性)
    duo('#BF3989'), // pink
    duo('#1B7C83'), // teal
    duo('#9A6700'), // amber(注意)
  ],
  // 溢出 = 灰阶明度步进(>8 类在 GitHub 场景本就罕见,安静往后排)
  overflow: [
    duo('#57606A', '#8C959F'), duo('#8C959F', '#6E7681'),
    duo('#B6BFC8', '#484F58'), duo('#3B424B', '#B6BFC8'),
  ],
  neutrals: PRIMER_NEUTRALS,
  rules: {
    canvas: 'plain', // 透明 —— 嵌 README 即页面本身,这是 feature
    grid: 'solid',
    barCorner: 6,
    legendShape: 'square',
    tickFont: 12,
    pieSliceGap: 2,
  },
  // GitHub 图表不做渐变:单系列柱钉成纯蓝(否则蓝→绿渐变立刻不像 GitHub,#133 实测二)
  ramp: [duo('#0969DA'), duo('#0969DA')],
};
