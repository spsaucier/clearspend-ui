import { createSignal, Index, Show, batch, createMemo, Match, Switch } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { useSearchParams } from 'solid-app-router';
import { Text } from 'solid-i18n';

import { i18n } from '_common/api/intl';
import { useNav } from '_common/api/router';
import { Tab, TabList } from '_common/components/Tabs';
import { useMediaContext } from '_common/api/media/context';
import type { Allocation, UserRolesAndPermissionsRecord } from 'generated/capital';
import { Data } from 'app/components/Data';
import { ALL_ALLOCATIONS } from 'allocations/components/AllocationSelect';
import { canManageFunds, canManageUsers, canRead, hasSomeManagerRole } from 'allocations/utils/permissions';
import { usePageTabs } from 'app/utils/usePageTabs';
import { BusinessStatements } from 'transactions/components/BusinessStatements/BusinessStatements';

import { SpendingByWidget } from '../../components/SpendingByWidget';
import { useSpending } from '../../stores/spending';
import { dateRangeToISO } from '../../utils/dateRangeToISO';
import { useBusiness } from '../Main/context';
import { Transactions } from '../Transactions';
import { Ledger } from '../Ledger';

import { TimePeriod, getTimePeriod } from './utils';

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
  userPermissions: Readonly<UserRolesAndPermissionsRecord> | null;
  onAllocationChange: (id: string) => void;
}

enum OverviewTabs {
  recentActivity = 'recentActivity',
  statements = 'statements',
}

export function Overview(props: Readonly<OverviewProps>) {
  const media = useMediaContext();
  const navigate = useNav();

  const [tab, setTab] = usePageTabs<OverviewTabs>(OverviewTabs.recentActivity);

  const [searchParams, setSearchParams] = useSearchParams<{ period?: TimePeriod }>();
  const { currentUserRoles, permissions } = useBusiness();

  const initPeriod = searchParams.period || TimePeriod.year;
  const [period, setPeriod] = createSignal<TimePeriod>(initPeriod);

  const allocationId = createMemo(() => {
    return props.allocationId === ALL_ALLOCATIONS ? undefined : props.allocationId;
  });

  const spendingStore = useSpending({
    params: {
      ...dateRangeToISO(getTimePeriod(initPeriod)),
      allocationId: allocationId(),
      sortDirection: 'ASC',
    },
    deps: () => ({ allocationId: allocationId() }),
  });

  const changePeriod = (value: TimePeriod) => {
    batch(() => {
      setPeriod(value);
      setSearchParams({ period: value });
      spendingStore.setParams((prev) => ({ ...prev, ...dateRangeToISO(getTimePeriod(value)) }));
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
      <Show
        when={
          showTopSpendingSection() &&
          (canRead(props.userPermissions) || (!allocationId() && hasSomeManagerRole(currentUserRoles())))
        }
      >
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
        <Show when={canManageUsers(permissions())}>
          <TabList value={tab()} onChange={setTab}>
            <Tab value={OverviewTabs.recentActivity}>
              <Text message="Recent Activity" />
            </Tab>
            <Tab value={OverviewTabs.statements}>
              <Text message="Statements" />
            </Tab>
          </TabList>
        </Show>

        <Switch>
          <Match when={tab() === OverviewTabs.recentActivity}>
            <Dynamic
              component={
                canManageFunds(props.userPermissions) || (!allocationId() && hasSomeManagerRole(currentUserRoles()))
                  ? Ledger
                  : Transactions
              }
              table={media.large}
              allocationId={allocationId()}
              dateRange={dateRangeToISO(getTimePeriod(period()))}
              class={css.transactions}
              onCardClick={(cardId: string) => navigate(`/cards/view/${cardId}`)}
              onAllocationChange={props.onAllocationChange}
            />
          </Match>
          <Match when={tab() === OverviewTabs.statements}>
            <BusinessStatements />
          </Match>
        </Switch>
      </div>
    </div>
  );
}
