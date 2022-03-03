import { Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { wrapAction } from '_common/utils/wrapAction';
import { Button } from '_common/components/Button';

import useLinkBankAccount from './useLinkBankAcccount';

interface LinkAccountProps {
  verifyOnLoad?: boolean;
  disabled?: boolean;
  onSuccess: (token: string, accountName?: string) => Promise<unknown>;
}

export function LinkAccountButton(props: Readonly<LinkAccountProps>) {
  const [processing, onSuccess] = wrapAction(props.onSuccess);
  const { open, loading, hasError } = useLinkBankAccount(onSuccess, props.verifyOnLoad);

  return (
    <Show when={!hasError()} fallback={<Text message="Failed to link bank account" />}>
      <Button icon="add" loading={loading() || processing()} disabled={props.disabled} onClick={open}>
        <Text message="Link Bank Account" />
      </Button>
    </Show>
  );
}
