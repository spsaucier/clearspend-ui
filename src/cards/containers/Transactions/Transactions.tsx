import { useMediaContext } from '_common/api/media/context';
import { useResource } from '_common/utils/useResource';
import { getAccountActivity } from 'app/services/activity';
import { TransactionsData } from 'transactions/components/TransactionsData';
import { DEFAULT_ACTIVITY_PARAMS } from 'employees/containers/Transactions/Transactions';

interface TransactionsProps {
  cardId: string;
}

export function Transactions(props: Readonly<TransactionsProps>) {
  const media = useMediaContext();

  const [data, status, params, setParams, reload] = useResource(getAccountActivity, {
    ...DEFAULT_ACTIVITY_PARAMS,
    cardId: props.cardId,
  });

  return (
    <TransactionsData
      table={media.large}
      loading={status().loading}
      error={status().error}
      params={params()}
      data={data()}
      onReload={reload}
      onChangeParams={setParams}
    />
  );
}
