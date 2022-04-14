import { storage } from '_common/api/storage';
import { useMediaContext } from '_common/api/media/context';
import { useResource } from '_common/utils/useResource';
import { DEFAULT_PAGE_SIZE } from '_common/components/Pagination';
import { getLedgerActivity } from 'app/services/activity';
import { extendPageSize, onPageSizeChange } from 'app/utils/pageSizeParam';
import { ActivityData } from 'transactions/containers/ActivityData';
import { LEDGER_PAGE_SIZE_STORAGE_KEY, DEFAULT_ACTIVITY_PARAMS } from 'transactions/constants';
import type { LedgerActivityRequest } from 'generated/capital';

interface LedgerProps {
  allocationId: string;
}

export function Ledger(props: Readonly<LedgerProps>) {
  const media = useMediaContext();

  const [data, status, params, setParams, reload, mutate] = useResource(getLedgerActivity, {
    ...extendPageSize(DEFAULT_ACTIVITY_PARAMS, storage.get(LEDGER_PAGE_SIZE_STORAGE_KEY, DEFAULT_PAGE_SIZE)),
    allocationId: props.allocationId,
  } as LedgerActivityRequest);

  return (
    <ActivityData
      table={media.wide}
      loading={status().loading}
      error={status().error}
      params={params()}
      data={data()}
      onReload={reload}
      onUpdateTransaction={mutate}
      onChangeParams={onPageSizeChange(setParams, (size) => storage.set(LEDGER_PAGE_SIZE_STORAGE_KEY, size))}
    />
  );
}
