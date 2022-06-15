import { Text } from 'solid-i18n';
import { Show } from 'solid-js';

import { Table, TableColumn } from '_common/components/Table';
import type { AuditLogDisplayValue } from 'generated/capital';
import { formatAMPM } from 'accounting/pages/AccountingTabs/utils';

import css from './AuditLogTable.css';

interface AuditLogTableProps {
  auditLogs: Readonly<AuditLogDisplayValue[]> | null;
  onViewTransactionDetails: (auditLogDisplayValue: AuditLogDisplayValue) => void;
}

export function AuditLogTable(props: AuditLogTableProps) {
  const columns: readonly Readonly<TableColumn<AuditLogDisplayValue>>[] = [
    {
      name: 'time',
      title: 'Date & Time',
      render: (item) => renderFormattedDate(item.auditTime),
    },
    {
      name: 'user',
      title: 'User',
      render: (item) => renderFormattedUser(item),
    },
    {
      name: 'event',
      title: 'Event',
      render: (item) => item.eventType,
    },
    {
      name: 'details',
      title: 'Details',
      render: (item) => (
        <div
          class={css.linkText}
          onClick={() => {
            props.onViewTransactionDetails(item);
          }}
        >
          <Show when={item.groupSyncActivityIds}>
            <Text message="View Transactions" />
          </Show>
          <Show when={!item.groupSyncActivityIds}>
            <Text message="View Transaction" />
          </Show>
        </div>
      ),
    },
  ];
  return <div>{props.auditLogs && <Table columns={columns} data={props.auditLogs}></Table>}</div>;
}

export const renderFormattedUser = (log: AuditLogDisplayValue) => {
  return (
    <div class={css.detailContainer}>
      <div class={css.linkText}>
        <Text message={`${log.firstName} ${log.lastName}`} />
      </div>
      <div class={css.subtext}>
        <Text message={`${log.email}`} />
      </div>
    </div>
  );
};

export const renderFormattedDate = (datestring: string | undefined, excludeTime?: boolean, excludeDate?: boolean) => {
  if (datestring === undefined) {
    return <></>;
  }
  const date = new Date(datestring);
  const formattedDate = date.toString().split(' ');
  const formattedAMPM = formatAMPM(date);
  return (
    <div class={css.detailContainer}>
      <Show when={!excludeDate}>
        <Text message={`${formattedDate[1]} ${formattedDate[2]}, ${formattedDate[3]}`} />
      </Show>
      <Show when={!excludeTime}>
        <div class={css.subtext}>
          <Text message={`${formattedAMPM}`} />
        </div>
      </Show>
    </div>
  );
};
