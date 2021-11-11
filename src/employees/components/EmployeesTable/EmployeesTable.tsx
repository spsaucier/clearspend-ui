import { Table, TableColumn } from '_common/components/Table';

import { formatName } from '../../utils/formatName';
import type { BaseUser } from '../../types';

import css from './EmployeesTable.css';

interface EmployeesTableProps {
  items: readonly Readonly<BaseUser>[];
  onClick: (uid: BaseUser['userId']) => void;
}

export function EmployeesTable(props: Readonly<EmployeesTableProps>) {
  const columns: readonly Readonly<TableColumn<BaseUser>>[] = [
    {
      name: 'name',
      title: 'Employee',
      render: (item) => (
        <span class={css.name} onClick={() => props.onClick(item.userId)}>
          {formatName(item)}
        </span>
      ),
    },
    {
      name: 'card',
      title: 'Card Info',
      render: () => <span>[card]</span>,
    },
    {
      name: 'email',
      title: 'Email Address',
      render: () => <span>[email]</span>,
    },
  ];

  return (
    <div>
      <Table columns={columns} data={props.items} />
    </div>
  );
}
