import { createSignal, createMemo } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { Text } from 'solid-i18n';

import type { Setter, SetterFunc } from '_common/types/common';
import { Drawer } from '_common/components/Drawer';
import { Modal } from '_common/components/Modal';
import { Data } from 'app/components/Data';
import { getActivityById } from 'app/services/activity';
import type { DateRange } from 'app/types/common';
import type {
  AccountActivityRequest,
  AccountActivityResponse,
  PagedDataAccountActivityResponse,
} from 'generated/capital';

import { TransactionsList } from '../../components/TransactionsList';
import { TransactionsTable } from '../../components/TransactionsTable';
import { TransactionReportModal } from '../../components/TransactionReportModal';
import { TransactionPreview, ReceiptsView, type ReceiptVideModel } from '../TransactionPreview';

import { usePreviewTransaction } from './utils/usePreviewTransaction';

interface TransactionsDataProps {
  class?: string;
  data: Readonly<PagedDataAccountActivityResponse> | null;
  dateRange?: Readonly<DateRange>;
  error: unknown;
  loading: boolean;
  onCardClick?: (id: string) => void;
  onChangeParams: Setter<Readonly<AccountActivityRequest>>;
  onDeselectTransaction?: (id: string) => void;
  onReload: () => Promise<unknown>;
  onSelectTransaction?: (id: string) => void;
  onUpdateData: (setter: SetterFunc<Readonly<PagedDataAccountActivityResponse>>) => void;
  params: Readonly<AccountActivityRequest>;
  selectedTransactions?: string[];
  showAccountingAdminView?: boolean;
  showAllocationFilter?: boolean;
  showUserFilter?: boolean;
  table?: boolean;
}

export function TransactionsData(props: Readonly<TransactionsDataProps>) {
  const [previewId, previewTransaction, onChangePreviewId] = usePreviewTransaction(
    createMemo(() => props.data?.content),
    getActivityById,
  );

  const [showReceipts, setShowReceipts] = createSignal<Readonly<ReceiptVideModel[]>>([]);
  const [reportModalOpen, setReportModalOpen] = createSignal<boolean>(false);

  const onUpdateTransaction = (data: Readonly<AccountActivityResponse>) => {
    props.onUpdateData((prev) => ({
      ...prev,
      content: prev.content?.map((item) => (item.accountActivityId === data.accountActivityId ? data : item)),
    }));
  };

  return (
    <Data data={props.data} loading={props.loading} error={props.error} onReload={props.onReload}>
      <Dynamic
        class={props.class}
        component={props.table ? TransactionsTable : TransactionsList}
        data={props.data!}
        dateRange={props.dateRange}
        onCardClick={props.onCardClick}
        onChangeParams={props.onChangeParams}
        onDeselectTransaction={props.onDeselectTransaction}
        onReload={props.onReload}
        onRowClick={onChangePreviewId}
        onSelectTransaction={props.onSelectTransaction}
        onUpdate={onUpdateTransaction}
        params={props.params}
        selectedTransactions={props.selectedTransactions}
        showAccountingAdminView={props.showAccountingAdminView}
        showAllocationFilter={props.showAllocationFilter}
        showUserFilter={props.showUserFilter}
      />
      <Drawer
        noPadding
        open={Boolean(previewTransaction())}
        title={<Text message="Transaction Details" />}
        onClose={() => onChangePreviewId()}
      >
        <TransactionPreview
          transaction={previewTransaction()!}
          onUpdate={onUpdateTransaction}
          onViewReceipt={setShowReceipts}
          showAccountingAdminView={props.showAccountingAdminView}
          onReport={() => setReportModalOpen(true)}
        />
      </Drawer>
      <Modal isOpen={!!previewId() && !!showReceipts().length} close={() => setShowReceipts([])}>
        <ReceiptsView
          accountActivityId={previewId()!}
          receipts={showReceipts()}
          onEmpty={() => setShowReceipts([])}
          onUpdate={onUpdateTransaction}
        />
      </Modal>
      <TransactionReportModal open={reportModalOpen()} onClose={() => setReportModalOpen(false)} />
    </Data>
  );
}
