import { createSignal, createMemo, createEffect, Show, Switch, Match } from 'solid-js';
import { useSearchParams } from 'solid-app-router';
import { Text } from 'solid-i18n';

import { useNav } from '_common/api/router';
import { useResource } from '_common/utils/useResource';
import { Button } from '_common/components/Button';
import { Dropdown, MenuItem } from '_common/components/Dropdown';
import { Drawer } from '_common/components/Drawer';
import { Loading } from 'app/components/Loading';
import { LoadingError } from 'app/components/LoadingError';
import { getAllocationPermissions } from 'app/services/permissions';
import { AllocationTag } from 'allocations/components/AllocationTag';
import { AllocationSelect } from 'allocations/components/AllocationSelect';
import { ManageBalance } from 'allocations/containers/ManageBalance';
import { useAllocations } from 'allocations/stores/allocations';
import { ALL_ALLOCATIONS } from 'allocations/components/AllocationSelect/AllocationSelect';
import { getRootAllocation } from 'allocations/utils/getRootAllocation';
import { canManageFunds, canManageUsers, canManageCards } from 'allocations/utils/permissions';
import { useUserCards } from 'employees/stores/userCards';

import { Page } from '../../components/Page';
import { Landing } from '../../containers/Landing';
import { Overview } from '../../containers/Overview';
import { useBusiness } from '../../containers/Main/context';
import { ALLOCATIONS_START_COUNT } from '../../constants/common';

import css from './Dashboard.css';

export default function Dashboard() {
  const navigate = useNav();
  const [searchParams, setSearchParams] = useSearchParams<{ allocation?: string }>();
  const { currentUser } = useBusiness();

  const [allocation, setAllocation] = createSignal<string>(searchParams.allocation || ALL_ALLOCATIONS);

  const [manageId, setManageId] = createSignal<string>();

  const userCards = useUserCards();
  const allocations = useAllocations({ initValue: [] });

  const cardsCount = createMemo(() => userCards.data?.length || 0);
  const allocationCount = createMemo(() => allocations.data?.length || 0);

  const canAddBalance = createMemo(() => {
    const root = getRootAllocation(allocations.data);
    return currentUser().type === 'BUSINESS_OWNER' && root?.account.availableBalance?.amount === 0;
  });

  const [userPermissions, , , setAllocationIdForPermissions] = useResource(getAllocationPermissions, undefined, false);

  const currentAllocationId = createMemo(() => {
    // TODO: Check and update for single allocation manager view (when it's not the root allocation): CAP-410
    return allocation() === ALL_ALLOCATIONS ? getRootAllocation(allocations.data)?.allocationId : allocation();
  });

  createEffect(() => {
    const allocationId = currentAllocationId();
    if (allocationId) setAllocationIdForPermissions(allocationId);
  });

  const onAllocationChange = (id: string) => {
    setAllocation(id);
    setSearchParams({ allocation: id });
  };

  return (
    <Page
      title={<Text message="Welcome, {name}" name={currentUser().firstName || ''} />}
      contentClass={css.content}
      extra={
        <Switch>
          <Match when={allocations.data?.length === 1}>
            <AllocationTag data={allocations.data![0]!} />
          </Match>
          <Match when={allocations.data?.length}>
            <AllocationSelect
              items={allocations.data!}
              value={allocation()}
              class={css.allocations}
              onChange={onAllocationChange}
              showAllAsOption
            />
          </Match>
        </Switch>
      }
      actions={
        <div class={css.actions}>
          <Show when={canManageFunds(userPermissions())}>
            <Button
              id="add-balance-button"
              type="primary"
              size="lg"
              icon="dollars"
              onClick={() => setManageId(currentAllocationId())}
            >
              <Text message="Manage Balance" />
            </Button>
          </Show>
          <Show
            when={
              canManageUsers(userPermissions()) ||
              canManageFunds(userPermissions()) ||
              canManageCards(userPermissions())
            }
          >
            <Dropdown
              id="add-new-dropdown"
              position="bottom-right"
              menu={
                <>
                  {canManageUsers(userPermissions()) ? (
                    <MenuItem name="employee" onClick={() => navigate('/employees/edit')}>
                      <Text message="Employee" />
                    </MenuItem>
                  ) : null}
                  {canManageFunds(userPermissions()) ? (
                    <MenuItem
                      name="allocation"
                      onClick={() =>
                        navigate('/allocations/edit', { state: { parentAllocationId: currentAllocationId() } })
                      }
                    >
                      <Text message="Allocation" />
                    </MenuItem>
                  ) : null}
                  {canManageCards(userPermissions()) ? (
                    <MenuItem
                      name="card"
                      onClick={() => navigate('/cards/edit', { state: { allocationId: currentAllocationId() } })}
                    >
                      <Text message="Card" />
                    </MenuItem>
                  ) : null}
                </>
              }
            >
              <Button id="add-new-button" size="lg" icon={{ name: 'chevron-down', pos: 'right' }}>
                <Text message="Add new" />
              </Button>
            </Dropdown>
          </Show>
        </div>
      }
    >
      <Switch>
        <Match when={allocations.error}>
          <LoadingError onReload={allocations.reload} />
        </Match>
        <Match when={userCards.error}>
          <LoadingError onReload={userCards.reload} />
        </Match>
        <Match when={(allocations.loading && !allocations.data?.length) || (userCards.loading && !userCards.data)}>
          <Loading />
        </Match>
        <Match when={allocationCount() === ALLOCATIONS_START_COUNT && !cardsCount()}>
          <Landing allocationsCount={allocationCount()} cardsCount={cardsCount()} showAddBalance={canAddBalance()} />
        </Match>
        <Match when={allocations.data}>
          <Overview allocationId={allocation()} />
        </Match>
      </Switch>
      <Show when={canManageFunds(userPermissions())}>
        <Drawer open={Boolean(manageId())} title={<Text message="Manage balance" />} onClose={() => setManageId()}>
          <ManageBalance allocationId={manageId()!} onReload={allocations.reload} onClose={() => setManageId()} />
        </Drawer>
      </Show>
    </Page>
  );
}
