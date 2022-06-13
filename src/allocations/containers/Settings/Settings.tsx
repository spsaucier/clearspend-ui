import { createSignal, createMemo, Show, For, onMount } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { isFetchError } from '_common/api/fetch/isFetchError';
import { useBool } from '_common/utils/useBool';
import { useResource } from '_common/utils/useResource';
import { Button } from '_common/components/Button';
import { Confirm } from '_common/components/Confirm';
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
import { formatName, formatNameString } from 'employees/utils/formatName';
import type {
  Allocation,
  CreateUserRequest,
  UserRolesAndPermissionsRecord,
  ControllerError,
  AllocationAutoTopUpConfigCreateRequest,
} from 'generated/capital';
import { Events, sendAnalyticsEvent } from 'app/utils/analytics';
import { Loading } from 'app/components/Loading';
import { Switch } from '_common/components/Switch';
import { InputCurrency } from '_common/components/InputCurrency';
import { join } from '_common/utils/join';
import { InputDate } from '_common/components/InputDate';

import { AllocationRole } from '../../components/AllocationRole';
import {
  updateAllocation,
  archiveAllocation,
  getAllocationRoles,
  createOrUpdateAllocationRole,
  getAllocationAutoTopUpConfig,
  createAllocationAutoTopUpConfig,
  removeAllocationAutoTopUpConfig,
  updateAllocationAutoTopUpConfig,
} from '../../services';
import { getAllocationUserRole } from '../../utils/getAllocationUserRole';
import { type AllocationUserRole, AllocationRoles } from '../../types';
import { byUserLastName, byRoleLastName, hideEmployees } from '../../components/AllocationSelect/utils';
import { getAvailableBalance } from '../../utils/getAvailableBalance';
import { canManagePermissions, canLinkBankAccounts, canManageFunds, isCustomerService } from '../../utils/permissions';

import { getRolesList, getRolesUpdates } from './utils';

import css from './Settings.css';

interface FormValues {
  name: string;
}

interface SettingsProps {
  allocation: Readonly<Allocation>;
  permissions: Readonly<UserRolesAndPermissionsRecord> | null;
  onReload: () => Promise<unknown>;
}

const IDLE_MS = 100;
const MAX_RECURRING_DEPOSIT_MONTH_DAY = 25;

