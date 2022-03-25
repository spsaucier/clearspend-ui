import { Dynamic } from 'solid-js/web';

import { storage } from '_common/api/storage';
import { download } from '_common/utils/download';
import { useMediaContext } from '_common/api/media/context';
import { DEFAULT_PAGE_SIZE } from '_common/components/Pagination';
import { Data } from 'app/components/Data';
import { exportAccountActivity } from 'app/services/activity';
import type { AccountActivityRequest } from 'generated/capital';
import { useLedger } from 'app/stores/ledger';
import { extendPageSize, onPageSizeChange } from 'app/utils/pageSizeParam';
import { Events, sendAnalyticsEvent } from 'app/utils/analytics';
import { LedgerTable } from 'transactions/components/LedgerTable';
import { LedgerList } from 'transactions/components/LedgerList';
import { LEDGER_PAGE_SIZE_STORAGE_KEY, DEFAULT_LEDGER_PARAMS } from 'transactions/constants';

export function Ledger(props: { allocationId?: string }) {
  const media = useMediaContext();
  const defaultParams = { ...DEFAULT_LEDGER_PARAMS };
  if (props.allocationId) {
    defaultParams.allocationId = props.allocationId;
  }
  const store = useLedger({
    params: extendPageSize(defaultParams, storage.get(LEDGER_PAGE_SIZE_STORAGE_KEY, DEFAULT_PAGE_SIZE)),
  });

  const onExport = (params: Readonly<AccountActivityRequest>) => {
    return exportAccountActivity(params).then((file) => {
      sendAnalyticsEvent({ name: Events.EXPORT_LEDGER });
      return download(file, 'ledger.csv');
    });
  };

  return (
    <Data data={store.data} loading={store.loading} error={store.error} onReload={store.reload}>
      <Dynamic
        component={media.large ? LedgerTable : LedgerList}
        data={store.data!}
        params={store.params}
        onExport={onExport}
        onChangeParams={onPageSizeChange(store.setParams, (size) => storage.set(LEDGER_PAGE_SIZE_STORAGE_KEY, size))}
      />
    </Data>
  );
}
