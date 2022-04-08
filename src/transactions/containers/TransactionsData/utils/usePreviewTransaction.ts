import { createSignal, createMemo, onMount, batch, type Accessor } from 'solid-js';
import { useI18n } from 'solid-i18n';
import { useSearchParams } from 'solid-app-router';

import { useMessages } from 'app/containers/Messages/context';
import type { AccountActivityResponse } from 'generated/capital';

export function usePreviewTransaction(
  transactions: Accessor<AccountActivityResponse[] | undefined>,
  fetchTransactions: (id: string) => Promise<Readonly<AccountActivityResponse>>,
) {
  const i18n = useI18n();
  const messages = useMessages();

  const [previewId, setPreviewId] = createSignal<string>();
  const [searchParams, setSearchParams] = useSearchParams<{ transaction?: string }>();
  const [cacheTransaction, setCacheTransaction] = createSignal<AccountActivityResponse>();

  onMount(() => {
    const activityId = searchParams.transaction;
    if (!activityId) return;

    if (transactions()?.some((item) => item.accountActivityId === activityId)) {
      setPreviewId(activityId);
      return;
    }

    fetchTransactions(activityId)
      .then((data) => {
        batch(() => {
          setCacheTransaction(data);
          setPreviewId(activityId);
        });
      })
      .catch(() => {
        messages.error({ title: String(i18n.t('Unable to fetch data for selected transaction.')) });
      });
  });

  const onChangePreviewId = (id?: string) => {
    batch(() => {
      setPreviewId(id);
      setSearchParams({ transaction: id });
      if (!id) setCacheTransaction(undefined);
    });
  };

  const previewTransaction = createMemo(() => {
    const id = previewId();
    const cache = cacheTransaction();

    return !cache || cache.accountActivityId !== id
      ? transactions()?.find((item) => item.accountActivityId === previewId())
      : cache;
  });

  return [previewId, previewTransaction, onChangePreviewId] as const;
}
