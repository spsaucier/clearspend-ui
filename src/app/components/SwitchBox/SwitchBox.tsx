import { Show } from 'solid-js';
import type { JSXElement } from 'solid-js';

import { Switch } from '_common/components/Switch';
import { join } from '_common/utils/join';

import css from './SwitchBox.css';

interface SwitchBoxProps {
  name?: string;
  label: JSXElement;
  checked: boolean;
  class?: string;
  disabled?: boolean;
  children?: JSXElement;
  onChange?: (checked: boolean) => void;
}

export function SwitchBox(props: Readonly<SwitchBoxProps>) {
  return (
    <section class={join(css.root, props.class)}>
      <Switch name={props.name} value={props.checked} disabled={props.disabled} onChange={props.onChange} />
      <div>
        <h4 class={css.label}>{props.label}</h4>
        <Show when={props.children}>
          <div class={css.content} classList={{ [css.visible!]: props.checked }}>
            {props.children}
          </div>
        </Show>
      </div>
    </section>
  );
}
