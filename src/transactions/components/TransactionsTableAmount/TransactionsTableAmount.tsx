import { formatCurrency } from '_common/api/intl/formatCurrency';
import { join } from '_common/utils/join';
import { Icon } from '_common/components/Icon';
import type { AccountActivityResponse, Amount } from 'generated/capital';
import { Tooltip } from '_common/components/Tooltip';
import { i18n } from '_common/api/intl';

import { STATUS_ICONS } from '../../constants';
import { formatActivityStatus } from '../../utils/formatActivityStatus';
import type { ActivityStatus } from '../../types';

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
  status: Required<AccountActivityResponse>['status'];
  amount: Readonly<Amount> | undefined;
  requestedAmount: Readonly<Amount> | undefined;
}

export function TransactionsTableAmount(props: Readonly<TransactionsTableAmountProps>) {
  return (
    <div class={css.root}>
      <div class={join(css.status, STATUS_COLORS[props.status])}>
        <Icon name={STATUS_ICONS[props.status]} size="sm" />
      </div>
      <Tooltip
        message={i18n.t('Held amount: {amount}', { amount: formatCurrency(props.amount?.amount || 0) })}
        disabled={props.amount?.amount === props.requestedAmount?.amount}
      >
        {(ttProps) => (
          <div {...ttProps}>
            <div class={css.amount}>{formatCurrency(props.requestedAmount?.amount || props.amount?.amount || 0)}</div>
            <div class={css.sub}>{formatActivityStatus(props.status)}</div>
          </div>
        )}
      </Tooltip>
    </div>
  );
}
