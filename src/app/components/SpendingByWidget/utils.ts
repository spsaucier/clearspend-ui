import type { IPieChartData } from 'micro-charts/lib/piechart/types';

import { getChartColor } from '_common/components/Charts/utils';
import type { Amount, MerchantCategoryChartData } from 'generated/capital';

export function sortByAmount<T extends { amount?: Amount }>(items: readonly T[]): readonly T[] {
  return [...items].sort((a, b) => Math.abs(b.amount?.amount || 0) - Math.abs(a.amount?.amount || 0));
}

const TOTAL_PERCENT = 100;

export function calcPieChartData(data: readonly MerchantCategoryChartData[]): readonly Readonly<IPieChartData>[] {
  const total = data.reduce<number>((sum, curr) => sum + curr.amount!.amount, 0);

  return data.map((item, idx) => ({
    id: item.merchantType!,
    percent: (item.amount!.amount * TOTAL_PERCENT) / total,
    color: getChartColor(idx),
  }));
}
