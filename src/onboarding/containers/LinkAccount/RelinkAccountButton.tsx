import { onCleanup, Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { wrapAction } from '_common/utils/wrapAction';
import { Button } from '_common/components/Button';

import useLinkBankAccount from './useLinkBankAcccount';

interface LinkAccountProps {
  verifyOnLoad?: boolean;
  disabled?: boolean;
  onSuccess: (token: string, accountName?: string) => Promise<unknown>;
  bankAccountId: string;
  isMicrodeposits?: boolean;
}

export function RelinkAccountButton(props: Readonly<LinkAccountProps>) {
  const [processing, onSuccess] = wrapAction(props.onSuccess);
  const {
    handler: plaidInstance,
    loading,
    hasError,
  } = useLinkBankAccount(onSuccess, props.verifyOnLoad, props.bankAccountId);

  onCleanup(() => {
    if (plaidInstance()) {
      plaidInstance()?.destroy();
    }
  });

  return (
    <Show when={!hasError()} fallback={<Text message="Failed to link bank account" />}>
      <Button
        icon="refresh"
        type="primary"
        size="lg"
        loading={loading() || processing()}
        disabled={props.disabled || loading()}
        onClick={() => plaidInstance()?.open()}
      >
        <Show when={props.isMicrodeposits} fallback={<Text message="Relink Bank Account" />}>
          <Text message="Enter Micro-Deposits" />
        </Show>
      </Button>
    </Show>
  );
}
