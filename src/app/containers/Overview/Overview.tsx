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
import type {
  Allocation,
  GraphDataRequest,
  AccountActivityRequest,
  MerchantCategoryChartData,
  AllocationChartData,
  MerchantChartData,
  UserChartData,
  ChartDataRequest,
} from 'generated/capital';
import { Data } from 'app/components/Data';
import type { TagOption } from 'app/components/TagSelect';
import { extendPageSize, onPageSizeChange } from 'app/utils/pageSizeParam';
import { ALL_ALLOCATIONS } from 'allocations/components/AllocationSelect/AllocationSelect';
import { ACTIVITY_PAGE_SIZE_STORAGE_KEY, DEFAULT_ACTIVITY_PARAMS } from 'transactions/constants';
import { TransactionsData } from 'transactions/containers/TransactionsData';
import { getAllocationPermissions } from 'app/services/permissions';
import { useResource } from '_common/utils/useResource';
import { getRootAllocation } from 'allocations/utils/getRootAllocation';
import { canRead } from 'allocations/utils/permissions';
import { useEmployeeSpending } from 'app/stores/employeeSpending';
import { useMerchantSpending } from 'app/stores/merchantSpending';
import { useAllocationSpending } from 'app/stores/allocationSpending';
import { useMerchantCategorySpending } from 'app/stores/merchantCategorySpending';

import { SpendingByWidget } from '../../components/SpendingByWidget';
import { useSpend } from '../../stores/spend';
import { useActivity } from '../../stores/activity';
import { dateRangeToISO } from '../../utils/dateRangeToISO';
import { useBusiness } from '../Main/context';

import { TimePeriod, getTimePeriod, updateParams } from './utils';

import css from './Overview.css';

const PERIOD_OPTIONS: readonly Readonly<TagOption>[] = [
  { key: TimePeriod.today, text: i18n.t('Today') },
  { key: TimePeriod.week, text: i18n.t('This Week') },
  { key: TimePeriod.month, text: i18n.t('This Month') },
  { key: TimePeriod.quarter, text: i18n.t('This Quarter') },
  { key: TimePeriod.year, text: i18n.t('This Year') },
];

interface OverviewProps {
  allocationId: string | undefined;
  allocations: readonly Readonly<Allocation>[] | null;
}

export function Overview(props: Readonly<OverviewProps>) {
  const media = useMediaContext();
  const navigate = useNav();
  const [searchParams, setSearchParams] = useSearchParams<{ period?: TimePeriod }>();
  const { currentUser } = useBusiness();

  const initPeriod = searchParams.period || TimePeriod.week;
  const [period, setPeriod] = createSignal<TimePeriod>(initPeriod);

  const [userPermissions, , , setAllocationIdForPermissions] = useResource(getAllocationPermissions, undefined, false);

  const allocationId = createMemo(() => {
    return props.allocationId === ALL_ALLOCATIONS ? undefined : props.allocationId;
  });

  const DEFAULT_PARAMS = { ...dateRangeToISO(getTimePeriod(initPeriod)), allocationId: allocationId() };

  createEffect(() => {
    setAllocationIdForPermissions(allocationId() || getRootAllocation(props.allocations)?.allocationId || '');
  });

  const spendStore = useSpend({
    params: { ...dateRangeToISO(getTimePeriod(initPeriod)), allocationId: allocationId() },
  });

  // TODO: Refactor once https://tranwall.atlassian.net/browse/CAP-747 is completed on backend to use 'ALL' filter
  const employeeCategorySpendingStore = useEmployeeSpending({ params: DEFAULT_PARAMS });
  const merchantCategorySpendingStore = useMerchantCategorySpending({ params: DEFAULT_PARAMS });
  const merchantSpendingStore = useMerchantSpending({ params: DEFAULT_PARAMS });
  const allocationSpending = useAllocationSpending({ params: DEFAULT_PARAMS });

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
        spendStore.setParams(updateParams<GraphDataRequest>(updates));
        allocationSpending.setParams(updateParams<Omit<ChartDataRequest, 'chartFilter'>>(updates));
        merchantSpendingStore.setParams(updateParams<Omit<ChartDataRequest, 'chartFilter'>>(updates));
        merchantCategorySpendingStore.setParams(updateParams<Omit<ChartDataRequest, 'chartFilter'>>(updates));
        employeeCategorySpendingStore.setParams(updateParams<Omit<ChartDataRequest, 'chartFilter'>>(updates));
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
      spendStore.setParams(updateParams<GraphDataRequest>(range));
      allocationSpending.setParams(updateParams<Omit<ChartDataRequest, 'chartFilter'>>(range));
      merchantSpendingStore.setParams(updateParams<Omit<ChartDataRequest, 'chartFilter'>>(range));
      merchantCategorySpendingStore.setParams(updateParams<Omit<ChartDataRequest, 'chartFilter'>>(range));
      employeeCategorySpendingStore.setParams(updateParams<Omit<ChartDataRequest, 'chartFilter'>>(range));
      activityStore.setParams(updateParams<AccountActivityRequest>(range));
    });
  };

  const showTopSpendingSection = createMemo(
    () =>
      (merchantCategorySpendingStore.data?.merchantCategoryChartData ?? []).length +
        (allocationSpending.data?.allocationChartData ?? []).length +
        (employeeCategorySpendingStore.data?.userChartData ?? []).length +
        (merchantSpendingStore.data?.merchantChartData ?? []).length >
      0,
  );

  return (
    <div class={css.root}>
      <Show when={!media.small}>
        <TabList value={period()} onChange={changePeriod}>
          <Index each={PERIOD_OPTIONS}>{(option) => <Tab value={option().key}>{option().text}</Tab>}</Index>
        </TabList>
      </Show>
      <Show when={showTopSpendingSection() && (currentUser().type === 'BUSINESS_OWNER' || canRead(userPermissions()))}>
        <div class={css.top}>
          <h3 class={css.transactionTitle}>
            <Text message="Top Spending" />
          </h3>
          <Data
            data={spendStore.data}
            error={spendStore.error}
            loading={spendStore.loading}
            onReload={spendStore.reload}
          >
            <SpendingByWidget
              data={{
                merchantCategoryChartData: merchantCategorySpendingStore.data
                  ?.merchantCategoryChartData! as MerchantCategoryChartData[],
                allocationChartData: allocationSpending.data?.allocationChartData as AllocationChartData[],
                userChartData: employeeCategorySpendingStore.data?.userChartData as UserChartData[],
                merchantChartData: merchantSpendingStore.data?.merchantChartData as MerchantChartData[],
              }}
            />
          </Data>
        </div>
      </Show>
      <div>
        <h3 class={css.transactionTitle}>
          <Text message="Recent Transactions" />
        </h3>
        <Data
          data={activityStore.data}
          loading={activityStore.loading}
          error={activityStore.error}
          onReload={activityStore.reload}
        >
          <TransactionsData
            table={media.large}
            loading={activityStore.loading}
            error={activityStore.error}
            params={activityStore.params}
            dateRange={dateRangeToISO(getTimePeriod(period()))}
            data={activityStore.data}
            onReload={activityStore.reload}
            onChangeParams={onPageSizeChange(activityStore.setParams, (size) =>
              storage.set(ACTIVITY_PAGE_SIZE_STORAGE_KEY, size),
            )}
            onUpdateData={activityStore.setData}
            onCardClick={(cardId) => navigate(`/cards/view/${cardId}`)}
          />
        </Data>
      </div>
    </div>
  );
}
