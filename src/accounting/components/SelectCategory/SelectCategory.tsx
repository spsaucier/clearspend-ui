import { For } from 'solid-js';

import { Select, Option } from '_common/components/Select';
import type { CodatCategory } from 'generated/capital';
import type { IconName } from '_common/components/Icon';

interface SelectClassProps {
  items: Readonly<CodatCategory[]>;
  name?: string;
  icon?: keyof typeof IconName;
  value?: string | undefined;
  placeholder?: string;
  error?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onChange?: (value: string | undefined) => void;
  categoryName?: string | undefined;
}

export function SelectCategory(props: SelectClassProps) {
  return (
    <Select
      closeOnClear
      name={props.name}
      value={props.value}
      iconName={props.icon}
      placeholder={props.placeholder}
      error={props.error}
      loading={props.loading}
      disabled={props.disabled}
      valueRender={(id) => {
        return props.items.find((item) => item.id === id)?.categoryName || props.categoryName || '';
      }}
      onChange={props.onChange}
    >
      <For each={props.items}>
        {(item) => (
          <Option value={item.id!}>
            <span>{item.categoryName}</span>
          </Option>
        )}
      </For>
    </Select>
  );
}
