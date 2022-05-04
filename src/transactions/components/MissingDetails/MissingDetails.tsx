import { createMemo, Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { Popover } from '_common/components/Popover';
import { Icon } from '_common/components/Icon';
import { join } from '_common/utils/join';
import type { LedgerActivityResponse, LedgerMerchantAccount, Merchant } from 'generated/capital';

import { isActivityType } from '../../utils/isActivityType';
import { isAllowedReceipts } from '../../utils/isAllowedReceipts';

import css from './MissingDetails.css';

interface MissingDetailsProps {
  data: Readonly<LedgerActivityResponse & { merchant?: Merchant }>;
  checkMerchant?: boolean;
}

export function MissingDetails(props: Readonly<MissingDetailsProps>) {
  const expenseMissing = createMemo(() => !props.data.expenseDetails?.expenseCategoryId);
  const merchantMissing = createMemo(() => props.checkMerchant && !props.data.merchant?.name);

  const receiptMissing = createMemo(() => {
    const account = props.data.targetAccount;
    const isMerchant = props.data.merchant || account?.type === 'MERCHANT';

    return (
      isMerchant &&
      isAllowedReceipts((account as LedgerMerchantAccount | undefined)?.merchantInfo, props.data.status) &&
      !props.data.receipt?.receiptId?.length
    );
  });

  const validType = createMemo(() => props.data.status !== 'DECLINED' && props.data.type !== 'NETWORK_REFUND');

  const foreignCurrency = createMemo(() => {
    const currency = props.data.amount?.currency;
    return Boolean(currency) && currency !== 'USD';
  });

  return (
    <Show
      when={
        isActivityType(props.data.type) &&
        (foreignCurrency() || (validType() && (receiptMissing() || expenseMissing() || merchantMissing())))
      }
    >
      <Popover
        balloon
        trigger="hover"
        position="bottom-right"
        content={
          <div class={css.popupContent}>
            <Show when={foreignCurrency()}>
              <Text message="Foreign currency." />
            </Show>
            <Show when={validType()}>
              <Show when={expenseMissing()}>
                <Text message="Expense category is missing." />
              </Show>
              <Show when={receiptMissing()}>
                <Text message="Receipt is missing." />
              </Show>
              <Show when={merchantMissing()}>
                <Text message="Vendor is missing." />
              </Show>
            </Show>
          </div>
        }
      >
        {(args) => (
          <div {...args} class={css.root}>
            <Show when={foreignCurrency()}>
              <Icon name="globe" class={css.icon} />
            </Show>
            <Show when={validType()}>
              <Show when={expenseMissing()}>
                <Icon name="tag" class={join(css.icon, css.expense)} />
              </Show>
              <Show when={receiptMissing()}>
                <Icon name="receipt" class={css.icon} />
              </Show>
              <Show when={merchantMissing()}>
                <Icon name="channel-ecommerce" class={css.icon} />
              </Show>
            </Show>
          </div>
        )}
      </Popover>
    </Show>
  );
}
