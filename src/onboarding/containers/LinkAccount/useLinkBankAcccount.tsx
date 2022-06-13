import { useI18n } from 'solid-i18n';
import { createSignal, createMemo } from 'solid-js';
import { useScript } from 'solid-use-script';

import { getLinkToken, getRelinkToken, unregisterBankAccount } from 'onboarding/services/accounts';
import { useMessages } from 'app/containers/Messages/context';

const PLAID_SCRIPT = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';

export default function useLinkBankAccount(
  onSuccess: (token: string, accountName?: string | undefined) => Promise<unknown>,
  verifyOnLoad = false,
  bankAccountId = '',
) {
  const i18n = useI18n();
  const messages = useMessages();

  const [loading, scriptError] = useScript(PLAID_SCRIPT);

  const [token, setToken] = createSignal<string | Error>();
  const [init, setInit] = createSignal(true);
  const [fetchingUpdatedStatus, setFetchingUpdatedStatus] = createSignal(false);

  const hasError = createMemo(() => scriptError() !== null || token() instanceof Error);
  const isLoading = createMemo(() => !!loading() || !!init() || !!fetchingUpdatedStatus());

  if (bankAccountId) {
    getRelinkToken(bankAccountId).then(setToken).catch(setToken);
  } else {
    getLinkToken().then(setToken).catch(setToken);
  }

  const removeAccount = () =>
    unregisterBankAccount(bankAccountId).catch((e: { data?: { message: string } }) => {
      messages.error({ title: 'Unable to unlink bank account', message: e.data?.message });
    });

  const handler = createMemo(() => {
    const linkToken = token();

    if (loading() || typeof linkToken !== 'string') return undefined;

    // Note: Use with caution, multiple uses of this hook will create multiple instances if not calling `.destroy()`
    const instance = Plaid.create({
      token: linkToken,
      receivedRedirectUri: null,
      onSuccess: (_, metadata) => {
        setFetchingUpdatedStatus(true);
        onSuccess(metadata.public_token, metadata.accounts[0]?.name).catch(() => {
          messages.error({ title: i18n.t('Something went wrong') });
          setFetchingUpdatedStatus(false);
        });
      },
      onExit: (err, metadata) => {
        // eslint-disable-next-line no-console
        console.log(metadata);
        if (err?.error_code === 'TOO_MANY_PLAID_VERIFICATION_ATTEMPTS') {
          removeAccount();
        }
      },
      onLoad: () => {
        setInit(false);
        if (verifyOnLoad) instance.open();
      },
    });
    return instance;
  });

  return { loading: isLoading, hasError, handler };
}
