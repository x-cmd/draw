import { describe, expect, it } from 'vitest';
import { renderFromUrl } from '../src/render/query.js';
import { renderArchFromUrl } from '../src/render/arch.js';
import { resolveSkin } from '../src/styles/index.js';

// 三张跨图种皮肤:macaron(马卡龙粉彩)/ wabi-sabi(侘寂土色)/ primer(GitHub 原生)。
// 规格:x-cmd-hub/draw#133 —— 验收六条:
//   1. 明暗 neutrals 正确翻转(macaron 暖卡→深暖梅、wabi 石灰墙→暖炭、primer GitHub token)
//   2. primer 柱色单色非渐变(ramp 钉死)
//   3. 12 类 pie 无全局 Tailwind 亮色混入(家族溢出档生效)
//   4. 400 家族清单按图种过滤;他图种家族仍静默回退
//   5. colors= 传 hex 压过 t=(向后兼容基线)
//   6. 4 图种 × 3 家族 × 2 明暗全渲染
const FAMILIES = ['macaron', 'wabi-sabi', 'primer'] as const;
const KINDS = ['pie', 'bar', 'hbar', 'line'] as const;

// 家族标志性中性色(card):light/dark 各一个 —— 翻转是否发生以它为准
const CARDS: Record<string, [string, string]> = {
  macaron: ['#FFFDFB', '#2B2227'],
  'wabi-sabi': ['#E8E0D5', '#262019'],
  primer: ['#FFFFFF', '#0D1117'],
};

const render = (q: string): string => renderFromUrl(new URL(`https://x-cmd.com/draw?${q}`)).svg;
const DATA = 'labels=A,B,C&values=30,20,10';

describe('cross-chart skins: macaron / wabi-sabi / primer (#133)', () => {
  // 验收 6:4 图种 × 3 家族 × 2 明暗全渲染,且 neutrals 随明暗翻转(验收 1)
  for (const kind of KINDS) {
    for (const family of FAMILIES) {
      for (const scheme of ['light', 'dark'] as const) {
        it(`${kind} · ${family} · ${scheme}`, () => {
          const svg = render(`type=${kind}&t=${family}&scheme=${scheme}&${DATA}`);
          expect(svg).toContain('<svg');
          const [light, dark] = CARDS[family];
          const want = scheme === 'light' ? light : dark;
          expect(svg).toContain(`--d-card:${want}`);
          expect(svg).not.toContain(`--d-card:${scheme === 'light' ? dark : light}`);
        });
      }
    }
  }

  it('primer 单系列柱是纯蓝,不是蓝→绿渐变(ramp 钉死)', () => {
    const svg = render(`type=bar&t=primer&${DATA}`);
    expect(svg).toContain('--d-ramp-a:#0969DA');
    expect(svg).toContain('--d-ramp-b:#0969DA');
  });

  it('12 类 pie 用家族溢出档,全局 Tailwind 亮色不混入', () => {
    const labels = Array.from({ length: 12 }, (_, i) => `c${i}`).join(',');
    const values = labels.split(',').map((_, i) => i + 1).join(',');
    const tailwind = ['#F59E0B', '#FBBF24', '#0EA5E9', '#38BDF8', '#8B5CF6', '#A78BFA', '#EC4899', '#F472B6'];
    for (const family of FAMILIES) {
      const svg = render(`type=pie&t=${family}&labels=${labels}&values=${values}`);
      for (const hex of tailwind) expect(svg).not.toContain(hex);
      expect(svg).toMatch(/--d-s10:/); // 家族档补到 10 色
    }
  });

  it('400 清单只列本图种的家族', () => {
    // hbar 没有 fund(那是 sankey 的);清单里不许出现
    expect(() => resolveSkin('hbar', 'zzz', 'auto')).toThrow(/must be one of: base, opendata, xcmd/);
    try {
      resolveSkin('hbar', 'zzz', 'auto');
    } catch (e) {
      expect((e as Error).message).not.toContain('fund');
    }
  });

  it('他图种的家族照旧静默回退(契约不变)', () => {
    const skin = resolveSkin('hbar', 'fund', 'auto'); // fund 只挂在 sankey 上
    expect(skin.rules.hbarMode).toBe('plain'); // 回退到 base 的缺省
  });

  it('colors= 传 hex 压过 t=(逃生舱行为不变)', () => {
    const svg = render(`type=pie&t=macaron&labels=A,B,C&values=1,2,3&colors=%23FF0000,%2300FF00,%230000FF`);
    // hex 规范化为小写;三个扇区就是三原色,macaron 色板不出现
    expect(svg).toContain('fill="#ff0000"');
    expect(svg).toContain('fill="#00ff00"');
    expect(svg).toContain('fill="#0000ff"');
    expect(svg).not.toContain('fill="#F8C8DC');
  });

  it('macaron 粉彩上的柱内数值是墨字不是白字(1.4:1 读不了)', () => {
    // 长条放得下 → 数值落在条内;字色取 on-s1(粉彩 → 墨)
    const svg = render(`type=hbar&t=macaron&labels=A&values=9000`);
    expect(svg).toContain('--d-on-s1:#18181b');
  });

  it('架构图换肤:macaron/wabi 带卡,primer 透明融入页面', () => {
    const q = 'n=api;be;API Gateway;auth;r0c0&n=db;db;Postgres;;r1c0&e=api;db;sql';
    const carded = (t: string) =>
      /rx="12" fill="var\(--d-card\)"/.test(renderArchFromUrl(new URL(`https://x-cmd.com/draw/arch2?t=${t}&${q}`)).svg);
    expect(carded('macaron')).toBe(true);
    expect(carded('wabi-sabi')).toBe(true);
    expect(carded('primer')).toBe(false); // 透明是 primer 的语义
    // 不带 t= 的默认架构图不受影响(无卡)
    expect(renderArchFromUrl(new URL(`https://x-cmd.com/draw/arch2?${q}`)).svg).not.toMatch(/rx="12" fill="var\(--d-card\)"/);
  });
});
