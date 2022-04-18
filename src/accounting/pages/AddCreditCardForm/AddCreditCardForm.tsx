import { Text } from 'solid-i18n';
import { createSignal, Show } from 'solid-js';

import { Page } from 'app/components/Page';
import { Button } from '_common/components/Button';
import { postCodatCreditCard } from 'accounting/services';
import { CancelConfirmationButton } from 'accounting/components/CancelConfirmationButton';
import { wrapAction } from '_common/utils/wrapAction';
import { CreditCardSelect } from '_common/components/CreditCardSelect/CreditCardSelect';
import { Drawer } from '_common/components/Drawer';
import { EditCardNameForm } from 'accounting/components/EditCardNameForm';

import css from './AddCreditCardForm.css';

interface AddCreditCardFormProps {
  onNext: () => void;
  onCancel: () => void;
}

export function AddCreditCardForm(props: Readonly<AddCreditCardFormProps>) {
  const { onNext } = props;
  const [selectedCardName, setSelectedCardName] = createSignal<string>('');
  const [loading, postCC] = wrapAction(postCodatCreditCard);
  const [editingNewCardName, setEditingNewCardName] = createSignal<boolean>(false);
  const [canEditNewCard, setCanEditNewCard] = createSignal<boolean>(false);

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

  const onClickNext = async () => {
    saveNewCreditCard(selectedCardName())
      .then(() => onNext())
      .catch();
  };

  const onSave = async (cardName: string) => {
    setSelectedCardName(cardName);
    setEditingNewCardName(false);
    saveNewCreditCard(cardName);
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
            selectedCardName={selectedCardName}
            setCanEditNewCard={setCanEditNewCard}
            setSelectedCardName={setSelectedCardName}
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
              oldCardName={selectedCardName}
              onSave={(data: string) => {
                onSave(data);
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
