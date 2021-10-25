import { join } from '../../utils/join';

import css from './Divider.css';

interface DividerProps {
  class?: string;
}

export function Divider(props: Readonly<DividerProps>) {
  return <div class={join(css.root, props.class)} />;
}
