import { Show } from 'solid-js';
import { DateTime } from 'solid-i18n';

import { DateFormat } from '_common/api/intl/types';

interface TransactionDateTimeProps {
  date: string | undefined;
  class?: string;
}

export function TransactionDateTime(props: Readonly<TransactionDateTimeProps>) {
  return (
    <Show when={props.date}>
      <span class={props.class}>
        <DateTime date={props.date!} />
        <span> &#8226; </span>
        <DateTime date={props.date!} preset={DateFormat.time} />
      </span>
    </Show>
  );
}
