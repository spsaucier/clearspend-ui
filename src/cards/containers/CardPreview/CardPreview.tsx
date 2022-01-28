import { useNavigate } from 'solid-app-router';
import { Text } from 'solid-i18n';
import { createSignal, createEffect, createMemo, Switch, Match } from 'solid-js';

import { useResource } from '_common/utils/useResource';
import { Button } from '_common/components/Button';
import { TabList, Tab } from '_common/components/Tabs';
import { Data } from 'app/components/Data';
import { getAccountActivity } from 'app/services/activity';
import type { AccountActivityRequest } from 'generated/capital';
import { useAllocations } from 'allocations/stores/allocations';
import { allocationWithID } from 'allocations/utils/allocationWithID';
import { formatName } from 'employees/utils/formatName';
import { getUser } from 'employees/services';
import type { CardType } from 'cards/types';
import { TransactionsList } from 'transactions/components/TransactionsList';

import { Card } from '../../components/Card';
import { CardInfo } from '../../components/CardInfo';
import { getCard } from '../../services';

import css from './CardPreview.css';

enum Tabs {
  transactions,
  details,
}

const DEFAULT_ACTIVITY_PARAMS: Readonly<AccountActivityRequest> = {
  pageRequest: {
    pageNumber: 0,
    pageSize: 10,
  },
};

interface CardPreviewProps {
  cardID: string;
}

export function CardPreview(props: Readonly<CardPreviewProps>) {
  const navigate = useNavigate();
  const [tab, setTab] = createSignal(Tabs.transactions);

  const allocations = useAllocations();
  const [data, status, , , reload] = useResource(getCard, props.cardID);
  const [user, , , setUserID] = useResource(getUser, undefined, false);

  const [activity, aStatus, aParams, setActivityParams, reloadActivity] = useResource(
    getAccountActivity,
    DEFAULT_ACTIVITY_PARAMS,
    false,
  );

  const card = createMemo(() => data()?.card);

  createEffect(() => {
    const cardData = card();
    if (!cardData) return;

    setUserID(cardData.userId!);
    setActivityParams((prev) => ({ ...prev, cardId: cardData.cardId }));
  });

  const allocation = createMemo(() => allocations.data?.find(allocationWithID(card()?.allocationId)));

  return (
    <div class={css.root}>
      <Data data={card()} loading={status().loading} error={status().error} onReload={reload}>
        <div>
          <Card
            type={card()!.type as CardType}
            name={user() ? formatName(user()!) : ''}
            number={card()!.lastFour || ''}
            allocation={allocation()?.name}
            balance={data()!.availableBalance.amount}
            notActivated={!card()!.activated}
            class={css.card}
          />
          <TabList value={tab()} onChange={setTab}>
            <Tab value={Tabs.transactions}>
              <Text message="Recent transactions" />
            </Tab>
            <Tab value={Tabs.details}>
              <Text message="Details" />
            </Tab>
          </TabList>
          <Switch>
            <Match when={tab() === Tabs.transactions}>
              <Data data={activity()} loading={aStatus().loading} error={aStatus().error} onReload={reloadActivity}>
                <TransactionsList params={aParams()} data={activity()!} onChangeParams={setActivityParams} />
              </Data>
            </Match>
            <Match when={tab() === Tabs.details}>
              <CardInfo user={user()!} allocation={allocation()!} allocations={allocations.data!} />
            </Match>
          </Switch>
        </div>
        <Button wide type="primary" onClick={() => navigate(`/cards/view/${card()!.cardId}`)}>
          <Text message="View all card details" />
        </Button>
      </Data>
    </div>
  );
}
