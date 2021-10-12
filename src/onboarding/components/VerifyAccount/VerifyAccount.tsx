import { Button } from '_common/components/Button';
import { join } from '_common/utils/join';

import css from './VerifyAccount.css';

interface VerifyAccountProps {
  class?: string;
}

export function VerifyAccount(props: Readonly<VerifyAccountProps>) {
  return (
    <div class={join(css.root, props.class)}>
      <h4 class={css.title}>Instant Bank Verification</h4>
      <p class={css.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nec tempor.</p>
      <Button wide type="primary">
        Verify Now
      </Button>
    </div>
  );
}
