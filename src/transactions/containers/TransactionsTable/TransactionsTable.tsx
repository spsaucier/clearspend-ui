import { DateTime } from 'solid-i18n';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import { DateFormat } from '_common/api/intl/types';
import { times } from '_common/utils/times';
import { Table, TableColumn } from '_common/components/Table';
import { Icon } from '_common/components/Icon';

import css from './TransactionsTable.css';

interface FakeCard {
  date: Date;
  card: string;
  merchant: string;
  amount: number;
  receipt: boolean;
}

/* eslint-disable-next-line @typescript-eslint/no-magic-numbers */
const CARDS: readonly Readonly<FakeCard>[] = times(10).map(() => ({
  date: new Date(),
  card: '•••• 9827',
  merchant: 'Whole Foods',
  amount: 77.99,
  receipt: true,
}));

export function TransactionsTable() {
  const columns: readonly Readonly<TableColumn<FakeCard>>[] = [
    {
      name: 'date',
      title: 'Date & Time',
      render: (item) => (
        <div>
          <div class={css.date}>
            <DateTime date={item.date} />
          </div>
          <div class={css.sub}>
            <DateTime date={item.date} preset={DateFormat.time} />
          </div>
        </div>
      ),
    },
    {
      name: 'card',
      title: 'Card',
      render: (item) => (
        <div>
          <div class={css.card}>{item.card}</div>
          <div class={css.sub}>Gracie-Leigh Duncan</div>
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
            <div>{item.merchant}</div>
            <div class={css.sub}>Groceries</div>
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
            <div class={css.amount}>{formatCurrency(item.amount)}</div>
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
      <Table columns={columns} data={CARDS} tdClass={css.cell} />
    </div>
  );
}
