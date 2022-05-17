import { createMemo, For, Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { isFunction } from '_common/utils/isFunction';
import { Icon, IconName } from '_common/components/Icon';
import { Select, Option } from '_common/components/Select';
import { Divider } from '_common/components/Divider';
import type { ExpenseCategory } from 'generated/capital';

import css from './SelectExpenseCategory.css';

interface SelectExpenseCategoryProps {
  name?: string;
  icon?: keyof typeof IconName;
  value: string | undefined;
  items: readonly ExpenseCategory[];
  placeholder?: string;
  error?: boolean;
  loading?: boolean;
  disabled?: boolean;
  createName?: string;
  isDisableCategory?: (categoryId: string) => boolean;
  onChange: (value: string) => void;
  onCreate?: () => void;
}

export function SelectExpenseCategory(props: Readonly<SelectExpenseCategoryProps>) {
  const showCreate = createMemo(
    () =>
      Boolean(props.createName) &&
      isFunction(props.onCreate) &&
      props.items.every((item) => item.categoryName !== props.createName),
  );

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
      popupClass={css.popup}
      popupPrefix={
        <Show when={showCreate()}>
          <button class={css.create} onClick={() => props.onCreate!()}>
            <Icon name="add-circle-outline" size="sm" class={css.icon} />
            <Text message="Create {name}" name={props.createName!} />
          </button>
          <Divider />
        </Show>
      }
      valueRender={(id) => props.items.find((item) => item.expenseCategoryId === id)?.categoryName || ''}
      onChange={props.onChange}
    >
      <For each={props.items}>
        {(item) => (
          <Option value={item.expenseCategoryId!} disabled={props.isDisableCategory?.(item.expenseCategoryId!)}>
            <span>{item.categoryName}</span>
            <Show when={item.pathSegments?.length && Boolean(item.pathSegments[0])}>
              <Text message={`in {path}`} path={item.pathSegments!.join(' > ')} class={css.path!} />
            </Show>
          </Option>
        )}
      </For>
    </Select>
  );
}
