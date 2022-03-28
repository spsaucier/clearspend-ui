import { Text, useI18n } from 'solid-i18n';
import { batch, createMemo, createSignal, For, Show } from 'solid-js';
import { createStore, DeepReadonly } from 'solid-js/store';

import { Empty } from 'app/components/Empty';
import { InputSearch } from '_common/components/InputSearch';
import { Table, TableColumn } from '_common/components/Table';
import type { ExpenseCategory } from 'generated/capital';
import { useExpenseCategories } from 'accounting/stores/expenseCategories';
import { Button } from '_common/components/Button';
import { Icon } from '_common/components/Icon';
import { join } from '_common/utils/join';
import { wrapAction } from '_common/utils/wrapAction';

import type {
  FlattenedIntegrationAccount,
  IntegrationAccount,
  IntegrationExpenseAccountMapping,
} from '../ChartOfAccountsData/types';
import { SelectExpenseCategory, SelectExpenseCategoryOption } from '../SelectExpenseCategory';
import { CancelConfirmationButton } from '../CancelConfirmationButton';

import { flattenNestedIntegrationAccounts, generateInitialCategoryMap, getAccountType } from './utils';
import { IntegrationAccountMapping, NestedLevels } from './types';

import css from './ChartOfAccountsTable.css';

interface ChartOfAccountsTableProps {
  data: IntegrationAccount[];
  onSave: (mappings: Readonly<IntegrationAccountMapping | null>[]) => void;
  mappings?: IntegrationExpenseAccountMapping[] | undefined;
  onCancel?: () => void;
  onSkip?: () => void;
  setShowRoadblock?: (newValue: boolean) => void;
  setRoadblockRequestParameters?: (newValue: DeepReadonly<IntegrationAccountMapping | null>[]) => void;
  setUnselectedCategories?: (newValue: (string | undefined)[]) => void;
  saveOnChange: boolean;
}

export function ChartOfAccountsTable(props: Readonly<ChartOfAccountsTableProps>) {
  const i18n = useI18n();
  const expenseCategories = useExpenseCategories({ initValue: [] });

  const initialState = generateInitialCategoryMap(props.data);
  const [state, setState] = createStore(initialState);
  const selectedCategories = createMemo(() => Object.values(state).map((mapping) => mapping?.expenseCategoryId));
  const flattenedData = createMemo(() => {
    return flattenNestedIntegrationAccounts(props.data);
  });

  const handleSave = async () => {
    const requestParams = Object.values(state).filter(
      (value) => value != null && (value.expenseCategoryId || value.expenseCategoryName),
    );
    const unmappedCategories = expenseCategories.data?.filter(
      (category) => !selectedCategories().includes(category.expenseCategoryId),
    );
    if (
      unmappedCategories !== undefined &&
      unmappedCategories.length !== 0 &&
      props.setUnselectedCategories &&
      props.setRoadblockRequestParameters &&
      props.setShowRoadblock
    ) {
      props.setShowRoadblock(true);
      props.setUnselectedCategories(unmappedCategories.map((category) => category.expenseCategoryId));
      props.setRoadblockRequestParameters(requestParams);
    } else {
      await props.onSave(requestParams);
    }
  };
  const [savingMapping, saveMapping] = wrapAction(handleSave);

  const getNestedCSSlevel = (account: FlattenedIntegrationAccount) => {
    switch (account.level) {
      case NestedLevels.Three:
        return css.nestedLevel3;
      case NestedLevels.Four:
        return css.nestedLevel4;
      case NestedLevels.Five:
        return css.nestedLevel5;
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
        const existingMap = props.mappings?.find((mapping) => mapping.accountRef === item.id);
        const initValue = existingMap
          ? expenseCategories.data?.find((ec) => ec.expenseCategoryId === existingMap.expenseCategoryId)
          : undefined;
        if (initValue) setState(item.id, { accountRef: item.id, expenseCategoryId: initValue.expenseCategoryId });
        const [expenseCategory, setExpenseCategory] = createSignal<ExpenseCategory | undefined>(initValue);
        if (item.hasChildren) {
          return <></>;
        }
        return (
          <div class={css.expenseCategoryCell}>
            <SelectExpenseCategory
              value={expenseCategory()}
              createNewName={item.name}
              onChange={(ec) => {
                batch(() => {
                  setExpenseCategory(ec);
                  setState(item.id, {
                    accountRef: item.id,
                    expenseCategoryId: ec?.expenseCategoryId,
                    expenseCategoryName: ec?.categoryName,
                  });
                });
                if (props.saveOnChange) {
                  saveMapping();
                }
              }}
            >
              <For each={expenseCategories.data}>
                {(ec) => (
                  <SelectExpenseCategoryOption
                    value={ec}
                    disabled={selectedCategories().includes(ec.expenseCategoryId)}
                  >
                    {ec.categoryName}
                  </SelectExpenseCategoryOption>
                )}
              </For>
            </SelectExpenseCategory>
            <div class={css.cancel}>
              <Show when={expenseCategory() !== undefined}>
                <Button
                  icon="cancel"
                  view="ghost"
                  class={css.cancelIcon}
                  onClick={() => {
                    batch(() => {
                      setExpenseCategory(undefined);
                      setState(item.id, null);
                    });
                    if (props.saveOnChange) {
                      saveMapping();
                    }
                  }}
                />
              </Show>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div class={css.tableContainer}>
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
          <Table columns={columns} data={flattenedData()} cellClass={css.cell} />
        </div>
        <Show when={!props.saveOnChange}>
          <div class={css.tableButtons}>
            <Show when={!!props.onCancel}>
              <CancelConfirmationButton onCancel={props.onCancel!} />
            </Show>
            <Show when={!!props.onSkip}>
              <Button onClick={props.onSkip}>
                <Text message="Skip Setup" />
              </Button>
            </Show>
            <Button
              loading={savingMapping()}
              disabled={savingMapping()}
              class={css.done}
              type="primary"
              icon={{ name: 'confirm', pos: 'right' }}
              onClick={saveMapping}
            >
              <Text message="Done" />
            </Button>
          </div>
        </Show>
      </Show>
    </div>
  );
}
