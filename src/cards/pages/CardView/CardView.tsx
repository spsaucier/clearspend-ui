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
import { usePageTabs } from 'app/utils/usePageTabs';
import { getAllocationPermissions, canManagePermissions, canManageCards } from 'allocations/utils/permissions';
import { getUser } from 'employees/services';
import { Drawer } from '_common/components/Drawer';
import { useMediaContext } from '_common/api/media/context';
import { Section } from 'app/components/Section';
import { Button } from '_common/components/Button';
import { Confirm } from '_common/components/Confirm';
import { Tag } from '_common/components/Tag';
import { CardStatements } from 'cards/containers/Statements';
import type { CardDetailsResponse, UpdateCardSpendControlsRequest } from 'generated/capital';
import { CardControls } from 'cards/containers/CardControls/CardControls';

import { Card } from '../../components/Card';
import { CardActions } from '../../components/CardActions';
import { CardInfo } from '../../components/CardInfo';
import { Transactions } from '../../containers/Transactions';
import { CardDetails } from '../../containers/CardDetails';
import { formatCardNumber } from '../../utils/formatCardNumber';
import { canSeeCardDetails } from '../../utils/canSeeCardDetails';
import { getCard, updateCard, blockCard, unblockCard, cancelCard, linkAllocationToCard } from '../../services';
import type { CardType } from '../../types';

import css from './CardView.css';

enum Tabs {
  transactions = 'transactions',
  controls = 'controls',
  info = 'info',
  settings = 'settings',
  statements = 'statements',
}

const RELOAD_TIMEOUT_MS = 200;

