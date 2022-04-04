import { createSignal, Index, Show, batch, createMemo, createEffect } from 'solid-js';
import { useSearchParams } from 'solid-app-router';
import { Text } from 'solid-i18n';

import { i18n } from '_common/api/intl';
import { storage } from '_common/api/storage';
import { useNav } from '_common/api/router';
import { useDeferEffect } from '_common/utils/useDeferEffect';
import { Tab, TabList } from '_common/components/Tabs';
import { DEFAULT_PAGE_SIZE } from '_common/components/Pagination';
import { useMediaContext } from '_common/api/media/context';
import type { Allocation, AccountActivityRequest } from 'generated/capital';
import { Data } from 'app/components/Data';
import { extendPageSize, onPageSizeChange } from 'app/utils/pageSizeParam';
import { ALL_ALLOCATIONS } from 'allocations/components/AllocationSelect';
import { ACTIVITY_PAGE_SIZE_STORAGE_KEY, DEFAULT_ACTIVITY_PARAMS } from 'transactions/constants';
import { TransactionsData } from 'transactions/containers/TransactionsData';
import { getAllocationPermissions } from 'app/services/permissions';
import { useResource } from '_common/utils/useResource';
import { getRootAllocation } from 'allocations/utils/getRootAllocation';
import { onAllocationChange } from 'allocations/utils/onAllocationChange';
import { canRead } from 'allocations/utils/permissions';

import { SpendingByWidget } from '../../components/SpendingByWidget';
import { useSpending } from '../../stores/spending';
import { useActivity } from '../../stores/activity';
import { dateRangeToISO } from '../../utils/dateRangeToISO';
import type { ChartDataRequest } from '../../types/spending';
import { useBusiness } from '../Main/context';

import { TimePeriod, getTimePeriod, updateParams } from './utils';

import css from './Overview.css';

const PERIOD_OPTIONS = [
  { key: TimePeriod.today, text: i18n.t('Today') },
  { key: TimePeriod.week, text: i18n.t('This Week') },
  { key: TimePeriod.month, text: i18n.t('This Month') },
  { key: TimePeriod.quarter, text: i18n.t('This Quarter') },
  { key: TimePeriod.year, text: i18n.t('This Year') },
];

interface OverviewProps {
  allocationId: string | undefined;
  allocations: readonly Readonly<Allocation>[] | null;
  onAllocationChange: (id: string) => void;
}

export function Overview(props: Readonly<OverviewProps>) {
  const media = useMediaContext();
  const navigate = useNav();
  const [searchParams, setSearchParams] = useSearchParams<{ period?: TimePeriod }>();
  const { currentUser } = useBusiness();

  const initPeriod = searchParams.period || TimePeriod.year;
  const [period, setPeriod] = createSignal<TimePeriod>(initPeriod);

  const [userPermissions, , , setAllocationIdForPermissions] = useResource(getAllocationPermissions, undefined, false);

  const allocationId = createMemo(() => {
    return props.allocationId === ALL_ALLOCATIONS ? undefined : props.allocationId;
  });

  const DEFAULT_PARAMS = { ...dateRangeToISO(getTimePeriod(initPeriod)), allocationId: allocationId() };

  createEffect(() => {
    setAllocationIdForPermissions(allocationId() || getRootAllocation(props.allocations)?.allocationId || '');
  });

  const spendingStore = useSpending({ params: { ...DEFAULT_PARAMS, sortDirection: 'ASC' } });

  const activityStore = useActivity({
    params: {
      ...extendPageSize(DEFAULT_ACTIVITY_PARAMS, storage.get(ACTIVITY_PAGE_SIZE_STORAGE_KEY, DEFAULT_PAGE_SIZE)),
      ...DEFAULT_PARAMS,
    },
  });

  useDeferEffect(
    () => {
      batch(() => {
        const updates = { allocationId: allocationId() };
        spendingStore.setParams(updateParams<ChartDataRequest>(updates));
        activityStore.setParams(updateParams<AccountActivityRequest>(updates));
      });
    },
    () => props.allocationId,
  );

  const changePeriod = (value: TimePeriod) => {
    setPeriod(value);
    setSearchParams({ period: value });

    batch(() => {
      const range = dateRangeToISO(getTimePeriod(value));
      spendingStore.setParams(updateParams<ChartDataRequest>(range));
      activityStore.setParams(updateParams<AccountActivityRequest>(range));
    });
  };

  const showTopSpendingSection = createMemo(() =>
    Boolean(
      spendingStore.data &&
        spendingStore.data.merchantChartData.length +
          spendingStore.data.merchantCategoryChartData.length +
          spendingStore.data.userChartData.length +
          spendingStore.data.allocationChartData.length,
    ),
  );

  return (
    <div class={css.root}>
      <Show when={!media.small}>
        <TabList value={period()} onChange={changePeriod}>
          <Index each={PERIOD_OPTIONS}>{(option) => <Tab value={option().key}>{option().text}</Tab>}</Index>
        </TabList>
      </Show>
      <Show when={showTopSpendingSection() && (currentUser().type === 'BUSINESS_OWNER' || canRead(userPermissions()))}>
        <div class={css.section}>
          <h3 class={css.title}>
            <Text message="Top Spending" />
          </h3>
          <Data
            data={spendingStore.data}
            error={spendingStore.error}
            loading={spendingStore.loading}
            onReload={spendingStore.reload}
          >
            <SpendingByWidget data={spendingStore.data!} />
          </Data>
        </div>
      </Show>
      <div class={css.section}>
        <h3 class={css.title}>
          <Text message="Recent Transactions" />
        </h3>
        <Data
          data={activityStore.data}
          loading={activityStore.loading}
          error={activityStore.error}
          onReload={activityStore.reload}
        >
          <TransactionsData
            showAllocationFilter
            table={media.large}
            loading={activityStore.loading}
            error={activityStore.error}
            params={activityStore.params}
            dateRange={dateRangeToISO(getTimePeriod(period()))}
            data={activityStore.data}
            class={css.transactions}
            onReload={activityStore.reload}
            onChangeParams={onAllocationChange(
              onPageSizeChange(activityStore.setParams, (size) => storage.set(ACTIVITY_PAGE_SIZE_STORAGE_KEY, size)),
              (id: string | undefined) => props.onAllocationChange(id || ALL_ALLOCATIONS),
            )}
            onUpdateData={activityStore.setData}
            onCardClick={(cardId) => navigate(`/cards/view/${cardId}`)}
          />
        </Data>
      </div>
    </div>
  );
}
