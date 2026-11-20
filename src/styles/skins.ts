// 跨图种「皮肤」:同一套色板/中性色/规则跨图种生效(?t=<family>)。
// 色相数据源:x-cmd/color 仓 data/palettes.json(families.* / schemes.*);
// 图表级 Duo 是本仓的派生 —— color 仓的家族色板按**观感**设计,同族明度几乎相同
// (macaron 两两 1.02-1.08),直接当系列色分不开 —— color 仓文档自己写明
// 「马卡龙绝不能用饼图」。图表级色板按同一批色相**钉一条明度阶梯**再入册:
// 相邻两色 ≥1.2(低彩度家族靠明度,高彩度家族靠色相),对自家卡底 ≥1.3 / ≥2.2。
// 明暗策略:macaron/wabi 系列按底各配一套;nordic/salmon 亮暗各一套;
// primer/neon 明暗同值(功能色/荧光色对黑白底都成立)。
import { duo, type Duo, type Neutrals, type Role, type Rules } from './types.js';

/** 家族皮肤:跨图种共享的部分;各图种在此基础上做少量规则增补 */
export interface FamilySkin {
  family: string;
  label: string;
  series: Duo[];
  /** 溢出档:类目数超出色板时的补位 —— 全局 Tailwind 表会击穿家族气质(#133) */
  overflow: Duo[];
  neutrals: Partial<Neutrals>;
  rules: Partial<Rules>;
  ramp?: [Duo, Duo];
  /** 语义角色表(colors=danger 按家族解析);文末统一挂(一张总表好审计) */
  roles?: Partial<Record<Role, Duo>>;
}

// ── macaron:马卡龙。奶油卡 + 墨梅字;图表级 = 同批糖果色相钉了明度之字
//    (珊瑚最深 → 天空最浅,相邻可分);粉彩原值留在 color 仓,这版是「图表档」
const MACARON_NEUTRALS: Partial<Neutrals> = {
  ink: duo('#4A4045', '#FAEEF2'),      // 墨梅 / 粉白
  text: duo('#6B5F66', '#E8D5DC'),
  muted: duo('#8C7F84', '#BCA3AE'),    // 灰玫瑰(palette 的 muted 原值)
  faint: duo('#B6A9AE', '#93818B'),
  grid: duo('#F0E2E5', '#41333B'),     // 暖调发丝
  baseline: duo('#E5D4D8', '#4E3F47'),
  border: duo('#EDDFE2', '#4A3B43'),
  card: duo('#FAF3EA', '#33262D'),     // 奶油纸(带体量的暖,不是近白)/ 深暖梅
  halo: duo('#FAF3EA', '#3C2E36'),
};

