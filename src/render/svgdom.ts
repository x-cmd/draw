// 最小 DOM —— 给那些「建一棵 SVG DOM 树,再序列化」的库用。
//
// Worker 里没有 DOM。这些库(smilesdrawer / abcjs / vexflow)干的都是同一件事:
// 造元素 → 挂上去 → 序列化。于是给它们一个刚够用的 DOM:
//
//   document.createElementNS / createElement / createTextNode /
//   getElementById / querySelector / body
//   元素:setAttribute / setAttributeNS / getAttribute / hasAttribute /
//        appendChild / removeChild / insertBefore / firstChild / children /
//        textContent / innerHTML / style / classList / outerHTML /
//        addEventListener / getBoundingClientRect
//
// **文字量不出来**(没有排版引擎):getBBox 直接抛错,让库走它自己的兜底。
// abcjs 的兜底是「按字号估」—— 谱面(五线谱、音符)走的是库内建的字体数据,
// 画出来的是路径,不受影响;只有标题这类文字的宽度是估的(居中位置差几像素,无伤大雅)。
//
// vexflow 4 的谱面也是路径(它内建了 SVG 字体数据)—— 所以出来的 SVG 是自足的:
// 不依赖系统里有没有装什么字体,浏览器、resvg(PNG 光栅化)画出来都一个样。

const SVG_NS = 'http://www.w3.org/2000/svg';

