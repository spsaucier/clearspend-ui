import { Switch, Match } from 'solid-js';
import type { JSX } from 'solid-js';

import { join } from '../../utils/join';
import { ConditionalWrapper } from '../ConditionalWrapper';

import css from './FormItem.css';

export interface FormItemProps {
  label?: JSX.Element;
  extra?: JSX.Element;
  error?: JSX.Element;
  class?: string;
  children: JSX.Element;
}

export function FormItem(props: Readonly<FormItemProps>) {
  return (
    <div class={join(css.root, props.class)}>
      <ConditionalWrapper condition={!!props.label} wrapper={(children) => <label>{children}</label>}>
        {props.label && <div class={css.label}>{props.label}</div>}
        <div>{props.children}</div>
        <div class={css.description}>
          <Switch fallback="\xa0">
            <Match when={props.error}>
              <div class={css.error}>{props.error}</div>
            </Match>
            <Match when={props.extra}>{props.extra}</Match>
          </Switch>
        </div>
      </ConditionalWrapper>
    </div>
  );
}
