import { describe, it, expect } from 'vitest';
import { translateRequirement } from '../src/render/mermaid/requirement.js';
import {
  parseRequirementSpec, renderRequirement, renderRequirementFromUrl, requirementSpecFromParams,
} from '../src/render/requirement.js';
import { ApiError } from '../src/specs/index.js';
import { resolveSkin } from '../src/styles/index.js';

const url = (qs: string): URL => new URL(`https://draw.test/draw/requirement?${qs}`);

/** 参数字典:同名参数收成数组 */
const byName = (params: [string, string][]): Record<string, string[]> => {
  const out: Record<string, string[]> = {};
  for (const [k, v] of params) (out[k] ??= []).push(v);
  return out;
};

const SRC = `requirementDiagram
    requirement test_req {
    id: 1
    text: the test text.
    risk: high
    verifymethod: test
    }
    element test_entity {
    type: simulation
    }
    test_entity - satisfies -> test_req`;

describe('mermaid requirementDiagram → draw requirement', () => {
  it('需求翻成 req=,字段各占一段', () => {
    const plan = translateRequirement(SRC);
    expect(plan.kind).toBe('requirement');
    const p = byName(plan.params);
    expect(p.req).toEqual(['test_req|1|the test text.|high|test']);
  });

  it('要素翻成 el=', () => {
    const p = byName(translateRequirement(SRC).params);
    expect(p.el).toEqual(['test_entity|simulation']);
  });

  it('关系翻成 rel=,方向照抄(A 满足 B)', () => {
    const p = byName(translateRequirement(SRC).params);
    expect(p.rel).toEqual(['test_entity|test_req|satisfies']);
  });

  it('四种关系都认', () => {
    const p = byName(translateRequirement(`requirementDiagram
      a - satisfies -> b
      c - verifies -> d
      e - copies -> f
      g - derives -> h`).params);
    expect(p.rel).toEqual([
      'a|b|satisfies',
      'c|d|verifies',
      'e|f|copies',
      'g|h|derives',
    ]);
  });

  it('注释吃掉,不影响需求', () => {
    const p = byName(translateRequirement('requirementDiagram\n  %% 注释\n  requirement r {\n  id: 1\n  }').params);
    expect(p.req).toEqual(['r|1|||']);
  });

  it('只写关系(没声明节点)也认 —— 关系的两端补成空节点', () => {
    const p = byName(translateRequirement('requirementDiagram\n  a - satisfies -> b').params);
    expect(p.req).toEqual(['a||||', 'b||||']);
    expect(p.rel).toEqual(['a|b|satisfies']);
  });

  it('什么都没有 → 报错', () => {
    expect(() => translateRequirement('requirementDiagram\n')).toThrow(ApiError);
    expect(() => translateRequirement('requirementDiagram\n')).toThrow(/at least one/);
  });
});

describe('requirement spec parsing', () => {
  it('URL 参数 → 规格', () => {
    const spec = requirementSpecFromParams(url('req=r1|1|text|high|test&el=e1|simulation&rel=e1|r1|satisfies').searchParams);
    expect(spec.reqs[0]).toEqual({ name: 'r1', id: '1', text: 'text', risk: 'high', verifymethod: 'test' });
    expect(spec.els[0]).toEqual({ name: 'e1', type: 'simulation' });
    expect(spec.rels[0]).toEqual({ from: 'e1', to: 'r1', type: 'satisfies' });
  });

  it('JSON 形态 → 规格', () => {
    const spec = parseRequirementSpec(JSON.stringify({ reqs: [{ name: 'r', risk: 'low' }] }));
    expect(spec.reqs[0]).toEqual({ name: 'r', risk: 'low' });
  });

  it('什么都没有 → 400', () => {
    expect(() => requirementSpecFromParams(url('').searchParams)).toThrow(ApiError);
  });

  it('关系指向不存在的节点 → 400', () => {
    expect(() => requirementSpecFromParams(url('req=r|1|t&rel=zzz|r|satisfies').searchParams)).toThrow(/unknown node/);
  });
});

describe('requirement rendering', () => {
  const QS = 'req=test_req|1|the%20test%20text.|high|test&el=test_entity|simulation&rel=test_entity|test_req|satisfies';

  it('需求与要素的名字都在图上', () => {
    const { svg } = renderRequirementFromUrl(url(QS));
    expect(svg).toContain('test_req');
    expect(svg).toContain('test_entity');
  });

  it('字段表的一行行都在图上', () => {
    const { svg } = renderRequirementFromUrl(url(QS));
    expect(svg).toContain('the test text.');
    expect(svg).toContain('simulation');
    expect(svg).toContain('verifymethod');
  });

  it('风险徽章画出来(色板色,不是写死的红)', () => {
    const { svg } = renderRequirementFromUrl(url(QS));
    expect(svg).toContain('var(--d-s1)');
    expect(svg).toContain('>H<');
  });

  it('关系类型写在边上', () => {
    const { svg } = renderRequirementFromUrl(url(QS));
    expect(svg).toContain('>satisfies<');
  });

  it('标题走 titleBlock', () => {
    const { svg } = renderRequirementFromUrl(url(QS + '&title=Reqs'));
    expect(svg).toContain('>Reqs<');
    expect(svg).toContain('font-size="18" font-weight="500"');
  });

  it('交互模式:data-tip + metadata 岛', () => {
    const { svg } = renderRequirementFromUrl(url(QS), true);
    expect(svg).toContain('data-tip=');
    expect(svg).toContain('<metadata id="rreqs">');
  });

  it('换皮:macaron 与默认皮肤不同', () => {
    const def = renderRequirementFromUrl(url(QS)).svg;
    const mac = renderRequirementFromUrl(url(QS + '&t=macaron')).svg;
    expect(mac).not.toBe(def);
    expect(mac).toContain('#D83B30');
  });

  it('renderRequirement 直接调用也行', () => {
    const skin = resolveSkin('sankey', null, 'light');
    const svg = renderRequirement(
      { reqs: [{ name: 'r', risk: 'medium' }], els: [], rels: [] },
      { width: 400, height: 240, version: 1, skin },
    );
    expect(svg).toContain('>r<');
  });
});
