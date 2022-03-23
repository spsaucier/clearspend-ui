import { createMemo, Show } from 'solid-js';
import { useI18n, Text, DateTime } from 'solid-i18n';

import { join } from '_common/utils/join';
import { useBool } from '_common/utils/useBool';
import { wrapAction } from '_common/utils/wrapAction';
import { download } from '_common/utils/download';
import type { Setter } from '_common/types/common';
import { DateFormat } from '_common/api/intl/types';
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
import { SyncSelectIcon } from 'accounting/components/SyncSelectIcon';
import { syncMultipleTransactions } from 'accounting/services';

import { MerchantLogo } from '../MerchantLogo';
import { TransactionsTableAmount } from '../TransactionsTableAmount';
import { TransactionFilterDrawer } from '../TransactionFilterDrawer/TransactionFilterDrawer';
import { MERCHANT_CATEGORIES } from '../../constants';

import css from './TransactionsTable.css';

interface TransactionsTableProps {
  data: PagedDataAccountActivityResponse;
  params: Readonly<AccountActivityRequest>;
  onCardClick?: (id: string) => void;
  onRowClick: (activityId: string) => void;
  onChangeParams: Setter<Readonly<AccountActivityRequest>>;
  showAccountingAdminView?: boolean;
  selectedTransactions?: string[];
  onSelectTransaction?: (id: string) => void;
  onDeselectTransaction?: (id: string) => void;
  onUpdate: (data: Readonly<AccountActivityResponse>) => void;
  onReload: () => Promise<unknown>;
}

export function TransactionsTable(props: Readonly<TransactionsTableProps>) {
  const i18n = useI18n();
  const messages = useMessages();

  const [exporting, exportData] = wrapAction(exportAccountActivity);
  const [showFilters, toggleFilters] = useBool();

  const transactionsSelected = createMemo(() => {
    return props.selectedTransactions && props.selectedTransactions.length > 0;
  });

  const onSyncMultiple = () => {
    if (props.selectedTransactions && props.selectedTransactions.length > 0) {
      syncMultipleTransactions(props.selectedTransactions);
      const selectedTransactionRecords = props.data.content?.filter(
        (transaction) =>
          transaction.accountActivityId &&
          props.selectedTransactions &&
          props.selectedTransactions.includes(transaction.accountActivityId),
      );
      if (selectedTransactionRecords) {
        selectedTransactionRecords.forEach((transaction) =>
          props.onUpdate({ ...transaction, syncStatus: 'SYNCED_LOCKED' }),
        );
      }
      props.selectedTransactions.forEach((id) => {
        if (props.onDeselectTransaction) {
          props.onDeselectTransaction(id);
        }
      });
      props.onReload();
    }
  };

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
          item.expenseDetails?.iconRef !== undefined &&
          item.accountActivityId !== undefined &&
          props.selectedTransactions &&
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
      title: <Text message="Date & Time" />,
      render: (item) => {
        const date = new Date(item.activityTime || '');
        return (
          <>
            <DateTime date={date} />
            <br />
            <DateTime date={date} preset={DateFormat.time} class={css.sub} />
          </>
        );
      },
    },
    {
      name: 'card',
      title: <Text message="Card • Employee" />,
      render: (item) => (
        <div>
          <Show when={item.card} fallback="--">
            <div class={css.card} onClick={() => props.onCardClick?.(item.card?.cardId!)}>
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
      name: 'card',
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
        <TransactionsTableAmount status={item.status!} amount={item.amount} requestedAmount={item.requestedAmount} />
      ),
    },
    {
      name: 'expense-category',
      title: <Text message="Expense Category" />,
      render: (item) => <div data-name="expense-category">{item.expenseDetails?.categoryName}</div>,
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

  // TODO update when API is ready - CAP-305
  // eslint-disable-next-line
  const onResetFilters = () => {};

  const getSyncablePageTransactions = () => {
    return [
      ...new Set([
        props.data.content?.filter((transaction) => transaction.syncStatus! === 'READY'),
        props.selectedTransactions,
      ]),
    ];
  };

  return (
    <div>
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
          // TODO update when API is ready - CAP-305
          count={0}
          onReset={onResetFilters}
          onClick={toggleFilters}
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
          <Button
            type="primary"
            disabled={getSyncablePageTransactions.length > 0}
            icon={{ name: 'refresh', pos: 'right' }}
            onClick={onSyncMultiple}
          >
            <Text
              message={
                transactionsSelected()
                  ? `Sync ${props.selectedTransactions?.length} Transaction${
                      props.selectedTransactions?.length && props.selectedTransactions.length > 1 ? 's' : ''
                    }`
                  : 'Sync All Transactions'
              }
            />
          </Button>
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
      <Drawer noPadding open={showFilters()} title={<Text message="Filter Transactions" />} onClose={toggleFilters}>
        <TransactionFilterDrawer
          params={props.params}
          showAccountingAdminView={props.showAccountingAdminView}
          onChangeParams={(params) => {
            toggleFilters();
            props.onChangeParams(params);
          }}
          onReset={() => {
            toggleFilters();
            onResetFilters();
          }}
        />
      </Drawer>
    </div>
  );
}
