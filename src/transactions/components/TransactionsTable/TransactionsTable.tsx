import { createMemo, createSignal, Show } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { wrapAction } from '_common/utils/wrapAction';
import { download } from '_common/utils/download';
import type { Setter } from '_common/types/common';
import { InputSearch } from '_common/components/InputSearch';
import { Button } from '_common/components/Button';
import { Pagination } from '_common/components/Pagination';
import { Table, TableColumn } from '_common/components/Table';
import { useMessages } from 'app/containers/Messages/context';
import { Filters } from 'app/components/Filters';
import { Empty } from 'app/components/Empty';
import { changeRequestPage } from 'app/utils/changeRequestPage';
import { changeRequestSearch } from 'app/utils/changeRequestSearch';
import { exportAccountActivity } from 'app/services/activity';
import { formatCardNumber } from 'cards/utils/formatCardNumber';
import { formatName } from 'employees/utils/formatName';
import type {
  AccountActivityRequest,
  AccountActivityResponse,
  PagedDataAccountActivityResponse,
} from 'generated/capital';
import { Drawer } from '_common/components/Drawer';
import { FiltersButton } from 'app/components/FiltersButton';
import { Events, sendAnalyticsEvent } from 'app/utils/analytics';
import type { DateRange } from 'app/types/common';
import { SyncStatus } from 'accounting/components/SyncStatus';
import { useExpenseCategories } from 'accounting/stores/expenseCategories';
import { SyncTableButton } from 'accounting/containers/SyncTableButton';

import { useTransactionsFilters } from '../../utils/useTransactionsFilters';
import { ActivityDate } from '../ActivityDate';
import { MerchantLogo } from '../MerchantLogo';
import { TransactionsTableAmount } from '../TransactionsTableAmount';
import { TransactionFilterDrawer } from '../TransactionFilterDrawer';
import { MERCHANT_CATEGORIES } from '../../constants';
import { MissingDetails } from '../MissingDetails';

import css from './TransactionsTable.css';

interface TransactionsTableProps {
  class?: string;
  data: PagedDataAccountActivityResponse;
  dateRange?: Readonly<DateRange>;
  onCardClick?: (id: string) => void;
  onChangeParams: Setter<Readonly<AccountActivityRequest>>;
  onReload: () => Promise<unknown>;
  onRowClick: (activityId: string) => void;
  onUpdateTransaction: (transactionData: Readonly<AccountActivityResponse[]>) => void;
  params: Readonly<AccountActivityRequest>;
  showAccountingAdminView?: boolean;
  showAllocationFilter?: boolean;
  showUserFilter?: boolean;
}

