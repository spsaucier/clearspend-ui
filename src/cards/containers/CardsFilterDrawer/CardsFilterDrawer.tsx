import { createSignal, For } from 'solid-js';
import { Text } from 'solid-i18n';

import { Form, FormItem } from '_common/components/Form';
import { InputCurrency } from '_common/components/InputCurrency';
import { Checkbox, CheckboxGroup } from '_common/components/Checkbox';
import { FilterBox } from 'app/components/FilterBox';
import { FiltersControls } from 'app/components/FiltersControls';
import type { SearchCardRequest } from 'generated/capital';
import { Select, Option } from '_common/components/Select';
import { useAllocations } from 'allocations/stores/allocations';
import type { StoreSetter } from '_common/utils/store';
import { DEFAULT_CARD_PARAMS } from 'cards/Cards';
import { useUsersList } from 'employees/stores/usersList';

import css from './CardsFilterDrawer.css';

interface CardsFilterDrawerProps {
  hiddenFields?: readonly string[];
  params: SearchCardRequest;
  onChangeParams: StoreSetter<Readonly<SearchCardRequest>>;
}

export function CardsFilterDrawer(props: Readonly<CardsFilterDrawerProps>) {
  const [allocationOptions, setAllocationOptions] = createSignal<{ value: string; text: string }[]>([]);
  const [userOptions, setUserOptions] = createSignal<{ value: string; text: string }[]>([]);
  const [allocationFilterValue, setAllocationFilterValue] = createSignal<string | undefined>(props.params.allocationId);
  const [userFilterValue, setUserFilterValue] = createSignal<string | undefined>(props.params.userId);

  useAllocations({
    initValue: [],
    onSuccess: (data) => {
      setAllocationOptions(
        data.map((allocation) => {
          return {
            value: allocation.allocationId,
            ['text']: allocation.name,
          };
        }),
      );
    },
  });

  useUsersList({
    initValue: [],
    onSuccess: (data) => {
      setUserOptions(
        data.map((user) => {
          return {
            value: user.userId!,
            ['text']: `${user.firstName} ${user.lastName}`,
          };
        }),
      );
    },
  });

  const resetFilters = () => {
    setAllocationFilterValue(undefined);
    setUserFilterValue(undefined);
    props.onChangeParams({
      ...DEFAULT_CARD_PARAMS,
    });
  };

  const applyFilters = () => {
    props.onChangeParams((prevParams) => {
      return {
        ...prevParams,
        userId: userFilterValue(),
        allocationId: allocationFilterValue(),
      };
    });
  };

  return (
    <Form class={css.root}>
      <div class={css.content}>
        <FilterBox title={<Text message="Allocations" />}>
          <Select
            iconName="search"
            name="allocation"
            disabled={props.hiddenFields?.includes('allocation')}
            value={allocationFilterValue()}
            placeholder={'Search by allocation name'}
            onChange={setAllocationFilterValue}
          >
            <For each={allocationOptions()}>{(item) => <Option value={item.value}>{item.text}</Option>}</For>
          </Select>
        </FilterBox>
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
        <FilterBox title={<Text message="Employees" />}>
          <Select
            disabled={props.hiddenFields?.includes('name')}
            iconName="search"
            name="employee"
            value={userFilterValue()}
            placeholder={'Search by employee name'}
            onChange={setUserFilterValue}
          >
            <For each={userOptions()}>{(item) => <Option value={item.value}>{item.text}</Option>}</For>
          </Select>
        </FilterBox>
      </div>
      <FiltersControls onReset={() => resetFilters()} onConfirm={() => applyFilters()} />
    </Form>
  );
}
