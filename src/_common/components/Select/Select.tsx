import { createSignal, createMemo, batch, Show } from 'solid-js';

import { Icon } from '../Icon';
import { Input } from '../Input';
import { Popover } from '../Popover';
import { join } from '../../utils/join';
import { isString } from '../../utils/isString';
import { KEY_CODES } from '../../constants/keyboard';
import { Spin } from '../Spin';

import { SelectContext } from './context';
import { getOptions, getSelected, isMatch } from './utils';
import type { SelectProps } from './types';

import css from './Select.css';

const FOCUS_OUT_DELAY = 200;

export function Select(props: Readonly<SelectProps>) {
  let input!: HTMLInputElement;
  let list!: HTMLUListElement;
  const [open, setOpen] = createSignal(false);
  const [search, setSearch] = createSignal('');

  let focusTimeout: number;
  const clearFocusTimeout = () => clearTimeout(focusTimeout);

  const selected = createMemo(() => (isString(props.value) ? getSelected(props.value, props.children) : undefined));

  const options = () => {
    const text = search().toLowerCase();
    const items = getOptions(props.children);
    return !text ? items : items.filter(isMatch(text));
  };

  const onSearch = (value: string) => {
    if (props.changeOnSearch) {
      props.onChange?.(value);
    } else {
      setSearch(value);
      if (!value) {
        props.onChange?.('');
        return;
      }
      const exact = options().find((el) => el.innerText === value);
      if (exact) props.onChange?.(exact.dataset.value!);
    }
  };

  const onChange = (value: string) => {
    props.onChange?.(value);
    batch(() => {
      setSearch('');
      setOpen(false);
      input.focus();
    });
  };

  const onFocusIn = () => {
    clearFocusTimeout();
    setOpen(true);
  };

  const close = (maintainFocus = false) => {
    clearFocusTimeout();
    focusTimeout = setTimeout(() => {
      setOpen(false);
      if (search()) {
        setSearch('');
        input.value = selected() || '';
      }
    }, FOCUS_OUT_DELAY);
    if (maintainFocus) {
      input.focus();
    }
  };

  const onFocusOut = () => {
    setTimeout(() => {
      if (!list.contains(document.activeElement)) {
        close();
      }
    });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode === KEY_CODES.Escape) {
      setOpen(false);
    } else if ([KEY_CODES.ArrowUp, KEY_CODES.ArrowDown].includes(e.keyCode)) {
      if (!list.contains(document.activeElement)) {
        (list.firstChild as HTMLElement).focus();
      }
      e.preventDefault();
    } else if (e.keyCode && ![KEY_CODES.Tab].includes(e.keyCode)) {
      setOpen(true);
    }
  };

  const renderList = () => (
    <ul class={css.list} ref={list}>
      <SelectContext.Provider value={{ value: props.value, onChange, close }}>{options()}</SelectContext.Provider>
    </ul>
  );

  return (
    <Popover
      open={open()}
      class={join(css.popup, props.popupClass)}
      position="bottom-left"
      content={props.popupRender ? props.popupRender(renderList()) : renderList()}
    >
      <div class={join(css.root, props.class)} data-open={open()} data-view={open() || !selected() ? 'input' : ''}>
        <Input
          ref={input}
          name={props.name}
          value={selected()}
          error={props.error}
          placeholder={props.placeholder}
          autoComplete={props.autoComplete ?? 'off'}
          disabled={props.disabled}
          inputClass={css.input}
          onChange={onSearch}
          onFocusIn={onFocusIn}
          onFocusOut={onFocusOut}
          onKeyDown={onKeyDown}
          suffix={props.loading ? <Spin /> : null}
        />
        <span class={css.value}>
          {typeof props.valueRender === 'function' && isString(props.value)
            ? props.valueRender(props.value, selected()!)
            : selected()}
        </span>
        <Show when={!props.changeOnSearch}>
          <Icon name="chevron-down" size="sm" class={join(css.chevron)} />
        </Show>
      </div>
    </Popover>
  );
}
