import { Show, For, Switch, Match } from 'solid-js';
import { useI18n, Text, DateTime } from 'solid-i18n';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import type { Setter } from '_common/types/common';
import { DateFormat } from '_common/api/intl/types';
import { InputSearch } from '_common/components/InputSearch';
import { Tag, TagProps } from '_common/components/Tag';
import { Icon } from '_common/components/Icon';
import { changeRequestSearch } from 'app/utils/changeRequestSearch';
import { Empty } from 'app/components/Empty';
import { formatAccountNumber } from 'cards/utils/formatAccountNumber';
import type {
  LedgerActivityRequest,
  PagedDataLedgerActivityResponse,
  LedgerAllocationAccount,
  LedgerBankAccount,
  LedgerCardAccount,
  LedgerMerchantAccount,
} from 'generated/capital';

import { MerchantLogo } from '../MerchantLogo';
import { STATUS_ICONS } from '../../constants';
import type { ActivityStatus } from '../../types';

import css from './ActivityList.css';

const STATUS_TYPES: Record<ActivityStatus, Required<TagProps>['type']> = {
  APPROVED: 'success',
  PROCESSED: 'success',
  DECLINED: 'danger',
  CANCELED: 'danger',
  PENDING: 'default',
  CREDIT: 'default',
};

interface ActivityListProps {
  data: PagedDataLedgerActivityResponse;
  params: Readonly<LedgerActivityRequest>;
  class?: string;
  onRowClick?: (id: string) => void;
  onChangeParams: Setter<Readonly<LedgerActivityRequest>>;
}

export function ActivityList(props: Readonly<ActivityListProps>) {
  const i18n = useI18n();

  return (
    <div class={props.class}>
      <InputSearch
        delay={400}
        value={props.params.searchText}
        placeholder={String(i18n.t('Search transactions...'))}
        class={css.search}
        onSearch={changeRequestSearch(props.onChangeParams)}
      />
      <Show
        when={props.data.content?.length}
        fallback={<Empty message={<Text message="No Transactions have been detected" />} />}
      >
        <For each={props.data.content}>
          {(item) => {
            const account = item.targetAccount;

            return (
              <div class={css.item} onClick={() => props.onRowClick?.(item.accountActivityId!)}>
                <div classList={{ [css.iconWrap!]: account?.type !== 'MERCHANT' }}>
                  <Switch>
                    <Match when={account?.type === 'ALLOCATION'}>
                      <Icon name="allocations" class={css.icon} />
                    </Match>
                    <Match when={account?.type === 'BANK'}>
                      <Icon name="payment-bank" class={css.icon} />
                    </Match>
                    <Match when={account?.type === 'CARD'}>
                      <Icon name="card" class={css.icon} />
                    </Match>
                    <Match when={account?.type === 'MERCHANT'}>
                      <MerchantLogo data={(account as LedgerMerchantAccount).merchantInfo!} />
                    </Match>
                  </Switch>
                </div>
                <div>
                  <div class={css.name}>
                    <Switch fallback="--">
                      <Match when={account?.type === 'ALLOCATION'}>
                        {(account as LedgerAllocationAccount).allocationInfo?.name}
                      </Match>
                      <Match when={account?.type === 'BANK'}>{(account as LedgerBankAccount).bankInfo?.name}</Match>
                      <Match when={account?.type === 'CARD'}>
                        {formatAccountNumber((account as LedgerCardAccount).cardInfo?.lastFour)}
                      </Match>
                      <Match when={account?.type === 'MERCHANT'}>
                        {(account as LedgerMerchantAccount).merchantInfo?.name}
                      </Match>
                    </Switch>
                  </div>
                  <div class={css.date}>
                    <Show when={item.activityTime}>{(date) => <DateTime date={date} />}</Show>
                  </div>
                </div>
                <div class={css.side}>
                  <Tag size="sm" type={item.status && STATUS_TYPES[item.status]}>
                    <Show when={item.status}>{(status) => <Icon name={STATUS_ICONS[status]} size="sm" />}</Show>
                    {formatCurrency(item.requestedAmount?.amount || item.amount?.amount || 0)}
                  </Tag>
                  <div class={css.time}>
                    <Show when={item.activityTime}>{(date) => <DateTime date={date} preset={DateFormat.time} />}</Show>
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
