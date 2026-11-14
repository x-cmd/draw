// 组图标:「公司/机构」的通用字形 —— 自绘,不对应任何一家公司。
//
// 为什么自绘:公开层要画它。`org:` 前缀的图标在内部图库里(私有仓),公开请求查不到,
// 于是画这个。**公开层的输出里一个第三方商标图形都不能有** —— 所以它是我们自己的美术,
// 不是任何品牌的 logo,也不进任何"图标素材库"。
//
// 画法:24×24 的**平顶办公楼**剪影(墙体 + 四扇窗 + 门廊缺口)。平顶才像"机构/公司",
// 坡屋顶会读成"房子" —— 在域名后缀的图里恰恰是最不该出现的联想。
// 单色填充,颜色跟节点的语义色走(var(--d-sN);中性类型则是 var(--d-muted)),
// 明暗两套皮肤都合适,也跟图里的类型配色一致 —— 它看着像个正经元素,不像"图片挂了"。
//
// 授权层(登录后)命中内部图库时,由调用方把节点换成真 logo;组图标只在没有真 logo 时出现。
import { r2 } from './svg.js';

/**
 * 机构剪影的路径(24×24 网格)。
 * 墙体带门廊缺口;四扇窗是 evenodd 的洞。
 */
export const GROUP_ICON_D =
  'M5 4h14v18h-5v-5h-4v5H5V4Z' +
  'M7.5 7h3v2.5h-3ZM13.5 7h3v2.5h-3Z' +
  'M7.5 11.5h3v2.5h-3ZM13.5 11.5h3v2.5h-3Z';

/** 视图框边长(路径按这个网格画)。 */
export const GROUP_ICON_VIEW = 24;

/**
 * 画组图标:在 (x, y) 处画一个 size×size 的方框。
 * @param fill 填充色(通常是节点的语义色)
 */
export function groupIcon(x: number, y: number, size: number, fill: string): string {
  const s = size / GROUP_ICON_VIEW;
  return `<g transform="translate(${r2(x)} ${r2(y)}) scale(${r2(s)})">` +
    `<path d="${GROUP_ICON_D}" fill="${fill}" fill-rule="evenodd"/></g>`;
}
