import type { IPieChartData } from 'micro-charts/lib/piechart/types';

import { getChartColor } from '_common/components/Charts/utils';
import type { Allocation } from 'generated/capital';

const TOTAL_PERCENT = 100;

export function calcPieChartData(items: readonly Readonly<Allocation>[]): readonly Readonly<IPieChartData>[] {
  const total = items.reduce<number>((sum, curr) => sum + (curr.account.availableBalance?.amount || 0), 0);

  return items.map((item, idx) => ({
    id: item.allocationId,
    percent: ((item.account.availableBalance?.amount || 0) * TOTAL_PERCENT) / total,
    color: getChartColor(idx),
  }));
}
