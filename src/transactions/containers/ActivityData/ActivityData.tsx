import { createMemo, createSignal } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { Text } from 'solid-i18n';

import type { Setter, SetterFunc } from '_common/types/common';
import { Drawer } from '_common/components/Drawer';
import { Modal } from '_common/components/Modal';
import { useBool } from '_common/utils/useBool';
import { download } from '_common/utils/download';
import { Data } from 'app/components/Data';
import { exportAccountActivity, getActivityById } from 'app/services/activity';
import { Events, sendAnalyticsEvent } from 'app/utils/analytics';
import type { DateRange } from 'app/types/common';
import { CardPreview } from 'cards/containers/CardPreview';
import { EmployeePreview } from 'employees/containers/EmployeePreview';
import type {
  AccountActivityResponse,
  LedgerActivityRequest,
  PagedDataAccountActivityResponse,
  PagedDataLedgerActivityResponse,
} from 'generated/capital';

import { ActivityTable } from '../../components/ActivityTable';
import { ActivityList } from '../../components/ActivityList';
import { TransactionReportModal } from '../../components/TransactionReportModal';
import { usePreviewTransaction } from '../TransactionsData/utils/usePreviewTransaction';
import type { ReceiptVideModel } from '../TransactionPreview';
import { ReceiptsView, TransactionPreview } from '../TransactionPreview';
import { LedgerPreview } from '../LedgerPreview';
import { activityToLedger, ledgerToActivity } from '../../utils/convertTypes';

interface ActivityDataProps {
  table: boolean;
  loading: boolean;
  error: unknown;
  showUserFilter?: boolean;
  showAllocationFilter?: boolean;
  params: Readonly<LedgerActivityRequest>;
  data: Readonly<PagedDataLedgerActivityResponse> | null;
  class?: string;
  dateRange?: Readonly<DateRange>;
  onReload: () => Promise<unknown>;
  onChangeParams: Setter<Readonly<LedgerActivityRequest>>;
  onUpdateTransaction: (setter: SetterFunc<Readonly<PagedDataAccountActivityResponse>>) => void;
}

export function ActivityData(props: Readonly<ActivityDataProps>) {
  const [cardID, setCardID] = createSignal<string>();
  const [userID, setUserID] = createSignal<string>();

  const preview = usePreviewTransaction(
    createMemo(() => props.data?.content),
    getActivityById,
    true,
  );
  const [showReceipts, setShowReceipts] = createSignal<Readonly<ReceiptVideModel[]>>([]);
  const [reportModal, toggleReportModal] = useBool();

  const onUpdateTransaction = (data: Readonly<AccountActivityResponse>) => {
    props.onUpdateTransaction((prev) => ({
      ...prev,
      content: prev.content?.map((item) =>
        item.accountActivityId === data.accountActivityId ? activityToLedger(data, item) : item,
      ),
    }));
  };

  const onExport = (params: Readonly<LedgerActivityRequest>) => {
    return exportAccountActivity(params).then((file) => {
      sendAnalyticsEvent({ name: Events.EXPORT_LEDGER });
      return download(file, 'activity.csv');
    });
  };

  return (
    <Data data={props.data} loading={props.loading} error={props.error} onReload={props.onReload}>
      <Dynamic
        component={props.table ? ActivityTable : ActivityList}
        showUserFilter={props.showUserFilter}
        showAllocationFilter={props.showAllocationFilter}
        data={props.data!}
        dateRange={props.dateRange}
        params={props.params}
        class={props.class}
        onExport={onExport}
        onCardClick={setCardID}
        onUserClick={setUserID}
        onRowClick={preview.changeID}
        onChangeParams={props.onChangeParams}
      />
      <Drawer
        noPadding
        open={preview.isActivity() === false}
        title={<Text message="Transaction Details" />}
        onClose={preview.changeID}
      >
        <LedgerPreview data={preview.transaction()!} onReport={toggleReportModal} />
      </Drawer>
      <Drawer
        noPadding
        open={preview.isActivity() === true}
        title={<Text message="Transaction Details" />}
        onClose={preview.changeID}
      >
        <TransactionPreview
          transaction={ledgerToActivity(preview.transaction()!)}
          onUpdate={onUpdateTransaction}
          onViewReceipt={setShowReceipts}
          onReport={toggleReportModal}
        />
      </Drawer>
      <Modal isOpen={!!preview.id() && !!showReceipts().length} close={() => setShowReceipts([])}>
        <ReceiptsView
          accountActivityId={preview.id()!}
          receipts={showReceipts()}
          onEmpty={() => setShowReceipts([])}
          onUpdate={onUpdateTransaction}
        />
      </Modal>
      <TransactionReportModal open={reportModal()} onClose={toggleReportModal} />
      <Drawer open={Boolean(cardID())} title={<Text message="Card summary" />} onClose={setCardID}>
        <CardPreview cardID={cardID()!} />
      </Drawer>
      <Drawer noPadding open={Boolean(userID())} title={<Text message="Employee Profile" />} onClose={setUserID}>
        <EmployeePreview uid={userID()!} />
      </Drawer>
    </Data>
  );
}
