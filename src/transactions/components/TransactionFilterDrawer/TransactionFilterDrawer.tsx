import { createMemo, For, Show } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import type { Setter } from '_common/types/common';
import type { AccountActivityRequest } from 'generated/capital';
import { MultiSelect, Option } from '_common/components/MultiSelect';
import { CheckboxGroup, Checkbox } from '_common/components/Checkbox';
import { InputCurrency } from '_common/components/InputCurrency';
import { createForm, Form, FormItem } from '_common/components/Form';
import { Radio, RadioGroup } from '_common/components/Radio';
import { SelectDateRange } from '_common/components/SelectDateRange';
import { FilterBox } from 'app/components/FilterBox';
import { FiltersControls } from 'app/components/FiltersControls';
import { useBusiness } from 'app/containers/Main/context';
import { AllocationSelect } from 'allocations/components/AllocationSelect';
import { useExpenseCategories } from 'accounting/stores/expenseCategories';
import { useUsersList } from 'employees/stores/usersList';
import { byUserLastName } from 'allocations/components/AllocationSelect/utils';
import { formatName } from 'employees/utils/formatName';
import { Select, Option as SelectOption } from '_common/components/Select';

import { ACTIVITY_TYPE_TITLES } from '../../constants';
import type { ActivityStatus, SyncStatus } from '../../types';

import { getFormOptions, convertFormData } from './utils';
import type { FormValues } from './types';

import css from './TransactionFilterDrawer.css';

interface TransactionFilterDrawerProps {
  onChangeParams: Setter<Readonly<AccountActivityRequest>>;
  onReset: () => void;
  params: AccountActivityRequest;
  showAccountingAdminView?: boolean;
  showAllocationFilter?: boolean;
  showTypeFilter?: boolean;
  showUserFilter?: boolean;
}

export function TransactionFilterDrawer(props: Readonly<TransactionFilterDrawerProps>) {
  const i18n = useI18n();

  const { allocations } = useBusiness();
  const expenseCategories = useExpenseCategories({ initValue: [] });

  const { values, handlers } = createForm<FormValues>(getFormOptions(props.params));
  const applyFilters = () => props.onChangeParams((prev) => ({ ...prev, ...convertFormData(values()) }));
  const activeCategories = createMemo(() => expenseCategories.data?.filter((category) => category.status === 'ACTIVE'));

  const users = useUsersList({ initValue: [] });
  // TODO: Remove once we sort in BE: CAP-557
  const sortedUsers = createMemo(() => {
    return [...users.data!].sort(byUserLastName);
  });

  return (
    <div class={css.root}>
      <Form class={css.filters}>
        <Show when={props.showAllocationFilter}>
          <FilterBox title={<Text message="Allocation" />}>
            <AllocationSelect
              showAllAsOption
              items={allocations()}
              value={values().allocation}
              onChange={handlers.allocation}
            />
          </FilterBox>
        </Show>
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
        <FilterBox title={<Text message="Expense Category" />}>
          <MultiSelect
            value={values().categories}
            placeholder={String(i18n.t('Assign a category'))}
            valueRender={(name) => expenseCategories.data!.find((item) => item.categoryName === name)?.categoryName}
            onChange={handlers.categories}
          >
            <For each={activeCategories()}>
              {(item) => (
                <Option value={item.categoryName || ''}>
                  {item.status === 'DISABLED' ? 'LOCKED' : item.categoryName || ''}
                </Option>
              )}
            </For>
          </MultiSelect>
        </FilterBox>
        <Show when={props.showAccountingAdminView}>
          <FilterBox title={<Text message="Sync Status" />}>
            <CheckboxGroup
              value={values().syncStatus}
              onChange={(value) => {
                handlers.syncStatus(value as SyncStatus[]);
              }}
            >
              <Checkbox value="NOT_READY">
                <Text message="Not Ready" />
              </Checkbox>
              <Checkbox value="READY">
                <Text message="Ready" />
              </Checkbox>
              <Checkbox value="SYNCED_LOCKED">
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
              <Text message="Declined" />
            </Checkbox>
            <Checkbox value="PENDING">
              <Text message="Pending" />
            </Checkbox>
          </CheckboxGroup>
        </FilterBox>
        <FilterBox title={<Text message="Receipt" />}>
          <RadioGroup name="receipt-filter-options" value={values().hasReceipt} onChange={handlers.hasReceipt}>
            <Radio value={true}>
              <Text message="Has receipt" />
            </Radio>
            <Radio value={false}>
              <Text message="Does not have receipt" />
            </Radio>
          </RadioGroup>
        </FilterBox>
        <Show when={props.showTypeFilter}>
          <FilterBox title={<Text message="Transaction Type" />}>
            <CheckboxGroup value={values().types} onChange={handlers.types}>
              <For each={Object.entries(ACTIVITY_TYPE_TITLES)}>
                {([value, title]) => <Checkbox value={value}>{title}</Checkbox>}
              </For>
            </CheckboxGroup>
          </FilterBox>
        </Show>
        <FilterBox title={<Text message="Transaction Date" />}>
          <SelectDateRange value={values().date} maxDate={new Date()} onChange={handlers.date} />
        </FilterBox>
        <Show when={props.showUserFilter}>
          <FilterBox title={<Text message="Employees" />}>
            <Select
              name="userId"
              placeholder={String(i18n.t('Search by employee name'))}
              value={values().userId}
              onChange={handlers.userId}
            >
              <For each={sortedUsers()}>
                {(item) => <SelectOption value={item.userId!}>{formatName(item)}</SelectOption>}
              </For>
            </Select>
          </FilterBox>
        </Show>
      </Form>
      <FiltersControls onReset={props.onReset} onConfirm={applyFilters} />
    </div>
  );
}
