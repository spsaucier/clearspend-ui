import { join } from '_common/utils/join';
import { Icon } from '_common/components/Icon';

import { STATUS_FILL_ICONS } from '../../constants';
import { formatActivityStatus } from '../../utils/formatActivityStatus';
import type { ActivityStatus } from '../../types';

import css from './TransactionPreviewStatus.css';

const STATUS_COLORS: Record<ActivityStatus, string | undefined> = {
  APPROVED: css.approved,
  PROCESSED: css.approved,
  DECLINED: css.declined,
  CANCELED: css.declined,
  PENDING: undefined,
  CREDIT: undefined,
};

interface TransactionPreviewStatusProps {
  status: ActivityStatus;
}

export function TransactionPreviewStatus(props: Readonly<TransactionPreviewStatusProps>) {
  return (
    <div class={join(css.root, STATUS_COLORS[props.status])}>
      <Icon name={STATUS_FILL_ICONS[props.status]} size="sm" class={css.icon} />
      <span>{formatActivityStatus(props.status)}</span>
    </div>
  );
}
