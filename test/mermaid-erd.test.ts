import { describe, it, expect } from 'vitest';
import { translateErd } from '../src/render/mermaid/erd.js';
import { renderMermaidFromUrl } from '../src/render/mermaid.js';
import { ApiError } from '../src/specs/index.js';

const url = (src: string): URL =>
  new URL('https://draw.test/draw/mermaid?m=' + encodeURIComponent(src));

const SRC = `erDiagram
    CUSTOMER ||--o{ ORDER : "places"
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER ||--|| ORDER : one-to-one
    }o--|| DELIVERY : "zero or many"
    CUSTOMER {
        string name
        string custNumber PK
        string sector
        string email FK
    }`;

/** 参数字典:同名参数收成数组 */
const byName = (params: [string, string][]): Record<string, string[]> => {
  const out: Record<string, string[]> = {};
  for (const [k, v] of params) (out[k] ??= []).push(v);
  return out;
};

describe('mermaid erDiagram → draw erd', () => {
  it('每个实体一张表,属性块翻成字段表', () => {
    const plan = translateErd(SRC);
    expect(plan.kind).toBe('erd');
    const p = byName(plan.params);
    expect(p.n).toContain('CUSTOMER;table;CUSTOMER;name:string\ncustNumber:string (pk)\nsector:string\nemail:string (fk)');
    expect(p.n).toContain('ORDER;table;ORDER');
    expect(p.n).toContain('LINE-ITEM;table;LINE-ITEM');
    expect(p.n).toContain('DELIVERY;table;DELIVERY');
  });

  it('关系带上基数,动词跟在基数后面', () => {
    const p = byName(translateErd(SRC).params);
    expect(p.e).toContain('CUSTOMER;ORDER;1:N places');
    expect(p.e).toContain('ORDER;LINE-ITEM;1:N contains');
    expect(p.e).toContain('CUSTOMER;ORDER;1:1 one-to-one');
  });

  it('基数记号认全四种', () => {
    const p = byName(translateErd(`erDiagram
      A ||--|| B : exact
      A o|--o| C : optional
      A |{--|{ D : many
      A }o--}o E : zero
    `).params);
    expect(p.e).toContain('A;B;1:1 exact');
    expect(p.e).toContain('A;C;1:1 optional');
    expect(p.e).toContain('A;D;N:N many');
    expect(p.e).toContain('A;E;N:N zero');
  });

  it('关系行可以没有动词,也可以用 .. 连接', () => {
    const p = byName(translateErd('erDiagram\n  A ||--o{ B\n  C ||..o{ D : dotted').params);
    expect(p.e).toEqual(['A;B;1:N', 'C;D;1:N dotted']);
  });

  it('没有属性块的实体不带 sub', () => {
    const p = byName(translateErd('erDiagram\n  A ||--o{ B : x').params);
    expect(p.n).toEqual(['A;table;A', 'B;table;B']);
  });

  it('名字里有短横,id 仍然合法', () => {
    const plan = translateErd('erDiagram\n  LINE-ITEM ||--o{ ORDER : part');
    for (const [k, v] of plan.params) {
      if (k === 'n') {
        const id = v.split(';')[0];
        expect(id).toMatch(/^[A-Za-z0-9][A-Za-z0-9_.-]*$/);
      }
    }
  });

  it('什么实体都没有 → 报错', () => {
    expect(() => translateErd('erDiagram\n')).toThrow(ApiError);
    expect(() => translateErd('erDiagram\n')).toThrow(/at least one entity/);
  });

  it('端到端渲染:表名与字段都在图上', () => {
    const { svg } = renderMermaidFromUrl(url(SRC));
    expect(svg).toContain('>CUSTOMER<');
    expect(svg).toContain('>ORDER<');
    expect(svg).toContain('>LINE-ITEM<');
    expect(svg).toContain('custNumber');
    expect(svg).toContain('PK');
    expect(svg).toContain('FK');
  });

  it('端到端渲染:1:N 画鱼尾记号', () => {
    const { svg } = renderMermaidFromUrl(url(SRC));
    // 「一」是一根横杠,「多」是三根爪 —— 一条 1:N 的边共四段
    const feet = [...svg.matchAll(/<path d="M[\d.]+ [\d.]+L[\d.]+ [\d.]+" fill="none" stroke="var\(--d-muted\)"/g)];
    expect(feet.length).toBeGreaterThanOrEqual(4);
  });

  it('端到端渲染:动词当边标签,基数不重复出现', () => {
    const { svg } = renderMermaidFromUrl(url(SRC));
    const texts = [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);
    expect(texts).toContain('places');
    expect(texts).toContain('contains');
  });
});
