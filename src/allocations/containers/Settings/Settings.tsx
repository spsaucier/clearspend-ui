import { createSignal, createMemo, Show, For, Accessor } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { useBool } from '_common/utils/useBool';
import { useResource } from '_common/utils/useResource';
import { Select, Option } from '_common/components/Select';
import { Drawer } from '_common/components/Drawer';
import { wrapAction } from '_common/utils/wrapAction';
import { PageActions } from 'app/components/Page';
import { Section } from 'app/components/Section';
import { useMessages } from 'app/containers/Messages/context';
import { Form, FormItem, createForm, hasErrors } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Input } from '_common/components/Input';
import { EditEmployeeFlatForm } from 'employees/components/EditEmployeeFlatForm';
import { NewEmployeeButton } from 'employees/components/SelectEmployee';
import { useUsersList } from 'employees/stores/usersList';
import { saveUser } from 'employees/services';
import { formatName } from 'employees/utils/formatName';
import type { Allocation, CreateUserRequest, UserRolesAndPermissionsRecord } from 'generated/capital';
import { Events, sendAnalyticsEvent } from 'app/utils/analytics';
import { Loading } from 'app/components/Loading';

import { AllocationRole } from '../../components/AllocationRole';
import { updateAllocation, getAllocationRoles, createOrUpdateAllocationRole } from '../../services';
import { getAllocationUserRole } from '../../utils/getAllocationUserRole';
import { type AllocationUserRole, AllocationRoles } from '../../types';
import { byUserLastName, byRoleLastName, hideEmployees } from '../../components/AllocationSelect/utils';
import { canManageUsers } from '../../utils/permissions';

import { getRolesList, getRolesUpdates } from './utils';

import css from './Settings.css';

interface FormValues {
  name: string;
}

interface SettingsProps {
  allocation: Readonly<Allocation>;
  onReload: () => Promise<unknown>;
  permissions: Accessor<Readonly<UserRolesAndPermissionsRecord> | null>;
}

const IDLE_MS = 100;

