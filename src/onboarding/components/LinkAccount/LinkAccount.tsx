import { createSignal, createEffect, Show } from 'solid-js';
import { useScript } from 'solid-use-script';

import { Section } from 'app/components/Section';
import { useMessages } from 'app/containers/Messages/context';
import { wrapAction } from '_common/utils/wrapAction';

import { VerifyAccount } from '../VerifyAccount';
import { getLinkToken } from '../../services/accounts';

import css from './LinkAccount.css';

const PLAID_SCRIPT = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';

interface LinkAccountProps {
  onNext: (token: string) => Promise<unknown>;
}

export function LinkAccount(props: Readonly<LinkAccountProps>) {
  let handler: PlaidLink | undefined;

  const messages = useMessages();
  const [processing, next] = wrapAction(props.onNext);

  const [loading, scriptError] = useScript(PLAID_SCRIPT);
  const [token, setToken] = createSignal<string>();
  const [init, setInit] = createSignal(true);

  getLinkToken()
    .then(setToken)
    .catch(() => {
      /* TODO */
    });

  createEffect(() => {
    if (!token() || loading()) return;
    let data: PlaidMetadata | undefined;

    handler = Plaid.create({
      token: token()!,
      receivedRedirectUri: null,
      onSuccess: (_, metadata) => {
        data = metadata;
      },
      onLoad: () => {
        setInit(false);
        handler?.open();
      },
      onEvent: (eventName) => {
        if (eventName === 'HANDOFF' && data) {
          next(data.public_token).catch(() => {
            messages.error({ title: 'Something going wrong' });
          });
        }
      },
    });
  });

  return (
    <Section
      title="Connect your account"
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nec tempor."
    >
      <Show when={!scriptError()} fallback="Failed to load API">
        <div class={css.wrapper}>
          <VerifyAccount
            loading={loading() || init() || processing()}
            class={css.verify}
            onVerifyClick={() => {
              handler?.open();
            }}
          />
        </div>
      </Show>
    </Section>
  );
}
