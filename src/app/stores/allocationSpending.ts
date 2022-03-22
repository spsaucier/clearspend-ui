import type { ChartDataRequest } from 'generated/capital';
import { create } from '_common/utils/store';

import { getSpendingByCategory } from '../services/activity';

export const useAllocationSpending = create((params: Readonly<Omit<ChartDataRequest, 'chartFilter'>>) =>
  getSpendingByCategory({ ...params, chartFilter: 'ALLOCATION' }),
);
