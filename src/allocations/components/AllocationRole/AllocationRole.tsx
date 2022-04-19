import { Show, Switch, Match, Accessor } from 'solid-js';
import { Text } from 'solid-i18n';

import { join } from '_common/utils/join';
import { Select, Option } from '_common/components/Select';
import { Popover } from '_common/components/Popover';
import { Confirm } from '_common/components/Confirm';
import { Button } from '_common/components/Button';
import { Icon } from '_common/components/Icon';
import { formatName } from 'employees/utils/formatName';
import type { Allocation, UserRolesAndPermissionsRecord } from 'generated/capital';

import { AllocationRoles, AllocationUserRole } from '../../types';

import css from './AllocationRole.css';

interface AllocationRoleProps extends AllocationUserRole {
  class?: string;
  allocation?: Allocation;
  onChange?: (userId: string, role: AllocationRoles) => void;
  onDelete?: (userId: string) => void;
  permissions?: Accessor<Readonly<UserRolesAndPermissionsRecord> | null>;
}

export function AllocationRole(props: Readonly<AllocationRoleProps>) {
  const rolesByLevel = {
    [AllocationRoles.Admin]: 4,
    [AllocationRoles.Manager]: 3,
    [AllocationRoles.Employee]: 2,
    [AllocationRoles.ViewOnly]: 1,
  };
  return (
    <div class={join(css.root, props.class)}>
      <div>{formatName(props.user)}</div>
      <Select
        value={props.role}
        class={css.select}
        disabled={props.user.type === 'BUSINESS_OWNER' || !props.onChange}
        onChange={(value) => props.onChange?.(props.user.userId!, value as AllocationRoles)}
      >
        <Show
          when={
            !Boolean(props.allocation?.parentAllocationId) &&
            props.permissions?.()?.allocationRole === AllocationRoles.Admin
          }
        >
          <Option value={AllocationRoles.Admin}>
            <Text message="Admin" />
          </Option>
        </Show>
        <Option
          disabled={props.inherited && rolesByLevel[props.role] > rolesByLevel[AllocationRoles.Manager]}
          value={AllocationRoles.Manager}
        >
          <Text message="Manage" />
        </Option>
        <Option
          disabled={props.inherited && rolesByLevel[props.role] > rolesByLevel[AllocationRoles.ViewOnly]}
          value={AllocationRoles.ViewOnly}
        >
          <Text message="View only" />
        </Option>
      </Select>

      <div class={css.infoIconContainer}>
        <Popover
          balloon
          position="bottom-center"
          trigger="hover"
          leaveDelay={0}
          class={css.popup}
          content={
            <div>
              <Switch>
                <Match when={props.role === AllocationRoles.Admin}>
                  <Text message="Administrator" class={css.popupTitle!} />
                  <ul class={css.popupContent}>
                    <li>
                      <Text message="Add & update users" />
                    </li>
                    <li>
                      <Text message="Create and manage all allocations & cards" />
                    </li>
                    <li>
                      <Text message="Manage bank accounts, deposits, and withdrawals" />
                    </li>
                    <li>
                      <Text message="View & update company information" />
                    </li>
                    <li>
                      <Text message="Access accounting features" />
                    </li>
                  </ul>
                </Match>
                <Match when={props.role === AllocationRoles.Manager}>
                  <Text message="Manage Allocation" class={css.popupTitle!} />
                  <ul class={css.popupContent}>
                    <li>
                      <Text message="Manage balances for child allocations" />
                    </li>
                    <li>
                      <Text message="Issue new cards" />
                    </li>
                    <li>
                      <Text message="Manage spend controls" />
                    </li>
                    <li>
                      <Text message="Create child allocations" />
                    </li>
                  </ul>
                </Match>
                <Match when={props.role === AllocationRoles.ViewOnly}>
                  <Text message="View only" class={css.popupTitle!} />
                  <ul class={css.popupContent}>
                    <li>
                      <Text message="View balances, transactions, receipts, etc." />
                    </li>
                  </ul>
                </Match>
              </Switch>
            </div>
          }
        >
          {(args) => (
            <span {...args} class={css.icon}>
              <Icon name="information" />
            </span>
          )}
        </Popover>
      </div>

      <div class={css.deleteIconContainer}>
        <Show when={!props.inherited && props.user.type !== 'BUSINESS_OWNER' && props.onDelete}>
          <Confirm
            position="bottom-center"
            question={
              <div>
                <Text message="Are you sure you want to remove this role?" class={css.popupTitle!} />
                <Text
                  message={
                    "Removing this role will prevent {name} from viewing or managing this allocation's " +
                    'cards and transactions.'
                  }
                  name={props.user.firstName || 'this user'}
                  class={css.popupContent!}
                />
              </div>
            }
            confirmText={<Text message="Remove role" />}
            onConfirm={() => props.onDelete?.(props.user.userId!)}
          >
            {(args) => <Button view="ghost" icon="trash" class={css.remove} {...args} />}
          </Confirm>
        </Show>
      </div>
    </div>
  );
}
