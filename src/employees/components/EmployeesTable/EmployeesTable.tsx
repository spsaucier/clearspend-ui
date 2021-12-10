import { Show, For } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { Input } from '_common/components/Input';
import { Icon } from '_common/components/Icon';
import { Button } from '_common/components/Button';
import { Pagination } from '_common/components/Pagination';
import { Table, TableColumn } from '_common/components/Table';
import type { StoreSetter } from '_common/utils/store';
import { Filters } from 'app/components/Filters';
import { changeRequestPage } from 'app/utils/changeRequestPage';
import type { UUIDString } from 'app/types/common';
import { formatCardNumber } from 'cards/utils/formatCardNumber';
import type { CardInfo, PagedDataUserPageData, SearchUserRequest, UserPageData } from 'generated/capital';

import { formatName } from '../../utils/formatName';

import css from './EmployeesTable.css';

function getUniqueAllocations(items: readonly Readonly<CardInfo>[]): readonly Readonly<CardInfo>[] {
  return items.filter(
    (card, idx, self) => self.findIndex((item) => item.allocationName === card.allocationName) === idx,
  );
}

interface EmployeesTableProps {
  data: PagedDataUserPageData;
  onClick: (uid: UUIDString) => void;
  onCardClick: (id: UUIDString) => void;
  onChangeParams: StoreSetter<Readonly<SearchUserRequest>>;
}

export function EmployeesTable(props: Readonly<EmployeesTableProps>) {
  const i18n = useI18n();

  const columns: readonly Readonly<TableColumn<UserPageData>>[] = [
    {
      name: 'name',
      title: <Text message="Employee" />,
      class: css.name,
      render: (item) => formatName(item.userData),
      onClick: (item) => props.onClick(item.userData?.userId || '' as UUIDString),
    },
    {
      name: 'cards',
      title: <Text message="Cards" />,
      render: (item) => (
        <Show when={item.cardInfoList?.length} fallback={<Text message="No cards" />}>
          <For each={item.cardInfoList}>
            {(card) => (
              <div class={css.card} onClick={() => props.onCardClick(card.cardId as UUIDString)}>
                {formatCardNumber(card.lastFour)}
              </div>
            )}
          </For>
        </Show>
      ),
    },
    {
      name: 'allocations',
      title: <Text message="Allocations" />,
      render: (item) => (
        <Show when={item.cardInfoList?.length} fallback={<Text message="No allocations" />}>
          <For each={getUniqueAllocations(item.cardInfoList as [])}>
            {(card) => <div class={css.allocation}>{card.allocationName}</div>}
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
          placeholder={i18n.t('Search employees...') as string}
          suffix={<Icon name="search" size="sm" />}
          class={css.search}
        />
        <Button icon={{ name: 'download', pos: 'right' }}>
          <Text message="Export" />
        </Button>
      </Filters>
      <Table columns={columns} data={props.data.content || []} />
    </div>
  );
}
