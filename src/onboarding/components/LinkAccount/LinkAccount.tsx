import { createSignal, createEffect, Show } from 'solid-js';
import { useScript } from 'solid-use-script';

import { Section } from 'app/components/Section';
import { wrapAction } from '_common/utils/wrapAction';

import { VerifyAccount } from '../VerifyAccount';
import { readBusinessID } from '../../storage';
import { getLinkToken } from '../../services/accounts';

import css from './LinkAccount.css';

const PLAID_SCRIPT = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';

interface LinkAccountProps {
  onNext: (metadata: Readonly<PlaidMetadata>) => Promise<unknown>;
}

export function LinkAccount(props: Readonly<LinkAccountProps>) {
  let handler: PlaidLink | undefined;
  const [loadingNext, next] = wrapAction(props.onNext);

  const [token, setToken] = createSignal<string>();
  const [loadingScript, scriptError] = useScript(PLAID_SCRIPT);
  const [loading, setLoading] = createSignal(true);

  getLinkToken(readBusinessID())
    .then(setToken)
    .catch(() => {
      /* TODO */
    });

  createEffect(() => {
    const linkToken = token();
    if (!linkToken || loadingScript()) return;

    let data: PlaidMetadata | undefined;

    handler = Plaid.create({
      token: linkToken,
      receivedRedirectUri: null,
      onSuccess: (_, metadata) => {
        data = metadata;
      },
      onLoad: () => setLoading(false),
      onEvent: (eventName) => {
        if (eventName === 'HANDOFF' && data) {
          next(data).catch(() => {
            /* TODO */
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
            loading={loadingScript() || loading() || loadingNext()}
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
