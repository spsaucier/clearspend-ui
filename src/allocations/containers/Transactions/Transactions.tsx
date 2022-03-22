import { storage } from '_common/api/storage';
import { useMediaContext } from '_common/api/media/context';
import { DEFAULT_PAGE_SIZE } from '_common/components/Pagination';
import type { SetterFunc } from '_common/types/common';
import { useResource } from '_common/utils/useResource';
import { getAccountActivity } from 'app/services/activity';
import { extendPageSize, onPageSizeChange } from 'app/utils/pageSizeParam';
import { ACTIVITY_PAGE_SIZE_STORAGE_KEY, DEFAULT_ACTIVITY_PARAMS } from 'transactions/constants';
import { TransactionsData } from 'transactions/components/TransactionsData';
import type { PagedDataAccountActivityResponse, AccountActivityRequest } from 'generated/capital';

interface TransactionsProps {
  allocationId: string;
}

export function Transactions(props: Readonly<TransactionsProps>) {
  const media = useMediaContext();

  const [data, status, params, setParams, reload, mutate] = useResource(getAccountActivity, {
    ...extendPageSize(DEFAULT_ACTIVITY_PARAMS, storage.get(ACTIVITY_PAGE_SIZE_STORAGE_KEY, DEFAULT_PAGE_SIZE)),
    allocationId: props.allocationId,
  } as AccountActivityRequest);

  const onUpdateData = (setter: SetterFunc<Readonly<PagedDataAccountActivityResponse>>) => {
    mutate(setter(data()!));
  };

  return (
    <TransactionsData
      table={media.wide}
      loading={status().loading}
      error={status().error}
      params={params()}
      data={data()}
      onReload={reload}
      onChangeParams={onPageSizeChange(setParams, (size) => storage.set(ACTIVITY_PAGE_SIZE_STORAGE_KEY, size))}
      onUpdateData={onUpdateData}
    />
  );
}
