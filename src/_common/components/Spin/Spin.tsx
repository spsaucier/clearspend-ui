import { join } from '../../utils/join';

import css from './Spin.css';

export interface SpinProps {
  class?: string;
}

export function Spin(props: Readonly<SpinProps>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" class={join(css.root, props.class)}>
      <circle r="8" cx="12" cy="12" stroke="currentColor" stroke-width="1.5" fill="none" class={css.circle} />
    </svg>
  );
}
