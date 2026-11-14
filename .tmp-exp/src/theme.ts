// 公共字体与画布。字体栈 = 系统原生清晰字体(2026-11-03 决定:不再内嵌
// Inter 子集 DrawInter——中文等子集外字符回退导致混排观感差,统一系统栈)。
// CJK 顺序注意: 汉字统一码下静态栈只能给一族字形(此处简中优先,与既有行为一致);
// 日文假名/谚文由后续 JP/KR 族接住。按文字运行选栈(检测假名/谚文切日/韩栈)见 issue #2。
export const FONT =
  "ui-sans-serif,-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei','Hiragino Sans','Yu Gothic','Meiryo','Noto Sans JP','Apple SD Gothic Neo','Malgun Gothic','Noto Sans KR',sans-serif";

export const TAB = 'font-variant-numeric:tabular-nums';

// 卡片:canvas='card' 时白底 1px 边框 12px 圆角;plain(规范约定)透明由页面承接
export function card(w: number, h: number, plain = false): string {
  if (plain) return '';
  return `<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="12" fill="var(--d-card)" stroke="var(--d-border)"/>`;
}
