import { createMemo } from 'solid-js';
import { Text, DateTime } from 'solid-i18n';

import { shiftDate, startOfMonth, endOfMonth, dateToString } from '_common/api/dates';
import { DateFormat } from '_common/api/intl/types';
import { wrapAction } from '_common/utils/wrapAction';
import { times } from '_common/utils/times';
import { download } from '_common/utils/download';
import { Table, TableColumn } from '_common/components/Table';
import { Button } from '_common/components/Button';

import { getCardStatement } from '../../services';

import { getDateRange, getMonthDiff } from './utils';

import css from './Statements.css';

interface RowData {
  start: ReadonlyDate;
  end: ReadonlyDate;
}

interface StatementsProps {
  cardId: string;
  issueDate: string;
  expirationDate: string;
}

export function Statements(props: Readonly<StatementsProps>) {
  const onClick = async (data: RowData) => {
    await getCardStatement({
      cardId: props.cardId,
      startDate: data.start.toISOString(),
      endDate: data.end.toISOString(),
    }).then((file) => {
      download(file, `statements_${props.cardId}_${dateToString(data.start)}_${dateToString(data.end)}.pdf`);
    });
  };

  const columns: readonly Readonly<TableColumn<RowData>>[] = [
    {
      name: 'date',
      title: <Text message="Date" />,
      class: css.dateColumn,
      render: (item) => <DateTime date={item.end as Date} preset={DateFormat.full} class={css.date} />,
    },
    {
      name: 'download',
      render: (item) => {
        const [loading, action] = wrapAction(() => onClick(item));
        return (
          <Button icon="pdf" type="primary" view="ghost" loading={loading()} onClick={action}>
            <Text message="Download statement" />
          </Button>
        );
      },
    },
  ];

  const data = createMemo<RowData[]>(() => {
    const [from, to] = getDateRange(props.issueDate, props.expirationDate);

    return times(getMonthDiff(from, to)).map((_, idx: number) => {
      const date = shiftDate(from, { months: idx });
      return { start: startOfMonth(date), end: endOfMonth(date) };
    });
  });

  return <Table columns={columns} data={data()} />;
}
