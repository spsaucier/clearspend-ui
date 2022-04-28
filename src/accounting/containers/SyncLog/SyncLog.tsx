import { Text } from 'solid-i18n';

import { getSyncLogs } from 'accounting/services';
import { useResource } from '_common/utils/useResource';
import { DEFAULT_PAGE_REQUEST } from 'app/constants/common';
import { SyncLogTable } from 'accounting/components/SyncLogTable';

export function SyncLog() {
  const [syncLogs] = useResource(getSyncLogs, {
    pageRequest: { ...DEFAULT_PAGE_REQUEST },
  });
  return (
    <div>
      <Text message="Audit Log" />
      <SyncLogTable syncLogs={syncLogs()} />
    </div>
  );
}
