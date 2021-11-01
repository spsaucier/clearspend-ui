import { createSignal } from 'solid-js';

import { TabList, Tab } from '_common/components/Tabs';

import { SpendWidget } from '../../components/SpendWidget';
import { SpendingByWidget } from '../../components/SpendingByWidget';

import css from './Overview.css';

enum TimePeriod {
  week = 'week',
  month = 'month',
  quarter = 'quarter',
  year = 'year',
  today = 'today',
}

export function Overview() {
  const [period, setPeriod] = createSignal<TimePeriod>(TimePeriod.week);

  return (
    <div class={css.root}>
      <TabList value={period()} onChange={(val) => setPeriod(val as TimePeriod)}>
        <Tab value={TimePeriod.week}>This Week</Tab>
        <Tab value={TimePeriod.month}>This Month</Tab>
        <Tab value={TimePeriod.quarter}>This Quarter</Tab>
        <Tab value={TimePeriod.year}>This Year</Tab>
        <Tab value={TimePeriod.today}>Today</Tab>
      </TabList>
      <div class={css.top}>
        <SpendWidget />
        <SpendingByWidget />
      </div>
    </div>
  );
}
