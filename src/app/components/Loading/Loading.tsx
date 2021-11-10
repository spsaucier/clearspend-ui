import { Spin } from '_common/components/Spin';

import css from './Loading.css';

export function Loading() {
  return (
    <div class={css.root}>
      <Spin />
    </div>
  );
}
