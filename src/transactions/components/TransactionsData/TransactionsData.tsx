import { createSignal, createMemo, type Setter, Accessor } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { Text } from 'solid-i18n';

import type { StoreSetterFunc, StoreSetter } from '_common/utils/store';
import { Drawer } from '_common/components/Drawer';
import { Modal } from '_common/components/Modal';
import { Data } from 'app/components/Data';
import type {
  AccountActivityRequest,
  AccountActivityResponse,
  PagedDataAccountActivityResponse,
} from 'generated/capital';

import { TransactionsList } from '../TransactionsList';
import { TransactionsTable } from '../TransactionsTable';
import { TransactionPreview, ReceiptsView, type ReceiptVideModel } from '../TransactionPreview';
import { TransactionReportModal } from '../TransactionReportModal';

interface TransactionsDataProps {
  table?: boolean;
  loading: boolean;
  error: unknown;
  params: Readonly<AccountActivityRequest>;
  data: Readonly<PagedDataAccountActivityResponse> | null;
  onCardClick?: (id: string) => void;
  onReload: () => Promise<unknown>;
  onChangeParams: Setter<Readonly<AccountActivityRequest>> | StoreSetter<Readonly<AccountActivityRequest>>;
  onUpdateData: (setter: StoreSetterFunc<Readonly<PagedDataAccountActivityResponse>>) => void;
  showAccountingAdminView?: boolean;
  selectedTransactions?: Accessor<string[]>;
  onSelectTransaction?: (id: string) => void;
  onDeselectTransaction?: (id: string) => void;
}

export function TransactionsData(props: Readonly<TransactionsDataProps>) {
  const [previewId, setPreviewId] = createSignal<string>();
  const [showReceipts, setShowReceipts] = createSignal<Readonly<ReceiptVideModel[]>>([]);
  const [reportModalOpen, setReportModalOpen] = createSignal<boolean>(false);

  const previewTransaction = createMemo(() =>
    props.data?.content?.find((item) => item.accountActivityId === previewId()),
  );

  const onUpdateTransaction = (data: Readonly<AccountActivityResponse>) => {
    props.onUpdateData((prev) => ({
      ...prev,
      content: prev.content?.map((item) => (item.accountActivityId === data.accountActivityId ? data : item)),
    }));
  };

  return (
    <Data data={props.data} loading={props.loading} error={props.error} onReload={props.onReload}>
      <Dynamic
        component={props.table ? TransactionsTable : TransactionsList}
        data={props.data!}
        params={props.params}
        onCardClick={props.onCardClick}
        onRowClick={setPreviewId}
        onChangeParams={props.onChangeParams}
        showAccountingAdminView={props.showAccountingAdminView}
        selectedTransactions={props.selectedTransactions}
        onSelectTransaction={props.onSelectTransaction}
        onDeselectTransaction={props.onDeselectTransaction}
      />
      <Drawer
        noPadding
        open={Boolean(previewTransaction())}
        title={<Text message="Transaction Details" />}
        onClose={() => setPreviewId()}
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
