import { Show, For } from 'solid-js';
import { Text } from 'solid-i18n';

import { Icon, IconName } from '_common/components/Icon';
import { Select, Option } from '_common/components/Select';
import { Divider } from '_common/components/Divider';
import type { ExpenseCategory } from 'generated/capital';

import css from './SelectExpenseCategory.css';

interface SelectExpenseCategoryProps {
  name?: string;
  icon?: keyof typeof IconName;
  value?: string | undefined;
  items: readonly ExpenseCategory[];
  placeholder?: string;
  error?: boolean;
  loading?: boolean;
  disabled?: boolean;
  createName?: string;
  isDisableCategory?: (categoryId: string) => boolean;
  onCreate?: () => void;
  onChange?: (value: string | undefined) => void;
}

export function SelectExpenseCategory(props: Readonly<SelectExpenseCategoryProps>) {
  return (
    <Select
      closeOnClear
      name={props.name}
      value={props.value}
      iconName={props.icon}
      placeholder={props.placeholder}
      error={props.error}
      loading={props.loading}
      disabled={props.loading}
      valueRender={(id) => props.items.find((item) => item.expenseCategoryId === id)?.categoryName}
      popupRender={(list) => (
        <>
          <Show when={Boolean(props.createName && props.onCreate)}>
            <button class={css.create} onClick={props.onCreate}>
              <Icon name="add-circle-outline" size="sm" class={css.icon} />
              <Text message="Create {name}" name={props.createName!} />
            </button>
            <Divider />
          </Show>
          {list}
        </>
      )}
      onChange={props.onChange}
    >
      <For each={props.items}>
        {(item) => (
          <Option value={item.expenseCategoryId!} disabled={props.isDisableCategory?.(item.expenseCategoryId!)}>
            <span>{item.categoryName}</span>
            {item.pathSegments?.length && item.pathSegments[0] !== '' && (
              <span class={css.categoryHierarchy}>
                <Text message={`in {path}`} path={item.pathSegments.join(' > ')} />
              </span>
            )}
          </Option>
        )}
      </For>
    </Select>
  );
}
