import { describe, it, expect } from 'vitest';
import { translateJourney } from '../src/render/mermaid/journey.js';
import { renderJourneyFromUrl, journeySpecFromParams, parseJourneySpec } from '../src/render/journey.js';
import { ApiError } from '../src/specs/index.js';

const SRC = `journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat`;

/** 参数字典:同名参数收成数组 */
const byName = (params: [string, string][]): Record<string, string[]> => {
  const out: Record<string, string[]> = {};
  for (const [k, v] of params) (out[k] ??= []).push(v);
  return out;
};

const JR_URL = 'https://draw.test/draw/journey?title=My%20working%20day&section=Go%20to%20work&task=Go%20to%20work|Make%20tea|5|Me&task=Go%20to%20work|Go%20upstairs|3|Me&task=Go%20to%20work|Do%20work|1|Me,Cat';

describe('mermaid journey → draw journey', () => {
  it('图种与参数形状', () => {
    const plan = translateJourney(SRC);
    expect(plan.kind).toBe('journey');
    const p = byName(plan.params);
    expect(p.title).toEqual(['My working day']);
    expect(p.section).toEqual(['Go to work']);
    expect(p.task).toEqual([
      'Go to work|Make tea|5|Me',
      'Go to work|Go upstairs|3|Me',
      'Go to work|Do work|1|Me,Cat',
    ]);
  });

  it('容忍 %% 注释', () => {
    const plan = translateJourney('%%{init: {"theme":"dark"}}%%\njourney\n%% 注释\n  section A\n    X: 4: Bob');
    expect(plan.kind).toBe('journey');
    expect(byName(plan.params).task).toEqual(['A|X|4|Bob']);
  });

  it('没有任务 → 报错', () => {
    expect(() => translateJourney('journey\n  section A')).toThrow(ApiError);
    expect(() => translateJourney('journey\n  section A')).toThrow(/at least one task/);
  });

  it('分数不是 1–5 → 报错', () => {
    expect(() => translateJourney('journey\n  section A\n    X: 9: Me')).toThrow(/score must be an integer 1-5/);
    expect(() => translateJourney('journey\n  section A\n    X: abc: Me')).toThrow(/score must be an integer 1-5/);
  });
});

describe('journey rendering', () => {
  it('端到端:标题、段名、任务名、参与者都在图上', () => {
    const { svg } = renderJourneyFromUrl(new URL(JR_URL));
    expect(svg).toContain('>My working day<');
    expect(svg).toContain('>Go to work<');
    expect(svg).toContain('>Make tea<');
    expect(svg).toContain('>Go upstairs<');
    expect(svg).toContain('>Do work<');
    expect(svg).toContain('>Me · Cat<');
  });

  it('分数画成大小不同的圆点(用皮肤色板)', () => {
    const { svg } = renderJourneyFromUrl(new URL(JR_URL));
    const radii = [...svg.matchAll(/<circle[^>]*r="([\d.]+)"/g)].map((m) => +m[1]);
    // 5 分的圆最大、1 分的最小
    expect(Math.max(...radii)).toBeGreaterThan(Math.min(...radii));
    expect(svg).toContain('var(--d-s1)');
  });

  it('元数据岛带结构化数据', () => {
    const { svg } = renderJourneyFromUrl(new URL(JR_URL), true);
    expect(svg).toContain('<metadata id="jtasks">');
    expect(svg).toContain('data-tip=');
  });

  it('皮肤家族换色(与默认不同)', () => {
    const def = renderJourneyFromUrl(new URL(JR_URL)).svg;
    const mac = renderJourneyFromUrl(new URL(JR_URL + '&t=macaron')).svg;
    expect(mac).not.toBe(def);
    expect(mac).toMatch(/--d-s1:#D83B30/i);
  });

  it('明暗两套变量都在(auto)', () => {
    const { svg } = renderJourneyFromUrl(new URL(JR_URL));
    expect(svg).toContain('prefers-color-scheme: dark');
  });
});

describe('journey param validation', () => {
  const cases: [string, string][] = [
    ['', 'at least one "section="'],
    ['section=Go', 'at least one "task="'],
    ['section=Go&task=Go|Make tea', 'must be "section|task|score'],
    ['section=Go&task=Go|Make tea|9|Me', 'score must be an integer 1-5'],
    ['section=Go&task=Go|Make tea|0|Me', 'score must be an integer 1-5'],
    ['section=Go&task=Walk|Make tea|5|Me', 'unknown section'],
  ];
  for (const [query, needle] of cases) {
    it(`拒绝 ?${query} (${needle})`, () => {
      try {
        renderJourneyFromUrl(new URL(`https://draw.test/draw/journey?${query}`));
        expect.unreachable('should have thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        expect((err as ApiError).message).toContain(needle);
      }
    });
  }
});

describe('journey spec helpers', () => {
  it('params → spec', () => {
    const spec = journeySpecFromParams(new URLSearchParams('section=Go&task=Go|Make tea|5|Me,Cat'));
    expect(spec.sections[0].tasks[0]).toEqual({ name: 'Make tea', score: 5, actors: ['Me', 'Cat'] });
  });

  it('JSON → spec', () => {
    const spec = parseJourneySpec(JSON.stringify({
      title: 'T',
      sections: [{ name: 'A', tasks: [{ name: 'x', score: 3, actors: ['Bo'] }] }],
    }));
    expect(spec.title).toBe('T');
    expect(spec.sections[0].tasks[0].score).toBe(3);
  });

  it('空 JSON / 坏 JSON → 报错', () => {
    expect(() => parseJourneySpec('')).toThrow(ApiError);
    expect(() => parseJourneySpec('{')).toThrow(ApiError);
  });
});
