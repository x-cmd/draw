// 四向箭头(compass):中心一个点,上右下左四个方向各一支箭头,箭头端点带标签。
// 与四象限(quadrant)的区别:那边是**两条轴**切出四个区域,这边是**四个方向各一支箭头**
// (参考 mentalModelMap 组织模块的「员工培养模型」一类图)。
import { ApiError, LIMITS, clip } from './base.js';

/** 一个方向:标签(箭头端点)+ 副说明 */
export interface CompassArm {
  label?: string;
  note?: string;
}

/** 四向箭头图数据 */
export interface CompassSpec {
  title?: string;
  /** 中心的字(可空) */
  center?: string;
  /** 四个方向 */
  up?: CompassArm;
  right?: CompassArm;
  down?: CompassArm;
  left?: CompassArm;
}

const COMPASS_EXAMPLE = 'up=自己&right=他人&down=组织&left=环境';

const LABEL_MAX = 16;
const NOTE_MAX = 32;
const CENTER_MAX = 16;

const DIRS = ['up', 'right', 'down', 'left'] as const;
type Dir = (typeof DIRS)[number];

/** 方向值:`标签` 或 `标签:副说明` */
function armFromParam(raw: string, dir: Dir): CompassArm {
  const at = raw.indexOf(':');
  if (at < 0) return { label: clip(raw.trim(), LABEL_MAX) };
  return {
    label: clip(raw.slice(0, at).trim(), LABEL_MAX),
    note: clip(raw.slice(at + 1).trim(), NOTE_MAX),
  };
}

/**
 * Build compass spec JSON from query params.
 * Returns null when no direction is present.
 */
export function compassSpecFromParams(params: URLSearchParams): string | null {
  const d = params.get('d');
  if (d !== null && d !== '') return d;
  const obj: Record<string, unknown> = {};
  let any = false;
  for (const dir of DIRS) {
    const v = params.get(dir);
    if (v !== null && v !== '') {
      obj[dir] = armFromParam(v, dir);
      any = true;
    }
  }
  const center = params.get('center');
  if (center !== null && center !== '') obj.center = center;
  const title = params.get('title');
  if (title) obj.title = title;
  return any || center ? JSON.stringify(obj) : null;
}

/**
 * Parse and validate compass JSON.
 *
 * @throws ApiError(400) with a corrective example on bad input
 */
export function parseCompassSpec(raw: string | null): CompassSpec {
  if (raw === null || raw === '') {
    throw new ApiError(400, `Missing data. Use ?type=compass&${COMPASS_EXAMPLE} — or ?d= with {"up":"自己","right":"他人"}`);
  }
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    throw new ApiError(400, `"d" is not valid JSON. Example: {"up":"自己","right":"他人","down":"组织","left":"环境"}`);
  }
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    throw new ApiError(400, `compass spec must be an object like {"up":"自己","right":"他人"}`);
  }
  const o = obj as Record<string, unknown>;

  const arm = (v: unknown, dir: string): CompassArm | undefined => {
    if (v === undefined || v === null || v === '') return undefined;
    if (typeof v === 'string') {
      const at = v.indexOf(':');
      return at < 0
        ? { label: clip(v.trim(), LABEL_MAX) }
        : { label: clip(v.slice(0, at).trim(), LABEL_MAX), note: clip(v.slice(at + 1).trim(), NOTE_MAX) };
    }
    if (typeof v !== 'object' || Array.isArray(v)) {
      throw new ApiError(400, `"${dir}" must be a string or {"label":...,"note":...}`);
    }
    const a = v as Record<string, unknown>;
    const out: CompassArm = {};
    if (a.label !== undefined && a.label !== '') {
      if (typeof a.label !== 'string') throw new ApiError(400, `"${dir}.label" must be a string`);
      out.label = clip(a.label, LABEL_MAX);
    }
    if (a.note !== undefined && a.note !== '') {
      if (typeof a.note !== 'string') throw new ApiError(400, `"${dir}.note" must be a string`);
      out.note = clip(a.note, NOTE_MAX);
    }
    return out.label || out.note ? out : undefined;
  };

  const spec: CompassSpec = {};
  if (o.title !== undefined) {
    if (typeof o.title !== 'string') throw new ApiError(400, `"title" must be a string`);
    spec.title = clip(o.title, LIMITS.title);
  }
  if (o.center !== undefined && o.center !== '') {
    if (typeof o.center !== 'string') throw new ApiError(400, `"center" must be a string`);
    spec.center = clip(o.center, CENTER_MAX);
  }
  for (const dir of DIRS) {
    const a = arm(o[dir], dir);
    if (a) spec[dir] = a;
  }
  if (!spec.up && !spec.right && !spec.down && !spec.left) {
    throw new ApiError(400, `compass needs at least one direction — e.g. {"up":"自己","right":"他人"}`);
  }
  return spec;
}
