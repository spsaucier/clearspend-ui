import { Text } from 'solid-i18n';
import { For } from 'solid-js';

import type { Setter } from '_common/types/common';
import { createForm, Form, FormItem } from '_common/components/Form';
import { InputCurrency } from '_common/components/InputCurrency';
import { Checkbox, CheckboxGroup } from '_common/components/Checkbox';
import { SelectDateRange } from '_common/components/SelectDateRange';
import { FilterBox } from 'app/components/FilterBox';
import { FiltersControls } from 'app/components/FiltersControls';
import type { LedgerActivityRequest } from 'generated/capital';
import { LEDGER_ACTIVITY_TYPES } from 'transactions/constants';

import { convertFormData, getFormOptions } from './utils';
import type { FormValues } from './types';

import css from './LedgerFilters.css';

interface LedgerFiltersProps {
  params: LedgerActivityRequest;
  onChangeParams: Setter<Readonly<LedgerActivityRequest>>;
  onReset: () => void;
}

export function LedgerFilters(props: Readonly<LedgerFiltersProps>) {
  const { values, handlers } = createForm<FormValues>(getFormOptions(props.params));
  const applyFilters = () => props.onChangeParams((prev) => ({ ...prev, ...convertFormData(values()) }));

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
          <CheckboxGroup value={values().types} onChange={handlers.types}>
            <For each={Object.entries(LEDGER_ACTIVITY_TYPES)}>
              {(type) => <Checkbox value={type[0]}>{type[1]}</Checkbox>}
            </For>
          </CheckboxGroup>
        </FilterBox>
        <FilterBox title={<Text message="Date Range" />}>
          <SelectDateRange value={values().date} maxDate={new Date()} onChange={handlers.date} />
        </FilterBox>
      </Form>
      <FiltersControls onReset={props.onReset} onConfirm={applyFilters} />
    </div>
  );
}
