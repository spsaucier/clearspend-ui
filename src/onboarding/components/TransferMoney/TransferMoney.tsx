import { Text } from 'solid-i18n';

import { useMediaContext } from '_common/api/media/context';
import { formatCurrency } from '_common/api/intl/formatCurrency';
import { createForm, Form, FormItem } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Button } from '_common/components/Button';
import { Input } from '_common/components/Input';
import { Section } from 'app/components/Section';
import { useMessages } from 'app/containers/Messages/context';
import { parseAmount, formatAmount } from '_common/formatters/amount';
import { wrapAction } from '_common/utils/wrapAction';
import type { BankAccount } from 'generated/capital';

import { BankAccounts } from '../BankAccounts';

import { DEPOSIT_MIN_AMOUNT, validAmount } from './rules';

import css from './TransferMoney.css';

interface FormValues {
  amount: string;
  account: string;
}

interface TransferMoneyProps {
  accounts: readonly Readonly<BankAccount>[];
  onDeposit: (accountId: string, amount: number) => Promise<unknown>;
}

export function TransferMoney(props: Readonly<TransferMoneyProps>) {
  const media = useMediaContext();
  const messages = useMessages();
  const [loading, deposit] = wrapAction(props.onDeposit);

  const { values, errors, isDirty, handlers, wrapSubmit } = createForm<FormValues>({
    defaultValues: { amount: '', account: '' },
    rules: { amount: [validAmount], account: [required] },
  });

  const onSubmit = (data: Readonly<FormValues>) => {
    if (!loading()) {
      deposit(data.account, parseAmount(data.amount)).catch(() => {
        messages.error({ title: 'Something went wrong' });
      });
    }
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
              name="amount"
              placeholder={formatCurrency(0)}
              value={values().amount}
              formatter={formatAmount}
              error={Boolean(errors().amount)}
              onChange={handlers.amount}
            />
          </FormItem>
        </div>
      </Section>
      <Section title="Select account" class={css.section}>
        <div class={css.wrapper}>
          <FormItem error={errors().account}>
            <BankAccounts accounts={props.accounts} value={values().account} onChange={handlers.account} />
          </FormItem>
          <Button type="primary" view="ghost" icon="add" size="sm" disabled class={css.button}>
            Add New Bank Account
          </Button>
        </div>
        <Button
          type="primary"
          htmlType="submit"
          wide={media.small}
          loading={loading()}
          disabled={!isDirty() || !values().account}
          class={css.button}
        >
          Next
        </Button>
      </Section>
    </Form>
  );
}
