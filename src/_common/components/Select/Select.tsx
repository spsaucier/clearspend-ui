import { createMemo, JSXElement } from 'solid-js';

import { join } from '../../utils/join';
import { useBool } from '../../utils/useBool';
import { Icon } from '../Icon';
import { Popover } from '../Popover';

import { SelectContext } from './context';
import type { SelectProps } from './types';

import css from './Select.css';

function getSelected(value: string, elements: JSXElement) {
  // TODO: check is array and fix typings
  return (elements as unknown as readonly HTMLElement[]).find((el) => el.dataset.value === value)?.innerText;
}

export function Select(props: Readonly<SelectProps>) {
  const [open, toggle] = useBool();
  const selected = createMemo(() => props.value && getSelected(props.value, props.children));

  const onChange = (value: string) => {
    props.onChange?.(value);
    toggle();
  };

  return (
    <Popover
      open={open()}
      class={css.popup}
      onClickOutside={toggle}
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
          [css.disabled!]: props.disabled,
        }}
        onClick={() => toggle()}
      >
        {/* TODO: Add keyboard navigation support */}
        <input readonly class={css.input} />
        <div class={css.value}>{selected() || <span class={css.placeholder}>{props.placeholder}</span>}</div>
        <Icon name="chevron-down" size="sm" class={join(css.chevron)} />
      </div>
    </Popover>
  );
}
