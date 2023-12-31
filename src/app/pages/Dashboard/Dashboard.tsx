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
import { ManageBalanceButton } from 'allocations/containers/ManageBalanceButton';
import { ManageBalance } from 'allocations/containers/ManageBalance';
import { getRootAllocation } from 'allocations/utils/getRootAllocation';
import {
  getAllocationPermissions,
  canManageFunds,
  canManageUsers,
  canManageCards,
  hasSomeManagerRole,
} from 'allocations/utils/permissions';
import { useCards } from 'cards/stores/cards';
import { DEFAULT_CARD_PARAMS } from 'cards/constants';
import { getTotalAvailableBalance } from 'allocations/utils/getTotalAvailableBalance';
import { ALLOCATIONS_START_COUNT } from 'app/constants/common';
import { byNameChain } from 'allocations/components/AllocationSelect/utils';

import { Page } from '../../components/Page';
import { Landing } from '../../containers/Landing';
import { Overview } from '../../containers/Overview';
import { useBusiness } from '../../containers/Main/context';

import css from './Dashboard.css';

export default function Dashboard() {
  const navigate = useNav();
  const [searchParams, setSearchParams] = useSearchParams<{ allocation?: string }>();
  const { currentUser, permissions, allocations, currentUserRoles, reloadPermissions } = useBusiness();

  const [allocation, setAllocation] = createSignal<string>(searchParams.allocation || ALL_ALLOCATIONS);

  const [manageId, setManageId] = createSignal<string>();

  const cardsStore = useCards({ params: DEFAULT_CARD_PARAMS });

  const cardsCount = createMemo(() => cardsStore.data?.totalElements || 0);

  const sortedItems = createMemo(() => {
    const items = allocations();
    return [...items].sort((a, b) => byNameChain(a, b, items));
  });

  const currentAllocationId = createMemo(() => {
    if (allocation() === ALL_ALLOCATIONS) {
      return sortedItems().length === 1
        ? sortedItems()[0]!.allocationId
        : getRootAllocation(sortedItems())?.allocationId;
    }
    return allocation();
  });

  const allocationCount = createMemo(() => sortedItems().length);
  const userPermissions = createMemo(() => getAllocationPermissions(currentUserRoles(), currentAllocationId()));

  const onAllocationChange = (id: string) => {
    setAllocation(id);
    setSearchParams({ allocation: id });
  };

  const totalAllocationBalance = createMemo(() => getTotalAvailableBalance(sortedItems()));
  const showAddBalance = createMemo(() => canManageFunds(permissions()) && totalAllocationBalance() === 0);

  return (
    <Page
      title={<Text message="Welcome, {name}" name={currentUser().firstName || ''} />}
      contentClass={css.content}
      extra={
        <Switch>
          <Match when={sortedItems().length === 1}>
            <AllocationTag data={sortedItems()[0]!} />
          </Match>
          <Match when={sortedItems().length}>
            <AllocationSelect
              items={sortedItems()}
              value={allocation()}
              class={css.allocations}
              onChange={onAllocationChange}
              showAllAsOption
              permissionCheck={canManageCards} // TODO: change to Card Spend access: CAP-989
            />
          </Match>
        </Switch>
      }
      actions={
        <div class={css.actions}>
          <ManageBalanceButton
            allocationId={currentAllocationId()!}
            allocations={sortedItems()}
            userPermissions={userPermissions()}
            onClick={setManageId}
          />
          <Show when={canManageUsers(userPermissions()) || hasSomeManagerRole(currentUserRoles())}>
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
                  {hasSomeManagerRole(currentUserRoles()) ? (
                    <>
                      <MenuItem
                        name="allocation"
                        onClick={() =>
                          navigate(
                            '/allocations/edit',
                            canManageFunds(userPermissions())
                              ? { state: { parentAllocationId: currentAllocationId() } }
                              : undefined,
                          )
                        }
                      >
                        <Text message="Allocation" />
                      </MenuItem>
                      <MenuItem
                        name="card"
                        onClick={() =>
                          navigate(
                            '/cards/new',
                            canManageCards(userPermissions())
                              ? { state: { allocationId: currentAllocationId() } }
                              : undefined,
                          )
                        }
                      >
                        <Text message="Card" />
                      </MenuItem>
                    </>
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
      <Switch
        fallback={
          <Overview
            allocationId={allocation()}
            allocations={sortedItems()}
            userPermissions={userPermissions()}
            onAllocationChange={onAllocationChange}
          />
        }
      >
        <Match when={cardsStore.error}>
          <LoadingError onReload={cardsStore.reload} />
        </Match>
        <Match when={cardsStore.loading && !cardsStore.data}>
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
      </Switch>
      <Show when={canManageFunds(userPermissions())}>
        <Drawer open={Boolean(manageId())} title={<Text message="Manage balance" />} onClose={() => setManageId()}>
          <ManageBalance
            allocationId={manageId()!}
            allocations={sortedItems()}
            onReload={reloadPermissions}
            onClose={() => setManageId()}
          />
        </Drawer>
      </Show>
    </Page>
  );
}
