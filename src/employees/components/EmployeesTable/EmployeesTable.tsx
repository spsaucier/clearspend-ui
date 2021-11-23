import { useI18n, Text } from 'solid-i18n';

import { Input } from '_common/components/Input';
import { Icon } from '_common/components/Icon';
import { Button } from '_common/components/Button';
import { Pagination } from '_common/components/Pagination';
import { Table, TableColumn } from '_common/components/Table';
import type { StoreSetter } from '_common/utils/store';
import { Filters } from 'app/components/Filters';
import { changeRequestPage } from 'app/utils/changeRequestPage';

import { formatName } from '../../utils/formatName';
import type { User, SearchUserResponse, SearchUserRequest } from '../../types';

import css from './EmployeesTable.css';

interface EmployeesTableProps {
  data: SearchUserResponse;
  onClick: (uid: User['userId']) => void;
  onChangeParams: StoreSetter<Readonly<SearchUserRequest>>;
}

export function EmployeesTable(props: Readonly<EmployeesTableProps>) {
  const i18n = useI18n();

  const columns: readonly Readonly<TableColumn<User>>[] = [
    {
      name: 'name',
      title: <Text message="Employee" />,
      render: (item) => (
        <span class={css.name} onClick={() => props.onClick(item.userId)}>
          {formatName(item)}
        </span>
      ),
    },
    {
      name: 'card',
      title: <Text message="Card Info" />,
      render: () => <span>[card]</span>,
    },
    {
      name: 'email',
      title: <Text message="Email Address" />,
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
          placeholder={i18n.t('Search employees...') as string}
          suffix={<Icon name="search" size="sm" />}
          class={css.search}
        />
        <Button icon={{ name: 'download', pos: 'right' }}>
          <Text message="Export" />
        </Button>
      </Filters>
      <Table columns={columns} data={props.data.content} />
    </div>
  );
}
