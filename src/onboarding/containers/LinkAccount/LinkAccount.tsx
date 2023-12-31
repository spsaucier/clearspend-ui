import { onCleanup, Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { wrapAction } from '_common/utils/wrapAction';

import { VerifyAccount } from '../../components/VerifyAccount';

import useLinkBankAccount from './useLinkBankAcccount';

import css from './LinkAccount.css';

interface LinkAccountProps {
  verifyOnLoad?: boolean;
  disabled?: boolean;
  onSuccess: (token: string, accountName?: string) => Promise<unknown>;
}

export function LinkAccount(props: Readonly<LinkAccountProps>) {
  const [processing, onSuccess] = wrapAction(props.onSuccess);
  const { handler: plaidInstance, loading, hasError } = useLinkBankAccount(onSuccess, props.verifyOnLoad);

  onCleanup(() => {
    if (plaidInstance()) {
      plaidInstance()?.destroy();
    }
  });

  return (
    <Show when={!hasError()} fallback={<Text message="Failed to load API" />}>
      <VerifyAccount
        loading={loading() || processing()}
        disabled={props.disabled}
        class={css.verify}
        onVerifyClick={() => plaidInstance()?.open()}
      />
    </Show>
  );
}
