import { useI18n } from 'solid-i18n';
import { createSignal, createMemo, createEffect } from 'solid-js';
import { useScript } from 'solid-use-script';

import { getLinkToken } from 'onboarding/services/accounts';
import { useMessages } from 'app/containers/Messages/context';

const PLAID_SCRIPT = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';

export default function useLinkBankAccount(
  onSuccess: (token: string, accountName?: string | undefined) => Promise<unknown>,
  verifyOnLoad = false,
) {
  let handler: PlaidLink | undefined;

  const i18n = useI18n();
  const messages = useMessages();

  const [loading, scriptError] = useScript(PLAID_SCRIPT);

  const [token, setToken] = createSignal<string | Error>();
  const [init, setInit] = createSignal(true);
  const [fetchingUpdatedStatus, setFetchingUpdatedStatus] = createSignal(false);

  const hasError = createMemo(() => scriptError() !== null || token() instanceof Error);
  const isLoading = createMemo(() => !!loading() || !!init() || !!fetchingUpdatedStatus());

  getLinkToken().then(setToken).catch(setToken);

  createEffect(() => {
    const linkToken = token();

    if (loading() || typeof linkToken !== 'string') return;

    handler = Plaid.create({
      token: linkToken,
      receivedRedirectUri: null,
      onSuccess: (_, metadata) => {
        setFetchingUpdatedStatus(true);
        onSuccess(metadata.public_token, metadata.accounts[0]?.name).catch(() => {
          messages.error({ title: i18n.t('Something went wrong') });
          setFetchingUpdatedStatus(false);
        });
      },
      onLoad: () => {
        setInit(false);
        if (verifyOnLoad) handler?.open();
      },
    });
  });
  return { loading: isLoading, hasError, open: handler?.open };
}
