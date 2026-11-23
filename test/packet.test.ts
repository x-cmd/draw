import { describe, it, expect } from 'vitest';
import { translatePacket } from '../src/render/mermaid/packet.js';
import {
  parsePacketSpec, packetSpecFromParams, renderPacket, renderPacketFromUrl,
} from '../src/render/packet.js';
import { ApiError } from '../src/specs/index.js';
import { resolveSkin } from '../src/styles/index.js';

const url = (qs: string): URL => new URL(`https://draw.test/draw/packet?${qs}`);

/** 参数字典:同名参数收成数组 */
const byName = (params: [string, string][]): Record<string, string[]> => {
  const out: Record<string, string[]> = {};
  for (const [k, v] of params) (out[k] ??= []).push(v);
  return out;
};

const SRC = `packet-beta
0-15: "Source Port"
16-31: "Destination Port"
32-63: "Sequence Number"
0: "Flag"`;

describe('mermaid packet-beta → draw packet', () => {
  it('每个字段翻成一条 field=', () => {
    const plan = translatePacket(SRC);
    expect(plan.kind).toBe('packet');
    const p = byName(plan.params);
    expect(p.field).toContain('0|15|Source Port');
    expect(p.field).toContain('16|31|Destination Port');
    expect(p.field).toContain('32|63|Sequence Number');
    expect(p.field).toContain('0|0|Flag');
  });

  it('单个比特:起就是止', () => {
    const p = byName(translatePacket('packet-beta\n7: "ACK"').params);
    expect(p.field).toEqual(['7|7|ACK']);
  });

  it('行注释吃掉,不影响字段', () => {
    const p = byName(translatePacket('packet-beta\n%% 这是注释\n0-7: "A"').params);
    expect(p.field).toEqual(['0|7|A']);
  });

  it('一个字段都没有 → 报错', () => {
    expect(() => translatePacket('packet-beta\n')).toThrow(ApiError);
    expect(() => translatePacket('packet-beta\n')).toThrow(/at least one field/);
  });
});

describe('packet spec parsing', () => {
  it('URL 参数 → 规格', () => {
    const spec = packetSpecFromParams(url('field=0|15|Source%20Port&title=TCP').searchParams);
    expect(spec.title).toBe('TCP');
    expect(spec.fields).toEqual([{ start: 0, end: 15, name: 'Source Port' }]);
  });

  it('JSON 形态 → 规格', () => {
    const spec = parsePacketSpec(JSON.stringify({ fields: [{ start: 0, end: 7, name: 'Flags' }] }));
    expect(spec.fields).toEqual([{ start: 0, end: 7, name: 'Flags' }]);
  });

  it('一个字段都没有 → 400', () => {
    expect(() => packetSpecFromParams(url('').searchParams)).toThrow(ApiError);
  });

  it('区间重叠 → 400', () => {
    expect(() => packetSpecFromParams(url('field=0|15|A&field=8|23|B').searchParams)).toThrow(/overlap/);
  });

  it('end 小于 start → 400', () => {
    expect(() => packetSpecFromParams(url('field=15|0|A').searchParams)).toThrow(ApiError);
  });

  it('字段名缺失 → 400', () => {
    expect(() => packetSpecFromParams(url('field=0|15').searchParams)).toThrow(ApiError);
  });
});

describe('packet rendering', () => {
  it('字段名都画在图上', () => {
    const { svg } = renderPacketFromUrl(url('field=0|15|Source%20Port&field=16|31|Destination%20Port&field=32|63|Sequence%20Number'));
    expect(svg).toContain('Source Port');
    expect(svg).toContain('Destination Port');
    expect(svg).toContain('Sequence Number');
  });

  it('段的宽度与比特数成比例(32 位的那段是 16 位那段的约两倍宽)', () => {
    const { svg } = renderPacketFromUrl(url('field=0|15|A&field=16|47|B'));
    const widths = [...svg.matchAll(/<rect x="[\d.]+" y="[\d.]+" width="([\d.]+)" height="[\d.]+" fill="var\(--d-s\d+\)"/g)]
      .map((m) => Number(m[1]));
    expect(widths.length).toBe(2);
    expect(widths[1] / widths[0]).toBeCloseTo(2, 1);
  });

  it('顶上有比特标尺(起点 0 与末尾的总位数)', () => {
    const { svg } = renderPacketFromUrl(url('field=0|15|A&field=16|31|B'));
    expect(svg).toContain('>0<');
    // 末尾刻度标的是「到这儿为止」——32 位就是 32
    expect(svg).toContain('>32<');
  });

  it('标题走 titleBlock 的样式', () => {
    const { svg } = renderPacketFromUrl(url('field=0|7|A&title=IPv4'));
    expect(svg).toContain('>IPv4<');
    expect(svg).toContain('font-size="18" font-weight="500"');
  });

  it('窄字段的名字放到段上面(不塞进段里)', () => {
    const { svg } = renderPacketFromUrl(url('field=0|0|Flag&field=1|31|Payload'));
    // 名字还在图上(只是位置换了)
    expect(svg).toContain('Flag');
    expect(svg).toContain('Payload');
  });

  it('交互模式:data-tip + metadata 岛', () => {
    const { svg } = renderPacketFromUrl(url('field=0|15|A'), true);
    expect(svg).toContain('data-tip=');
    expect(svg).toContain('<metadata id="pfields">');
  });

  it('换皮:macaron 与默认皮肤不同', () => {
    const def = renderPacketFromUrl(url('field=0|15|A')).svg;
    const mac = renderPacketFromUrl(url('field=0|15|A&t=macaron')).svg;
    expect(mac).not.toBe(def);
    // macaron 的第一色是珊瑚 #D83B30
    expect(mac).toContain('#D83B30');
  });

  it('尺寸参数 respected:画布就是给的宽高', () => {
    const { svg } = renderPacketFromUrl(url('field=0|15|A&w=500&h=200'));
    expect(svg).toContain('width="500" height="200"');
  });

  it('renderPacket 直接调用也行', () => {
    const skin = resolveSkin('sankey', null, 'light');
    const svg = renderPacket(
      { fields: [{ start: 0, end: 7, name: 'X' }] },
      { width: 400, height: 200, version: 1, skin },
    );
    expect(svg).toContain('>X<');
  });
});
