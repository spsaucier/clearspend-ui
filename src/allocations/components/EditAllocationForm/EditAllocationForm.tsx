import { Accessor, createMemo, createSignal, For, Show } from 'solid-js';
import { Text, useI18n } from 'solid-i18n';

import { useBool } from '_common/utils/useBool';
import { createForm, Form, FormItem, hasErrors } from '_common/components/Form';
import { Input } from '_common/components/Input';
import { Option, Select } from '_common/components/Select';
import { Drawer } from '_common/components/Drawer';
import { Section } from 'app/components/Section';
import { useMessages } from 'app/containers/Messages/context';
import { PageActions } from 'app/components/Page';
import { EditEmployeeFlatForm } from 'employees/components/EditEmployeeFlatForm';
import { NewEmployeeButton } from 'employees/components/SelectEmployee';
import { formatName } from 'employees/utils/formatName';
import { InputCurrency } from '_common/components/InputCurrency';
import { wrapAction } from '_common/utils/wrapAction';
import type {
  Allocation,
  CreateAllocationRequest,
  CreateUserRequest,
  CreateUserResponse,
  UserData,
  UserRolesAndPermissionsRecord,
} from 'generated/capital';
import type { MccGroup } from 'transactions/types';
import { LimitsForm } from 'cards/components/LimitsForm/LimitsForm';

import { AllocationSelect } from '../AllocationSelect';
import { AllocationRole } from '../AllocationRole';
import { getAllocationUserRole } from '../../utils/getAllocationUserRole';
import { canManageCards } from '../../utils/permissions';
import { AllocationRoles, AllocationUserRole } from '../../types';
import { byUserLastName, byRoleLastName, hideEmployees } from '../AllocationSelect/utils';

import { convertFormData, getFormOptions } from './utils';
import type { FormValues } from './types';

import css from './EditAllocationForm.css';

interface EditAllocationFormProps {
  users: readonly Readonly<UserData>[];
  allocations: readonly Readonly<Allocation>[];
  parentRoles: readonly Readonly<UserRolesAndPermissionsRecord>[];
  mccCategories: readonly Readonly<MccGroup>[];
  onChangeParent: (allocationId?: string) => void;
  onAddEmployee: (userData: Readonly<CreateUserRequest>) => Promise<Readonly<CreateUserResponse>>;
  onSave: (data: Readonly<CreateAllocationRequest>, roles: AllocationUserRole[]) => Promise<unknown>;
  parentAllocationId?: Accessor<string>;
}

