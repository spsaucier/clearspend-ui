import type { Setter } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import type { StoreSetter } from '_common/utils/store';
import { Data } from 'app/components/Data';
import type {
  AccountActivityRequest,
  AccountActivityResponse,
  PagedDataAccountActivityResponse,
} from 'generated/capital';

import { TransactionsList } from '../TransactionsList';
import { TransactionsTable } from '../TransactionsTable';

interface TransactionsDataProps {
  table?: boolean;
  loading: boolean;
  error: unknown;
  params: Readonly<AccountActivityRequest>;
  data: Readonly<PagedDataAccountActivityResponse> | null;
  onRowClick?: (transaction: AccountActivityResponse) => void;
  onCardClick?: (id: string) => void;
  onReload: () => Promise<unknown>;
  onChangeParams: Setter<Readonly<AccountActivityRequest>> | StoreSetter<Readonly<AccountActivityRequest>>;
}

export function TransactionsData(props: Readonly<TransactionsDataProps>) {
  return (
    <Data data={props.data} loading={props.loading} error={props.error} onReload={props.onReload}>
      <Dynamic
        component={props.table ? TransactionsTable : TransactionsList}
        data={props.data!}
        params={props.params}
        onCardClick={props.onCardClick}
        onRowClick={props.onRowClick}
        onChangeParams={props.onChangeParams}
      />
    </Data>
  );
}
