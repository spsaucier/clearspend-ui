import { createSignal } from 'solid-js';

import { Tick } from '_common/components/Checkbox/Tick';
import { Icon } from '_common/components/Icon';

import css from './SyncSelectIcon.css';

interface SyncSelectIconProps {
  id: string;
  selectedTransactions: string[];
  onSelectTransaction: (id: string) => void;
  onDeselectTransaction: (id?: string) => void;
}

export function SyncSelectIcon(props: SyncSelectIconProps) {
  const [hover, setHover] = createSignal(false);
  const [selected, setSelected] = createSignal<boolean>(props.selectedTransactions.includes(props.id));

  const onChange = () => {
    if (selected()) {
      props.onDeselectTransaction(props.id);
    } else {
      props.onSelectTransaction(props.id);
    }
    setSelected(!selected());
  };

  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {hover() || selected() ? (
        <div class={css.controlContainer} onClick={(e) => e.stopPropagation()}>
          <label>
            <input
              type="checkbox"
              name={`select_${props.id}`}
              data-name={`select_${props.id}`}
              checked={selected()}
              class={css.input}
              onChange={onChange}
            />
            <Tick class={css.control} />
          </label>
        </div>
      ) : (
        <div class={css.syncDot}>
          <Icon name={'refresh'} class={css.sync} />
        </div>
      )}
    </div>
  );
}
