import { createSignal, Switch, Match } from 'solid-js';
import { Text } from 'solid-i18n';
import { useSearchParams } from 'solid-app-router';

import { TabList, Tab } from '_common/components/Tabs';
import { Page } from 'app/components/Page';
import { AccountingSettings } from 'accounting/containers/AccountingSettings';
import { SyncTransactions } from 'accounting/containers/SyncTransactions';
import { SyncLog } from 'accounting/containers/SyncLog';

enum Tabs {
  transactions,
  settings,
  log,
}

export function AccountingTabs() {
  const [params] = useSearchParams();
  const initialTab = params.tab === 'settings' ? Tabs.settings : Tabs.transactions;
  const [tab, setTab] = createSignal<Tabs>(initialTab);

  return (
    <Page title={<Text message="Accounting" />}>
      <TabList value={tab()} onChange={setTab}>
        <Tab value={Tabs.transactions}>
          <Text message="Sync Transactions" />
        </Tab>
        <Tab value={Tabs.log}>
          <Text message="Sync Log" />
        </Tab>
        <Tab value={Tabs.settings}>
          <Text message="Settings" />
        </Tab>
      </TabList>
      <Switch>
        <Match when={tab() === Tabs.transactions}>
          <SyncTransactions />
        </Match>
        <Match when={tab() === Tabs.log}>
          <SyncLog />
        </Match>
        <Match when={tab() === Tabs.settings}>
          <AccountingSettings />
        </Match>
      </Switch>
    </Page>
  );
}
