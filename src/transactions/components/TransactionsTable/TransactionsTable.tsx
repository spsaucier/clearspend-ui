import { createMemo, createSignal, onMount, Show } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { join } from '_common/utils/join';
import { wrapAction } from '_common/utils/wrapAction';
import { download } from '_common/utils/download';
import type { Setter } from '_common/types/common';
import { InputSearch } from '_common/components/InputSearch';
import { Button } from '_common/components/Button';
import { Pagination } from '_common/components/Pagination';
import { Table, TableColumn } from '_common/components/Table';
import { Icon } from '_common/components/Icon';
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
import { SyncSelectIcon } from 'accounting/components/SyncSelectIcon';
import { getSyncableTransactionCount, syncAllTransactions, syncMultipleTransactions } from 'accounting/services';
import { useExpenseCategories } from 'accounting/stores/expenseCategories';
import { Popover } from '_common/components/Popover';

import { useTransactionsFilters } from '../../utils/useTransactionsFilters';
import { ActivityDate } from '../ActivityDate';
import { MerchantLogo } from '../MerchantLogo';
import { TransactionsTableAmount } from '../TransactionsTableAmount';
import { TransactionFilterDrawer } from '../TransactionFilterDrawer';
import { MERCHANT_CATEGORIES } from '../../constants';

import css from './TransactionsTable.css';

interface TransactionsTableProps {
  class?: string;
  data: PagedDataAccountActivityResponse;
  dateRange?: Readonly<DateRange>;
  onCardClick?: (id: string) => void;
  onChangeParams: Setter<Readonly<AccountActivityRequest>>;
  onDeselectTransaction?: (id?: string) => void;
  onReload: () => Promise<unknown>;
  onRowClick: (activityId: string) => void;
  onSelectTransaction?: (id: string) => void;
  onUpdateTransaction: (transactionData: Readonly<AccountActivityResponse[]>) => void;
  params: Readonly<AccountActivityRequest>;
  selectedTransactions: string[];
  showAccountingAdminView?: boolean;
  showAllocationFilter?: boolean;
  showUserFilter?: boolean;
}

