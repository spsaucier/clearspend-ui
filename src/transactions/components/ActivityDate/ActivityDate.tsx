import { Show } from 'solid-js';
import { DateTime } from 'solid-i18n';

import css from './ActivityDate.css';

interface ActivityDateProps {
  date: string | undefined;
  showTime?: boolean;
}

export function ActivityDate(props: Readonly<ActivityDateProps>) {
  return <Show when={props.date}>{(date) => <DateTime date={date} class={css.date} />}</Show>;
}
