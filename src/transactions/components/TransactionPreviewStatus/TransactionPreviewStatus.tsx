import { join } from '_common/utils/join';
import { Icon } from '_common/components/Icon';
import type { AccountActivityResponse } from 'generated/capital';

import { STATUS_FILL_ICONS } from '../../constants';
import { formatActivityStatus } from '../../utils/formatActivityStatus';
import type { ActivityStatus } from '../../types';

import css from './TransactionPreviewStatus.css';

const STATUS_COLORS: Record<ActivityStatus | 'NETWORK_REFUND', string | undefined> = {
  APPROVED: css.approved,
  PROCESSED: css.approved,
  DECLINED: css.declined,
  CANCELED: css.declined,
  PENDING: undefined,
  CREDIT: undefined,
  NETWORK_REFUND: css.warning,
};

interface TransactionPreviewStatusProps {
  status: ActivityStatus;
  type?: AccountActivityResponse['type'];
}

export function TransactionPreviewStatus(props: Readonly<TransactionPreviewStatusProps>) {
  const status = props.type === 'NETWORK_REFUND' ? 'NETWORK_REFUND' : props.status;
  return (
    <div class={join(css.root, STATUS_COLORS[status])}>
      <Icon name={STATUS_FILL_ICONS[status]} size="sm" class={css.icon} />
      <span>{formatActivityStatus(status)}</span>
    </div>
  );
}
