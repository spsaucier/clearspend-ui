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
  search?: string;
  data: Readonly<PagedDataAccountActivityResponse> | null;
  onReceiptClick?: (transaction: AccountActivityResponse) => void;
  onReload: () => Promise<unknown>;
  onChangeParams: Setter<Readonly<AccountActivityRequest>> | StoreSetter<Readonly<AccountActivityRequest>>;
}

export function TransactionsData(props: Readonly<TransactionsDataProps>) {
  return (
    <Data data={props.data} loading={props.loading} error={props.error} onReload={props.onReload}>
      <Dynamic
        component={props.table ? TransactionsTable : TransactionsList}
        search={props.search}
        data={props.data!}
        onReceiptClick={props.onReceiptClick}
        onChangeParams={props.onChangeParams}
      />
    </Data>
  );
}
