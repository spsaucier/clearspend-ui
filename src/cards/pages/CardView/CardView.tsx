import { createSignal, createEffect, createMemo, Show, Switch, Match } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';
import { useParams } from 'solid-app-router';

import { useNav } from '_common/api/router';
import { getNoop } from '_common/utils/getNoop';
import { Tab, TabList } from '_common/components/Tabs';
import { Popover } from '_common/components/Popover';
import { useResource } from '_common/utils/useResource';
import { Data } from 'app/components/Data';
import { Page } from 'app/components/Page';
import { BackLink } from 'app/components/BackLink';
import { useBusiness } from 'app/containers/Main/context';
import { useMessages } from 'app/containers/Messages/context';
import { CardControls } from 'allocations/containers/CardControls';
import { useAllocations } from 'allocations/stores/allocations';
import { allocationWithID } from 'allocations/utils/allocationWithID';
import { formatName } from 'employees/utils/formatName';
import { getUser } from 'employees/services';
import type { Allocation, UpdateCardRequest } from 'generated/capital';
import { Drawer } from '_common/components/Drawer';
import { useMediaContext } from '_common/api/media/context';

import { Card } from '../../components/Card';
import { CardActions } from '../../components/CardActions';
import { CardInfo } from '../../components/CardInfo';
import { Transactions } from '../../containers/Transactions';
import { Statements } from '../../containers/Statements';
import { formatCardNumber } from '../../utils/formatCardNumber';
import { getCard, updateCard, blockCard, unblockCard } from '../../services';
import type { CardType } from '../../types';

import CardDetails from './CardDetails';

import css from './CardView.css';

enum Tabs {
  transactions,
  controls,
  info,
  statements,
}

export default function CardView() {
  const i18n = useI18n();
  const messages = useMessages();
  const navigate = useNav();
  const params = useParams<{ id: string }>();
  const [tab, setTab] = createSignal(Tabs.transactions);
  const [showDetails, setShowDetails] = createSignal(false);
  const media = useMediaContext();

  const { signupUser } = useBusiness();
  const allocations = useAllocations();

  const [data, status, , , reload] = useResource(getCard, params.id);
  const [user, uStatus, , setUserID, reloadUser] = useResource(getUser, undefined, false);

  const card = createMemo(() => data()?.card);

  createEffect(() => {
    const cardData = card();
    if (cardData) setUserID(cardData.userId!);
  });

  const allocation = createMemo(
    () => allocations.data?.find(allocationWithID(card()?.allocationId)) as Allocation | undefined,
  );

  const onChangeStatus = (cardId: string, block: boolean) => {
    return (block ? blockCard(cardId) : unblockCard(cardId)).then(() => reload());
  };

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

  const CardInfoBlock = () => (
    <Data
      data={allocation() && user()}
      loading={allocations.loading || uStatus().loading}
      error={allocations.error || uStatus().error}
      onReload={() => Promise.all([allocations.reload(), reloadUser()]).catch(getNoop())}
    >
      <CardInfo user={user()!} allocation={allocation()!} allocations={allocations.data!} class={css.info} />
    </Data>
  );

  return (
    <Page
      breadcrumbs={
        <BackLink to="/cards">
          <Text message="Cards" />
        </BackLink>
      }
      title={
        <Show when={card()} fallback={<Text message="Loading..." />}>
          {formatCardNumber(card()!.lastFour, card()!.activated)}
        </Show>
      }
      subtitle={
        <Show when={card() && !card()!.activated}>
          <Show
            when={card()!.issueDate}
            fallback={<Text message="This card will be mailed out in 1-2 business days." />}
          >
            <Text message="When this card arrives in the mail, follow the instructions provided to activate it." />
          </Show>
        </Show>
      }
      actions={
        <div class={css.actions}>
          <Show when={card()}>
            <CardActions
              user={signupUser()}
              card={card()!}
              onActivate={() => navigate(`/cards/activate/${card()!.cardId}`)}
              onShowDetails={toggleDetails}
              onChangeStatus={onChangeStatus}
            />
          </Show>
        </div>
      }
      headerSide={
        <Show when={card()?.type}>
          <Popover
            balloon
            trigger="hover"
            position="bottom-center"
            disabled={card()!.status === 'ACTIVE' || !card()!.activated}
            class={css.frozenPopup}
            content={
              <>
                <Text message="Card is frozen" class={css.frozenPopupTitle!} />
                <Text message="Cardholder cannot perform any activity with this card." />
              </>
            }
          >
            {(args) => (
              <div {...args} class={css.cardWrapper}>
                <Card
                  type={card()!.type as CardType}
                  name={media.medium ? undefined : user() ? formatName(user()!) : ''}
                  allocation={media.medium ? undefined : allocation()?.name}
                  number={card()!.lastFour || ''}
                  balance={media.medium ? undefined : allocation()?.account.ledgerBalance.amount || 0}
                  status={card()!.status}
                  notActivated={!card()!.activated}
                />
              </div>
            )}
          </Popover>
        </Show>
      }
      headerContent={
        <Show when={card() && media.medium}>
          <CardInfoBlock />
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
          {!media.medium && (
            <Tab value={Tabs.info}>
              <Text message="Info" />
            </Tab>
          )}
          <Tab value={Tabs.statements}>
            <Text message="Statements" />
          </Tab>
        </TabList>
        <Switch>
          <Match when={tab() === Tabs.transactions}>
            <Transactions cardId={card()!.cardId!} />
          </Match>
          <Match when={tab() === Tabs.info}>
            <CardInfoBlock />
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
          <Match when={tab() === Tabs.statements}>
            <Statements
              cardId={card()!.cardId!}
              issueDate={card()!.issueDate!}
              expirationDate={card()!.expirationDate!}
            />
          </Match>
        </Switch>
        <Drawer noPadding open={showDetails()} title={<Text message="Card details" />} onClose={toggleDetails}>
          <CardDetails card={card} user={user} onClose={toggleDetails} />
        </Drawer>
      </Data>
    </Page>
  );
}
