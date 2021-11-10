import { Button } from '_common/components/Button';
import { wrapAction } from '_common/utils/wrapAction';
import { join } from '_common/utils/join';

import css from './LoadingError.css';

interface LoadingErrorProps {
  class?: string;
  onReload: () => Promise<unknown>;
}

export function LoadingError(props: Readonly<LoadingErrorProps>) {
  const [loading, reload] = wrapAction(props.onReload);

  return (
    <div class={join(css.root, props.class)}>
      <h3 class={css.title}>Loading failed</h3>
      <Button ghost type="primary" loading={loading()} onClick={reload}>
        Reload
      </Button>
    </div>
  );
}
