import { createMemo, createSignal, Match, Show, Switch } from 'solid-js';

import { join } from '_common/utils/join';
import { Icon } from '_common/components/Icon';
import { Checkbox } from '_common/components/Checkbox';
import type { AccountActivityResponse } from 'generated/capital';

import css from './SyncStatus.css';

interface SyncStatusProps {
  activityId: string;
  status: AccountActivityResponse['syncStatus'];
  selectedIds: string[];
  onChangeSelected: (id: string) => void;
}

export function SyncStatus(props: Readonly<SyncStatusProps>) {
  return (
    <Switch>
      <Match when={props.status === 'SYNCED_LOCKED'}>
        <div class={join(css.container, css.lock)}>
          <Icon name="lock" size="sm" />
        </div>
      </Match>
      <Match when={props.status === 'NOT_READY'}>
        <div class={css.container}>
          <Icon name="warning-rounded" size="sm" />
        </div>
      </Match>
      <Match when={props.status === 'READY'}>
        {() => {
          const [hover, setHover] = createSignal(false);
          const selected = createMemo(() => props.selectedIds.includes(props.activityId));
          const showCheckbox = createMemo(() => hover() || selected());

          return (
            <div
              class={css.container}
              classList={{ [css.sync!]: !showCheckbox(), [css.checkboxWrapper!]: showCheckbox() }}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <Show when={showCheckbox()} fallback={<Icon name="sync" size="sm" />}>
                <Checkbox
                  value={`select_${props.activityId}`}
                  checked={selected()}
                  onChange={() => props.onChangeSelected(props.activityId)}
                />
              </Show>
            </div>
          );
        }}
      </Match>
    </Switch>
  );
}
