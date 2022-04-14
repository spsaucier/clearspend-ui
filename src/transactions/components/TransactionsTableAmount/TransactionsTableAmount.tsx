import { Show } from 'solid-js';

import { join } from '_common/utils/join';
import { Icon } from '_common/components/Icon';
import type { AccountActivityResponse, Amount } from 'generated/capital';

import { STATUS_ICONS } from '../../constants';
import type { ActivityStatus } from '../../types';
import { ActivityAmount } from '../ActivityAmount';

import css from './TransactionsTableAmount.css';

const STATUS_COLORS: Record<ActivityStatus, string | undefined> = {
  APPROVED: css.approved,
  PROCESSED: css.approved,
  DECLINED: css.declined,
  CANCELED: css.declined,
  PENDING: undefined,
  CREDIT: undefined,
};

interface TransactionsTableAmountProps {
  status: AccountActivityResponse['status'];
  amount: Readonly<Amount> | undefined;
  requestedAmount: Readonly<Amount> | undefined;
}

export function TransactionsTableAmount(props: Readonly<TransactionsTableAmountProps>) {
  return (
    <div class={css.root}>
      <Show when={props.status}>
        {(status) => (
          <div class={join(css.status, STATUS_COLORS[status])}>
            <Icon name={STATUS_ICONS[status]} size="sm" />
          </div>
        )}
      </Show>
      <ActivityAmount
        status={props.status}
        amount={props.amount}
        amountClass={css.amount}
        requestedAmount={props.requestedAmount}
      />
    </div>
  );
}
