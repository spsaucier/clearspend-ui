import { Text } from 'solid-i18n';
import { Accessor, For, Show } from 'solid-js';

import { Dropdown, MenuItem } from '_common/components/Dropdown';
import { Button } from '_common/components/Button';
import { useResource } from '_common/utils/useResource';
import { getCodatCreditCards } from 'accounting/services';
import { Icon } from '_common/components/Icon';
import { canManageCards } from 'allocations/utils/permissions';
import type { CodatCreditCard } from 'app/types/creditCard';

import { useBusiness } from '../../../app/containers/Main/context';

import css from './CreditCardSelect.css';

interface AddCreditCardFormProps {
  selectedCardName: Accessor<string>;
  setCanEditNewCard: (canEdit: boolean) => void;
  setSelectedCardName: (cardName: string) => void;
  onChange?: (card: CodatCreditCard) => void;
}

export function CreditCardSelect(props: AddCreditCardFormProps) {
  const { selectedCardName, setCanEditNewCard, setSelectedCardName, onChange } = props;
  const { permissions } = useBusiness();
  const [creditCards] = useResource(getCodatCreditCards);

  const onChangeSelectedCreditCard = async (card: CodatCreditCard) => {
    setSelectedCardName(card.accountName);
    setCanEditNewCard(false);

    if (onChange) onChange(card);
  };

  return (
    <>
      <div class={css.innerWrap}>
        <Text message="Select card" />
        <Dropdown
          id="credit-card-dropdown"
          position="bottom-left"
          menu={
            <>
              <Show when={canManageCards(permissions())}>
                <MenuItem
                  name={'Create New Card'}
                  onClick={() => {
                    setCanEditNewCard(true);
                    setSelectedCardName('ClearSpend card');
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
                    <Text message={card.accountName} />
                  </MenuItem>
                )}
              </For>
            </>
          }
        >
          <Button id="select-card-button" size="lg" class={css.dropdown} icon={{ name: 'chevron-down', pos: 'right' }}>
            <Text message={selectedCardName()} />
          </Button>
        </Dropdown>
      </div>
    </>
  );
}

export {};
