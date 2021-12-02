import { Show } from 'solid-js';
import type { Setter } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import type { StoreSetter } from '_common/utils/store';
import { InputSearch } from '_common/components/InputSearch';
import { Icon } from '_common/components/Icon';
import { Button } from '_common/components/Button';
import { Pagination } from '_common/components/Pagination';
import { Table, TableColumn } from '_common/components/Table';
import { Tag } from '_common/components/Tag';
import { changeRequestSearch } from 'app/utils/changeRequestSearch';
import { Filters } from 'app/components/Filters';
import { Empty } from 'app/components/Empty';
import { changeRequestPage } from 'app/utils/changeRequestPage';
import type { UUIDString } from 'app/types/common';
import { formatName } from 'employees/utils/formatName';

import { CardIcon } from '../CardIcon';
import { CardType } from '../CardType';
import { formatCardNumber } from '../../utils/formatCardNumber';
import type { SearchCard, SearchCardResponse, SearchCardRequest } from '../../types';
import { CardStatus } from '../../types';

import css from './CardsTable.css';

interface CardsTableProps {
  search?: string;
  data: SearchCardResponse;
  hideColumns?: readonly string[];
  onUserClick?: (id: UUIDString) => void;
  onCardClick: (id: UUIDString) => void;
  onChangeParams: Setter<Readonly<SearchCardRequest>> | StoreSetter<Readonly<SearchCardRequest>>;
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
          <CardIcon type={item.cardType} />
          <div>
            {formatCardNumber(item.cardNumber)}
            <CardType type={item.cardType} class={css.type} />
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
            onChange={changeRequestPage(props.onChangeParams)}
          />
        }
      >
        <InputSearch
          delay={400}
          value={props.search}
          placeholder={i18n.t('Search cards...') as string}
          class={css.search}
          onSearch={changeRequestSearch(props.onChangeParams)}
        />
        <Button view="ghost" icon={{ name: 'filters', pos: 'right' }}>
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
