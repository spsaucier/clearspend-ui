import { getAuditLogs } from 'accounting/services';
import { useResource } from '_common/utils/useResource';
import { SyncLogTable } from 'accounting/components/SyncLogTable';

const DEFAULT_LOG_LIMIT = 10; // TODO: Update this default value when we add pagination.

export function AuditLog() {
  const [auditLogs] = useResource(getAuditLogs, DEFAULT_LOG_LIMIT);
  return (
    <div>
      <SyncLogTable auditLogs={auditLogs()} />
    </div>
  );
}
