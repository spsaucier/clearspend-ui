import type { Setter } from 'solid-js';

import { Input } from '_common/components/Input';
import { Icon } from '_common/components/Icon';
import { Button } from '_common/components/Button';
import { Pagination } from '_common/components/Pagination';
import { Table, TableColumn } from '_common/components/Table';
import { Filters } from 'app/components/Filters';
import { changeRequestPage } from 'app/utils/changeRequestPage';

import { formatName } from '../../utils/formatName';
import type { User, SearchUserResponse, SearchUserRequest } from '../../types';

import css from './EmployeesTable.css';

interface EmployeesTableProps {
  data: SearchUserResponse;
  onClick: (uid: User['userId']) => void;
  onChangeParams: Setter<Readonly<SearchUserRequest>>;
}

export function EmployeesTable(props: Readonly<EmployeesTableProps>) {
  const columns: readonly Readonly<TableColumn<User>>[] = [
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
      render: (item) => <span>{item.email}</span>,
    },
  ];

  return (
    <div>
      <Filters
        side={
          <Pagination
            current={props.data.number}
            pageSize={props.data.size}
            total={props.data.totalElements}
            onChange={changeRequestPage(props.onChangeParams)}
          />
        }
      >
        <Input
          disabled
          placeholder="Search employees..."
          suffix={<Icon name="search" size="sm" />}
          class={css.search}
        />
        <Button icon={{ name: 'download', pos: 'right' }}>Export</Button>
      </Filters>
      <Table columns={columns} data={props.data.content} />
    </div>
  );
}