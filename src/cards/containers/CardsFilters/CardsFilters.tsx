import { Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { Form, FormItem } from '_common/components/Form';
import { Input } from '_common/components/Input';
import { InputCurrency } from '_common/components/InputCurrency';
import { Checkbox, CheckboxGroup } from '_common/components/Checkbox';
import { FilterBox } from 'app/components/FilterBox';
import { FiltersControls } from 'app/components/FiltersControls';

import css from './CardsFilters.css';

interface CardsFiltersProps {
  exclude?: 'allocations' | 'users';
  onClose: () => void;
}

// TODO: Upgrade after API comes
export function CardsFilters(props: Readonly<CardsFiltersProps>) {
  const onReset = () => {
    props.onClose();
  };

  return (
    <Form class={css.root}>
      <div class={css.content}>
        <Show when={props.exclude !== 'allocations'}>
          <FilterBox title={<Text message="Allocations" />}>
            <Input placeholder="Search by allocation name" />
          </FilterBox>
        </Show>
        <FilterBox title={<Text message="Balance" />}>
          <div class={css.balance}>
            <FormItem label={<Text message="Min value" />}>
              <InputCurrency placeholder="0" />
            </FormItem>
            <FormItem label={<Text message="Max value" />}>
              <InputCurrency placeholder="0" />
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
          </CheckboxGroup>
        </FilterBox>
        <FilterBox title={<Text message="Card Type" />}>
          <CheckboxGroup>
            <Checkbox value="PLASTIC">
              <Text message="Physical" />
            </Checkbox>
            <Checkbox value="VIRTUAL">
              <Text message="Virtual" />
            </Checkbox>
          </CheckboxGroup>
        </FilterBox>
        <Show when={props.exclude !== 'users'}>
          <FilterBox title={<Text message="Employees" />}>
            <Input placeholder="Search by employee name" />
          </FilterBox>
        </Show>
      </div>
      <FiltersControls onReset={onReset} onConfirm={onReset} />
    </Form>
  );
}