const escText = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s: string): string => escText(s).replace(/"/g, '&quot;');

class ShimText {
  readonly nodeType = 3;
  parentNode: ShimElement | null = null;
  constructor(public data: string) {}
  get textContent(): string { return this.data; }
  set textContent(v: string) { this.data = v; }
  get outerHTML(): string { return escText(this.data); }
}

export class ShimElement {
  readonly nodeType = 1;
  readonly childNodes: (ShimElement | ShimText)[] = [];
  /** style.xxx = '…' 收在这里,序列化时并进 style 属性 */
  readonly styleProps: Record<string, string> = {};
  private readonly attrs = new Map<string, string>();
  parentNode: ShimElement | null = null;
  id = '';

  constructor(public tagName: string) {}

  setAttribute(name: string, value: unknown): void { this.attrs.set(name, String(value)); }
  setAttributeNS(_ns: string | null, name: string, value: unknown): void { this.attrs.set(name, String(value)); }
  getAttribute(name: string): string | null { return this.attrs.get(name) ?? null; }
  removeAttribute(name: string): void { this.attrs.delete(name); }
  hasAttribute(name: string): boolean { return this.attrs.has(name); }

  appendChild<T extends ShimElement | ShimText>(child: T): T {
    if (child.parentNode) child.parentNode.removeChild(child);
    this.childNodes.push(child);
    if (child instanceof ShimElement) child.parentNode = this;
    return child;
  }
  removeChild<T extends ShimElement | ShimText>(child: T): T {
    const i = this.childNodes.indexOf(child);
    if (i >= 0) {
      this.childNodes.splice(i, 1);
      if (child instanceof ShimElement) child.parentNode = null;
    }
    return child;
  }
  insertBefore<T extends ShimElement | ShimText>(child: T, ref: ShimElement | ShimText | null): T {
    const i = ref ? this.childNodes.indexOf(ref) : -1;
    this.childNodes.splice(i < 0 ? this.childNodes.length : i, 0, child);
    if (child instanceof ShimElement) child.parentNode = this;
    return child;
  }
  /** 元素自己的 remove()(abcjs 拆临时 svg 时用) */
  remove(): void {
    if (this.parentNode) this.parentNode.removeChild(this);
  }

  get firstChild(): ShimElement | ShimText | null { return this.childNodes[0] ?? null; }
  get children(): ShimElement[] { return this.childNodes.filter((c): c is ShimElement => c instanceof ShimElement); }
  get lastChild(): ShimElement | ShimText | null { return this.childNodes[this.childNodes.length - 1] ?? null; }

  get textContent(): string {
    return this.childNodes.map((c) => c.textContent).join('');
  }
  set textContent(v: string) {
    this.childNodes.length = 0;
    this.childNodes.push(new ShimText(v));
  }

  /** innerHTML 只支持「整体替换成一段原文」—— 库用它清空容器(div.innerHTML = '') */
  get innerHTML(): string { return this.outerHTML; }
  set innerHTML(v: string) {
    this.childNodes.length = 0;
    if (v) this.childNodes.push(new ShimRaw(v));
  }

  /** style 是个普通对象:设 .width / .height 就行(序列化时并进 style 属性) */
  readonly style: Record<string, string> = new Proxy({} as Record<string, string>, {
    set: (t, k: string, v: string) => {
      this.styleProps[k] = String(v);
      t[k] = String(v);
      return true;
    },
  });

  /** classList:加/删/查(库用它打标记) */
  get classList(): {
    add: (c: string) => void;
    remove: (c: string) => void;
    contains: (c: string) => boolean;
    toggle: (c: string) => void;
  } {
    const self = this;
    const read = (): Set<string> => new Set((self.getAttribute('class') ?? '').split(/\s+/).filter(Boolean));
    const write = (s: Set<string>): void => { self.setAttribute('class', [...s].join(' ')); };
    return {
      add: (c) => { const s = read(); s.add(c); write(s); },
      remove: (c) => { const s = read(); s.delete(c); write(s); },
      contains: (c) => read().has(c),
      toggle: (c) => { const s = read(); if (s.has(c)) s.delete(c); else s.add(c); write(s); },
    };
  }

  /** 没有排版引擎 —— 抛错,让库自己走估算那条路 */
  getBBox(): never { throw new Error('no layout engine in the worker'); }
  getBoundingClientRect(): { x: number; y: number; width: number; height: number; top: number; left: number; right: number; bottom: number } {
    return { x: 0, y: 0, width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0 };
  }
  get offsetWidth(): number { return 0; }
  get offsetHeight(): number { return 0; }

  /** 事件:库注册监听器(点选、拖动),但 Worker 里没人点 —— 空实现即可 */
  addEventListener(): void { /* no-op */ }
  removeEventListener(): void { /* no-op */ }
  dispatchEvent(): boolean { return true; }

  get outerHTML(): string {
    const parts: string[] = [];
    for (const [k, v] of this.attrs) parts.push(` ${k}="${escAttr(v)}"`);
    const styleKeys = Object.keys(this.styleProps).filter((k) => this.styleProps[k] !== '');
    if (styleKeys.length) {
      const decl = styleKeys.map((k) => `${k}:${this.styleProps[k]}`).join(';');
      parts.push(` style="${escAttr(decl)}"`);
    }
    if (!this.childNodes.length) return `<${this.tagName}${parts.join('')}/>`;
    const inner = this.childNodes.map((c) => c.outerHTML).join('');
    return `<${this.tagName}${parts.join('')}>${inner}</${this.tagName}>`;
  }
}

/** innerHTML = '<div>…</div>' 这种整段原文 */
class ShimRaw extends ShimElement {
  constructor(public raw: string) { super('#raw'); }
  get outerHTML(): string { return this.raw; }
  get textContent(): string { return ''; }
}

/** svg 元素要能被 `instanceof SVGSVGElement` 认出来(库里有这个检查) */
export class SVGSVGElement extends ShimElement {
  constructor() { super('svg'); }
}

const createElementNS = (_ns: string, tag: string): ShimElement =>
  tag === 'svg' ? new SVGSVGElement() : new ShimElement(tag);

const body = new ShimElement('body');

const shimDocument = {
  createElementNS,
  // canvas:库用它量文字。返回 null 的 context —— 库自己会退回「按字数估」那条路
  // (见 smilesdrawer 的 SvgWrapper.estimateTextSize),不用我们算字体宽度。
  createElement: (tag: string): ShimElement | { getContext: () => null } =>
    tag === 'canvas' ? { getContext: () => null } : new ShimElement(tag),
  createTextNode: (data: string): ShimText => new ShimText(data),
  getElementById: (_id: string): null => null,
  // abcjs 造临时 svg 量文字时找 body
  querySelector: (sel: string): ShimElement | null => (sel === 'body' ? body : null),
  querySelectorAll: (_sel: string): ShimElement[] => [],
  body,
  documentElement: new ShimElement('html'),
  addEventListener: (): void => { /* no-op */ },
  removeEventListener: (): void => { /* no-op */ },
};

let installed = false;

/** 把这套 DOM 装到全局上(装一次就够) */
export function installSvgDom(): void {
  if (installed) return;
  installed = true;
  (globalThis as unknown as { document: unknown }).document = shimDocument;
  (globalThis as unknown as { SVGSVGElement: unknown }).SVGSVGElement = SVGSVGElement;
  // 有些库在模块顶层就摸 window(abcjs 挂 resize 监听)—— Worker 里没有 window,
  // 给一个最小的,免得模块一 import 就炸
  const g = globalThis as unknown as { window?: unknown };
  if (!g.window) {
    g.window = {
      addEventListener: (): void => { /* no-op */ },
      removeEventListener: (): void => { /* no-op */ },
      innerWidth: 1024,
      innerHeight: 768,
      devicePixelRatio: 1,
      document: shimDocument,
    };
  }
}

export { SVG_NS };
