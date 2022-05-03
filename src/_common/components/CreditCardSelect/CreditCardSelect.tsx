import { Text } from 'solid-i18n';
import { Accessor, createMemo, For, Show } from 'solid-js';

import { Dropdown, MenuItem } from '_common/components/Dropdown';
import { Button } from '_common/components/Button';
import { Icon } from '_common/components/Icon';
import { canManageCards } from 'allocations/utils/permissions';
import type { CodatBankAccount } from 'generated/capital';
import { getCodatCreditCards } from 'accounting/services';
import { useResource } from '_common/utils/useResource';

import { useBusiness } from '../../../app/containers/Main/context';

import css from './CreditCardSelect.css';

interface AddCreditCardFormProps {
  selectedCardId: Accessor<string>;
  setSelectedCardId: (cardName: string) => void;
  newCardName: Accessor<string>;
  setCanEditNewCard: (canEdit: boolean) => void;
  onChange?: (card: CodatBankAccount) => void;
}

export function CreditCardSelect(props: AddCreditCardFormProps) {
  const { newCardName, selectedCardId, setCanEditNewCard, setSelectedCardId, onChange } = props;
  const { permissions } = useBusiness();
  const [creditCards] = useResource(getCodatCreditCards);

  const onChangeSelectedCreditCard = async (card: CodatBankAccount) => {
    setSelectedCardId(card.id!);
    setCanEditNewCard(false);

    if (onChange) onChange(card);
  };

  const display = createMemo(() => {
    if (selectedCardId() === '') {
      return newCardName();
    } else {
      const matchingCard = creditCards()?.results?.filter((card) => card.id === selectedCardId());
      if (matchingCard) {
        return matchingCard[0]?.accountName ? matchingCard[0]?.accountName : '';
      }
    }
    return '';
  });

  return (
    <>
      <div class={css.innerWrap}>
        <Text message="Select card" />
        <Dropdown
          id="credit-card-dropdown"
          position="bottom-left"
          menu={
            <>
              <div class={css.cardContainer}>
                <Show when={canManageCards(permissions())}>
                  <MenuItem
                    name={'Create New Card'}
                    onClick={() => {
                      setSelectedCardId('');
                      setCanEditNewCard(true);
                    }}
                  >
                    <div class={css.createNewCardContainer}>
                      <Icon name={'add-circle-outline'} class={css.addCardIcon} />
                      <Text message="Create New Card" />
                    </div>
                  </MenuItem>
                </Show>
                <For each={creditCards()?.results}>
                  {(card) => (
                    <MenuItem name={card.accountName} onClick={() => onChangeSelectedCreditCard(card)}>
                      <Text message={card.accountName!} />
                    </MenuItem>
                  )}
                </For>
              </div>
            </>
          }
        >
          <Button id="select-card-button" size="lg" class={css.dropdown} icon={{ name: 'chevron-down', pos: 'right' }}>
            <Text message={display()} />
          </Button>
        </Dropdown>
      </div>
    </>
  );
}

export {};
