import { Show, For, createSignal } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { Input } from '_common/components/Input';
import { Icon } from '_common/components/Icon';
import { Button } from '_common/components/Button';
import { Pagination } from '_common/components/Pagination';
import { Table, TableColumn } from '_common/components/Table';
import type { StoreSetter } from '_common/utils/store';
import { Filters } from 'app/components/Filters';
import { changeRequestPage } from 'app/utils/changeRequestPage';
import { formatCardNumber } from 'cards/utils/formatCardNumber';
import type { PagedDataUserPageData, SearchUserRequest, UserPageData } from 'generated/capital';
import { Drawer } from '_common/components/Drawer';
import { Checkbox } from '_common/components/Checkbox';
import { FiltersButton } from 'app/components/FiltersButton';
import { getNoop } from '_common/utils/getNoop';

import { formatName } from '../../utils/formatName';
import { EmployeeFilterDrawer } from '../EmployeeFilterDrawer/EmployeeFilterDrawer';

import css from './EmployeesTable.css';

interface EmployeesTableProps {
  data: PagedDataUserPageData;
  onClick: (uid: string) => void;
  onCardClick: (id: string) => void;
  onChangeParams: StoreSetter<Readonly<SearchUserRequest>>;
  params: SearchUserRequest;
}

export function EmployeesTable(props: Readonly<EmployeesTableProps>) {
  const i18n = useI18n();
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
                <span class={css.cardNumber}>{formatCardNumber(card.lastFour)}</span>
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
        <FiltersButton count={0} onReset={getNoop()} onClick={() => setFilterPanelOpen(true)} />
        <Checkbox
          checked={includeArchived()}
          onChange={(checked) => {
            setIncludeArchived(checked);
            applyFilters();
          }}
        >
          <Text message="Show Archived" />
        </Checkbox>
        <Button icon={{ name: 'download', pos: 'right' }}>
          <Text message="Export" />
        </Button>
      </Filters>
      <Table columns={columns} data={props.data.content || []} />

      <Drawer
        open={filterPanelOpen()}
        title={<Text message="Filter Employees" />}
        onClose={() => setFilterPanelOpen(false)}
      >
        <EmployeeFilterDrawer onChangeParams={props.onChangeParams} params={props.params} />
      </Drawer>
    </div>
  );
}
