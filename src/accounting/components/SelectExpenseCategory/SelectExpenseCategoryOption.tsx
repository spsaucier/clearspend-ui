import { useContext, createMemo, Show } from 'solid-js';

import { KEY_CODES } from '_common/constants/keyboard';
import { Icon } from '_common/components/Icon';

import { SelectExpenseCategoryContext } from './context';
import type { SelectExpenseCategoryOptionProps } from './types';

import css from './SelectExpenseCategoryOption.css';

export function SelectExpenseCategoryOption(props: Readonly<SelectExpenseCategoryOptionProps>) {
  const context = useContext(SelectExpenseCategoryContext);

  const active = createMemo(() => props.value.expenseCategoryId === context.value?.expenseCategoryId);

  const onKeyDown = (e: KeyboardEvent) => {
    if ([KEY_CODES.Enter, KEY_CODES.Space].includes(e.keyCode)) {
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
      data-value={props.value.categoryName}
      class={css.root}
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
