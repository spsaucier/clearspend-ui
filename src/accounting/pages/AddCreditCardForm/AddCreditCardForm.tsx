import { batch, createMemo, createSignal, Show } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { useResource } from '_common/utils/useResource';
import { FormItem } from '_common/components/Form';
import { Page, PageActions } from 'app/components/Page';
import { Section } from 'app/components/Section';
import { Data } from 'app/components/Data';
import { Button } from '_common/components/Button';
import { canManageCards } from 'allocations/utils/permissions';
import { getCodatCreditCards, addBusinessCreditCard, updateBusinessCreditCard } from 'accounting/services';
import { CreditCardSelect, NEW_CREDIT_CARD_ID } from 'accounting/components/CreditCardSelect';
import { Drawer } from '_common/components/Drawer';
import { EditCardNameForm } from 'accounting/components/EditCardNameForm';
import { useBusiness } from 'app/containers/Main/context';
import { useMessages } from 'app/containers/Messages/context';
import type { CodatBankAccount } from 'generated/capital';

import css from './AddCreditCardForm.css';

interface AddCreditCardFormProps {
  onNext: () => void;
  onCancel: () => void;
}

export function AddCreditCardForm(props: Readonly<AddCreditCardFormProps>) {
  const i18n = useI18n();
  const messages = useMessages();
  const { business, permissions } = useBusiness();

  const [savingCard, setSavingCard] = createSignal(false);
  const [creditCards, cardsStatus, , , reloadCards] = useResource(getCodatCreditCards);
  const [newCreditCard, setNewCreditCard] = createSignal<Required<CodatBankAccount>>();
  const [selectedCardId, setSelectedCardId] = createSignal<string | undefined>(business().codatCreditCardId);
  const [openEditCardName, setOpenEditCardName] = createSignal(false);

  const cards = createMemo(() => {
    const items = creditCards();
    const newCard = newCreditCard();
    return items ? (newCard ? [newCard, ...items] : items) : [];
  });

  const onClickNext = async () => {
    setSavingCard(true);
    const cardId = selectedCardId()!;
    const newCard = newCreditCard();
    const isNew = cardId === NEW_CREDIT_CARD_ID;

    (isNew && newCard ? addBusinessCreditCard(newCard.accountName) : updateBusinessCreditCard(cardId))
      .then(() => props.onNext())
      .catch(() => {
        setSavingCard(false);
        messages.error({ title: i18n.t('Something went wrong') });
      });
  };

  return (
    <div class={css.root}>
      <Page title={<Text message="Set Up your QuickBooks Online Integration" />}>
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
            <Show when={newCreditCard()}>
              <Button icon="edit" disabled={savingCard()} onClick={() => setOpenEditCardName(true)}>
                <Text message="Edit Card Name" />
              </Button>
            </Show>
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
        <PageActions action={<Text message="Next" />} onCancel={props.onCancel} onSave={onClickNext} />
      </Page>
    </div>
  );
}
