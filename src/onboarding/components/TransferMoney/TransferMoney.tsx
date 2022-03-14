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
import { i18n } from '_common/api/intl';
import { registerBankAccount } from 'onboarding/services/accounts';
import { completeOnboarding } from 'allocations/services';

import { BankAccounts } from '../BankAccounts';

import { DEPOSIT_MIN_AMOUNT, validAmount } from './rules';

import css from './TransferMoney.css';

interface FormValues {
  amount: string;
  account: string;
}

interface TransferMoneyProps {
  accounts: readonly Readonly<Required<BankAccount>>[];
  onDeposit: (accountId: string, amount: number) => Promise<unknown>;
}

interface DepositError {
  data: {
    message: string;
  };
}

export function TransferMoney(props: Readonly<TransferMoneyProps>) {
  const media = useMediaContext();
  const messages = useMessages();
  const [loading, deposit] = wrapAction(props.onDeposit);

  const { values, errors, isDirty, handlers, wrapSubmit } = createForm<FormValues>({
    defaultValues: { amount: '', account: props.accounts[0]?.businessBankAccountId || '' },
    rules: { amount: [validAmount], account: [required] },
  });

  const onSubmit = async (data: Readonly<FormValues>) => {
    if (!loading()) {
      await registerBankAccount(data.account);
      await completeOnboarding();
      deposit(data.account, parseAmount(data.amount)).catch((res: DepositError) => {
        const message =
          res.data.message.indexOf('does not have sufficient funds') > -1
            ? `${String(i18n.t('Insufficient funds in this account for deposit of'))} ${formatCurrency(
                parseAmount(data.amount),
              )}`
            : res.data.message;
        messages.error({ title: 'Deposit unsuccessful', message });
      });
    }
  };

  return (
    <Form onSubmit={wrapSubmit(onSubmit)}>
      <Section
        title={<Text message="Add balance" />}
        description={
          <Text
            message="To have an active account, you need a minimum balance of {amount}."
            amount={formatCurrency(DEPOSIT_MIN_AMOUNT)}
          />
        }
        class={css.section}
      >
        <div class={css.wrapper}>
          <FormItem label={<Text message="Amount to deposit" />} error={errors().amount}>
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
      <Section title={<Text message="Funding source" />} class={css.section}>
        <div class={css.wrapper}>
          <FormItem error={errors().account}>
            <BankAccounts accounts={props.accounts} value={values().account} onChange={handlers.account} />
          </FormItem>
        </div>
        <Text
          message={
            'By clicking Authorize Deposit, you authorize ClearSpend to debit the bank account specified ' +
            'for the amount shown above. Once authorized, this funds transfer cannot be canceled. ' +
            'Please allow up to 5 business days for this transfer to be credited to your ClearSpend account.'
          }
        />
        <Button
          type="primary"
          htmlType="submit"
          wide={media.small}
          loading={loading()}
          disabled={!isDirty() || !values().account}
          class={css.button}
        >
          <Text message="Authorize deposit" />
        </Button>
      </Section>
    </Form>
  );
}
