// 公共字体与画布。字体栈与设计规范一致(Inter 系统栈;CJK 回退)。
// DrawInter = 每张 SVG 内嵌的 Inter 图表子集(same 源于 styles/inter.ts),
// 拉丁/数字/符号用它(跨平台像素一致),子集外字符(中文等)沿栈回退系统字体。
export const FONT =
  "'DrawInter',Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif";

export const TAB = 'font-variant-numeric:tabular-nums';

// 卡片:canvas='card' 时白底 1px 边框 12px 圆角;plain(规范约定)透明由页面承接
export function card(w: number, h: number, plain = false): string {
  if (plain) return '';
  return `<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="12" fill="var(--d-card)" stroke="var(--d-border)"/>`;
}
