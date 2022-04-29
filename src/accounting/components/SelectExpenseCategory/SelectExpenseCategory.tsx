import { For } from 'solid-js';
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
  onChange?: (value: string | undefined) => void;
  categoryName?: string | undefined;
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
      disabled={props.disabled}
      valueRender={(id) => {
        return id === props.createName
          ? props.createName
          : props.items.find((item) => item.expenseCategoryId === id)?.categoryName || props.categoryName || '';
      }}
      onChange={props.onChange}
    >
      <For each={props.items}>
        {(item) => (
          <Option value={item.expenseCategoryId!} disabled={props.isDisableCategory?.(item.expenseCategoryId!)}>
            {item.expenseCategoryId === props.createName ? (
              <div>
                <div class={css.create}>
                  <Icon name="add-circle-outline" size="sm" class={css.icon} />
                  <Text message="Create {name}" name={props.createName!} />
                </div>
                <Divider />
              </div>
            ) : (
              <span>{item.categoryName}</span>
            )}
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
