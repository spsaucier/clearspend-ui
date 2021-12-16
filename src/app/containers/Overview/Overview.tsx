import { createSignal, Index, Match, Show, Switch } from 'solid-js';

import type { ILineChartData } from '_common/components/Charts';
import { Tab, TabList } from '_common/components/Tabs';
import { useMediaContext } from '_common/api/media/context';
import { TransactionsData } from 'transactions/components/TransactionsData';
import type { AccountActivityRequest } from 'generated/capital';
import { TagOption, TagSelect } from 'app/components/TagSelect';

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

const PERIOD_OPTIONS: readonly Readonly<TagOption>[] = [
  { key: TimePeriod.week, text: 'This Week' },
  { key: TimePeriod.month, text: 'This Month' },
  { key: TimePeriod.quarter, text: 'This Quarter' },
  { key: TimePeriod.year, text: 'This Year' },
  { key: TimePeriod.today, text: 'Today' },
];

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
      <Show when={!media.small}>
        <TabList value={period()} onChange={changePeriod}>
          <Index each={PERIOD_OPTIONS}>
            {(option) => {
              return <Tab value={option().key}>{option().text}</Tab>;
            }}
          </Index>
        </TabList>
      </Show>
      <div class={css.top}>
        <SpendWidget
          data={data()}
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
