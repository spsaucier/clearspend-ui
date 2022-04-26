import { LoadingPage } from '_common/components/LoadingPage/LoadingPage';
import { i18n } from '_common/api/intl/index';

import css from './AwaitingCodatSync.css';

export function AwaitingCodatSync() {
  return (
    <div class={css.root}>
      <LoadingPage initialMessage={i18n.t('Syncing with accounting platform')} />
    </div>
  );
}
