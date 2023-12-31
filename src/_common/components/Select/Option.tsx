import { useContext, createMemo, Show } from 'solid-js';

import { Icon } from '../Icon';
import { KEY_CODES } from '../../constants/keyboard';

import { SelectContext } from './context';
import type { OptionProps } from './types';

import css from './Option.css';

export function Option(props: Readonly<OptionProps>) {
  const context = useContext(SelectContext);

  const active = createMemo(() => props.value === context.value);

  const onKeyDown = (e: KeyboardEvent) => {
    if ([KEY_CODES.Enter, KEY_CODES.Space].includes(e.keyCode)) {
      context.onChange?.(props.value);
      e.preventDefault();
      e.stopImmediatePropagation();
    } else if (e.keyCode === KEY_CODES.ArrowDown) {
      const nextSibling = document.activeElement?.nextElementSibling;
      if (nextSibling) {
        (nextSibling as HTMLElement).focus();
      }
      e.preventDefault();
    } else if (e.keyCode === KEY_CODES.ArrowUp) {
      const prevSibling = document.activeElement?.previousElementSibling;
      if (prevSibling) {
        (prevSibling as HTMLElement).focus();
      } else {
        context.close?.(true);
      }
      e.preventDefault();
    } else if (e.keyCode === KEY_CODES.Escape) {
      context.close?.(true);
    }
  };

  return (
    <li
      data-value={props.value}
      class={css.root}
      classList={{
        [props.class!]: !!props.class,
        [css.active!]: active(),
        [css.disabled!]: props.disabled,
      }}
      onClick={() => context.onChange?.(props.value)}
      onKeyDown={onKeyDown}
      tabindex="0"
    >
      <span class={css.content}>{props.children}</span>
      <Show when={active()}>
        <Icon size="sm" name="confirm" class={css.icon} />
      </Show>
    </li>
  );
}
