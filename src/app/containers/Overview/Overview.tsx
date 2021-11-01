import { createSignal, Show, Index } from 'solid-js';

import { times } from '_common/utils/times';
import type { ILineChartData } from '_common/components/Charts';
import { TabList, Tab } from '_common/components/Tabs';
import { useMediaContext } from '_common/api/media/context';
import { TransactionCompact } from 'transactions/components/TransactionCompact';
import { TransactionsTable } from 'transactions/containers/TransactionsTable';

import { SpendWidget } from '../../components/SpendWidget';
import { SpendingByWidget } from '../../components/SpendingByWidget';

import { getLineData } from './mock';

import css from './Overview.css';

enum TimePeriod {
  week = 'week',
  month = 'month',
  quarter = 'quarter',
  year = 'year',
  today = 'today',
}

export function Overview() {
  const media = useMediaContext();

  const [period, setPeriod] = createSignal<TimePeriod>(TimePeriod.week);
  const [data, setData] = createSignal<readonly ILineChartData[]>(getLineData());

  return (
    <div class={css.root}>
      <TabList
        value={period()}
        onChange={(val) => {
          setPeriod(val as TimePeriod);
          setData(getLineData());
        }}
      >
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
        <Show
          when={media.large}
          fallback={
            <>
              {/* eslint-disable-next-line @typescript-eslint/no-magic-numbers */}
              <Index each={times(10)}>{() => <TransactionCompact class={css.transactionCompact} />}</Index>
            </>
          }
        >
          <TransactionsTable />
        </Show>
      </div>
    </div>
  );
}
