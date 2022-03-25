import { Dynamic } from 'solid-js/web';

import { download } from '_common/utils/download';
import type { Setter } from '_common/types/common';
import { Data } from 'app/components/Data';
import { Events, sendAnalyticsEvent } from 'app/utils/analytics';
import { exportAccountActivity } from 'app/services/activity';
import type { AccountActivityRequest, LedgerActivityRequest, PagedDataLedgerActivityResponse } from 'generated/capital';

import { LedgerTable } from '../../components/LedgerTable';
import { LedgerList } from '../../components/LedgerList';

interface LedgerDataProps {
  loading: boolean;
  error: unknown;
  table: boolean;
  params: Readonly<LedgerActivityRequest>;
  data: Readonly<PagedDataLedgerActivityResponse> | null;
  onReload: () => Promise<unknown>;
  onChangeParams: Setter<Readonly<LedgerActivityRequest>>;
}

export function LedgerData(props: Readonly<LedgerDataProps>) {
  const onExport = (params: Readonly<AccountActivityRequest>) => {
    return exportAccountActivity(params).then((file) => {
      sendAnalyticsEvent({ name: Events.EXPORT_LEDGER });
      return download(file, 'ledger.csv');
    });
  };

  return (
    <Data data={props.data} loading={props.loading} error={props.error} onReload={props.onReload}>
      <Dynamic
        component={props.table ? LedgerTable : LedgerList}
        data={props.data!}
        params={props.params}
        onExport={onExport}
        onChangeParams={props.onChangeParams}
      />
    </Data>
  );
}
