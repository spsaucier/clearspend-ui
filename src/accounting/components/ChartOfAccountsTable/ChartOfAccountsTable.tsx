import { Text, useI18n } from 'solid-i18n';
import { createSignal, For, Show } from 'solid-js';

import { Empty } from 'app/components/Empty';
import { InputSearch } from '_common/components/InputSearch';
import { Table, TableColumn } from '_common/components/Table';
import type { ExpenseCategory } from 'generated/capital';
import { useExpenseCategories } from 'accounting/stores/expenseCategories';

import type { IntegrationAccountResponse } from '../ChartOfAccountsData/types';
import { SelectExpenseCategory, SelectExpenseCategoryOption } from '../SelectExpenseCategory';

import { getAccountType } from './utils';

import css from './ChartOfAccountsTable.css';

interface ChartOfAccountsTableProps {
  data: IntegrationAccountResponse[];
}

export function ChartOfAccountsTable(props: Readonly<ChartOfAccountsTableProps>) {
  const i18n = useI18n();
  const expenseCategories = useExpenseCategories({ initValue: [] });

  const columns: readonly Readonly<TableColumn<IntegrationAccountResponse>>[] = [
    {
      name: 'accountName',
      title: (
        <div class={css.columnTitle}>
          <Text message="Quickbooks chart of Accounts" />
        </div>
      ),
      render: (item) => {
        return (
          <div>
            <Text message={item.name} />
          </div>
        );
      },
    },
    {
      name: 'type',
      title: (
        <div class={css.columnTitle}>
          <Text message="Type" />{' '}
        </div>
      ),
      render: (item) => {
        return (
          <div>
            <Text message={item.type} />
          </div>
        );
      },
    },
    {
      name: 'accountType',
      title: (
        <div class={css.columnTitle}>
          <Text message="Account Type" />
        </div>
      ),
      render: (item) => (
        <div>
          <Text message={getAccountType(item)!} />
        </div>
      ),
    },
    {
      name: 'expenseCategory',
      title: (
        <div class={css.columnTitle}>
          <Text message="ClearSpend expense category" />
        </div>
      ),
      render: () => {
        const [expenseCategory, setExpenseCategory] = createSignal<ExpenseCategory | undefined>(undefined);
        return (
          <div>
            <SelectExpenseCategory value={expenseCategory()} onChange={(ec) => setExpenseCategory(ec)}>
              <For each={expenseCategories.data}>
                {(ec) => <SelectExpenseCategoryOption value={ec}>{ec.categoryName}</SelectExpenseCategoryOption>}
              </For>
            </SelectExpenseCategory>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <InputSearch
        delay={400}
        placeholder={String(i18n.t('Search'))}
        class={css.search}
        onSearch={() => {
          // TODO
        }}
      />
      <Show when={props.data.length} fallback={<Empty message={<Text message="There are no accounts" />} />}>
        <div class={css.table}>
          <Table columns={columns} data={props.data as []} tdClass={css.cell} />
        </div>
      </Show>
    </div>
  );
}
