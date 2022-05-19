import { useNavigate } from 'solid-app-router';
import { useI18n, Text } from 'solid-i18n';
import { createSignal, createMemo, batch, Show, Switch, Match } from 'solid-js';

import type { AccountActivityResponse, CodatSupplier } from 'generated/capital';
import { KEY_CODES } from '_common/constants/keyboard';
import { Icon } from '_common/components/Icon';
import { Input } from '_common/components/Input';
import { formatCurrency } from '_common/api/intl/formatCurrency';
import { Button } from '_common/components/Button';
import { AccountCard } from 'app/components/AccountCard';
import { useMessages } from 'app/containers/Messages/context';
import { getAvailableBalance } from 'allocations/utils/getAvailableBalance';
import { formatCardNumber } from 'cards/utils/formatCardNumber';
import { formatName } from 'employees/utils/formatName';
import { setActivityNote, setActivityDetails } from 'app/services/activity';
import { wrapAction } from '_common/utils/wrapAction';
import { Tag, TagProps } from '_common/components/Tag';
import { useExpenseCategories } from 'accounting/stores/expenseCategories';
import { SelectExpenseCategory } from 'accounting/components/SelectExpenseCategory';
import { getNoop } from '_common/utils/getNoop';
import { CopyButton } from 'app/components/CopyButton';
import { hasSomeManagerRole } from 'allocations/utils/permissions';
import { useBusiness } from 'app/containers/Main/context';
import { paymentType } from 'transactions/components/DeclineReason/constants';

import { DeclineReason } from '../../components/DeclineReason';
import { MerchantLogo } from '../../components/MerchantLogo';
import { TransactionPreviewStatus } from '../../components/TransactionPreviewStatus';
import { TransactionDateTime } from '../../components/TransactionDateTime';
import { formatMerchantType } from '../../utils/formatMerchantType';
import { MERCHANT_CATEGORIES } from '../../constants';
import { TransactionReceipts } from '../TransactionReceipts';

import { TransactionAccounting } from './TransactionAccounting';

import css from './TransactionPreview.css';

const SYNC_STATUS_TYPES: Record<string, Required<TagProps>['type']> = {
  READY: 'success',
  NOT_READY: 'warning',
  SYNCED_LOCKED: 'default',
};

export interface TransactionPreviewProps {
  showAccountingAdminView?: boolean;
  transaction: Readonly<AccountActivityResponse>;
  onUpdate: (data: Readonly<AccountActivityResponse[]>) => void;
  onReport: () => void;
}

const AllocationCard = (props: { allocationName?: string }) => {
  if (!props.allocationName) return null;

  const { allocations, currentUserRoles } = useBusiness();

  if (!hasSomeManagerRole(currentUserRoles())) {
    return (
      <>
        <h4 class={css.title}>
          <Text message="Allocation" />
        </h4>
        <AccountCard icon="allocations" title={props.allocationName} />
      </>
    );
  }

  const navigate = useNavigate();

  // TODO: Replace accountName with allocationId after CAP-721
  const allocation = createMemo(() => allocations().find((item) => item.name === props.allocationName));

  return (
    <Show when={allocation()}>
      <h4 class={css.title}>
        <Text message="Allocation" />
      </h4>
      <AccountCard
        icon="allocations"
        title={allocation()!.name}
        text={formatCurrency(getAvailableBalance(allocation()!))}
        onClick={() => navigate(`/allocations/${allocation()!.allocationId}`)}
      />
    </Show>
  );
};

