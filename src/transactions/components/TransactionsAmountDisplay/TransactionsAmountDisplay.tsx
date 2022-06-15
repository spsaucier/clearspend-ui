import { Show } from 'solid-js';

import { join } from '_common/utils/join';
import { Icon } from '_common/components/Icon';
import type { AccountActivityResponse, Amount } from 'generated/capital';

import { STATUS_ICONS } from '../../constants';
import type { ActivityStatus } from '../../types';
import { ActivityAmount } from '../ActivityAmount';

import css from './TransactionsAmountDisplay.css';

const STATUS_COLORS: Record<ActivityStatus | 'NETWORK_REFUND', string | undefined> = {
  APPROVED: css.approved,
  PROCESSED: css.approved,
  DECLINED: css.declined,
  CANCELED: css.declined,
  PENDING: undefined,
  CREDIT: undefined,
  NETWORK_REFUND: undefined,
};

interface TransactionsAmountDisplayProps {
  status: AccountActivityResponse['status'];
  amount: Readonly<Amount> | undefined;
  type?: AccountActivityResponse['type'];
  requestedAmount: Readonly<Amount> | undefined;
  showAsPill?: boolean;
}

export function TransactionsAmountDisplay(props: Readonly<TransactionsAmountDisplayProps>) {
  const actingStatus = props.type === 'NETWORK_REFUND' ? 'NETWORK_REFUND' : props.status!;
  return (
    <div class={join(css.root, props.showAsPill && css.pill, props.showAsPill && STATUS_COLORS[actingStatus])}>
      <Show when={props.status}>
        <div class={join(css.status, props.showAsPill && css.plainStatus, STATUS_COLORS[actingStatus])}>
          <Icon name={STATUS_ICONS[actingStatus]} size="sm" />
        </div>
      </Show>
      <ActivityAmount
        status={props.status}
        type={props.type}
        amount={props.amount}
        amountClass={css.amount}
        requestedAmount={props.requestedAmount}
      />
    </div>
  );
}
