/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createMemo, Show } from 'solid-js';
import { useI18n, Text, DateTime } from 'solid-i18n';

import { DateFormat } from '_common/api/intl/types';
import { formatCurrency } from '_common/api/intl/formatCurrency';
import { useBool } from '_common/utils/useBool';
import { wrapAction } from '_common/utils/wrapAction';
import type { Setter } from '_common/types/common';
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
import { ACTIVITY_TYPE_TITLES } from 'transactions/constants';
import type { LedgerActivityRequest, LedgerActivityResponse, PagedDataLedgerActivityResponse } from 'generated/capital';
import { getResetFilters } from 'app/utils/getResetFilters';

import { Account } from '../Account';
import { LedgerFilters } from '../LedgerFilters';
import type { LedgerFiltersFields } from '../LedgerFilters/types';
import type { LedgerActivityType } from '../../types';

import css from './LedgerTable.css';

const FILTERS_KEYS: readonly LedgerFiltersFields[] = ['amount', 'from'];

interface LedgerTableProps {
  data: PagedDataLedgerActivityResponse;
  params: Readonly<LedgerActivityRequest>;
  onExport: (params: Readonly<LedgerActivityRequest>) => Promise<void>;
  onChangeParams: Setter<Readonly<LedgerActivityRequest>>;
}

export const renderAccount = (
  account: LedgerActivityResponse['sourceAccount'] | LedgerActivityResponse['targetAccount'],
  inline?: boolean,
) => {
  if (account) {
    switch (account.type) {
      case 'ALLOCATION':
        if ('allocationInfo' in account) {
          return <Account inline={inline} icon="allocations" name={account.allocationInfo!.name} />;
        }
        break;
      case 'BANK':
        if ('bankInfo' in account) {
          return (
            <Account
              inline={inline}
              icon="payment-bank"
              name={account.bankInfo!.name}
              extra={`•••• ${account.bankInfo?.accountNumberLastFour}`}
            />
          );
        }
        break;
      case 'CARD':
        if ('cardInfo' in account) {
          return <Account inline={inline} icon="card" name={account.cardInfo?.lastFour} />;
        }
        break;
      case 'MERCHANT':
        if ('merchantInfo' in account) {
          return <Account inline={inline} icon="merchant-services" name={account.merchantInfo!.name} />;
        }
        break;
      default:
        return '--';
    }
  }
  return '--';
};

export function LedgerTable(props: Readonly<LedgerTableProps>) {
  const i18n = useI18n();
  const messages = useMessages();

  const [showFilters, toggleFilters] = useBool();
  const [exporting, exportData] = wrapAction(props.onExport);

  const columns: readonly Readonly<TableColumn<LedgerActivityResponse>>[] = [
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
      name: 'type',
      title: <Text message="Type" />,
      render: (item) => ACTIVITY_TYPE_TITLES[item.type as LedgerActivityType],
    },
    {
      name: 'user',
      title: <Text message="User" />,
      render: (item) =>
        item.user?.userInfo?.firstName ? (
          <div>{`${item.user.userInfo.firstName} ${item.user.userInfo.lastName}`}</div>
        ) : (
          '--'
        ),
    },
    {
      name: 'source',
      title: <Text message="Initiating Account" />,
      class: css.source,
      render: (item) => renderAccount(item.sourceAccount),
    },
    {
      name: 'destination',
      title: <Text message="Target Account" />,
      class: css.destination,
      render: (item) => renderAccount(item.targetAccount),
    },
    {
      name: 'amount',
      title: <Text message="Amount" />,
      render: (item) => formatCurrency(item.amount?.amount || 0),
    },
  ];

  const onExport = () => {
    return exportData(props.params).catch(() => {
      messages.error({ title: i18n.t('Something went wrong') });
    });
  };

  const filtersCount = createMemo(() =>
    FILTERS_KEYS.reduce((sum, key) => sum + Number(props.params[key] !== undefined), 0),
  );

  const onResetFilters = () => {
    props.onChangeParams((prev) => ({ ...prev, ...getResetFilters(FILTERS_KEYS) }));
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
          placeholder={String(i18n.t('Search ledger entries...'))}
          class={css.search}
          onSearch={changeRequestSearch(props.onChangeParams)}
        />
        <FiltersButton
          label={<Text message="More Filters" />}
          count={filtersCount()}
          onReset={onResetFilters}
          onClick={toggleFilters}
        />
        <Show when={false}>
          <Button
            loading={exporting()}
            disabled={!props.data.content?.length}
            icon={{ name: 'download', pos: 'right' }}
            onClick={onExport}
          >
            <Text message="Export" />
          </Button>
        </Show>
      </Filters>
      <Show
        when={props.data.content?.length}
        fallback={<Empty message={<Text message="There are no ledger entries" />} />}
      >
        <Table columns={columns} data={props.data.content!} />
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
