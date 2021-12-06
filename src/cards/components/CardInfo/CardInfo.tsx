import { Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import { Icon } from '_common/components/Icon';
import { formatName } from 'employees/utils/formatName';
import { allocationWithID } from 'allocations/utils/allocationWithID';
import type { Allocation } from 'allocations/types';
import type { User } from 'employees/types';

import { BalanceInfo } from '../BalanceInfo';

import css from './CardInfo.css';

interface CardInfoProps {
  user: Readonly<User>;
  allocation: Readonly<Allocation>;
  allocations: readonly Readonly<Allocation>[];
}

export function CardInfo(props: Readonly<CardInfoProps>) {
  return (
    <div class={css.root}>
      <div class={css.item}>
        <h4 class={css.title}>
          <Text message="Available Balance" />
        </h4>
        <div class={css.value}>
          <strong>{formatCurrency(props.allocation.account.ledgerBalance.amount)}</strong>
          <BalanceInfo />
        </div>
        <Text message="Monthly limit: {amount}" amount={formatCurrency(0)} class={css.note!} />
      </div>
      <div class={css.item}>
        <h4 class={css.title}>
          <Text message="Allocation" />
        </h4>
        <div class={css.value}>
          <strong class={css.name}>{props.allocation.name}</strong>
          <Icon name="chevron-right" class={css.chevron} />
        </div>
        <Show when={props.allocation.parentAllocationId}>
          <span class={css.note}>
            {props.allocations.find(allocationWithID(props.allocation.parentAllocationId))?.name}
          </span>
        </Show>
      </div>
      <div class={css.item}>
        <h4 class={css.title}>
          <Text message="Employee" />
        </h4>
        <div class={css.value}>
          <strong class={css.name}>{formatName(props.user)}</strong>
          <Icon name="chevron-right" class={css.chevron} />
        </div>
        <span class={css.note}>{props.user.email}</span>
      </div>
    </div>
  );
}
