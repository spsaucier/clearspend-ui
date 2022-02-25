import { Text, useI18n } from 'solid-i18n';
import { batch, createMemo, createSignal, For, Show } from 'solid-js';
import { createStore } from 'solid-js/store';

import { Empty } from 'app/components/Empty';
import { InputSearch } from '_common/components/InputSearch';
import { Table, TableColumn } from '_common/components/Table';
import type { ExpenseCategory } from 'generated/capital';
import { useExpenseCategories } from 'accounting/stores/expenseCategories';
import { Button } from '_common/components/Button';
import { Icon } from '_common/components/Icon';
import { join } from '_common/utils/join';

import type { FlattenedIntegrationAccount, IntegrationAccount } from '../ChartOfAccountsData/types';
import { SelectExpenseCategory, SelectExpenseCategoryOption } from '../SelectExpenseCategory';

import { flattenNestedIntegrationAccounts, generateInitialCategoryMap, getAccountType } from './utils';
import { NestedLevels } from './types';

import css from './ChartOfAccountsTable.css';

interface ChartOfAccountsTableProps {
  data: IntegrationAccount[];
}

export function ChartOfAccountsTable(props: Readonly<ChartOfAccountsTableProps>) {
  const i18n = useI18n();
  const expenseCategories = useExpenseCategories({ initValue: [] });

  const initialState = generateInitialCategoryMap(props.data);
  const [state, setState] = createStore(initialState);
  const selectedCategories = createMemo(() => Object.values(state).map((mapping) => mapping?.categoryIconRef));
  const flattenedData = createMemo(() => flattenNestedIntegrationAccounts(props.data));
  // const isComplete = createMemo(() => Object.keys(state).reduce<boolean>((prev, curr) => prev && !!state[curr], true));

  const getNestedCSSlevel = (account: FlattenedIntegrationAccount) => {
    switch (account.level) {
      case NestedLevels.Three:
        return css.nestedLevel3;
      case NestedLevels.Four:
        return css.nestedLevel4;
      default:
        return undefined;
    }
  };

  const columns: readonly Readonly<TableColumn<FlattenedIntegrationAccount>>[] = [
    {
      name: 'accountName',
      title: (
        <div class={css.columnTitle}>
          <Text message="Quickbooks chart of Accounts" />
        </div>
      ),
      render: (item) => {
        return (
          <div class={join(css.nestedLevel, getNestedCSSlevel(item))}>
            {item.level > 1 && <Icon name="l-tab" style={{ color: 'transparent' }} />}
            <Text message={item.name} />
          </div>
        );
      },
    },
    {
      name: 'type',
      title: (
        <div class={css.columnTitle}>
          <Text message="Type" />
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
      render: (item) => {
        const [expenseCategory, setExpenseCategory] = createSignal<ExpenseCategory | undefined>(undefined);
        return (
          <div class={css.expenseCategoryCell}>
            <SelectExpenseCategory
              value={expenseCategory()}
              onChange={(ec) => {
                batch(() => {
                  setExpenseCategory(ec);
                  setState(item.id, {
                    accountRef: item.id,
                    categoryIconRef: ec?.iconRef,
                  });
                });
              }}
            >
              <For each={expenseCategories.data}>
                {(ec) => (
                  <SelectExpenseCategoryOption value={ec} disabled={selectedCategories().includes(ec.iconRef)}>
                    {ec.categoryName}
                  </SelectExpenseCategoryOption>
                )}
              </For>
            </SelectExpenseCategory>
            <Button
              class={css.cancel}
              icon="cancel"
              view="ghost"
              onClick={() => {
                batch(() => {
                  setExpenseCategory(undefined);
                  setState(item.id, null);
                });
              }}
            />
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
          <Table columns={columns} data={flattenedData()} tdClass={css.cell} />
        </div>
        <div class={css.tableButtons}>
          <Button view="ghost">
            <Text message="Cancel" />
          </Button>
          <Button
            class={css.done}
            type="primary"
            icon={{ name: 'confirm', pos: 'right' }}
            onClick={() => {
              // TODO
            }}
            // disabled={!isComplete()}
          >
            <Text message="Done" />
          </Button>
        </div>
      </Show>
    </div>
  );
}
