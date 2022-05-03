import { Text, useI18n } from 'solid-i18n';
import { createSignal, Show } from 'solid-js';
import { useNavigate } from 'solid-app-router';

import { Section } from 'app/components/Section';
import { setActivityExpenseCategory } from 'app/services/activity';
import { useMessages } from 'app/containers/Messages/context';
import { AutomaticUpdates } from 'accounting/components/AutomaticUpdates';
import { Button } from '_common/components/Button';
import { Popover } from '_common/components/Popover';
import { CreditCardSelect } from '_common/components/CreditCardSelect/CreditCardSelect';
import {
  postIntegrationExpenseCategoryMappings,
  deleteCompanyConnection,
  postCodatCreditCard,
  setCodatCreditCardforBusiness,
  resyncChartOfAccounts,
} from 'accounting/services';
import { ChartOfAccountsData } from 'accounting/components/ChartOfAccountsData';
import { Drawer } from '_common/components/Drawer';
import { EditCardNameForm } from 'accounting/components/EditCardNameForm';
import type { AddChartOfAccountsMappingRequest, PagedDataAccountActivityResponse } from 'generated/capital';
import {
  useIntegrationExpenseCategoryMappings,
  useStoredIntegrationExpenseCategories,
} from 'accounting/stores/integrationExpenseCategories';
import { useRecentUpdateNotifications } from 'accounting/stores/updateNotifications';
import { Icon } from '_common/components/Icon';
import { useBusiness } from 'app/containers/Main/context';

import css from './AccountingSettings.css';

interface AccountingSettingsProps {
  data: Readonly<PagedDataAccountActivityResponse> | null;
}

