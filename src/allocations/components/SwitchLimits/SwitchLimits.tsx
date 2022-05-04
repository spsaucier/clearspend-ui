import { createMemo } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { join } from '_common/utils/join';
import { SwitchBox } from 'app/components/SwitchBox';
import { FormItem } from '_common/components/Form';
import { formatCurrency } from '_common/api/intl/formatCurrency';
import type { Amount } from 'generated/capital';
import { InputCurrency } from '_common/components/InputCurrency';

import { LimitPeriod } from '../../types';
import type { Limits } from '../../types';

import css from './SwitchLimits.css';

interface SwitchLimitsProps {
  name: string;
  value: Readonly<Limits>;
  maxAmount?: Readonly<Amount>;
  class?: string;
  onChange: (value: Limits) => void;
}

export function SwitchLimits(props: Readonly<SwitchLimitsProps>) {
  const i18n = useI18n();
  const maxAmount = createMemo(() => props.maxAmount?.amount && formatCurrency(props.maxAmount.amount));

  const onEnableChange = (name: LimitPeriod) => {
    return (enabled: boolean) => {
      props.onChange({ ...props.value, [name]: enabled ? { amount: '' } : undefined });
    };
  };

  const onLimitChange = (name: LimitPeriod) => {
    return (amount: string) => {
      props.onChange({ ...props.value, [name]: { amount } });
    };
  };

  return (
    <div class={join(css.root, props.class)}>
      <SwitchBox
        checked={Boolean(props.value[LimitPeriod.DAILY])}
        label={<Text message="Daily limit" />}
        onChange={onEnableChange(LimitPeriod.DAILY)}
        name={`${props.name}-daily-limit`}
      >
        <FormItem
          label={<Text message="Amount" />}
          extra={maxAmount() ? <Text message="Max value: {amount}" amount={maxAmount()!} /> : undefined}
        >
          <InputCurrency
            name={`${props.name}-daily-limit-amount`}
            placeholder={String(i18n.t('Enter amount'))}
            value={props.value[LimitPeriod.DAILY]?.amount || ''}
            onChange={onLimitChange(LimitPeriod.DAILY)}
          />
        </FormItem>
      </SwitchBox>
      <SwitchBox
        checked={Boolean(props.value[LimitPeriod.MONTHLY])}
        label={<Text message="Monthly limit" />}
        onChange={onEnableChange(LimitPeriod.MONTHLY)}
        name={`${props.name}-monthly-limit`}
      >
        <FormItem
          label={<Text message="Amount" />}
          extra={maxAmount() ? <Text message="Max value: {amount}" amount={maxAmount()!} /> : undefined}
        >
          <InputCurrency
            name={`${props.name}-monthly-limit-amount`}
            placeholder={String(i18n.t('Enter amount'))}
            value={props.value[LimitPeriod.MONTHLY]?.amount || ''}
            onChange={onLimitChange(LimitPeriod.MONTHLY)}
          />
        </FormItem>
      </SwitchBox>
      <SwitchBox
        checked={Boolean(props.value[LimitPeriod.INSTANT])}
        label={<Text message="Transaction limit" />}
        onChange={onEnableChange(LimitPeriod.INSTANT)}
        name={`${props.name}-transaction-limit`}
      >
        <FormItem
          label={<Text message="Amount" />}
          extra={maxAmount() ? <Text message="Max value: {amount}" amount={maxAmount()!} /> : undefined}
        >
          <InputCurrency
            name={`${props.name}-instant-limit-amount`}
            placeholder={String(i18n.t('Enter amount'))}
            value={props.value[LimitPeriod.INSTANT]?.amount || ''}
            onChange={onLimitChange(LimitPeriod.INSTANT)}
          />
        </FormItem>
      </SwitchBox>
    </div>
  );
}
