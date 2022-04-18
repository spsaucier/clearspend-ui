import { createMemo, Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { Popover } from '_common/components/Popover';
import { Icon } from '_common/components/Icon';
import { join } from '_common/utils/join';
import type { LedgerActivityResponse, LedgerMerchantAccount } from 'generated/capital';

import { isActivityType } from '../../utils/isActivityType';
import { isAllowedReceipts } from '../../utils/isAllowedReceipts';

import css from './MissingDetails.css';

interface MissingDetailsProps {
  data: Readonly<LedgerActivityResponse>;
}

export function MissingDetails(props: Readonly<MissingDetailsProps>) {
  const expense = createMemo(() => !props.data.expenseDetails?.expenseCategoryId);

  const receipts = createMemo(() => {
    const account = props.data.targetAccount;
    return (
      account?.type === 'MERCHANT' &&
      isAllowedReceipts((account as LedgerMerchantAccount).merchantInfo, props.data.status) &&
      !props.data.receipt?.receiptId?.length
    );
  });

  return (
    <Show when={isActivityType(props.data.type) && (receipts() || expense()) && props.data.status !== 'DECLINED'}>
      <Popover
        balloon
        trigger="hover"
        position="bottom-right"
        content={
          <div class={css.popupContent}>
            <Show when={expense()}>
              <Text message="Expense category is missing." />
            </Show>
            <Show when={receipts()}>
              <Text message="Receipt is missing." />
            </Show>
          </div>
        }
      >
        {(args) => (
          <div {...args} class={css.root}>
            <Show when={expense()}>
              <Icon name="tag" class={join(css.icon, css.expense)} />
            </Show>
            <Show when={receipts()}>
              <Icon name="receipt" class={css.icon} />
            </Show>
          </div>
        )}
      </Popover>
    </Show>
  );
}
