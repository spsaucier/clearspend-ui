import { Show, For, createSignal, createMemo } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { Input } from '_common/components/Input';
import { Icon } from '_common/components/Icon';
import { Button } from '_common/components/Button';
import { Pagination } from '_common/components/Pagination';
import { Table, TableColumn } from '_common/components/Table';
import { download } from '_common/utils/download';
import { wrapAction } from '_common/utils/wrapAction';
import type { StoreSetter } from '_common/utils/store';
import { Filters } from 'app/components/Filters';
import { useMessages } from 'app/containers/Messages/context';
import { changeRequestPage } from 'app/utils/changeRequestPage';
import { getResetFilters } from 'app/utils/getResetFilters';
import { formatCardNumber } from 'cards/utils/formatCardNumber';
import type { PagedDataUserPageData, SearchUserRequest, UserPageData } from 'generated/capital';
import { Drawer } from '_common/components/Drawer';
import { Checkbox } from '_common/components/Checkbox';
import { FiltersButton } from 'app/components/FiltersButton';

import { formatName } from '../../utils/formatName';
import { exportUsers } from '../../services';
import { EmployeeFilterDrawer } from '../EmployeeFilterDrawer';

import css from './EmployeesTable.css';

const FILTERS_KEYS = ['allocations', 'hasVirtualCard', 'hasPhysicalCard', 'withoutCard'] as const;

interface EmployeesTableProps {
  data: PagedDataUserPageData;
  params: Readonly<SearchUserRequest>;
  onClick: (uid: string) => void;
  onCardClick: (id: string) => void;
  onChangeParams: StoreSetter<Readonly<SearchUserRequest>>;
}

export function EmployeesTable(props: Readonly<EmployeesTableProps>) {
  const i18n = useI18n();
  const messages = useMessages();

  const [exporting, exportData] = wrapAction(exportUsers);
  const [filterPanelOpen, setFilterPanelOpen] = createSignal<boolean>(false);
  const [includeArchived, setIncludeArchived] = createSignal<boolean>(!!props.params.includeArchived);

  const columns: readonly Readonly<TableColumn<UserPageData>>[] = [
    {
      name: 'name',
      title: <Text message="Employee" />,
      class: css.name,
      render: (item) => formatName(item.userData),
      onClick: (item) => props.onClick(item.userData?.userId || ''),
    },
    {
      name: 'cards',
      title: <Text message="Card Info" />,
      render: (item) => (
        <Show when={item.cardInfoList?.length} fallback={<Text message="No cards" />}>
          <For each={item.cardInfoList}>
            {(card) => (
              <div class={css.card} onClick={() => props.onCardClick(card.cardId!)}>
                {/* TODO need activated status */}
                <span class={css.cardNumber}>{formatCardNumber(card.lastFour, true)}</span>
                <span>{card.allocationName}</span>
              </div>
            )}
          </For>
        </Show>
      ),
    },
    {
      name: 'email',
      title: <Text message="Email Address" />,
      render: (item) => <span>{item.email}</span>,
    },
  ];

  const onExport = () => {
    return exportData(props.params)
      .then((file) => download(file, 'employees.csv'))
      .catch(() => {
        messages.error({ title: i18n.t('Something went wrong') });
      });
  };

  const filtersCount = createMemo(() =>
    FILTERS_KEYS.reduce((sum, key) => sum + Number(props.params[key] !== undefined), 0),
  );

  const resetFilters = () => {
    props.onChangeParams((prev) => ({ ...prev, ...getResetFilters(FILTERS_KEYS) }));
  };

  const applyFilters = () => {
    props.onChangeParams((prevParams) => {
      return {
        ...prevParams,
        includeArchived: includeArchived() ? true : undefined,
      };
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
        <Input
          disabled
          placeholder={String(i18n.t('Search employees...'))}
          suffix={<Icon name="search" size="sm" />}
          class={css.search}
        />
        <FiltersButton count={filtersCount()} onReset={resetFilters} onClick={() => setFilterPanelOpen(true)} />
        <Checkbox
          checked={includeArchived()}
          onChange={(checked) => {
            setIncludeArchived(checked);
            applyFilters();
          }}
        >
          <Text message="Show Archived" />
        </Checkbox>
        <Button
          loading={exporting()}
          disabled={!props.data.totalElements}
          icon={{ name: 'download', pos: 'right' }}
          onClick={onExport}
        >
          <Text message="Export" />
        </Button>
      </Filters>
      <Table columns={columns} data={props.data.content || []} />

      <Drawer
        noPadding
        open={filterPanelOpen()}
        title={<Text message="Filter Employees" />}
        onClose={() => setFilterPanelOpen(false)}
      >
        <EmployeeFilterDrawer
          params={props.params}
          onReset={() => {
            setFilterPanelOpen(false);
            resetFilters();
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
