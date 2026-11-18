// 标注层(anno):正式名是 `_oval=` / `_text=` / `_hl=` / `_note=`;
// 老名字 `oval=` / `text=` 继续能跑(兼容旧链接 ✓)—— 但画出来必须**一模一样** ✓。
import { describe, expect, it } from 'vitest';
import { draw } from '../src/lib.js';

function svgOf(query: string): string {
  return draw(query).svg;
}

describe('标注层', () => {
  it('_oval 与老名字 oval 画出同一张图', () => {
    const a = svgOf('?type=bar&labels=Mon,Tue&values=1,2&_oval=60,40,10,6');
    const b = svgOf('?type=bar&labels=Mon,Tue&values=1,2&oval=60,40,10,6');
    expect(a).toBe(b);
    expect(a).toContain('<ellipse');
  });

  it('_text 与老名字 text 画出同一张图', () => {
    const a = svgOf('?type=bar&labels=Mon,Tue&values=1,2&_text=60,40;the%20spike');
    const b = svgOf('?type=bar&labels=Mon,Tue&values=1,2&text=60,40;the%20spike');
    expect(a).toBe(b);
    expect(a).toContain('the spike');
  });

  it('四个标注能同时画', () => {
    const svg = svgOf(
      '?type=bar&labels=Mon,Tue&values=1,2&_oval=60,40,10,6&_text=20,20;hello&_hl=10,10,20,20&_note=70,70;why',
    );
    expect(svg).toContain('<ellipse');
    expect(svg).toContain('hello');
    expect(svg).toContain('why');
  });

  it('_hide=0 藏起第一个标注', () => {
    const both = svgOf('?type=bar&labels=Mon,Tue&values=1,2&_oval=10,10,5,5&_oval=80,80,5,5');
    const hidden = svgOf('?type=bar&labels=Mon,Tue&values=1,2&_oval=10,10,5,5&_oval=80,80,5,5&_hide=0');
    expect((both.match(/<ellipse/g) ?? []).length).toBe(2);
    expect((hidden.match(/<ellipse/g) ?? []).length).toBe(1);
  });

  it('markhide=1 整层不画', () => {
    const shown = svgOf('?type=bar&labels=Mon,Tue&values=1,2&_oval=10,10,5,5');
    const hidden = svgOf('?type=bar&labels=Mon,Tue&values=1,2&_oval=10,10,5,5&markhide=1');
    expect(shown).toContain('<ellipse');
    expect(hidden).not.toContain('<ellipse');
  });

  it('参数写错时报错只说新名字', () => {
    expect(() => svgOf('?type=bar&labels=Mon&values=1&_oval=1,2')).toThrow(/_oval/);
    expect(() => svgOf('?type=bar&labels=Mon&values=1&_text=1,2')).toThrow(/_text/);
  });
});
