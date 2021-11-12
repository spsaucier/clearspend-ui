import { Show } from 'solid-js';

import { Button } from '../Button';
import { join } from '../../utils/join';
import { wrapAction } from '../../utils/wrapAction';

import css from './Fault.css';

export interface FaultProps {
  class?: string;
  onReload?: () => Promise<unknown>;
}

export function Fault(props: Readonly<FaultProps>) {
  const [loading, reload] = wrapAction(props.onReload);

  return (
    <div class={join(css.root, props.class)}>
      <div class={css.content}>
        <h3 class={css.title}>Loading failed</h3>
        <p class={css.message}>Whatever happened, it was probably our fault.</p>
        <Show when={typeof props.onReload === 'function'}>
          <Button inverse type="primary" loading={loading()} class={css.action} onClick={reload}>
            Reload
          </Button>
        </Show>
      </div>
    </div>
  );
}
