import { createMemo, Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import { Icon, IconName } from '_common/components/Icon';
import { Button } from '_common/components/Button';
import { formatName } from 'employees/utils/formatName';
import { TransactionPreviewStatus } from 'transactions/components/TransactionPreviewStatus';
import { TransactionDateTime } from 'transactions/components/TransactionDateTime';
import type { LedgerAccount as LedgerAccountType, LedgerActivityResponse } from 'generated/capital';

import { LedgerAccount } from '../../components/LedgerAccount';

import css from './LedgerPreview.css';

const ICONS: Readonly<Record<Required<LedgerAccountType>['type'], keyof typeof IconName>> = {
  BANK: 'payment-bank',
  MERCHANT: 'merchant-services',
  ALLOCATION: 'allocations',
  CARD: 'card',
};

interface LedgerPreviewProps {
  data: Readonly<LedgerActivityResponse>;
  onReport: () => void;
}

export function LedgerPreview(props: Readonly<LedgerPreviewProps>) {
  const icon = createMemo(() => {
    const type = props.data.targetAccount?.type;
    return type && ICONS[type];
  });

  return (
    <div class={css.root}>
      <TransactionPreviewStatus status={props.data.status!} />
      <div class={css.scroll}>
        <div class={css.header}>
          <div class={css.frame}>
            <Show when={icon()}>{(name) => <Icon name={name} size="lg" />}</Show>
          </div>
          <div class={css.amount}>{formatCurrency(props.data.amount?.amount || 0)}</div>
          <TransactionDateTime date={props.data.activityTime} class={css.date} />
        </div>
        <h4 class={css.title}>
          <Text message="Source Account" />
        </h4>
        <LedgerAccount account={props.data.sourceAccount} />
        <h4 class={css.title}>
          <Text message="Destination Account" />
        </h4>
        <LedgerAccount account={props.data.targetAccount} />
        <h4 class={css.title}>
          <Text message="Transaction Details" />
        </h4>
        <div class={css.detail}>
          <Text message="Posted On" />
          <TransactionDateTime date={props.data.activityTime} />
        </div>
        <div class={css.detail}>
          <Text message="Posted Amount" />
          <span>{formatCurrency(props.data.amount?.amount || 0)}</span>
        </div>
        <div class={css.detail}>
          <Text message="User" />
          <span>{formatName(props.data.user?.userInfo)}</span>
        </div>
      </div>
      <div class={css.actions}>
        <Button onClick={() => props.onReport()} wide icon={{ name: 'alert', pos: 'right' }}>
          <Text message="Report an issue" />
        </Button>
      </div>
    </div>
  );
}
