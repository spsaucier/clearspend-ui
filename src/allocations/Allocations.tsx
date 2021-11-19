import { createSignal, createEffect, createMemo, Switch, Match, batch, untrack } from 'solid-js';
import { Text } from 'solid-i18n';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import { Button } from '_common/components/Button';
import { Tab, TabList } from '_common/components/Tabs';
import { Page } from 'app/components/Page';
import { Loading } from 'app/components/Loading';
import { LoadingError } from 'app/components/LoadingError';
import type { UUIDString } from 'app/types/common';

import { AllocationsSide } from './components/AllocationsSide';
import { Breadcrumbs } from './components/Breadcrumbs';
import { Cards } from './containers/Cards';
import { Transactions } from './containers/Transactions';
import { CardControls } from './containers/CardControls';
import { Settings } from './containers/Settings';
import { useAllocations } from './stores/allocations';
import { getRootAllocation } from './utils/getRootAllocation';

import css from './Allocations.css';

enum Tabs {
  cards,
  transactions,
  controls,
  settings,
}

export default function Allocations() {
  const [tab, setTab] = createSignal(Tabs.cards);

  const [id, setId] = createSignal<UUIDString>();
  const allocations = useAllocations();

  createEffect(() => {
    if (untrack(id)) return;
    const root = getRootAllocation(allocations.data);
    if (root) setId(root.allocationId);
  });

  const onIdChange = (value: UUIDString) => {
    batch(() => {
      setId(value);
      setTab(Tabs.cards);
    });
  };

  const current = createMemo(() => allocations.data?.find((item) => item.allocationId === id()));

  return (
    <Switch>
      <Match when={allocations.error}>
        <LoadingError onReload={allocations.reload} />
      </Match>
      <Match when={allocations.loading && !allocations.data}>
        <Loading />
      </Match>
      <Match when={allocations.data && current()}>
        {(data) => (
          <Page
            title={formatCurrency(data.account.ledgerBalance.amount)}
            titleClass={css.title}
            breadcrumbs={<Breadcrumbs current={data} items={allocations.data!} />}
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
            side={<AllocationsSide currentID={data.allocationId} items={allocations.data!} onSelect={onIdChange} />}
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
                <Cards current={data} items={allocations.data!} />
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
