import { JSX, createSignal, createMemo, JSXElement } from 'solid-js';

import { join } from '../../utils/join';
import { Icon } from '../Icon';
import { Popover } from '../Popover';

import { SelectContext } from './context';
import type { SelectProps } from './types';

import css from './Select.css';

const FOCUS_OUT_DELAY = 200;

function getSelected(value: string, elements: JSXElement): string | undefined {
  const items = typeof elements === 'function' ? elements() : elements;
  return Array.isArray(items)
    ? (items as HTMLElement[]).find((el) => el.dataset.value === value)?.innerText
    : undefined;
}

export function Select(props: Readonly<SelectProps>) {
  let input!: HTMLInputElement;
  const [open, setOpen] = createSignal(false);

  let focusTimeout: number;
  const clearFocusTimeout = () => clearTimeout(focusTimeout);

  const selected = createMemo(() => props.value && getSelected(props.value, props.children));

  const onInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
    props.onChange?.(event.currentTarget.value);
  };

  const onChange = (value: string) => {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    setOpen(false);
  };

  return (
    <Popover
      open={open()}
      class={css.popup}
      position={props.up ? 'top-left' : 'bottom-left'}
      onClickOutside={() => setOpen(false)}
      content={
        <ul class={css.list}>
          <SelectContext.Provider value={{ value: props.value, onChange }}>{props.children}</SelectContext.Provider>
        </ul>
      }
    >
      <div
        class={join(css.root, props.class)}
        classList={{
          [css.open!]: open(),
          [css.error!]: props.error,
          [css.disabled!]: props.disabled,
        }}
        onClick={() => {
          setOpen(true);
          input.focus();
        }}
      >
        {/* TODO: Add keyboard navigation support */}
        <input
          ref={input}
          readonly
          name={props.name}
          data-name={props.name}
          value={props.value}
          class={css.input}
          onFocusIn={() => {
            clearFocusTimeout();
            setOpen(true);
          }}
          onFocusOut={() => {
            clearFocusTimeout();
            focusTimeout = setTimeout(() => setOpen(false), FOCUS_OUT_DELAY);
          }}
          onInput={onInput}
        />
        <div class={css.value}>{selected() || <span class={css.placeholder}>{props.placeholder}</span>}</div>
        <Icon name="chevron-down" size="sm" class={join(css.chevron)} />
      </div>
    </Popover>
  );
}
