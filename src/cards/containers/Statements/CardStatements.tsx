import { dateToString } from 'date-func';

import { download } from '_common/utils/download';
import { Statements, StatementsRowData } from 'app/containers/Statements/Statements';

import { getCardStatement } from '../../services';

interface CardStatementsProps {
  cardId: string;
  issueDate: string;
  expirationDate: string;
}

export function CardStatements(props: Readonly<CardStatementsProps>) {
  const onClick = async (data: StatementsRowData) => {
    await getCardStatement({
      cardId: props.cardId,
      startDate: data.start.toISOString(),
      endDate: data.end.toISOString(),
    }).then((file) => {
      download(file, `statements_${props.cardId}_${dateToString(data.start)}_${dateToString(data.end)}.pdf`);
    });
  };

  return <Statements onClick={onClick} fromDate={props.issueDate} toDate={props.expirationDate} />;
}
