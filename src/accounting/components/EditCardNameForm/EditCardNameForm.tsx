import { Accessor, createSignal, Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { Button } from '_common/components/Button';
import { Input } from '_common/components/Input';
import { useResource } from '_common/utils/useResource';
import { getCodatCreditCards } from 'accounting/services';

import css from './EditCardNameForm.css';

interface EditCardNameFormProps {
  cardName: Accessor<string>;
  onSave: (name: string) => void;
}

export function EditCardNameForm(props: Readonly<EditCardNameFormProps>) {
  const [newCardName, setNewCardName] = createSignal<string>(props.cardName());
  const [isCardNameValid, setIsCardNameValid] = createSignal<boolean>(true);
  const [creditCards] = useResource(getCodatCreditCards);

  const checkNewCardName = (cardName: string) => {
    setIsCardNameValid(true);
    creditCards()?.results?.forEach((card) => {
      if (card.accountName === cardName) setIsCardNameValid(false);
    });
    if (isCardNameValid()) setNewCardName(cardName);
  };

  checkNewCardName(props.cardName());

  return (
    <div class={css.root}>
      <div>
        <h1 class={css.title}>Edit Card</h1>
        <Text message="Card name" />
        <Input
          name="first-name"
          value={newCardName()}
          onChange={checkNewCardName}
          error={newCardName() === '' || !isCardNameValid()}
        />
        <Show when={!isCardNameValid()}>
          <div class={css.existingCardNameWarning}>
            <Text message="There is already an account with this name" />
          </div>
        </Show>
      </div>
      <Button onClick={() => props.onSave(newCardName())} disabled={newCardName() === '' || !isCardNameValid()}>
        <Text message="Save" />
      </Button>
    </div>
  );
}
