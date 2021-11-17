import { createSignal, Switch, Match } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { Text } from 'solid-i18n';

import { useMediaContext } from '_common/api/media/context';
import { useResource } from '_common/utils/useResource';
import { formatCurrency } from '_common/api/intl/formatCurrency';
import { Button } from '_common/components/Button';
import { Tab, TabList } from '_common/components/Tabs';
import { Page } from 'app/components/Page';
import { Loading } from 'app/components/Loading';
import { LoadingError } from 'app/components/LoadingError';
import { CardsList } from 'cards/components/CardsList';
import { CardsTable } from 'cards/components/CardsTable';
import CARDS from 'cards/cards.json';
import type { SearchCardResponse } from 'cards/types';

import { AllocationsSide } from './components/AllocationsSide';
import { AllocationBalances } from './components/AllocationBalances';
import { getRootAllocation } from './services';

import css from './Allocations.css';

enum Tabs {
  cards,
  transactions,
  controls,
  settings,
}

const DATA = {
  number: 0,
  size: 10,
  totalElements: 6,
  content: [...CARDS, ...CARDS, ...CARDS] as unknown as SearchCardResponse['content'],
} as SearchCardResponse;

export default function Allocations() {
  const media = useMediaContext();
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
                <div class={undefined} />
                <AllocationBalances />
                <h3 class={css.subTitle}>
                  <Text message="Cards" />
                </h3>
                <Dynamic component={media.wide ? CardsTable : CardsList} data={DATA} hideColumns={['allocation']} />
              </Match>
            </Switch>
          </Page>
        )}
      </Match>
    </Switch>
  );
}
