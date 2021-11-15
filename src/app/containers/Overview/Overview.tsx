import { createSignal, Match, Show, Switch } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import type { ILineChartData } from '_common/components/Charts';
import { Tab, TabList } from '_common/components/Tabs';
import { useMediaContext } from '_common/api/media/context';
import { useResource } from '_common/utils/useResource';
import { NoTransactions } from 'transactions/components/NoTransactions';
import { TransactionsList } from 'transactions/components/TransactionsList';
import { TransactionsTable } from 'transactions/components/TransactionsTable';

import { SpendWidget } from '../../components/SpendWidget';
import { SpendingByWidget } from '../../components/SpendingByWidget';
import { LoadingError } from '../../components/LoadingError';
import { Loading } from '../../components/Loading';
import { getAccountActivity } from '../../services/activity';
import type { AccountActivityRequest } from '../../types/activity';

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
  const [activities, aStatus, , setActivityParams, reloadActivities] = useResource(
    getAccountActivity,
    DEFAULT_ACTIVITY_PARAMS,
  );

  const changePeriod = (value: TimePeriod) => {
    setPeriod(value);
    setData(getLineData());
    setActivityParams((prev) => ({ ...prev, ...toISO(getTimePeriod(value)) }));
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
          <Match when={aStatus().error}>
            <LoadingError onReload={reloadActivities} />
          </Match>
          <Match when={aStatus().loading && !activities()}>
            <Loading />
          </Match>
          <Match when={activities()}>
            {(resp) => (
              <Show when={!!resp.content.length} fallback={<NoTransactions />}>
                <Dynamic
                  component={media.large ? TransactionsTable : TransactionsList}
                  data={resp}
                  onChangeParams={setActivityParams}
                />
              </Show>
            )}
          </Match>
        </Switch>
      </div>
    </div>
  );
}
