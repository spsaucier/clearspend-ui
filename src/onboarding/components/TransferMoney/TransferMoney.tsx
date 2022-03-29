import { createSignal } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { useMediaContext } from '_common/api/media/context';
import { formatCurrency } from '_common/api/intl/formatCurrency';
import { createForm, Form, FormItem } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Button } from '_common/components/Button';
import { InputCurrency } from '_common/components/InputCurrency';
import { Section } from 'app/components/Section';
import { useMessages } from 'app/containers/Messages/context';
import { parseAmount } from '_common/formatters/amount';
import type { BankAccount } from 'generated/capital';
import { registerBankAccount } from 'onboarding/services/accounts';

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
  const i18n = useI18n();
  const media = useMediaContext();
  const messages = useMessages();

  const [loading, setLoading] = createSignal(false);

  const { values, errors, isDirty, handlers, wrapSubmit } = createForm<FormValues>({
    defaultValues: { amount: '', account: props.accounts[0]?.businessBankAccountId || '' },
    rules: { amount: [validAmount], account: [required] },
  });

  const onSubmit = async (data: Readonly<FormValues>) => {
    if (loading()) return;
    setLoading(true);

    try {
      await registerBankAccount(data.account);
      await props.onDeposit(data.account, parseAmount(data.amount)).catch((error: DepositError) => {
        messages.error({
          title: String(i18n.t('Deposit unsuccessful')),
          message: error.data.message.includes('does not have sufficient funds')
            ? String(
                i18n.t('Insufficient funds in this account for deposit of {amount}', {
                  amount: formatCurrency(parseAmount(data.amount)),
                }),
              )
            : error.data.message,
        });
        setLoading(false);
        throw error;
      });
    } catch (e: unknown) {
      setLoading(false);
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
            <InputCurrency
              name="amount"
              placeholder="0.00"
              value={values().amount}
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
        <p>
          <Text
            message={
              'By clicking Authorize Deposit, you authorize ClearSpend to debit the bank account specified ' +
              'for the amount shown above. Once authorized, this funds transfer cannot be canceled. ' +
              'Please allow up to 5 business days for this transfer to be credited to your ClearSpend account.'
            }
          />
        </p>
        <Button
          type="primary"
          htmlType="submit"
          wide={media.small}
          loading={loading()}
          disabled={!isDirty() || !values().account}
          class={css.button}
          data-name="authorize-deposit"
        >
          <Text message={`Authorize deposit`} />
        </Button>
      </Section>
    </Form>
  );
}
