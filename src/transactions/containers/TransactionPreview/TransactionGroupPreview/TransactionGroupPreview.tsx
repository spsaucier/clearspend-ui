import { createMemo, createSignal, For, Show } from 'solid-js';
import { Text } from 'solid-i18n';

import type { AccountActivityResponse, AuditLogDisplayValue } from 'generated/capital';
import { MerchantLogo } from 'transactions/components/MerchantLogo';
import { TransactionDateTime } from 'transactions/components/TransactionDateTime';
import { renderFormattedDate } from 'accounting/components/SyncLogTable/AuditLogTable';
import { TransactionsAmountDisplay } from 'transactions/components/TransactionsAmountDisplay';
import { useResource } from '_common/utils/useResource';
import { fetchReceipt } from 'app/services/activity';
import { ReceiptPreview } from 'transactions/components/ReceiptPreview';
import { ReceiptsModal } from 'transactions/containers/ReceiptsModal';

import css from './TransactionGroupPreview.css';

export interface TransactionGroupPreviewProps {
  transactions: Readonly<AccountActivityResponse[]>;
  auditLogDisplayDetails?: Readonly<AuditLogDisplayValue>;
  onViewSingleTransaction: (transaction: AccountActivityResponse) => void;
}

export function TransactionGroupPreview(props: Readonly<TransactionGroupPreviewProps>) {
  const transactions = createMemo(() => props.transactions);

  const receiptIds = createMemo<readonly string[]>(() =>
    props.transactions.map((t) => t.receipt?.receiptId || []).flat(),
  );
  const [receipts, status] = useResource(() => Promise.all(receiptIds().map(fetchReceipt)));

  const [initialIdx, setInitialIdx] = createSignal<number>();

  return (
    <div class={css.root}>
      <div class={css.scroll}>
        <div class={css.summary}>
          <div class={css.heading}>{props.transactions.length} transactions synced</div>
          <div class={css.name}>
            {props.auditLogDisplayDetails?.firstName} {props.auditLogDisplayDetails?.lastName}
          </div>
          <TransactionDateTime date={props.auditLogDisplayDetails?.auditTime} />
        </div>
        <For each={transactions()}>
          {(transaction: AccountActivityResponse) => {
            return (
              <div class={css.singleTransactionBlock} onClick={() => props.onViewSingleTransaction(transaction)}>
                <MerchantLogo size="lg" data={transaction.merchant!} class={css.merchantLogo} />
                <div class={css.transactionBlockSummary}>
                  <div>{transaction.merchant?.name}</div>
                  <div>{renderFormattedDate(transaction.activityTime, true)}</div>
                </div>
                <div class={css.transactionBlockAmount}>
                  <TransactionsAmountDisplay
                    showAsPill={true}
                    status={transaction.status}
                    amount={transaction.amount}
                    type={transaction.type}
                    requestedAmount={transaction.requestedAmount}
                  />
                  <div>{renderFormattedDate(transaction.activityTime, false, true)}</div>
                </div>
              </div>
            );
          }}
        </For>
      </div>
      <div class={css.container}>
        <Text message="Receipt" />
        <div class={css.previews}>
          <For each={receipts()}>
            {(receipt, i) => (
              <div class={css.previewWrap}>
                <ReceiptPreview size="lg" data={receipt} onClick={() => setInitialIdx(i())} />
              </div>
            )}
          </For>
        </div>
        <Show when={!status().loading && receipts()?.length && typeof initialIdx() !== 'undefined'}>
          <ReceiptsModal initialIdx={initialIdx()!} onClose={() => setInitialIdx()} receipts={receipts()!} />
        </Show>
      </div>
    </div>
  );
}
