import { createSignal, createMemo, createEffect, Show } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';
import { useScript } from 'solid-use-script';

import { useMessages } from 'app/containers/Messages/context';
import { wrapAction } from '_common/utils/wrapAction';

import { VerifyAccount } from '../../components/VerifyAccount';
import { getLinkToken } from '../../services/accounts';

import css from './LinkAccount.css';

const PLAID_SCRIPT = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';

interface LinkAccountProps {
  verifyOnLoad?: boolean;
  disabled?: boolean;
  onSuccess: (token: string) => Promise<unknown>;
}

export function LinkAccount(props: Readonly<LinkAccountProps>) {
  let handler: PlaidLink | undefined;

  const i18n = useI18n();
  const messages = useMessages();

  const [loading, scriptError] = useScript(PLAID_SCRIPT);
  const [processing, onSuccess] = wrapAction(props.onSuccess);

  const [token, setToken] = createSignal<string | Error>();
  const [init, setInit] = createSignal(true);

  const hasError = createMemo(() => scriptError() !== null || token() instanceof Error);

  getLinkToken().then(setToken).catch(setToken);

  createEffect(() => {
    const linkToken = token();

    if (loading() || typeof linkToken !== 'string') return;
    let data: PlaidMetadata | undefined;

    handler = Plaid.create({
      token: linkToken,
      receivedRedirectUri: null,
      onSuccess: (_, metadata) => {
        data = metadata;
      },
      onLoad: () => {
        setInit(false);
        if (props.verifyOnLoad) handler?.open();
      },
      onEvent: (eventName) => {
        if (eventName === 'HANDOFF' && data) {
          onSuccess(data.public_token).catch(() => {
            messages.error({ title: i18n.t('Something went wrong') });
          });
        }
      },
    });
  });

  return (
    <Show when={!hasError()} fallback={<Text message="Failed to load API" />}>
      <VerifyAccount
        loading={loading() || init() || processing()}
        disabled={props.disabled}
        class={css.verify}
        onVerifyClick={() => {
          handler?.open();
        }}
      />
    </Show>
  );
}
