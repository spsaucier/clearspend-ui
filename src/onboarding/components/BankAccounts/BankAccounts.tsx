import { For } from 'solid-js';

import { RadioGroup, Radio } from '_common/components/Radio';
import { Icon } from '_common/components/Icon';
import { Tag } from '_common/components/Tag';
import { formatCardNumber } from 'cards/utils/formatCardNumber';
import type { BankAccount } from 'generated/capital';

import css from './BankAccounts.css';

interface BankAccountsProps {
  value?: string;
  accounts: readonly Readonly<BankAccount>[];
  onChange?: (value: string) => void;
}

export function BankAccounts(props: Readonly<BankAccountsProps>) {
  return (
    <RadioGroup empty name="account" value={props.value} class={css.root} onChange={props.onChange}>
      <For each={props.accounts}>
        {(account) => (
          <Radio value={account.businessBankAccountId || ''} class={css.item}>
            <div class={css.content}>
              <Icon name="payment-bank" class={css.icon} />
              <div>
                <div class={css.header}>
                  <span class={css.name}>{account.name}</span>
                  <Tag label="TODO" size="xs" class={css.type} />
                </div>
                <div class={css.number}>{formatCardNumber(account.accountNumber)}</div>
              </div>
            </div>
          </Radio>
        )}
      </For>
    </RadioGroup>
  );
}
