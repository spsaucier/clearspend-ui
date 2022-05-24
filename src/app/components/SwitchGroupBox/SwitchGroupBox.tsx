import { For } from 'solid-js';
import type { JSXElement } from 'solid-js';

import { join } from '_common/utils/join';
import { Switch } from '_common/components/Switch';
import { Icon, IconName } from '_common/components/Icon';

import css from './SwitchGroupBox.css';

export interface SwitchGroupBoxItem<K = string> {
  key: K;
  icon: keyof typeof IconName;
  name: JSXElement;
}

interface SwitchGroupBoxProps {
  name?: string;
  value: readonly string[];
  allTitle: JSXElement;
  items: readonly Readonly<SwitchGroupBoxItem>[];
  class?: string;
  disabled?: boolean;
  onChange: (value: string[]) => void;
}

export function SwitchGroupBox(props: Readonly<SwitchGroupBoxProps>) {
  const onAllChange = (value: boolean) => {
    props.onChange(value ? props.items.map((item) => item.key) : []);
  };

  const onItemChange = (key: string) => {
    return (value: boolean) => {
      props.onChange(value ? [...props.value, key] : props.value.filter((item) => item !== key));
    };
  };

  return (
    <section class={join(css.root, props.class)}>
      <label class={css.header}>
        <h5 class={css.all}>{props.allTitle}</h5>
        <Switch
          name={props.name ? `${props.name}-all` : undefined}
          value={props.value.length === props.items.length}
          disabled={props.disabled}
          onChange={onAllChange}
        />
      </label>
      <div class={css.list}>
        <For each={props.items}>
          {(item) => (
            <label class={css.item}>
              <span class={css.icon}>
                <Icon size="sm" name={item.icon} />
              </span>
              <span>{item.name}</span>
              <Switch
                name={props.name ? `${props.name}-${item.key}` : item.key}
                value={props.value.includes(item.key)}
                disabled={props.disabled}
                onChange={onItemChange(item.key)}
              />
            </label>
          )}
        </For>
      </div>
    </section>
  );
}
