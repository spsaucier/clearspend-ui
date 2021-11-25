import { createSignal, createEffect, createMemo, Show, Switch, Match } from 'solid-js';
import { Text } from 'solid-i18n';
import { useParams } from 'solid-app-router';

import { getNoop } from '_common/utils/getNoop';
import { Button } from '_common/components/Button';
import { Tab, TabList } from '_common/components/Tabs';
import { useResource } from '_common/utils/useResource';
import { Data } from 'app/components/Data';
import { Page } from 'app/components/Page';
import { BackLink } from 'app/components/BackLink';
import type { UUIDString } from 'app/types/common';
import { CardControls } from 'allocations/containers/CardControls';
import { useAllocations } from 'allocations/stores/allocations';
import { formatName } from 'employees/utils/formatName';
import { getUser } from 'employees/services';

import { Card } from '../../components/Card';
import { CardInfo } from '../../components/CardInfo';
import { Transactions } from '../../containers/Transactions';
import { formatCardNumber } from '../../utils/formatCardNumber';
import { getCard } from '../../services';

enum Tabs {
  transactions,
  controls,
}

export default function CardView() {
  const params = useParams<{ id: UUIDString }>();
  const [tab, setTab] = createSignal(Tabs.transactions);

  const allocations = useAllocations();
  const [card, status, , , reload] = useResource(getCard, params.id);
  const [user, uStatus, , setUserID, reloadUser] = useResource(getUser, undefined, false);

  createEffect(() => {
    const data = card();
    if (data) setUserID(data.userId);
  });

  // TODO withID()?
  const allocation = createMemo(() => allocations.data?.find((item) => item.allocationId === card()?.allocationId));

  return (
    <Page
      breadcrumbs={
        <BackLink to="/cards">
          <Text message="Cards" />
        </BackLink>
      }
      title={
        <Show when={card()} fallback={<Text message="Loading..." />}>
          {formatCardNumber(card()!.lastFour)}
        </Show>
      }
      actions={
        <Button size="lg" icon="freeze">
          <Text message="Freeze card" />
        </Button>
      }
      headerSide={
        <Show when={card()}>
          <Card
            type={card()!.type}
            name={user() ? formatName(user()!) : ''}
            number={card()!.lastFour}
            balance={allocation()?.account.ledgerBalance.amount || 0}
          />
        </Show>
      }
      subtitle={
        <Show when={card()}>
          <Data
            data={allocation() && user()}
            loading={allocations.loading || uStatus().loading}
            error={allocations.error || uStatus().error}
            onReload={() => Promise.all([allocations.reload(), reloadUser()]).catch(getNoop())}
          >
            <CardInfo user={user()!} allocation={allocation()!} allocations={allocations.data!} />
          </Data>
        </Show>
      }
    >
      <Data data={card()} loading={status().loading} error={status().error} onReload={reload}>
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
      </Data>
    </Page>
  );
}
