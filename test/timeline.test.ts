import { describe, it, expect } from 'vitest';
import { translateTimeline } from '../src/render/mermaid/timeline.js';
import { renderTimelineFromUrl, timelineSpecFromParams, parseTimelineSpec } from '../src/render/timeline.js';
import { ApiError } from '../src/specs/index.js';

const SRC = `timeline
    title History of Social Media Platform
    section 2002
        LinkedIn : Founded
        Facebook : Founded
    section 2004
        Google : Acquired YouTube
        Facebook : Launched`;

/** 参数字典:同名参数收成数组 */
const byName = (params: [string, string][]): Record<string, string[]> => {
  const out: Record<string, string[]> = {};
  for (const [k, v] of params) (out[k] ??= []).push(v);
  return out;
};

const TL_URL = 'https://draw.test/draw/timeline?title=History&section=2002&event=2002|LinkedIn|Founded&event=2002|Facebook|Founded&section=2004&event=2004|Google|Acquired YouTube&event=2004|Facebook|Launched';

describe('mermaid timeline → draw timeline', () => {
  it('图种与参数形状', () => {
    const plan = translateTimeline(SRC);
    expect(plan.kind).toBe('timeline');
    const p = byName(plan.params);
    expect(p.title).toEqual(['History of Social Media Platform']);
    expect(p.section).toEqual(['2002', '2004']);
    expect(p.event).toEqual([
      '2002|LinkedIn|Founded',
      '2002|Facebook|Founded',
      '2004|Google|Acquired YouTube',
      '2004|Facebook|Launched',
    ]);
  });

  it('容忍 %% 注释', () => {
    const plan = translateTimeline(`%%{init: {"theme":"dark"}}%%\ntimeline\n%% 一段注释\n  section A\n    X : Y`);
    expect(plan.kind).toBe('timeline');
    expect(byName(plan.params).event).toEqual(['A|X|Y']);
  });

  it('没有事件 → 报错', () => {
    expect(() => translateTimeline('timeline\n  section A')).toThrow(ApiError);
    expect(() => translateTimeline('timeline\n  section A')).toThrow(/at least one event/);
  });
});

describe('timeline rendering', () => {
  it('端到端:标题、段名、事件名都在图上', () => {
    const { svg } = renderTimelineFromUrl(new URL(TL_URL));
    expect(svg).toContain('>History<');
    expect(svg).toContain('>2002<');
    expect(svg).toContain('>2004<');
    expect(svg).toContain('>LinkedIn<');
    expect(svg).toContain('>Acquired YouTube<');
    expect(svg).toContain('Founded');
  });

  it('元数据岛带结构化数据', () => {
    const { svg } = renderTimelineFromUrl(new URL(TL_URL), true);
    expect(svg).toContain('<metadata id="tevents">');
    expect(svg).toContain('data-tip=');
  });

  it('皮肤家族换色(与默认不同)', () => {
    const def = renderTimelineFromUrl(new URL(TL_URL)).svg;
    const mac = renderTimelineFromUrl(new URL(TL_URL + '&t=macaron')).svg;
    expect(mac).not.toBe(def);
    expect(mac).toContain('--d-s1:');
    // macaron 的珊瑚色应当出现在色板里
    expect(mac).toMatch(/--d-s1:#D83B30/i);
  });

  it('明暗两套变量都在(auto)', () => {
    const { svg } = renderTimelineFromUrl(new URL(TL_URL));
    expect(svg).toContain('prefers-color-scheme: dark');
  });
});

describe('timeline param validation', () => {
  const cases: [string, string][] = [
    ['', 'at least one "section="'],
    ['section=2002', 'at least one "event="'],
    ['section=2002&event=2003|Founded', 'unknown section'],
    ['section=2002&event=2002', 'must be "section|event'],
  ];
  for (const [query, needle] of cases) {
    it(`拒绝 ?${query} (${needle})`, () => {
      try {
        renderTimelineFromUrl(new URL(`https://draw.test/draw/timeline?${query}`));
        expect.unreachable('should have thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        expect((err as ApiError).message).toContain(needle);
      }
    });
  }
});

describe('timeline spec helpers', () => {
  it('params → spec', () => {
    const spec = timelineSpecFromParams(new URLSearchParams('section=2002&event=2002|LinkedIn|Founded'));
    expect(spec.sections).toHaveLength(1);
    expect(spec.sections[0].events[0]).toEqual({ name: 'LinkedIn', period: 'Founded' });
  });

  it('JSON → spec', () => {
    const spec = parseTimelineSpec(JSON.stringify({
      title: 'T',
      sections: [{ name: 'A', events: [{ name: 'x', period: 'p' }] }],
    }));
    expect(spec.title).toBe('T');
    expect(spec.sections[0].events[0].period).toBe('p');
  });

  it('空 JSON / 坏 JSON → 报错', () => {
    expect(() => parseTimelineSpec('')).toThrow(ApiError);
    expect(() => parseTimelineSpec('{')).toThrow(ApiError);
  });
});