export const MACARON: FamilySkin = {
  family: 'macaron',
  label: '马卡龙糖果',
  series: [
    duo('#D83B30'), // 珊瑚(阶梯最深处)
    duo('#34B373'), // 薄荷
    duo('#E8A471'), // 蜜桃
    duo('#DE6092'), // 草莓牛奶
    duo('#E6C621'), // 柠檬
    duo('#B094E0'), // 薰衣草
    duo('#B4D8EF'), // 天空(最浅一档)
  ],
  // 溢出 = 同族糖果色相的加深/掺灰步进
  overflow: [duo('#B2352C'), duo('#299465'), duo('#C478C8'), duo('#7FA8C9')],
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

// ── wabi-sabi:侘寂。石灰墙卡 + 暖墨;近直角(手作感)、不要网格;
//    亮面/暗面各一条土色阶梯(暗面整体提一档保对比度)
const WABI_NEUTRALS: Partial<Neutrals> = {
  ink: duo('#3B342E', '#EDE7DD'),      // 暖墨 / 暖白
  text: duo('#5C5347', '#D8CFC2'),
  muted: duo('#7A7062', '#ABA08E'),
  faint: duo('#9C917F', '#857B6A'),
  grid: duo('#D8CFC0', '#3A342B'),     // 暖沙 / 暖炭
  baseline: duo('#C9BBA6', '#453E33'),
  border: duo('#DDD3C4', '#3E382F'),
  card: duo('#E8E0D5', '#2B241C'),     // 石灰墙 / 深暖炭
  halo: duo('#E8E0D5', '#332B22'),
};

export const WABI_SABI: FamilySkin = {
  family: 'wabi-sabi',
  label: '侘寂土色',
  series: [
    duo('#879A79', '#91A385'), // 苔
    duo('#587656', '#668863'), // 林
    duo('#A1795E', '#AE8C75'), // 树皮
    duo('#AB9A8C', '#B6A79A'), // 陶土
    duo('#CBC1AE', '#CFC6B4'), // 沙
  ],
  // 溢出 = 沙→深陶的土色步进
  overflow: [
    duo('#B5A48C', '#B5A48C'), duo('#6E5C4C', '#85715F'), duo('#96785F', '#A08368'),
    duo('#5E6B57', '#74806A'), duo('#D3C9B6', '#D3C9B6'),
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
//    (高彩度、色相拉开,同明度也分得开);中性色直接用 GitHub 自家 token,
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
  // GitHub 图表不做渐变:单系列柱钉成纯蓝(#133 实测二)
  ramp: [duo('#0969DA'), duo('#0969DA')],
};

// ── morandi:莫兰迪。灰调纸面家族 —— 每个色相都往中性拉,什么都不喊;
//    灰调本身带明度阶梯(color 仓:这正是它与马卡龙的区别),图表级只需排成之字
const MORANDI_NEUTRALS: Partial<Neutrals> = {
  ink: duo('#3F3A38', '#E9E5E0'),
  text: duo('#5C5652', '#CFC9C3'),
  muted: duo('#8A817A', '#A69E96'),
  faint: duo('#A8A099', '#8A837B'),
  grid: duo('#E3DDD3', '#3A3631'),
  baseline: duo('#D6CFC5', '#46413B'),
  border: duo('#E8E2D9', '#3F3A35'),
  card: duo('#F5F2ED', '#2A2724'),     // 纸 / 暖炭灰
  halo: duo('#F5F2ED', '#332F2B'),
};

export const MORANDI: FamilySkin = {
  family: 'morandi',
  label: '莫兰迪灰调',
  series: [
    duo('#938276', '#AA9C92'), // 棕灰(umber)
    duo('#A8B69A', '#BDC7B2'), // 鼠尾草绿(sage)
    duo('#C9C2BA', '#D7D1CC'), // 陶白(clay)
    duo('#919CAC', '#A8B1BD'), // 雾蓝(mist blue)
    duo('#D1C2CC', '#DCD0D8'), // 灰紫红(mauve)
  ],
  // 溢出 = 灰调的深浅步进(补到 10:饼图 9 类 + Other)
  overflow: [
    duo('#6E6259', '#7E7269'), duo('#84929D', '#94A2AC'),
    duo('#B7AE9F', '#C2BAB0'), duo('#575049', '#66605A'),
    duo('#C8BFA8', '#CFC7B4'),
  ],
  neutrals: MORANDI_NEUTRALS,
  rules: {
    canvas: 'card',
    grid: 'solid',
    barCorner: 6,
    legendShape: 'circle',
    pieSliceGap: 2,
  },
};

// ── nordic:北欧。冷、淡、 airy —— 雪白底 + 峡湾蓝 + 少量暖点缀(陶/芥末)
const NORDIC_NEUTRALS: Partial<Neutrals> = {
  ink: duo('#2E3A40', '#DFE8EC'),
  text: duo('#4E5E67', '#B9C7CE'),
  muted: duo('#6E8290', '#93A5B0'),
  faint: duo('#93A5B0', '#74848E'),
  grid: duo('#E8EDF0', '#313E48'),     // 霜线
  baseline: duo('#D5DEE3', '#3D4B55'),
  border: duo('#E2E9ED', '#2C3842'),
  card: duo('#F7F9FA', '#1F2A33'),     // 雪 / 极夜蓝
  halo: duo('#F7F9FA', '#263239'),
};

export const NORDIC: FamilySkin = {
  family: 'nordic',
  label: '北欧冷调',
  series: [
    duo('#6B91A8', '#85A4B7'), // 峡湾(deep fjord)
    duo('#DBA08F', '#E2B9AC'), // 陶(terracotta)
    duo('#A6C2D2', '#C2D5DF'), // 冰川(glacier)
    duo('#96B57F', '#AFC89D'), // 桉树(eucalyptus)
    duo('#D9C178', '#EAD08A'), // 芥末(mustard,压深一档 —— 雪底上 1.4:1 会融化)
    duo('#8FACC2', '#ADBECD'), // 浅峡湾(fjord)
    duo('#C25C3D', '#CE7D64'), // 锈陶(rust,点缀)
  ],
  // 溢出 = 冷调与暖点缀的深浅步进
  overflow: [
    duo('#55788C', '#6E93A8'), duo('#C98A6B', '#D89C7E'),
    duo('#7A9C62', '#96B383'), duo('#D5B972', '#E2C987'),
  ],
  neutrals: NORDIC_NEUTRALS,
  rules: {
    canvas: 'card',
    grid: 'solid',
    barCorner: 8,
    legendShape: 'circle',
    pieSliceGap: 2,
  },
};

// ── salmon:三文鱼金融报。粉纸 + 波尔多红/牛津蓝/茶青 —— FT 那类财务版面的权威感;
//    系列色是 color 仓 schemes.salmon 配好的(为粉纸设计),这里只排了明度之字
const SALMON_NEUTRALS: Partial<Neutrals> = {
  ink: duo('#33302E', '#EFE6D8'),
  text: duo('#524B44', '#CFC2B0'),
  muted: duo('#7A6E64', '#A99A88'),
  faint: duo('#9C8E80', '#8C7E6E'),
  grid: duo('#E6D8C8', '#3C332A'),
  baseline: duo('#D8C6B0', '#4A3F33'),
  border: duo('#EADCC8', '#453A2F'),
  card: duo('#FBEFE3', '#2A211B'),     // 三文鱼纸 / 深咖
  halo: duo('#FBEFE3', '#332921'),
};

export const SALMON: FamilySkin = {
  family: 'salmon',
  label: '三文鱼金融报',
  series: [
    duo('#80855C', '#ADAF86'), // 橄榄
    duo('#8F1D3E', '#C75B76'), // 波尔多红(claret)
    duo('#0E93C9', '#5FAFD9'), // 晴空蓝
    duo('#F07F2E', '#F0A05E'), // 橙
    duo('#5A648B', '#8B96BE'), // 牛津蓝
    duo('#B48A9E', '#C9A6B2'), // 玫瑰
    duo('#0F6E75', '#4E9CA3'), // 茶青(teal)
  ],
  // 溢出 = 波尔多/茶青的明度步进
  overflow: [
    duo('#6E1730', '#A3485E'), duo('#0B545A', '#3F858B'),
    duo('#C4662A', '#D98A4E'), duo('#3F4A75', '#7380A5'),
  ],
  neutrals: SALMON_NEUTRALS,
  rules: {
    canvas: 'card',
    title: 'editorial',       // 自然语言大标题 —— 报纸版面的味
    grid: 'solid',
    barCorner: 2,
    legendShape: 'square',
    pieSliceGap: 2,
  },
};

// ── neon:霓虹。近黑画布 + 荧光(青/品红/酸柠/紫/琥珀)—— 唯一天生暗底的家族;
//    荧光色高彩度、色相拉开,明暗同值;折线走发光(evil-glow 那套词汇)
const NEON_NEUTRALS: Partial<Neutrals> = {
  ink: duo('#0B0F14', '#E6EDF3'),
  text: duo('#3A424D', '#B8C4CF'),
  muted: duo('#6E7B89', '#8B98A5'),
  faint: duo('#8B98A5', '#6E7B89'),
  grid: duo('#E8ECF0', '#1B2230'),
  baseline: duo('#D4DAE2', '#232B3A'),
  border: duo('#E4E9EF', '#1E2530'),
  card: duo('#FFFFFF', '#0A0C12'),     // 白 / 虚空(void)
  halo: duo('#FFFFFF', '#111620'),
};

export const NEON: FamilySkin = {
  family: 'neon',
  label: '霓虹荧光',
  series: [
    duo('#FF2E88'), // 品红
    duo('#EFA500'), // 琥珀
    duo('#00D5E6'), // 青
    duo('#8FE829'), // 酸柠
    duo('#9B5CFF'), // 紫
  ],
  // 溢出 = 各荧光的降档步进(补到 10:饼图 9 类 + Other)
  overflow: [
    duo('#C9246D', '#FF5CA3'), duo('#00A8B8', '#2FD9E8'),
    duo('#6FB81F', '#A5F04E'), duo('#7A48CC', '#AF82FF'),
    duo('#C78700', '#FFC133'),
  ],
  neutrals: NEON_NEUTRALS,
  rules: {
    canvas: 'card',
    grid: 'none',
    barCorner: 6,
    glow: true,               // 折线发光(evil-glow 词汇)
    points: 'none',
    lineWidth: 3,
    pieSliceGap: 2,
  },
};

/** 全部跨图种皮肤(注册顺序 = 图库「风格」类别的排列顺序) */
export const SKINS: FamilySkin[] = [MACARON, WABI_SABI, PRIMER, MORANDI, NORDIC, SALMON, NEON];

// ── 语义角色表(colors=danger 按家族解析)。通常取自家 series;灰调家族没有
//    警报红,按气质就近取 —— 语义(可区分)保留,紧迫感柔化,文档写明
const MACARON_ROLES: Partial<Record<Role, Duo>> = {
  primary: duo('#DE6092'), // 草莓
  success: duo('#34B373'), // 薄荷
  warning: duo('#E6C621'), // 柠檬
  danger: duo('#D83B30'),  // 珊瑚(阶梯最深处)
  info: duo('#B094E0'),    // 薰衣草
  accent: duo('#DE6092'),
};
const WABI_ROLES: Partial<Record<Role, Duo>> = {
  primary: duo('#879A79', '#91A385'), // 苔
  success: duo('#587656', '#668863'), // 林
  warning: duo('#CBC1AE', '#CFC6B4'), // 沙(安静的黄)
  danger: duo('#A1795E', '#AE8C75'),  // 树皮(没有警报,只有磨损)
  info: duo('#5E6B57', '#74806A'),    // 灰苔
  accent: duo('#587656', '#668863'),
};
const PRIMER_ROLES: Partial<Record<Role, Duo>> = {
  primary: duo('#0969DA'), // blue(GitHub 链接蓝)
  success: duo('#1A7F37'), // green(合并)
  warning: duo('#9A6700'), // amber(注意)
  danger: duo('#CF222E'),  // red(破坏性)
  info: duo('#1B7C83'),    // teal
  accent: duo('#0969DA'),
};
const MORANDI_ROLES: Partial<Record<Role, Duo>> = {
  primary: duo('#A8B69A', '#BDC7B2'), // 鼠尾草
  success: duo('#A8B69A', '#BDC7B2'),
  warning: duo('#C4AFA1', '#D2BFB0'), // 灰陶(taupe)
  danger: duo('#6E6259', '#7E7269'),  // 深棕灰(压重的一档)
  info: duo('#919CAC', '#A8B1BD'),    // 雾蓝
  accent: duo('#8C7A6E', '#AA9C92'),
};
const NORDIC_ROLES: Partial<Record<Role, Duo>> = {
  primary: duo('#6B91A8', '#85A4B7'), // 峡湾
  success: duo('#96B57F', '#AFC89D'), // 桉树
  warning: duo('#D9C178', '#EAD08A'), // 芥末
  danger: duo('#C25C3D', '#CE7D64'),  // 锈陶
  info: duo('#A6C2D2', '#C2D5DF'),    // 冰川
  accent: duo('#C25C3D', '#CE7D64'),
};
const SALMON_ROLES: Partial<Record<Role, Duo>> = {
  primary: duo('#5A648B', '#8B96BE'), // 牛津蓝(财务图的主角色)
  success: duo('#0F6E75', '#4E9CA3'), // 茶青
  warning: duo('#F07F2E', '#F0A05E'), // 橙
  danger: duo('#8F1D3E', '#C75B76'),  // 波尔多红
  info: duo('#0E93C9', '#5FAFD9'),    // 晴空蓝
  accent: duo('#8F1D3E', '#C75B76'),
};
const NEON_ROLES: Partial<Record<Role, Duo>> = {
  primary: duo('#00D5E6'), // 青
  success: duo('#8FE829'), // 酸柠
  warning: duo('#EFA500'), // 琥珀
  danger: duo('#FF2E88'),  // 品红
  info: duo('#9B5CFF'),    // 紫
  accent: duo('#00D5E6'),
};

MACARON.roles = MACARON_ROLES;
WABI_SABI.roles = WABI_ROLES;
PRIMER.roles = PRIMER_ROLES;
MORANDI.roles = MORANDI_ROLES;
NORDIC.roles = NORDIC_ROLES;
SALMON.roles = SALMON_ROLES;
NEON.roles = NEON_ROLES;
