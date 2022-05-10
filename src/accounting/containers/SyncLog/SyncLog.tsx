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
      <SyncLogTable syncLogs={syncLogs()} />
    </div>
  );
}
