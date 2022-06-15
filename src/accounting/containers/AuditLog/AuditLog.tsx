import { createSignal, Match, Switch } from 'solid-js';
import { Text } from 'solid-i18n';

import { getAuditLogs } from 'accounting/services';
import { useResource } from '_common/utils/useResource';
import { SyncLogTable } from 'accounting/components/SyncLogTable';
import { TransactionPreview } from 'transactions/containers/TransactionPreview';
import { Drawer } from '_common/components/Drawer';
import type { AccountActivityResponse, AuditLogDisplayValue } from 'generated/capital';
import { getActivityById } from 'app/services/activity';
import { TransactionGroupPreview } from 'transactions/containers/TransactionPreview/TransactionGroupPreview/TransactionGroupPreview';
import { useMessages } from 'app/containers/Messages/context';
import { i18n } from '_common/api/intl';

const DEFAULT_LOG_LIMIT = 10; // TODO: Update this default value when we add pagination.

export function AuditLog() {
  const [auditLogs] = useResource(getAuditLogs, DEFAULT_LOG_LIMIT);
  const messages = useMessages();

  const [transactionPreviewOpen, setTransactionPreviewOpen] = createSignal<boolean>(false);
  const [transactions, setTransactions] = createSignal<AccountActivityResponse[]>([]);
  const [auditLogDisplayDetails, setAuditLogDisplayDetails] = createSignal<AuditLogDisplayValue>();

  const onViewTransactionDetails = async (auditLogDisplayValue: AuditLogDisplayValue) => {
    try {
      const transactionIds = auditLogDisplayValue.groupSyncActivityIds
        ? auditLogDisplayValue.groupSyncActivityIds
        : [auditLogDisplayValue.transactionId!];

      const activity: AccountActivityResponse[] = await Promise.all(transactionIds.map((t) => getActivityById(t)));

      setAuditLogDisplayDetails(auditLogDisplayValue);
      setTransactions(activity);
      setTransactionPreviewOpen(true);
    } catch (e: unknown) {
      // eslint-disable-next-line no-console
      console.error(e);
      messages.error({ title: i18n.t('Something went wrong') });
    }
  };

  return (
    <div>
      <SyncLogTable auditLogs={auditLogs()} onViewTransactionDetails={onViewTransactionDetails} />
      <Drawer
        noPadding
        open={transactionPreviewOpen()}
        title={transactions().length > 1 ? <Text message="Sync Details" /> : <Text message="Transaction Details" />}
        onClose={() => {
          setTransactionPreviewOpen(false);
        }}
      >
        <Switch>
          <Match when={transactions().length === 1}>
            <TransactionPreview
              transaction={transactions()[0]!}
              onUpdate={() => {
                return null;
              }}
              showAccountingAdminView={true}
              onReport={() => {
                return null;
              }}
              editingDisabled={true}
            />
          </Match>
          <Match when={transactions().length > 1}>
            <TransactionGroupPreview
              transactions={transactions()}
              auditLogDisplayDetails={auditLogDisplayDetails()}
              onViewSingleTransaction={(t) => setTransactions([t])}
            />
          </Match>
        </Switch>
      </Drawer>
    </div>
  );
}