export function EditAllocationForm(props: Readonly<EditAllocationFormProps>) {
  const i18n = useI18n();
  const messages = useMessages();

  const [loading, save] = wrapAction(props.onSave);

  const [showEmployeeDrawer, toggleEmployeeDrawer] = useBool();
  const { values, errors, isDirty, handlers, trigger, reset } = createForm<FormValues>(
    getFormOptions(props.mccCategories, props.parentAllocationId?.()),
  );

  const [localUserRoles, setLocalUserRoles] = createSignal<AllocationUserRole[]>([]);
  const [parentChangedUserRoles, setParentChangedUserRoles] = createSignal<AllocationUserRole[]>([]);

  const onAddRole = (userId: string) => {
    const user = props.users.find((item) => item.userId === userId);
    if (user) setLocalUserRoles((prev) => [...prev, { user, inherited: false, role: AllocationRoles.Manager }]);
  };

  const onChangeUserRole = (userId: string, role: AllocationRoles) => {
    setLocalUserRoles((prev) =>
      prev.map((item) => ({ ...item, role: item.user.userId === userId ? role : item.role })),
    );
  };

  const onChangeParentUserRole = (userId: string, role: AllocationRoles) => {
    const user = props.users.find((item) => item.userId === userId);
    if (user) setParentChangedUserRoles((prev) => [...prev, { user, inherited: false, role }]);
  };

  const onRemoveRole = (userId: string) => {
    setLocalUserRoles((prev) => prev.filter((item) => item.user.userId !== userId));
  };

  const onParentChange = (id: string) => {
    handlers.parent(id);
    props.onChangeParent(id);
  };

  const onAddEmployee = async (data: Readonly<CreateUserRequest>) => {
    const resp = await props.onAddEmployee(data);
    onAddRole(resp.userId);
    toggleEmployeeDrawer();
  };

  const onReset = () => {
    reset();
    props.onChangeParent();
    setLocalUserRoles([]);
  };

  const onSubmit = async () => {
    if (loading() || hasErrors(trigger())) return;
    await save(convertFormData(values(), props.mccCategories), [
      ...localUserRoles(),
      ...parentChangedUserRoles(),
    ]).catch(() => {
      messages.error({ title: i18n.t('Something went wrong') });
    });
  };

  const userRoles = createMemo<AllocationUserRole[]>(() => {
    return [
      ...localUserRoles().sort(byRoleLastName),
      ...props.parentRoles
        .map((role) => getAllocationUserRole(role, true))
        .map((parentRole) => {
          const localParentUserRoleChanges = parentChangedUserRoles().find(
            (parentChangedUserRole) => parentChangedUserRole.user.userId === parentRole.user.userId,
          );
          if (localParentUserRoleChanges) {
            return {
              ...parentRole,
              role: localParentUserRoleChanges.role,
            };
          }
          return parentRole;
        })
        .filter(hideEmployees)
        .sort(byRoleLastName),
    ];
  });

  // TODO: Remove once we sort in BE: CAP-557
  const sortedUsers = createMemo(() => {
    return [...props.users].sort(byUserLastName);
  });

  return (
    <Form class={css.form}>
      <Section title={<Text message="Allocation details" />}>
        <FormItem
          label={<Text message="Parent allocation" />}
          extra={<Text message="Choose the allocation that will fund your new allocation." />}
          error={errors().parent}
          class={css.field}
        >
          <AllocationSelect
            items={props.allocations}
            value={values().parent}
            placeholder={String(i18n.t('Select allocation'))}
            permissionCheck={canManageCards}
            error={Boolean(errors().parent)}
            onChange={onParentChange}
          />
        </FormItem>
        <FormItem label={<Text message="Name" />} error={errors().name} class={css.field}>
          <Input
            name="allocation-label"
            value={values().name}
            placeholder={String(i18n.t('Enter allocation name (e.g. Marketing Team)'))}
            error={Boolean(errors().name)}
            onChange={handlers.name}
          />
        </FormItem>
      </Section>
      <Section
        title={<Text message="Balance" />}
        description={<Text message="Fund your allocation from the parent allocation." />}
      >
        <FormItem
          label={<Text message="Amount" />}
          extra={<Text message="The amount cannot exceed the balance of the parent allocation." />}
          error={errors().amount}
          class={css.field}
        >
          <InputCurrency
            name="amount"
            placeholder={String(i18n.t('Enter amount'))}
            value={values().amount}
            error={Boolean(errors().amount)}
            onChange={handlers.amount}
          />
        </FormItem>
      </Section>
      <Section
        title={<Text message="Access" />}
        description={
          <Text
            message={
              'Add users who can view or manage this allocation. Managers can deposit funds, add employees, and issue cards to this allocation.'
            }
          />
        }
      >
        <FormItem label={<Text message="Add manager or viewer" />} class={css.field}>
          <Select
            name="employee"
            placeholder={String(i18n.t('Search by employee name'))}
            disabled={!values().parent}
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
                <Option value={item.userId!} disabled={userRoles().some((role) => role.user.userId === item.userId)}>
                  {formatName(item)}
                </Option>
              )}
            </For>
          </Select>
        </FormItem>
        <For each={userRoles()}>
          {(userRole) => {
            const isLocalRole = localUserRoles()
              .map((localRole) => localRole.user.userId)
              .includes(userRole.user.userId);

            const isEmployeeRole = userRole.role === AllocationRoles.Employee;
            const parentChangedRole = parentChangedUserRoles().find((p) => p.user.userId === userRole.user.userId);
            const allowParentChangeRole = parentChangedRole || isEmployeeRole;

            return (
              <AllocationRole
                user={userRole.user}
                role={parentChangedRole?.role ?? userRole.role}
                inherited={userRole.inherited}
                class={css.field}
                onChange={isLocalRole ? onChangeUserRole : allowParentChangeRole ? onChangeParentUserRole : undefined}
                onDelete={onRemoveRole}
              />
            );
          }}
        </For>
      </Section>
      <Section
        title={<Text message="Default Card Controls" />}
        description={
          <Text
            message={
              'Set default limits for how much can be spent with cards in this allocation. ' +
              'These can be customized when issuing new cards.'
            }
          />
        }
      >
        <LimitsForm values={values()} handlers={handlers} mccCategories={props.mccCategories} />
      </Section>
      <Drawer open={showEmployeeDrawer()} title={<Text message="New Employee" />} onClose={toggleEmployeeDrawer}>
        <EditEmployeeFlatForm onSave={onAddEmployee} />
      </Drawer>
      <Show when={isDirty()}>
        <PageActions action={<Text message="Create Allocation" />} onCancel={onReset} onSave={onSubmit} />
      </Show>
    </Form>
  );
}
