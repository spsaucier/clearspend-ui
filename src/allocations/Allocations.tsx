import { createSignal, Switch, Match } from 'solid-js';
import { Text } from 'solid-i18n';

import { useResource } from '_common/utils/useResource';
import { formatCurrency } from '_common/api/intl/formatCurrency';
import { Button } from '_common/components/Button';
import { Tab, TabList } from '_common/components/Tabs';
import { Page } from 'app/components/Page';
import { Loading } from 'app/components/Loading';
import { LoadingError } from 'app/components/LoadingError';

import { AllocationsSide } from './components/AllocationsSide';
import { Cards } from './containers/Cards';
import { Transactions } from './containers/Transactions';
import { CardControls } from './containers/CardControls';
import { Settings } from './containers/Settings';
import { getRootAllocation } from './services';

import css from './Allocations.css';

enum Tabs {
  cards,
  transactions,
  controls,
  settings,
}

export default function Allocations() {
  const [tab, setTab] = createSignal(Tabs.cards);

  const [root, status, , , reload] = useResource(getRootAllocation, null);

  return (
    <Switch>
      <Match when={status().error}>
        <LoadingError onReload={reload} />
      </Match>
      <Match when={status().loading && !root()}>
        <Loading />
      </Match>
      <Match when={root()}>
        {(data) => (
          <Page
            title={formatCurrency(data.account.ledgerBalance.amount)}
            titleClass={css.title}
            breadcrumb={
              <span>
                {data.name}
                {/*[Name] / <strong>[Allocation]</strong>*/}
              </span>
            }
            actions={
              <div class={css.actions}>
                <Button type="primary" size="lg" icon="add">
                  <Text message="Add Funds" />
                </Button>
                <Button icon="add" size="lg">
                  <Text message="New Card" />
                </Button>
              </div>
            }
            side={<AllocationsSide />}
            contentClass={css.content}
          >
            <TabList value={tab()} onChange={setTab}>
              <Tab value={Tabs.cards}>
                <Text message="Cards" />
              </Tab>
              <Tab value={Tabs.transactions}>
                <Text message="Transactions" />
              </Tab>
              <Tab value={Tabs.controls}>
                <Text message="Card Controls" />
              </Tab>
              <Tab value={Tabs.settings}>
                <Text message="Settings" />
              </Tab>
            </TabList>
            <Switch>
              <Match when={tab() === Tabs.cards}>
                <Cards />
              </Match>
              <Match when={tab() === Tabs.transactions}>
                <Transactions />
              </Match>
              <Match when={tab() === Tabs.controls}>
                <CardControls />
              </Match>
              <Match when={tab() === Tabs.settings}>
                <Settings />
              </Match>
            </Switch>
          </Page>
        )}
      </Match>
    </Switch>
  );
}
