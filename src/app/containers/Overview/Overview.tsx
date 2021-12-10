import { createSignal, Match, Switch } from 'solid-js';

import type { ILineChartData } from '_common/components/Charts';
import { Tab, TabList } from '_common/components/Tabs';
import { useMediaContext } from '_common/api/media/context';
import { TransactionsData } from 'transactions/components/TransactionsData';
import type { AccountActivityRequest } from 'generated/capital';

import { SpendWidget } from '../../components/SpendWidget';
import { SpendingByWidget } from '../../components/SpendingByWidget';
import { LoadingError } from '../../components/LoadingError';
import { Loading } from '../../components/Loading';
import { useActivity } from '../../stores/activity';

import { getLineData } from './mock';
import { TimePeriod, getTimePeriod, toISO } from './utils';

import css from './Overview.css';

const DEFAULT_ACTIVITY_PARAMS: AccountActivityRequest = {
  ...toISO(getTimePeriod(TimePeriod.week)),
  pageRequest: {
    pageNumber: 0,
    pageSize: 10,
  },
};

export function Overview() {
  const media = useMediaContext();

  const [period, setPeriod] = createSignal<TimePeriod>(TimePeriod.week);

  const [data, setData] = createSignal<readonly ILineChartData[]>(getLineData());
  const activityStore = useActivity({ params: DEFAULT_ACTIVITY_PARAMS });

  const changePeriod = (value: TimePeriod) => {
    setPeriod(value);
    setData(getLineData());
    activityStore.setParams((prev) => ({ ...prev, ...toISO(getTimePeriod(value)) }));
  };

  return (
    <div class={css.root}>
      <TabList value={period()} onChange={changePeriod}>
        <Tab value={TimePeriod.week}>This Week</Tab>
        <Tab value={TimePeriod.month}>This Month</Tab>
        <Tab value={TimePeriod.quarter}>This Quarter</Tab>
        <Tab value={TimePeriod.year}>This Year</Tab>
        <Tab value={TimePeriod.today}>Today</Tab>
      </TabList>
      <div class={css.top}>
        <SpendWidget data={data()} />
        <SpendingByWidget />
      </div>
      <div>
        <h3 class={css.transactionTitle}>Recent Transactions</h3>
        <Switch>
          <Match when={activityStore.error}>
            <LoadingError onReload={activityStore.reload} />
          </Match>
          <Match when={activityStore.loading && !activityStore.data}>
            <Loading />
          </Match>
          <Match when={activityStore.data}>
            <TransactionsData
              table={media.large}
              loading={activityStore.loading}
              error={activityStore.error}
              search={activityStore.params.searchText}
              data={activityStore.data}
              onReload={activityStore.reload}
              onChangeParams={activityStore.setParams}
            />
          </Match>
        </Switch>
      </div>
    </div>
  );
}
