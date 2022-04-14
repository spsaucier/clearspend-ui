import { createMemo, Show } from 'solid-js';
import { Text, useI18n } from 'solid-i18n';

import type { Setter } from '_common/types/common';
import { InputSearch } from '_common/components/InputSearch';
import { Button } from '_common/components/Button';
import { Pagination } from '_common/components/Pagination';
import { Table, type TableColumn } from '_common/components/Table';
import { Drawer } from '_common/components/Drawer';
import { wrapAction } from '_common/utils/wrapAction';
import { useMessages } from 'app/containers/Messages/context';
import { Filters } from 'app/components/Filters';
import { FiltersButton } from 'app/components/FiltersButton';
import { Empty } from 'app/components/Empty';
import { changeRequestPage } from 'app/utils/changeRequestPage';
import { changeRequestSearch } from 'app/utils/changeRequestSearch';
import type { DateRange } from 'app/types/common';
import type { LedgerActivityRequest, PagedDataLedgerActivityResponse, LedgerActivityResponse } from 'generated/capital';

import { ACTIVITY_TYPE_TITLES } from '../../constants';
import { ActivityDate } from '../ActivityDate';
import { ActivityUser } from '../ActivityUser';
import { ActivityAccount } from '../ActivityAccount';
import { ActivityAmount } from '../ActivityAmount';
import { TransactionFilterDrawer } from '../TransactionFilterDrawer';
import { useTransactionsFilters } from '../TransactionsTable/utils/useTransactionsFilters';

import css from './ActivityTable.css';

interface ActivityTableProps {
  showUserFilter?: boolean;
  showAllocationFilter?: boolean;
  data: PagedDataLedgerActivityResponse;
  dateRange?: Readonly<DateRange>;
  params: Readonly<LedgerActivityRequest>;
  class?: string;
  onExport: (params: Readonly<LedgerActivityRequest>) => Promise<void>;
  onUserClick?: (userId: string) => void;
  onCardClick?: (cardId: string) => void;
  onRowClick?: (id: string) => void;
  onChangeParams: Setter<Readonly<LedgerActivityRequest>>;
}

export function ActivityTable(props: Readonly<ActivityTableProps>) {
  const i18n = useI18n();
  const messages = useMessages();

  const columns: readonly Readonly<TableColumn<LedgerActivityResponse>>[] = [
    {
      name: 'date',
      title: <Text message="Date & Time" />,
      render: (item) => <ActivityDate date={item.activityTime} />,
    },
    {
      name: 'type',
      title: <Text message="Activity Type" />,
      render: (item) => (
        <>
          <div>{ACTIVITY_TYPE_TITLES[item.type!]}</div>
          <div class={css.sub}>{item.expenseDetails?.categoryName}</div>
        </>
      ),
    },
    {
      name: 'user',
      title: <Text message="User" />,
      render: (item) => <ActivityUser data={item.user} onUserClick={props.onUserClick} />,
    },
    {
      name: 'source',
      title: <Text message="Source" />,
      render: (item) => <ActivityAccount account={item.sourceAccount} onCardClick={props.onCardClick} />,
    },
    {
      name: 'destination',
      title: <Text message="Target" />,
      render: (item) => <ActivityAccount account={item.targetAccount} onCardClick={props.onCardClick} />,
    },
    {
      name: 'amount',
      title: <Text message="Amount" />,
      render: (item) => (
        <ActivityAmount status={item.status} amount={item.amount} requestedAmount={item.requestedAmount} />
      ),
    },
    // TODO
    // {
    //   name: 'missing',
    //   title: <Text message="Missing Details" />,
    //   render: () => <div />,
    // },
  ];

  const [exporting, exportData] = wrapAction(props.onExport);

  const onExport = () => {
    return exportData(props.params).catch(() => {
      messages.error({ title: i18n.t('Something went wrong') });
    });
  };

  const filters = useTransactionsFilters(
    createMemo(() => props.params),
    props.dateRange,
    props.onChangeParams,
    props.showUserFilter,
  );

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
          label={<Text message="Filters" />}
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
      </Filters>
      <Show
        when={props.data.content?.length}
        fallback={<Empty message={<Text message="No Transactions have been detected" />} />}
      >
        <Table
          columns={columns}
          data={props.data.content!}
          class={css.row}
          onRowClick={(data) => props.onRowClick?.(data.accountActivityId!)}
        />
      </Show>
      <Drawer
        noPadding
        open={filters.showFilters()}
        title={<Text message="Filter Transactions" />}
        onClose={filters.toggleFilters}
      >
        <TransactionFilterDrawer
          params={filters.filters()}
          showAllocationFilter={props.showAllocationFilter}
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
