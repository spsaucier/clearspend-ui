import { useMediaContext } from '_common/api/media/context';
import { useResource } from '_common/utils/useResource';
import { getAccountActivity } from 'app/services/activity';
import { TransactionsData } from 'transactions/components/TransactionsData';
import type { UUIDString } from 'app/types/common';
import type { AccountActivityRequest } from 'generated/capital';

const DEFAULT_ACTIVITY_PARAMS: Readonly<AccountActivityRequest> = {
  pageRequest: {
    pageNumber: 0,
    pageSize: 10,
  },
};

interface TransactionsProps {
  cardId: UUIDString;
}

export function Transactions(props: Readonly<TransactionsProps>) {
  const media = useMediaContext();

  const [cards, status, params, setParams, reload] = useResource(getAccountActivity, {
    ...DEFAULT_ACTIVITY_PARAMS,
    cardId: props.cardId,
  });

  return (
    <TransactionsData
      table={media.large}
      loading={status().loading}
      error={status().error}
      search={params().searchText}
      data={cards()}
      onReload={reload}
      onChangeParams={setParams}
    />
  );
}
