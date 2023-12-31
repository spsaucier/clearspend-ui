import { createMemo, For, Show } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { createForm, Form, FormItem } from '_common/components/Form';
import { InputCurrency } from '_common/components/InputCurrency';
import { Checkbox, CheckboxGroup } from '_common/components/Checkbox';
import { MultiSelect } from '_common/components/MultiSelect/MultiSelect';
import { Option } from '_common/components/MultiSelect/Option';
import { FilterBox } from 'app/components/FilterBox';
import { FiltersControls } from 'app/components/FiltersControls';
import { useBusiness } from 'app/containers/Main/context';
import { useUsersList } from 'employees/stores/usersList';
import { formatName } from 'employees/utils/formatName';
import { byUserLastName } from 'allocations/components/AllocationSelect/utils';

import { getFormOptions, convertFormData } from './utils';
import type { CardsFilterDrawerProps } from './types';

import css from './CardsFilterDrawer.css';

export function CardsFilterDrawer(props: Readonly<CardsFilterDrawerProps>) {
  const i18n = useI18n();

  const { allocations } = useBusiness();
  const users = useUsersList({ initValue: [] });

  const { values, handlers } = createForm(getFormOptions(props.params));

  const onApply = () => {
    props.onChangeParams((prev) => ({
      ...prev,
      ...convertFormData(values()),
    }));
  };

  // TODO: Remove once we sort in BE: CAP-557
  const sortedUsers = createMemo(() => [...users.data!].sort(byUserLastName));

  return (
    <Form class={css.root}>
      <div class={css.content}>
        <Show when={!props.omitFilters?.includes('allocations')}>
          <FilterBox title={<Text message="Allocations" />}>
            <MultiSelect
              name="allocations"
              value={values().allocations}
              placeholder={String(i18n.t('Search by allocation name'))}
              valueRender={(id) => allocations().find((item) => item.allocationId === id)?.name}
              onChange={handlers.allocations}
              data-name="Pick Allocations"
            >
              <For each={allocations()}>{(item) => <Option value={item.allocationId}>{item.name}</Option>}</For>
            </MultiSelect>
          </FilterBox>
        </Show>
        <FilterBox title={<Text message="Available to spend" />}>
          <div class={css.balance}>
            <FormItem label={<Text message="Min value" />}>
              <InputCurrency
                placeholder="0.00"
                name="min-amount"
                value={values().amountMin}
                onChange={handlers.amountMin}
              />
            </FormItem>
            <FormItem label={<Text message="Max value" />}>
              <InputCurrency
                placeholder="0.00"
                name="max-amount"
                value={values().amountMax}
                onChange={handlers.amountMax}
              />
            </FormItem>
          </div>
        </FilterBox>
        <FilterBox title={<Text message="Card Status" />}>
          <CheckboxGroup value={values().statuses} onChange={handlers.statuses}>
            <Checkbox value="INACTIVE">
              <Text message="Frozen / Awaiting Activation" />
            </Checkbox>
            <Checkbox value="ACTIVE">
              <Text message="Not frozen" />
            </Checkbox>
            <Checkbox value="CANCELLED">
              <Text message="Cancelled" />
            </Checkbox>
          </CheckboxGroup>
        </FilterBox>
        <FilterBox title={<Text message="Card Type" />}>
          <CheckboxGroup value={values().types} onChange={handlers.types}>
            <Checkbox value="PHYSICAL">
              <Text message="Physical" />
            </Checkbox>
            <Checkbox value="VIRTUAL">
              <Text message="Virtual" />
            </Checkbox>
          </CheckboxGroup>
        </FilterBox>
        <Show when={!props.omitFilters?.includes('users') && users.data}>
          <FilterBox title={<Text message="Employees" />}>
            <MultiSelect
              name="employees"
              value={values().users}
              placeholder={String(i18n.t('Search by employee name'))}
              valueRender={(id) => formatName(users.data!.find((item) => item.userId === id))}
              onChange={handlers.users}
            >
              <For each={sortedUsers()}>{(item) => <Option value={item.userId!}>{formatName(item)}</Option>}</For>
            </MultiSelect>
          </FilterBox>
        </Show>
      </div>
      <FiltersControls onReset={props.onReset} onConfirm={onApply} />
    </Form>
  );
}
