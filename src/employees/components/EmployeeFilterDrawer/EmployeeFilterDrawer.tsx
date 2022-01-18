import { For, createSignal } from 'solid-js';
import { Text } from 'solid-i18n';

import { Button } from '_common/components/Button';
import type { StoreSetter } from '_common/utils/store';
import type { SearchUserRequest } from 'generated/capital';
import { MultiSelect, Option } from '_common/components/MultiSelect';
import { useAllocations } from 'allocations/stores/allocations';
import { Checkbox } from '_common/components/Checkbox';
import { DEFAULT_EMPLOYEE_PARAMS } from 'employees/Employees';

import css from './EmployeeFilterDrawer.css';

interface EmployeeFilterDrawerProps {
  params: SearchUserRequest;
  onChangeParams: StoreSetter<Readonly<SearchUserRequest>>;
}

export function EmployeeFilterDrawer(props: Readonly<EmployeeFilterDrawerProps>) {
  const [options, setOptions] = createSignal<{ value: string; text: string }[]>([]);
  const [allocationFilterValue, setAllocationFilterValue] = createSignal<string[]>(props.params.allocations ?? []);
  const [includeArchived, setIncludeArchived] = createSignal<boolean>(!!props.params.includeArchived);
  const [hasVirtualCard, setHasVirtualCard] = createSignal<boolean>(!!props.params.hasVirtualCard);
  const [hasPhysicalCard, setHasPhysicalCard] = createSignal<boolean>(!!props.params.hasPhysicalCard);
  const [withoutCard, setWithoutCard] = createSignal<boolean>(!!props.params.withoutCard);

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
    setHasVirtualCard(false);
    setHasPhysicalCard(false);
    setIncludeArchived(false);
    setWithoutCard(false);
    setAllocationFilterValue([]);
    props.onChangeParams({
      ...DEFAULT_EMPLOYEE_PARAMS,
    });
  };

  const applyFilters = () => {
    props.onChangeParams((prevParams) => {
      return {
        // todo: Improve once https://tranwall.atlassian.net/browse/CAP-339 is completed
        ...prevParams,
        allocations: allocationFilterValue().length > 0 ? allocationFilterValue() : undefined,
        hasPhysicalCard: hasPhysicalCard() ? true : undefined,
        hasVirtualCard: hasVirtualCard() ? true : undefined,
        includeArchived: includeArchived() ? true : undefined,
        withoutCard: withoutCard() ? true : undefined,
        pageRequest: withoutCard() ? undefined : prevParams.pageRequest,
      };
    });
  };

  return (
    <>
      <div class={css.sideBarFilters}>
        <section>
          <div class={css.sectionTitle}>Allocations</div>
          <MultiSelect
            value={allocationFilterValue()}
            onChange={setAllocationFilterValue}
            valueRender={(v) => options().find((o) => o.value === v)?.text}
          >
            <For each={options()}>
              {(o: { value: string; text: string }) => {
                return <Option value={o.value}>{o.text}</Option>;
              }}
            </For>
          </MultiSelect>
        </section>
        <section>
          <div class={css.sectionTitle}>Card Type</div>
          <Checkbox checked={hasVirtualCard()} onChange={setHasVirtualCard}>
            <Text message="Has virtual card" />
          </Checkbox>
          <Checkbox checked={hasPhysicalCard()} onChange={setHasPhysicalCard}>
            <Text message="Has physical card" />
          </Checkbox>
          <Checkbox checked={withoutCard()} onChange={setWithoutCard}>
            <Text message="Does not have any cards" />
          </Checkbox>
        </section>
      </div>
      <div class={css.controls}>
        <Button wide type="default" onClick={() => resetFilters()}>
          <Text message="Reset" />
        </Button>
        <Button wide type="primary" onClick={() => applyFilters()}>
          <Text message="Confirm" />
        </Button>
      </div>
    </>
  );
}
