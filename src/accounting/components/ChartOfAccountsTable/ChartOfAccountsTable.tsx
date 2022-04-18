import { Text, useI18n } from 'solid-i18n';
import { batch, createMemo, createSignal, Show } from 'solid-js';
import { createStore, DeepReadonly } from 'solid-js/store';

import { Empty } from 'app/components/Empty';
import { InputSearch } from '_common/components/InputSearch';
import { Table, TableColumn } from '_common/components/Table';
import { useExpenseCategories } from 'accounting/stores/expenseCategories';
import { Button } from '_common/components/Button';
import { Icon } from '_common/components/Icon';
import { join } from '_common/utils/join';
import { wrapAction } from '_common/utils/wrapAction';
import type {
  AddChartOfAccountsMappingRequest,
  BusinessNotification,
  ChartOfAccountsMappingResponse,
  CodatAccountNested,
} from 'generated/capital';

import type { FlattenedIntegrationAccount } from '../ChartOfAccountsData/types';
import { SelectExpenseCategory } from '../SelectExpenseCategory';
import { CancelConfirmationButton } from '../CancelConfirmationButton';

import { flattenNestedIntegrationAccounts, generateInitialCategoryMap, getAccountType } from './utils';
import { NestedLevels } from './types';

import css from './ChartOfAccountsTable.css';

interface ChartOfAccountsTableProps {
  data: CodatAccountNested[];
  newCategories: Readonly<BusinessNotification[]>;
  onSave: (mappings: Readonly<AddChartOfAccountsMappingRequest | null>[]) => void;
  mappings?: ChartOfAccountsMappingResponse[] | undefined;
  onCancel?: () => void;
  onSkip?: () => void;
  setShowRoadblock?: (newValue: boolean) => void;
  setRoadblockRequestParameters?: (newValue: DeepReadonly<AddChartOfAccountsMappingRequest | null>[]) => void;
  setUnselectedCategories?: (newValue: (string | undefined)[]) => void;
  saveOnChange: boolean;
  showDeleted?: boolean;
}

export function ChartOfAccountsTable(props: Readonly<ChartOfAccountsTableProps>) {
  const i18n = useI18n();
  const categories = useExpenseCategories({ initValue: [] });

  const initialState = generateInitialCategoryMap(props.data);
  const [state, setState] = createStore(initialState);
  const selectedCategories = createMemo(() => Object.values(state).map((mapping) => mapping?.expenseCategoryId));
  const flattenedData = createMemo(() => {
    if (props.showDeleted) {
      return flattenNestedIntegrationAccounts(props.data, props.newCategories);
    }
    return flattenNestedIntegrationAccounts(
      props.data.filter((category) => category.updateStatus !== 'DELETED'),
      props.newCategories,
    );
  });

  const handleSave = async () => {
    const requestParams = Object.values(state).filter(
      (value) => value != null && (value.expenseCategoryId || value.expenseCategoryName),
    );
    const unmappedCategories = categories.data?.filter(
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
      name: 'mappedIcon',
      title: <></>,
      render: (item) => {
        const categoryMapped = Object.values(state).find((mapping) => mapping?.accountRef === item.id) !== undefined;
        return (
          <div>
            {categoryMapped ? (
              <div class={css.mappedIcon}>
                <Icon name="confirm-circle-filled" />
              </div>
            ) : (
              <></>
            )}
          </div>
        );
      },
    },
    {
      name: 'accountName',
      title: (
        <div class={css.columnTitle}>
          <Text message="QuickBooks Online chart of Accounts" />
        </div>
      ),
      render: (item) => {
        return (
          <div class={join(css.nestedLevel, getNestedCSSlevel(item))}>
            <div class={css.categoryPrimaryName}>
              {item.level > 1 && <Icon name="l-tab" style={{ color: 'transparent' }} />}
              <div class={css.categoryNameContainer}>
                <Text message={item.name || ''} />
                {item.isNew ? (
                  <div class={css.newAccountText}>
                    <Text message={'New Account'} />
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
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
            <Text message={item.type || ''} />
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
        const target = props.mappings?.find((mapping) => mapping.accountRef === item.id)?.expenseCategoryId;
        const initId = target && categories.data?.some((ec) => ec.expenseCategoryId === target) ? target : undefined;
        if (initId) setState(item.id!, { accountRef: item.id, expenseCategoryId: initId });
        const [expenseCategory, setExpenseCategory] = createSignal<string | undefined>(initId);

        function onChange(id: string | undefined, name?: string) {
          batch(() => {
            setExpenseCategory(id);
            setState(item.id!, {
              accountRef: item.id,
              expenseCategoryId: id,
              expenseCategoryName: name || categories.data?.find((ec) => ec.expenseCategoryId === id)?.categoryName,
              fullyQualifiedCategory: item.fullyQualifiedCategory,
            });
          });
          if (props.saveOnChange) saveMapping();
        }

        return (
          <div class={css.expenseCategoryCell}>
            <SelectExpenseCategory
              createName={item.name}
              value={expenseCategory()}
              items={categories.data || []}
              placeholder={String(i18n.t('Assign expense category'))}
              isDisableCategory={(id) => selectedCategories().includes(id)}
              onCreate={() => onChange(undefined, item.name)}
              onChange={onChange}
            />
            <div class={css.cancel}>
              <Show when={expenseCategory() !== undefined}>
                <Button
                  icon="cancel"
                  view="ghost"
                  class={css.cancelIcon}
                  onClick={() => {
                    batch(() => {
                      setExpenseCategory(undefined);
                      setState(item.id!, null);
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
