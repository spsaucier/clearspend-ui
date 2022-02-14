import { useNavigate } from 'solid-app-router';
import { useI18n, Text, DateTime } from 'solid-i18n';
import { createSignal, createMemo, batch, Show } from 'solid-js';

import type { AccountActivityResponse } from 'generated/capital';
import { KEY_CODES } from '_common/constants/keyboard';
import { DateFormat } from '_common/api/intl/types';
import { Icon } from '_common/components/Icon';
import { Input } from '_common/components/Input';
import { formatCurrency } from '_common/api/intl/formatCurrency';
import { Button } from '_common/components/Button';
import { useResource } from '_common/utils/useResource';
import { useMessages } from 'app/containers/Messages/context';
import { formatCardNumber } from 'cards/utils/formatCardNumber';
import { formatName } from 'employees/utils/formatName';
import { AccountItem } from 'company/components/AccountItem';
import { join } from '_common/utils/join';
import {
  getActivityById,
  setActivityNote,
  linkReceiptToActivity,
  uploadReceiptForActivity,
  viewReceipt,
} from 'app/services/activity';
import { wrapAction } from '_common/utils/wrapAction';

import { MerchantLogo } from '../MerchantLogo';
import { formatMerchantType } from '../../utils/formatMerchantType';
import { formatActivityStatus } from '../../utils/formatActivityStatus';
import { STATUS_FILL_ICONS, MERCHANT_CATEGORIES } from '../../constants';
import type { ActivityStatus } from '../../types';

import type { ReceiptVideModel } from './ReceiptsView';

import css from './TransactionPreview.css';

const STATUS_COLORS: Record<ActivityStatus, string | undefined> = {
  APPROVED: css.approved,
  PROCESSED: css.approved,
  DECLINED: css.declined,
  CANCELED: css.declined,
  PENDING: undefined,
  CREDIT: undefined,
};

interface TransactionPreviewProps {
  transaction: AccountActivityResponse;
  onViewReceipt: (receipts: Readonly<ReceiptVideModel[]>) => void;
}

