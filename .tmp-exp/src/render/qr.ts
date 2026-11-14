// 二维码(uqr 生成,规范 qr-1 卡片样式):白卡静区 rx18 + 圆角模块 + 标题/副标题。
import { encode } from 'uqr';
import { ApiError } from '../specs/index.js';
import { r2, esc, svgDoc } from './svg.js';
import type { Skin } from '../styles/types.js';

const HEX_RE = /^#?[0-9a-fA-F]{6}$/;

export function parseColor(raw: string | null, fallback: string, name: string): string {
  if (raw === null || raw === '') return fallback;
  if (!HEX_RE.test(raw)) {
    throw new ApiError(400, `"${name}" must be a 6-digit hex color like %23123456 (note: "#" must be URL-encoded), got ${JSON.stringify(raw)}`);
  }
  return '#' + raw.replace('#', '').toLowerCase();
}

// 默认配色为 var 引用,随皮肤明暗自动切换;显式 fg/bg 参数则烘焙固定色
export const QR_DEFAULTS = { fg: 'var(--d-s1)', bg: 'var(--d-card)' } as const;
const MAX_QR_TEXT = 1000;

/**
 * Render a QR code with optional caption and subtitle.
 *
 * @param text payload, at most 1000 characters
 * @param fg module color, 6-digit hex
 * @param bg background color, 6-digit hex
 * @param caption short title line under the code
 * @param subtitle smaller unit/description line
 */
export function renderQR(text: string, fg: string, bg: string, width: number, height: number, version: number, skin: Skin, caption?: string, subtitle?: string): string {
  const qr = encode(text, { ecc: 'M', border: 0 });
  const n = qr.size;
  // 几何(规范 920×490 实测):码区 ~0.71h 高,顶部起 0.086h,卡面四周留 24,卡下标题行
  const ms = Math.min((height * 0.71) / n, (width * 0.42) / n);
  const qrW = n * ms;
  const x0 = width / 2 - qrW / 2;
  const hasCaption = !!caption || !!subtitle;
  const y0 = hasCaption ? height * 0.086 : (height - qrW) / 2;
  const pad = Math.max(16, height * 0.049);

  const parts: string[] = [`<rect x="${r2(x0 - pad)}" y="${r2(y0 - pad)}" width="${r2(qrW + pad * 2)}" height="${r2(qrW + pad * 2)}" rx="${r2(height * 0.0367)}" fill="${bg}"/>`];
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      if (qr.data[row][col]) {
        parts.push(
          `<rect x="${r2(x0 + col * ms)}" y="${r2(y0 + row * ms)}" width="${r2(ms)}" height="${r2(ms)}" rx="${r2(ms * 0.125)}" fill="${fg}"/>`,
        );
      }
    }
  }
  // 卡下标题(粗 17px)+ 副标题(灰 12px)
  if (caption) {
    parts.push(`<text x="${r2(width / 2)}" y="${r2(height * 0.902)}" text-anchor="middle" font-size="${r2(height * 0.0347)}" font-weight="700" fill="var(--d-ink)">${esc(caption)}</text>`);
  }
  if (subtitle) {
    parts.push(`<text x="${r2(width / 2)}" y="${r2(height * 0.951)}" text-anchor="middle" font-size="12" fill="var(--d-muted)">${esc(subtitle)}</text>`);
  }

  return svgDoc(width, height, 'qr', version, 'QR code', { text }, skin, parts.join(''));
}

export function requireQRText(raw: string | null): string {
  if (raw === null || raw === '') {
    throw new ApiError(400, 'Missing required query parameter "d" (the text to encode). Example: /draw?type=qr&d=hello');
  }
  if (raw.length > MAX_QR_TEXT) {
    throw new ApiError(400, `"d" for QR is limited to ${MAX_QR_TEXT} characters, got ${raw.length}`);
  }
  return raw;
}
