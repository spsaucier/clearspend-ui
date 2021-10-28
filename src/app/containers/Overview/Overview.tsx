import { SpendWidget } from '../../components/SpendWidget';
import { SpendingByWidget } from '../../components/SpendingByWidget';

import css from './Overview.css';

export function Overview() {
  return (
    <div class={css.root}>
      <div class={css.top}>
        <SpendWidget />
        <SpendingByWidget />
      </div>
    </div>
  );
}