export function Settings(props: Readonly<SettingsProps>) {
  const i18n = useI18n();
  const messages = useMessages();

  const [loading, addUser] = wrapAction(saveUser);
  const [showEmployeeDrawer, toggleEmployeeDrawer] = useBool();
  const users = useUsersList({ initValue: [] });

  const [currentRoles, status, , , reloadCurrentRoles] = useResource(getAllocationRoles, props.allocation.allocationId);
  const [updatedRoles, setUpdatedRoles] = createSignal<AllocationUserRole[]>([]);
  const [removedRoles, setRemovedRoles] = createSignal<Record<string, Partial<AllocationUserRole>>>({});

  const { values, errors, isDirty, handlers, trigger, reset } = createForm<FormValues>({
    defaultValues: { name: props.allocation.name },
    rules: { name: [required] },
  });

  const onAddRole = (userId: string) => {
    if (removedRoles()[userId]) {
      const newRemovedRoles = { ...removedRoles() };
      delete newRemovedRoles[userId];
      setRemovedRoles(newRemovedRoles);
    }
    const user = users.data!.find((item) => item.userId === userId);
    if (user) setUpdatedRoles((prev) => [...prev, { user, inherited: false, role: AllocationRoles.Manager }]);
  };

  const onChangeRole = (userId: string, role: AllocationRoles) => {
    setUpdatedRoles((prev) => {
      if (prev.some((item) => item.user.userId === userId)) {
        return prev.map((item) => ({ ...item, role: item.user.userId === userId ? role : item.role }));
      }
      const roleToUpdate = { ...getAllocationUserRole(currentRoles()!.find((item) => item.user?.userId === userId)!) };
      roleToUpdate.role = role;
      return [roleToUpdate, ...prev];
    });
  };

  const onAddEmployee = async (data: Readonly<CreateUserRequest>) => {
    const resp = await addUser(data);
    await users.reload();
    onAddRole(resp.userId);
    sendAnalyticsEvent({ name: Events.CREATE_EMPLOYEE });
    messages.success({
      title: i18n.t('Success'),
      message: i18n.t('The new employee has been successfully added to your organization.'),
    });
    toggleEmployeeDrawer();
  };

  const onRemoveRole = (userId: string) => {
    const roles = getRolesList(currentRoles() || [], updatedRoles());
    let role = roles.find((item) => item.user.userId === userId);
    if (role?.user.type === 'BUSINESS_OWNER') return;
    if (!role) return;
    setRemovedRoles((prev) => ({ ...prev, [userId]: { inherited: role?.inherited, user: role?.user } }));
    setUpdatedRoles((prev) => prev.filter((item) => item.user.userId !== userId));
  };

  const onReset = (updates?: Partial<FormValues>) => {
    reset(updates);
    setUpdatedRoles([]);
    setRemovedRoles({});
  };

  const onSubmit = async () => {
    if (loading() || hasErrors(trigger())) return;
    const { name } = values();
    const [hideSuccess, setHideSuccess] = createSignal(false);

    try {
      const allocationId = props.allocation.allocationId;
      const roles = getRolesUpdates(currentRoles() || [], updatedRoles(), removedRoles());

      // NOTE: Temporary workaround until roles will be a part of saveAllocation() action.
      const createPromises = roles.create.map((item) => {
        return createOrUpdateAllocationRole(allocationId, item.user.userId!, item.role).catch(
          (e: { data: { message: string } }) => {
            messages.error({
              title: i18n.t('Unable to add {user}', { user: formatName(item.user) }),
              message: e.data.message,
            });
            setHideSuccess(true);
          },
        );
      });
      const updatePromises = roles.update.map((item) => {
        return createOrUpdateAllocationRole(allocationId, item.user.userId!, item.role).catch(
          (e: { data: { message: string } }) => {
            messages.error({
              title: i18n.t('Unable to update {user}', { user: formatName(item.user) }),
              message: e.data.message,
            });
            setHideSuccess(true);
          },
        );
      });
      // We don't delete roles; we demote them back to Employee (the base company user)
      const removePromises = roles.remove.map((id) => {
        return createOrUpdateAllocationRole(allocationId, id, AllocationRoles.Employee).catch(
          (e: { data: { message: string } }) => {
            messages.error({
              title: i18n.t('Unable to demote {user}', { user: formatName(users.data?.find((u) => u.userId === id)) }),
              message: e.data.message,
            });
            setHideSuccess(true);
          },
        );
      });
      await Promise.all([...createPromises, ...updatePromises, ...removePromises]);

      let postSaveAllocationName = props.allocation.name;
      if (props.allocation.name !== name) {
        const updated = await updateAllocation(props.allocation.allocationId, { name });
        postSaveAllocationName = updated.allocation.name;
        await props.onReload();
      }

      await new Promise<void>((resolve) => {
        setTimeout(async () => {
          await reloadCurrentRoles();
          return resolve();
        }, IDLE_MS); // There's a race condition on the backend, so we wait to reload
      });
      onReset({ name: postSaveAllocationName });

      if (!hideSuccess()) {
        messages.success({ title: i18n.t('The allocation has been successfully updated.') });
      }
    } catch (error: unknown) {
      messages.error({ title: i18n.t('Something went wrong') });
    }
  };

  const roles = createMemo(() => getRolesList(currentRoles() || [], updatedRoles()));

  // TODO: Remove once we sort in BE: CAP-557
  const sortedUsers = createMemo(() => {
    return [...users.data!].sort(byUserLastName);
  });

  const sortedRoles = createMemo(() => {
    return [...roles()].sort(byRoleLastName).filter(hideEmployees);
  });

  const allocationHasParent = Boolean(props.allocation.parentAllocationId);

  return (
    <Form>
      <Section title={<Text message="Allocation details" />}>
        <FormItem label={<Text message="Name" />} class={css.field} error={errors().name}>
          <Input
            name="allocation-label"
            value={values().name}
            error={Boolean(errors().name)}
            onChange={handlers.name}
          />
        </FormItem>
      </Section>
      <Show when={canManageUsers(props.permissions())}>
        <Section
          title={<Text message="Access" />}
          description={
            <>
              <Text message="Add users who can view or manage this allocation." class={css.content!} />
              <Show when={!allocationHasParent}>
                <div class={css.roleDescription}>
                  <h5 class={css.subheader}>
                    <Text message="Admin" />
                  </h5>
                  <Text
                    message={
                      'Admins can deposit, withdraw, and reallocate funds, view and manage all allocations, company settings, and ' +
                      'accounting details, create additional allocations, add employees, and issue cards.'
                    }
                    class={css.content!}
                  />
                </div>
              </Show>
              <div class={css.roleDescription}>
                <h5 class={css.subheader}>
                  <Text message="Manage" />
                </h5>
                <Text
                  message={
                    'Managers can reallocate funds between allocations that they manage, create additional sub-allocations, ' +
                    'and issue cards.'
                  }
                  class={css.content!}
                />
              </div>
              <div class={css.roleDescription}>
                <h5 class={css.subheader}>
                  <Text message="View only" />
                </h5>
                <Text message="Viewers can see balances, employees, cards, and transactions." class={css.content!} />
              </div>
            </>
          }
        >
          <FormItem label={<Text message="Add a user role" />} class={css.field}>
            <Select
              name="employee"
              placeholder={String(i18n.t('Search by employee name'))}
              popupRender={(list) => (
                <>
                  {list}
                  <NewEmployeeButton onClick={toggleEmployeeDrawer} />
                </>
              )}
              onChange={onAddRole}
            >
              <For each={sortedUsers()}>
                {(item) => (
                  <Option
                    value={item.userId!}
                    disabled={
                      sortedRoles().some((role) => role.user.userId === item.userId) && !removedRoles()[item.userId!]
                    }
                  >
                    {formatName(item)}
                  </Option>
                )}
              </For>
            </Select>
          </FormItem>
          <Show
            when={!status().loading}
            fallback={
              <div class={css.field}>
                <Loading />
              </div>
            }
          >
            <For each={sortedRoles()}>
              {(role) => {
                const cannotBePromoted =
                  role.inherited &&
                  [AllocationRoles.Admin, allocationHasParent ? AllocationRoles.Manager : undefined].includes(
                    role.role,
                  );
                return (
                  <Show when={!removedRoles()[role.user.userId!]}>
                    <AllocationRole
                      allocation={props.allocation}
                      user={role.user}
                      role={role.role}
                      inherited={role.inherited}
                      class={css.field}
                      onChange={cannotBePromoted ? undefined : onChangeRole}
                      onDelete={onRemoveRole}
                    />
                  </Show>
                );
              }}
            </For>
          </Show>
        </Section>
      </Show>
      <Drawer open={showEmployeeDrawer()} title={<Text message="New Employee" />} onClose={toggleEmployeeDrawer}>
        <EditEmployeeFlatForm onSave={onAddEmployee} />
      </Drawer>
      <Show when={isDirty() || Boolean(updatedRoles().length) || Boolean(Object.keys(removedRoles()).length)}>
        <PageActions action={<Text message="Update Allocation" />} onCancel={onReset} onSave={onSubmit} />
      </Show>
    </Form>
  );
}
