import { createMemo, Show } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { parseAmount } from '_common/formatters/amount';
import { wrapAction } from '_common/utils/wrapAction';
import { createForm, Form, FormItem, hasErrors } from '_common/components/Form';
import { InputCurrency } from '_common/components/InputCurrency';
import { Button } from '_common/components/Button';
import { useMessages } from 'app/containers/Messages/context';
import type { Allocation, BankAccount } from 'generated/capital';
import { isBankAccount, BankAccounts } from 'onboarding/components/BankAccounts';
import { InternalBankAccount } from 'onboarding/components/InternalBankAccount/InternalBankAccount';

import css from './ManageBalanceForm.css';

export function targetById(id: string) {
  return (item: Allocation | Required<BankAccount>) => {
    return isBankAccount(item) ? item.businessBankAccountId === id : item.allocationId === id;
  };
}

interface FormValues {
  target: string;
  amount: string;
}

interface ManageBalanceFormProps {
  withdraw?: boolean;
  current: Readonly<Allocation>;
  targets: readonly Readonly<Allocation | Required<BankAccount>>[];
  onUpdate: (id: string, amount: number) => Promise<unknown>;
}

export function ManageBalanceForm(props: Readonly<ManageBalanceFormProps>) {
  const i18n = useI18n();
  const messages = useMessages();

  const [loading, update] = wrapAction(props.onUpdate);

  const { values, errors, handlers, trigger } = createForm<FormValues>({
    defaultValues: { target: '', amount: '' },
    rules: {
      amount: [
        (value: string): boolean | string => {
          const amount = parseAmount(value);
          const target = props.targets.find(targetById(values().target))!;

          return (
            (props.withdraw && amount <= props.current.account.ledgerBalance.amount) ||
            (!props.withdraw && (isBankAccount(target) || amount <= target.account.ledgerBalance.amount)) ||
            String(i18n.t('Insufficient funds.'))
          );
        },
      ],
    },
  });

  const onSubmit = () => {
    if (hasErrors(trigger())) return;
    const { target, amount } = values();
    update(target, parseAmount(amount)).catch(() => {
      messages.error({ title: i18n.t('Something went wrong') });
    });
  };

  const isValid = createMemo<boolean>(() => {
    const { target, amount } = values();
    const num = parseAmount(amount);
    return !Number.isNaN(num) && num > 0 && Boolean(target);
  });

  return (
    <>
      <Form class={css.form}>
        <Show when={!props.withdraw}>
          <FormItem multiple label={<Text message="Choose the source" />}>
            <BankAccounts value={values().target} accounts={props.targets} onChange={handlers.target} />
          </FormItem>
        </Show>
        <FormItem label={<Text message="Enter amount" />} error={errors().amount}>
          <InputCurrency
            placeholder="0"
            value={values().amount}
            error={Boolean(errors().amount)}
            onChange={handlers.amount}
          />
        </FormItem>
        <Show when={props.withdraw}>
          <FormItem multiple label={<Text message="Choose the destination" />}>
            <BankAccounts value={values().target} accounts={props.targets} onChange={handlers.target} />
          </FormItem>
        </Show>
      </Form>
      <InternalBankAccount heading={<Text message="Want to wire money?" />} />
      <Button wide type="primary" loading={loading()} disabled={!isValid()} onClick={onSubmit}>
        <Text message="Update Balance" />
      </Button>
    </>
  );
}
