import { createSignal, createMemo, Show } from 'solid-js';
import type { Setter } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import { wrapAction } from '_common/utils/wrapAction';
import { download } from '_common/utils/download';
import type { StoreSetter } from '_common/utils/store';
import { InputSearch } from '_common/components/InputSearch';
import { Button } from '_common/components/Button';
import { Pagination } from '_common/components/Pagination';
import { Table, TableColumn } from '_common/components/Table';
import { changeRequestSearch } from 'app/utils/changeRequestSearch';
import { useMessages } from 'app/containers/Messages/context';
import { Filters } from 'app/components/Filters';
import { FiltersButton } from 'app/components/FiltersButton';
import { Empty } from 'app/components/Empty';
import { changeRequestPage } from 'app/utils/changeRequestPage';
import { getResetFilters } from 'app/utils/getResetFilters';
import { formatName } from 'employees/utils/formatName';
import type { PagedDataSearchCardData, SearchCardData, SearchCardRequest } from 'generated/capital';
import { Drawer } from '_common/components/Drawer';
import { CardsFilterDrawer } from 'cards/containers/CardsFilterDrawer';
import { formatCardNumber } from 'cards/utils/formatCardNumber';

import { CardIcon } from '../CardIcon';
import { CardType } from '../CardType';
import { CardStatus } from '../CardStatus';
import { exportCards } from '../../services';
import type { CardType as CardTypeType } from '../../types';

import css from './CardsTable.css';

const FILTERS_KEYS = ['allocationId', 'userId'] as const;

interface CardsTableProps {
  search?: string;
  data: PagedDataSearchCardData;
  params: Readonly<SearchCardRequest>;
  hideColumns?: readonly string[];
  onUserClick?: (id: string) => void;
  onCardClick: (id: string) => void;
  onChangeParams: Setter<Readonly<SearchCardRequest>> | StoreSetter<Readonly<SearchCardRequest>>;
}

export function CardsTable(props: Readonly<CardsTableProps>) {
  const i18n = useI18n();
  const messages = useMessages();

  const [exporting, exportData] = wrapAction(exportCards);
  const [filterPanelOpen, setFilterPanelOpen] = createSignal<boolean>(false);

  const columns: readonly Readonly<TableColumn<SearchCardData>>[] = [
    {
      name: 'number',
      title: 'Card Number',
      class: css.number,
      render: (item) => (
        <div class={css.card}>
          <CardIcon type={item.cardType as CardTypeType} />
          <div>
            {item.cardNumber && item.activated ? (
              formatCardNumber(item.cardNumber)
            ) : (
              <Text class={css.name!} message="Awaiting activation" />
            )}
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
          {/* TODO: <div>[Limit]</div> */}
        </div>
      ),
    },
    {
      name: 'status',
      title: 'Status',
      render: (item) => <CardStatus status={item.cardStatus!} activated={item.activated!} />,
    },
  ];

  const filtersCount = createMemo(() =>
    FILTERS_KEYS.reduce((sum, key) => sum + Number(props.params[key] !== undefined), 0),
  );

  const onResetFilters = () => {
    props.onChangeParams((prev) => ({ ...prev, ...getResetFilters(FILTERS_KEYS) }));
  };

  const onExport = () => {
    return exportData(props.params)
      .then((file) => download(file, 'cards.csv'))
      .catch(() => {
        messages.error({ title: i18n.t('Something went wrong') });
      });
  };

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
        <FiltersButton count={filtersCount()} onReset={onResetFilters} onClick={() => setFilterPanelOpen(true)} />
        <Button
          loading={exporting()}
          disabled={!props.data.content?.length}
          icon={{ name: 'download', pos: 'right' }}
          onClick={onExport}
        >
          <Text message="Export" />
        </Button>
      </Filters>
      <Show when={props.data.content?.length} fallback={<Empty message={<Text message="There are no cards" />} />}>
        <Table
          columns={columns.filter((col) => !props.hideColumns || !props.hideColumns.includes(col.name))}
          data={props.data.content || []}
        />
      </Show>

      <Drawer
        noPadding
        open={filterPanelOpen()}
        title={<Text message="Filter cards" />}
        onClose={() => setFilterPanelOpen(false)}
      >
        <CardsFilterDrawer
          params={props.params}
          hiddenFields={props.hideColumns}
          onReset={() => {
            setFilterPanelOpen(false);
            onResetFilters();
          }}
          onChangeParams={(params) => {
            setFilterPanelOpen(false);
            props.onChangeParams(params);
          }}
        />
      </Drawer>
    </div>
  );
}
