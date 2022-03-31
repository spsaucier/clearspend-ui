import type { IPieChartData } from 'micro-charts/lib/piechart/types';

import { getChartColor } from '_common/components/Charts/utils';
import type { MerchantCategoryChartData } from 'generated/capital';

const TOTAL_PERCENT = 100;

export function calcPieChartData(data: readonly MerchantCategoryChartData[]): readonly Readonly<IPieChartData>[] {
  const total = data.reduce<number>((sum, curr) => sum + (curr.amount?.amount || 0), 0);

  return data.map((item, idx) => ({
    id: item.merchantType!,
    percent: ((item.amount?.amount || 0) * TOTAL_PERCENT) / total,
    color: getChartColor(idx),
  }));
}
