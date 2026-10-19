// 二维码(base = 规范 qr-1 简洁蓝色:高对比蓝模块+白卡静区+标题字幕)。
import { duo, makeVariant, type Variant } from './types';
import { C_qrBlue } from './common';

export const QR_VARIANTS: Variant[] = [
  makeVariant({
    family: 'base',
    label: '简洁蓝色',
    series: [duo(C_qrBlue['blue'], C_qrBlue['blue-light'])],
    neutrals: { card: duo(C_qrBlue['canvas-light'], C_qrBlue['canvas-dark']) },
    size: [920, 490],
  }),
];
