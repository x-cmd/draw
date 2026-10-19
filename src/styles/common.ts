// 设计规范色板(单一真相源)——数据逐字来自设计同事的规范页 index.html PALETTES。
// 后续规范页更新时,只需同步本文件。颜色命名保持与规范一致(只表达颜色,不带数据语义)。

export interface Swatch {
  name: string;
  value: string;
  role: string;
}

export const SWATCHES: Record<string, Swatch[]> = {
  shadcn: [
    { name: 'blue1', value: '#8EC6FF', role: '浅色 / 辅助系列' },
    { name: 'blue2', value: '#579DFF', role: '次要系列' },
    { name: 'blue3', value: '#2F7DF6', role: '主系列' },
    { name: 'blue4', value: '#1859D1', role: '强调系列' },
    { name: 'blue5', value: '#0E3994', role: '深色 / 对比系列' },
  ],
  evil: [
    { name: 'green-deep', value: '#047857', role: '深绿色' },
    { name: 'green', value: '#10B981', role: '绿色' },
    { name: 'red-deep', value: '#BE123C', role: '深红色' },
    { name: 'red', value: '#F43F5E', role: '红色' },
  ],
  evilGlow: [
    { name: 'orange-deep', value: '#F97316', role: '深橙色' },
    { name: 'pink-deep', value: '#EC4899', role: '深粉色' },
    { name: 'cyan-deep', value: '#0891B2', role: '深青色' },
    { name: 'violet-deep', value: '#7C3AED', role: '深紫色' },
    { name: 'orange', value: '#FB923C', role: '橙色' },
    { name: 'pink', value: '#F472B6', role: '粉色' },
    { name: 'cyan', value: '#22D3EE', role: '青色' },
    { name: 'violet', value: '#A78BFA', role: '紫色' },
  ],
  evilMono: [
    { name: 'black', value: '#171717', role: '黑色' },
    { name: 'gray-light', value: '#D4D4D4', role: '浅灰色' },
    { name: 'white', value: '#FAFAFA', role: '白色' },
    { name: 'gray-deep', value: '#525252', role: '深灰色' },
  ],
  star: [
    { name: 'orange-red', value: '#DD4528', role: '橙红色' },
    { name: 'canvas', value: '#FFFFFF', role: '白色' },
    { name: 'canvas-dark', value: '#0E0F11', role: '深黑色' },
    { name: 'grid-dark', value: '#30363D', role: '深灰色' },
  ],
  openArea: [
    { name: 'cyan', value: '#1E8EB7', role: '青色' },
    { name: 'cyan-deep', value: '#156582', role: '深青色' },
    { name: 'slate', value: '#94A3B8', role: '灰蓝色' },
    { name: 'red', value: '#DC2626', role: '红色' },
  ],
  openLine: [
    { name: 'blue', value: '#1B7FA3', role: '蓝色' },
    { name: 'red', value: '#C44E52', role: '红色' },
    { name: 'red-deep', value: '#A03539', role: '深红色' },
    { name: 'slate', value: '#6F83A0', role: '灰蓝色' },
  ],
  openPie: [
    { name: 'cyan-soft', value: '#72CEDC', role: '浅青色' },
    { name: 'peach', value: '#F3C898', role: '桃色' },
    { name: 'blue-soft', value: '#7698D6', role: '浅蓝色' },
    { name: 'rose-soft', value: '#D281A8', role: '浅玫红' },
    { name: 'green-soft', value: '#82BA95', role: '浅绿色' },
  ],
  evilPie: [
    { name: 'blue-deep', value: '#3B82F6', role: '深蓝色' },
    { name: 'blue', value: '#60A5FA', role: '蓝色' },
    { name: 'green-deep', value: '#10B981', role: '深绿色' },
    { name: 'green', value: '#34D399', role: '绿色' },
    { name: 'yellow-deep', value: '#F59E0B', role: '深黄色' },
    { name: 'yellow', value: '#FBBF24', role: '黄色' },
    { name: 'purple-deep', value: '#8B5CF6', role: '深紫色' },
    { name: 'purple', value: '#A78BFA', role: '紫色' },
    { name: 'gray-deep', value: '#6B7280', role: '深灰色' },
    { name: 'gray', value: '#9CA3AF', role: '灰色' },
  ],
  marketMono: [
    { name: 'black', value: '#0A0A0A', role: '黑色' },
    { name: 'gray-1', value: '#262626', role: '深灰色' },
    { name: 'gray-2', value: '#3D3D3D', role: '灰色' },
    { name: 'gray-3', value: '#545454', role: '中灰色' },
    { name: 'gray-4', value: '#6B6B6B', role: '浅灰色' },
    { name: 'gray-5', value: '#7D7D7D', role: '亮灰色' },
    { name: 'white', value: '#FFFFFF', role: '白色' },
    { name: 'silver', value: '#DEDEDE', role: '银色' },
  ],
  progress: [
    { name: 'pink', value: '#E43861', role: '粉红色' },
    { name: 'track-light', value: '#D4D4D4', role: '浅灰色' },
    { name: 'track-dark', value: '#3F3F3F', role: '深灰色' },
  ],
  reliability: [
    { name: 'red-deep', value: '#E11D48', role: '深红色' },
    { name: 'red', value: '#FB7185', role: '红色' },
    { name: 'yellow-deep', value: '#F59E0B', role: '深黄色' },
    { name: 'yellow', value: '#FBBF24', role: '深黄色' },
    { name: 'lime-deep', value: '#84CC16', role: '深青柠色' },
    { name: 'lime', value: '#A3E635', role: '青柠色' },
    { name: 'green-deep', value: '#059669', role: '深绿色' },
    { name: 'green', value: '#34D399', role: '绿色' },
  ],
  revenue: [
    { name: 'purple', value: '#7C3AED', role: '紫色' },
    { name: 'violet', value: '#A855F7', role: '紫罗兰色' },
    { name: 'indigo', value: '#4F46E5', role: '靛蓝色' },
    { name: 'blue', value: '#6366F1', role: '蓝色' },
    { name: 'cyan-deep', value: '#0284C7', role: '深青色' },
    { name: 'cyan', value: '#0EA5E9', role: '青色' },
    { name: 'green-deep', value: '#059669', role: '深绿色' },
    { name: 'green', value: '#10B981', role: '绿色' },
  ],
  barEvil: [
    { name: 'green-deep', value: '#059669', role: '深绿色' },
    { name: 'green', value: '#10B981', role: '绿色' },
    { name: 'red-deep', value: '#E11D48', role: '深红色' },
    { name: 'red', value: '#F43F5E', role: '红色' },
    { name: 'gray-light', value: '#E4E4E7', role: '浅灰色' },
    { name: 'gray-deep', value: '#27272A', role: '深灰色' },
  ],
  gridMono: [
    { name: 'black', value: '#18181B', role: '黑色' },
    { name: 'white', value: '#FAFAFA', role: '白色' },
    { name: 'gray-light', value: '#E4E4E7', role: '浅灰色' },
    { name: 'gray-deep', value: '#29292B', role: '深灰色' },
  ],
  openHbar: [
    { name: 'slate', value: '#94A3B8', role: '石板灰' },
    { name: 'green', value: '#6A9F58', role: '绿色' },
    { name: 'red', value: '#C44E52', role: '红色' },
    { name: 'orange', value: '#D47215', role: '橙色' },
    { name: 'teal', value: '#1B7FA3', role: '青色' },
    { name: 'blue', value: '#5B6ABF', role: '蓝色' },
    { name: 'purple', value: '#7C3AED', role: '紫色' },
  ],
  xcmd: [
    { name: 'blue', value: '#7DB7F7', role: '浅蓝色' },
    { name: 'cyan', value: '#35D0BE', role: '青绿色' },
    { name: 'track-light', value: '#D8E2E1', role: '浅轨道色' },
    { name: 'track', value: '#1D2929', role: '暗轨道色' },
  ],
  scoreHbar: [
    { name: 'black', value: '#27272A', role: '黑色' },
    { name: 'blue', value: '#4F6BED', role: '蓝色' },
    { name: 'cyan-blue', value: '#1473E6', role: '青蓝色' },
    { name: 'orange', value: '#C96F4B', role: '橙色' },
    { name: 'purple', value: '#9254D1', role: '紫色' },
    { name: 'green', value: '#22884F', role: '绿色' },
  ],
  radarEvil: [
    { name: 'blue-deep', value: '#3B82F6', role: '深蓝色' },
    { name: 'blue', value: '#60A5FA', role: '蓝色' },
    { name: 'green-deep', value: '#10B981', role: '深绿色' },
    { name: 'green', value: '#34D399', role: '绿色' },
    { name: 'gray-light', value: '#E4E4E7', role: '浅灰色' },
    { name: 'gray-deep', value: '#27272A', role: '深灰色' },
  ],
  xcmdRadar: [
    { name: 'orange-light', value: '#B56A1C', role: '深橙色' },
    { name: 'orange', value: '#F4B84E', role: '橙色' },
    { name: 'grid-light', value: '#D5CDBD', role: '浅网格色' },
    { name: 'grid-dark', value: '#202729', role: '暗网格色' },
    { name: 'label-light', value: '#6A6454', role: '浅标签色' },
    { name: 'label-dark', value: '#8E9293', role: '暗标签色' },
  ],
  gauge: [
    { name: 'blue', value: '#60A5FA', role: '浅蓝色' },
    { name: 'green', value: '#34D399', role: '绿色' },
    { name: 'yellow', value: '#FBBF24', role: '黄色' },
    { name: 'purple', value: '#A78BFA', role: '紫色' },
    { name: 'gray', value: '#9CA3AF', role: '灰色' },
    { name: 'track-light', value: '#E4E4E7', role: '浅轨道色' },
    { name: 'track', value: '#252525', role: '暗轨道色' },
  ],
  gaugeGradient: [
    { name: 'mint', value: '#2DD4BF', role: '薄荷色' },
    { name: 'green', value: '#22C55E', role: '绿色' },
    { name: 'yellow', value: '#FBBF24', role: '黄色' },
    { name: 'orange', value: '#F97316', role: '橙色' },
    { name: 'cyan', value: '#38BDF8', role: '青色' },
    { name: 'indigo', value: '#6366F1', role: '靛蓝色' },
    { name: 'violet', value: '#C084FC', role: '紫罗兰色' },
    { name: 'pink', value: '#F9A8D4', role: '粉色' },
    { name: 'peach', value: '#FB923C', role: '橙红色' },
    { name: 'lemon', value: '#FEF08A', role: '柠檬色' },
    { name: 'sky', value: '#7DD3FC', role: '天蓝色' },
    { name: 'track-light', value: '#E4E4E7', role: '浅轨道色' },
    { name: 'track', value: '#252525', role: '暗轨道色' },
  ],
  comboEvil: [
    { name: 'purple-deep', value: '#6D5ACD', role: '深紫色' },
    { name: 'purple', value: '#8B7AE6', role: '紫色' },
    { name: 'green-deep', value: '#10B981', role: '深绿色' },
    { name: 'green', value: '#34D399', role: '绿色' },
  ],
  scatterBlue: [
    { name: 'blue-light', value: '#8EC6FF', role: '浅蓝色' },
    { name: 'blue', value: '#2F7DF6', role: '蓝色' },
    { name: 'grid-light', value: '#E4E4E7', role: '浅网格色' },
    { name: 'grid-dark', value: '#27272A', role: '暗网格色' },
  ],
  qrBlue: [
    { name: 'blue-light', value: '#579DFF', role: '浅蓝色' },
    { name: 'blue', value: '#1859D1', role: '蓝色' },
    { name: 'canvas-light', value: '#FFFFFF', role: '浅色画布' },
    { name: 'canvas-dark', value: '#0E0F11', role: '暗色画布' },
  ],
  sankey: [
    { name: 'green', value: '#34D399', role: '绿色' },
    { name: 'red', value: '#F87171', role: '红色' },
    { name: 'purple', value: '#A78BFA', role: '紫色' },
    { name: 'cyan', value: '#22D3EE', role: '青色' },
    { name: 'blue', value: '#60A5FA', role: '蓝色' },
    { name: 'orange', value: '#FB923C', role: '橙色' },
    { name: 'lime', value: '#4ADE80', role: '青柠色' },
    { name: 'rose', value: '#FB7185', role: '玫瑰红' },
  ],
  sankeyGradient: [
    { name: 'teal', value: '#2DD4BF', role: '青绿色' },
    { name: 'yellow', value: '#FBBF24', role: '黄色' },
    { name: 'orange', value: '#FB923C', role: '橙色' },
    { name: 'amber', value: '#F59E0B', role: '琥珀色' },
    { name: 'purple', value: '#A78BFA', role: '紫色' },
    { name: 'violet', value: '#8B5CF6', role: '紫罗兰色' },
    { name: 'indigo', value: '#818CF8', role: '靛蓝色' },
  ],
  sankeyPipeline: [
    { name: 'blue', value: '#60A5FA', role: '蓝色' },
    { name: 'blue-deep', value: '#3B82F6', role: '深蓝色' },
    { name: 'indigo', value: '#818CF8', role: '靛蓝色' },
    { name: 'indigo-deep', value: '#6366F1', role: '深靛蓝色' },
    { name: 'purple', value: '#8B5CF6', role: '紫罗兰色' },
    { name: 'rose', value: '#F43F5E', role: '玫瑰红' },
    { name: 'red', value: '#EF4444', role: '红色' },
    { name: 'pink', value: '#FB7185', role: '粉色' },
    { name: 'orange', value: '#FB923C', role: '橙色' },
  ],
};

