import { Text, useI18n } from 'solid-i18n';
import { createMemo, createSignal, Show } from 'solid-js';
import { createStore } from 'solid-js/store';

import { getNoop } from '_common/utils/getNoop';
import { Empty } from 'app/components/Empty';
import { InputSearch } from '_common/components/InputSearch';
import { Table, TableColumn } from '_common/components/Table';
import { Button } from '_common/components/Button';
import { Icon } from '_common/components/Icon';
import { wrapAction } from '_common/utils/wrapAction';
import type {
  AddChartOfAccountsMappingRequest,
  BusinessNotification,
  ChartOfAccountsMappingResponse,
  CodatAccountNested,
  ExpenseCategory,
} from 'generated/capital';
import { resyncChartOfAccounts } from 'accounting/services';

import { CancelConfirmationButton } from '../CancelConfirmationButton';
import { ChartOfAccountsName } from '../ChartOfAccountsName';
import { ChartOfAccountsExpenseCategory } from '../ChartOfAccountsExpenseCategory';

import { flatCodatAccounts, getCategoryMap, getAccountType } from './utils';
import type { FlattenedIntegrationAccount } from './types';

import css from './ChartOfAccountsTable.css';

interface ChartOfAccountsTableProps {
  saveOnChange?: boolean;
  showUpdateButton?: boolean;
  data: readonly Readonly<CodatAccountNested>[];
  mappings: readonly Readonly<ChartOfAccountsMappingResponse>[];
  categories: readonly Readonly<ExpenseCategory>[];
  newCategories: readonly Readonly<BusinessNotification>[] | null;
  onSave: (mappings: readonly Readonly<AddChartOfAccountsMappingRequest>[]) => void;
  onSetRoadblock?: (
    mappings: readonly Readonly<AddChartOfAccountsMappingRequest>[],
    unmappedIds: readonly string[],
  ) => void;
  onCancel?: () => void;
}

export function ChartOfAccountsTable(props: Readonly<ChartOfAccountsTableProps>) {
  const i18n = useI18n();

  const [refreshButtonDisabled, setRefreshButtonDisabled] = createSignal<boolean>(false);

  const accounts = createMemo(() => {
    return flatCodatAccounts(
      props.data.filter((category) => category.updateStatus !== 'DELETED'),
      props.newCategories || [],
    );
  });

  const [map, setMap] = createStore(getCategoryMap(accounts(), props.mappings));

  const categories = createMemo(() => props.categories.filter((category) => category.status === 'ACTIVE'));
  const selected = createMemo(() => Object.values(map).map((mapping) => mapping?.expenseCategoryId));

  const [savingMapping, saveMapping] = wrapAction(async () => {
    const requestParams = Object.values(map).filter(
      (value): value is AddChartOfAccountsMappingRequest =>
        !!(value && (value.expenseCategoryId || value.expenseCategoryName)),
    );
    const unmappedIds = props.categories
      .filter((category) => !selected().includes(category.expenseCategoryId))
      .map((category) => category.expenseCategoryId!);

    unmappedIds.length && props.onSetRoadblock
      ? props.onSetRoadblock(requestParams, unmappedIds)
      : await props.onSave(requestParams);
  });

  const refreshChartOfAccounts = () => {
    // TODO await/handle error?
    resyncChartOfAccounts();
    setRefreshButtonDisabled(true);
  };

  const columns: readonly Readonly<TableColumn<FlattenedIntegrationAccount>>[] = [
    {
      name: 'mappedIcon',
      render: (item) => (
        <Show when={Boolean(map[item.id!])}>
          <Icon name="confirm-circle-filled" class={css.mappedIcon} />
        </Show>
      ),
    },
    {
      name: 'accountName',
      title: <Text message="QuickBooks Online chart of Accounts" />,
      render: (item) => <ChartOfAccountsName data={item} />,
    },
    {
      name: 'type',
      title: <Text message="Type" />,
      render: (item) => item.fullyQualifiedName?.split('.')[1],
    },
    {
      name: 'accountType',
      title: <Text message="Detail Type" />,
      render: (item) => getAccountType(item)!.replace(/[A-Z]/g, ' $&').trim(),
    },
    {
      name: 'expenseCategory',
      title: <Text message="ClearSpend expense category" />,
      render: (item) => (
        <ChartOfAccountsExpenseCategory
          categories={categories()}
          accounts={accounts()}
          account={item}
          dataMap={map}
          selected={selected()}
          onChange={(id, data) => {
            setMap(id, data);
            if (props.saveOnChange) saveMapping().catch(getNoop(true));
          }}
        />
      ),
    },
  ];

  return (
    <div class={css.tableContainer}>
      <div class={css.topContainer}>
        <InputSearch
          delay={400}
          placeholder={String(i18n.t('Search'))}
          class={css.search}
          disabled
          onSearch={() => {
            // TODO
          }}
        />
        <Show when={props.showUpdateButton}>
          <Button icon="refresh" disabled={refreshButtonDisabled()} onClick={refreshChartOfAccounts}>
            <Text message="Update Chart of Accounts" />
          </Button>
        </Show>
      </div>
      <Show when={props.data.length} fallback={<Empty message={<Text message="There are no accounts" />} />}>
        <div class={css.table}>
          <Table columns={columns} data={accounts()} cellClass={css.cell} />
        </div>
        <Show when={!props.saveOnChange}>
          <div class={css.tableButtons}>
            <Show when={!!props.onCancel}>
              <CancelConfirmationButton onCancel={props.onCancel!} />
            </Show>
            <Button
              loading={savingMapping()}
              disabled={savingMapping()}
              class={css.done}
              type="primary"
              icon={{ name: 'confirm', pos: 'right' }}
              onClick={saveMapping}
            >
              <Text message="Save changes" />
            </Button>
          </div>
        </Show>
      </Show>
    </div>
  );
}
