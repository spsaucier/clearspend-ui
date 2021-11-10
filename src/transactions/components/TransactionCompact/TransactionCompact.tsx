import { createMemo } from 'solid-js';
import { DateTime } from 'solid-i18n';

import { join } from '_common/utils/join';
import { formatCurrency } from '_common/api/intl/formatCurrency';
import { DateFormat } from '_common/api/intl/types';
import { Tag } from '_common/components/Tag';
import { Icon } from '_common/components/Icon';
import type { AccountActivity } from 'app/types/activity';

import css from './TransactionCompact.css';

interface TransactionCompactProps {
  data: Readonly<AccountActivity>;
  class?: string;
}

export function TransactionCompact(props: Readonly<TransactionCompactProps>) {
  const date = createMemo(() => new Date(props.data.activityTime));

  return (
    <div class={join(css.root, props.class)}>
      <div class={css.icon} />
      <div class={css.main}>
        <div class={css.category}>{props.data.merchant.name || '--'}</div>
        <div class={css.date}>
          <DateTime date={date()} />
        </div>
      </div>
      <div class={css.side}>
        <Tag size="sm" type="success">
          <span class={css.amount}>
            <Icon name="confirm" size="sm" />
            {formatCurrency(props.data.amount.amount)}
          </span>
        </Tag>
        <div class={css.time}>
          <DateTime date={date()} preset={DateFormat.time} />
        </div>
      </div>
    </div>
  );
}
