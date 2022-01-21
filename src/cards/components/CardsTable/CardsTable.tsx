import { Show } from 'solid-js';
import type { Setter } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import type { StoreSetter } from '_common/utils/store';
import { getNoop } from '_common/utils/getNoop';
import { InputSearch } from '_common/components/InputSearch';
import { Button } from '_common/components/Button';
import { Pagination } from '_common/components/Pagination';
import { Table, TableColumn } from '_common/components/Table';
import { changeRequestSearch } from 'app/utils/changeRequestSearch';
import { Filters } from 'app/components/Filters';
import { FiltersButton } from 'app/components/FiltersButton';
import { Empty } from 'app/components/Empty';
import { changeRequestPage } from 'app/utils/changeRequestPage';
import { formatName } from 'employees/utils/formatName';
import type { PagedDataSearchCardData, SearchCardData, SearchCardRequest } from 'generated/capital';

import { CardIcon } from '../CardIcon';
import { CardType } from '../CardType';
import { CardStatus } from '../CardStatus';
import { formatCardNumber } from '../../utils/formatCardNumber';
import type { CardType as CardTypeType } from '../../types';

import css from './CardsTable.css';

interface CardsTableProps {
  search?: string;
  data: PagedDataSearchCardData;
  hideColumns?: readonly string[];
  onUserClick?: (id: string) => void;
  onCardClick: (id: string) => void;
  onFiltersClick: () => void;
  onChangeParams: Setter<Readonly<SearchCardRequest>> | StoreSetter<Readonly<SearchCardRequest>>;
}

export function CardsTable(props: Readonly<CardsTableProps>) {
  const i18n = useI18n();

  const columns: readonly Readonly<TableColumn<SearchCardData>>[] = [
    {
      name: 'number',
      title: 'Card Number',
      class: css.number,
      render: (item) => (
        <div class={css.card}>
          <CardIcon type={item.cardType as CardTypeType} />
          <div>
            {formatCardNumber(item.cardNumber)}
            <CardType type={item.cardType as CardTypeType} class={css.type} />
          </div>
        </div>
      ),
      onClick: (item) => props.onCardClick(item.cardId!),
    },
    {
      name: 'name',
      title: 'Employee',
      class: css.name,
      render: (item) => formatName(item.user),
      onClick: (item) => props.onUserClick?.(item.user?.userId!),
    },
    {
      name: 'allocation',
      title: 'Allocation',
      render: (item) => <span>{item.allocation?.name}</span>,
    },
    {
      name: 'balance',
      title: 'Balance',
      render: (item) => (
        <div>
          <strong>{formatCurrency(item.balance?.amount || 0)}</strong>
          <div>[Limit]</div>
        </div>
      ),
    },
    {
      name: 'status',
      title: 'Status',
      // TODO: get activated value from server data (waiting for API updates)
      render: (item) => <CardStatus status={item.cardStatus!} activated={true} />,
    },
  ];

  return (
    <div>
      <Filters
        side={
          <Pagination
            current={props.data.pageNumber || 0}
            pageSize={props.data.pageSize || 0}
            total={props.data.totalElements || 0}
            onChange={changeRequestPage(props.onChangeParams)}
          />
        }
      >
        <InputSearch
          delay={400}
          value={props.search}
          placeholder={String(i18n.t('Search cards...'))}
          class={css.search}
          onSearch={changeRequestSearch(props.onChangeParams)}
        />
        <FiltersButton count={0} onReset={getNoop()} onClick={props.onFiltersClick} />
        <Button icon={{ name: 'download', pos: 'right' }}>
          <Text message="Export" />
        </Button>
      </Filters>
      <Show when={props.data.content?.length} fallback={<Empty message={<Text message="There are no cards" />} />}>
        <Table
          columns={columns.filter((col) => !props.hideColumns || !props.hideColumns.includes(col.name))}
          data={props.data.content || []}
        />
      </Show>
    </div>
  );
}