export function AccountingSettings(props: AccountingSettingsProps) {
  const i18n = useI18n();
  const navigate = useNavigate();
  const messages = useMessages();
  const { business } = useBusiness();

  const [open, setOpen] = createSignal(false);
  const [unlinkingIntegration, setUnlinkingIntegration] = createSignal(false);
  const [editingNewCardName, setEditingNewCardName] = createSignal<boolean>(false);
  const [selectedCardId, setSelectedCardId] = createSignal<string>(business().codatCreditCardId || '');
  const [newCardName, setNewCardName] = createSignal<string>('ClearSpend Card');

  const [canEditNewCard, setCanEditNewCard] = createSignal<boolean>(false);
  const [refreshButtonDisabled, setRefreshButtonDisabled] = createSignal<boolean>(false);

  // TODO replace with notification endpoint that dismisses on logout
  const updateNotifications = useRecentUpdateNotifications();
  const integrationExpenseCategoryStore = useStoredIntegrationExpenseCategories();
  const integrationExpenseCategoryMappingStore = useIntegrationExpenseCategoryMappings();
  const handleSave = (mappings: Readonly<AddChartOfAccountsMappingRequest | null>[]) =>
    postIntegrationExpenseCategoryMappings(mappings);

  const transactionData = props.data?.content ?? [];

  const onUnlinkIntegration = async () => {
    setUnlinkingIntegration(true);
    try {
      await Promise.all([
        deleteCompanyConnection(),
        transactionData.forEach((item) => {
          if (item.syncStatus !== 'SYNCED_LOCKED')
            setActivityExpenseCategory(item.accountActivityId!, null, item.notes || '');
        }),
      ]);
      messages.success({
        title: i18n.t('Success'),
        message: i18n.t('The integration has been successfully unlinked.'),
      });
      setUnlinkingIntegration(false);
      navigate('/');
    } catch (error: unknown) {
      setUnlinkingIntegration(false);
      messages.error({ title: i18n.t('Something went wrong') });
    }
  };

  const saveSelectedCreditCard = async (cardId: string) => {
    try {
      await setCodatCreditCardforBusiness({
        accountId: cardId,
      });
    } catch {
      // TODO: handle error
    }
  };

  const refreshChartOfAccounts = () => {
    resyncChartOfAccounts();
    setRefreshButtonDisabled(true);
  };

  const saveNewCreditCard = async (cardName: string) => {
    setNewCardName(cardName);
    setEditingNewCardName(false);

    try {
      await postCodatCreditCard({
        accountName: cardName,
      });
    } catch {
      // TODO: handle error
    }
  };

  const onSaveCreditCard = async () => {
    if (selectedCardId() === '') {
      saveNewCreditCard(newCardName()).catch();
    } else {
      saveSelectedCreditCard(selectedCardId()).catch();
    }
  };

  return (
    <div>
      <Section
        title="Automatic updates"
        description={
          <Text
            message={
              'When new expense accounts are created in Quickbooks, ' +
              'automatically assign a new expense category in ClearSpend.'
            }
          />
        }
        class={css.section}
      >
        <AutomaticUpdates name="automatic-updates-toggle" />
      </Section>
      <Section
        title={<Text message="Chart of Accounts" />}
        // description={<Text message="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />}
        class={css.section}
      >
        <div class={css.refreshButtonContainer}>
          <Button class={css.refreshButton} onClick={refreshChartOfAccounts} disabled={refreshButtonDisabled()}>
            <div class={css.refreshButtonContent}>
              <Icon name={'refresh'} />
              <Text message="Update Chart of Accounts" />
            </div>
          </Button>
        </div>
        <ChartOfAccountsData
          loading={integrationExpenseCategoryStore.loading || integrationExpenseCategoryMappingStore.loading}
          error={integrationExpenseCategoryStore.error}
          data={integrationExpenseCategoryStore.data}
          newCategories={updateNotifications.data || []}
          mappings={integrationExpenseCategoryMappingStore.data}
          onSave={handleSave}
          onReload={async () => {
            integrationExpenseCategoryStore.reload();
            integrationExpenseCategoryMappingStore.reload();
          }}
          saveOnChange={true}
          showDeleted={false}
        />
      </Section>
      <Section
        title={<Text message="Credit Card account" />}
        description={<Text message="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />}
        class={css.section}
      >
        <CreditCardSelect
          newCardName={newCardName}
          selectedCardId={selectedCardId}
          setSelectedCardId={setSelectedCardId}
          setCanEditNewCard={setCanEditNewCard}
        ></CreditCardSelect>
        <div class={css.creditCardButtons}>
          <Button onClick={onSaveCreditCard} class={css.editButton}>
            <Text message={'Save'} />
          </Button>
          <Show when={canEditNewCard()}>
            <Button
              class={css.editButton}
              onClick={() => setEditingNewCardName(true)}
              icon={{ name: 'edit', pos: 'left' }}
            >
              <Text message="Edit Card Name" />
            </Button>
          </Show>
        </div>
        <Drawer
          open={editingNewCardName()}
          title={<Text message="New Card" />}
          onClose={() => setEditingNewCardName(false)}
        >
          <EditCardNameForm
            cardName={newCardName}
            onSave={(data: string) => {
              setNewCardName(data);
              setEditingNewCardName(false);
            }}
          />
        </Drawer>
      </Section>
      <Section
        title={<Text message="Unlink Account" />}
        // description={<Text message="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />}
        class={css.section}
      >
        <Popover
          balloon
          open={open()}
          onClickOutside={() => setOpen(false)}
          class={css.popoverRoot}
          content={
            <div>
              {/* <Text message="Lorem ipsum dolor sit amet, consectetur adipiscing elit." /> */}
              <div class={css.popoverButtons}>
                <Button view="ghost" onClick={() => setOpen(false)}>
                  <Text message="Cancel" />
                </Button>
                <Button
                  class={css.popoverUnlink}
                  icon={{ name: 'confirm', pos: 'right' }}
                  disabled={unlinkingIntegration()}
                  loading={unlinkingIntegration()}
                  onClick={onUnlinkIntegration}
                >
                  <Text message="Unlink now" />
                </Button>
              </div>
            </div>
          }
        >
          <Button size="lg" icon="trash" class={css.unlink} onClick={() => setOpen(true)}>
            <Text message="Unlink account" />
          </Button>
        </Popover>
      </Section>
    </div>
  );
}
