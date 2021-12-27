import { colord } from 'colord';

const COLOR = '#44F075';
const COLOR_STEP = 0.1;

export function getChartColor(index: number): string {
  return colord(COLOR)
    .darken(index * COLOR_STEP)
    .toHex();
}
