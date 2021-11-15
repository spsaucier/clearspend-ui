import { For } from 'solid-js';

import { RadioGroup, Radio } from '_common/components/Radio';
import { Icon } from '_common/components/Icon';
import { Tag } from '_common/components/Tag';

import type { LinkedBankAccounts } from '../../types';

import css from './BankAccounts.css';

const NUM_MASK_LENGTH = 4;

interface BankAccountsProps {
  value?: string;
  accounts: readonly Readonly<LinkedBankAccounts>[];
  onChange?: (value: string) => void;
}

export function BankAccounts(props: Readonly<BankAccountsProps>) {
  return (
    <RadioGroup empty name="account" value={props.value} class={css.root} onChange={props.onChange}>
      <For each={props.accounts}>
        {(account) => (
          <Radio value={account.businessBankAccountId} class={css.item}>
            <div class={css.content}>
              <Icon name="payment-bank" class={css.icon} />
              <div>
                <div class={css.header}>
                  <span class={css.name}>{account.name}</span>
                  <Tag label="TODO" size="xs" class={css.type} />
                </div>
                <div class={css.number}>••••{account.accountNumber.slice(-NUM_MASK_LENGTH)}</div>
              </div>
            </div>
          </Radio>
        )}
      </For>
    </RadioGroup>
  );
}