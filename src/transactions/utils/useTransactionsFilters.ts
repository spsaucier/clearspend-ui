import { createMemo, type Accessor } from 'solid-js';

import type { Setter } from '_common/types/common';
import { keys } from '_common/utils/keys';
import { useBool } from '_common/utils/useBool';
import { getResetFilters } from 'app/utils/getResetFilters';
import type { DateRange } from 'app/types/common';
import type { AccountActivityRequest } from 'generated/capital';

import { useDateFilterHandler } from './useDateFilterHandler';

const FILTERS_KEYS: readonly (keyof Omit<AccountActivityRequest, 'pageRequest' | 'searchText'>)[] = [
  'amount',
  'categories',
  'syncStatus',
  'statuses',
  'types',
  'userId',
  'withReceipt',
  'withoutReceipt',
];

export function useTransactionsFilters(
  params: Accessor<Readonly<AccountActivityRequest>>,
  dateRange: Readonly<DateRange> | undefined,
  onChangeParams: Setter<Readonly<AccountActivityRequest>>,
  ignoreFilterKeys?: Partial<Record<keyof AccountActivityRequest, boolean>>,
) {
  const [showFilters, toggleFilters] = useBool();
  const [dateFilter, onChangeFilters] = useDateFilterHandler(onChangeParams, dateRange);
  const filters = createMemo<Readonly<AccountActivityRequest>>(() => ({ ...params(), ...dateFilter() }));

  const filtersKeys = createMemo(() => {
    const ignoreKeys = ignoreFilterKeys && keys(ignoreFilterKeys).filter((item) => ignoreFilterKeys[item]);
    return ignoreKeys ? FILTERS_KEYS.filter((item) => !ignoreKeys.includes(item)) : FILTERS_KEYS;
  });

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
