import { createSignal, Show, Switch, Match } from 'solid-js';
import { Text } from 'solid-i18n';
import { useParams } from 'solid-app-router';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import { Button } from '_common/components/Button';
import { Icon } from '_common/components/Icon';
import { Tab, TabList } from '_common/components/Tabs';
import { useResource } from '_common/utils/useResource';
import { Page } from 'app/components/Page';
import { LoadingError } from 'app/components/LoadingError';
import { Loading } from 'app/components/Loading';
import { BackLink } from 'app/components/BackLink';
import type { UUIDString } from 'app/types/common';
import { CardControls } from 'allocations/containers/CardControls';

import { Card } from '../../components/Card';
import { Transactions } from '../../containers/Transactions';
import { formatCardNumber } from '../../utils/formatCardNumber';
import { getCard } from '../../services';

import css from './CardView.css';

enum Tabs {
  transactions,
  controls,
}

export default function CardView() {
  const params = useParams<{ id: UUIDString }>();
  const [tab, setTab] = createSignal(Tabs.transactions);

  const [card, status, , , reload] = useResource(getCard, params.id);

  return (
    <Page
      breadcrumbs={
        <BackLink to="/cards">
          <Text message="Cards" />
        </BackLink>
      }
      title={
        <Show when={card()} fallback={<Text message="Loading..." />}>
          {(data) => formatCardNumber(data.lastFour)}
        </Show>
      }
      actions={
        <Button size="lg" icon="freeze">
          <Text message="Freeze card" />
        </Button>
      }
      headerSide={
        <Show when={card()} fallback={null}>
          {(data) => <Card type={data.type} name="[Some Name]" number={data.lastFour} balance={0} />}
        </Show>
      }
      subtitle={
        <Show when={card()}>
          {() => (
            <div class={css.items}>
              <div class={css.item}>
                <h4 class={css.itemTitle}>
                  <Text message="Available Balance" />
                </h4>
                <div class={css.itemValue}>
                  <strong>[amount]</strong>
                  <Icon name="information" />
                </div>
                <Text message="Monthly limit: {amount}" amount={formatCurrency(0)} class={css.itemNote!} />
              </div>
              <div class={css.item}>
                <h4 class={css.itemTitle}>
                  <Text message="Allocation" />
                </h4>
                <div class={css.itemValue}>
                  <strong>[Name]</strong>
                  <Icon name="chevron-right" />
                </div>
                <span class={css.itemNote}>[parent]</span>
              </div>
              <div class={css.item}>
                <h4 class={css.itemTitle}>
                  <Text message="Employee" />
                </h4>
                <div class={css.itemValue}>
                  <strong>[User Name]</strong>
                  <Icon name="chevron-right" />
                </div>
                <span class={css.itemNote}>[email]</span>
              </div>
            </div>
          )}
        </Show>
      }
    >
      <Switch>
        <Match when={status().error}>
          <LoadingError onReload={reload} />
        </Match>
        <Match when={status().loading && !card()}>
          <Loading />
        </Match>
        <Match when={card()}>
          {() => (
            <>
              <TabList value={tab()} onChange={setTab}>
                <Tab value={Tabs.transactions}>
                  <Text message="Transactions" />
                </Tab>
                <Tab value={Tabs.controls}>
                  <Text message="Spend Controls" />
                </Tab>
              </TabList>
              <Switch>
                <Match when={tab() === Tabs.transactions}>
                  <Transactions />
                </Match>
                <Match when={tab() === Tabs.controls}>
                  <CardControls />
                </Match>
              </Switch>
            </>
          )}
        </Match>
      </Switch>
    </Page>
  );
}
