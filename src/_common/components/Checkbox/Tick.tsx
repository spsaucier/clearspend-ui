import { join } from '../../utils/join';

import css from './Tick.css';

interface TickProps {
  class?: string;
}

export function Tick(props: Readonly<TickProps>) {
  return <span class={join(css.root, props.class)} />;
}
