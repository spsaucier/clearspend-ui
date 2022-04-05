import type { IPieChartData } from 'micro-charts/lib/piechart/types';

import { getChartColor } from '_common/components/Charts/utils';
import type { Allocation } from 'generated/capital';

import { getAvailableBalance } from '../../utils/getAvailableBalance';
import { getTotalAvailableBalance } from '../../utils/getTotalAvailableBalance';
import { getParentsChain } from '../../utils/getParentsChain';

import type { AllocationData, OtherData, RenderList } from './types';

const MAX_ITEMS = 6;
const TOTAL_PERCENT = 100;

export function isAllocationData(item: AllocationData | OtherData): item is AllocationData {
  return 'allocation' in item;
}

function toAllocationData(
  allocations: readonly Readonly<Allocation>[],
  item: Readonly<Allocation>,
): Readonly<AllocationData> {
  return {
    allocation: item,
    balance: getAvailableBalance(item),
    path: getParentsChain(allocations, item, false)
      .map((allocation) => allocation.name)
      .join('/'),
  };
}

export function getRenderList(
  allocations: readonly Readonly<Allocation>[],
  items: readonly Readonly<Allocation>[],
): RenderList {
  const limit = MAX_ITEMS - 1;

  const result: RenderList = (items.length > MAX_ITEMS ? items.slice(0, limit) : items).map((item) =>
    toAllocationData(allocations, item),
  );

  const rest = items.slice(limit);
  if (rest.length) result.push({ allocations: rest, balance: getTotalAvailableBalance(rest) });

  return result;
}

export function calcPieChartData(items: RenderList, total: number): readonly Readonly<IPieChartData>[] {
  return items.map((item, idx) => ({
    id: isAllocationData(item) ? item.allocation.allocationId : 'other',
    percent: (item.balance * TOTAL_PERCENT) / total,
    color: getChartColor(idx),
  }));
}
