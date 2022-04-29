import { storage } from '_common/api/storage';
import { useMediaContext } from '_common/api/media/context';
import { DEFAULT_PAGE_SIZE } from '_common/components/Pagination';
import { useResource } from '_common/utils/useResource';
import { getAccountActivity } from 'app/services/activity';
import { extendPageSize, onPageSizeChange } from 'app/utils/pageSizeParam';
import { ACTIVITY_PAGE_SIZE_STORAGE_KEY, DEFAULT_TRANSACTIONS_PARAMS } from 'transactions/constants';
import { TransactionsData } from 'transactions/containers/TransactionsData';
import type { AccountActivityRequest } from 'generated/capital';

interface TransactionsProps {
  userId: string;
}

export function Transactions(props: Readonly<TransactionsProps>) {
  const media = useMediaContext();

  const [data, status, params, setParams, reload, mutate] = useResource(getAccountActivity, {
    ...extendPageSize(DEFAULT_TRANSACTIONS_PARAMS, storage.get(ACTIVITY_PAGE_SIZE_STORAGE_KEY, DEFAULT_PAGE_SIZE)),
    userId: props.userId,
  } as AccountActivityRequest);

  return (
    <TransactionsData
      table={media.large}
      loading={status().loading}
      error={status().error}
      params={params()}
      data={data()}
      onReload={reload}
      onChangeParams={onPageSizeChange(setParams, (size) => storage.set(ACTIVITY_PAGE_SIZE_STORAGE_KEY, size))}
      onUpdateData={mutate}
      selectedTransactions={[]}
    />
  );
}
