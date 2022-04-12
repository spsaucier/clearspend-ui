import { createSignal, createMemo, Show, Switch, Match } from 'solid-js';
import { useSearchParams } from 'solid-app-router';
import { Text } from 'solid-i18n';

import { useNav } from '_common/api/router';
import { Button } from '_common/components/Button';
import { Dropdown, MenuItem } from '_common/components/Dropdown';
import { Drawer } from '_common/components/Drawer';
import { Loading } from 'app/components/Loading';
import { LoadingError } from 'app/components/LoadingError';
import { AllocationTag } from 'allocations/components/AllocationTag';
import { ALL_ALLOCATIONS, AllocationSelect } from 'allocations/components/AllocationSelect';
import { ManageBalance } from 'allocations/containers/ManageBalance';
import { useAllocations } from 'allocations/stores/allocations';
import { getRootAllocation } from 'allocations/utils/getRootAllocation';
import {
  getAllocationPermissions,
  canManageFunds,
  canManageUsers,
  canManageCards,
  canLinkBankAccounts,
} from 'allocations/utils/permissions';
import { useCards } from 'cards/stores/cards';
import { DEFAULT_CARD_PARAMS } from 'cards/constants';
import { getTotalAvailableBalance } from 'allocations/utils/getTotalAvailableBalance';
import { ALLOCATIONS_START_COUNT } from 'app/constants/common';

import { Page } from '../../components/Page';
import { Landing } from '../../containers/Landing';
import { Overview } from '../../containers/Overview';
import { useBusiness } from '../../containers/Main/context';

import css from './Dashboard.css';

export default function Dashboard() {
  const navigate = useNav();
  const [searchParams, setSearchParams] = useSearchParams<{ allocation?: string }>();
  const { currentUser, permissions, currentUserRoles } = useBusiness();

  const [allocation, setAllocation] = createSignal<string>(searchParams.allocation || ALL_ALLOCATIONS);

  const [manageId, setManageId] = createSignal<string>();

  const cardsStore = useCards({ params: DEFAULT_CARD_PARAMS });
  const allocations = useAllocations({ initValue: [] });

  const cardsCount = createMemo(() => cardsStore.data?.totalElements || 0);
  const allocationCount = createMemo(() => allocations.data?.length || 0);

  const currentAllocationId = createMemo(() => {
    // TODO: Check and update for single allocation manager view (when it's not the root allocation): CAP-410
    return allocation() === ALL_ALLOCATIONS ? getRootAllocation(allocations.data)?.allocationId : allocation();
  });

  const userPermissions = createMemo(() => getAllocationPermissions(currentUserRoles(), currentAllocationId()));

  const onAllocationChange = (id: string) => {
    setAllocation(id);
    setSearchParams({ allocation: id });
  };

  const totalAllocationBalance = createMemo(() => getTotalAvailableBalance(allocations.data || []));
  const showAddBalance = createMemo(() => canManageFunds(permissions()) && totalAllocationBalance() === 0);

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
          <Show
            when={
              currentAllocationId() === getRootAllocation(allocations.data)?.allocationId
                ? canLinkBankAccounts(userPermissions())
                : canManageFunds(userPermissions())
            }
          >
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
                    <MenuItem name="employee" onClick={() => navigate('/employees/add')}>
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
        <Match when={cardsStore.error}>
          <LoadingError onReload={cardsStore.reload} />
        </Match>
        <Match when={(allocations.loading && !allocations.data?.length) || (cardsStore.loading && !cardsStore.data)}>
          <Loading />
        </Match>
        <Match when={!cardsCount()}>
          <Landing
            cardsCount={cardsCount()}
            showAddBalance={showAddBalance()}
            showCreateAllocation={!showAddBalance() && allocationCount() === ALLOCATIONS_START_COUNT}
            showIssueCard={!cardsCount() && totalAllocationBalance() > 0}
          />
        </Match>
        <Match when={allocations.data}>
          <Overview
            allocationId={allocation()}
            allocations={allocations.data}
            userPermissions={userPermissions()}
            onAllocationChange={onAllocationChange}
          />
        </Match>
      </Switch>
      <Show when={canManageFunds(userPermissions())}>
        <Drawer open={Boolean(manageId())} title={<Text message="Manage balance" />} onClose={() => setManageId()}>
          <ManageBalance
            allocationId={manageId()!}
            allocations={allocations.data!}
            onReload={allocations.reload}
            onClose={() => setManageId()}
          />
        </Drawer>
      </Show>
    </Page>
  );
}
