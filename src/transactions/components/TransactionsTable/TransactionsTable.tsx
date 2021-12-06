import { Show } from 'solid-js';
import { useI18n, Text, DateTime } from 'solid-i18n';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import { join } from '_common/utils/join';
import type { StoreSetter } from '_common/utils/store';
import { DateFormat } from '_common/api/intl/types';
import { InputSearch } from '_common/components/InputSearch';
import { Button } from '_common/components/Button';
import { Pagination } from '_common/components/Pagination';
import { Table, TableColumn } from '_common/components/Table';
import { Icon } from '_common/components/Icon';
import { Filters } from 'app/components/Filters';
import { Empty } from 'app/components/Empty';
import { changeRequestPage } from 'app/utils/changeRequestPage';
import { changeRequestSearch } from 'app/utils/changeRequestSearch';
import type { AccountActivity, AccountActivityResponse, AccountActivityRequest } from 'app/types/activity';
import type { UUIDString } from 'app/types/common';
import { formatCardNumber } from 'cards/utils/formatCardNumber';
import { formatName } from 'employees/utils/formatName';

import css from './TransactionsTable.css';

interface TransactionsTableProps {
  search?: string;
  data: AccountActivityResponse;
  onCardClick?: (id: UUIDString) => void;
  onChangeParams: StoreSetter<Readonly<AccountActivityRequest>>;
}

export function TransactionsTable(props: Readonly<TransactionsTableProps>) {
  const i18n = useI18n();

  const columns: readonly Readonly<TableColumn<AccountActivity>>[] = [
    {
      name: 'date',
      title: <Text message="Date & Time" />,
      render: (item) => {
        const date = new Date(item.activityTime);
        return (
          <div>
            <div class={css.date}>
              <DateTime date={date} />
            </div>
            <div class={css.sub}>
              <DateTime date={date} preset={DateFormat.time} />
            </div>
          </div>
        );
      },
    },
    {
      name: 'card',
      title: <Text message="Card" />,
      render: (item) => (
        <div>
          <div class={css.card}>{item.card?.lastFour ? formatCardNumber(item.card.lastFour) : '--'}</div>
          <Show when={item.card}>
            <div class={css.sub}>
              {formatName({
                firstName: item.card!.ownerFirstName!,
                lastName: item.card!.ownerLastName!,
              })}
            </div>
          </Show>
        </div>
      ),
    },
    {
      name: 'merchant',
      title: <Text message="Merchant" />,
      render: (item) => (
        <div class={css.merchant}>
          <div class={css.icon} />
          <div>
            <div>{item.merchant.name || '--'}</div>
            <Show when={item.merchant.type}>
              <div class={css.sub}>{item.merchant.type}</div>
            </Show>
          </div>
        </div>
      ),
    },
    {
      name: 'amount',
      title: <Text message="Amount" />,
      render: (item) => (
        <div class={css.amountCell}>
          <div class={css.status}>
            <Icon name="confirm" size="sm" />
          </div>
          <div>
            <div class={css.amount}>{formatCurrency(item.amount.amount)}</div>
            <div class={css.sub}>Approved</div>
          </div>
        </div>
      ),
    },
    {
      name: 'receipt',
      title: <Text message="Receipt" />,
      render: (item) => (
        <Icon
          name={item.receipt.receiptId ? 'receipt' : 'receipt-unavailable'}
          class={join(css.receipt, !item.receipt.receiptId && css.receiptEmpty)}
        />
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
          placeholder={String(i18n.t('Search Transactions...'))}
          class={css.search}
          onSearch={changeRequestSearch(props.onChangeParams)}
        />
        <Button view="ghost" icon={{ name: 'filters', pos: 'right' }}>
          More Filters
        </Button>
        <Button icon={{ name: 'download', pos: 'right' }}>Export</Button>
      </Filters>
      <Show
        when={props.data.content.length}
        fallback={<Empty message={<Text message="There are no transactions" />} />}
      >
        <Table columns={columns} data={props.data.content} tdClass={css.cell} />
      </Show>
    </div>
  );
}
