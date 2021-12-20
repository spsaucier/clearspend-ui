import { useContext, createMemo, createSignal } from 'solid-js';

import { KEY_CODES } from '_common/constants/keyboard';

import { join } from '../../utils/join';

import { MultiSelectContext } from './context';
import type { OptionProps } from './types';

import css from './Option.css';

export function Option(props: Readonly<OptionProps>) {
  const context = useContext(MultiSelectContext);
  const active = createMemo(() => context.value?.includes(props.value));
  const [isActive, setIsActive] = createSignal(active());

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
      class={join(css.root, props.class)}
      classList={{
        [css.active!]: isActive(),
        [css.disabled!]: props.disabled,
      }}
      onKeyDown={onKeyDown}
      onClick={() => {
        setIsActive(!isActive());
        context.onChange?.(props.value);
      }}
      tabindex="0"
    >
      <input class={css.customCheckbox} type="checkbox" checked={isActive()} tabIndex={-1} />
      <span class={css.content}>{props.children}</span>
    </li>
  );
}
