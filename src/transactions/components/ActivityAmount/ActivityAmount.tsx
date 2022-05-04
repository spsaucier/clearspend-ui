import { Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import { Tooltip } from '_common/components/Tooltip';
import type { LedgerActivityResponse, Amount, AccountActivityResponse } from 'generated/capital';
import { join } from '_common/utils/join';

import { formatActivityStatus } from '../../utils/formatActivityStatus';

import css from './ActivityAmount.css';

const VISIBLE_STATUSES: readonly LedgerActivityResponse['status'][] = ['PENDING', 'DECLINED'];

interface ActivityAmountProps {
  status: LedgerActivityResponse['status'];
  amount: Readonly<Amount> | undefined;
  amountClass?: string;
  requestedAmount: Readonly<Amount> | undefined;
  type?: AccountActivityResponse['type'];
}

export function ActivityAmount(props: Readonly<ActivityAmountProps>) {
  return (
    <Tooltip
      message={<Text message="Held amount: {amount}" amount={formatCurrency(props.amount?.amount || 0)} />}
      disabled={props.amount?.amount === props.requestedAmount?.amount}
    >
      {(args) => (
        <div {...args}>
          <div class={props.amountClass}>
            {formatCurrency(props.requestedAmount?.amount || props.amount?.amount || 0)}
          </div>
          <Show when={VISIBLE_STATUSES.includes(props.status)}>
            <div class={join(css.status, props.status === 'DECLINED' && css.statusError)}>
              {formatActivityStatus(props.status)}
            </div>
          </Show>
          <Show when={props.type === 'NETWORK_REFUND'}>
            <div class={join(css.status, css.statusWarning)}>{formatActivityStatus('NETWORK_REFUND')}</div>
          </Show>
        </div>
      )}
    </Tooltip>
  );
}
