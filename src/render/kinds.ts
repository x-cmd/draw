// 四种新图种:dataflow / lifecycle / erd / class。
//
// 都是同一套引擎(架构图 v2 那张脸),只换「语义类型词汇」和「形状」:
//   /draw/dataflow   数据流:处理 / 存储 / 外部源汇
//   /draw/lifecycle  生命周期:状态 / 判断 / 终态
//   /draw/erd        实体关系:表(字段表在节点里)
//   /draw/class      类图:类(字段与方法在节点里)
//
// 参数语法和架构图一致:n=id;type;label;sub;pos、e=from;to;label、b=label;id id。
// 节点里的多行内容用 \n 分隔(URL 里写 %0A)—— ERD 的字段表、class 的成员表靠它。
import { ApiError } from '../specs/index.js';
import type { ArchBoundary, ArchEdge, ArchNode } from './archmap.js';
import { GRID_POS_RE, ID_RE, PX_POS_RE, parseBoundaries, parseEdges, splitFields } from './archmap.js';
import { renderArchCore, type HouseTypes } from './arch.js';
import { resolveSkin } from '../styles/index.js';
import { clampInt, schemeParam, type DrawResult } from './query.js';

/* ---------------------------------------------------------------- 词汇 */
const DATAFLOW: HouseTypes = {
  meta: {
    process: { name: 'Process', badge: 'P', color: 1 },
    store: { name: 'Store', badge: 'S', color: 2 },
    source: { name: 'Source', badge: 'X', color: -1 },
    sink: { name: 'Sink', badge: 'X', color: -1 },
  },
  order: ['process', 'store', 'source', 'sink'],
  shape: { process: 'rect', store: 'cylinder', source: 'round', sink: 'round' },
};

const LIFECYCLE: HouseTypes = {
  meta: {
    state: { name: 'State', badge: 'T', color: 3 },
    decision: { name: 'Decision', badge: 'D', color: 4 },
    terminal: { name: 'Terminal', badge: 'E', color: 1 },
  },
  order: ['state', 'decision', 'terminal'],
  shape: { state: 'round', decision: 'diamond', terminal: 'round' },
};

const ERD: HouseTypes = {
  meta: {
    table: { name: 'Table', badge: 'T', color: 2 },
    view: { name: 'View', badge: 'V', color: 3 },
  },
  order: ['table', 'view'],
  rows: 'fields', // 字段表:键标记 + 名字(左)+ 类型(右)
  crows: 'erd',   // 边按 1:N 画鱼尾记号
};

const CLASS: HouseTypes = {
  meta: {
    class: { name: 'Class', badge: 'C', color: 2 },
    iface: { name: 'Interface', badge: 'I', color: 3 },
    enum: { name: 'Enum', badge: 'E', color: 4 },
  },
  order: ['class', 'iface', 'enum'],
  rows: 'fields', // 成员表:可见性标记 + 名字(左)+ 类型(右)
  uml: true,      // extends / implements 画 UML 的空心三角
};

/* ---------------------------------------------------------------- 节点解析
   和 archmap 同一套语法,只是类型不限定在那八种里(每种图有自己的一套)。 */
function parseKindNodes(raw: string[], allowed: string[]): ArchNode[] {
  return raw.map((v, i) => {
    const f = splitFields(v).map((x) => x.trim());
    if (f.length < 3 || f.length > 5) {
      throw new ApiError(400, `"n" #${i + 1} must be "id;type;label[;sub][;pos]". Example: ${f[0]}`);
    }
    const [id, type, label] = f;
    if (!ID_RE.test(id)) throw new ApiError(400, `"n" #${i + 1}: id must be alnum/dot/dash/underscore`);
    if (!allowed.includes(type)) {
      throw new ApiError(400, `"n" #${i + 1}: type must be one of ${allowed.join(', ')}; got "${type}"`);
    }
    if (!label) throw new ApiError(400, `"n" #${i + 1}: label is required`);
    let sub: string | undefined;
    let pos: string | undefined;
    if (f.length === 4) {
      if (GRID_POS_RE.test(f[3]) || PX_POS_RE.test(f[3])) pos = f[3];
      else sub = f[3];
    } else if (f.length === 5) {
      sub = f[3];
      pos = f[4];
    }
    const node: ArchNode = { id, type: type as ArchNode['type'], label, ...(sub ? { sub } : {}) };
    if (pos) {
      const g = GRID_POS_RE.exec(pos);
      if (g) {
        node.grid = { row: +g[1], col: +g[2], w: g[3] ? +g[3] : 1, h: g[4] ? +g[4] : 1 };
      } else {
        const px = PX_POS_RE.exec(pos);
        if (!px) throw new ApiError(400, `"n" #${i + 1}: pos must look like r0c1[w2][h2] or p40,80[,120x48]`);
        node.px = { x: +px[1], y: +px[2], ...(px[3] ? { w: +px[3], h: +px[4] } : {}) };
      }
    }
    return node;
  });
}

