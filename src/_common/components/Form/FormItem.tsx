import { Switch, Match } from 'solid-js';
import type { JSX } from 'solid-js';

import { join } from '../../utils/join';

interface FormItemProps {
  label?: JSX.Element;
  extra?: JSX.Element;
  error?: JSX.Element;
  class?: string;
  children: JSX.Element;
}

export function FormItem(props: Readonly<FormItemProps>) {
  return (
    <div class={join(props.class)}>
      {props.label && <label>{props.label}</label>}
      <div>{props.children}</div>
      <div>
        <Switch fallback="\xa0">
          <Match when={props.error}>{props.error}</Match>
          <Match when={props.extra}>{props.extra}</Match>
        </Switch>
      </div>
    </div>
  );
}