export function TransactionPreview(props: Readonly<TransactionPreviewProps>) {
  const i18n = useI18n();
  const messages = useMessages();
  const navigate = useNavigate();

  const [transaction, setTransaction] = createSignal<Readonly<AccountActivityResponse>>(props.transaction);
  const displayAmount = formatCurrency(transaction().amount?.amount || 0);

  const [uploading, uploadReceipt] = wrapAction(async (e: Event) => {
    const formData = new FormData();
    formData.append('receipt', (e.target as HTMLInputElement).files?.[0] as File);
    const { receiptId } = await uploadReceiptForActivity(formData);
    await linkReceiptToActivity(transaction().accountActivityId!, receiptId);
    setTransaction(await getActivityById(transaction().accountActivityId!));
  });

  const [note, setNote] = createSignal<string>();
  const notes = createMemo(() => transaction().notes || note());
  const [savingNote, saveNote] = wrapAction(setActivityNote);

  const onSaveNote = () => {
    saveNote(props.transaction.accountActivityId!, note()!)
      .then((data) => {
        batch(() => {
          setTransaction(data);
          setNote(undefined);
        });
      })
      .catch(() => {
        messages.error({ title: i18n.t('Something went wrong') });
      });
  };

  const receiptIds = createMemo(() => transaction().receipt?.receiptId || []);
  const [receipts, receiptsStatus, , , reloadReceipts] = useResource(() => Promise.all(receiptIds().map(viewReceipt)));

  return (
    <div class={css.root}>
      <div class={join(css.status, STATUS_COLORS[transaction().status!])}>
        <Icon name={STATUS_FILL_ICONS[transaction().status!]} size="sm" class={css.statusIcon} />
        <span>{formatActivityStatus(transaction().status)}</span>
      </div>
      <div class={css.summary}>
        <Show when={transaction().merchant}>
          <MerchantLogo size="lg" data={transaction().merchant!} class={css.merchantLogo} />
        </Show>
        <div class={css.amount}>{displayAmount}</div>
        <div class={css.merchant}>
          {transaction().merchant?.name}
          <span> &#8226; </span>
          {formatMerchantType(transaction().merchant?.type)}
        </div>
        <div class={css.date}>
          <DateWithDateTime activityTime={transaction().activityTime!} />
        </div>
        <div class={css.receiptCta}>
          <Show when={receiptIds().length}>
            <Button
              wide
              loading={receiptsStatus().loading}
              icon="receipt"
              onClick={() => {
                if (receiptsStatus().error) {
                  reloadReceipts().then(() => {
                    if (receipts()) props.onViewReceipt(receipts()!);
                    else messages.error({ title: i18n.t('Something went wrong') });
                  });
                } else props.onViewReceipt(receipts()!);
              }}
            >
              <Text message="View Receipt" />
            </Button>
          </Show>
          <Show when={!receiptIds().length && allowReceiptUpload(transaction())}>
            <label for="receipt-upload" class={css.receiptCtaLabel}>
              <Button wide icon="add-receipt" loading={uploading()}>
                <Text message="Add Receipt" />
              </Button>
            </label>
          </Show>
          <Show when={receiptIds().length && allowReceiptUpload(transaction())}>
            <label for="receipt-upload" class={css.receiptCtaLabel}>
              <Button wide icon="receipt" loading={uploading()}>
                <Text message="Upload more images" />
              </Button>
            </label>
          </Show>
          <input type="file" id="receipt-upload" accept="image/*" onChange={uploadReceipt} />
        </div>
      </div>
      <div class={css.scroll}>
        <div>
          <Input
            prefix={<Icon name="file" size="sm" />}
            suffix={
              <Show when={note()}>
                <Button
                  size="sm"
                  icon="edit"
                  view="ghost"
                  loading={savingNote()}
                  class={css.noteButton}
                  onClick={onSaveNote}
                />
              </Show>
            }
            placeholder={String(i18n.t('Add transaction comments'))}
            value={notes()}
            disabled={savingNote()}
            onKeyDown={(event: KeyboardEvent) => {
              if (event.keyCode === KEY_CODES.Enter) onSaveNote();
            }}
            onChange={setNote}
          />
        </div>
        <Show when={transaction().card}>
          <h4 class={css.title}>
            <Text message="Card" />
          </h4>
          <AccountItem
            icon="card"
            // TODO need activated status
            title={formatCardNumber(transaction().card!.lastFour, true)}
            text={formatName({
              firstName: transaction().card?.ownerFirstName!,
              lastName: transaction().card?.ownerLastName!,
            })}
            onClick={() => navigate(`/cards/view/${transaction().card?.cardId}`)}
          />
        </Show>
        <Show when={transaction().merchant}>
          <h4 class={css.title}>
            <Text message="Merchant" />
          </h4>
          <div class={css.detail}>
            <Text message="Merchant Name" />
            <span>{transaction().merchant!.name}</span>
          </div>
          <div class={css.detail}>
            <Text message="Merchant ID" />
            <span>{transaction().merchant!.merchantNumber}</span>
          </div>
          <div class={css.detail}>
            <Text message="Merchant Category" />
            <span>{MERCHANT_CATEGORIES[transaction().merchant!.merchantCategoryGroup!].name}</span>
          </div>
        </Show>
        <h4 class={css.title}>
          <Text message="Transaction Details" />
        </h4>
        <div class={css.detail}>
          <Text message="Posted On" />
          <DateWithDateTime activityTime={transaction().activityTime!} />
        </div>
        <div class={css.detail}>
          <Text message="Posted Amount" />
          <span>{displayAmount}</span>
        </div>
      </div>
      <div class={css.actions}>
        <Button wide icon={{ name: 'alert', pos: 'right' }}>
          <Text message="Report an issue" />
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
    <span>
      <DateTime date={date} />
      <span> &#8226; </span>
      <DateTime date={date} preset={DateFormat.time} />
    </span>
  );
};
