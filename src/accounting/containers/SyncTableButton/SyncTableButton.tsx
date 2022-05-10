import { createMemo, createSignal, Switch, Match } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { useResource } from '_common/utils/useResource';
import { Button } from '_common/components/Button';
import { Confirm } from '_common/components/Confirm';
import { useMessages } from 'app/containers/Messages/context';
import type { AccountActivityResponse } from 'generated/capital';

import { getSyncTransactionCount, syncAllTransactions, syncMultipleTransactions } from '../../services';

import css from './SyncTableButton.css';

interface SyncTableButtonProps {
  selectedIds: string[];
  transactions: readonly Readonly<AccountActivityResponse>[];
  onResetSelection: () => void;
  onReloadTransactions: () => Promise<unknown>;
}

export function SyncTableButton(props: Readonly<SyncTableButtonProps>) {
  const i18n = useI18n();
  const messages = useMessages();

  const [syncing, setSyncing] = createSignal(false);
  const [syncCount, , , , reloadSyncCount] = useResource(getSyncTransactionCount);

  const count = createMemo<number>(() => props.selectedIds.length || syncCount()?.count || 0);

  const canSync = createMemo<boolean>(
    () => Boolean(props.selectedIds.length) || props.transactions.some((t) => t.syncStatus === 'READY'),
  );

  const syncSelected = async () => {
    setSyncing(true);
    try {
      await syncMultipleTransactions(props.selectedIds);
      await reloadSyncCount();
      await props.onReloadTransactions();
      props.onResetSelection();
    } catch (error: unknown) {
      messages.error({ title: i18n.t('Something went wrong') });
    }
    setSyncing(false);
  };

  const syncAll = async () => {
    setSyncing(true);
    try {
      await syncAllTransactions();
      await reloadSyncCount();
      await props.onReloadTransactions();
    } catch (error: unknown) {
      messages.error({ title: i18n.t('Something went wrong') });
    }
    setSyncing(false);
  };

  return (
    <Confirm
      position="bottom-center"
      question={
        <>
          <Text
            message="Sync {count, plural, one {transaction} other {transactions}}?"
            count={count()}
            class={css.question!}
          />
          <Text
            message="You have {count} {count, plural, one {transaction} other {transactions}} ready to sync."
            count={count()}
          />
        </>
      }
      confirmIcon={null}
      confirmType="primary"
      confirmView="default"
      confirmText={<Text message="Yes, sync {count, plural, one {transaction} other {transactions}}" count={count()} />}
      onConfirm={Boolean(props.selectedIds.length) ? syncSelected : syncAll}
    >
      {({ onClick }) => (
        <Button
          type="primary"
          loading={syncing()}
          disabled={!canSync()}
          icon={{ name: 'sync', pos: 'right' }}
          onClick={onClick}
        >
          <Switch fallback={<Text message="Sync all ready transactions" />}>
            <Match when={syncing()}>
              <Text message="Sync in progress" />
            </Match>
            <Match when={props.selectedIds.length}>
              {(selected) => (
                <Text message="Sync {count} {count, plural, one {transaction} other {transactions}}" count={selected} />
              )}
            </Match>
          </Switch>
        </Button>
      )}
    </Confirm>
  );
}
