import { Show } from 'solid-js';
import { DateTime } from 'solid-i18n';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import { DateFormat } from '_common/api/intl/types';
import { Table, TableColumn } from '_common/components/Table';
import { Icon } from '_common/components/Icon';
import type { AccountActivity } from 'app/types/activity';

import css from './TransactionsTable.css';

interface TransactionsTableProps {
  items: readonly Readonly<AccountActivity>[];
}

export function TransactionsTable(props: Readonly<TransactionsTableProps>) {
  const columns: readonly Readonly<TableColumn<AccountActivity>>[] = [
    {
      name: 'date',
      title: 'Date & Time',
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
      title: 'Card',
      render: (item) => (
        <div>
          <div class={css.card}>{item.card.cardBin || '--'}</div>
          <Show when={item.card.cardOwner}>
            <div class={css.sub}>{item.card.cardOwner}</div>
          </Show>
        </div>
      ),
    },
    {
      name: 'merchant',
      title: 'Merchant',
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
      title: 'Amount',
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
      title: 'Receipt',
      render: () => <Icon name="receipt" class={css.receipt} />,
    },
  ];

  return (
    <div>
      <Table columns={columns} data={props.items} tdClass={css.cell} />
    </div>
  );
}
