import { join } from '../../utils/join';

import css from './Tick.css';

interface TickProps {
  darkMode?: boolean;
  indeterminate?: boolean;
  class?: string;
}

export function Tick(props: Readonly<TickProps>) {
  return (
    <span class={join(css.root, props.indeterminate && css.indeterminate, props.darkMode && css.dark, props.class)} />
  );
}
