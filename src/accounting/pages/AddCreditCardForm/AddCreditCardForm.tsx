import { Text } from 'solid-i18n';
import { createSignal, Show } from 'solid-js';

import { Page } from 'app/components/Page';
import { Button } from '_common/components/Button';
import { postCodatCreditCard, setCodatCreditCardforBusiness } from 'accounting/services';
import { CancelConfirmationButton } from 'accounting/components/CancelConfirmationButton';
import { wrapAction } from '_common/utils/wrapAction';
import { CreditCardSelect } from 'accounting/components/CreditCardSelect';
import { Drawer } from '_common/components/Drawer';
import { EditCardNameForm } from 'accounting/components/EditCardNameForm';
import { useBusiness } from 'app/containers/Main/context';

import css from './AddCreditCardForm.css';

interface AddCreditCardFormProps {
  onNext: () => void;
  onCancel: () => void;
}

export function AddCreditCardForm(props: Readonly<AddCreditCardFormProps>) {
  const { onNext } = props;
  const { business } = useBusiness();
  const [selectedCardId, setSelectedCardId] = createSignal<string>(business().codatCreditCardId || '');
  const [loading, postCC] = wrapAction(postCodatCreditCard);
  const [editingNewCardName, setEditingNewCardName] = createSignal<boolean>(false);
  const [canEditNewCard, setCanEditNewCard] = createSignal<boolean>(false);
  const [newCardName, setNewCardName] = createSignal<string>('ClearSpend Card');

  const saveNewCreditCard = async (cardName: string) => {
    try {
      await postCC({
        accountName: cardName,
      });
    } catch {
      // TODO: handle error
      throw new Error();
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

  const onClickNext = async () => {
    if (selectedCardId() === '') {
      saveNewCreditCard(newCardName())
        .then(() => onNext())
        .catch();
    } else {
      saveSelectedCreditCard(selectedCardId())
        .then(() => onNext())
        .catch();
    }
  };

  return (
    <div class={css.root}>
      <Page title={<Text message="Set Up your QuickBooks Online Integration" />} class={css.pageWrapper}>
        <div class={css.formWrapper}>
          <div class={css.innerWrap}>
            <h2 class={css.addCardFormTitle}>
              <Text message="Credit Card Account" />
            </h2>
            {/* <Text message="Lorem ipsum dolor sit amet, consectetur adipiscing elit." /> */}
          </div>
          <CreditCardSelect
            newCardName={newCardName}
            // onChange={(card: CodatBankAccount) => saveSelectedCreditCard(card)}
            selectedCardId={selectedCardId}
            setSelectedCardId={setSelectedCardId}
            setCanEditNewCard={setCanEditNewCard}
          ></CreditCardSelect>
          <Show when={canEditNewCard()}>
            <Button
              class={css.editButton}
              onClick={() => setEditingNewCardName(true)}
              icon={{ name: 'edit', pos: 'left' }}
            >
              <Text message="Edit Card Name" />
            </Button>
          </Show>
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
        </div>
      </Page>
      <div class={css.footer}>
        <CancelConfirmationButton onCancel={props.onCancel} />
        <Button onClick={onClickNext} type="primary" loading={loading()} class={css.nextButton}>
          <Text message="Next" />
        </Button>
      </div>
    </div>
  );
}
