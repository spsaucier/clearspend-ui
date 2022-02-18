import { Text } from 'solid-i18n';
import { createSignal, Show, useContext } from 'solid-js';

import { Page } from 'app/components/Page';
import { Button } from '_common/components/Button';
import { BusinessContext } from 'app/containers/Main/context';
import { useResource } from '_common/utils/useResource';
import { getCodatCreditCards } from 'accounting/services';
import { Dropdown, MenuItem } from '_common/components/Dropdown';

import css from './AddCreditCardForm.css';

export function AddCreditCardForm() {
  const { business, signupUser, mutate } = useContext(BusinessContext)!;

  const [creditCards] = useResource(getCodatCreditCards);

  const [selectedCard, setSelectedCard] = createSignal<string>('');

  const onClick = async () => {
    mutate([signupUser(), { ...business(), accountingSetupStep: 'COMPLETE' }]);
  };

  return (
    <Page title={<Text message="Set Up your Quickbooks Integration" />}>
      <div class={css.root}>
        <div class={css.formWrapper}>
          <div class={css.innerWrap}>
            <h2 class={css.addCardFormTitle}>
              <Text message="Credit Card Account" />
            </h2>
            <Text message="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />
          </div>
          <div class={css.innerWrap}>
            <Text message="Select card" />
            <Show when={creditCards()}>
              <Dropdown
                id="credit-card-dropdown"
                position="bottom-right"
                menu={
                  <>
                    {creditCards() !== null &&
                      creditCards()?.results.map((card) => (
                        <MenuItem name={card.accountName} onClick={() => setSelectedCard(card.accountName)}>
                          <Text message={card.accountName} />
                        </MenuItem>
                      ))}
                  </>
                }
              >
                <Button
                  id="select-card-button"
                  size="lg"
                  class={css.dropdown}
                  icon={{ name: 'chevron-down', pos: 'right' }}
                >
                  <Text message={selectedCard() === '' ? 'Choose a card' : selectedCard()} />
                </Button>
              </Dropdown>
            </Show>
          </div>
        </div>
      </div>
      <Button onClick={onClick}>Complete Setup</Button>
    </Page>
  );
}
