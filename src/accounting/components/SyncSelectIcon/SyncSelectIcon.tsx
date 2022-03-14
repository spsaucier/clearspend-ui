import { createSignal } from 'solid-js';

import { Tick } from '_common/components/Checkbox';
import { Icon } from '_common/components/Icon';

import css from './SyncSelectIcon.css';

export function SyncSelectIcon() {
  const [hover, setHover] = createSignal(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {hover() ? (
        <div class={css.controlContainer}>
          <Tick class={css.control} />
        </div>
      ) : (
        <div class={css.syncDot}>
          <Icon name={'refresh'} class={css.sync} />
        </div>
      )}
    </div>
  );
}
