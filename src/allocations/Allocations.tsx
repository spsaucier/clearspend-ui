import { createSignal, createMemo, createEffect, batch, on } from 'solid-js';
import { Show, Switch, Match } from 'solid-js/web';
import { useParams } from 'solid-app-router';
import { useI18n, Text } from 'solid-i18n';

import { useNav } from '_common/api/router';
import { useResource } from '_common/utils/useResource';
import { formatCurrency } from '_common/api/intl/formatCurrency';
import { Button } from '_common/components/Button';
import { Tab, TabList } from '_common/components/Tabs';
import { Data } from 'app/components/Data';
import { Page } from 'app/components/Page';
import { Drawer } from '_common/components/Drawer';
import { getAllocationPermissions } from 'app/services/permissions';
import { useMessages } from 'app/containers/Messages/context';
import { usePageTabs } from 'app/utils/usePageTabs';
import type { UpdateAllocationRequest } from 'generated/capital';
import { useMediaContext } from '_common/api/media/context';

import { AllocationsSide } from './components/AllocationsSide';
import { Breadcrumbs } from './components/Breadcrumbs';
import { Cards } from './containers/Cards';
import { Transactions } from './containers/Transactions';
import { CardControls } from './containers/CardControls';
import { Ledger } from './containers/Ledger';
import { Settings } from './containers/Settings';
import { ManageBalance } from './containers/ManageBalance';
import { useAllocations } from './stores/allocations';
import { getAvailableBalance } from './utils/getAvailableBalance';
import { getRootAllocation } from './utils/getRootAllocation';
import { allocationWithID } from './utils/allocationWithID';
import { canManageFunds, canManageCards, canManagePermissions } from './utils/permissions';
import { getAllocation, updateAllocation } from './services';

import css from './Allocations.css';

enum Tabs {
  cards = 'cards',
  transactions = 'transactions',
  controls = 'controls',
  ledger = 'ledger',
  settings = 'settings',
}

export default function Allocations() {
  const i18n = useI18n();
  const navigate = useNav();
  const messages = useMessages();
  const params = useParams<{ id?: string }>();
  const media = useMediaContext();

  const [tab, setTab] = usePageTabs<Tabs>(Tabs.cards);
  const [manageId, setManageId] = createSignal<string>();
  const allocations = useAllocations();

  const onAllocationChange = () => setTab(Tabs.cards, true);

  const current = createMemo(() => {
    return params.id ? allocations.data?.find(allocationWithID(params.id)) : getRootAllocation(allocations.data);
  });

  const [data, status, , setAllocationId, reload, mutate] = useResource(getAllocation, undefined, false);
  const [userPermissions, , , setAllocationIdForPermissions] = useResource(getAllocationPermissions, undefined, false);

  createEffect(
    on(
      createMemo(() => current()?.allocationId),
      (id) => {
        if (!id) return;
        batch(() => {
          setAllocationId(id);
          setAllocationIdForPermissions(id);
        });
      },
    ),
  );

  const onUpdateAllocation = async (allocationId: string, updates: Readonly<UpdateAllocationRequest>) => {
    mutate(await updateAllocation(allocationId, updates));
    messages.success({
      title: i18n.t('Success'),
      message: i18n.t('Changes successfully saved.'),
    });
  };

  return (
    <Data data={allocations.data} loading={allocations.loading} error={allocations.error} onReload={allocations.reload}>
      <Show when={current()}>
        <Page
          title={media.medium && formatCurrency(getAvailableBalance(current()!))}
          titleClass={css.title}
          breadcrumbs={media.medium && <Breadcrumbs current={current()!} items={allocations.data!} />}
          actions={
            <div class={css.actions}>
              <Show when={canManageFunds(userPermissions())}>
                <Button type="primary" size="lg" icon="dollars" onClick={() => setManageId(current()?.allocationId)}>
                  <Text message="Manage Balance" />
                </Button>
              </Show>
              <Show when={canManageCards(userPermissions())}>
                <Button
                  icon="add"
                  size="lg"
                  onClick={() => navigate('/cards/edit', { state: { allocationId: current()?.allocationId } })}
                >
                  <Text message="New Card" />
                </Button>
              </Show>
            </div>
          }
          side={
            <AllocationsSide
              currentID={current()!.allocationId}
              userPermissions={userPermissions()}
              items={allocations.data!}
              onAllocationChange={onAllocationChange}
            />
          }
          contentClass={css.content}
        >
          <TabList value={tab()} onChange={setTab}>
            <Tab value={Tabs.cards}>
              <Text message="Cards" />
            </Tab>
            <Tab value={Tabs.transactions}>
              <Text message="Transactions" />
            </Tab>
            <Show when={canManagePermissions(userPermissions())}>
              <Tab value={Tabs.controls}>
                <Text message="Card Controls" />
              </Tab>
            </Show>
            <Show when={canManageFunds(userPermissions())}>
              <Tab value={Tabs.ledger}>
                <Text message="Ledger" />
              </Tab>
            </Show>
            <Show when={canManageCards(userPermissions())}>
              <Tab value={Tabs.settings}>
                <Text message="Settings" />
              </Tab>
            </Show>
          </TabList>
          <Switch>
            <Match when={tab() === Tabs.cards}>
              <Cards current={current()!} allocations={allocations.data!} />
            </Match>
            <Match when={tab() === Tabs.transactions}>
              <Transactions allocationId={current()!.allocationId} />
            </Match>
            <Match when={tab() === Tabs.controls}>
              <Data error={status().error} loading={status().loading} data={data()} onReload={reload}>
                <CardControls
                  id={data()!.allocation.allocationId}
                  data={data()!}
                  maxAmount={data()!.allocation.account.availableBalance || { currency: 'UNSPECIFIED', amount: 0 }}
                  onSave={onUpdateAllocation}
                />
              </Data>
            </Match>
            <Match when={tab() === Tabs.ledger}>
              <Ledger allocationId={current()!.allocationId} />
            </Match>
            <Match when={tab() === Tabs.settings}>
              <Settings allocation={current()!} onReload={allocations.reload} permissions={userPermissions} />
            </Match>
          </Switch>
          <Drawer open={Boolean(manageId())} title={<Text message="Manage balance" />} onClose={() => setManageId()}>
            <ManageBalance
              allocationId={manageId()!}
              allocations={allocations.data!}
              onReload={allocations.reload}
              onClose={() => setManageId()}
            />
          </Drawer>
        </Page>
      </Show>
    </Data>
  );
}
