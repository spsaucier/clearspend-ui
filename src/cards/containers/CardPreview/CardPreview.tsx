import { useNavigate } from 'solid-app-router';
import { Text } from 'solid-i18n';
import { createSignal, createEffect, createMemo, Show, Switch, Match } from 'solid-js';

import { useResource } from '_common/utils/useResource';
import { Button } from '_common/components/Button';
import { TabList, Tab } from '_common/components/Tabs';
import { Data } from 'app/components/Data';
import { useBusiness } from 'app/containers/Main/context';
import { getAccountActivity } from 'app/services/activity';
import { useAllocations } from 'allocations/stores/allocations';
import { allocationWithID } from 'allocations/utils/allocationWithID';
import { getUser } from 'employees/services';
import type { CardType } from 'cards/types';
import { TransactionsList } from 'transactions/components/TransactionsList';
import { DEFAULT_TRANSACTIONS_PARAMS } from 'transactions/constants';

import { Card } from '../../components/Card';
import { CardInfo } from '../../components/CardInfo';
import { canActivateCard } from '../../utils/canActivateCard';
import { getCard } from '../../services';

import css from './CardPreview.css';

enum Tabs {
  transactions,
  details,
}

interface CardPreviewProps {
  cardID: string;
}

export function CardPreview(props: Readonly<CardPreviewProps>) {
  const navigate = useNavigate();
  const [tab, setTab] = createSignal(Tabs.transactions);

  const { currentUser } = useBusiness();
  const allocations = useAllocations();
  const [data, getCardRequestStatus, , , reload] = useResource(getCard, props.cardID);
  const [user, , , setUserID] = useResource(getUser, undefined, false);

  const [activity, accountActivityRequestStatus, accountActivityParams, setActivityParams, reloadActivity] =
    useResource(getAccountActivity, DEFAULT_TRANSACTIONS_PARAMS, false);

  const card = createMemo(() => data()?.card);

  createEffect(() => {
    const cardData = card();
    if (!cardData) return;

    setUserID(cardData.userId!);
    setActivityParams((prev) => ({ ...prev, cardId: cardData.cardId }));
  });

  const allocation = createMemo(() => allocations.data?.find(allocationWithID(card()?.allocationId)));

  const showActivate = createMemo(() => {
    const cardData = card();
    return cardData && !cardData.activated && canActivateCard(cardData, currentUser());
  });

  return (
    <div class={css.root}>
      <Data
        data={card()}
        loading={getCardRequestStatus().loading}
        error={getCardRequestStatus().error}
        onReload={reload}
      >
        <div class={css.content}>
          <Card
            type={card()!.type as CardType}
            number={card()!.lastFour || ''}
            status={card()!.status}
            activated={card()!.activated}
            class={css.card}
          />
          <TabList value={tab()} onChange={setTab}>
            <Tab value={Tabs.transactions}>
              <Text message="Recent Transactions" />
            </Tab>
            <Tab value={Tabs.details}>
              <Text message="Details" />
            </Tab>
          </TabList>
          <Switch>
            <Match when={tab() === Tabs.transactions}>
              <Data
                data={activity()}
                loading={accountActivityRequestStatus().loading}
                error={accountActivityRequestStatus().error}
                onReload={reloadActivity}
              >
                <TransactionsList
                  params={accountActivityParams()}
                  data={activity()!}
                  onChangeParams={setActivityParams}
                />
              </Data>
            </Match>
            <Match when={tab() === Tabs.details}>
              <CardInfo
                limits={data()?.limits}
                user={user()!}
                allocation={allocation()!}
                allocations={allocations.data!}
              />
            </Match>
          </Switch>
        </div>
        <div class={css.controls}>
          <Show when={showActivate()}>
            <Button wide type="primary" onClick={() => navigate(`/cards/activate/${card()!.cardId}`)}>
              <Text message="Activate card now" />
            </Button>
          </Show>
          <Button
            wide
            type={showActivate() ? 'default' : 'primary'}
            onClick={() => navigate(`/cards/view/${card()!.cardId}`)}
          >
            <Text message="View all card details" />
          </Button>
        </div>
      </Data>
    </div>
  );
}
