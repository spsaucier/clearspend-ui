import { For, createMemo } from 'solid-js';
import { DateTime } from 'solid-i18n';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import type { StoreSetter } from '_common/utils/store';
import { DateFormat } from '_common/api/intl/types';
import { Input } from '_common/components/Input';
import { Tag } from '_common/components/Tag';
import { Icon } from '_common/components/Icon';
import type { AccountActivityResponse, AccountActivityRequest } from 'app/types/activity';

import css from './TransactionsList.css';

interface TransactionsListProps {
  data: AccountActivityResponse;
  onChangeParams: StoreSetter<Readonly<AccountActivityRequest>>;
}

export function TransactionsList(props: Readonly<TransactionsListProps>) {
  return (
    <div>
      <Input
        disabled
        placeholder="Search Transactions..."
        suffix={<Icon name="search" size="sm" />}
        class={css.search}
      />
      <For each={props.data.content}>
        {(item) => {
          const date = createMemo(() => new Date(item.activityTime));

          return (
            <div class={css.item}>
              <div class={css.icon} />
              <div>
                <div class={css.category}>{item.merchant.name || '--'}</div>
                <div class={css.date}>
                  <DateTime date={date()} />
                </div>
              </div>
              <div class={css.side}>
                <Tag size="sm" type="success">
                  <Icon name="confirm" size="sm" />
                  {formatCurrency(item.amount.amount)}
                </Tag>
                <div class={css.time}>
                  <DateTime date={date()} preset={DateFormat.time} />
                </div>
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
}
