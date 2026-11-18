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

  it('_text 给两个节点:指示点 + 引线 + 文字(引线拉多远就是多远)', () => {
    const svg = svgOf('?type=bar&labels=Mon,Tue&values=1,2&_text=60,60,20,20;the%20spike');
    expect(svg).toContain('the spike');
    expect(svg).toContain('<line');      // 引线
    expect(svg).toContain('<circle');    // 指示点
  });

  it('_text 只给一个节点时不画引线(老样子 ✓)', () => {
    const svg = svgOf('?type=bar&labels=Mon,Tue&values=1,2&_text=60,40;the%20spike');
    expect(svg).toContain('the spike');
    expect(svg).not.toContain('<circle');
  });

  it('_text 只给 tx 不给 ty 要报错', () => {
    expect(() => svgOf('?type=bar&labels=Mon,Tue&values=1,2&_text=60,60,20;oops')).toThrow();
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

  it('_arrow 画出一支箭头(线 + 箭头)', () => {
    const svg = svgOf('?type=bar&labels=Mon,Tue&values=1,2&_arrow=20,60,60,20');
    expect(svg).toContain('<line');
    expect(svg).toMatch(/<path d="M[^"]*L[^"]*L/);
  });

  it('_path 画出一条折线', () => {
    const svg = svgOf('?type=bar&labels=Mon,Tue&values=1,2&_path=10,10,20,20,30,15');
    expect(svg).toMatch(/<path d="M[^"]*L[^"]*L/);
  });

  it('_path 末尾带 # 的那段是颜色,不是坐标', () => {
    const svg = svgOf('?type=bar&labels=Mon,Tue&values=1,2&_path=10,10,20,20,#F87171');
    expect(svg).toContain('#f87171');
    expect(svg).not.toContain('#F87171');
  });

  it('_note 能带文字框的位置(引线拉多远就是多远)', () => {
    const placed = svgOf('?type=bar&labels=Mon,Tue&values=1,2&_note=20,50,70,20;hello');
    const auto = svgOf('?type=bar&labels=Mon,Tue&values=1,2&_note=20,50;hello');
    expect(placed).toContain('hello');
    expect(placed).not.toBe(auto);       // 框的位置不同 ⇒ 画得不一样 ✓
  });

  it('_note 只给一半的文字框位置 ⇒ 报错', () => {
    expect(() => svgOf('?type=bar&labels=Mon&values=1&_note=20,50,70;hi')).toThrow(/_note/);
  });

  it('_cls/_c 给标注定类别,类别牌画在图上', () => {
    const a = svgOf('?type=bar&labels=Mon,Tue&values=1,2&_oval=60,40,10,6&_cls=anomaly,trend&_c=0:anomaly');
    expect(a).toContain('anomaly');
    const b = svgOf('?type=bar&labels=Mon,Tue&values=1,2&_oval=60,40,10,6');
    expect(a).not.toBe(b);          // 有类别 ⇒ 多一块牌 ✓
  });

  it('藏掉的标注不占类别的序号', () => {
    const a = svgOf('?type=bar&labels=Mon,Tue&values=1,2&_oval=10,10,5,5&_oval=80,80,5,5&_hide=0&_c=1:second');
    expect(a).toContain('second');
    expect(a).not.toContain('first');
  });

  it('参数写错时报错只说新名字', () => {
    expect(() => svgOf('?type=bar&labels=Mon&values=1&_oval=1,2')).toThrow(/_oval/);
    expect(() => svgOf('?type=bar&labels=Mon&values=1&_text=1,2')).toThrow(/_text/);
  });

  it('箭头/折线写错时报错', () => {
    expect(() => svgOf('?type=bar&labels=Mon&values=1&_arrow=1,2,3')).toThrow(/_arrow/);
    expect(() => svgOf('?type=bar&labels=Mon&values=1&_path=1,2,3')).toThrow(/_path/);
  });
});
