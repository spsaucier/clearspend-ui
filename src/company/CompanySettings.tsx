import { createSignal, Switch, Match } from 'solid-js';
import { Text } from 'solid-i18n';

import { TabList, Tab } from '_common/components/Tabs';
import { Page } from 'app/components/Page';
import { useBusiness } from 'app/containers/Main/context';

import { CompanyProfile } from './containers/CompanyProfile';
import { BankAccounts } from './containers/BankAccounts';

enum Tabs {
  profile,
  ledger,
  accounts,
  financial,
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
        <Tab value={Tabs.accounts}>
          <Text message="Bank Accounts" />
        </Tab>
      </TabList>
      <Switch>
        <Match when={tab() === Tabs.profile}>
          <CompanyProfile data={business()} />
        </Match>
        <Match when={tab() === Tabs.accounts}>
          <BankAccounts />
        </Match>
      </Switch>
    </Page>
  );
}
