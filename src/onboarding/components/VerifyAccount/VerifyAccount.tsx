import { Text } from 'solid-i18n';

import { Button } from '_common/components/Button';
import { join } from '_common/utils/join';

import css from './VerifyAccount.css';

interface VerifyAccountProps {
  loading: boolean;
  disabled?: boolean;
  class?: string;
  onVerifyClick?: () => void;
}

export function VerifyAccount(props: Readonly<VerifyAccountProps>) {
  return (
    <div class={join(css.root, props.class)}>
      <h4 class={css.title}>
        <Text message="Instant Bank Verification" />
      </h4>
      <p class={css.text}>
        Our instant bank verification process uses the best security protocols to ensure your information is always safe
        and secure. No prying eyes here.
      </p>
      <Button
        wide
        type="primary"
        loading={props.loading}
        disabled={props.disabled || props.loading}
        onClick={props.onVerifyClick}
      >
        <Text message="Link Bank" />
      </Button>
    </div>
  );
}
