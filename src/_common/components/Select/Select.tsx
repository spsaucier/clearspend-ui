import { createSignal, createMemo, batch, Show, type JSXElement } from 'solid-js';

import { Icon } from '../Icon';
import { Input } from '../Input';
import { Popover } from '../Popover';
import { join } from '../../utils/join';
import { isString } from '../../utils/isString';
import { KEY_CODES } from '../../constants/keyboard';
import { Spin } from '../Spin';

import { SelectContext } from './context';
import { getOptions, getSelected, isMatch, isAutofillEvent } from './utils';
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

  const onSearch = (value: string, event: InputEvent) => {
    if (props.changeOnSearch) {
      props.onChange?.(value);
    } else {
      batch(() => {
        if (!value) {
          props.onChange?.('');
          setSearch('');
          if (props.closeOnClear) setOpen(false);
          return;
        }

        if (isAutofillEvent(event)) {
          const searchValue = value.toLowerCase();
          const exact = getOptions(props.children)
            .filter(isMatch(searchValue))
            .find((el) => el.innerText.toLowerCase() === searchValue);

          if (exact) {
            props.onChange?.(exact.dataset.value!);
            setSearch('');
            setOpen(false);
            return;
          }
        }

        setSearch(value);
      });
    }
  };

  const onChange = (value: string) => {
    props.onChange?.(value);
    batch(() => {
      setSearch('');
      setOpen(false);
      input.focus();
      // Both below & above are required to keep focus position on page
      input.blur();
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
    if ([KEY_CODES.Tab, KEY_CODES.Escape].includes(e.keyCode)) {
      clearFocusTimeout();
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

  const renderedValue = createMemo<JSXElement>(() =>
    typeof props.valueRender === 'function' && props.value && isString(props.value)
      ? props.valueRender(props.value, selected()!)
      : selected(),
  );

  return (
    <Popover
      open={open()}
      class={join(css.popup, props.popupClass)}
      position="bottom-left"
      content={
        <>
          {props.popupPrefix}
          <ul class={css.list} ref={list}>
            <SelectContext.Provider value={{ value: props.value, onChange, close }}>{options()}</SelectContext.Provider>
          </ul>
          {props.popupSuffix}
        </>
      }
    >
      <div
        class={join(css.root, props.class, props.darkMode && css.dark)}
        data-open={open()}
        data-view={open() || !selected() ? 'input' : ''}
        data-loading={props.loading ? 'true' : ''}
      >
        <Input
          ref={input}
          darkMode={props.darkMode}
          name={props.name}
          value={createMemo(() => {
            const value = renderedValue();
            return isString(value) ? value : selected();
          })()}
          error={props.error}
          placeholder={props.placeholder}
          autoComplete={props.autoComplete ?? 'chrome-off'}
          disabled={props.disabled!}
          inputClass={css.input}
          onChange={onSearch}
          onClick={onFocusIn}
          onFocusIn={onFocusIn}
          onFocusOut={onFocusOut}
          onKeyDown={onKeyDown}
          suffix={props.loading ? <Spin /> : null}
        />
        <span class={css.value} classList={{ [css.valueDisabled!]: props.disabled }}>
          {renderedValue()}
        </span>
        <Show when={!props.changeOnSearch}>
          <Icon name={props.iconName ?? 'chevron-down'} size="sm" class={props.iconName ? css.icon : css.chevron} />
        </Show>
      </div>
    </Popover>
  );
}
