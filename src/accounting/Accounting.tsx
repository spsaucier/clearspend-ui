import { createSignal, Switch, Match, Show } from 'solid-js';
import { Text } from 'solid-i18n';
import { Navigate } from 'solid-app-router';

import { TabList, Tab } from '_common/components/Tabs';
import { Page } from 'app/components/Page';
import { useBusiness } from 'app/containers/Main/context';

import { ExpenseCategories } from './containers/ExpenseCategories';
import { SyncTransactions } from './containers/SyncTransactions';
import { SyncLog } from './containers/SyncLog';
import { canSeeAccounting } from './utils/canSeeAccounting';

enum Tabs {
  categories,
  transactions,
  log,
}

export function Accounting() {
  const { signupUser } = useBusiness();
  const [tab, setTab] = createSignal(Tabs.categories);

  return (
    <Show when={canSeeAccounting(signupUser())} fallback={<Navigate href="/" />}>
      <Page title={<Text message="Accounting" />}>
        <TabList value={tab()} onChange={setTab}>
          <Tab value={Tabs.categories}>
            <Text message="Expense Categories" />
          </Tab>
          <Tab value={Tabs.transactions}>
            <Text message="Sync Transactions" />
          </Tab>
          <Tab value={Tabs.log}>
            <Text message="Sync Log" />
          </Tab>
        </TabList>
        <Switch>
          <Match when={tab() === Tabs.categories}>
            <ExpenseCategories />
          </Match>
          <Match when={tab() === Tabs.transactions}>
            <SyncTransactions />
          </Match>
          <Match when={tab() === Tabs.log}>
            <SyncLog />
          </Match>
        </Switch>
      </Page>
    </Show>
  );
}
