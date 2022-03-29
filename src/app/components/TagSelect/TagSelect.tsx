import { For, Show, createMemo } from 'solid-js';
import type { JSXElement } from 'solid-js';

import { Tag } from '_common/components/Tag';
import { Icon } from '_common/components/Icon';
import { Dropdown, MenuItem } from '_common/components/Dropdown';

import css from './TagSelect.css';

export interface TagOption<T extends string> {
  key: T;
  text: JSXElement;
}

interface TagSelectProps<T extends string> {
  value: T;
  options: readonly Readonly<TagOption<T>>[];
  onChange: (value: T) => void;
  class?: string;
}

export function TagSelect<T extends string>(props: Readonly<TagSelectProps<T>>) {
  const value = createMemo(() => props.options.find((opt) => opt.key === props.value));

  return (
    <Dropdown
      class={props.class}
      popupClass={css.popup}
      menu={
        <For each={props.options}>
          {(option) => (
            <MenuItem class={css.option} onClick={() => props.onChange(option.key)}>
              {option.text}
              <Show when={value()?.key === option.key}>
                <Icon size="sm" name="confirm" class={css.icon} />
              </Show>
            </MenuItem>
          )}
        </For>
      }
    >
      <Tag tabIndex="0" size="sm" class={css.tag}>
        <span>{value()?.text}</span>
        <Icon size="sm" name="chevron-down" />
      </Tag>
    </Dropdown>
  );
}
