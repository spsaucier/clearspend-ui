import { Show } from 'solid-js';
import { useI18n } from 'solid-i18n';

import type { LedgerActivityResponse } from 'generated/capital';

import { ACTIVITY_TYPE_TITLES } from '../../constants';

import css from './ActivityType.css';

interface ActivityTypeProps {
  withdrawal: boolean;
  type: LedgerActivityResponse['type'];
  category: string | undefined;
}

export function ActivityType(props: Readonly<ActivityTypeProps>) {
  const i18n = useI18n();

  return (
    <div>
      <Show when={props.type}>
        {(type) =>
          i18n.t(
            type === 'REALLOCATE'
              ? props.withdrawal
                ? ACTIVITY_TYPE_TITLES.BANK_WITHDRAWAL
                : ACTIVITY_TYPE_TITLES.BANK_DEPOSIT_STRIPE
              : ACTIVITY_TYPE_TITLES[type],
          )
        }
      </Show>
      <Show when={props.category}>{(category) => <div class={css.category}>{category}</div>}</Show>
    </div>
  );
}
