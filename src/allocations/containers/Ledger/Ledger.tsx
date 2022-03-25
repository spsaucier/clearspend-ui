import { storage } from '_common/api/storage';
import { useMediaContext } from '_common/api/media/context';
import { useResource } from '_common/utils/useResource';
import { DEFAULT_PAGE_SIZE } from '_common/components/Pagination';
import { getLedgerActivity } from 'app/services/activity';
import { extendPageSize, onPageSizeChange } from 'app/utils/pageSizeParam';
import { LedgerData } from 'transactions/containers/LedgerData';
import { LEDGER_PAGE_SIZE_STORAGE_KEY, DEFAULT_LEDGER_PARAMS } from 'transactions/constants';
import type { LedgerActivityRequest } from 'generated/capital';

interface LedgerProps {
  allocationId: string;
}

export function Ledger(props: Readonly<LedgerProps>) {
  const media = useMediaContext();

  const [data, status, params, setParams, reload] = useResource(getLedgerActivity, {
    ...extendPageSize(DEFAULT_LEDGER_PARAMS, storage.get(LEDGER_PAGE_SIZE_STORAGE_KEY, DEFAULT_PAGE_SIZE)),
    allocationId: props.allocationId,
  } as LedgerActivityRequest);

  return (
    <LedgerData
      loading={status().loading}
      error={status().error}
      table={media.wide}
      params={params()}
      data={data()}
      onReload={reload}
      onChangeParams={onPageSizeChange(setParams, (size) => storage.set(LEDGER_PAGE_SIZE_STORAGE_KEY, size))}
    />
  );
}
