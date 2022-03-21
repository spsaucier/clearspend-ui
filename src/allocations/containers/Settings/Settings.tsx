import { createSignal, createMemo, Show, For } from 'solid-js';
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
import type { Allocation, CreateUserRequest } from 'generated/capital';
import { Events, sendAnalyticsEvent } from 'app/utils/analytics';

import { AllocationRole } from '../../components/AllocationRole';
import {
  updateAllocation,
  getAllocationRoles,
  addAllocationRole,
  updateAllocationRole,
  removeAllocationRole,
} from '../../services';
import { getAllocationUserRole } from '../../utils/getAllocationUserRole';
import { type AllocationUserRole, AllocationRoles } from '../../types';
import { byUserLastName, byRoleLastName } from '../../components/AllocationSelect/utils';

import { getRolesList, getRolesUpdates } from './utils';

import css from './Settings.css';

interface FormValues {
  name: string;
}

interface SettingsProps {
  allocation: Readonly<Allocation>;
  onReload: () => Promise<unknown>;
}

export function Settings(props: Readonly<SettingsProps>) {
  const i18n = useI18n();
  const messages = useMessages();

  const [loading, addUser] = wrapAction(saveUser);
  const [showEmployeeDrawer, toggleEmployeeDrawer] = useBool();
  const users = useUsersList({ initValue: [] });

  const [currentRoles, , , , reloadCurrentRoles] = useResource(getAllocationRoles, props.allocation.allocationId);
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
    if (user) setUpdatedRoles((prev) => [...prev, { user, inherited: false, role: AllocationRoles.ViewOnly }]);
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

  const onRemoveRole = (userId: string) => {
    const roles = getRolesList(currentRoles() || [], updatedRoles());
    let role = roles.find((item) => item.user.userId === userId);
    if (!role) return;
    setRemovedRoles((prev) => ({ ...prev, [userId]: { inherited: role?.inherited, user: role?.user } }));
    setUpdatedRoles((prev) => prev.filter((item) => item.user.userId !== userId));
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

  const onReset = (updates?: Partial<FormValues>) => {
    reset(updates);
    setUpdatedRoles([]);
    setRemovedRoles({});
  };

  const onSubmit = async () => {
    if (loading() || hasErrors(trigger())) return;
    const { name } = values();

    try {
      const allocationId = props.allocation.allocationId;
      const roles = getRolesUpdates(currentRoles() || [], updatedRoles(), removedRoles());

      // NOTE: Temporary workaround until roles will be a part of saveAllocation() action.
      await Promise.all(roles.create.map((item) => addAllocationRole(allocationId, item.user.userId!, item.role)));
      await Promise.all(roles.update.map((item) => updateAllocationRole(allocationId, item.user.userId!, item.role)));
      await Promise.all(roles.remove.map((id) => removeAllocationRole(allocationId, id)));

      let postSaveAllocationName = props.allocation.name;

      if (props.allocation.name !== name) {
        const updated = await updateAllocation(props.allocation.allocationId, { name });

        postSaveAllocationName = updated.allocation.name;

        await props.onReload();
      }

      await reloadCurrentRoles();
      onReset({ name: postSaveAllocationName });

      messages.success({ title: i18n.t('The allocation has been successfully updated.') });
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
    return [...roles()].sort(byRoleLastName);
  });

  return (
    <Form>
      <Section title={<Text message="Allocation details" />}>
        <FormItem label={<Text message="Label" />} class={css.field} error={errors().name}>
          <Input
            name="allocation-label"
            value={values().name}
            error={Boolean(errors().name)}
            onChange={handlers.name}
          />
        </FormItem>
      </Section>
      <Section
        title={<Text message="Manager(s)" />}
        description={
          <>
            <Text message="Add employees who can view or manage this allocation." class={css.content!} />
            <h5 class={css.subheader}>
              <Text message="Manage" />
            </h5>
            <Text
              message={
                'Managers can deposit and withdraw funds, create additional allocations under this allocation, ' +
                'add employees, and issue cards.'
              }
              class={css.content!}
            />
            <h5 class={css.subheader}>
              <Text message="View only" />
            </h5>
            <Text
              message="Viewers can see balances, employees, cards, and transactions, but cannot make changes."
              class={css.content!}
            />
          </>
        }
      >
        <FormItem label={<Text message="Add manager or viewer" />} class={css.field}>
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
                  disabled={roles().some((role) => role.user.userId === item.userId) && !removedRoles()[item.userId!]}
                >
                  {formatName(item)}
                </Option>
              )}
            </For>
          </Select>
        </FormItem>
        <For each={sortedRoles()}>
          {(role) => (
            <Show when={!removedRoles()[role.user.userId!]}>
              <AllocationRole
                allocation={props.allocation}
                user={role.user}
                role={role.role}
                inherited={role.inherited}
                class={css.field}
                onChange={onChangeRole}
                onDelete={onRemoveRole}
              />
            </Show>
          )}
        </For>
      </Section>
      <Drawer open={showEmployeeDrawer()} title={<Text message="New Employee" />} onClose={toggleEmployeeDrawer}>
        <EditEmployeeFlatForm onSave={onAddEmployee} />
      </Drawer>
      <Show when={isDirty() || Boolean(updatedRoles().length) || Boolean(Object.keys(removedRoles()).length)}>
        <PageActions action={<Text message="Update Allocation" />} onCancel={onReset} onSave={onSubmit} />
      </Show>
    </Form>
  );
}
