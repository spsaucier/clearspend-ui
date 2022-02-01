import { For, createSignal } from 'solid-js';
import { Text } from 'solid-i18n';

import type { StoreSetter } from '_common/utils/store';
import type { SearchUserRequest } from 'generated/capital';
import { MultiSelect, Option } from '_common/components/MultiSelect';
import { FilterBox } from 'app/components/FilterBox';
import { FiltersControls } from 'app/components/FiltersControls';
import { useAllocations } from 'allocations/stores/allocations';
import { CheckboxGroup, Checkbox } from '_common/components/Checkbox';
import { InputCurrency } from '_common/components/InputCurrency';
import { FormItem } from '_common/components/Form';
import { Radio, RadioGroup } from '_common/components/Radio';
import { SelectDateRange } from '_common/components/SelectDateRange';

import css from './TransactionFilterDrawer.css';

// TODO: Replace with API generated one once available:
export interface SearchTransactionsRequest {
  status: 'APPROVED' | 'PENDING' | 'BLOCKED';
  minDate: string;
  maxDate: string;
  hasReceipt?: boolean;
  categories: string[];
}

interface TransactionFilterDrawerProps {
  params: SearchTransactionsRequest;
  onChangeParams: StoreSetter<Readonly<SearchUserRequest>>;
}

export function TransactionFilterDrawer(props: Readonly<TransactionFilterDrawerProps>) {
  const [options, setOptions] = createSignal<{ value: string; text: string }[]>([]);
  const [amountMin, setAmountMin] = createSignal<number>(0);
  const [amountMax, setAmountMax] = createSignal<number>(0);
  const [dateRange, setDateRange] = createSignal<ReadonlyDate[]>([]);

  const [categories, setCategories] = createSignal<string[]>([]);
  const [isApproved, setIsApproved] = createSignal<boolean>(!!(props.params.status === 'APPROVED'));
  const [isPending, setIsPending] = createSignal<boolean>(!!(props.params.status === 'PENDING'));
  const [isBlocked, setIsBlocked] = createSignal<boolean>(!!(props.params.status === 'BLOCKED'));

  useAllocations({
    initValue: [],
    onSuccess: (data) => {
      setOptions(
        data.map((allocation) => {
          return {
            value: allocation.allocationId,
            ['text']: allocation.name,
          };
        }),
      );
    },
  });

  const resetFilters = () => {
    setIsApproved(false);
    setIsBlocked(false);
    setIsPending(false);
    setAmountMin(0);
    setAmountMax(0);
    // TODO: props.onReset()
  };

  // TODO: When search filter api is ready
  const applyFilters = () => {
    props.onChangeParams((prevParams) => {
      return {
        ...prevParams,
      };
    });
  };

  return (
    <div class={css.root}>
      <div class={css.filters}>
        <FilterBox title={<Text message="Amount" />}>
          <div class={css.minMaxInputWrapper}>
            <FormItem label={<Text message="Min value" />} class={css.inputAmount}>
              <InputCurrency
                name="min amount"
                placeholder={'0.00'}
                value={amountMin()}
                onChange={(v) => setAmountMin(+v)}
              />
            </FormItem>
            <FormItem label={<Text message="Max value" />} class={css.inputAmount}>
              <InputCurrency
                name="max amount"
                value={amountMax()}
                placeholder={'0.00'}
                onChange={(v) => setAmountMax(+v)}
              />
            </FormItem>
          </div>
        </FilterBox>
        <FilterBox title={<Text message="Categories" />}>
          <MultiSelect
            value={categories()}
            onChange={setCategories}
            placeholder="Search for a category"
            valueRender={(v) => options().find((o) => o.value === v)?.text}
          >
            <For each={options()}>
              {(o: { value: string; text: string }) => {
                return <Option value={o.value}>{o.text}</Option>;
              }}
            </For>
          </MultiSelect>
        </FilterBox>
        <FilterBox title={<Text message="Payment Status" />}>
          <CheckboxGroup>
            <Checkbox checked={isApproved()} onChange={setIsApproved}>
              <Text message="Approved" />
            </Checkbox>
            <Checkbox checked={isBlocked()} onChange={setIsBlocked}>
              <Text message="Blocked" />
            </Checkbox>
            <Checkbox checked={isPending()} onChange={setIsPending}>
              <Text message="Pending" />
            </Checkbox>
          </CheckboxGroup>
        </FilterBox>
        <FilterBox title={<Text message="Receipt" />}>
          <RadioGroup name="receipt-filter-options">
            <Radio value="true">Has receipt</Radio>
            <Radio value="false">Does not have receipt</Radio>
          </RadioGroup>
        </FilterBox>
        <FilterBox title={<Text message="Transaction Date" />}>
          <SelectDateRange value={dateRange()} onChange={(dates) => setDateRange(dates)} />
        </FilterBox>
      </div>
      <FiltersControls onReset={resetFilters} onConfirm={applyFilters} />
    </div>
  );
}
