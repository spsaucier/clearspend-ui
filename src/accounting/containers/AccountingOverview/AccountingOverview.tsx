import { createSignal } from 'solid-js';
import { Text } from 'solid-i18n';

import { useMediaContext } from '_common/api/media/context';
import { TransactionsData } from 'transactions/components/TransactionsData';
import type { AccountActivityResponse } from 'generated/capital';
import { Data } from 'app/components/Data';
import { TransactionPreview } from 'transactions/components/TransactionPreview/TransactionPreview';
import { Drawer } from '_common/components/Drawer';
import { useNav } from '_common/api/router';
import { Modal } from '_common/components/Modal/Modal';
import { ReceiptsView, ReceiptVideModel } from 'transactions/components/TransactionPreview/ReceiptsView';
import { DEFAULT_ACTIVITY_PARAMS } from 'employees/containers/Transactions/Transactions';
import { useActivity } from 'app/stores/activity';

import { AccountingTimePeriod, getAccountingTimePeriod } from './utils';

import css from './AccountingOverview.css';

function toISO(range: [from: ReadonlyDate, to: ReadonlyDate]) {
  return {
    from: range[0].toISOString() as DateString,
    to: range[1].toISOString() as DateString,
  };
}

export function AccountingOverview() {
  const media = useMediaContext();
  const navigate = useNav();

  const initPeriod = AccountingTimePeriod.year;
  const PERIOD = toISO(getAccountingTimePeriod(initPeriod));

  const activityStore = useActivity({
    params: {
      ...DEFAULT_ACTIVITY_PARAMS,
      ...PERIOD,
      // allocationId,
    },
  });

  const [selectedTransaction, setSelectedTransaction] = createSignal<AccountActivityResponse | null>(null);
  const [showReceipts, setShowReceipts] = createSignal<Readonly<ReceiptVideModel[]>>([]);

  return (
    <div class={css.root}>
      <div>
        <Data
          data={activityStore.data}
          loading={activityStore.loading}
          error={activityStore.error}
          onReload={activityStore.reload}
        >
          <TransactionsData
            table={media.large}
            loading={activityStore.loading}
            error={activityStore.error}
            params={activityStore.params}
            data={activityStore.data}
            onReload={activityStore.reload}
            onChangeParams={activityStore.setParams}
            onRowClick={setSelectedTransaction}
            onCardClick={(cardId) => navigate(`/cards/view/${cardId}`)}
          />
        </Data>
        <Drawer
          open={Boolean(selectedTransaction())}
          title={<Text message="Transaction Details" />}
          onClose={() => setSelectedTransaction(null)}
        >
          <TransactionPreview
            transaction={selectedTransaction()!}
            onUpdate={setSelectedTransaction}
            onViewReceipt={setShowReceipts}
          />
        </Drawer>
        <Modal isOpen={showReceipts().length > 0} close={() => setShowReceipts([])}>
          <ReceiptsView
            accountActivityId={selectedTransaction()?.accountActivityId!}
            receipts={showReceipts()}
            onEmpty={() => setShowReceipts([])}
            onDelete={setSelectedTransaction}
          />
        </Modal>
      </div>
    </div>
  );
}
