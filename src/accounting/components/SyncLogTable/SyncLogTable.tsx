import { Table, TableColumn } from '_common/components/Table';

import type { SyncLog, SyncLogResponse } from '../ChartOfAccountsData/types';

interface SyncLogTableProps {
  syncLogs: Readonly<SyncLogResponse> | null;
}

export function SyncLogTable(props: SyncLogTableProps) {
  const columns: readonly Readonly<TableColumn<SyncLog>>[] = [
    {
      name: 'startTime',
      title: 'Time Started',
      render: (item) => new Date(item.startTime).toTimeString(),
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
  return <div>{props.syncLogs && <Table columns={columns} data={props.syncLogs.content}></Table>}</div>;
}
