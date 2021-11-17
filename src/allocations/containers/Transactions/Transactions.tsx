import { Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { getNoop } from '_common/utils/getNoop';
import { useMediaContext } from '_common/api/media/context';
import { NoTransactions } from 'transactions/components/NoTransactions';
import { TransactionsList } from 'transactions/components/TransactionsList';
import { TransactionsTable } from 'transactions/components/TransactionsTable';
import type { AccountActivityResponse } from 'app/types/activity';

import data from './mock.json';

export function Transactions() {
  const media = useMediaContext();

  return (
    <Show when={!!data.content.length} fallback={<NoTransactions />}>
      <Dynamic
        component={media.wide ? TransactionsTable : TransactionsList}
        data={data as unknown as AccountActivityResponse}
        onChangeParams={getNoop()}
      />
    </Show>
  );
}
