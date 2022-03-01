import { Text } from 'solid-i18n';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import { AccountCard } from 'app/components/AccountCard';
import { TransactionPreviewStatus } from 'transactions/components/TransactionPreviewStatus';
import { TransactionDateTime } from 'transactions/components/TransactionDateTime';
import type { AccountActivityResponse } from 'generated/capital';

import css from './LedgerPreview.css';

interface LedgerPreviewProps {
  data: Readonly<AccountActivityResponse>;
}

export function LedgerPreview(props: Readonly<LedgerPreviewProps>) {
  return (
    <div class={css.root}>
      <TransactionPreviewStatus status={props.data.status!} />
      <div class={css.scroll}>
        <div class={css.header}>
          <div class={css.amount}>{formatCurrency(props.data.amount!.amount)}</div>
          <TransactionDateTime date={props.data.activityTime} class={css.date} />
        </div>
        <h4 class={css.title}>
          <Text message="Destination" />
        </h4>
        <AccountCard icon="allocations" title={props.data.accountName} text="--" />
        <h4 class={css.title}>
          <Text message="Transaction Details" />
        </h4>
        <div class={css.detail}>
          <Text message="Posted On" />
          <TransactionDateTime date={props.data.activityTime} />
        </div>
        <div class={css.detail}>
          <Text message="Posted Amount" />
          <span>{formatCurrency(props.data.amount!.amount)}</span>
        </div>
      </div>
    </div>
  );
}
