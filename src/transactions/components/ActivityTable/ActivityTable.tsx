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
import { Option, Select } from '_common/components/Select';

import { ACTIVITY_TYPE_TITLES, LEDGER_TYPES, ACTIVITY_TYPES } from '../../constants';
import { useTransactionsFilters } from '../../utils/useTransactionsFilters';
import { ActivityDate } from '../ActivityDate';
import { ActivityUser } from '../ActivityUser';
import { ActivityAccount } from '../ActivityAccount';
import { ActivityAmount } from '../ActivityAmount';
import { MissingDetails } from '../MissingDetails';
import { TransactionFilterDrawer } from '../TransactionFilterDrawer';

import css from './ActivityTable.css';

enum ACTIVITY_TYPE_GROUPS {
  ALL = 'ALL',
  FUNDS_MOVEMENT = 'FUNDS_MOVEMENT',
  CARD_TRANSACTIONS = 'CARD_TRANSACTIONS',
}

const isEquivalent = (a: string[] | undefined, b: Readonly<string[]> | undefined) => {
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  if ([...a].sort().toString() === [...b].sort().toString()) return true;
  return false;
};

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
      title: <Text message="Date" />,
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
      title: <Text message="Destination" />,
      render: (item) => <ActivityAccount account={item.targetAccount} onCardClick={props.onCardClick} />,
    },
    {
      name: 'amount',
      title: <Text message="Amount" />,
      render: (item) => (
        <ActivityAmount status={item.status} amount={item.amount} requestedAmount={item.requestedAmount} />
      ),
    },
    {
      name: 'missing',
      title: <></>,
      render: (item) => <MissingDetails data={item} />,
    },
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
    { userId: !props.showUserFilter },
  );

  const onChangeActivityType = (newType: string) => {
    switch (newType) {
      case ACTIVITY_TYPE_GROUPS.ALL:
        filters.onChangeFilters({ ...filters.filters(), types: undefined });
        break;
      case ACTIVITY_TYPE_GROUPS.FUNDS_MOVEMENT:
        filters.onChangeFilters({ ...filters.filters(), types: [...LEDGER_TYPES] });
        break;
      case ACTIVITY_TYPE_GROUPS.CARD_TRANSACTIONS:
        filters.onChangeFilters({ ...filters.filters(), types: [...ACTIVITY_TYPES] });
        break;
      default:
        break;
    }
  };

  const activityType = createMemo(() => {
    if (
      !filters.filters().types?.length ||
      filters.filters().types?.length === [...LEDGER_TYPES, ...ACTIVITY_TYPES].length
    ) {
      return ACTIVITY_TYPE_GROUPS.ALL;
    } else if (isEquivalent(filters.filters().types, LEDGER_TYPES)) {
      return ACTIVITY_TYPE_GROUPS.FUNDS_MOVEMENT;
    } else if (isEquivalent(filters.filters().types, ACTIVITY_TYPES)) {
      return ACTIVITY_TYPE_GROUPS.CARD_TRANSACTIONS;
    }
    return '';
  });

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
        <Select
          name="activity-type"
          placeholder={String(i18n.t('Choose activity type'))}
          onChange={onChangeActivityType}
          value={activityType()}
        >
          <Option value={ACTIVITY_TYPE_GROUPS.ALL}>
            <Text message="All activity" />
          </Option>
          <Option value={ACTIVITY_TYPE_GROUPS.FUNDS_MOVEMENT}>
            <Text message="Funds movement" />
          </Option>
          <Option value={ACTIVITY_TYPE_GROUPS.CARD_TRANSACTIONS}>
            <Text message="Card transactions" />
          </Option>
        </Select>
        <FiltersButton
          label={<Text message="More filters" />}
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
          showTypeFilter
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
