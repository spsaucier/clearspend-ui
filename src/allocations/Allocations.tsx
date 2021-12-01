import { createSignal, createMemo } from 'solid-js';
import { Show, Switch, Match } from 'solid-js/web';
import { useParams } from 'solid-app-router';
import { Text } from 'solid-i18n';

import { useNav } from '_common/api/router';
import { formatCurrency } from '_common/api/intl/formatCurrency';
import { Button } from '_common/components/Button';
import { Tab, TabList } from '_common/components/Tabs';
import { Data } from 'app/components/Data';
import { Page } from 'app/components/Page';
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
  const navigate = useNav();
  const params = useParams<{ id?: UUIDString }>();

  const [tab, setTab] = createSignal(Tabs.cards);
  const allocations = useAllocations();

  const onIdChange = (id: UUIDString) => {
    setTab(Tabs.cards);
    navigate(`/allocations/${id}`);
  };

  const current = createMemo(() => {
    return params.id
      ? allocations.data?.find((item) => item.allocationId === params.id)
      : getRootAllocation(allocations.data);
  });

  return (
    <Data data={allocations.data} loading={allocations.loading} error={allocations.error} onReload={allocations.reload}>
      <Show when={current()}>
        <Page
          title={formatCurrency(current()!.account.ledgerBalance.amount)}
          titleClass={css.title}
          breadcrumbs={<Breadcrumbs current={current()!} items={allocations.data!} />}
          actions={
            <div class={css.actions}>
              <Button type="primary" size="lg" icon="add">
                <Text message="Add Funds" />
              </Button>
              <Button
                icon="add"
                size="lg"
                onClick={() => navigate('/cards/edit', { state: { allocationId: current()?.allocationId } })}
              >
                <Text message="New Card" />
              </Button>
            </div>
          }
          side={<AllocationsSide currentID={current()!.allocationId} items={allocations.data!} onSelect={onIdChange} />}
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
              <Cards current={current()!} items={allocations.data!} />
            </Match>
            <Match when={tab() === Tabs.transactions}>
              <Transactions allocationId={current()!.allocationId} />
            </Match>
            <Match when={tab() === Tabs.controls}>
              <CardControls />
            </Match>
            <Match when={tab() === Tabs.settings}>
              <Settings />
            </Match>
          </Switch>
        </Page>
      </Show>
    </Data>
  );
}
