import { describe, expect, it } from 'vitest';
import { renderFromUrl } from '../src/render/query.js';
import { renderArchFromUrl } from '../src/render/arch.js';
import { resolveSkin } from '../src/styles/index.js';

// 跨图种皮肤:macaron / wabi-sabi / primer / morandi / nordic / salmon / neon。
// 规格:x-cmd-hub/draw#133 —— 验收六条:
//   1. 明暗 neutrals 正确翻转(各家族卡底见 CARDS)
//   2. primer 柱色单色非渐变(ramp 钉死)
//   3. 12 类 pie 无全局 Tailwind 亮色混入(家族溢出档生效)
//   4. 400 家族清单按图种过滤;他图种家族仍静默回退
//   5. colors= 传 hex 压过 t=(向后兼容基线)
//   6. 4 图种 × 7 家族 × 2 明暗全渲染
const FAMILIES = ['macaron', 'wabi-sabi', 'primer', 'morandi', 'nordic', 'salmon', 'neon'] as const;
const KINDS = ['pie', 'bar', 'hbar', 'line'] as const;

// 家族标志性中性色(card):light/dark 各一个 —— 翻转是否发生以它为准
const CARDS: Record<string, [string, string]> = {
  macaron: ['#FAF3EA', '#33262D'],
  'wabi-sabi': ['#E8E0D5', '#2B241C'],
  primer: ['#FFFFFF', '#0D1117'],
  morandi: ['#F5F2ED', '#2A2724'],
  nordic: ['#F7F9FA', '#1F2A33'],
  salmon: ['#FBEFE3', '#2A211B'],
  neon: ['#FFFFFF', '#0A0C12'],
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

  it('macaron 系列带明度阶梯(同明度粉彩两两 1.04 分不开,color 仓文档算死)', () => {
    const svg = render(`type=pie&t=macaron&labels=A,B,C,D,E,F,G&values=1,2,3,4,5,6,7`);
    // 阶梯首档(珊瑚深)与次档(薄荷)不再是近白粉彩
    expect(svg).toContain('--d-s1:#D83B30');
    expect(svg).toContain('--d-s2:#34B373');
  });

  it('macaron 柱内数值的字色跟着系列明度走(深档白字、浅档墨字)', () => {
    // 阶梯首档珊瑚深 → 白字;末档天空浅 → 墨字(onVar 按系列取,1.4:1 的白字不复存在)
    const svg = render(`type=hbar&t=macaron&labels=A,B,C,D,E,F,G&values=90000,80000,70000,60000,50000,40000,30000`);
    expect(svg).toContain('--d-on-s1:#ffffff');
    expect(svg).toContain('--d-on-s7:#18181b');
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

// 语义槽位(colors= 的语义层):槽位名按当前 t= 解析,hex 逃生舱逐字节不变
describe('semantic slots: colors= 槽位 + highlight=(#133 二期)', () => {
  it('pie 槽位解析成角色变量,具体色跟着家族走(换皮不改义)', () => {
    const p = render(`type=pie&t=primer&labels=Stable,Beta,EOL&values=80,15,5&colors=success,info,danger`);
    expect(p).toContain('--d-danger:#CF222E');
    expect(p).toContain('fill="var(--d-danger)"');
    const m = render(`type=pie&t=macaron&labels=Stable,Beta,EOL&values=80,15,5&colors=success,info,danger`);
    expect(m).toContain('--d-danger:#D83B30'); // 同一 danger,另一身衣服
  });

  it('多系列图 colors= 按列平行(bar/line 的每列取色)', () => {
    const b = render(`type=bar&t=neon&labels=Q1,Q2&series=up:5,6&series=down:2,1&colors=success,danger`);
    expect(b).toContain('var(--d-success)');
    expect(b).toContain('var(--d-danger)');
  });

  it('s 槽 = 家族色板第 N 色(位置槽,不退出主题)', () => {
    const s = render(`type=pie&t=nordic&labels=A,B,C&values=1,2,3&colors=s3,s1,s2`);
    expect(s).toContain('fill="var(--d-s3)"');
    expect(s).toContain('fill="var(--d-s1)"');
  });

  it('highlight= 点名保色,其余落家族灰阶(不是全局灰)', () => {
    const s = render(`type=hbar&t=macaron&labels=A,B,C&values=30,20,10&highlight=C`);
    expect(s).toMatch(/fill="var\(--d-(muted|faint|border)\)"/); // 未点名的灰
    expect(s).toContain('fill="url(#dg-bar)"'); // 点名的保持家族渐变
  });

  it('未配角色的家族用槽位名 → 400 教正确写法(不静默)', () => {
    expect(() => render(`type=pie&t=evil&labels=A,B&values=1,2&colors=danger,info`)).toThrow(/has no semantic roles/);
  });

  it('hex 逃生舱逐字节不变(colors= 仍收 hex,行为与旧版一致)', () => {
    const s = render(`type=pie&t=macaron&labels=A,B,C&values=1,2,3&colors=%23FF0000,%2300FF00,%230000FF`);
    expect(s).toContain('fill="#ff0000"');
    expect(s).not.toContain('var(--d-danger)');
  });
});
