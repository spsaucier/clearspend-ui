import { useNavigate } from 'solid-app-router';
import { useI18n, Text } from 'solid-i18n';
import { createSignal, createMemo, batch, Show, For, Switch, Match } from 'solid-js';

import type { AccountActivityResponse, ExpenseCategory } from 'generated/capital';
import { KEY_CODES } from '_common/constants/keyboard';
import { Icon } from '_common/components/Icon';
import { Input } from '_common/components/Input';
import { formatCurrency } from '_common/api/intl/formatCurrency';
import { Button } from '_common/components/Button';
import { useResource } from '_common/utils/useResource';
import { AccountCard } from 'app/components/AccountCard';
import { useMessages } from 'app/containers/Messages/context';
import { formatCardNumber } from 'cards/utils/formatCardNumber';
import { formatName } from 'employees/utils/formatName';
import {
  getActivityById,
  setActivityNote,
  linkReceiptToActivity,
  uploadReceiptForActivity,
  viewReceipt,
  setActivityExpenseCategory,
} from 'app/services/activity';
import { wrapAction } from '_common/utils/wrapAction';
import { Tag, TagProps } from '_common/components/Tag';
import { useExpenseCategories } from 'accounting/stores/expenseCategories';
import { SelectExpenseCategory, SelectExpenseCategoryOption } from 'accounting/components/SelectExpenseCategory';
import { syncTransaction } from 'accounting/services';

import { MerchantLogo } from '../MerchantLogo';
import { TransactionPreviewStatus } from '../TransactionPreviewStatus';
import { TransactionDateTime } from '../TransactionDateTime';
import { formatMerchantType } from '../../utils/formatMerchantType';
import { MERCHANT_CATEGORIES } from '../../constants';

import type { ReceiptVideModel } from './ReceiptsView';

import css from './TransactionPreview.css';

const SYNC_STATUS_TYPES: Record<string, Required<TagProps>['type']> = {
  READY: 'success',
  NOT_READY: 'warning',
  SYNCED_LOCKED: 'default',
};

interface TransactionPreviewProps {
  transaction: Readonly<AccountActivityResponse>;
  onUpdate: (data: Readonly<AccountActivityResponse>) => void;
  onViewReceipt: (receipts: Readonly<ReceiptVideModel[]>) => void;
  showAccountingAdminView?: boolean;
}

