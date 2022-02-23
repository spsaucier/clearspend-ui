import { Show, Switch, Match } from 'solid-js';
import { Text } from 'solid-i18n';

import { join } from '_common/utils/join';
import { Select, Option } from '_common/components/Select';
import { Popover } from '_common/components/Popover';
import { Confirm } from '_common/components/Confirm';
import { Button } from '_common/components/Button';
import { Icon } from '_common/components/Icon';
import { formatName } from 'employees/utils/formatName';

import { AllocationRoles, AllocationUserRole } from '../../types';

import css from './AllocationRole.css';

interface AllocationRoleProps extends AllocationUserRole {
  class?: string;
  onChange: (userId: string, role: AllocationRoles) => void;
  onDelete: (userId: string) => void;
}

export function AllocationRole(props: Readonly<AllocationRoleProps>) {
  return (
    <div class={join(css.root, props.class)}>
      <div>{formatName(props.user)}</div>
      <Select
        value={props.role}
        class={css.select}
        disabled={props.inherited}
        onChange={(value) => props.onChange(props.user.userId!, value as AllocationRoles)}
      >
        <Option value={AllocationRoles.Manager}>
          <Text message="Manage" />
        </Option>
        <Option value={AllocationRoles.ViewOnly}>
          <Text message="View only" />
        </Option>
      </Select>
      <Show
        when={!props.inherited}
        fallback={
          <Popover
            balloon
            position="bottom-center"
            trigger="hover"
            leaveDelay={0}
            class={css.popup}
            content={
              <div>
                <Switch>
                  <Match when={props.role === AllocationRoles.ViewOnly}>
                    <Text message="View only" class={css.popupTitle!} />
                    <ul class={css.popupContent}>
                      <li>
                        <Text message="View balances, transactions, receipts, etc." />
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
        }
      >
        <Confirm
          position="bottom-center"
          question={
            <div>
              <Text message="Are you sure you want to remove this owner?" class={css.popupTitle!} />
              <Text
                message={
                  'Removing this owner will prevent them from viewing or managing the cards ' +
                  'and transactions from your allocation.'
                }
                class={css.popupContent!}
              />
            </div>
          }
          confirmText={<Text message="Remove owner" />}
          onConfirm={() => props.onDelete(props.user.userId!)}
        >
          {(args) => <Button view="ghost" icon="trash" class={css.remove} {...args} />}
        </Confirm>
      </Show>
    </div>
  );
}
