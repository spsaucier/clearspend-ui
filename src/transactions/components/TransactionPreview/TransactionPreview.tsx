import { useNavigate } from 'solid-app-router';
import { DateTime } from 'solid-i18n';
import { createEffect, createSignal, Show } from 'solid-js';

import type { AccountActivityResponse } from 'generated/capital';
import { DateFormat } from '_common/api/intl/types';
import { Icon } from '_common/components/Icon/Icon';
import { formatCurrency } from '_common/api/intl/formatCurrency';
import { Button } from '_common/components/Button';
import { formatCardNumber } from 'cards/utils/formatCardNumber';
import { formatName } from 'employees/utils/formatName';
import { join } from '_common/utils/join';
import { getActivityById, linkReceiptToActivity, uploadReceiptForActivity, viewReceipt } from 'app/services/activity';
import { wrapAction } from '_common/utils/wrapAction';

import type { ReceiptVideModel } from './ReceiptsView';

import css from './TransactionPreview.css';

interface TransactionPreviewProps {
  transaction: AccountActivityResponse;
  onViewReceipt: (receipts: Readonly<ReceiptVideModel[]>) => void;
}
export function TransactionPreview(props: Readonly<TransactionPreviewProps>) {
  const navigate = useNavigate();
  const [transaction, setTransaction] = createSignal<Readonly<AccountActivityResponse>>(props.transaction);
  const [receipts, setReceipts] = createSignal<Readonly<ReceiptVideModel[]>>([]);
  const displayAmount = formatCurrency(transaction().amount?.amount || 0);

  const [uploading, uploadReceipt] = wrapAction(async (e: Event) => {
    const formData = new FormData();
    formData.append('receipt', (e.target as HTMLInputElement).files?.[0] as File);

    const { receiptId } = await uploadReceiptForActivity(formData);

    await linkReceiptToActivity(transaction().accountActivityId!, receiptId);

    const updatedTransactionWithReceipt = await getActivityById(transaction().accountActivityId!);

    setTransaction(updatedTransactionWithReceipt);
  });

  const [downloadingReceipts, viewReceiptAction] = wrapAction(viewReceipt);

  createEffect(() => {
    setTransaction(props.transaction);
  });

  createEffect(() => {
    const downloadReceiptsToView = async () => {
      const receiptIdList = transaction().receipt?.receiptId;
      if (receiptIdList && receiptIdList.length > 0) {
        const viewReceiptDataRequests = await Promise.all(
          receiptIdList.map((receiptId) => viewReceiptAction(receiptId)),
        );
        setReceipts(viewReceiptDataRequests);
      }
    };
    downloadReceiptsToView();
  });

  return (
    <div>
      <div class={join(css.status, getColorClassForTransactionStatus(transaction().status))}>
        <Icon name="confirm-circle-filled" size="sm" class={css.icon} />
        <span>{transaction().status?.toLocaleLowerCase()}</span>
        <span class={css.statusMsg}>{getTransactionStatusDetailMsg(transaction().status)}</span>
      </div>
      <div class={css.summary}>
        <Show when={transaction().merchant?.merchantLogoUrl}>
          <img src={transaction().merchant?.merchantLogoUrl} alt="Merchant logo" class={css.merchantLogo} />
        </Show>
        <Show when={!transaction().merchant?.merchantLogoUrl}>
          <div class={css.missingLogoUrl} />
        </Show>
        <div class={css.amount}>{displayAmount}</div>
        <div class={css.merchant}>
          {transaction().merchant?.name}
          <span>&#8226;</span>
          {transaction().merchant?.type}
        </div>
        <div class={css.date}>
          <DateWithDateTime activityTime={transaction().activityTime!} />
        </div>
        <div class={css.receiptCta}>
          <Show when={transaction().receipt?.receiptId?.length! > 0}>
            <Button
              view={'default'}
              wide={true}
              loading={downloadingReceipts()}
              icon="add-receipt"
              onClick={() => props.onViewReceipt(receipts())}
            >
              View Receipt
            </Button>
          </Show>
          <Show when={!transaction().receipt?.receiptId && allowReceiptUpload(transaction())}>
            <label for="receipt-upload">
              <Button view={'default'} wide={true} icon="add-receipt" loading={uploading()}>
                Add Receipt
              </Button>
            </label>
          </Show>
          <Show when={allowReceiptUpload(transaction())}>
            <label for="receipt-upload">
              <Button view={'default'} wide={true} icon="receipt" loading={uploading()}>
                Upload more images
              </Button>
            </label>
          </Show>
          <input type="file" id="receipt-upload" accept="image/*" onChange={uploadReceipt}></input>
        </div>
      </div>
      <div>
        <Show when={transaction().card}>
          <>
            <div class={css.title}>Card</div>
            <div>
              <div class={css.card} onClick={() => navigate(`/cards/view/${transaction().card?.cardId}`)}>
                <div class={css.cardIcon}>
                  <Icon name="card" />
                </div>
                <div class={css.cardDetailWrapper}>
                  <div class={css.cardNumber}>
                    {transaction().card?.lastFour ? formatCardNumber(transaction().card?.lastFour) : '--'}
                  </div>
                  <div class={css.cardName}>
                    {formatName({
                      firstName: transaction().card?.ownerFirstName!,
                      lastName: transaction().card?.ownerLastName!,
                    })}
                  </div>
                </div>
                <Icon name="chevron-right" />
              </div>
            </div>
          </>
        </Show>
      </div>
      <div>
        <div class={css.title}>Merchant</div>
        <div class={css.detailRows}>
          <div>Merchant Name</div>
          <div>{transaction().merchant?.name}</div>
          <div>Merchant ID</div>
          <div>{transaction().merchant?.merchantNumber}</div>
          <div>Merchant Category</div>
          <div>{transaction().merchant?.merchantCategoryCode}</div>
        </div>
      </div>
      <div>
        <div class={css.title}>Transaction Details</div>
        <div class={css.detailRows}>
          <div>Posted On</div>
          <div>
            <DateWithDateTime activityTime={transaction().activityTime!} />
          </div>
          <div>Posted Amount</div>
          <div>{displayAmount}</div>
        </div>
      </div>
      <div class={css.reportIssueCta}>
        <Button view={'default'} wide={true} icon={{ name: 'alert', pos: 'right' }}>
          Report an issue
        </Button>
      </div>
    </div>
  );
}

const allowReceiptUpload = (transaction: AccountActivityResponse) => {
  return transaction.merchant && ['PENDING', 'APPROVED', 'PROCESSED'].includes(transaction.status!);
};

export const DateWithDateTime = (props: { activityTime: string }) => {
  const date = new Date(props.activityTime || '');
  return (
    <>
      <DateTime date={date} />
      <span>&#8226;</span>
      <DateTime date={date} preset={DateFormat.time} />
    </>
  );
};

const getTransactionStatusDetailMsg = (status?: AccountActivityResponse['status']) => {
  switch (status) {
    case 'PENDING':
      return '';
    case 'DECLINED':
      return '';
    case 'PROCESSED':
      return '';
    case 'APPROVED':
      return 'Payment has been authorized';
    default:
      return 'Unknown';
  }
};

const getColorClassForTransactionStatus = (status?: AccountActivityResponse['status']) => {
  switch (status) {
    case 'PENDING':
      return css.grey;
    case 'DECLINED':
      return css.red;
    case 'PROCESSED':
      return css.green;
    case 'APPROVED':
      return css.green;
    default:
      return css.grey;
  }
};
