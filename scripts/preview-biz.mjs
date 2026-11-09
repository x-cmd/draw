// 预览:把商业例子渲染成 PNG,肉眼验收用。
// 用法: node scripts/preview-biz.mjs
import { draw, svgToPng } from '../src/lib.ts';
import { writeFileSync } from 'node:fs';

const CASES = {
  bcg: {
    type: 'quadrant', title: 'BCG 增长-份额矩阵',
    quadrants: '问题业务,明星业务,瘦狗业务,现金牛',
    quaddescs: '高增长 · 低份额 —— 要么投钱翻盘,要么及时止损;高增长 · 高份额 —— 加投资源守住份额;低增长 · 低份额 —— 收缩或剥离,别再投钱;低增长 · 高份额 —— 收割现金,反哺主业',
    xlabel: '相对市场份额', ylabel: '市场增长率', xlow: '低', xhigh: '高', ylow: '低', yhigh: '高',
  },
  eisenhower: {
    type: 'quadrant', title: '艾森豪威尔 重要-紧急矩阵',
    quadrants: '立即处理,重点投入,委托他人,计划安排',
    quaddescs: '重要不紧急 —— 排进日程,固定时间做;重要且紧急 —— 马上做,给足资源;紧急不重要 —— 授权下属,或批成流程;都不紧急 —— 少做,定期回顾',
    xlabel: '重要程度', ylabel: '紧急程度', xlow: '低', xhigh: '高', ylow: '低', yhigh: '高',
  },
  priority: {
    type: 'quadrant', frame: 'cross', title: '战略举措优先级',
    ylabel: '战略价值', xlabel: '投入成本', ylow: '低', yhigh: '高', xlow: '低', xhigh: '高',
    items: '平台重构@0.22,0.86;AI 客服@0.42,0.62;渠道合作@0.72,0.44;品牌投放@0.84,0.26',
  },
  options: {
    type: 'compass', title: '业务单元的四个选项', center: '核心业务',
    up: '加大投入:抢份额', right: '维持现状:守现金流', down: '收缩规模:降成本', left: '退出市场:腾资源',
  },
};

for (const [name, opt] of Object.entries(CASES)) {
  const q = new URLSearchParams(opt).toString();
  const { svg } = draw(q);
  writeFileSync(`/tmp/biz-${name}.svg`, svg);
  writeFileSync(`/tmp/biz-${name}.png`, await svgToPng(svg, 'light'));
  console.log(`/tmp/biz-${name}.png`);
}
