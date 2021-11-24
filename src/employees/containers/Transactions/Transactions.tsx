import { Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { Text } from 'solid-i18n';

import { getNoop } from '_common/utils/getNoop';
import { useMediaContext } from '_common/api/media/context';
import { Empty } from 'app/components/Empty';
import { TransactionsList } from 'transactions/components/TransactionsList';
import { TransactionsTable } from 'transactions/components/TransactionsTable';
import type { AccountActivityResponse } from 'app/types/activity';

import data from './mock.json';

export function Transactions() {
  const media = useMediaContext();

  return (
    <Show
      when={!!data.content.length}
      fallback={<Empty message={<Text message="There are no transactions for the selected period." />} />}
    >
      <Dynamic
        component={media.large ? TransactionsTable : TransactionsList}
        data={data as unknown as AccountActivityResponse}
        onChangeParams={getNoop()}
      />
    </Show>
  );
}
