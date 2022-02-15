import { For, Show } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { createForm, Form, FormItem } from '_common/components/Form';
import { InputCurrency } from '_common/components/InputCurrency';
import { Checkbox, CheckboxGroup } from '_common/components/Checkbox';
import { FilterBox } from 'app/components/FilterBox';
import { FiltersControls } from 'app/components/FiltersControls';
import type { SearchCardRequest } from 'generated/capital';
import { Select, Option } from '_common/components/Select';
import { useAllocations } from 'allocations/stores/allocations';
import type { StoreSetter } from '_common/utils/store';
import { useUsersList } from 'employees/stores/usersList';
import { formatName } from 'employees/utils/formatName';

import type { CardFiltersFields } from '../../types';

import css from './CardsFilterDrawer.css';

interface FormValues {
  allocation: string;
  user: string;
}

interface CardsFilterDrawerProps {
  params: SearchCardRequest;
  omitFilters?: readonly CardFiltersFields[];
  onReset: () => void;
  onChangeParams: StoreSetter<Readonly<SearchCardRequest>>;
}

export function CardsFilterDrawer(props: Readonly<CardsFilterDrawerProps>) {
  const i18n = useI18n();
  const users = useUsersList({ initValue: [] });
  const allocations = useAllocations({ initValue: [] });

  const { values, handlers } = createForm<FormValues>({
    defaultValues: {
      allocation: props.params.allocationId || '',
      user: props.params.userId || '',
    },
  });

  const onApply = () => {
    const { allocation, user } = values();
    props.onChangeParams((prev) => ({
      ...prev,
      allocationId: allocation || undefined,
      userId: user || undefined,
    }));
  };

  return (
    <Form class={css.root}>
      <div class={css.content}>
        <Show when={!props.omitFilters?.includes('allocationId')}>
          <FilterBox title={<Text message="Allocations" />}>
            <Select
              iconName="search"
              name="allocation"
              value={values().allocation}
              placeholder={String(i18n.t('Search by allocation name'))}
              onChange={handlers.allocation}
            >
              <For each={allocations.data!}>{(item) => <Option value={item.allocationId}>{item.name}</Option>}</For>
            </Select>
          </FilterBox>
        </Show>
        <FilterBox title={<Text message="Balance" />}>
          <div class={css.balance}>
            <FormItem label={<Text message="Min value" />}>
              <InputCurrency placeholder="0.00" />
            </FormItem>
            <FormItem label={<Text message="Max value" />}>
              <InputCurrency placeholder="0.00" />
            </FormItem>
          </div>
        </FilterBox>
        <FilterBox title={<Text message="Card Status" />}>
          <CheckboxGroup>
            <Checkbox value="frozen">
              <Text message="Frozen" />
            </Checkbox>
            <Checkbox value="unfrozen">
              <Text message="Not frozen" />
            </Checkbox>
            <Checkbox value="awaiting">
              <Text message="Awaiting activation" />
            </Checkbox>
            <Checkbox value="suspended">
              <Text message="Suspended" />
            </Checkbox>
          </CheckboxGroup>
        </FilterBox>
        <FilterBox title={<Text message="Card Type" />}>
          <CheckboxGroup>
            <Checkbox value="PHYSICAL">
              <Text message="Physical" />
            </Checkbox>
            <Checkbox value="VIRTUAL">
              <Text message="Virtual" />
            </Checkbox>
          </CheckboxGroup>
        </FilterBox>
        <Show when={!props.omitFilters?.includes('userId')}>
          <FilterBox title={<Text message="Employees" />}>
            <Select
              iconName="search"
              name="employee"
              value={values().user}
              placeholder={String(i18n.t('Search by employee name'))}
              onChange={handlers.user}
            >
              <For each={users.data}>{(item) => <Option value={item.userId!}>{formatName(item)}</Option>}</For>
            </Select>
          </FilterBox>
        </Show>
      </div>
      <FiltersControls onReset={props.onReset} onConfirm={onApply} />
    </Form>
  );
}
