import { createSignal, Switch, Match } from 'solid-js';
import { Text } from 'solid-i18n';

import { TabList, Tab } from '_common/components/Tabs';
import { Page } from 'app/components/Page';
import { useBusiness } from 'app/containers/Main/context';

import { CompanyProfile } from './containers/CompanyProfile';
import { Integrations } from './containers/Integrations/Integrations';
// import {BankAccounts} from './containers/BankAccounts';

enum Tabs {
  profile,
  ledger,
  accounts,
  financial,
  integrations,
}

export default function CompanySettings() {
  const [tab, setTab] = createSignal(Tabs.profile);
  const { business } = useBusiness();

  return (
    <Page title={<Text message="Company settings" />}>
      <TabList value={tab()} onChange={setTab}>
        <Tab value={Tabs.profile}>
          <Text message="Company Profile" />
        </Tab>
        {/*
        <Tab value={Tabs.accounts}>
          <Text message="Bank Accounts" />
        </Tab>
        */}
        <Tab value={Tabs.integrations}>
          <Text message="Integrations" />
        </Tab>
      </TabList>
      <Switch>
        <Match when={tab() === Tabs.profile}>
          <CompanyProfile data={business()} />
        </Match>
        {/*
        <Match when={tab() === Tabs.accounts}>
          <BankAccounts />
        </Match>
        */}
        <Match when={tab() === Tabs.integrations}>
          <Integrations />
        </Match>
      </Switch>
    </Page>
  );
}
