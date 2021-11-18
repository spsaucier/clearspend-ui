import type { JSXElement } from 'solid-js';

import { Switch } from '_common/components/Switch';
import { join } from '_common/utils/join';

import css from './SwitchBox.css';

interface SwitchBoxProps {
  label: JSXElement;
  checked: boolean;
  class?: string;
  children?: JSXElement;
  onChange?: (checked: boolean) => void;
}

export function SwitchBox(props: Readonly<SwitchBoxProps>) {
  return (
    <section class={join(css.root, props.class)}>
      <Switch value={props.checked} onChange={props.onChange} />
      <div>
        <h4 class={css.label}>{props.label}</h4>
        <div class={css.content} classList={{ [css.visible!]: props.checked }}>
          {props.children}
        </div>
      </div>
    </section>
  );
}
