import { For } from 'solid-js';
import { Text } from 'solid-i18n';

import type { StoreSetter } from '_common/utils/store';
import type { SearchUserRequest } from 'generated/capital';
import { createForm, Form } from '_common/components/Form';
import { MultiSelect, Option } from '_common/components/MultiSelect';
import { useAllocations } from 'allocations/stores/allocations';
import { Checkbox, CheckboxGroup } from '_common/components/Checkbox';
import { FilterBox } from 'app/components/FilterBox';
import { FiltersControls } from 'app/components/FiltersControls';

import css from './EmployeeFilterDrawer.css';

enum CardType {
  virtual = 'virtual',
  physical = 'physical',
  none = 'none',
}

interface FormValues {
  allocationIDs: string[];
  cardTypes: CardType[];
}

interface EmployeeFilterDrawerProps {
  params: SearchUserRequest;
  onReset: () => void;
  onChangeParams: StoreSetter<Readonly<SearchUserRequest>>;
}

export function EmployeeFilterDrawer(props: Readonly<EmployeeFilterDrawerProps>) {
  const allocations = useAllocations({ initValue: [] });

  const { values, handlers } = createForm<FormValues>({
    defaultValues: {
      allocationIDs: props.params.allocations || [],
      cardTypes: [
        props.params.hasPhysicalCard && CardType.physical,
        props.params.hasVirtualCard && CardType.virtual,
        props.params.withoutCard && CardType.none,
      ].filter(Boolean) as CardType[],
    },
  });

  const onApply = () => {
    const { allocationIDs, cardTypes } = values();
    props.onChangeParams((prev) => ({
      ...prev,
      ...{
        // TODO: Improve once https://tranwall.atlassian.net/browse/CAP-339 is completed
        allocations: allocationIDs.length ? allocationIDs : undefined,
        hasPhysicalCard: cardTypes.includes(CardType.physical) || undefined,
        hasVirtualCard: cardTypes.includes(CardType.virtual) || undefined,
        withoutCard: cardTypes.includes(CardType.none) || undefined,
      },
    }));
  };

  return (
    <div class={css.root}>
      <Form class={css.content}>
        <FilterBox title={<Text message="Allocations" />}>
          <MultiSelect
            value={values().allocationIDs}
            onChange={handlers.allocationIDs}
            // TODO: Should it works without valueRender?!
            valueRender={(value) => allocations.data!.find((item) => item.allocationId === value)?.name}
          >
            <For each={allocations.data!}>{(item) => <Option value={item.allocationId}>{item.name}</Option>}</For>
          </MultiSelect>
        </FilterBox>
        <FilterBox title={<Text message="Card Type" />}>
          <CheckboxGroup value={values().cardTypes} onChange={(value) => handlers.cardTypes(value as CardType[])}>
            <Checkbox value={CardType.virtual}>
              <Text message="Has virtual card" />
            </Checkbox>
            <Checkbox value={CardType.physical}>
              <Text message="Has physical card" />
            </Checkbox>
            <Checkbox value={CardType.none}>
              <Text message="Does not have any cards" />
            </Checkbox>
          </CheckboxGroup>
        </FilterBox>
      </Form>
      <FiltersControls onReset={props.onReset} onConfirm={onApply} />
    </div>
  );
}
