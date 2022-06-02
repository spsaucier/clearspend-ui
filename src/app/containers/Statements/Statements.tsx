import { createMemo } from 'solid-js';
import { Text, DateTime } from 'solid-i18n';

import { shiftDate, startOfMonth, endOfMonth } from '_common/api/dates';
import { DateFormat } from '_common/api/intl/types';
import { wrapAction } from '_common/utils/wrapAction';
import { times } from '_common/utils/times';
import { Table, TableColumn } from '_common/components/Table';
import { Button } from '_common/components/Button';
import { getDateRange, getMonthDiff } from 'cards/containers/Statements/utils';

import css from './Statements.css';

export interface StatementsRowData {
  start: ReadonlyDate;
  end: ReadonlyDate;
}

interface StatementsProps {
  fromDate: string;
  toDate: string;
  onClick: (data: StatementsRowData) => Promise<void>;
}

export function Statements(props: Readonly<StatementsProps>) {
  const columns: readonly Readonly<TableColumn<StatementsRowData>>[] = [
    {
      name: 'date',
      title: <Text message="Date" />,
      class: css.dateColumn,
      render: (item) => <DateTime date={item.end as Date} preset={DateFormat.full} class={css.date} />,
    },
    {
      name: 'download',
      render: (item) => {
        const [loading, action] = wrapAction(() => props.onClick(item));
        return (
          <Button icon="pdf" type="primary" view="ghost" loading={loading()} onClick={action}>
            <Text message="Download statement" />
          </Button>
        );
      },
    },
  ];

  const data = createMemo<StatementsRowData[]>(() => {
    const [from, to] = getDateRange(props.fromDate, props.toDate);

    return times(getMonthDiff(from, to)).map((_, idx: number) => {
      const date = shiftDate(from, { months: idx });
      return { start: startOfMonth(date), end: endOfMonth(date) };
    });
  });

  return <Table columns={columns} data={data()} />;
}
