import { createMemo, createSignal, Switch, Match, batch, Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { SelectCategory } from 'accounting/components/SelectCategory/SelectCategory';
import { SelectVendor } from 'accounting/components/SelectVendor';
import {
  getClosestVendorsToTarget,
  createNewVendorForActivity,
  syncTransaction,
  unlockTransaction,
} from 'accounting/services';
import { useClasses } from 'accounting/stores/classes';
import { useLocations } from 'accounting/stores/locations';
import { useMessages } from 'app/containers/Messages/context';
import type { CodatSupplier } from 'generated/capital';
import { Button } from '_common/components/Button';
import { Popover } from '_common/components/Popover';
import { useResource } from '_common/utils/useResource';
import { wrapAction } from '_common/utils/wrapAction';
import { i18n } from '_common/api/intl';
import { setActivityClass, setActivityLocation } from 'app/services/activity';

import type { TransactionPreviewProps } from '../TransactionPreview';

import css from './TransactionAccounting.css';

interface TransactionAccountingProps extends TransactionPreviewProps {
  onSaveVendor: (supplier: CodatSupplier) => void;
  active: boolean;
}

export const TransactionAccounting = (props: Readonly<TransactionAccountingProps>) => {
  const show = createMemo(() => props.showAccountingAdminView);
  if (!show()) {
    return null;
  }
  const messages = useMessages();
  const classes = useClasses();
  const locations = useLocations();

  const transaction = createMemo(() => props.transaction);

  const [, updateActivityClass] = wrapAction(setActivityClass);
  const [, updateActivityLocation] = wrapAction(setActivityLocation);

  const [location, setLocation] = createSignal(transaction().accountingDetails?.codatLocationId);
  const [codatClass, setCodatClass] = createSignal(transaction().accountingDetails?.codatClassId);

  const [unlockSyncConfirmationOpen, setUnlockSyncConfirmationOpen] = createSignal(false);
  const onCancelUnlock = () => setUnlockSyncConfirmationOpen(false);

  const onUnlock = () => {
    setUnlockSyncConfirmationOpen(false);
    onUnlockTransaction();
  };

  const [vendors, reload, params, setParams, , mutate] = useResource(getClosestVendorsToTarget, {
    target: transaction().merchant?.name || '',
    limit: 5,
  });

  const onChangeVendorSearch = (newTarget: string) => {
    setParams({ ...params(), target: newTarget === '' ? transaction().merchant?.name || '' : newTarget });
    reload();
  };

  const onCreateVendor = (newSupplierName: string) => {
    createNewVendorForActivity({ supplierName: newSupplierName, accountActivityId: transaction().accountActivityId });
    props.onUpdate({
      ...transaction(),
      merchant: { ...transaction().merchant, codatSupplierName: newSupplierName, codatSupplierId: '-1' },
    });
    mutate({ ...vendors(), results: [...(vendors()?.results || []), { id: '-1', supplierName: newSupplierName }] });
  };

  const onSaveClass = (codatClassId: string) => {
    updateActivityClass(transaction().accountActivityId!, codatClassId)
      .then((data) => {
        batch(() => {
          props.onUpdate(data);
          setCodatClass(data.accountingDetails?.codatClassId);
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

  const onSaveLocation = (codatLocationId: string) => {
    updateActivityLocation(transaction().accountActivityId!, codatLocationId)
      .then((data) => {
        batch(() => {
          props.onUpdate(data);
          setLocation(data.accountingDetails?.codatLocationId);
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

  const [syncingTransaction, setSyncingTransaction] = wrapAction(syncTransaction);
  const onSyncTransaction = () => {
    props.onUpdate({ ...transaction(), syncStatus: 'SYNCED_LOCKED' });
    setSyncingTransaction(transaction().accountActivityId!).catch(() => {
      messages.error({ title: i18n.t('Something went wrong') });
    });
  };

  const [, setUnlockingTransaction] = wrapAction(unlockTransaction);
  const onUnlockTransaction = () => {
    props.onUpdate({ ...transaction(), syncStatus: 'READY' });
    setUnlockingTransaction(transaction().accountActivityId!).catch(() => {
      messages.error({ title: i18n.t('Something went wrong') });
    });
  };

  return (
    <div class={css.accounting}>
      <h4 class={css.accountingTitle}>
        <Text message="Accounting" />
      </h4>
      <div class={css.detail}>
        <Text message="Status" />
        {/* TODO: establish enum in BE, use it for rendering & delete below function */}
        <Switch fallback={<span>Ready to sync</span>}>
          <Match when={transaction().syncStatus !== 'READY'}>
            <span>Not ready to sync</span>
          </Match>
        </Switch>
      </div>
      <div class={css.detail}>
        <Text message="Last Sync" />
        <span>
          {props.transaction.lastSyncTime ? new Date(props.transaction.lastSyncTime).toLocaleString() : 'N/A'}
        </span>
      </div>
      <div class={css.fieldSelectContainer}>
        <div class={css.optionTitle}>
          <Text message="Vendor" />
        </div>
        <SelectVendor
          value={props.transaction.merchant?.codatSupplierName}
          merchantName={props.transaction.merchant?.name}
          items={vendors()?.results || []}
          onChangeTarget={onChangeVendorSearch}
          defaultSearchName={transaction().merchant?.name || ''}
          onSelect={props.onSaveVendor}
          onCreate={onCreateVendor}
        />
      </div>
      <Show when={classes.data}>
        <div class={css.fieldSelectContainer}>
          <div>
            <div class={css.optionTitle}>
              <Text message="Class" />
            </div>
            <SelectCategory value={codatClass()} items={classes.data!} onChange={onSaveClass} icon="search" />
          </div>
        </div>
      </Show>
      <Show when={locations.data}>
        <div class={css.fieldSelectContainer}>
          <div>
            <div class={css.optionTitle}>
              <Text message="Location" />
            </div>
            <SelectCategory value={location()} items={locations.data!} onChange={onSaveLocation} icon="search" />
          </div>
        </div>
      </Show>
      <Switch
        fallback={
          <Button
            wide
            icon="sync"
            disabled={transaction().syncStatus !== 'READY' || syncingTransaction() || !props.active}
            onClick={onSyncTransaction}
            data-name="sync-transaction-button"
          >
            <Text message="Sync transaction" />
          </Button>
        }
      >
        <Match when={transaction().syncStatus === 'SYNCED_LOCKED'}>
          <Popover
            balloon
            position="bottom-center"
            open={unlockSyncConfirmationOpen()}
            onClickOutside={() => setUnlockSyncConfirmationOpen(false)}
            trigger="click"
            leaveDelay={0}
            class={css.popup}
            content={
              <div>
                <Text message="Are you sure?" class={css.popupTitle!} />
                <div class={css.popupContent}>
                  <Text message="This transaction has already been synced. Syncing this transaction again will create a duplicate transaction in your accounting system." />
                  <div class={css.footer}>
                    <Button
                      type="default"
                      view="ghost"
                      onClick={onCancelUnlock}
                      data-name="keep-locked-transaction-button"
                    >
                      <Text message="No, keep locked" />
                    </Button>
                    <Button type="danger" onClick={onUnlock} data-name="unlock-transaction-button">
                      <Text message="Unlock" />
                    </Button>
                  </div>
                </div>
              </div>
            }
          >
            {() => (
              <Button
                wide
                icon="lock"
                onClick={() => setUnlockSyncConfirmationOpen(true)}
                data-name="unlock-transaction-button"
              >
                <Text message="Unlock" />
              </Button>
            )}
          </Popover>
        </Match>
      </Switch>
    </div>
  );
};
