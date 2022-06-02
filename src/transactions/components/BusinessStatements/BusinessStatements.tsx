import { dateToString } from 'date-func';

import { useBusiness } from 'app/containers/Main/context';
import { subtractYears } from 'app/containers/Overview/utils';
import { Statements } from 'app/containers/Statements';
import type { StatementsRowData } from 'app/containers/Statements/Statements';
import { getBusinessStatement } from 'cards/services';
import { download } from '_common/utils/download';

export function BusinessStatements() {
  const { business } = useBusiness();

  const onClick = async (data: StatementsRowData) => {
    const file = await getBusinessStatement({
      startDate: data.start.toISOString(),
      endDate: data.end.toISOString(),
    });
    download(file, `${business().legalName}_statement_${dateToString(data.start)}_${dateToString(data.end)}.pdf`);
  };

  return (
    <Statements
      onClick={onClick}
      fromDate={business().formationDate ?? subtractYears(1).toISOString()}
      toDate={new Date().toISOString()}
    />
  );
}
