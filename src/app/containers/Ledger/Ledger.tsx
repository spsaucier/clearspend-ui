import { storage } from '_common/api/storage';
import { DEFAULT_PAGE_SIZE } from '_common/components/Pagination';
import { ALL_ALLOCATIONS } from 'allocations/components/AllocationSelect';
import { onAllocationChange } from 'allocations/utils/onAllocationChange';
import { ActivityData } from 'transactions/containers/ActivityData';
import { LEDGER_PAGE_SIZE_STORAGE_KEY, DEFAULT_ACTIVITY_PARAMS } from 'transactions/constants';

import { Data } from '../../components/Data';
import { extendPageSize, onPageSizeChange } from '../../utils/pageSizeParam';
import { useLedger } from '../../stores/ledger';
import type { DateRange } from '../../types/common';

interface LedgerProps {
  table: boolean;
  allocationId: string | undefined;
  dateRange: Readonly<DateRange>;
  class?: string;
  onCardClick?: (cardId: string) => void;
  onAllocationChange: (id: string) => void;
}

export function Ledger(props: Readonly<LedgerProps>) {
  const store = useLedger({
    params: {
      ...extendPageSize(DEFAULT_ACTIVITY_PARAMS, storage.get(LEDGER_PAGE_SIZE_STORAGE_KEY, DEFAULT_PAGE_SIZE)),
      ...props.dateRange,
      allocationId: props.allocationId,
    },
    deps: () => ({ allocationId: props.allocationId, ...props.dateRange }),
  });

  return (
    <Data data={store.data} loading={store.loading} error={store.error} onReload={store.reload}>
      <ActivityData
        table={props.table}
        loading={store.loading}
        error={store.error}
        params={store.params}
        data={store.data}
        dateRange={props.dateRange}
        class={props.class}
        onReload={store.reload}
        onUpdateTransaction={store.setData}
        onChangeParams={onAllocationChange(
          onPageSizeChange(store.setParams, (size) => storage.set(LEDGER_PAGE_SIZE_STORAGE_KEY, size)),
          (id: string | undefined) => props.onAllocationChange(id || ALL_ALLOCATIONS),
        )}
      />
    </Data>
  );
}
