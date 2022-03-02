import { For, Show } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import type { StoreSetter } from '_common/utils/store';
import type { AccountActivityRequest } from 'generated/capital';
import { MultiSelect, Option } from '_common/components/MultiSelect';
import { CheckboxGroup, Checkbox } from '_common/components/Checkbox';
import { InputCurrency } from '_common/components/InputCurrency';
import { createForm, Form, FormItem } from '_common/components/Form';
import { Radio, RadioGroup } from '_common/components/Radio';
import { SelectDateRange } from '_common/components/SelectDateRange';
import { FilterBox } from 'app/components/FilterBox';
import { FiltersControls } from 'app/components/FiltersControls';
import { useAllocations } from 'allocations/stores/allocations';

import type { ActivityStatus } from '../../types';

import css from './TransactionFilterDrawer.css';

interface FormValues {
  amountMin: string;
  amountMax: string;
  categories: string[];
  syncStatus: string[];
  status: ActivityStatus[];
  hasReceipt: boolean | undefined;
  date: ReadonlyDate[];
}

interface TransactionFilterDrawerProps {
  params: AccountActivityRequest;
  showAccountingAdminView?: boolean;
  onChangeParams: StoreSetter<Readonly<AccountActivityRequest>>;
  onReset: () => void;
}

export function TransactionFilterDrawer(props: Readonly<TransactionFilterDrawerProps>) {
  const i18n = useI18n();
  const allocations = useAllocations({ initValue: [] });

  const { values, handlers } = createForm<FormValues>({
    // TODO update when API is ready
    defaultValues: {
      amountMin: '',
      amountMax: '',
      categories: [],
      syncStatus: [],
      status: [],
      hasReceipt: undefined,
      date: [],
    },
  });

  // TODO: When search filter api is ready
  const applyFilters = () => {
    // eslint-disable-next-line
    console.log(JSON.stringify(values(), null, ' '));
    props.onChangeParams((prevParams) => {
      return {
        ...prevParams,
      };
    });
  };

  return (
    <div class={css.root}>
      <Form class={css.filters}>
        <FilterBox title={<Text message="Amount" />}>
          <div class={css.minMaxInputWrapper}>
            <FormItem label={<Text message="Min value" />} class={css.inputAmount}>
              <InputCurrency
                name="min-amount"
                placeholder={'0.00'}
                value={values().amountMin}
                onChange={handlers.amountMin}
              />
            </FormItem>
            <FormItem label={<Text message="Max value" />} class={css.inputAmount}>
              <InputCurrency
                name="max-amount"
                placeholder={'0.00'}
                value={values().amountMax}
                onChange={handlers.amountMax}
              />
            </FormItem>
          </div>
        </FilterBox>
        <FilterBox title={<Text message="Categories" />}>
          <MultiSelect
            value={values().categories}
            placeholder={String(i18n.t('Search for a category'))}
            valueRender={(id) => allocations.data!.find((item) => item.allocationId === id)?.name}
            onChange={handlers.categories}
          >
            <For each={allocations.data!}>{(item) => <Option value={item.allocationId}>{item.name}</Option>}</For>
          </MultiSelect>
        </FilterBox>
        <Show when={props.showAccountingAdminView}>
          <FilterBox title={<Text message="Sync Status" />}>
            <CheckboxGroup value={values().syncStatus} onChange={handlers.syncStatus}>
              <Checkbox value="NOT_READY">
                <Text message="Not Ready" />
              </Checkbox>
              <Checkbox value="READY">
                <Text message="Ready" />
              </Checkbox>
              <Checkbox value="SYNCED">
                <Text message="Synced and Locked" />
              </Checkbox>
            </CheckboxGroup>
          </FilterBox>
        </Show>
        <FilterBox title={<Text message="Payment Status" />}>
          <CheckboxGroup value={values().status} onChange={(value) => handlers.status(value as ActivityStatus[])}>
            <Checkbox value="APPROVED">
              <Text message="Approved" />
            </Checkbox>
            <Checkbox value="DECLINED">
              <Text message="Blocked" />
            </Checkbox>
            <Checkbox value="PENDING">
              <Text message="Pending" />
            </Checkbox>
          </CheckboxGroup>
        </FilterBox>
        <FilterBox title={<Text message="Receipt" />}>
          <RadioGroup
            name="receipt-filter-options"
            value={values().hasReceipt}
            onChange={(value) => handlers.hasReceipt(value === 'true')}
          >
            <Radio value="true">
              <Text message="Has receipt" />
            </Radio>
            <Radio value="false">
              <Text message="Does not have receipt" />
            </Radio>
          </RadioGroup>
        </FilterBox>
        <FilterBox title={<Text message="Transaction Date" />}>
          <SelectDateRange value={values().date} maxDate={new Date()} onChange={handlers.date} />
        </FilterBox>
      </Form>
      <FiltersControls onReset={props.onReset} onConfirm={applyFilters} />
    </div>
  );
}
