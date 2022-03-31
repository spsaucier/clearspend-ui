import { Switch, Match, createEffect } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { useNav, useLoc } from '_common/api/router';
import { useResource } from '_common/utils/useResource';
import { Page } from 'app/components/Page';
import { LoadingError } from 'app/components/LoadingError';
import { Loading } from 'app/components/Loading';
import { useMessages } from 'app/containers/Messages/context';
import { useMCC } from 'app/stores/mcc';
import { saveUser } from 'employees/services';
import { useUsersList } from 'employees/stores/usersList';
import type { CreateAllocationRequest, CreateUserRequest } from 'generated/capital';
import { Events, sendAnalyticsEvent } from 'app/utils/analytics';

import { EditAllocationForm } from '../../components/EditAllocationForm';
import { saveAllocation, getAllocationRoles, addAllocationRole } from '../../services';
import { useAllocations } from '../../stores/allocations';
import type { AllocationUserRole } from '../../types';

export default function AllocationEdit() {
  const i18n = useI18n();
  const messages = useMessages();
  const navigate = useNav();
  const location = useLoc<{ parentAllocationId: string }>();

  const mcc = useMCC({ initValue: [] });
  const users = useUsersList({ initValue: [] });
  const allocations = useAllocations({ initValue: [] });

  const [parentRoles, rolesStatus, , setRolesId, reloadRoles, mutateRoles] = useResource(
    getAllocationRoles,
    undefined,
    false,
  );

  createEffect(() => {
    if (allocations.data?.[0]) {
      setRolesId(allocations.data[0].allocationId);
    }
  });

  const onChangeParent = (allocationId?: string) => {
    allocationId ? setRolesId(allocationId) : mutateRoles([], true);
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
    const allocationId = await saveAllocation(allocation);
    sendAnalyticsEvent({ name: Events.CREATE_ALLOCATION });
    messages.success({ title: i18n.t('The new allocation has been successfully added.') });

    try {
      // NOTE: Temporary workaround until roles will be a part of saveAllocation() action.
      await Promise.all(userRoles.map((item) => addAllocationRole(allocationId, item.user.userId!, item.role)));
    } catch (error: unknown) {
      messages.error({ title: i18n.t('Updating users permissions failed.') });
    }

    const prevRoute = location.state?.prev;
    navigate(prevRoute && !prevRoute.match(/^\/allocations/) ? prevRoute : `/allocations/${allocationId}`);
  };

  return (
    <Page title={<Text message="New Allocation" />}>
      <Switch>
        <Match when={allocations.error}>
          <LoadingError onReload={allocations.reload} />
        </Match>
        <Match when={mcc.error}>
          <LoadingError onReload={mcc.reload} />
        </Match>
        <Match when={users.error}>
          <LoadingError onReload={users.reload} />
        </Match>
        <Match when={rolesStatus().error}>
          <LoadingError onReload={reloadRoles} />
        </Match>
        <Match when={allocations.loading || mcc.loading || (users.loading && !users.data?.length)}>
          <Loading />
        </Match>
        <Match when={allocations.data?.length && mcc.data?.length && !rolesStatus().loading}>
          <EditAllocationForm
            users={users.data!}
            mccCategories={mcc.data!}
            allocations={allocations.data!}
            parentRoles={parentRoles() ?? []}
            onChangeParent={onChangeParent}
            onAddEmployee={onAddEmployee}
            onSave={onSave}
            parentAllocationId={location.state?.parentAllocationId}
          />
        </Match>
      </Switch>
    </Page>
  );
}
