import { createSignal, Show, JSX, onMount, onCleanup, For } from 'solid-js';

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
  const [open, setOpen] = createSignal(false);
  const [search, ,] = createSignal('');

  const selected = () => {
    return props.value?.map((v) => getOptions(props.children).find((el) => el.dataset.value === v)?.innerText);
  };

  const options = () => {
    const text = search().toLowerCase();
    const items = getOptions(props.children);
    return !text ? items : items.filter(isMatch(text));
  };

  // const onSearch = (searchString: string) => {
  //   if (props.changeOnSearch) {
  //     props.onChange?.([searchString]); // todo
  //   } else {
  //     setSearch(searchString);
  //     if (!searchString) {
  //       props.onChange?.(['asdf']); // todo
  //       return;
  //     }
  //     const exact = options().find((el) => el.innerText === searchString);
  //     if (exact) props.onChange?.([exact.dataset.value!]); // todo
  //   }
  // };

  const onChange = (value: string) => {
    if (props.value?.includes(value)) {
      props.onChange?.(props.value.filter((v) => v !== value));
    } else {
      props.onChange?.(props.value ? [...props.value, value] : [value]);
    }
  };

  const showOptions = () => {
    setOpen(true);
  };

  const resultRender = (result: string) => (props.valueRender ? props.valueRender(result) : selected());

  const onInputChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
    // eslint-disable-next-line no-console
    console.log('Event: ', event);
    // let text = event.currentTarget.value;
    // if (typeof merged.formatter === 'function') {
    //   text = merged.formatter(text);
    //   input.value = text;
    // }
    // merged.onChange?.(text, event);
  };

  const onMouseDownEvent = (event: Event) => {
    if (!listElement.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  const onBlurEvent = () => {
    if (open()) {
      inputElement.focus();
    }
  };

  onMount(() => {
    inputElement.addEventListener('blur', onBlurEvent);
    document.addEventListener('mousedown', onMouseDownEvent);
  });

  onCleanup(() => {
    inputElement.removeEventListener('blur', onBlurEvent);
    document.removeEventListener('mousedown', onMouseDownEvent);
  });

  return (
    <Popover
      open={open()}
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
        {/* <Input
          ref={input}
          name={props.name}
          value={selected()}
          error={props.error}
          placeholder={props.placeholder}
          autoComplete="nope"
          disabled={props.disabled}
          inputClass={css.input}
          onChange={onSearch}
          onFocusIn={onFocusIn}
          onFocusOut={onFocusOut}
          onKeyDown={onKeyDown}
          suffix={props.loading ? <Spin /> : null}
        /> */}
        <div style={{ display: 'flex', 'margin-bottom': '20px' }}>
          <For each={props.value}>
            {(v) => {
              return <div>{resultRender(v)}</div>;
            }}
          </For>
        </div>
        <input
          ref={inputElement}
          name={props.name}
          placeholder={props.placeholder}
          disabled={props.disabled}
          onInput={onInputChange}
          onClick={showOptions}
          onFocusIn={showOptions}
        />
        <Show when={!props.changeOnSearch}>
          <Icon name="chevron-down" size="sm" class={join(css.chevron)} />
        </Show>
      </div>
    </Popover>
  );
}
