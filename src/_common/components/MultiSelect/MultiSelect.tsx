import { createSignal, Show, JSX, onMount, onCleanup, For } from 'solid-js';

import { KEY_CODES } from '_common/constants/keyboard';

import { Icon } from '../Icon';
import { Popover } from '../Popover';
import { join } from '../../utils/join';

import { MultiSelectContext } from './context';
import { getOptions, isMatch } from './utils';
import type { MultiSelectProps } from './types';

import css from './MultiSelect.css';

export function MultiSelect(props: Readonly<MultiSelectProps>) {
  let inputElement!: HTMLInputElement;
  let listElement!: HTMLUListElement;
  let inputWrapperElement!: HTMLDivElement;

  const [open, setOpen] = createSignal(false);
  const [searchString, setSearchString] = createSignal('');

  const selected = () => {
    return props.value?.map((v) => getOptions(props.children).find((el) => el.dataset.value === v)?.innerText);
  };

  const options = () => {
    const text = searchString().toLowerCase();
    const items = getOptions(props.children);
    return !text ? items : items.filter(isMatch(text));
  };

  const onChange = (value: string) => {
    setOpen(false); // Toggle open on each change to force re-render of Popover incase offset changes
    if (props.value?.includes(value)) {
      props.onChange?.(props.value.filter((v) => v !== value));
    } else {
      props.onChange?.(props.value ? [...props.value, value] : [value]);
    }
    setOpen(true);
    if (open()) {
      inputElement.focus();
    }
  };

  const showOptions = () => {
    setOpen(true);
  };

  const resultRender = (result: string) => (props.valueRender ? props.valueRender(result) : selected());

  const onInputChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
    setSearchString(event.currentTarget.value);
  };

  const onMouseDownEvent = (event: Event) => {
    if (open() && !listElement.contains(event.target as Node) && !inputWrapperElement.contains(event.target as Node)) {
      setOpen(false);
      setSearchString('');
    }
  };

  const onMouseDownInsideSelectEvent = () => {
    setOpen(true);
    inputElement.focus();
  };

  onMount(() => {
    inputWrapperElement.addEventListener('mousedown', onMouseDownInsideSelectEvent);
    document.addEventListener('mousedown', onMouseDownEvent);
  });

  onCleanup(() => {
    inputWrapperElement.removeEventListener('mousedown', onMouseDownInsideSelectEvent);
    document.removeEventListener('mousedown', onMouseDownEvent);
  });

  const onKeyDown = (e: KeyboardEvent) => {
    if (!searchString() && props.value && props.value.length > 0 && KEY_CODES.Delete === e.keyCode) {
      setOpen(false);
      props.onChange?.(props.value.splice(0, props.value.length - 1));
      setOpen(true);
    }
    if (e.keyCode === KEY_CODES.Escape) {
      setOpen(false);
    } else if ([KEY_CODES.ArrowUp, KEY_CODES.ArrowDown, KEY_CODES.Tab].includes(e.keyCode)) {
      if (!listElement.contains(document.activeElement)) {
        (listElement.firstChild as HTMLElement).focus();
      }
      e.preventDefault();
    }
  };

  return (
    <Popover
      open={open()}
      test={props.value?.length}
      class={join(css.popup, props.popupClass)}
      position="bottom-left"
      content={
        <ul class={css.list} ref={listElement}>
          <MultiSelectContext.Provider value={{ value: props.value, onChange, close }}>
            {options()}
          </MultiSelectContext.Provider>
        </ul>
      }
    >
      <div class={join(css.root, props.class)} data-open={open()} data-view={open() || !selected() ? 'input' : ''}>
        <div class={css.inputWrapper} ref={inputWrapperElement}>
          <For each={props.value}>
            {(v) => {
              return (
                <div class={css.selectedOption}>
                  <span class={css.selectedOptionText}>{resultRender(v)}</span>
                  <span class={css.selectedOptionX} onClick={() => onChange(v)}>
                    <Icon name={'cancel'} class={css.icon} />
                  </span>
                </div>
              );
            }}
          </For>
          <input
            value={searchString()}
            class={css.searchOptionInput}
            ref={inputElement}
            name={props.name}
            placeholder={props.placeholder}
            disabled={props.disabled}
            onInput={onInputChange}
            onClick={showOptions}
            onKeyDown={onKeyDown}
            onFocusIn={showOptions}
          />
        </div>
        <Show when={!props.changeOnSearch}>
          <Icon name="chevron-down" size="sm" class={join(css.chevron)} />
        </Show>
      </div>
    </Popover>
  );
}
