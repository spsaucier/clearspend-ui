import { join } from '../../utils/join';

import css from './Spin.css';

export interface SpinProps {
  class?: string;
  size?: 'large' | 'small';
}

export function Spin(props: Readonly<SpinProps>) {
  return (
    <svg
      width={props.size === 'large' ? '48' : '24'}
      height={props.size === 'large' ? '48' : '24'}
      viewBox="0 0 24 24"
      class={join(css.root, props.class)}
    >
      <circle r="8" cx="12" cy="12" stroke="currentColor" stroke-width="1.5" fill="none" class={css.circle} />
    </svg>
  );
}
