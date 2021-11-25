import { Show } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import { getNoop } from '_common/utils/getNoop';
import { InputSearch } from '_common/components/InputSearch';
import { Icon } from '_common/components/Icon';
import { Button } from '_common/components/Button';
import { Pagination } from '_common/components/Pagination';
import { Table, TableColumn } from '_common/components/Table';
import { Tag } from '_common/components/Tag';
import { Filters } from 'app/components/Filters';
import { Empty } from 'app/components/Empty';
import { changeRequestPage } from 'app/utils/changeRequestPage';
import type { UUIDString } from 'app/types/common';
import { formatName } from 'employees/utils/formatName';

import { CardIcon } from '../CardIcon';
import { formatCardNumber } from '../../utils/formatCardNumber';
import type { SearchCard, SearchCardResponse } from '../../types';
import { CardStatus } from '../../types';

import css from './CardsTable.css';

interface CardsTableProps {
  data: SearchCardResponse;
  hideColumns?: readonly string[];
  onSearch: (value: string) => void;
  onUserClick?: (id: UUIDString) => void;
  onCardClick: (id: UUIDString) => void;
}

export function CardsTable(props: Readonly<CardsTableProps>) {
  const i18n = useI18n();

  const columns: readonly Readonly<TableColumn<SearchCard>>[] = [
    {
      name: 'number',
      title: 'Card Number',
      class: css.number,
      render: (item) => (
        <div class={css.card}>
          <CardIcon />
          <div>
            {formatCardNumber(item.cardNumber)}
            <span class={css.type}>[Card type]</span>
          </div>
        </div>
      ),
      onClick: (item) => props.onCardClick(item.cardId),
    },
    {
      name: 'name',
      title: 'Employee',
      class: css.name,
      render: (item) => formatName(item.user),
      onClick: (item) => props.onUserClick?.(item.user.userId),
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
        <InputSearch
          delay={400}
          placeholder={i18n.t('Search cards...') as string}
          class={css.search}
          onSearch={props.onSearch}
        />
        <Button inverse icon={{ name: 'filters', pos: 'right' }}>
          <Text message="Filters" />
        </Button>
        <Button icon={{ name: 'download', pos: 'right' }}>
          <Text message="Export" />
        </Button>
      </Filters>
      <Show when={props.data.content.length} fallback={<Empty message={<Text message="There are no cards" />} />}>
        <Table
          columns={columns.filter((col) => !props.hideColumns || !props.hideColumns.includes(col.name))}
          data={props.data.content}
        />
      </Show>
    </div>
  );
}
