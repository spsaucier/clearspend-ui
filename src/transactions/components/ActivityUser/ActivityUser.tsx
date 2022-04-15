import { Show, Switch, Match } from 'solid-js';
import { Text } from 'solid-i18n';

import { formatName } from 'employees/utils/formatName';
import type { LedgerUser } from 'generated/capital';

import css from './ActivityUser.css';

interface ActivityUserProps {
  data: LedgerUser | undefined;
  onUserClick?: (userId: string) => void;
}

export function ActivityUser(props: Readonly<ActivityUserProps>) {
  return (
    <Show when={props.data}>
      {(data) => (
        <Switch>
          <Match when={data.type === 'USER' && data.userInfo}>
            {(user) => (
              <>
                <div
                  class={css.user}
                  classList={{ [css.link!]: !!props.onUserClick }}
                  onClick={(event) => {
                    event.stopPropagation();
                    props.onUserClick?.(user.userId!);
                  }}
                >
                  {formatName(user)}
                </div>
                <div class={css.email}>{user.email}</div>
              </>
            )}
          </Match>
          <Match when={data.type === 'SYSTEM'}>
            <Text message="System" />
          </Match>
          <Match when={data.type === 'EXTERNAL'}>
            <Text message="External" />
          </Match>
        </Switch>
      )}
    </Show>
  );
}
