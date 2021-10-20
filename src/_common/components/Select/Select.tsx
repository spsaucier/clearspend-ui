import { createSignal, createMemo, batch } from 'solid-js';

import { Icon } from '../Icon';
import { Input } from '../Input';
import { Popover } from '../Popover';
import { join } from '../../utils/join';

import { SelectContext } from './context';
import { getOptions, getSelected, isMatch } from './utils';
import type { SelectProps } from './types';

import css from './Select.css';

const FOCUS_OUT_DELAY = 200;

export function Select(props: Readonly<SelectProps>) {
  let input!: HTMLInputElement;
  const [open, setOpen] = createSignal(false);
  const [search, setSearch] = createSignal('');

  let focusTimeout: number;
  const clearFocusTimeout = () => clearTimeout(focusTimeout);

  const selected = createMemo(() => props.value && getSelected(props.value, props.children));

  const options = () => {
    const text = search().toLowerCase();
    const items = getOptions(props.children);
    return !text ? items : items.filter(isMatch(text));
  };

  const onSearch = (value: string) => {
    setSearch(value);
    if (!value) {
      props.onChange?.('');
      return;
    }
    const exact = options().find((el) => el.innerText === value);
    if (exact) props.onChange?.(exact.dataset.value!);
  };

  const onChange = (value: string) => {
    batch(() => {
      setSearch('');
      setOpen(false);
    });
    props.onChange?.(value);
  };

  const onFocusIn = () => {
    clearFocusTimeout();
    setOpen(true);
  };

  const onFocusOut = () => {
    clearFocusTimeout();
    focusTimeout = setTimeout(() => {
      setOpen(false);
      if (search() && !options().length) {
        setSearch('');
        input.value = selected() || '';
      }
    }, FOCUS_OUT_DELAY);
  };

  return (
    <Popover
      open={open()}
      class={css.popup}
      position={props.up ? 'top-left' : 'bottom-left'}
      // onClickOutside={() => setOpen(false)}
      content={
        <ul class={css.list}>
          <SelectContext.Provider value={{ value: props.value, onChange }}>{options()}</SelectContext.Provider>
        </ul>
      }
    >
      <div class={join(css.root, props.class)} data-open={open()}>
        <Input
          ref={input}
          name={props.name}
          value={selected()}
          error={props.error}
          placeholder={props.placeholder}
          autoComplete="off"
          disabled={props.disabled}
          inputClass={css.input}
          onChange={onSearch}
          onFocusIn={onFocusIn}
          onFocusOut={onFocusOut}
        />
        <Icon name="chevron-down" size="sm" class={join(css.chevron)} />
      </div>
    </Popover>
  );
}
