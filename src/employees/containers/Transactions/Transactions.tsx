import { useMediaContext } from '_common/api/media/context';
import { useResource } from '_common/utils/useResource';
import { getAccountActivity } from 'app/services/activity';
import { TransactionsData } from 'transactions/components/TransactionsData';
import type { AccountActivityRequest } from 'generated/capital';

const DEFAULT_ACTIVITY_PARAMS: Readonly<AccountActivityRequest> = {
  pageRequest: {
    pageNumber: 0,
    pageSize: 10,
  },
};

interface TransactionsProps {
  userId: string;
}

export function Transactions(props: Readonly<TransactionsProps>) {
  const media = useMediaContext();

  const [cards, status, params, setParams, reload] = useResource(getAccountActivity, {
    ...DEFAULT_ACTIVITY_PARAMS,
    userId: props.userId,
  });

  return (
    <TransactionsData
      table={media.large}
      loading={status().loading}
      error={status().error}
      search={params().searchText}
      data={cards() as {}}
      onReload={reload}
      onChangeParams={setParams}
    />
  );
}
