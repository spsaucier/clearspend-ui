import { createSignal, Switch, Match } from 'solid-js';
import { Text } from 'solid-i18n';

import { TabList, Tab } from '_common/components/Tabs';
import { Page } from 'app/components/Page';
import { useActivity } from 'app/stores/activity';
import { Data } from 'app/components/Data';
import { AccountingSettings } from 'accounting/containers/AccountingSettings';
import { SyncLog } from 'accounting/containers/SyncLog';
import { AccountingTimePeriod, getAccountingTimePeriod } from 'accounting/pages/AccountingTabs/utils';
import { AccountingOverview } from 'accounting/containers/AccountingOverview';
import { DEFAULT_ACTIVITY_PARAMS } from 'transactions/constants';

enum Tabs {
  transactions,
  settings,
  log,
}

function toISO(range: [from: ReadonlyDate, to: ReadonlyDate]) {
  return {
    from: range[0].toISOString() as DateString,
    to: range[1].toISOString() as DateString,
  };
}

export function AccountingTabs() {
  const [tab, setTab] = createSignal<Tabs>(Tabs.transactions);

  const initPeriod = AccountingTimePeriod.year; // TODO: revise period as necessary
  const PERIOD = toISO(getAccountingTimePeriod(initPeriod));

  const activityStore = useActivity({
    params: {
      ...DEFAULT_ACTIVITY_PARAMS,
      ...PERIOD,
      statuses: ['APPROVED'],
    },
  });

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
      <Data
        data={activityStore.data}
        loading={activityStore.loading}
        error={activityStore.error}
        onReload={activityStore.reload}
      >
        <Switch>
          <Match when={tab() === Tabs.transactions}>
            <AccountingOverview
              loading={activityStore.loading}
              error={activityStore.error}
              params={activityStore.params}
              data={activityStore.data}
              onReload={activityStore.reload}
              onChangeParams={activityStore.setParams}
              onUpdateData={activityStore.setData}
            />
          </Match>
          <Match when={tab() === Tabs.log}>
            <SyncLog />
          </Match>
          <Match when={tab() === Tabs.settings}>
            <AccountingSettings data={activityStore.data} />
          </Match>
        </Switch>
      </Data>
    </Page>
  );
}