export function TransactionsTable(props: Readonly<TransactionsTableProps>) {
  const i18n = useI18n();
  const messages = useMessages();

  const [syncConfirmationOpen, setSyncConfirmationOpen] = createSignal(false);
  const [syncBeingInitialized, setSyncBeingInitialized] = createSignal(false);
  const [syncableCount, setSyncableCount] = createSignal(0);
  const [exporting, exportData] = wrapAction(exportAccountActivity);

  onMount(async () => {
    const res = await getSyncableTransactionCount();
    if (res.count) {
      setSyncableCount(res.count);
    }
  });

  const hasSelectedTransactions = createMemo(() => {
    return props.selectedTransactions.length > 0;
  });

  const hasSelectableTransactions = createMemo(() => {
    return !!props.data.content?.find((t) => t.syncStatus === 'READY');
  });

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

  const onClickSync = async () => {
    if (hasSelectedTransactions()) {
      syncSelected();
    } else {
      try {
        const res = await getSyncableTransactionCount();
        if (res.count) {
          setSyncableCount(res.count);
        }
        setSyncConfirmationOpen(true);
      } catch (error: unknown) {
        messages.error({ title: i18n.t('Something went wrong') });
      }
    }
  };

  const syncSelected = async () => {
    setSyncBeingInitialized(true);
    setSyncConfirmationOpen(false);
    try {
      await syncMultipleTransactions(props.selectedTransactions);
      const selectedTransactionRecords = props.data.content?.filter(
        (transaction) =>
          transaction.accountActivityId && props.selectedTransactions.includes(transaction.accountActivityId),
      );
      if (selectedTransactionRecords) {
        props.onUpdateTransaction(selectedTransactionRecords.map((t) => ({ ...t, syncStatus: 'SYNCED_LOCKED' })));
      }
      props.onDeselectTransaction?.();
    } catch (error: unknown) {
      messages.error({ title: i18n.t('Something went wrong') });
    }
    setSyncBeingInitialized(false);
  };

  const syncAll = async () => {
    setSyncBeingInitialized(true);
    setSyncConfirmationOpen(false);
    try {
      await syncAllTransactions();
      const syncableTransactions = props.data.content?.filter((transaction) => transaction.syncStatus === 'READY');
      if (syncableTransactions) {
        props.onUpdateTransaction(syncableTransactions.map((t) => ({ ...t, syncStatus: 'SYNCED_LOCKED' })));
      }
    } catch (error: unknown) {
      messages.error({ title: i18n.t('Something went wrong') });
    }
    setSyncBeingInitialized(false);
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
      title: null,
      render: (item) => {
        if (item.syncStatus === 'SYNCED_LOCKED') {
          return (
            <div class={css.lockDot}>
              <Icon name={'lock'} class={css.lock} />
            </div>
          );
        } else if (
          item.syncStatus === 'READY' &&
          item.accountActivityId &&
          props.onSelectTransaction &&
          props.onDeselectTransaction
        ) {
          return (
            <SyncSelectIcon
              id={item.accountActivityId}
              selectedTransactions={props.selectedTransactions}
              onSelectTransaction={props.onSelectTransaction}
              onDeselectTransaction={props.onDeselectTransaction}
            />
          );
        } else {
          return (
            <div class={css.errorDot}>
              <Icon name={'error-circle'} class={css.error} />
            </div>
          );
        }
      },
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
      name: 'receipt',
      title: <Text message="Receipt" />,
      render: (item) => (
        <div class={css.receiptCell}>
          <Icon
            name={item.receipt?.receiptId?.length ? 'receipt' : 'receipt-unavailable'}
            class={join(css.receipt, !item.receipt?.receiptId && css.receiptEmpty)}
          />
        </div>
      ),
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

  const getSyncablePageTransactions = () => {
    return [
      ...new Set([
        props.data.content?.filter((transaction) => transaction.syncStatus! === 'READY'),
        props.selectedTransactions,
      ]),
    ];
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
        <Show when={props.showAccountingAdminView}>
          <Popover
            balloon
            open={syncConfirmationOpen()}
            onClickOutside={() => setSyncConfirmationOpen(false)}
            class={css.syncPopupRoot}
            content={
              <div class={css.syncPopupContainer}>
                <div class={css.syncPopupTextContainer}>
                  <strong>Sync {conditionalS('transaction', syncableCount())}?</strong>
                  <Text
                    message={`You have ${syncableCount()} ${conditionalS(
                      'transaction',
                      syncableCount(),
                    )} ready to sync.`}
                  />
                </div>
                <div class={css.syncButtonContainer}>
                  <Button type="default" view="ghost" onClick={() => setSyncConfirmationOpen(false)}>
                    No, cancel
                  </Button>
                  <Button
                    type="primary"
                    loading={syncBeingInitialized()}
                    onClick={hasSelectedTransactions() ? syncSelected : syncAll}
                    disabled={syncBeingInitialized()}
                  >
                    Yes, sync {conditionalS('transaction', syncableCount())}
                  </Button>
                </div>
              </div>
            }
          >
            <Button
              type="primary"
              loading={syncBeingInitialized()}
              disabled={
                syncBeingInitialized() || !hasSelectableTransactions() || getSyncablePageTransactions.length > 0
              }
              icon={{ name: 'refresh', pos: 'right' }}
              onClick={onClickSync}
            >
              <Text
                message={
                  hasSelectedTransactions()
                    ? `Sync ${props.selectedTransactions.length} ${conditionalS(
                        'Transaction',
                        props.selectedTransactions.length,
                      )}`
                    : 'Sync All Transactions'
                }
              />
            </Button>
          </Popover>
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

const conditionalS = (word: string, itemCount: number) => {
  return `${word}${itemCount > 1 ? 's' : ''}`;
};
