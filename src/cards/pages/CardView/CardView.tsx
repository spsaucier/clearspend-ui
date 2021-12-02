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
import type { UUIDString } from 'app/types/common';
import { CardControls } from 'allocations/containers/CardControls';
import { useAllocations } from 'allocations/stores/allocations';
import { formatName } from 'employees/utils/formatName';
import { getUser } from 'employees/services';

import { Card } from '../../components/Card';
import { CardInfo } from '../../components/CardInfo';
import { Transactions } from '../../containers/Transactions';
import { formatCardNumber } from '../../utils/formatCardNumber';
import { getCard, blockCard, unblockCard } from '../../services';
import { CardStatus } from '../../types';

enum Tabs {
  transactions,
  controls,
}

export default function CardView() {
  const i18n = useI18n();
  const messages = useMessages();
  const params = useParams<{ id: UUIDString }>();
  const [tab, setTab] = createSignal(Tabs.transactions);

  const allocations = useAllocations();
  const [card, status, , , reload] = useResource(getCard, params.id);
  const [user, uStatus, , setUserID, reloadUser] = useResource(getUser, undefined, false);

  const [freezing, freeze] = wrapAction(blockCard);
  const [unfreezing, unfreeze] = wrapAction(unblockCard);

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
        <>
          <Switch>
            <Match when={card()?.status === CardStatus.OPEN}>
              <Confirm
                position="bottom-right"
                question={
                  <Text message="Freezing the card will prevent the cardholder from performing any transactions." />
                }
                confirmText={<Text message="Freeze card now" />}
                onConfirm={() => {
                  freeze(card()!.cardId)
                    .then(() => reload())
                    .catch(() => messages.error({ title: i18n.t('Something going wrong') }));
                }}
              >
                {({ onClick }) => (
                  <Button size="lg" icon="freeze" type="danger" view="second" loading={freezing()} onClick={onClick}>
                    <Text message="Freeze Card" />
                  </Button>
                )}
              </Confirm>
            </Match>
            <Match when={card()?.status === CardStatus.BLOCKED}>
              <Button
                size="lg"
                icon="freeze"
                type="primary"
                view="second"
                loading={unfreezing()}
                onClick={() => {
                  unfreeze(card()!.cardId)
                    .then(() => reload())
                    .catch(() => messages.error({ title: i18n.t('Something going wrong') }));
                }}
              >
                <Text message="Unfreeze Card" />
              </Button>
            </Match>
          </Switch>
        </>
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
            <Transactions cardId={card()!.cardId} />
          </Match>
          <Match when={tab() === Tabs.controls}>
            <CardControls />
          </Match>
        </Switch>
      </Data>
    </Page>
  );
}
