import { createSignal, createMemo, onMount, batch, type Accessor } from 'solid-js';
import { useI18n } from 'solid-i18n';
import { useSearchParams } from 'solid-app-router';

import { useMessages } from 'app/containers/Messages/context';

import type { ActivityType } from '../types';

import { isActivityType } from './isActivityType';

export function usePreviewTransaction<T extends { accountActivityId?: string; type?: ActivityType }>(
  transactions: Accessor<T[] | undefined>,
  fetchTransactions: (id: string) => Promise<Readonly<T>>,
) {
  const i18n = useI18n();
  const messages = useMessages();

  const [selectID, setSelectID] = createSignal<string>();
  const [searchParams, setSearchParams] = useSearchParams<{ transaction?: string }>();
  const [cacheTransaction, setCacheTransaction] = createSignal<T>();

  onMount(() => {
    const activityId = searchParams.transaction;
    if (!activityId) return;

    setID(activityId, true);
  });

  const setID = (id?: string, skipSearchParams?: boolean) => {
    batch(() => {
      if (!skipSearchParams) setSearchParams({ transaction: id });
      setSelectID(id);
      if (!id) {
        setCacheTransaction(undefined);
        return;
      }
      fetchTransactions(id)
        .then((data) => {
          batch(() => {
            setCacheTransaction(() => data);
          });
        })
        .catch(() => {
          if (!cacheTransaction()) {
            messages.error({ title: String(i18n.t('Unable to fetch data for selected transaction.')) });
          }
        });
    });
  };

  const transaction = createMemo(() => {
    const id = selectID();
    const cache = cacheTransaction();

    return !cache || cache.accountActivityId !== id
      ? transactions()?.find((item) => item.accountActivityId === id)
      : cache;
  });

  const isActivity = createMemo<boolean | undefined>(() => {
    const item = transaction();
    return item && isActivityType(item.type);
  });

  return { id: selectID, transaction, isActivity, setID };
}
