import { Text } from 'solid-i18n';

import { getSyncLogs } from 'accounting/services';
import { useResource } from '_common/utils/useResource';
import { SyncLogTable } from 'accounting/components/SyncLogTable';

export function SyncLog() {
  const [syncLogs] = useResource(getSyncLogs, {
    pageRequest: { pageNumber: 0, pageSize: 10 },
  });
  return (
    <div>
      <Text message="Sync Log" />
      <SyncLogTable syncLogs={syncLogs()} />
    </div>
  );
}
