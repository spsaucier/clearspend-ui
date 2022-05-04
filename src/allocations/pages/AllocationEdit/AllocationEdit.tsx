import { Switch, Match, createEffect, createMemo } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { useNav, useLoc } from '_common/api/router';
import { useResource } from '_common/utils/useResource';
import { getNoop } from '_common/utils/getNoop';
import { Page } from 'app/components/Page';
import { LoadingError } from 'app/components/LoadingError';
import { Loading } from 'app/components/Loading';
import { useMessages } from 'app/containers/Messages/context';
import { useMCC } from 'app/stores/mcc';
import { saveUser } from 'employees/services';
import { useUsersList } from 'employees/stores/usersList';
import type { CreateAllocationRequest, CreateUserRequest } from 'generated/capital';
import { useBusiness } from 'app/containers/Main/context';
import { Events, sendAnalyticsEvent } from 'app/utils/analytics';
import { byNameChain } from 'allocations/components/AllocationSelect/utils';

import { EditAllocationForm } from '../../components/EditAllocationForm';
import { saveAllocation, getAllocationRoles, createOrUpdateAllocationRole } from '../../services';
import type { AllocationUserRole } from '../../types';

export default function AllocationEdit() {
  const i18n = useI18n();
  const messages = useMessages();
  const navigate = useNav();
  const location = useLoc<{ parentAllocationId: string }>();

  const { allocations, reloadPermissions } = useBusiness();
  const mcc = useMCC({ initValue: [] });
  const users = useUsersList({ initValue: [] });

  const sortedItems = createMemo(() => {
    const items = allocations();
    return [...items].sort((a, b) => byNameChain(a, b, items));
  });

  const [parentRoles, rolesStatus, params, setRolesId, reloadRoles, mutateRoles] = useResource(
    getAllocationRoles,
    undefined,
    false,
  );

  createEffect(() => {
    if (allocations()[0]) {
      setRolesId(location.state?.parentAllocationId || allocations()[0]!.allocationId);
    }
  });

  const onChangeParent = (allocationId?: string) => {
    allocationId && allocationId !== params() ? setRolesId(allocationId) : mutateRoles([], true);
  };

  const onAddEmployee = async (userData: Readonly<CreateUserRequest>) => {
    const resp = await saveUser(userData);
    await users.reload();
    sendAnalyticsEvent({ name: Events.CREATE_EMPLOYEE });
    messages.success({
      title: i18n.t('Success'),
      message: i18n.t('The new employee has been successfully added to your organization.'),
    });
    return resp;
  };

  const onSave = async (allocation: CreateAllocationRequest, userRoles: AllocationUserRole[]) => {
    try {
      const allocationId = await saveAllocation(allocation).catch((e: { data: { message: string } }) => {
        if (e.data.message.indexOf('does not have sufficient funds') > -1) {
          const parentAllocation = allocations().find((a) => a.allocationId === allocation.parentAllocationId);
          messages.error({
            title: i18n.t('{parent} has insufficient funds', {
              parent: parentAllocation?.name ? `"${parentAllocation.name}"` : 'Parent allocation',
            }),
            message: i18n.t(
              'To proceed, either decrease the amount in this new allocation or add funds to the {parent} allocation.',
              { parent: parentAllocation?.name ? `"${parentAllocation.name}"` : 'parent' },
            ),
          });
        } else {
          messages.error({ title: e.data.message });
        }
        throw e;
      });
      sendAnalyticsEvent({ name: Events.CREATE_ALLOCATION });
      messages.success({ title: i18n.t('The new allocation has been successfully added.') });

      await reloadPermissions().catch(getNoop());

      try {
        // NOTE: Temporary workaround until roles will be a part of saveAllocation() action.
        await Promise.all(
          userRoles.map((item) => createOrUpdateAllocationRole(allocationId, item.user.userId!, item.role)),
        );
      } catch (error: unknown) {
        messages.error({ title: i18n.t('Updating users permissions failed.') });
      }

      const prevRoute = location.state?.prev;
      navigate(prevRoute && !prevRoute.match(/^\/allocations/) ? prevRoute : `/allocations/${allocationId}`);
    } catch {
      // do nothing
    }
  };

  return (
    <Page title={<Text message="New Allocation" />}>
      <Switch>
        <Match when={mcc.error}>
          <LoadingError onReload={mcc.reload} />
        </Match>
        <Match when={users.error}>
          <LoadingError onReload={users.reload} />
        </Match>
        <Match when={rolesStatus().error}>
          <LoadingError onReload={reloadRoles} />
        </Match>
        <Match when={mcc.loading || (users.loading && !users.data?.length)}>
          <Loading />
        </Match>
        <Match when={mcc.data?.length}>
          <EditAllocationForm
            users={users.data!}
            mccCategories={mcc.data!}
            allocations={sortedItems()}
            parentRoles={parentRoles() ?? []}
            onChangeParent={onChangeParent}
            onAddEmployee={onAddEmployee}
            onSave={onSave}
            parentAllocationId={params}
          />
        </Match>
      </Switch>
    </Page>
  );
}
