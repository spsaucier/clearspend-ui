import { Text } from 'solid-i18n';

import { SwitchLimits } from 'allocations/components/SwitchLimits';
import { SwitchMccCategories } from 'allocations/components/SwitchMccCategories';
import { SwitchPaymentTypes } from 'allocations/components/SwitchPaymentTypes';
import { SwitchBox } from 'app/components/SwitchBox';
import { FormHandlers, FormItem } from '_common/components/Form';
import { Icon } from '_common/components/Icon';
import type { Amount } from 'generated/capital';
import type { MccGroup } from 'transactions/types';
import type { Limits } from 'allocations/types';

import css from './LimitsForm.css';

interface FormValues {
  purchasesLimits: Readonly<Limits>;
  categories: string[];
  channels: string[];
  international: boolean;
}

interface LimitsFormProps {
  values: FormValues;
  handlers: Readonly<FormHandlers<FormValues>>;
  maxAmount?: Readonly<Amount>;
  mccCategories: readonly Readonly<MccGroup>[];
}

export const LimitsForm = (props: LimitsFormProps) => (
  <>
    <FormItem multiple label={<Text message="Purchases" />}>
      <SwitchLimits
        name="purchases"
        value={props.values.purchasesLimits}
        maxAmount={props.maxAmount}
        class={css.box}
        onChange={props.handlers.purchasesLimits}
      />
    </FormItem>
    <FormItem multiple label={<Text message="Categories" />}>
      <SwitchMccCategories
        value={props.values.categories}
        items={props.mccCategories}
        class={css.box}
        onChange={props.handlers.categories}
      />
    </FormItem>
    <FormItem multiple label={<Text message="Payment types" />}>
      <SwitchPaymentTypes value={props.values.channels} class={css.box} onChange={props.handlers.channels} />
      <SwitchBox
        name="international"
        checked={props.values.international}
        onChange={props.handlers.international}
        class={css.box}
        label={
          <>
            <span>
              <Text message="International transactions (3% fee)" />
            </span>
            <span class={css.icon}>
              <Icon size="sm" name="mcc-travel" />
            </span>
          </>
        }
      />
    </FormItem>
  </>
);
