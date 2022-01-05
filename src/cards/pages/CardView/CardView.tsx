import { createSignal, createEffect, createMemo, Show, Switch, Match } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';
import { useParams } from 'solid-app-router';

import { getNoop } from '_common/utils/getNoop';
import { wrapAction } from '_common/utils/wrapAction';
import { Confirm } from '_common/components/Confirm';
import { Button } from '_common/components/Button';
import { Tab, TabList } from '_common/components/Tabs';
import { useResource } from '_common/utils/useResource';
import { Data } from 'app/components/Data';
import { Page } from 'app/components/Page';
import { BackLink } from 'app/components/BackLink';
import { useMessages } from 'app/containers/Messages/context';
import { CardControls } from 'allocations/containers/CardControls';
import { useAllocations } from 'allocations/stores/allocations';
import { allocationWithID } from 'allocations/utils/allocationWithID';
import { formatName } from 'employees/utils/formatName';
import { getUser } from 'employees/services';
import type { Allocation, UpdateCardRequest } from 'generated/capital';
import { Drawer } from '_common/components/Drawer';

import { Card } from '../../components/Card';
import { CardInfo } from '../../components/CardInfo';
import { Transactions } from '../../containers/Transactions';
import { formatCardNumber } from '../../utils/formatCardNumber';
import { getCard, updateCard, blockCard, unblockCard } from '../../services';
import type { CardType } from '../../types';

import CardDetails from './CardDetails';

enum Tabs {
  transactions,
  controls,
}

export default function CardView() {
  const i18n = useI18n();
  const messages = useMessages();
  const params = useParams<{ id: string }>();
  const [tab, setTab] = createSignal(Tabs.transactions);
  const [showDetails, setShowDetails] = createSignal(false);

  const allocations = useAllocations();
  const [data, status, , , reload] = useResource(getCard, params.id);
  const [user, uStatus, , setUserID, reloadUser] = useResource(getUser, undefined, false);

  const [freezing, freeze] = wrapAction(blockCard);
  const [unfreezing, unfreeze] = wrapAction(unblockCard);

  const card = createMemo(() => data()?.card);

  createEffect(() => {
    const cardData = card();
    if (cardData) setUserID(cardData.userId!);
  });

  const allocation = createMemo(
    () => allocations.data?.find(allocationWithID(card()?.allocationId)) as Allocation | undefined,
  );

  const onUpdateCard = async (cardId: string, updates: Readonly<UpdateCardRequest>) => {
    await updateCard(cardId, updates);
    messages.success({
      title: i18n.t('Success'),
      message: i18n.t('Changes successfully saved.'),
    });
  };

  const toggleDetails = async () => {
    setShowDetails(!showDetails());
  };

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
        <div>
          <span style={{ 'margin-right': '10px' }}>
            <Button size="lg" type="primary" view="ghost" onClick={toggleDetails}>
              <Text message={`${showDetails() ? 'Hide' : 'Show'} Card Details`} />
            </Button>
          </span>
          <Switch>
            <Match when={card()?.status === 'ACTIVE'}>
              <Confirm
                position="bottom-right"
                question={
                  <Text message="Freezing the card will prevent the cardholder from performing any transactions." />
                }
                confirmText={<Text message="Freeze card now" />}
                onConfirm={() => {
                  freeze(card()!.cardId!)
                    .then(() => reload())
                    .catch(() => messages.error({ title: i18n.t('Something went wrong') }));
                }}
              >
                {(triggerProps) => (
                  <Button
                    size="lg"
                    icon="freeze"
                    type="danger"
                    view="second"
                    loading={freezing()}
                    onClick={triggerProps.onClick}
                  >
                    <Text message="Freeze Card" />
                  </Button>
                )}
              </Confirm>
            </Match>
            <Match when={card()?.status === 'INACTIVE'}>
              <Button
                size="lg"
                icon="freeze"
                type="primary"
                view="second"
                loading={unfreezing()}
                onClick={() => {
                  unfreeze(card()!.cardId!)
                    .then(() => reload())
                    .catch(() => messages.error({ title: i18n.t('Something went wrong') }));
                }}
              >
                <Text message="Unfreeze Card" />
              </Button>
            </Match>
          </Switch>
        </div>
      }
      headerSide={
        <Show when={card()?.type}>
          <Card
            type={card()!.type as CardType}
            name={user() ? formatName(user()!) : ''}
            allocation={allocation()?.name}
            number={card()!.lastFour || ''}
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
            <Transactions cardId={card()!.cardId!} />
          </Match>
          <Match when={tab() === Tabs.controls}>
            <CardControls
              id={card()!.cardId!}
              data={data()!}
              allocationId={card()!.allocationId}
              maxAmount={data()!.ledgerBalance}
              onSave={onUpdateCard}
            />
          </Match>
        </Switch>
        <Drawer noPadding open={showDetails()} title={<Text message="Filter cards" />} onClose={toggleDetails}>
          <CardDetails card={card} user={user} onClose={toggleDetails} />
        </Drawer>
      </Data>
    </Page>
  );
}
