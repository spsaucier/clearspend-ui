import { createMemo, createSignal, Show } from 'solid-js';
import { useI18n } from 'solid-i18n';

import { Button } from '_common/components/Button';
import type { AddChartOfAccountsMappingRequest, ExpenseCategory } from 'generated/capital';

import { SelectExpenseCategory } from '../SelectExpenseCategory';
import type { ChartOfAccountsMap, FlattenedIntegrationAccount } from '../ChartOfAccountsTable/types';

import { createFakeCategory } from './utils';

import css from './ChartOfAccountsExpenseCategory.css';

interface ChartOfAccountsExpenseCategoryProps {
  accounts: readonly Readonly<FlattenedIntegrationAccount>[];
  account: Readonly<FlattenedIntegrationAccount>;
  dataMap: ChartOfAccountsMap;
  categories: readonly Readonly<ExpenseCategory>[];
  selected: readonly (string | undefined)[];
  onChange: (id: string, data: Readonly<AddChartOfAccountsMappingRequest> | undefined) => void;
}

export function ChartOfAccountsExpenseCategory(props: Readonly<ChartOfAccountsExpenseCategoryProps>) {
  const i18n = useI18n();

  const selectedId = createMemo(() => {
    const mapItem = props.dataMap[props.account.id!];
    return mapItem?.expenseCategoryId || mapItem?.expenseCategoryName;
  });

  const [value, setValue] = createSignal<string | undefined>(selectedId());

  const categories = createMemo(() => {
    const id = selectedId();

    return id && props.categories.every((c) => c.expenseCategoryId !== id)
      ? [createFakeCategory(props.account, props.accounts), ...props.categories]
      : props.categories;
  });

  const onChange = (expenseCategoryId: string) => {
    const { id: accountRef, fullyQualifiedCategory } = props.account;
    setValue(expenseCategoryId);
    props.onChange(accountRef!, { accountRef, expenseCategoryId, fullyQualifiedCategory });
  };

  const onCreate = () => {
    const { id: accountRef, name, fullyQualifiedCategory } = props.account;
    setValue(name);
    props.onChange(accountRef!, { accountRef, expenseCategoryName: name, fullyQualifiedCategory });
  };

  const onRemove = () => {
    setValue(undefined);
    props.onChange(props.account.id!, undefined);
  };

  return (
    <div class={css.root}>
      <SelectExpenseCategory
        createName={props.account.name}
        items={categories()}
        value={value()}
        placeholder={String(i18n.t('Assign expense category'))}
        isDisableCategory={(id) => props.selected.includes(id)}
        onChange={onChange}
        onCreate={onCreate}
      />
      <div>
        <Show when={value() !== undefined}>
          <Button icon="cancel" type="primary" view="ghost" class={css.cancel} onClick={onRemove} />
        </Show>
      </div>
    </div>
  );
}