export function TransactionsTable(props: Readonly<TransactionsTableProps>) {
  const i18n = useI18n();
  const messages = useMessages();

  const [exporting, exportData] = wrapAction(exportAccountActivity);

  const [selectedIds, setSelectedIds] = createSignal<string[]>([]);

  const onChangeSelectedTransactions = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((transactionId) => transactionId !== id) : [...prev, id],
    );
  };

  const expenseCategories = useExpenseCategories({ initValue: [] });

  const formatHierarchyFromCategory = (categoryId: string | undefined) => {
    if (categoryId === undefined) {
      return <></>;
    }
    const pathSegments = expenseCategories.data?.find(
      (category) => category.expenseCategoryId === categoryId,
    )?.pathSegments;

    if (!pathSegments || pathSegments.length === 0 || pathSegments[0] === '') {
      return <></>;
    }

    return (
      <div class={css.expenseCategoryHierarchy}>
        <Text message={`In ${pathSegments.join(' > ')}`} />
      </div>
    );
  };

  const filters = useTransactionsFilters(
    createMemo(() => props.params),
    props.dateRange,
    props.onChangeParams,
    { types: true, userId: !props.showUserFilter },
  );

  const columns: readonly Readonly<TableColumn<AccountActivityResponse>>[] = [
    {
      name: 'sync',
      render: (item) => (
        <SyncStatus
          activityId={item.accountActivityId!}
          selectedIds={selectedIds()}
          status={item.syncStatus}
          onChangeSelected={onChangeSelectedTransactions}
        />
      ),
    },
    {
      name: 'date',
      title: <Text message="Date" />,
      render: (item) => <ActivityDate date={item.activityTime} />,
    },
    {
      name: 'card',
      title: <Text message="Card • Employee" />,
      render: (item) => (
        <div>
          <Show when={item.card} fallback="--">
            <div
              class={css.card}
              onClick={(event) => {
                event.stopPropagation();
                props.onCardClick?.(item.card?.cardId!);
              }}
            >
              {formatCardNumber(item.card!.lastFour, true)}
            </div>
            <div class={css.sub}>
              {formatName({
                firstName: item.card!.ownerFirstName!,
                lastName: item.card!.ownerLastName!,
              })}
            </div>
          </Show>
        </div>
      ),
    },
    {
      name: 'allocation',
      title: <Text message="Allocation" />,
      render: (item) => (
        <div>
          <div data-name="allocation-name">{item.card?.allocationName}</div>
          <div class={css.sub}>{/* TODO: Parent allocation */}</div>
        </div>
      ),
    },
    {
      name: 'merchant',
      title: <Text message="Merchant" />,
      render: (item) => (
        <div class={css.merchant}>
          <Show when={item.merchant} fallback="--">
            <MerchantLogo data={item.merchant!} />
            <div>
              <div>{item.merchant!.name || '--'}</div>
              <div class={css.merchantType}>{MERCHANT_CATEGORIES[item.merchant!.merchantCategoryGroup!].name}</div>
            </div>
          </Show>
        </div>
      ),
    },
    {
      name: 'amount',
      title: <Text message="Amount • Status" />,
      render: (item) => (
        <TransactionsTableAmount
          status={item.status}
          type={item.type}
          amount={item.amount}
          requestedAmount={item.requestedAmount}
        />
      ),
    },
    {
      name: 'expense-category',
      title: <Text message="Expense Category" />,
      render: (item) => (
        <div data-name="expense-category">
          {item.expenseDetails?.categoryName}
          {formatHierarchyFromCategory(item.expenseDetails?.expenseCategoryId)}
        </div>
      ),
    },
    {
      name: 'missing',
      title: <></>,
      render: (item) => <MissingDetails data={item} checkMerchant={props.showAccountingAdminView} />,
    },
  ];

  const onExport = () => {
    return exportData(props.params)
      .then((file) => {
        sendAnalyticsEvent({ name: Events.EXPORT_TRANSACTIONS });
        return download(file, 'account-activity.csv');
      })
      .catch(() => {
        messages.error({ title: i18n.t('Something went wrong') });
      });
  };

  return (
    <div class={props.class}>
      <Filters
        side={
          <Pagination
            current={props.params.pageRequest.pageNumber}
            pageSize={props.params.pageRequest.pageSize}
            total={props.data.totalElements || 0}
            onChange={changeRequestPage(props.onChangeParams)}
          />
        }
      >
        <InputSearch
          delay={400}
          value={props.params.searchText}
          placeholder={String(i18n.t('Search transactions...'))}
          class={css.search}
          onSearch={changeRequestSearch(props.onChangeParams)}
        />
        <FiltersButton
          label={<Text message="More Filters" />}
          count={filters.filtersCount()}
          onReset={filters.onResetFilters}
          onClick={filters.toggleFilters}
        />
        <Button
          loading={exporting()}
          disabled={!props.data.content?.length}
          icon={{ name: 'download', pos: 'right' }}
          onClick={onExport}
        >
          <Text message="Export" />
        </Button>
        <Show when={props.showAccountingAdminView && props.data.content}>
          {(transactions) => (
            <SyncTableButton
              selectedIds={selectedIds()}
              transactions={transactions}
              onResetSelection={() => setSelectedIds([])}
              onReloadTransactions={props.onReload}
            />
          )}
        </Show>
      </Filters>
      <Show
        when={props.data.content?.length}
        fallback={<Empty message={<Text message="There are no transactions" />} />}
      >
        <Table
          columns={columns.filter((column) => column.name !== 'sync' || props.showAccountingAdminView)}
          data={props.data.content as []}
          rowClass={css.row}
          onRowClick={(item) => props.onRowClick(item.accountActivityId!)}
        />
      </Show>
      <Filters
        side={
          <Pagination
            current={props.params.pageRequest.pageNumber}
            pageSize={props.params.pageRequest.pageSize}
            total={props.data.totalElements || 0}
            onChange={changeRequestPage(props.onChangeParams)}
          />
        }
      />
      <Drawer
        noPadding
        open={filters.showFilters()}
        title={<Text message="Filter Transactions" />}
        onClose={filters.toggleFilters}
      >
        <TransactionFilterDrawer
          params={filters.filters()}
          showAllocationFilter={props.showAllocationFilter}
          showAccountingAdminView={props.showAccountingAdminView}
          showUserFilter={props.showUserFilter}
          onChangeParams={(params) => {
            filters.toggleFilters();
            filters.onChangeFilters(params);
          }}
          onReset={() => {
            filters.toggleFilters();
            filters.onResetFilters();
          }}
        />
      </Drawer>
    </div>
  );
}
