import { createMemo, createSignal } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { Text } from 'solid-i18n';

import type { Setter, SetterFunc } from '_common/types/common';
import { Drawer } from '_common/components/Drawer';
import { useBool } from '_common/utils/useBool';
import { download } from '_common/utils/download';
import { Data } from 'app/components/Data';
import { exportLedgerActivity, getLedgerActivityById } from 'app/services/activity';
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
import { activityToLedger, ledgerToActivity } from '../../utils/convertTypes';
import { usePreviewTransaction } from '../../utils/usePreviewTransaction';
import { TransactionPreview } from '../TransactionPreview';
import { LedgerPreview } from '../LedgerPreview';

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
  const [reportModal, toggleReportModal] = useBool();

  const preview = usePreviewTransaction(
    createMemo(() => props.data?.content),
    getLedgerActivityById,
  );

  const onUpdateTransaction = (data: Readonly<AccountActivityResponse>) => {
    preview.updateCache(
      activityToLedger(
        data,
        props.data?.content?.find((item) => item.accountActivityId === data.accountActivityId),
      ),
    );
    props.onUpdateTransaction((prev) => ({
      ...prev,
      content: prev.content?.map((current) =>
        current.accountActivityId === data.accountActivityId ? activityToLedger(data, current) : current,
      ),
    }));
  };

  const onExport = (params: Readonly<LedgerActivityRequest>) => {
    return exportLedgerActivity(params).then((file) => {
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
        onRowClick={preview.setID}
        onChangeParams={props.onChangeParams}
      />
      <Drawer
        noPadding
        open={preview.isActivity() === false}
        title={<Text message="Transaction Details" />}
        onClose={preview.setID}
      >
        <LedgerPreview data={preview.transaction()!} onReport={toggleReportModal} />
      </Drawer>
      <Drawer
        noPadding
        open={preview.isActivity() === true}
        title={<Text message="Transaction Details" />}
        onClose={preview.setID}
      >
        <TransactionPreview
          transaction={ledgerToActivity(preview.transaction()!)}
          onUpdate={onUpdateTransaction}
          onReport={toggleReportModal}
        />
      </Drawer>
      <TransactionReportModal
        open={reportModal()}
        onClose={toggleReportModal}
        activityId={preview.transaction()?.accountActivityId}
        userEmail={preview.transaction()?.user?.userInfo?.email}
      />
      <Drawer open={Boolean(cardID())} title={<Text message="Card summary" />} onClose={setCardID}>
        <CardPreview cardID={cardID()!} />
      </Drawer>
      <Drawer noPadding open={Boolean(userID())} title={<Text message="Employee Profile" />} onClose={setUserID}>
        <EmployeePreview uid={userID()!} />
      </Drawer>
    </Data>
  );
}
