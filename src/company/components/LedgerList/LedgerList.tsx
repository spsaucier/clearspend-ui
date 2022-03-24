import { Show, For } from 'solid-js';
import { useI18n, Text, DateTime } from 'solid-i18n';

import { DateFormat } from '_common/api/intl/types';
import { formatCurrency } from '_common/api/intl/formatCurrency';
import type { Setter } from '_common/types/common';
import { InputSearch } from '_common/components/InputSearch';
import { Icon } from '_common/components/Icon';
import { Empty } from 'app/components/Empty';
import { changeRequestSearch } from 'app/utils/changeRequestSearch';
import { LEDGER_ACTIVITY_TYPES } from 'transactions/constants';
import type { PagedDataLedgerActivityResponse, LedgerActivityRequest } from 'generated/capital';

import { renderAccount } from '../LedgerTable/LedgerTable';

import css from './LedgerList.css';

interface LedgerListProps {
  data: PagedDataLedgerActivityResponse;
  params: Readonly<LedgerActivityRequest>;
  onChangeParams: Setter<Readonly<LedgerActivityRequest>>;
}

export function LedgerList(props: Readonly<LedgerListProps>) {
  const i18n = useI18n();

  return (
    <div>
      <InputSearch
        delay={400}
        value={props.params.searchText}
        placeholder={String(i18n.t('Search ledger entries...'))}
        class={css.search}
        onSearch={changeRequestSearch(props.onChangeParams)}
      />
      <Show
        when={props.data.content?.length}
        fallback={<Empty message={<Text message="There are no ledger entries" />} />}
      >
        <For each={props.data.content}>
          {(item) => (
            <div class={css.item}>
              <div class={css.itemMain}>
                <div>
                  <div class={css.amount}>{formatCurrency(item.amount?.amount || 0)}</div>
                  {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
                  <DateTime date={item.activityTime || ''} preset={DateFormat.withTime} class={css.gray} />
                </div>
                <div class={css.right}>
                  <div class={css.user}>
                    {item.user?.userInfo?.firstName
                      ? `${item.user.userInfo.firstName} ${item.user.userInfo.lastName}`
                      : '--'}
                  </div>
                  <div class={css.gray}>{LEDGER_ACTIVITY_TYPES[item.type!]}</div>
                </div>
              </div>
              <div class={css.extra}>
                {renderAccount(item.sourceAccount, true)}
                <Icon name="arrow-down" class={css.to} />
                {renderAccount(item.targetAccount, true)}
                <Show when={item.hold?.expirationDate}>
                  <Text
                    message="Expires: {date}"
                    date={i18n.formatDateTime(item.hold?.expirationDate || '', DateFormat.withTime)}
                    class={css.expires!}
                  />
                </Show>
              </div>
            </div>
          )}
        </For>
      </Show>
    </div>
  );
}
