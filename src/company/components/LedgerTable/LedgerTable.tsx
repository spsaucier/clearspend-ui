import { Show } from 'solid-js';
import { useI18n, Text, DateTime } from 'solid-i18n';

import { DateFormat } from '_common/api/intl/types';
import { useBool } from '_common/utils/useBool';
import { wrapAction } from '_common/utils/wrapAction';
import type { StoreSetter } from '_common/utils/store';
import { Button } from '_common/components/Button';
import { Pagination } from '_common/components/Pagination';
import { InputSearch } from '_common/components/InputSearch';
import { Drawer } from '_common/components/Drawer';
import { Table, TableColumn } from '_common/components/Table';
import { Filters } from 'app/components/Filters';
import { FiltersButton } from 'app/components/FiltersButton';
import { Empty } from 'app/components/Empty';
import { useMessages } from 'app/containers/Messages/context';
import { changeRequestPage } from 'app/utils/changeRequestPage';
import { changeRequestSearch } from 'app/utils/changeRequestSearch';
import { TransactionsTableAmount } from 'transactions/components/TransactionsTableAmount';
import type {
  PagedDataAccountActivityResponse,
  AccountActivityRequest,
  AccountActivityResponse,
} from 'generated/capital';

import { LedgerFilters } from '../LedgerFilters';

import css from './LedgerTable.css';

interface LedgerTableProps {
  data: PagedDataAccountActivityResponse;
  params: Readonly<AccountActivityRequest>;
  onRowClick: (activityId: string) => void;
  onExport: (params: Readonly<AccountActivityRequest>) => Promise<void>;
  onChangeParams: StoreSetter<Readonly<AccountActivityRequest>>;
}

export function LedgerTable(props: Readonly<LedgerTableProps>) {
  const i18n = useI18n();
  const messages = useMessages();

  const [showFilters, toggleFilters] = useBool();
  const [exporting, exportData] = wrapAction(props.onExport);

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
      name: 'owner',
      title: <Text message="Allocation Owner" />,
      render: () => '--',
    },
    {
      name: 'source',
      title: <Text message="Source" />,
      class: css.source,
      render: () => '--',
    },
    {
      name: 'destination',
      title: <Text message="Destination" />,
      class: css.destination,
      render: (item) => item.accountName,
    },
    {
      name: 'amount',
      title: <Text message="Amount" />,
      render: (item) => <TransactionsTableAmount status={item.status!} amount={item.amount} />,
    },
  ];

  // TODO update when API is ready
  // eslint-disable-next-line
  const onResetFilters = () => {};

  const onExport = () => {
    return exportData(props.params).catch(() => {
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
        <FiltersButton
          disabled
          label={<Text message="More Filters" />}
          // TODO update when API is ready
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
      </Filters>
      <Show
        when={props.data.content?.length}
        fallback={<Empty message={<Text message="There are no transactions" />} />}
      >
        <Table
          columns={columns}
          data={props.data.content!}
          rowClass={css.row}
          onRowClick={(item) => props.onRowClick(item.accountActivityId!)}
        />
      </Show>
      <Drawer noPadding open={showFilters()} title={<Text message="Filter Ledger" />} onClose={toggleFilters}>
        <LedgerFilters
          params={props.params}
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
