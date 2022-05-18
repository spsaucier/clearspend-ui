import { batch, createSignal, createMemo, Show } from 'solid-js';
import { Text, useI18n } from 'solid-i18n';
import { useNavigate } from 'solid-app-router';

import { until } from '_common/utils/until';
import { useResource } from '_common/utils/useResource';
import { FormItem } from '_common/components/Form';
import { Section } from 'app/components/Section';
import { setActivityDetails } from 'app/services/activity';
import { useMessages } from 'app/containers/Messages/context';
import { AutomaticUpdates } from 'accounting/components/AutomaticUpdates';
import { Button } from '_common/components/Button';
import { Popover } from '_common/components/Popover';
import { Data } from 'app/components/Data';
import { CreditCardSelect, NEW_CREDIT_CARD_ID } from 'accounting/components/CreditCardSelect';
import {
  postIntegrationExpenseCategoryMappings,
  deleteCompanyConnection,
  addBusinessCreditCard,
  updateBusinessCreditCard,
  getCodatCreditCards,
} from 'accounting/services';
import { ChartOfAccountsData } from 'accounting/components/ChartOfAccountsData';
import { Drawer } from '_common/components/Drawer';
import { EditCardNameForm } from 'accounting/components/EditCardNameForm';
import type {
  AddChartOfAccountsMappingRequest,
  PagedDataAccountActivityResponse,
  CodatBankAccount,
} from 'generated/capital';
import { canManageCards } from 'allocations/utils/permissions';
import { useRecentUpdateNotifications } from 'accounting/stores/updateNotifications';
import { useBusiness } from 'app/containers/Main/context';

import css from './AccountingSettings.css';

interface AccountingSettingsProps {
  data: Readonly<PagedDataAccountActivityResponse> | null;
}

export function AccountingSettings(props: AccountingSettingsProps) {
  const i18n = useI18n();
  const navigate = useNavigate();
  const messages = useMessages();

  const { business, permissions, mutate } = useBusiness();

  const [open, setOpen] = createSignal(false);
  const [unlinkingIntegration, setUnlinkingIntegration] = createSignal(false);

  const [creditCards, cardsStatus, , , reloadCards] = useResource(getCodatCreditCards);
  const [newCreditCard, setNewCreditCard] = createSignal<Required<CodatBankAccount>>();
  const [selectedCardId, setSelectedCardId] = createSignal<string | undefined>(business().codatCreditCardId);
  const [openEditCardName, setOpenEditCardName] = createSignal(false);
  const [savingCard, setSavingCard] = createSignal(false);

  const cards = createMemo(() => {
    const items = creditCards();
    const newCard = newCreditCard();
    return items ? (newCard ? [newCard, ...items] : items) : [];
  });

  // TODO replace with notification endpoint that dismisses on logout
  const updateNotifications = useRecentUpdateNotifications();

  const handleSave = (mappings: readonly Readonly<AddChartOfAccountsMappingRequest>[]) =>
    postIntegrationExpenseCategoryMappings(mappings).catch(() => {
      messages.error({ title: i18n.t('Something went wrong') });
    });

  const transactionData = props.data?.content ?? [];

  const onUnlinkIntegration = async () => {
    setUnlinkingIntegration(true);
    try {
      await Promise.all([
        deleteCompanyConnection(),
        transactionData.forEach((item) => {
          if (item.syncStatus !== 'SYNCED_LOCKED')
            setActivityDetails(item.accountActivityId!, null, item.notes || '', null, null);
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

  const onSaveCreditCard = () => {
    setSavingCard(true);
    const cardId = selectedCardId()!;
    const newCard = newCreditCard();
    const isNew = cardId === NEW_CREDIT_CARD_ID;
    const prevIds = (creditCards() || []).map((card) => card.id);

    (isNew && newCard ? addBusinessCreditCard(newCard.accountName) : updateBusinessCreditCard(cardId))
      .then(() =>
        isNew
          ? until(reloadCards, () => {
              const card = creditCards()!.filter(({ id }) => !prevIds.includes(id))[0];
              if (card) setSelectedCardId(card.id);
              return Boolean(card);
            })
          : undefined,
      )
      .then(() => {
        batch(() => {
          mutate({ business: { ...business(), codatCreditCardId: selectedCardId() } });
          setNewCreditCard(undefined);
          setSavingCard(false);
        });
      })
      .catch(() => {
        setSavingCard(false);
        messages.error({ title: i18n.t('Something went wrong') });
      });
  };

  return (
    <div>
      <Section
        title={<Text message="Automatic updates" />}
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
        <AutomaticUpdates name="automatic-updates-toggle" class={css.automaticUpdates} />
      </Section>
      <Section title={<Text message="Chart of Accounts" />} class={css.section}>
        <ChartOfAccountsData
          saveOnChange
          showUpdateButton
          newCategories={updateNotifications.data}
          onSave={handleSave}
        />
      </Section>
      <Section
        title={<Text message="Credit card account" />}
        description={
          <Text
            message={
              'QuickBooks needs a credit card account to associate with expenses that are synced from ClearSpend. ' +
              'This credit card account will be the same for all synced transactions.'
            }
          />
        }
        class={css.section}
      >
        <Data data={creditCards()} loading={cardsStatus().loading} error={cardsStatus().error} onReload={reloadCards}>
          <FormItem label={<Text message="Select card" />} class={css.creditCard}>
            <CreditCardSelect
              items={cards()}
              value={selectedCardId()}
              onCreate={canManageCards(permissions()) ? setNewCreditCard : undefined}
              onChange={(id) => {
                batch(() => {
                  setSelectedCardId(id);
                  if (id !== NEW_CREDIT_CARD_ID) setNewCreditCard(undefined);
                });
              }}
            />
          </FormItem>
          <div class={css.creditCardButtons}>
            <Button
              loading={savingCard()}
              disabled={!selectedCardId() || selectedCardId() === business().codatCreditCardId}
              onClick={onSaveCreditCard}
            >
              <Text message="Save" />
            </Button>
            <Show when={newCreditCard()}>
              <Button icon="edit" disabled={savingCard()} onClick={() => setOpenEditCardName(true)}>
                <Text message="Edit Card Name" />
              </Button>
            </Show>
          </div>
          <Drawer
            open={openEditCardName() && Boolean(newCreditCard())}
            title={<Text message="New Card" />}
            onClose={() => setOpenEditCardName(false)}
          >
            <EditCardNameForm
              cardName={newCreditCard()!.accountName}
              onSave={(accountName: string) => {
                batch(() => {
                  setNewCreditCard((prev) => prev && { ...prev, accountName });
                  setOpenEditCardName(false);
                });
              }}
            />
          </Drawer>
        </Data>
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
