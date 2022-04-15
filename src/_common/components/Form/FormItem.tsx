import { Switch, Match, Show, createEffect, useContext, onCleanup, createUniqueId } from 'solid-js';
import type { JSX } from 'solid-js';

import { join } from '../../utils/join';
import { ConditionalWrapper } from '../ConditionalWrapper';

import { FormContext } from './Form';

import css from './FormItem.css';

export interface FormItemProps {
  label?: JSX.Element;
  multiple?: boolean;
  extra?: JSX.Element;
  error?: JSX.Element;
  class?: string;
  children: JSX.Element;
  darkMode?: boolean;
}

export function FormItem(props: Readonly<FormItemProps>) {
  const context = useContext(FormContext);
  const key = createUniqueId();
  let formItemRef: HTMLDivElement | undefined;

  createEffect(() => {
    if (props.error && formItemRef) {
      context.addErrorRefYPosition?.(key, formItemRef);
    } else {
      context.removeErrorRefYPosition?.(key);
    }
  });

  onCleanup(() => {
    if (formItemRef) {
      context.removeErrorRefYPosition?.(key);
    }
  });

  return (
    <div class={join(css.root, props.class, props.darkMode && css.dark)} ref={formItemRef}>
      <ConditionalWrapper
        condition={!!props.label && !props.multiple}
        wrapper={(children) => <label>{children}</label>}
      >
        {props.label && <div class={css.label}>{props.label}</div>}
        <div>{props.children}</div>
        <Show when={props.extra || props.error}>
          <div class={css.description}>
            <Switch fallback="\xa0">
              <Match when={props.error}>
                <div class={css.error}>{props.error}</div>
              </Match>
              <Match when={props.extra}>
                <span class={css.extra}>{props.extra}</span>
              </Match>
            </Switch>
          </div>
        </Show>
      </ConditionalWrapper>
    </div>
  );
}
