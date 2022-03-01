import { createSignal, Show } from 'solid-js';
import { useI18n, Text, DateTime } from 'solid-i18n';

import { join } from '_common/utils/join';
import { wrapAction } from '_common/utils/wrapAction';
import { download } from '_common/utils/download';
import type { StoreSetter } from '_common/utils/store';
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
import { getNoop } from '_common/utils/getNoop';
import { FiltersButton } from 'app/components/FiltersButton';

import { MerchantLogo } from '../MerchantLogo';
import { TransactionsTableAmount } from '../TransactionsTableAmount';
import { SearchTransactionsRequest, TransactionFilterDrawer } from '../TransactionFilterDrawer/TransactionFilterDrawer';
import { MERCHANT_CATEGORIES } from '../../constants';

import css from './TransactionsTable.css';

interface TransactionsTableProps {
  data: PagedDataAccountActivityResponse;
  params: Readonly<AccountActivityRequest>;
  onCardClick?: (id: string) => void;
  onRowClick: (activityId: string) => void;
  onChangeParams: StoreSetter<Readonly<AccountActivityRequest>>;
  showAccountingAdminView?: boolean;
}

export function TransactionsTable(props: Readonly<TransactionsTableProps>) {
  const i18n = useI18n();
  const messages = useMessages();

  const [exporting, exportData] = wrapAction(exportAccountActivity);
  const [filterPanelOpen, setFilterPanelOpen] = createSignal<boolean>(false);

  const columns: readonly Readonly<TableColumn<AccountActivityResponse>>[] = [
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
      title: <Text message="Card" />,
      render: (item) => (
        <div>
          <Show when={item.card} fallback="--">
            <div class={css.card} onClick={() => props.onCardClick?.(item.card?.cardId!)}>
              {/* TODO need activated status */}
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
      title: <Text message="Amount" />,
      render: (item) => <TransactionsTableAmount status={item.status!} amount={item.amount} />,
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
      .then((file) => download(file, 'account-activity.csv'))
      .catch(() => {
        messages.error({ title: i18n.t('Something went wrong') });
      });
  };

  return (
    <div>
      <Filters
        side={
          <Pagination
            current={props.data.pageNumber || 0}
            pageSize={props.data.pageSize || 0}
            total={props.data.totalElements || 0}
            onChange={changeRequestPage(props.onChangeParams)}
          />
        }
      >
        <InputSearch
          delay={400}
          value={props.params.searchText}
          placeholder={String(i18n.t('Search Transactions...'))}
          class={css.search}
          onSearch={changeRequestSearch(props.onChangeParams)}
        />
        <FiltersButton label={'More Filters'} count={0} onReset={getNoop()} onClick={() => setFilterPanelOpen(true)} />
        <Button
          loading={exporting()}
          disabled={!props.data.content?.length}
          icon={{ name: 'download', pos: 'right' }}
          onClick={onExport}
        >
          <Text message="Export" />
        </Button>
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

      <Drawer
        noPadding
        open={filterPanelOpen()}
        title={<Text message="Filter Transactions" />}
        onClose={() => setFilterPanelOpen(false)}
      >
        <TransactionFilterDrawer
          onChangeParams={() => {
            // TODO
          }}
          params={{} as SearchTransactionsRequest}
          showAccountingAdminView={props.showAccountingAdminView}
        />
      </Drawer>
    </div>
  );
}
