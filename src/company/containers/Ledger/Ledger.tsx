import { createSignal, createMemo } from 'solid-js';
// import { Dynamic } from 'solid-js/web';
import { Text } from 'solid-i18n';

import { download } from '_common/utils/download';
// import { useMediaContext } from '_common/api/media/context';
import { Drawer } from '_common/components/Drawer';
import { Data } from 'app/components/Data';
import { exportAccountActivity } from 'app/services/activity';
import type { AccountActivityRequest } from 'generated/capital';
import { Events, sendAnalyticsEvent } from 'app/utils/analytics';

import { LedgerTable } from '../../components/LedgerTable';
// import {LedgerList} from '../../components/LedgerList';
import { LedgerPreview } from '../../components/LedgerPreview';
import { useLedger } from '../../stores/ledger';

const DEFAULT_PARAMS: Readonly<AccountActivityRequest> = {
  pageRequest: {
    pageNumber: 0,
    pageSize: 10,
  },
  types: [
    'BANK_DEPOSIT',
    'BANK_DEPOSIT_RETURN',
    'BANK_LINK',
    'BANK_UNLINK',
    'BANK_WITHDRAWAL',
    'BANK_WITHDRAWAL_RETURN',
    'MANUAL',
    'REALLOCATE',
  ],
};

export function Ledger() {
  // const media = useMediaContext();
  const store = useLedger({ params: { ...DEFAULT_PARAMS } });

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
        onChangeParams={store.setParams}
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
