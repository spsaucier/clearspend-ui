import { colord } from 'colord';

const COLOR = '#5bea83';
const COLOR_STEP = 0.15;
const COLOR_CORRECT = 0.08;

export function getChartColor(index: number): string {
  return colord(COLOR)
    .darken(index * COLOR_STEP - Math.max(0, index - 1) * COLOR_CORRECT)
    .toHex();
}