const byName = (group: string): Record<string, string> =>
  Object.fromEntries(SWATCHES[group].map((s) => [s.name, s.value]));

export const C_shadcn = byName('shadcn');
export const C_evil = byName('evil');
export const C_evilGlow = byName('evilGlow');
export const C_evilMono = byName('evilMono');
export const C_star = byName('star');
export const C_openArea = byName('openArea');
export const C_openLine = byName('openLine');
export const C_openPie = byName('openPie');
export const C_evilPie = byName('evilPie');
export const C_marketMono = byName('marketMono');
export const C_progress = byName('progress');
export const C_reliability = byName('reliability');
export const C_revenue = byName('revenue');
export const C_barEvil = byName('barEvil');
export const C_gridMono = byName('gridMono');
export const C_openHbar = byName('openHbar');
export const C_xcmd = byName('xcmd');
export const C_scoreHbar = byName('scoreHbar');
export const C_radarEvil = byName('radarEvil');
export const C_xcmdRadar = byName('xcmdRadar');
export const C_gauge = byName('gauge');
export const C_gaugeGradient = byName('gaugeGradient');
export const C_comboEvil = byName('comboEvil');
export const C_scatterBlue = byName('scatterBlue');
export const C_qrBlue = byName('qrBlue');
export const C_sankey = byName('sankey');
export const C_sankeyGradient = byName('sankeyGradient');
export const C_sankeyPipeline = byName('sankeyPipeline');
