import { useNavigate } from 'solid-app-router';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import { getNoop } from '_common/utils/getNoop';
import { Input } from '_common/components/Input';
import { Icon } from '_common/components/Icon';
import { Button } from '_common/components/Button';
import { Pagination } from '_common/components/Pagination';
import { Table, TableColumn } from '_common/components/Table';
import { Tag } from '_common/components/Tag';
import { Filters } from 'app/components/Filters';
import { changeRequestPage } from 'app/utils/changeRequestPage';
import { formatName } from 'employees/utils/formatName';

import { formatCardNumber } from '../../utils/formatCardNumber';
import type { SearchCard, SearchCardResponse } from '../../types';
import { CardStatus } from '../../types';

import css from './CardsTable.css';

interface CardsTableProps {
  data: SearchCardResponse;
  hideColumns?: readonly string[];
}

export function CardsTable(props: Readonly<CardsTableProps>) {
  const navigate = useNavigate();

  const columns: readonly Readonly<TableColumn<SearchCard>>[] = [
    {
      name: 'number',
      title: 'Card Number',
      render: (item) => <span class={css.number}>{formatCardNumber(item.cardNumber)}</span>,
      onClick: (item) => navigate(`/cards/view/${item.cardId}`),
    },
    {
      name: 'name',
      title: 'Employee',
      render: (item) => <span class={css.name}>{formatName(item.user)}</span>,
    },
    {
      name: 'allocation',
      title: 'Allocation',
      render: (item) => <span>{item.allocation.name}</span>,
    },
    {
      name: 'balance',
      title: 'Balance',
      render: (item) => (
        <div>
          <strong>{formatCurrency(item.balance.amount)}</strong>
          <div>[Limit]</div>
        </div>
      ),
    },
    {
      name: 'status',
      title: 'Status',
      render: (item) => (
        <Tag type={item.cardStatus === CardStatus.OPEN ? 'success' : 'danger'}>
          <Icon name="freeze" size="xs" />
          <span>{item.cardStatus.toLowerCase()}</span>
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <Filters
        side={
          <Pagination
            current={props.data.pageNumber}
            pageSize={props.data.pageSize}
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
