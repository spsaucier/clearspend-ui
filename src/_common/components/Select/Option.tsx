import { useContext, createMemo, Show } from 'solid-js';

import kbCodes from '_common/utils/kbCodes';

import { Icon } from '../Icon';
import { join } from '../../utils/join';

import { SelectContext } from './context';
import type { OptionProps } from './types';

import css from './Option.css';

export function Option(props: Readonly<OptionProps>) {
  const context = useContext(SelectContext);

  const active = createMemo(() => props.value === context.value);

  const onKeyDown = (e: KeyboardEvent) => {
    if ([kbCodes.ENTER_KEY_CODE, ...kbCodes.SPACEBAR_KEY_CODES].includes(e.keyCode)) {
      context.onChange?.(props.value);
      e.preventDefault();
    } else if ([kbCodes.DOWN_ARROW_KEY_CODE].includes(e.keyCode)) {
      const nextSibling = document.activeElement?.nextElementSibling;
      if (nextSibling) {
        (nextSibling as HTMLElement).focus();
      }
      e.preventDefault();
    } else if ([kbCodes.UP_ARROW_KEY_CODE].includes(e.keyCode)) {
      const prevSibling = document.activeElement?.previousElementSibling;
      if (prevSibling) {
        (prevSibling as HTMLElement).focus();
      } else {
        context.close?.(true);
      }
      e.preventDefault();
    } else if ([kbCodes.ESCAPE_KEY_CODE].includes(e.keyCode)) {
      context.close?.(true);
    }
  };

  return (
    <li
      data-value={props.value}
      class={join(css.root, props.class)}
      classList={{
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
