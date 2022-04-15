import { createMemo, type Accessor } from 'solid-js';

import type { Setter } from '_common/types/common';
import { useBool } from '_common/utils/useBool';
import { getResetFilters } from 'app/utils/getResetFilters';
import type { DateRange } from 'app/types/common';
import type { AccountActivityRequest } from 'generated/capital';

import { useDateFilterHandler } from '../../../utils/useDateFilterHandler';

const FILTERS_KEYS = [
  'amount',
  'categories',
  'syncStatus',
  'statuses',
  'types',
  'userId',
  'withReceipt',
  'withoutReceipt',
] as const;

export function useTransactionsFilters(
  params: Accessor<Readonly<AccountActivityRequest>>,
  dateRange: Readonly<DateRange> | undefined,
  onChangeParams: Setter<Readonly<AccountActivityRequest>>,
  showUserFilter?: boolean,
) {
  const [showFilters, toggleFilters] = useBool();
  const [dateFilter, onChangeFilters] = useDateFilterHandler(onChangeParams, dateRange);
  const filters = createMemo<Readonly<AccountActivityRequest>>(() => ({ ...params(), ...dateFilter() }));

  const filtersKeys = createMemo(() =>
    showUserFilter ? [...FILTERS_KEYS] : [...FILTERS_KEYS.filter((f) => f !== 'userId')],
  );

  const filtersCount = createMemo(
    () =>
      filtersKeys().reduce((sum, key) => sum + Number(params()[key] !== undefined), 0) +
      Number(Boolean(dateFilter().from)),
  );

  const onResetFilters = () => {
    onChangeFilters((prev) => ({ ...prev, ...getResetFilters([...filtersKeys(), 'from', 'to']) }));
  };

  return { showFilters, toggleFilters, filtersCount, filters, onChangeFilters, onResetFilters };
}
