import { describe, it, expect } from 'vitest';
import { translateClass } from '../src/render/mermaid/class.js';
import { renderMermaidFromUrl } from '../src/render/mermaid.js';
import { ApiError } from '../src/specs/index.js';

const url = (src: string): URL =>
  new URL('https://draw.test/draw/mermaid?m=' + encodeURIComponent(src));

const SRC = `classDiagram
    class Animal {
        +int age
        +String gender
        +isMammal()
        -secret
    }
    class Duck {
        +String beakColor
        +swim()
    }
    Animal <|-- Duck
    Animal <|-- Fish
    Duck : +int age
    class Car
    Car --|> Vehicle
    class Shape
    <<interface>> Shape
    Shape <|.. Square
    Dog ..> Animal`;

const byName = (params: [string, string][]): Record<string, string[]> => {
  const out: Record<string, string[]> = {};
  for (const [k, v] of params) (out[k] ??= []).push(v);
  return out;
};

describe('mermaid classDiagram → draw class', () => {
  it('类成员翻成字段表:可见性、方法、无类型', () => {
    const plan = translateClass(SRC);
    expect(plan.kind).toBe('class');
    const p = byName(plan.params);
    expect(p.n).toContain('Animal;class;Animal;+ age:int\n+ gender:String\n+ isMammal()\n- secret');
  });

  it('块外的成员也进类里', () => {
    const p = byName(translateClass(SRC).params);
    expect(p.n).toContain('Duck;class;Duck;+ beakColor:String\n+ swim()\n+ age:int');
  });

  it('extends / implements 的方向随记号走', () => {
    const p = byName(translateClass(SRC).params);
    expect(p.e).toContain('Animal;Duck;extends');   // <|-- :Duck 继承 Animal
    expect(p.e).toContain('Animal;Fish;extends');
    expect(p.e).toContain('Vehicle;Car;extends');   // --|> :Car 继承 Vehicle
    expect(p.e).toContain('Shape;Square;implements');
    expect(p.e).toContain('Dog;Animal;depends on');
  });

  it('构造型:接口是 iface,枚举是 enum', () => {
    const p = byName(translateClass(SRC).params);
    expect(p.n).toContain('Shape;iface;Shape');
    const q = byName(translateClass('classDiagram\n  <<interface>> Shape\n  <<enumeration>> Color\n  <<abstract>> Base').params);
    expect(q.n).toContain('Shape;iface;Shape');
    expect(q.n).toContain('Color;enum;Color');
    expect(q.n).toContain('Base;class;Base');
  });

  it('关系里没声明过的类,自己补一个', () => {
    const p = byName(translateClass(SRC).params);
    expect(p.n).toContain('Fish;class;Fish');
    expect(p.n).toContain('Vehicle;class;Vehicle');
    expect(p.n).toContain('Square;class;Square');
    expect(p.n).toContain('Dog;class;Dog');
  });

  it('各种记号都认,方向跟着记号走', () => {
    const p = byName(translateClass(`classDiagram
      A <|-- B
      C --|> D
      E <|.. F
      G ..|> H
      I *-- J
      K --* L
      M o-- N
      O --o P
      Q --> R
      S ..> T
      U -- V
      W .. X`).params);
    expect(p.e).toEqual([
      'A;B;extends',
      'D;C;extends',
      'E;F;implements',
      'H;G;implements',
      'I;J;extends',
      'L;K;extends',
      'M;N;aggregates',
      'P;O;aggregates',
      'Q;R;uses',
      'S;T;depends on',
      'U;V;uses',
      'W;X;depends on',
    ]);
  });

  it('extends/implements 的标签就是那一个词(引擎靠它画三角),动词丢开', () => {
    const p = byName(translateClass('classDiagram\n  A <|-- B : is-a').params);
    expect(p.e).toEqual(['A;B;extends']);
  });

  it('别的记号:动词跟在标签后面', () => {
    const p = byName(translateClass('classDiagram\n  A --> B : drives').params);
    expect(p.e).toEqual(['A;B;uses drives']);
  });

  it('没有块就没有成员', () => {
    const p = byName(translateClass('classDiagram\n  class Car').params);
    expect(p.n).toEqual(['Car;class;Car']);
  });

  it('什么类都没有 → 报错', () => {
    expect(() => translateClass('classDiagram\n')).toThrow(ApiError);
    expect(() => translateClass('classDiagram\n')).toThrow(/at least one class/);
  });

  it('认不出来的行不当错', () => {
    expect(() => translateClass('classDiagram\n  class A\n  direction LR\n  note for A "hello"\n  classDef x fill:#fff')).not.toThrow();
  });

  it('端到端渲染:类名与成员都在图上', () => {
    const { svg } = renderMermaidFromUrl(url(SRC));
    expect(svg).toContain('>Animal<');
    expect(svg).toContain('>Duck<');
    expect(svg).toContain('age');
    expect(svg).toContain('gender');
    expect(svg).toContain('isMammal()');
  });

  it('端到端渲染:继承画空心三角,实现画虚线', () => {
    const { svg } = renderMermaidFromUrl(url(SRC));
    expect(svg).toContain('url(#am-h)');
    expect(svg).toContain('stroke-dasharray="5 4"');
  });
});
