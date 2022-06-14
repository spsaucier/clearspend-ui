import { createSignal, createMemo, createEffect, on } from 'solid-js';
import { Show, Switch, Match, Dynamic } from 'solid-js/web';
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
import { useMessages } from 'app/containers/Messages/context';
import { useBusiness } from 'app/containers/Main/context';
import { usePageTabs } from 'app/utils/usePageTabs';
import type { UpdateAllocationRequest } from 'generated/capital';
import { useMediaContext } from '_common/api/media/context';
import { Tag } from '_common/components/Tag';

import { byNameChain } from './components/AllocationSelect/utils';
import { AllocationsSide } from './components/AllocationsSide';
import { Breadcrumbs } from './components/Breadcrumbs';
import { Cards } from './containers/Cards';
import { Transactions } from './containers/Transactions';
import { Ledger } from './containers/Ledger';
import { DefaultCardControls } from './containers/DefaultCardControls';
import { Settings } from './containers/Settings';
import { ManageBalanceButton } from './containers/ManageBalanceButton';
import { ManageBalance } from './containers/ManageBalance';
import { getAvailableBalance } from './utils/getAvailableBalance';
import { allocationWithID } from './utils/allocationWithID';
import { getAllocationPermissions, canManageFunds, canManageCards, canManagePermissions } from './utils/permissions';
import { getAllocation, updateAllocation } from './services';

import css from './Allocations.css';

enum Tabs {
  cards = 'cards',
  transactions = 'transactions',
  controls = 'controls',
  settings = 'settings',
}

export default function Allocations() {
  const i18n = useI18n();
  const navigate = useNav();
  const messages = useMessages();
  const params = useParams<{ id?: string }>();
  const media = useMediaContext();

  const { allocations, currentUserRoles, reloadPermissions } = useBusiness();
  const [cardsCount, setCardsCount] = createSignal<number>();

  const [tab, setTab] = usePageTabs<Tabs>(Tabs.cards);
  const [manageId, setManageId] = createSignal<string>();

  const onAllocationChange = () => setTab(Tabs.cards, true);

  const sortedItems = createMemo(() => {
    const items = allocations();
    return [...items].sort((a, b) => byNameChain(a, b, items));
  });

  const current = createMemo(() => {
    return params.id ? sortedItems().find(allocationWithID(params.id)) : sortedItems()[0];
  });

  const [data, status, , setAllocationIdParam, reload, mutate] = useResource(getAllocation, undefined, false);
  const userPermissions = createMemo(() => getAllocationPermissions(currentUserRoles(), current()?.allocationId));

  createEffect(
    on(
      createMemo(() => current()?.allocationId),
      (id) => {
        if (id) {
          if (canManagePermissions(userPermissions())) {
            setAllocationIdParam(id);
          }
        }
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
    <>
      <Show when={current()}>
        <Page
          title={media.medium && formatCurrency(getAvailableBalance(current()!))}
          titleClass={css.title}
          breadcrumbs={media.medium && <Breadcrumbs current={current()!} items={allocations()} />}
          extra={
            <Show when={current()!.archived}>
              <Tag type="danger">
                <Text message="Archived" />
              </Tag>
            </Show>
          }
          actions={
            <Show when={!current()!.archived}>
              <div class={css.actions}>
                <ManageBalanceButton
                  allocationId={current()!.allocationId}
                  allocations={sortedItems()}
                  userPermissions={userPermissions()}
                  onClick={setManageId}
                />
                <Show when={canManageFunds(userPermissions())}>
                  <Button
                    size="lg"
                    icon="add"
                    onClick={() =>
                      navigate('/allocations/edit', { state: { parentAllocationId: current()!.allocationId } })
                    }
                    data-name="Create allocation"
                  >
                    <Text message="New Allocation" />
                  </Button>
                </Show>
                <Show when={canManageCards(userPermissions())}>
                  <Button
                    icon="add"
                    size="lg"
                    onClick={() => navigate('/cards/new', { state: { allocationId: current()!.allocationId } })}
                    data-name="Create card"
                  >
                    <Text message="New Card" />
                  </Button>
                </Show>
              </div>
            </Show>
          }
          side={
            <AllocationsSide
              currentID={current()!.allocationId}
              items={sortedItems()}
              onAllocationChange={onAllocationChange}
            />
          }
          contentClass={css.content}
        >
          <TabList value={tab()} onChange={setTab}>
            <Tab value={Tabs.cards}>
              <Text message="Cards" />
              <Show when={typeof cardsCount() !== 'undefined'}>
                <Tag class={css.tabTag} size="xs" label={`${cardsCount()}`} />
              </Show>
            </Tab>
            <Tab value={Tabs.transactions}>
              <Text message="Activity" />
            </Tab>
            <Show when={canManageFunds(userPermissions())}>
              <Tab value={Tabs.controls}>
                <Text message="Card Controls" />
              </Tab>
            </Show>
            <Show when={canManagePermissions(userPermissions()) || canManageFunds(userPermissions())}>
              <Tab value={Tabs.settings}>
                <Text message="Settings" />
              </Tab>
            </Show>
          </TabList>
          <Switch>
            <Match when={tab() === Tabs.cards}>
              <Cards current={current()!} allocations={allocations()} setCardsCount={setCardsCount} />
            </Match>
            <Match when={tab() === Tabs.transactions}>
              <Dynamic
                component={canManageFunds(userPermissions()) ? Ledger : Transactions}
                allocationId={current()!.allocationId}
              />
            </Match>
            <Match when={tab() === Tabs.controls}>
              <Data error={status().error} loading={status().loading} data={data()} onReload={reload}>
                <DefaultCardControls
                  allocationId={data()!.allocation.allocationId}
                  data={data()!}
                  onSave={onUpdateAllocation}
                  disabled={current()!.archived}
                />
              </Data>
            </Match>
            <Match when={tab() === Tabs.settings}>
              <Settings allocation={current()!} onReload={reloadPermissions} permissions={userPermissions()} />
            </Match>
          </Switch>
          <Drawer open={Boolean(manageId())} title={<Text message="Manage balance" />} onClose={() => setManageId()}>
            <ManageBalance
              allocationId={manageId()!}
              allocations={sortedItems()}
              onReload={reloadPermissions}
              onClose={() => setManageId()}
            />
          </Drawer>
        </Page>
      </Show>
    </>
  );
}
