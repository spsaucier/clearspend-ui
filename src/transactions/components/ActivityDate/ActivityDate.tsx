import { Show } from 'solid-js';
import { DateTime } from 'solid-i18n';

import { DateFormat } from '_common/api/intl/types';

import css from './ActivityDate.css';

interface ActivityDateProps {
  date: string | undefined;
}

export function ActivityDate(props: Readonly<ActivityDateProps>) {
  return (
    <Show when={props.date}>
      {(date) => (
        <>
          <DateTime date={date} class={css.date} />
          <DateTime date={date} preset={DateFormat.time} class={css.sub} />
        </>
      )}
    </Show>
  );
}
