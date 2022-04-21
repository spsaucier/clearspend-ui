import { Switch, Match } from 'solid-js';
import { Text } from 'solid-i18n';

import { TabList, Tab } from '_common/components/Tabs';
import { Page } from 'app/components/Page';
import { usePageTabs } from 'app/utils/usePageTabs';

import { CompanyProfile } from './containers/CompanyProfile';
import { BankAccounts } from './containers/BankAccounts';
import { FinancialInfo } from './containers/FinancialInfo';

enum Tabs {
  profile = 'profile',
  accounts = 'accounts',
  financial = 'financial',
}

export default function CompanySettings() {
  const [tab, setTab] = usePageTabs<Tabs>(Tabs.profile);

  return (
    <Page title={<Text message="Company settings" />}>
      <TabList value={tab()} onChange={setTab}>
        <Tab value={Tabs.profile}>
          <Text message="Company Profile" />
        </Tab>
        <Tab value={Tabs.accounts}>
          <Text message="Bank Accounts" />
        </Tab>
        <Tab value={Tabs.financial}>
          <Text message="Financial Info" />
        </Tab>
      </TabList>
      <Switch>
        <Match when={tab() === Tabs.profile}>
          <CompanyProfile />
        </Match>
        <Match when={tab() === Tabs.accounts}>
          <BankAccounts />
        </Match>
        <Match when={tab() === Tabs.financial}>
          <FinancialInfo />
        </Match>
      </Switch>
    </Page>
  );
}
