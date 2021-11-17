import { getNoop } from '_common/utils/getNoop';
import { Input } from '_common/components/Input';
import { Icon } from '_common/components/Icon';
import { Button } from '_common/components/Button';
import { Pagination } from '_common/components/Pagination';
import { Table, TableColumn } from '_common/components/Table';
import { Tag } from '_common/components/Tag';
import { Filters } from 'app/components/Filters';
import { changeRequestPage } from 'app/utils/changeRequestPage';

import type { Card, SearchCardResponse } from '../../types';

import css from './CardsTable.css';

interface CardsTableProps {
  data: SearchCardResponse;
  hideColumns?: readonly string[];
}

export function CardsTable(props: Readonly<CardsTableProps>) {
  const columns: readonly Readonly<TableColumn<Card>>[] = [
    {
      name: 'number',
      title: 'Card Number',
      render: (item) => <span class={css.number}>•••• {item.lastFour}</span>,
    },
    {
      name: 'name',
      title: 'Employee',
      render: () => <span class={css.name}>[User Name]</span>,
    },
    {
      name: 'allocation',
      title: 'Allocation',
      render: () => <span>[Allocation]</span>,
    },
    {
      name: 'balance',
      title: 'Balance',
      render: () => (
        <div>
          <strong>[Balance]</strong>
          <div>[Limit]</div>
        </div>
      ),
    },
    {
      name: 'status',
      title: 'Status',
      render: () => (
        <Tag type="success">
          <Icon name="freeze" size="xs" />
          <span>Active</span>
        </Tag>
      ),
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
            onChange={changeRequestPage(getNoop)}
          />
        }
      >
        <Input disabled placeholder="Search cards..." suffix={<Icon name="search" size="sm" />} class={css.search} />
        <Button inverse icon={{ name: 'filters', pos: 'right' }}>
          Filters
        </Button>
        <Button icon={{ name: 'download', pos: 'right' }}>Export</Button>
      </Filters>
      <Table
        columns={columns.filter((col) => !props.hideColumns || !props.hideColumns.includes(col.name))}
        data={props.data.content}
      />
    </div>
  );
}
