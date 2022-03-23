import type { ChartDataRequest } from 'generated/capital';
import { create } from '_common/utils/store';

import { getSpendingByCategory } from '../services/activity';

export const useMerchantCategorySpending = create((params: Readonly<Omit<ChartDataRequest, 'chartFilter'>>) =>
  getSpendingByCategory({ ...params, chartFilter: 'MERCHANT_CATEGORY' }),
);