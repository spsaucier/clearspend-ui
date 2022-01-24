import { For, Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import { RadioGroup, Radio } from '_common/components/Radio';
import { Icon } from '_common/components/Icon';
import { formatCardNumber } from 'cards/utils/formatCardNumber';
import type { BankAccount, Allocation } from 'generated/capital';

import css from './BankAccounts.css';

export function isBankAccount(
  value: Readonly<Required<BankAccount> | Allocation>,
): value is Readonly<Required<BankAccount>> {
  return 'businessBankAccountId' in value;
}

interface BankAccountsProps {
  value?: string;
  accounts: readonly Readonly<Required<BankAccount> | Allocation>[];
  onChange?: (value: string) => void;
}

export function BankAccounts(props: Readonly<BankAccountsProps>) {
  return (
    <RadioGroup empty name="account" value={props.value} class={css.root} onChange={props.onChange}>
      <For each={props.accounts}>
        {(item) => (
          <Radio value={isBankAccount(item) ? item.businessBankAccountId : item.allocationId} class={css.item}>
            <div class={css.content}>
              <Icon name={isBankAccount(item) ? 'payment-bank' : 'allocations'} class={css.icon} />
              <div>
                <div class={css.header}>
                  <span class={css.name}>{item.name}</span>
                </div>
                <div class={css.number}>
                  <Show
                    when={isBankAccount(item)}
                    fallback={
                      <Text
                        message="Balance: {amount}"
                        amount={formatCurrency((item as Allocation).account.ledgerBalance.amount)}
                      />
                    }
                  >
                    {formatCardNumber((item as BankAccount).accountNumber)}
                  </Show>
                </div>
              </div>
            </div>
          </Radio>
        )}
      </For>
    </RadioGroup>
  );
}
