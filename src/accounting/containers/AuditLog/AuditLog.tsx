import { createSignal } from 'solid-js';
import { Text } from 'solid-i18n';

import { getAuditLogs } from 'accounting/services';
import { useResource } from '_common/utils/useResource';
import { SyncLogTable } from 'accounting/components/SyncLogTable';
import { TransactionPreview } from 'transactions/containers/TransactionPreview';
import { Drawer } from '_common/components/Drawer';
import type { AccountActivityResponse } from 'generated/capital';
import { getActivityById } from 'app/services/activity';

const DEFAULT_LOG_LIMIT = 10; // TODO: Update this default value when we add pagination.

export function AuditLog() {
  const [auditLogs] = useResource(getAuditLogs, DEFAULT_LOG_LIMIT);

  const [transactionPreviewOpen, setTransactionPreviewOpen] = createSignal<boolean>(false);
  const [transaction, setTransaction] = createSignal<AccountActivityResponse>();

  const onViewTransactionDetails = async (transactionId: string) => {
    await getActivityById(transactionId).then((response: AccountActivityResponse) => {
      setTransaction(response);
      setTransactionPreviewOpen(true);
    });
  };

  return (
    <div>
      <SyncLogTable auditLogs={auditLogs()} onViewTransactionDetails={onViewTransactionDetails} />
      <Drawer
        noPadding
        open={transactionPreviewOpen()}
        title={<Text message="Transaction Details" />}
        onClose={() => {
          setTransactionPreviewOpen(false);
        }}
      >
        <TransactionPreview
          transaction={transaction()!}
          onUpdate={() => {
            return null;
          }}
          showAccountingAdminView={true}
          onReport={() => {
            return null;
          }}
          editingDisabled={true}
        />
      </Drawer>
    </div>
  );
}
