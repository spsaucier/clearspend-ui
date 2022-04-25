import { Loading } from 'app/components/Loading';

import css from './AwaitingCodatSync.css';

export function AwaitingCodatSync() {
  return (
    <div class={css.root}>
      <Loading />
    </div>
  );
}
