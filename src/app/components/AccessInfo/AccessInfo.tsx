import { Button } from '_common/components/Button';

import css from './AccessInfo.css';

export function AccessInfo() {
  return (
    <div class={css.root}>
      <div class={css.content}>
        <h4 class={css.header}>Oops, Sara</h4>
        <p class={css.message}>
          It looks like you do not have permission to access any allocations. Please contact your account owner to be
          added to an active allocation.
        </p>
        <Button view="ghost" type="primary">
          Sign out
        </Button>
      </div>
    </div>
  );
}
