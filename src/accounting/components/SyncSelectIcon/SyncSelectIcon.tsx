import { createSignal } from 'solid-js';

import { Checkbox, CheckboxGroup } from '_common/components/Checkbox';
import { Icon } from '_common/components/Icon';

import css from './SyncSelectIcon.css';

interface SyncSelectIconProps {
  id: string;
  onChange: (value: string[]) => void;
}

export function SyncSelectIcon(props: SyncSelectIconProps) {
  const [hover, setHover] = createSignal(false);
  const [selected, setSelected] = createSignal(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {hover() || selected() ? (
        <div class={css.controlContainer}>
          <CheckboxGroup
            onChange={(val) => {
              setSelected(!selected());
              props.onChange(val);
            }}
          >
            <Checkbox value={props.id}></Checkbox>
          </CheckboxGroup>
        </div>
      ) : (
        <div class={css.syncDot}>
          <Icon name={'refresh'} class={css.sync} />
        </div>
      )}
    </div>
  );
}
