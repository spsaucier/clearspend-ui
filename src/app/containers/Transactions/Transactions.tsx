import { storage } from '_common/api/storage';
import { DEFAULT_PAGE_SIZE } from '_common/components/Pagination';
import { ALL_ALLOCATIONS } from 'allocations/components/AllocationSelect';
import { onAllocationChange } from 'allocations/utils/onAllocationChange';
import { TransactionsData } from 'transactions/containers/TransactionsData';
import { ACTIVITY_PAGE_SIZE_STORAGE_KEY, DEFAULT_TRANSACTIONS_PARAMS } from 'transactions/constants';

import { Data } from '../../components/Data';
import { extendPageSize, onPageSizeChange } from '../../utils/pageSizeParam';
import { useActivity } from '../../stores/activity';
import type { DateRange } from '../../types/common';

interface TransactionsProps {
  table: boolean;
  allocationId: string | undefined;
  dateRange: Readonly<DateRange>;
  class?: string;
  onCardClick?: (cardId: string) => void;
  onAllocationChange: (id: string) => void;
}

export function Transactions(props: Readonly<TransactionsProps>) {
  const store = useActivity({
    params: {
      ...extendPageSize(DEFAULT_TRANSACTIONS_PARAMS, storage.get(ACTIVITY_PAGE_SIZE_STORAGE_KEY, DEFAULT_PAGE_SIZE)),
      ...props.dateRange,
      allocationId: props.allocationId,
    },
    deps: () => ({ allocationId: props.allocationId, ...props.dateRange }),
  });

  return (
    <Data data={store.data} loading={store.loading} error={store.error} onReload={store.reload}>
      <TransactionsData
        showUserFilter
        showAllocationFilter
        table={props.table}
        loading={store.loading}
        error={store.error}
        params={store.params}
        data={store.data}
        dateRange={props.dateRange}
        class={props.class}
        onReload={store.reload}
        onChangeParams={onAllocationChange(
          onPageSizeChange(store.setParams, (size) => storage.set(ACTIVITY_PAGE_SIZE_STORAGE_KEY, size)),
          (id: string | undefined) => props.onAllocationChange(id || ALL_ALLOCATIONS),
        )}
        onUpdateData={store.setData}
        selectedTransactions={[]}
      />
    </Data>
  );
}