export function Settings(props: Readonly<SettingsProps>) {
  const i18n = useI18n();
  const messages = useMessages();

  const [loading, addUser] = wrapAction(saveUser);
  const [showEmployeeDrawer, toggleEmployeeDrawer] = useBool();
  const users = useUsersList({ initValue: [] });

  const [currentRoles, status, , , reloadCurrentRoles] = useResource(getAllocationRoles, props.allocation.allocationId);

  const [updatedRoles, setUpdatedRoles] = createSignal<AllocationUserRole[]>([]);
  const [removedRoles, setRemovedRoles] = createSignal<Record<string, Partial<AllocationUserRole>>>({});

  const [autoTopUpMonthlyDate, setAutoTopUpMonthlyDate] = createSignal<number | undefined>();
  const [autoTopUpAmount, setAutoTopUpAmount] = createSignal<number | undefined>();
  const [autoTopUpConfigEnabled, setAutoTopUpConfigEnabled] = createSignal<boolean>(false);
  const [currentConfigId, setCurrentConfigId] = createSignal<string | undefined>();
  const [isDirtyConfig, setIsDirtyConfig] = createSignal<boolean>(false);

  const fetchCurrentAutoTopUpConfig = async () => {
    const currentAutoTopUpConfig = await getAllocationAutoTopUpConfig(props.allocation.allocationId);
    setAutoTopUpMonthlyDate(currentAutoTopUpConfig?.monthlyDay);
    setAutoTopUpAmount(currentAutoTopUpConfig?.amount?.amount);
    if (currentAutoTopUpConfig?.id) {
      setCurrentConfigId(currentAutoTopUpConfig.id);
      setAutoTopUpConfigEnabled(true);
    }
    setIsDirtyConfig(false);
  };

  onMount(async () => {
    try {
      await fetchCurrentAutoTopUpConfig();
    } catch (e: unknown) {
      messages.error({ title: 'Something went wrong' });
    }
  });

  const updateAutoTopUpConfig = (config: { monthlyDate?: number; amount?: number; enabled?: boolean }) => {
    setIsDirtyConfig(true);
    if (config.amount !== undefined) setAutoTopUpAmount(config.amount);
    if (config.monthlyDate !== undefined) setAutoTopUpMonthlyDate(config.monthlyDate);
    if (config.enabled !== undefined) setAutoTopUpConfigEnabled(config.enabled);
  };

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
    fetchCurrentAutoTopUpConfig();
  };

  const saveUpdatedAutoTopUpConfig = async (allocationId: string) => {
    if (autoTopUpConfigEnabled()) {
      if (autoTopUpMonthlyDate() && autoTopUpAmount()) {
        const autoTopUpConfigParams: AllocationAutoTopUpConfigCreateRequest = {
          monthlyDay:
            autoTopUpMonthlyDate()! > MAX_RECURRING_DEPOSIT_MONTH_DAY
              ? MAX_RECURRING_DEPOSIT_MONTH_DAY
              : autoTopUpMonthlyDate()!,
          amount: {
            currency: 'USD',
            amount: autoTopUpAmount()!,
          },
        };

        if (currentConfigId()) {
          await updateAllocationAutoTopUpConfig(allocationId, {
            id: currentConfigId()!,
            active: true,
            ...autoTopUpConfigParams,
          });
        } else {
          await createAllocationAutoTopUpConfig(allocationId, autoTopUpConfigParams);
        }
      }
    } else if (currentConfigId()) {
      await removeAllocationAutoTopUpConfig(currentConfigId()!);
    }

    await fetchCurrentAutoTopUpConfig();
  };

  const onSubmit = async () => {
    if (loading() || hasErrors(trigger())) return;
    const { name } = values();
    const [hideSuccess, setHideSuccess] = createSignal(false);

    try {
      const allocationId = props.allocation.allocationId;
      const roles = getRolesUpdates(currentRoles() || [], updatedRoles(), removedRoles());

      await saveUpdatedAutoTopUpConfig(allocationId);

      // NOTE: Temporary workaround until roles will be a part of saveAllocation() action.
      const createPromises = roles.create.map((item) => {
        return createOrUpdateAllocationRole(allocationId, item.user.userId!, item.role).catch(
          (e: { data: { message: string } }) => {
            messages.error({
              title: i18n.t('Unable to add {user}', { user: formatNameString(item.user) }),
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
              title: i18n.t('Unable to update {user}', { user: formatNameString(item.user) }),
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
              title: i18n.t('Unable to demote {user}', {
                user: formatNameString(users.data?.find((u) => u.userId === id)),
              }),
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

  const [archiving, archive] = wrapAction(archiveAllocation);

  const onArchive = () => {
    archive(props.allocation.allocationId)
      .then(() => {
        messages.success({ title: i18n.t('Allocation successfully archived') });
        return props.onReload();
      })
      .catch((error) =>
        messages.error({
          title: i18n.t('Something went wrong'),
          message: isFetchError<ControllerError>(error) ? error.data.message : undefined,
        }),
      );
  };

  const isDisabled = createMemo(() => props.allocation.archived);
  const isRoot = createMemo(() => !props.allocation.parentAllocationId);

  return (
    <Form>
      <Show when={canManageFunds(props.permissions)}>
        <Section title={<Text message="Allocation details" />} class={css.section}>
          <FormItem label={<Text message="Name" />} class={css.field} error={errors().name}>
            <Input
              name="allocation-label"
              value={values().name}
              error={Boolean(errors().name)}
              disabled={isDisabled()}
              onChange={handlers.name}
            />
          </FormItem>
        </Section>
      </Show>
      <Show when={canManagePermissions(props.permissions)}>
        <Section
          title={<Text message="Access" />}
          description={
            <>
              <Text message="Add users who can view or manage this allocation." class={css.descriptionContent!} />
              <Show when={!allocationHasParent && canLinkBankAccounts(props.permissions)}>
                <h5 class={css.descriptionHeader}>
                  <Text message="Admin" />
                </h5>
                <Text
                  message={
                    'Admins can deposit, withdraw, and reallocate funds, view and manage all allocations, ' +
                    'company settings, and accounting details, create additional allocations, add employees, ' +
                    'and issue cards.'
                  }
                  class={css.descriptionContent!}
                />
              </Show>
              <h5 class={css.descriptionHeader}>
                <Text message="Manage" />
              </h5>
              <Text
                message={
                  'Managers can reallocate funds between allocations that they manage, ' +
                  'create additional sub-allocations, and issue cards.'
                }
                class={css.descriptionContent!}
              />
              <h5 class={css.descriptionHeader}>
                <Text message="View only" />
              </h5>
              <Text
                message="Viewers can see balances, employees, cards, and transactions."
                class={css.descriptionContent!}
              />
            </>
          }
          class={css.section}
        >
          <FormItem label={<Text message="Add a user role" />} class={css.field}>
            <Select
              name="employee"
              placeholder={String(i18n.t('Search by employee name'))}
              popupSuffix={<NewEmployeeButton onClick={toggleEmployeeDrawer} />}
              disabled={isDisabled()}
              onChange={onAddRole}
            >
              <For each={sortedUsers()}>
                {(item) => (
                  <Show when={!item.archived}>
                    <Option
                      value={item.userId!}
                      disabled={
                        sortedRoles().some((role) => role.user.userId === item.userId) && !removedRoles()[item.userId!]
                      }
                    >
                      {formatName(item)}
                    </Option>
                  </Show>
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
                const disabled = createMemo<boolean>(
                  () => isDisabled() || role.user.userId === props.permissions?.user?.userId,
                );

                const cannotBePromoted = createMemo<boolean>(
                  () =>
                    role.inherited &&
                    [
                      AllocationRoles.Admin,
                      props.permissions?.allocationRole,
                      allocationHasParent ? AllocationRoles.Manager : undefined,
                    ].includes(role.role),
                );

                return (
                  <Show when={!removedRoles()[role.user.userId!]}>
                    <AllocationRole
                      allocation={props.allocation}
                      user={role.user}
                      role={role.role}
                      inherited={role.inherited}
                      class={css.field}
                      onChange={disabled() || cannotBePromoted() ? undefined : onChangeRole}
                      onDelete={disabled() ? undefined : onRemoveRole}
                      permissions={props.permissions}
                    />
                  </Show>
                );
              }}
            </For>
          </Show>
        </Section>
      </Show>
      <Show when={isRoot() && (isCustomerService(props.permissions) || canManageFunds(props.permissions))}>
        <Section
          class={css.borderedSection}
          title={<Text message="Recurring deposit" />}
          description={
            <>
              <Text
                message="Automatically transfer money from a bank account to this allocation every month."
                class={css.descriptionContent!}
              />
            </>
          }
        >
          <FormItem class={css.field}>
            <Switch
              name={'recurring-monthly-deposit'}
              value={autoTopUpConfigEnabled()}
              onChange={(enabled) => updateAutoTopUpConfig({ enabled })}
            >
              Recurring monthly deposit
            </Switch>
          </FormItem>
          <FormItem label={<Text message="Amount:" />} class={join(css.field, css.leftOffsetField)}>
            <InputCurrency
              name="recurring-monthly-deposit-amount"
              placeholder={'0.00'}
              value={`${autoTopUpAmount() ?? 0}`}
              onChange={(amount) => updateAutoTopUpConfig({ amount: +amount })}
              disabled={!autoTopUpConfigEnabled()}
            />
          </FormItem>
          <FormItem
            label={<Text message="Start deposits on:" />}
            extra={
              <Text message="Payments that fall on a weekend or holiday will be changed to previous business day." />
            }
            class={join(css.field, css.leftOffsetField)}
          >
            <InputDate
              name="recurring-monthly-deposit-date"
              placeholder={String(i18n.t('Select a date'))}
              value={autoTopUpMonthlyDate() ? new Date().setDate(autoTopUpMonthlyDate()!) : undefined}
              onChange={(day) => updateAutoTopUpConfig({ monthlyDate: day?.getDate() })}
              disabled={!autoTopUpConfigEnabled()}
            />
          </FormItem>
        </Section>
      </Show>
      <Show
        when={
          canManagePermissions(props.permissions) && !props.allocation.archived && props.allocation.parentAllocationId
        }
      >
        <Section title={<Text message="Archive" />} class={css.section}>
          <Confirm
            position="top-center"
            question={<Text message="Are you sure you want to archive this allocation?" />}
            confirmText={<Text message="Continue" />}
            onConfirm={onArchive}
          >
            {({ onClick }) => (
              <Button
                size="lg"
                icon="archive"
                type="danger"
                view="second"
                loading={archiving()}
                disabled={getAvailableBalance(props.allocation) !== 0}
                onClick={onClick}
              >
                <Text message="Archive allocation" />
              </Button>
            )}
          </Confirm>
        </Section>
      </Show>
      <Drawer open={showEmployeeDrawer()} title={<Text message="New Employee" />} onClose={toggleEmployeeDrawer}>
        <EditEmployeeFlatForm onSave={onAddEmployee} />
      </Drawer>
      <Show
        when={
          isDirty() || Boolean(updatedRoles().length) || Boolean(Object.keys(removedRoles()).length) || isDirtyConfig()
        }
      >
        <PageActions action={<Text message="Update Allocation" />} onCancel={onReset} onSave={onSubmit} />
      </Show>
    </Form>
  );
}
