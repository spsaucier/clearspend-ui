import { createSignal, For } from 'solid-js';
import { Text } from 'solid-i18n';

import { useMediaContext } from '_common/api/media/context';
import { formatCurrency } from '_common/api/intl/formatCurrency';
import { createForm, Form, FormItem } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Button } from '_common/components/Button';
import { Input } from '_common/components/Input';
import { Section } from 'app/components/Section';
import { wrapAction } from '_common/utils/wrapAction';

import { BankAccount } from '../BankAccount';
import type { BusinessBankAccount } from '../../types';

import { DEPOSIT_MIN_AMOUNT } from './rules';

import css from './TransferMoney.css';

export interface AccountsData {
  plaid: PlaidMetadata['accounts'];
  inner: readonly Readonly<BusinessBankAccount>[];
}

interface FormValues {
  amount: string;
}

interface TransferMoneyProps {
  data: Readonly<AccountsData>;
  onDeposit: (accountId: string, amount: number) => Promise<unknown>;
}

export function TransferMoney(props: Readonly<TransferMoneyProps>) {
  const media = useMediaContext();
  const [selected, setSelected] = createSignal<string>();
  const [loading, deposit] = wrapAction(props.onDeposit);

  const { values, errors, isDirty, handlers, wrapSubmit } = createForm<FormValues>({
    defaultValues: { amount: '' },
    rules: { amount: [required] },
  });

  const onSubmit = (data: Readonly<FormValues>) => {
    deposit(selected()!, parseInt(data.amount, 10)).catch(() => {
      /* TODO */
    });
  };

  return (
    <Form onSubmit={wrapSubmit(onSubmit)}>
      <Section
        title="Add balance"
        description={
          <Text
            message="To have an active account, you need a minimum balance of {amount}."
            amount={formatCurrency(DEPOSIT_MIN_AMOUNT)}
          />
        }
        class={css.section}
      >
        <div class={css.wrapper}>
          <FormItem label="Amount" error={errors().amount}>
            <Input
              placeholder="$0.00"
              value={values().amount}
              error={Boolean(errors().amount)}
              onChange={handlers.amount}
            />
          </FormItem>
        </div>
      </Section>
      <Section title="Select account" class={css.section}>
        <div class={css.wrapper}>
          <For each={props.data.plaid}>
            {(item) => (
              <BankAccount data={item} selected={selected() === item.id} class={css.account} onSelect={setSelected} />
            )}
          </For>
          <Button type="primary" ghost icon="add" size="sm" class={css.button}>
            Add New Bank Account
          </Button>
        </div>
        <Button
          type="primary"
          htmlType="submit"
          wide={media.small}
          loading={loading()}
          disabled={!isDirty() || !selected()}
          class={css.button}
        >
          Next
        </Button>
      </Section>
    </Form>
  );
}
