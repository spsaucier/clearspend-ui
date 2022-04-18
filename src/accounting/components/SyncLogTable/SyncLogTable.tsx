import type { PagedDataSyncLogResponse, SyncLogResponse } from 'generated/capital';
import { Table, TableColumn } from '_common/components/Table';

interface SyncLogTableProps {
  syncLogs: Readonly<PagedDataSyncLogResponse> | null;
}

export function SyncLogTable(props: SyncLogTableProps) {
  const columns: readonly Readonly<TableColumn<SyncLogResponse>>[] = [
    {
      name: 'startTime',
      title: 'Time Started',
      render: (item) => new Date(item.startTime!).toTimeString(),
    },
    {
      name: 'firstName',
      title: 'First Name',
      render: (item) => item.firstName,
    },
    {
      name: 'lastName',
      title: 'Last Name',
      render: (item) => item.lastName,
    },
    {
      name: 'status',
      title: 'Status',
      render: (item) => item.status,
    },
  ];
  return <div>{props.syncLogs && <Table columns={columns} data={props.syncLogs.content!}></Table>}</div>;
}
