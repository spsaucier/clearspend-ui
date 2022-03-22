import { createSignal, createMemo } from 'solid-js';
// import { Dynamic } from 'solid-js/web';
import { Text } from 'solid-i18n';

import { storage } from '_common/api/storage';
import { download } from '_common/utils/download';
// import { useMediaContext } from '_common/api/media/context';
import { Drawer } from '_common/components/Drawer';
import { DEFAULT_PAGE_SIZE } from '_common/components/Pagination';
import { Data } from 'app/components/Data';
import { exportAccountActivity } from 'app/services/activity';
import type { AccountActivityRequest } from 'generated/capital';
import { extendPageSize, onPageSizeChange } from 'app/utils/pageSizeParam';
import { Events, sendAnalyticsEvent } from 'app/utils/analytics';

import { LedgerTable } from '../../components/LedgerTable';
// import {LedgerList} from '../../components/LedgerList';
import { LedgerPreview } from '../../components/LedgerPreview';
import { LEDGER_PAGE_SIZE_STORAGE_KEY, DEFAULT_LEDGER_PARAMS } from '../../constants';
import { useLedger } from '../../stores/ledger';

export function Ledger() {
  // const media = useMediaContext();
  const store = useLedger({
    params: extendPageSize(DEFAULT_LEDGER_PARAMS, storage.get(LEDGER_PAGE_SIZE_STORAGE_KEY, DEFAULT_PAGE_SIZE)),
  });

  const [previewId, setPreviewId] = createSignal<string>();
  const previewData = createMemo(() => store.data?.content?.find((item) => item.accountActivityId === previewId()));

  const onExport = (params: Readonly<AccountActivityRequest>) => {
    return exportAccountActivity(params).then((file) => {
      sendAnalyticsEvent({ name: Events.EXPORT_LEDGER });
      return download(file, 'ledger.csv');
    });
  };

  return (
    <Data data={store.data} loading={store.loading} error={store.error} onReload={store.reload}>
      <LedgerTable
        // component={media.large ? LedgerTable : LedgerList}
        data={store.data!}
        params={store.params}
        onRowClick={setPreviewId}
        onExport={onExport}
        onChangeParams={onPageSizeChange(store.setParams, (size) => storage.set(LEDGER_PAGE_SIZE_STORAGE_KEY, size))}
      />
      <Drawer
        noPadding
        open={Boolean(previewData())}
        title={<Text message="Transaction Details" />}
        onClose={() => setPreviewId()}
      >
        <LedgerPreview data={previewData()!} />
      </Drawer>
    </Data>
  );
}
