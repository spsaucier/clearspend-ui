import { For, Show, createMemo } from 'solid-js';

import { Tag } from '_common/components/Tag';
import { Icon } from '_common/components/Icon';
import { Dropdown, MenuItem } from '_common/components/Dropdown';

import css from './TagSelect.css';

export interface TagOption {
  key: string;
  text: string;
}

interface TagSelectProps {
  value: string;
  options: readonly Readonly<TagOption>[];
  onChange: (value: string) => void;
}

export function TagSelect(props: Readonly<TagSelectProps>) {
  const value = createMemo(() => props.options.find((opt) => opt.key === props.value));

  return (
    <Dropdown
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
