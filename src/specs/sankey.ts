// 桑基图(sankey):labels + links(A>B:30),扁平或 JSON。
import { ApiError, LIMITS, clip, flatList } from './base';

export interface SankeyLink {
  from: string;
  to: string;
  value: number;
}

export interface SankeySpec {
  title?: string;
  unit?: string;
  labels: string[];
  links: SankeyLink[];
}

const SANKEY_EXAMPLE = 'labels=Ads,Web,Signup,Buy&links=Ads>Signup:30,Web>Signup:20,Signup>Buy:40';
const MAX_NODES = 24;
const MAX_LINKS = 60;

export function sankeySpecFromParams(params: URLSearchParams): string | null {
  const d = params.get('d');
  if (d !== null && d !== '') return d;
  if (!params.has('labels') && !params.has('links')) return null;
  const labels = flatList(params, 'labels');
  if (labels.length === 0) {
    throw new ApiError(400, `"labels" is required. Example: ?type=sankey&${SANKEY_EXAMPLE}`);
  }
  const links = params.getAll('links').flatMap((e) => e.split(';')).filter(Boolean).map((e) => {
    const gt = e.indexOf('>');
    const co = e.indexOf(':', gt + 1);
    if (gt <= 0 || co <= gt + 1) {
      throw new ApiError(400, `links entry must look like "A>B:30", got: ${JSON.stringify(e)}`);
    }
    return { from: e.slice(0, gt), to: e.slice(gt + 1, co), value: Number(e.slice(co + 1)) };
  });
  return JSON.stringify({
    labels,
    links,
    ...(params.get('title') ? { title: params.get('title') } : {}),
    ...(params.get('unit') ? { unit: params.get('unit') } : {}),
  });
}

export function parseSankeySpec(raw: string | null): SankeySpec {
  if (raw === null || raw === '') {
    throw new ApiError(400, `Missing data. Use ?type=sankey&${SANKEY_EXAMPLE} — or ?d= with {"labels":["A","B"],"links":[{"from":"A","to":"B","value":30}]}`);
  }
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    throw new ApiError(400, `"d" is not valid JSON. Example: {"labels":["A","B"],"links":[{"from":"A","to":"B","value":30}]}`);
  }
  const o = obj as Record<string, unknown>;
  if (!Array.isArray(o.labels) || o.labels.length < 2) {
    throw new ApiError(400, `"labels" must be an array with at least 2 node names`);
  }
  if (o.labels.length > MAX_NODES) {
    throw new ApiError(400, `"labels" has ${o.labels.length} nodes; sankey supports at most ${MAX_NODES}`);
  }
  const seen = new Set<string>();
  const labels = o.labels.map((l, i) => {
    if (typeof l !== 'string' || l === '') throw new ApiError(400, `labels[${i}] must be a non-empty string`);
    const name = clip(l, LIMITS.label);
    if (seen.has(name)) throw new ApiError(400, `labels must be unique, duplicate: ${JSON.stringify(name)}`);
    seen.add(name);
    return name;
  });
  if (!Array.isArray(o.links) || o.links.length === 0) {
    throw new ApiError(400, `"links" must be a non-empty array like [{"from":"A","to":"B","value":30}]`);
  }
  if (o.links.length > MAX_LINKS) {
    throw new ApiError(400, `"links" has ${o.links.length} entries; sankey supports at most ${MAX_LINKS}`);
  }
  const links = o.links.map((it, i) => {
    if (typeof it !== 'object' || it === null) throw new ApiError(400, `links[${i}] must be an object with "from", "to", "value"`);
    const l = it as Record<string, unknown>;
    if (typeof l.from !== 'string' || typeof l.to !== 'string') throw new ApiError(400, `links[${i}].from/.to must be node names`);
    if (!seen.has(l.from)) throw new ApiError(400, `links[${i}].from references unknown node: ${JSON.stringify(l.from)}`);
    if (!seen.has(l.to)) throw new ApiError(400, `links[${i}].to references unknown node: ${JSON.stringify(l.to)}`);
    if (l.from === l.to) throw new ApiError(400, `links[${i}] self-loop is not allowed (${JSON.stringify(l.from)})`);
    if (typeof l.value !== 'number' || !Number.isFinite(l.value) || l.value <= 0) {
      throw new ApiError(400, `links[${i}].value must be a number > 0`);
    }
    return { from: l.from, to: l.to, value: l.value };
  });
  let title: string | undefined;
  if (o.title !== undefined) {
    if (typeof o.title !== 'string') throw new ApiError(400, `"title" must be a string`);
    title = clip(o.title, LIMITS.title);
  }
  let unit: string | undefined;
  if (o.unit !== undefined) {
    if (typeof o.unit !== 'string') throw new ApiError(400, `"unit" must be a string`);
    unit = clip(o.unit, LIMITS.unit);
  }
  // DAG 校验(Kahn):环在解析期就报 400(直连与短链创建共用)
  const deg = labels.map(() => 0);
  for (const l of links) deg[labels.indexOf(l.to)]++;
  const q = labels.map((_, i) => i).filter((i) => deg[i] === 0);
  let done = 0;
  while (q.length) {
    const i = q.shift()!;
    done++;
    for (const l of links) {
      if (l.from === labels[i] && --deg[labels.indexOf(l.to)] === 0) q.push(labels.indexOf(l.to));
    }
  }
  if (done < labels.length) {
    throw new ApiError(400, 'sankey links must form a DAG (no cycles); check links= for a loop');
  }
  return { title, unit, labels, links };
}
