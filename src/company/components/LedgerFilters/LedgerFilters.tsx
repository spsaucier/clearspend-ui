import { Text } from 'solid-i18n';

import type { Setter } from '_common/types/common';
import { createForm, Form, FormItem } from '_common/components/Form';
import { InputCurrency } from '_common/components/InputCurrency';
import { Checkbox, CheckboxGroup } from '_common/components/Checkbox';
import { SelectDateRange } from '_common/components/SelectDateRange';
import { FilterBox } from 'app/components/FilterBox';
import { FiltersControls } from 'app/components/FiltersControls';
import type { ActivityStatus } from 'transactions/types';
import type { AccountActivityRequest } from 'generated/capital';

import css from './LedgerFilters.css';

interface FormValues {
  amountMin: string;
  amountMax: string;
  status: ActivityStatus[];
  date: ReadonlyDate[];
}

interface LedgerFiltersProps {
  params: AccountActivityRequest;
  onChangeParams: Setter<Readonly<AccountActivityRequest>>;
  onReset: () => void;
}

export function LedgerFilters(props: Readonly<LedgerFiltersProps>) {
  const { values, handlers } = createForm<FormValues>({
    // TODO update when API is ready
    defaultValues: { amountMin: '', amountMax: '', status: [], date: [] },
  });

  const onApply = () => {
    // TODO update when API is ready
    // eslint-disable-next-line
    console.log(JSON.stringify(values(), null, ' '));
  };

  return (
    <div class={css.root}>
      <Form class={css.content}>
        <FilterBox title={<Text message="Amount" />}>
          <div class={css.inline}>
            <FormItem label={<Text message="Min value" />} class={css.amount}>
              <InputCurrency
                name="min-amount"
                placeholder={'0.00'}
                value={values().amountMin}
                onChange={handlers.amountMin}
              />
            </FormItem>
            <FormItem label={<Text message="Max value" />} class={css.amount}>
              <InputCurrency
                name="max-amount"
                placeholder={'0.00'}
                value={values().amountMax}
                onChange={handlers.amountMax}
              />
            </FormItem>
          </div>
        </FilterBox>
        <FilterBox title={<Text message="Payment Status" />}>
          <CheckboxGroup value={values().status} onChange={(value) => handlers.status(value as ActivityStatus[])}>
            <Checkbox value="APPROVED">
              <Text message="Approved" />
            </Checkbox>
            <Checkbox value="DECLINED">
              <Text message="Declined" />
            </Checkbox>
            <Checkbox value="PENDING">
              <Text message="Pending" />
            </Checkbox>
          </CheckboxGroup>
        </FilterBox>
        <FilterBox title={<Text message="Ledger Entry Date" />}>
          <SelectDateRange value={values().date} maxDate={new Date()} onChange={handlers.date} />
        </FilterBox>
      </Form>
      <FiltersControls onReset={props.onReset} onConfirm={onApply} />
    </div>
  );
}
