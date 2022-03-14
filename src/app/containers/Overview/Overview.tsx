import { createSignal, Index, Show, batch, createMemo } from 'solid-js';
import { useSearchParams } from 'solid-app-router';
import { Text } from 'solid-i18n';

import { i18n } from '_common/api/intl';
import { useNav } from '_common/api/router';
import { useDeferEffect } from '_common/utils/useDeferEffect';
import { Tab, TabList } from '_common/components/Tabs';
import { useMediaContext } from '_common/api/media/context';
import type { GraphDataRequest, ChartDataRequest, AccountActivityRequest } from 'generated/capital';
import { Data } from 'app/components/Data';
import { TagOption, TagSelect } from 'app/components/TagSelect';
import { ALL_ALLOCATIONS } from 'allocations/components/AllocationSelect/AllocationSelect';
import { DEFAULT_ACTIVITY_PARAMS } from 'transactions/constants';
import { TransactionsData } from 'transactions/components/TransactionsData';
import { getAllocationPermissions } from 'app/services/permissions';
import { useResource } from '_common/utils/useResource';

import { SpendWidget } from '../../components/SpendWidget';
import { SpendingByWidget } from '../../components/SpendingByWidget';
import { useSpend } from '../../stores/spend';
import { useSpending } from '../../stores/spending';
import { useActivity } from '../../stores/activity';
import { canManageFunds } from '../../../allocations/utils/permissions';
import { useBusiness } from '../Main/context';

import { TimePeriod, getTimePeriod, toISO, updateParams } from './utils';

import css from './Overview.css';

const PERIOD_OPTIONS: readonly Readonly<TagOption>[] = [
  { key: TimePeriod.week, text: i18n.t('This Week') },
  { key: TimePeriod.month, text: i18n.t('This Month') },
  { key: TimePeriod.quarter, text: i18n.t('This Quarter') },
  { key: TimePeriod.year, text: i18n.t('This Year') },
  { key: TimePeriod.today, text: i18n.t('Today') },
];

interface OverviewProps {
  allocationId: string | undefined;
}

export function Overview(props: Readonly<OverviewProps>) {
  const media = useMediaContext();
  const navigate = useNav();
  const [searchParams, setSearchParams] = useSearchParams<{ period?: TimePeriod }>();
  const { currentUser } = useBusiness();

  const initPeriod = searchParams.period || TimePeriod.week;
  const PERIOD = toISO(getTimePeriod(initPeriod));
  const [period, setPeriod] = createSignal<TimePeriod>(initPeriod);

  const [userPermissions, , , setAllocationIdForPermissions] = useResource(getAllocationPermissions, undefined, false);

  const allocationId = createMemo(() => {
    const id = props.allocationId === ALL_ALLOCATIONS ? undefined : props.allocationId;
    setAllocationIdForPermissions(id || '');
    return id;
  });

  const spendStore = useSpend({ params: { ...PERIOD, allocationId: allocationId() } });

  const spendingStore = useSpending({
    params: {
      ...PERIOD,
      allocationId: allocationId(),
      chartFilter: 'ALLOCATION',
    },
  });

  const activityStore = useActivity({
    params: {
      ...DEFAULT_ACTIVITY_PARAMS,
      ...PERIOD,
      allocationId: allocationId(),
    },
  });

  useDeferEffect(
    () => {
      batch(() => {
        const updates = { allocationId: allocationId() };
        spendStore.setParams(updateParams<GraphDataRequest>(updates));
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
      const range = toISO(getTimePeriod(value));
      spendStore.setParams(updateParams<GraphDataRequest>(range));
      spendingStore.setParams(updateParams<ChartDataRequest>(range));
      activityStore.setParams(updateParams<AccountActivityRequest>(range));
    });
  };

  return (
    <div class={css.root}>
      <Show when={!media.small}>
        <TabList value={period()} onChange={changePeriod}>
          <Index each={PERIOD_OPTIONS}>{(option) => <Tab value={option().key}>{option().text}</Tab>}</Index>
        </TabList>
      </Show>
      <Show when={currentUser().type === 'BUSINESS_OWNER' || canManageFunds(userPermissions())}>
        <div class={css.top}>
          <Data
            error={spendStore.error}
            loading={spendStore.loading}
            data={spendStore.data}
            onReload={spendStore.reload}
          >
            <SpendWidget
              period={period()}
              data={spendStore.data!}
              controls={
                <Show when={media.small}>
                  <TagSelect
                    class={css.fullWidthDropdown}
                    value={period()}
                    options={PERIOD_OPTIONS}
                    onChange={(timePeriod) => changePeriod(timePeriod as TimePeriod)}
                  />
                </Show>
              }
            />
          </Data>
          <Data
            data={spendingStore.data}
            error={spendingStore.error}
            loading={spendingStore.loading}
            onReload={spendingStore.reload}
          >
            <SpendingByWidget
              loading={spendingStore.loading}
              data={spendingStore.data!}
              params={spendingStore.params}
              onFilterChange={(chartFilter) =>
                spendingStore.setParams((prev) => ({ ...prev, chartFilter } as ChartDataRequest))
              }
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
            data={activityStore.data}
            onReload={activityStore.reload}
            onChangeParams={activityStore.setParams}
            onUpdateData={activityStore.setData}
            onCardClick={(cardId) => navigate(`/cards/view/${cardId}`)}
          />
        </Data>
      </div>
    </div>
  );
}
