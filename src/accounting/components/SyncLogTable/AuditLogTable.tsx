import { Text } from 'solid-i18n';

import { Table, TableColumn } from '_common/components/Table';
import type { AuditLogDisplayValue } from 'generated/capital';

import css from './AuditLogTable.css';

interface AuditLogTableProps {
  auditLogs: Readonly<AuditLogDisplayValue[]> | null;
}

export function AuditLogTable(props: AuditLogTableProps) {
  const formatDate = (datestring: string | undefined) => {
    if (datestring === undefined) {
      return <></>;
    }
    const date = new Date(datestring);
    const formattedDate = date.toString().split(' ');
    return (
      <div class={css.detailContainer}>
        <Text message={`${formattedDate[1]} ${formattedDate[2]}, ${formattedDate[3]}`} />
        <div class={css.subtext}>
          <Text message={`${formattedDate[4]}`} />
        </div>
      </div>
    );
  };

  const formatUser = (log: AuditLogDisplayValue) => {
    return (
      <div class={css.detailContainer}>
        <div class={css.accentText}>
          <Text message={`${log.firstName} ${log.lastName}`} />
        </div>
        <div class={css.subtext}>
          <Text message={`${log.email}`} />
        </div>
      </div>
    );
  };

  const columns: readonly Readonly<TableColumn<AuditLogDisplayValue>>[] = [
    {
      name: 'time',
      title: 'Date & Time',
      render: (item) => formatDate(item.auditTime),
    },
    {
      name: 'user',
      title: 'User',
      render: (item) => formatUser(item),
    },
    {
      name: 'event',
      title: 'Event',
      render: (item) => item.eventType,
    },
    {
      name: 'details',
      title: 'Details',
      render: () => (
        <div class={css.accentText}>
          <Text message="View Transaction" />
        </div>
      ),
    },
  ];
  return <div>{props.auditLogs && <Table columns={columns} data={props.auditLogs}></Table>}</div>;
}