export function TransactionPreview(props: Readonly<TransactionPreviewProps>) {
  const i18n = useI18n();
  const messages = useMessages();
  const navigate = useNavigate();

  let fileInput!: HTMLInputElement;

  const transaction = createMemo(() => props.transaction);
  const displayAmount = createMemo(() => formatCurrency(transaction().amount?.amount || 0));

  const receiptIds = createMemo(() => transaction().receipt?.receiptId || []);
  const [receipts, receiptsStatus, , , reloadReceipts] = useResource(() => Promise.all(receiptIds().map(viewReceipt)));

  const onUploadClick = () => fileInput.click();

  const [uploading, uploadReceipt] = wrapAction(async (e: Event) => {
    const formData = new FormData();
    formData.append('receipt', (e.target as HTMLInputElement).files?.[0] as File);
    const { receiptId } = await uploadReceiptForActivity(formData);
    await linkReceiptToActivity(transaction().accountActivityId!, receiptId);
    props.onUpdate(await getActivityById(transaction().accountActivityId!));
    reloadReceipts();
  });

  const [note, setNote] = createSignal<string>();
  const notes = createMemo(() => transaction().notes || note());
  const [savingNote, saveNote] = wrapAction(setActivityNote);

  const onSaveNote = () => {
    saveNote(props.transaction.accountActivityId!, note()!)
      .then((data) => {
        batch(() => {
          props.onUpdate(data);
          setNote(undefined);
        });
      })
      .catch(() => {
        messages.error({ title: i18n.t('Something went wrong') });
      });
  };

  const expenseCategories = useExpenseCategories({ initValue: [] });
  const [expenseCategory, setExpenseCategory] = createSignal<ExpenseCategory | undefined>(transaction().expenseDetails);
  const [savingExpenseCategory, saveExpenseCategory] = wrapAction(setActivityExpenseCategory);

  const onSaveExpenseCategory = (ec: ExpenseCategory | undefined) => {
    saveExpenseCategory(props.transaction.accountActivityId!, ec?.iconRef!, notes() || '')
      .then((data) => {
        batch(() => {
          props.onUpdate(data);
          setExpenseCategory(ec);
        });
      })
      .catch(() => {
        setExpenseCategory(undefined);
        messages.error({ title: i18n.t('Something went wrong') });
      });
  };

  const [syncingTransaction, setSyncingTransaction] = wrapAction(syncTransaction);
  const onSyncTransaction = () => {
    setSyncingTransaction(transaction().accountActivityId!).catch(() => {
      messages.error({ title: i18n.t('Something went wrong') });
    });
  };

  return (
    <div class={css.root}>
      <TransactionPreviewStatus status={transaction().status!} />
      <div class={css.summary}>
        <Show when={transaction().merchant}>
          <MerchantLogo size="lg" data={transaction().merchant!} class={css.merchantLogo} />
        </Show>
        <div class={css.amount}>{displayAmount()}</div>
        <div class={css.merchant}>
          {transaction().merchant?.name}
          <span> &#8226; </span>
          {formatMerchantType(transaction().merchant?.type)}
        </div>
        <div class={css.date}>
          <TransactionDateTime date={transaction().activityTime} />
        </div>
        <Show when={props.showAccountingAdminView}>
          <div class={css.syncTag}>
            {/* TODO: establish enum in BE, use it for rendering & delete below function */}
            <Switch
              fallback={
                <Tag size="sm" type={SYNC_STATUS_TYPES.READY}>
                  <Icon class={css.syncTagIcon} size="sm" name="sync" />
                  <span>Ready to sync</span>
                </Tag>
              }
            >
              <Match when={!expenseCategory()}>
                <Tag size="sm" type={SYNC_STATUS_TYPES.NOT_READY}>
                  <Icon class={css.syncTagIcon} size="sm" name="warning-rounded" />
                  <span>Not ready to sync</span>
                </Tag>
              </Match>
            </Switch>
          </div>
        </Show>
      </div>
      <div class={css.scroll}>
        <Show when={props.showAccountingAdminView}>
          <div class={css.accounting}>
            <h4 class={css.accountingTitle}>
              <Text message="Accounting" />
            </h4>
            <div class={css.detail}>
              <Text message="Status" />
              {/* TODO: establish enum in BE, use it for rendering & delete below function */}
              <Switch fallback={<span>Ready to sync</span>}>
                <Match when={!expenseCategory()}>
                  <span>Not ready to sync</span>
                </Match>
              </Switch>
            </div>
            <div class={css.detail}>
              <Text message="Last Sync" />
              {/* TODO: get last sync time from BE when available */}
              <span>N/A</span>
            </div>
            <Button wide icon="sync" disabled={!expenseCategory() || syncingTransaction()} onClick={onSyncTransaction}>
              <Text message="Sync transaction" />
            </Button>
          </div>
        </Show>
        <div class={css.properties}>
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
              <Button wide icon="add-receipt" loading={uploading()} onClick={onUploadClick}>
                <Text message="Add Receipt" />
              </Button>
            </Show>
            <Show when={receiptIds().length && allowReceiptUpload(transaction())}>
              <Button wide icon="receipt" loading={uploading()} onClick={onUploadClick}>
                <Text message="Upload more images" />
              </Button>
            </Show>
            <input ref={fileInput} type="file" accept="image/*" onChange={uploadReceipt} />
          </div>
          <div class={css.expenseCategory}>
            <div class={css.optionTitle}>
              <Text message="Expense Category" />
            </div>
            <SelectExpenseCategory
              value={expenseCategory()}
              onChange={(ec) => onSaveExpenseCategory(ec)}
              disabled={savingExpenseCategory()}
            >
              <For each={expenseCategories.data}>
                {(item) => <SelectExpenseCategoryOption value={item}>{item.categoryName}</SelectExpenseCategoryOption>}
              </For>
            </SelectExpenseCategory>
          </div>
          <div class={css.comments}>
            <div class={css.optionTitle}>
              <Text message="Comments" />
            </div>
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
        </div>
        <Show when={transaction().card}>
          <h4 class={css.title}>
            <Text message="Card" />
          </h4>
          <AccountCard
            icon="card"
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
          <TransactionDateTime date={transaction().activityTime} />
        </div>
        <div class={css.detail}>
          <Text message="Posted Amount" />
          <span>{displayAmount()}</span>
        </div>
      </div>
      <div class={css.actions}>
        {/*
        <Button wide icon={{ name: 'alert', pos: 'right' }}>
          <Text message="Report an issue" />
        </Button>
        */}
      </div>
    </div>
  );
}

const allowReceiptUpload = (transaction: AccountActivityResponse) => {
  return transaction.merchant && ['PENDING', 'APPROVED', 'PROCESSED'].includes(transaction.status!);
};
