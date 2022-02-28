import { useMediaContext } from '_common/api/media/context';
import type { StoreSetterFunc } from '_common/utils/store';
import { useResource } from '_common/utils/useResource';
import { getAccountActivity } from 'app/services/activity';
import { DEFAULT_ACTIVITY_PARAMS } from 'transactions/constants';
import { TransactionsData } from 'transactions/components/TransactionsData';
import type { PagedDataAccountActivityResponse } from 'generated/capital';

interface TransactionsProps {
  cardId: string;
}

export function Transactions(props: Readonly<TransactionsProps>) {
  const media = useMediaContext();

  const [data, status, params, setParams, reload, mutate] = useResource(getAccountActivity, {
    ...DEFAULT_ACTIVITY_PARAMS,
    cardId: props.cardId,
  });

  const onUpdateData = (setter: StoreSetterFunc<Readonly<PagedDataAccountActivityResponse>>) => {
    mutate(setter(data()!));
  };

  return (
    <TransactionsData
      table={media.large}
      loading={status().loading}
      error={status().error}
      params={params()}
      data={data()}
      onReload={reload}
      onChangeParams={setParams}
      onUpdateData={onUpdateData}
    />
  );
}
