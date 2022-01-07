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
import { MultiSelect, Option } from '_common/components/MultiSelect';
import { useAllocations } from 'allocations/stores/allocations';
import { Checkbox } from '_common/components/Checkbox';

import { formatName } from '../../utils/formatName';

import css from './EmployeesTable.css';

interface EmployeesTableProps {
  data: PagedDataUserPageData;
  onClick: (uid: string) => void;
  onCardClick: (id: string) => void;
  onChangeParams: StoreSetter<Readonly<SearchUserRequest>>;
}

export function EmployeesTable(props: Readonly<EmployeesTableProps>) {
  const i18n = useI18n();
  const [filterPanelOpen, setFilterPanelOpen] = createSignal<boolean>(false);
  const [options, setOptions] = createSignal<{ value: string; text: string }[]>([]);

  const [allocationFilterValue, setAllocationFilterValue] = createSignal<string[]>([]);
  const [hasVirtualCard, setHasVirtualCard] = createSignal<boolean>(false);
  const [hasPhysicalCard, setHasPhysicalCard] = createSignal<boolean>(false);
  const [withoutCard, setWithoutCard] = createSignal<boolean>(false);

  useAllocations({
    initValue: [],
    onSuccess: (data) => {
      setOptions(
        data.map((allocation) => {
          return {
            value: allocation.allocationId,
            ['text']: allocation.name,
          };
        }),
      );
    },
  });

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
        allocations: allocationFilterValue().length > 0 ? allocationFilterValue() : undefined,
        hasPhysicalCard: hasPhysicalCard() ? true : undefined,
        hasVirtualCard: hasVirtualCard() ? true : undefined,
        withoutCard: withoutCard() ? true : undefined,
        pageRequest: withoutCard() ? undefined : prevParams.pageRequest,
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
        <Button view="ghost" icon={{ name: 'filters', pos: 'right' }} onClick={() => setFilterPanelOpen(true)}>
          Filters
        </Button>
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
        <div class={css.sideBarFilters}>
          <section>
            <div class={css.sectionTitle}>Allocations</div>
            <MultiSelect
              value={allocationFilterValue()}
              onChange={setAllocationFilterValue}
              valueRender={(v) => options().find((o) => o.value === v)?.text}
            >
              <For each={options()}>
                {(o: { value: string; text: string }) => {
                  return <Option value={o.value}>{o.text}</Option>;
                }}
              </For>
            </MultiSelect>
          </section>
          <section>
            <div class={css.sectionTitle}>Card Type</div>
            <Checkbox checked={hasVirtualCard()} onChange={setHasVirtualCard}>
              <Text message="Has virtual card" />
            </Checkbox>
            <Checkbox checked={hasPhysicalCard()} onChange={setHasPhysicalCard}>
              <Text message="Has physical card" />
            </Checkbox>
            <Checkbox checked={withoutCard()} onChange={setWithoutCard}>
              <Text message="Does not have any cards" />
            </Checkbox>
          </section>
        </div>
        <div class={css.controls}>
          <Button wide type="default" onClick={() => applyFilters()}>
            <Text message="Reset" />
          </Button>
          <Button wide type="primary" onClick={() => applyFilters()}>
            <Text message="Confirm" />
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