export function TransactionPreview(props: Readonly<TransactionPreviewProps>) {
  const i18n = useI18n();
  const messages = useMessages();
  const navigate = useNavigate();

  const transaction = createMemo(() => props.transaction);
  const requestedAmount = createMemo(() => formatCurrency(transaction().requestedAmount?.amount || 0));
  const displayAmount = createMemo(() => formatCurrency(transaction().amount?.amount || 0));
  const originalAmount = createMemo(() => {
    if (
      !transaction().merchant?.amount?.amount ||
      !transaction().merchant?.amount?.currency ||
      transaction().merchant?.amount?.currency === 'USD'
    ) {
      return null;
    }
    return formatCurrency(transaction().merchant?.amount?.amount || 0, {
      currency: transaction().merchant?.amount?.currency,
    });
  });

  const [note, setNote] = createSignal<string>();
  const notes = createMemo(() => transaction().notes || note());
  const [savingNote, saveNote] = wrapAction(setActivityNote);

  const onSaveNote = () => {
    saveNote(props.transaction.accountActivityId!, {
      notes: note()!,
      expenseCategoryId: props.transaction.expenseDetails?.expenseCategoryId,
    })
      .then((data) => {
        batch(() => {
          props.onUpdate([data]);
          setNote(undefined);
          messages.success({
            title: i18n.t('Success'),
            message: i18n.t('Your changes have been successfully saved.'),
          });
        });
      })
      .catch(() => {
        messages.error({ title: i18n.t('Something went wrong') });
      });
  };

  const expenseCategories = useExpenseCategories({ initValue: [] });
  const [expenseCategory, setExpenseCategory] = createSignal(transaction().expenseDetails?.expenseCategoryId);
  const [supplierId, setSupplierId] = createSignal(transaction().merchant?.codatSupplierId);
  const [supplierName, setSupplierName] = createSignal(transaction().merchant?.codatSupplierName);
  const [updatingActivityDetails, updateActivityDetails] = wrapAction(setActivityDetails);
  const activeCategories = createMemo(() => expenseCategories.data!.filter((category) => category.status === 'ACTIVE'));

  const categoryIsActive = (categoryId: string | undefined | null): boolean => {
    return categoryId === undefined || activeCategories().some((category) => category.expenseCategoryId === categoryId);
  };

  const onSaveExpenseCategory = (categoryId: string | undefined) => {
    updateActivityDetails(
      props.transaction.accountActivityId!,
      categoryId || null,
      notes() || '',
      supplierId() || null,
      supplierName() || null,
    )
      .then((data) => {
        batch(() => {
          props.onUpdate([{ ...data, syncStatus: categoryId && supplierId() ? 'READY' : 'NOT_READY' }]);
          setExpenseCategory(categoryId);
          messages.success({
            title: i18n.t('Success'),
            message: i18n.t('Your changes have been successfully saved.'),
          });
        });
      })
      .catch(() => {
        setExpenseCategory(undefined);
        messages.error({ title: i18n.t('Something went wrong') });
      });
  };

  const onSaveVendor = (supplier: CodatSupplier) => {
    updateActivityDetails(
      props.transaction.accountActivityId!,
      expenseCategory() || null,
      notes() || '',
      supplier.id || null,
      supplier.supplierName || null,
    )
      .then((data) => {
        batch(() => {
          props.onUpdate([{ ...data, syncStatus: expenseCategory() && supplier.id ? 'READY' : 'NOT_READY' }]);
          setSupplierId(supplier.id);
          setSupplierName(supplier.supplierName);
          messages.success({
            title: i18n.t('Success'),
            message: i18n.t('Your changes have been successfully saved.'),
          });
        });
      })
      .catch(() => {
        setExpenseCategory(undefined);
        messages.error({ title: i18n.t('Something went wrong') });
      });
  };

  const canSubmitNote = createMemo(() => {
    return (note() === '' && transaction().notes !== '') || (note() && note() !== transaction().notes);
  });

  const isSyncedLockedDashboard = !props.showAccountingAdminView && transaction().syncStatus === 'SYNCED_LOCKED';

  return (
    <div class={css.root}>
      <TransactionPreviewStatus status={transaction().status!} type={transaction().type} />
      <DeclineReason details={transaction().declineDetails} class={css.declineReason} />
      <div class={css.scroll}>
        <div class={css.summary}>
          <Show when={transaction().merchant}>
            <MerchantLogo size="lg" data={transaction().merchant!} class={css.merchantLogo} />
          </Show>
          <div class={css.amount}>{transaction().status === 'PENDING' ? requestedAmount() : displayAmount()}</div>
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
                <Match when={transaction().syncStatus === 'SYNCED_LOCKED'}>
                  <Tag size="sm" type={SYNC_STATUS_TYPES.SYNCED_LOCKED} class={css.syncedLockedTag}>
                    <Icon class={css.syncTagIcon} size="sm" name="lock" />
                    <Text message="Synced and locked" />
                  </Tag>
                </Match>
                <Match when={transaction().syncStatus !== 'READY'}>
                  <Tag size="sm" type={SYNC_STATUS_TYPES.NOT_READY}>
                    <Icon class={css.syncTagIcon} size="sm" name="warning-rounded" />
                    <Text message="Not ready to sync" />
                  </Tag>
                </Match>
              </Switch>
            </div>
          </Show>
        </div>
        <TransactionAccounting {...props} onSaveVendor={onSaveVendor} active={categoryIsActive(expenseCategory())} />
        <div class={css.properties}>
          <TransactionReceipts data={transaction()} onUpdate={props.onUpdate} />
          <div class={css.expenseCategory}>
            <div class={css.optionTitle}>
              <Text message="Expense Category" />
            </div>
            <SelectExpenseCategory
              icon="search"
              value={expenseCategory()}
              items={activeCategories()}
              placeholder={String(i18n.t('Assign a category'))}
              error={!categoryIsActive(expenseCategory())}
              loading={updatingActivityDetails()}
              disabled={transaction().syncStatus === 'SYNCED_LOCKED'}
              onChange={onSaveExpenseCategory}
            />
            <Show when={!categoryIsActive(expenseCategory())}>
              <div class={css.unmappedCategoryWarning}>
                <Text message="Please choose a new expense category" />
              </div>
            </Show>
          </div>
          <div class={css.comments}>
            <div class={css.optionTitle}>
              <Text message="Comments" />
            </div>
            <Input
              prefix={<Icon name="file" size="sm" />}
              inputClass={css.noteInput}
              suffix={
                <Show when={canSubmitNote()}>
                  <Button
                    size="sm"
                    icon="edit"
                    view="ghost"
                    loading={savingNote()}
                    class={css.noteButton}
                    onClick={onSaveNote}
                    data-name="save-note-button"
                  />
                </Show>
              }
              placeholder={String(i18n.t('Add transaction comments'))}
              value={notes()}
              disabled={savingNote() || transaction().syncStatus === 'SYNCED_LOCKED'}
              onKeyDown={(event: KeyboardEvent) => {
                if (event.keyCode === KEY_CODES.Enter && canSubmitNote()) {
                  onSaveNote();
                }
              }}
              onChange={setNote}
              onFocusOut={canSubmitNote() ? onSaveNote : getNoop}
            />
          </div>
          <Show when={isSyncedLockedDashboard}>
            <div class={css.row}>
              <Icon size="md" name="alert" class={css.icon} />
              <div class={css.text}>
                <Text message="The transaction has been synced with your accounting software. Expense category and comments can not be changed." />
              </div>
            </div>
          </Show>
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
        <AllocationCard allocationName={transaction().accountName} />
        <Show when={transaction().merchant}>
          <h4 class={css.title}>
            <Text message="Merchant" />
          </h4>
          <div class={css.detail}>
            <Text message="Merchant name" />
            <span>{transaction().merchant!.name}</span>
          </div>
          <Show when={transaction().merchant?.statementDescriptor}>
            <div class={css.detail}>
              <Text message="Statement descriptor" />
              <span>{transaction().merchant?.statementDescriptor!}</span>
            </div>
          </Show>
          <div class={css.detail}>
            <Text message="Merchant ID" />
            <span>{transaction().merchant!.merchantNumber}</span>
          </div>
          <div class={css.detail}>
            <Text message="Merchant category" />
            <span>{MERCHANT_CATEGORIES[transaction().merchant!.merchantCategoryGroup!].name}</span>
          </div>
        </Show>
        <h4 class={css.title}>
          <Text message="Transaction details" />
        </h4>
        <div class={css.detail}>
          <Text message="Posted on" />
          <TransactionDateTime date={transaction().activityTime} />
        </div>
        <Show when={requestedAmount()}>
          <div class={css.detail}>
            <Text message="Requested amount" />
            <span>{requestedAmount()}</span>
          </div>
        </Show>
        <div class={css.detail}>
          <Show when={transaction().status === 'PENDING'} fallback={<Text message="Posted amount" />}>
            <Text message="Hold amount" />
          </Show>
          <span>{displayAmount()}</span>
        </div>
        <Show when={originalAmount()}>
          <div class={css.detail}>
            <Text message="Original amount" />
            <span>{originalAmount()}</span>
          </div>
        </Show>
        <Show when={transaction().paymentDetails?.foreign || transaction().paymentDetails?.foreignTransactionFee}>
          <div class={css.detail}>
            <Text message="Foreign exchange fee" />
            <span>{formatCurrency(transaction().paymentDetails?.foreignTransactionFee || 0)}</span>
          </div>
        </Show>
        <Show when={transaction().paymentDetails?.paymentType}>
          <div class={css.detail}>
            <Text message="Payment type" />
            <span>{paymentType[transaction().paymentDetails!.paymentType!]}</span>
          </div>
        </Show>
        <div class={css.detail}>
          <Text message="ID" />
          <span>
            {transaction().accountActivityId}
            <CopyButton value={transaction().accountActivityId!} class={css.copy} />
          </span>
        </div>
      </div>
      <Show when={transaction().status === 'APPROVED'}>
        <div class={css.actions}>
          <Button onClick={() => props.onReport()} wide icon={{ name: 'alert', pos: 'right' }}>
            <Text message="Report an issue" />
          </Button>
        </div>
      </Show>
    </div>
  );
}
