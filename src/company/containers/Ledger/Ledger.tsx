import { storage } from '_common/api/storage';
import { useMediaContext } from '_common/api/media/context';
import { DEFAULT_PAGE_SIZE } from '_common/components/Pagination';
import { useLedger } from 'app/stores/ledger';
import { extendPageSize, onPageSizeChange } from 'app/utils/pageSizeParam';
import { LedgerData } from 'transactions/containers/LedgerData';
import { LEDGER_PAGE_SIZE_STORAGE_KEY, DEFAULT_LEDGER_PARAMS } from 'transactions/constants';

export function Ledger() {
  const media = useMediaContext();

  const store = useLedger({
    params: extendPageSize(DEFAULT_LEDGER_PARAMS, storage.get(LEDGER_PAGE_SIZE_STORAGE_KEY, DEFAULT_PAGE_SIZE)),
  });

  return (
    <LedgerData
      loading={store.loading}
      error={store.error}
      table={media.large}
      params={store.params}
      data={store.data}
      onReload={store.reload}
      onChangeParams={onPageSizeChange(store.setParams, (size) => storage.set(LEDGER_PAGE_SIZE_STORAGE_KEY, size))}
    />
  );
}