export default function CardView() {
  const i18n = useI18n();
  const messages = useMessages();
  const navigate = useNav();
  const media = useMediaContext();
  const params = useParams<{ id: string }>();

  const [tab, setTab] = usePageTabs<Tabs>(Tabs.transactions);
  const [showDetails, setShowDetails] = createSignal(false);
  const [cancelling, setCancelling] = createSignal(false);

  const { currentUser, currentUserRoles } = useBusiness();

  const [data, status, , , reload, mutate] = useResource(getCard, params.id);
  const [user, uStatus, , setUserID, reloadUser] = useResource(getUser, undefined, false);

  const card = createMemo(() => data()?.card);
  const isCancelled = createMemo(() => card()?.status === 'CANCELLED');
  const permissions = createMemo(() => getAllocationPermissions(currentUserRoles(), card()?.allocationId));

  createEffect(() => {
    const cardData = card();
    if (cardData) {
      setUserID(cardData.userId!);
    }
  });

  const onChangeStatus = (cardId: string, block: boolean) => {
    return (block ? blockCard(cardId) : unblockCard(cardId)).then(() => reload());
  };

  const onUpdateCard = async (cardId: string, updates: Readonly<UpdateCardSpendControlsRequest>) => {
    if (updates.allocationSpendControls?.length) {
      mutate(await updateCard(cardId, updates));
    }
    messages.success({
      title: i18n.t('Success'),
      message: i18n.t('Changes successfully saved.'),
    });
  };

  const onCancelCard = async (cardId: string) => {
    setCancelling(true);
    cancelCard(cardId)
      .then((cancelledCard) => {
        mutate({
          ...(data() as Required<CardDetailsResponse>),
          card: cancelledCard,
        });
        messages.success({
          title: i18n.t('Success'),
          message: i18n.t('Card successfully cancelled.'),
        });
        setCancelling(false);
        setTab(Tabs.transactions);
      })
      .catch((e: { data: { message: string } }) => {
        messages.error({
          title: i18n.t('Error'),
          message: e.data.message || i18n.t('Unable to cancel card'),
        });
        setCancelling(false);
      });
  };

  const toggleDetails = async () => {
    setShowDetails(!showDetails());
  };

  const CardInfoBlock = (infoProps: { rowView?: boolean }) => {
    return (
      <Data
        data={user()}
        loading={uStatus().loading}
        error={uStatus().error}
        onReload={() => Promise.all([reloadUser()]).catch(getNoop())}
      >
        <CardInfo
          rowView={infoProps.rowView}
          user={user()}
          cardData={data()}
          allocationId={card()?.allocationId}
          class={css.info}
          limits={data()?.allocationSpendControls}
          onUpdateLinkedAllocation={(id, name) => {
            if (data()?.card.cardId && id) {
              linkAllocationToCard(data()!.card.cardId!, id);
              messages.success({ title: i18n.t('Updated active allocation to {name}', { name }) });
              mutate({
                ...(data() as Required<CardDetailsResponse>),
                linkedAllocationId: id,
                linkedAllocationName: name,
              });
              setTimeout(reload, RELOAD_TIMEOUT_MS);
            }
          }}
        />
      </Data>
    );
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
          {formatCardNumber(card()!.lastFour, card()!.activated)}
        </Show>
      }
      extra={
        <Show when={isCancelled()}>
          <Tag type="danger">
            <Text message="Cancelled" />
          </Tag>
        </Show>
      }
      subtitle={
        <Show when={card() && !card()!.activated}>
          <Show
            when={card()!.issueDate}
            fallback={<Text message="This card will be mailed out in 1-2 business days." />}
          >
            <Show
              when={canSeeCardDetails({ ...card() }, currentUser())}
              fallback={<Text message="This card can be activated only by the cardholder. " />}
            >
              <Text message="When this card arrives in the mail, follow the instructions provided to activate it." />
            </Show>
          </Show>
        </Show>
      }
      actions={
        <div class={css.actions}>
          <Show when={card()}>
            <CardActions
              user={currentUser()}
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
                <Switch>
                  <Match when={card()!.status === 'INACTIVE'}>
                    <Text message="Card is frozen" class={css.frozenPopupTitle!} />
                  </Match>
                  <Match when={card()!.status === 'CANCELLED'}>
                    <Text message="Card is cancelled" class={css.frozenPopupTitle!} />
                  </Match>
                </Switch>
                <Text message="Cardholder cannot perform any activity with this card." />
              </>
            }
          >
            {(args) => (
              <div {...args} class={css.cardWrapper}>
                <Card
                  type={card()!.type as CardType}
                  number={card()!.lastFour || ''}
                  status={card()!.status}
                  activated={card()!.activated}
                  class={css.card}
                />
              </div>
            )}
          </Popover>
        </Show>
      }
      headerContent={
        <Show when={card() && media.medium}>
          <div class={css.infoWrapper}>
            <CardInfoBlock rowView />
          </div>
        </Show>
      }
    >
      <Data data={card()} loading={status().loading} error={status().error} onReload={reload}>
        <TabList value={tab()} onChange={setTab}>
          {!media.medium && (
            <Tab value={Tabs.info}>
              <Text message="Info" />
            </Tab>
          )}
          <Tab value={Tabs.transactions}>
            <Text message="Transactions" />
          </Tab>
          <Show when={canManageCards(permissions()) && card()?.status !== 'CANCELLED'}>
            <Tab value={Tabs.controls}>
              <Text message="Spend Controls" />
            </Tab>
          </Show>
          <Show when={canManagePermissions(permissions()) && card()?.status !== 'CANCELLED'}>
            <Tab value={Tabs.settings}>
              <Text message="Card Settings" />
            </Tab>
          </Show>
          {card()!.activated && (
            <Tab value={Tabs.statements}>
              <Text message="Statements" />
            </Tab>
          )}
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
              data={data()}
              allocationId={card()?.allocationId!}
              disabled={isCancelled()}
              onSave={onUpdateCard}
            />
          </Match>
          <Match when={tab() === Tabs.settings}>
            <Section
              title={i18n.t('Cancel (archive) card')}
              description={i18n.t(
                'Cancelling this card will permanently block it from authorizing new transactions. Any previously authorized transactions will still be processed.',
              )}
            >
              <Confirm
                position="bottom-center"
                question={
                  <div>
                    <Text message="Are you sure you want to permanently cancel this card? This cannot be undone." />
                  </div>
                }
                confirmText={<Text message="Continue" />}
                onConfirm={() => onCancelCard(card()!.cardId!)}
              >
                {(args) => (
                  <Button loading={cancelling()} type="danger" view="second" icon="archive" size="lg" {...args}>
                    {i18n.t('Cancel Card')}
                  </Button>
                )}
              </Confirm>
            </Section>
          </Match>
          <Match when={tab() === Tabs.statements}>
            <CardStatements
              cardId={card()!.cardId!}
              issueDate={card()!.issueDate!}
              expirationDate={card()!.expirationDate!}
            />
          </Match>
        </Switch>
        <Show when={!isCancelled()}>
          <Drawer open={showDetails() && !!user()} title={<Text message="Card details" />} onClose={toggleDetails}>
            <CardDetails card={card()!} user={user()!} onClose={toggleDetails} />
          </Drawer>
        </Show>
      </Data>
    </Page>
  );
}
