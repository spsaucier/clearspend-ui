import type { IPieChartData } from 'micro-charts/lib/piechart/types';

import { getChartColor } from '_common/components/Charts/utils';
import type { Allocation } from 'generated/capital';

import { getAvailableBalance } from '../../utils/getAvailableBalance';
import { getTotalAvailableBalance } from '../../utils/getTotalAvailableBalance';

const TOTAL_PERCENT = 100;

export function calcPieChartData(items: readonly Readonly<Allocation>[]): readonly Readonly<IPieChartData>[] {
  const total = getTotalAvailableBalance(items);

  return items.map((item, idx) => ({
    id: item.allocationId,
    percent: (getAvailableBalance(item) * TOTAL_PERCENT) / total,
    color: getChartColor(idx),
  }));
}
