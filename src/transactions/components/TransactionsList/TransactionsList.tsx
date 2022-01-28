import { Show, For, createMemo } from 'solid-js';
import { useI18n, Text, DateTime } from 'solid-i18n';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import type { StoreSetter } from '_common/utils/store';
import { DateFormat } from '_common/api/intl/types';
import { InputSearch } from '_common/components/InputSearch';
import { Tag } from '_common/components/Tag';
import { Icon } from '_common/components/Icon';
import { changeRequestSearch } from 'app/utils/changeRequestSearch';
import { Empty } from 'app/components/Empty';
import type { AccountActivityRequest, PagedDataAccountActivityResponse } from 'generated/capital';

import css from './TransactionsList.css';

interface TransactionsListProps {
  params: Readonly<AccountActivityRequest>;
  data: PagedDataAccountActivityResponse;
  onChangeParams: StoreSetter<Readonly<AccountActivityRequest>>;
}

export function TransactionsList(props: Readonly<TransactionsListProps>) {
  const i18n = useI18n();

  return (
    <div>
      <InputSearch
        delay={400}
        value={props.params.searchText}
        placeholder={String(i18n.t('Search Transactions...'))}
        class={css.search}
        onSearch={changeRequestSearch(props.onChangeParams)}
      />
      <Show
        when={props.data.content?.length}
        fallback={<Empty message={<Text message="There are no transactions" />} />}
      >
        <For each={props.data.content}>
          {(item) => {
            const date = createMemo(() => new Date(item.activityTime || ''));

            return (
              <div class={css.item}>
                <div class={css.icon} />
                <div>
                  <div class={css.category}>{item.merchant?.name || '--'}</div>
                  <div class={css.date}>
                    <DateTime date={date()} />
                  </div>
                </div>
                <div class={css.side}>
                  <Tag size="sm" type="success">
                    <Icon name="confirm" size="sm" />
                    {formatCurrency(item.amount?.amount || 0)}
                  </Tag>
                  <div class={css.time}>
                    <DateTime date={date()} preset={DateFormat.time} />
                  </div>
                </div>
              </div>
            );
          }}
        </For>
      </Show>
    </div>
  );
}
