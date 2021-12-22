import { colord } from 'colord';
import type { IPieChartData } from 'micro-charts/lib/piechart/types';

import type { MerchantCategoryChartData } from 'generated/capital';

const TOTAL_PERCENT = 100;
const COLOR = '#44F075';
const COLOR_STEP = 0.1;

export function calcColor(index: number): string {
  return colord(COLOR)
    .darken(index * COLOR_STEP)
    .toHex();
}

export function calcPieChartData(data: readonly MerchantCategoryChartData[]): readonly Readonly<IPieChartData>[] {
  const total = data.reduce<number>((sum, curr) => sum + curr.amount!.amount, 0);

  return data.map((item, idx) => ({
    id: item.merchantType!,
    percent: (item.amount!.amount * TOTAL_PERCENT) / total,
    color: calcColor(idx),
  }));
}
