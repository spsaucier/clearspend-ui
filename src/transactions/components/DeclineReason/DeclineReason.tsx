import { Show } from 'solid-js';

import { join } from '_common/utils/join';
import { Icon } from '_common/components/Icon';
import type { AccountActivityResponse } from 'generated/capital';

import { getReasonText } from './utils';

import css from './DeclineReason.css';

interface DeclineReasonProps {
  details: AccountActivityResponse['declineDetails'];
  class?: string;
}

export function DeclineReason(props: Readonly<DeclineReasonProps>) {
  return (
    <Show when={props.details}>
      {(details) => (
        <div class={join(css.root, props.class)}>
          <Icon name="warning-rounded" size="sm" />
          <span>{getReasonText(details)}</span>
        </div>
      )}
    </Show>
  );
}
