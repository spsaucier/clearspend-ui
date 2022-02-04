import { useMediaContext } from '_common/api/media/context';
import { useResource } from '_common/utils/useResource';
import { getAccountActivity } from 'app/services/activity';
import { TransactionsData } from 'transactions/components/TransactionsData';
import { DEFAULT_ACTIVITY_PARAMS } from 'employees/containers/Transactions/Transactions';

interface TransactionsProps {
  allocationId: string;
}

export function Transactions(props: Readonly<TransactionsProps>) {
  const media = useMediaContext();

  const [cards, status, params, setParams, reload] = useResource(getAccountActivity, {
    ...DEFAULT_ACTIVITY_PARAMS,
    allocationId: props.allocationId,
  });

  return (
    <TransactionsData
      table={media.wide}
      loading={status().loading}
      error={status().error}
      params={params()}
      data={cards()}
      onReload={reload}
      onChangeParams={setParams}
    />
  );
}