/* ---------------------------------------------------------------- 公共入口 */
interface KindSpec {
  name: string;
  types: HouseTypes;
  /** 这套词汇允许的类型 */
  allowed: string[];
  /** 节点里多行内容的分隔符(URL 里 %0A) */
  example: string;
}

const KINDS: Record<string, KindSpec> = {
  dataflow: {
    name: 'Data flow',
    types: DATAFLOW,
    allowed: ['process', 'store', 'source', 'sink'],
    example: 'n=extract;process;Extract rows;read the CSV;r0c0&n=raw;source;raw/orders.csv;;r1c0&e=raw;extract;rows&e=extract;store;write parquet',
  },
  lifecycle: {
    name: 'Lifecycle',
    types: LIFECYCLE,
    allowed: ['state', 'decision', 'terminal'],
    example: 'n=new;state;New;;r0c0&n=paid;state;Paid;;r1c0&n=ok;terminal;Fulfilled;;r1c1&e=new;paid&e=paid;ok',
  },
  erd: {
    name: 'ERD',
    types: ERD,
    allowed: ['table', 'view'],
    example: 'n=users;table;users;id:int (pk)%0Aname:text%0Acreated_at:timestamp;r0c0&n=orders;table;orders;id:int (pk)%0Auser_id:int (fk)%0Atotal:int;r1c0&e=users;orders;1:N',
  },
  class: {
    name: 'Class',
    types: CLASS,
    allowed: ['class', 'iface', 'enum'],
    example: 'n=user;class;User;id:int%0Aname:string%0Agreet(): void;r0c0&n=repo;iface;Repository;find(id): User?;r1c0&e=user;repo;implements',
  },
};

/**
 * 画一种图:解析 n=/e=/b=,套上那套词汇。
 */
export function renderKindFromUrl(kind: string, url: URL, interactive = false): DrawResult {
  const spec = KINDS[kind];
  if (!spec) throw new ApiError(400, `unknown diagram kind "${kind}"`);
  const params = url.searchParams;
  const nRaw = params.getAll('n');
  if (!nRaw.length) {
    throw new ApiError(400, `at least one node is required. Example: /draw/${kind}?${spec.example}`);
  }
  const nodes: ArchNode[] = parseKindNodes(nRaw, spec.allowed);
  for (const n of nodes) {
    if (!spec.allowed.includes(n.type)) {
      throw new ApiError(400, `"${kind}" node type must be one of ${spec.allowed.join(', ')}; got "${n.type}". Example: /draw/${kind}?${spec.example}`);
    }
  }
  const seen = new Set<string>();
  for (const n of nodes) {
    if (seen.has(n.id)) throw new ApiError(400, `duplicate node id "${n.id}"`);
    seen.add(n.id);
  }
  const edges: ArchEdge[] = parseEdges(params.getAll('e'), seen);
  const boundaries: ArchBoundary[] = parseBoundaries(params.getAll('b'), seen);
  const v = parseInt(params.get('v') ?? '1', 10) || 1;
  const skin = resolveSkin('sankey', params.get('t'), schemeParam(params));
  return renderArchCore({
    nodes, edges, boundaries,
    types: spec.types,
    template: kind, tagQuery: url.search,
    title: params.get('title')?.trim() || undefined,
    gridCols: clampInt(params, 'grid', 0, 1, 12),
    legend: params.get('legend') !== '0',
    interactive,
    version: v,
    cacheControl: 'public, max-age=300',
    skin,
    minW: clampInt(params, 'w', 0, 200, 2400),
    minH: clampInt(params, 'h', 0, 140, 2400),
    aria: `${spec.name} diagram, ${nodes.length} nodes`,
  });
}

export const KIND_NAMES = Object.keys(KINDS);
