import { createSignal, createMemo } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { Text } from 'solid-i18n';

import type { Setter, SetterFunc } from '_common/types/common';
import { useBool } from '_common/utils/useBool';
import { Drawer } from '_common/components/Drawer';
import { Data } from 'app/components/Data';
import { getActivityById } from 'app/services/activity';
import type { DateRange } from 'app/types/common';
import { CardPreview } from 'cards/containers/CardPreview';
import type {
  AccountActivityRequest,
  AccountActivityResponse,
  PagedDataAccountActivityResponse,
} from 'generated/capital';

import { TransactionsList } from '../../components/TransactionsList';
import { TransactionsTable } from '../../components/TransactionsTable';
import { TransactionReportModal } from '../../components/TransactionReportModal';
import { usePreviewTransaction } from '../../utils/usePreviewTransaction';
import { TransactionPreview } from '../TransactionPreview';

interface TransactionsDataProps {
  class?: string;
  data: Readonly<PagedDataAccountActivityResponse> | null;
  dateRange?: Readonly<DateRange>;
  error: unknown;
  loading: boolean;
  onChangeParams: Setter<Readonly<AccountActivityRequest>>;
  onReload: () => Promise<unknown>;
  onUpdateData: (setter: SetterFunc<Readonly<PagedDataAccountActivityResponse>>) => void;
  params: Readonly<AccountActivityRequest>;
  showAccountingAdminView?: boolean;
  showAllocationFilter?: boolean;
  showUserFilter?: boolean;
  table?: boolean;
}

export function TransactionsData(props: Readonly<TransactionsDataProps>) {
  const [cardID, setCardID] = createSignal<string>();
  const [reportModal, toggleReportModal] = useBool();

  const preview = usePreviewTransaction(
    createMemo(() => props.data?.content),
    getActivityById,
  );

  const onUpdateTransaction = (transactions: Readonly<AccountActivityResponse[]>) => {
    props.onUpdateData((prev) => ({
      ...prev,
      content: prev.content?.map((currentTransaction) => {
        const updatedTransaction = transactions.find(
          (t) => t.accountActivityId === currentTransaction.accountActivityId,
        );
        return updatedTransaction ?? currentTransaction;
      }),
    }));
  };

  return (
    <Data data={props.data} loading={props.loading} error={props.error} onReload={props.onReload}>
      <Dynamic
        class={props.class}
        component={props.table ? TransactionsTable : TransactionsList}
        data={props.data!}
        dateRange={props.dateRange}
        onCardClick={setCardID}
        onChangeParams={props.onChangeParams}
        onReload={props.onReload}
        onRowClick={preview.setID}
        onUpdateTransaction={onUpdateTransaction}
        params={props.params}
        showAccountingAdminView={props.showAccountingAdminView}
        showAllocationFilter={props.showAllocationFilter}
        showUserFilter={props.showUserFilter}
      />
      <Drawer
        noPadding
        open={Boolean(preview.transaction())}
        title={<Text message="Transaction Details" />}
        onClose={() => preview.setID()}
      >
        <TransactionPreview
          transaction={preview.transaction()!}
          onUpdate={onUpdateTransaction}
          showAccountingAdminView={props.showAccountingAdminView}
          onReport={toggleReportModal}
        />
      </Drawer>
      <TransactionReportModal
        open={reportModal()}
        onClose={toggleReportModal}
        activityId={preview.transaction()?.accountActivityId}
        cardId={preview.transaction()?.card?.cardId}
      />
      <Drawer open={Boolean(cardID())} title={<Text message="Card summary" />} onClose={setCardID}>
        <CardPreview cardID={cardID()!} />
      </Drawer>
    </Data>
  );
}
