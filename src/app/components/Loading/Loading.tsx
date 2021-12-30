import { join } from '_common/utils/join';
import { Spin } from '_common/components/Spin';

import css from './Loading.css';

interface LoadingProps {
  class?: string;
}

export function Loading(props: Readonly<LoadingProps>) {
  return (
    <div class={join(css.root, props.class)}>
      <Spin />
    </div>
  );
}
