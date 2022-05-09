import { createSignal, Switch, Match, Show, type JSXElement } from 'solid-js';
import { Text } from 'solid-i18n';

import { join } from '_common/utils/join';
import { getNoop } from '_common/utils/getNoop';
import { MenuItem } from '_common/components/Dropdown';
import { Confirm } from '_common/components/Confirm';
import { formatCurrency } from '_common/api/intl/formatCurrency';
import type { Amount } from 'generated/capital';

import { MoreVerticalDropdown } from '../MoreVerticalDropdown/MoreVerticalDropdown';

import css from './PinnedClient.css';

export interface PinnedClientProps {
  type: 'my' | 'client' | 'invite';
  name: JSXElement;
  amount?: Readonly<Amount>;
  class?: string;
  onInviteClick?: () => void;
  onSettingsClick?: () => void;
  onUnpinClick: () => void;
  onDeleteClick?: () => void;
}

export function PinnedClient(props: Readonly<PinnedClientProps>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = createSignal(false);

  return (
    <div
      class={join(css.root, props.class)}
      classList={{ [css.my!]: props.type === 'my', [css.invite!]: props.type === 'invite' }}
    >
      <Confirm
        open={showDeleteConfirm()}
        position="bottom-center"
        question={<Text message="Are you sure you want to delete this account?" />}
        confirmText={<Text message="Delete" />}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={props.onDeleteClick || getNoop()}
      >
        <div class={css.wrapper}>
          <div class={css.header}>
            <Switch>
              <Match when={props.type === 'my'}>
                <Text message="My Company" />
              </Match>
              <Match when={props.type === 'client'}>
                <Text message="Client" />
              </Match>
              <Match when={props.type === 'invite'}>
                <Text message="Invite sent" />
              </Match>
            </Switch>
            <Show when={props.amount}>
              <span> | </span>
              <strong class={css.amount}>{formatCurrency(props.amount!.amount!)}</strong>
            </Show>
          </div>
          <div class={css.content}>
            <div class={css.name}>{props.name}</div>
            <MoreVerticalDropdown>
              <Show when={props.type === 'invite'}>
                <MenuItem onClick={props.onInviteClick}>
                  <Text message="Resend invite" />
                </MenuItem>
              </Show>
              <Show when={props.type !== 'invite'}>
                <MenuItem onClick={props.onSettingsClick}>
                  <Text message="Account settings" />
                </MenuItem>
              </Show>
              <MenuItem onClick={props.onUnpinClick}>
                <Text message="Unpin account" />
              </MenuItem>
              <Show when={props.type === 'invite'}>
                <MenuItem onClick={() => setShowDeleteConfirm(true)}>
                  <Text message="Delete account" />
                </MenuItem>
              </Show>
            </MoreVerticalDropdown>
          </div>
        </div>
      </Confirm>
    </div>
  );
}
