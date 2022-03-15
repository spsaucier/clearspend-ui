import { Text } from 'solid-i18n';
import { createSignal, For, Show } from 'solid-js';

import { Page } from 'app/components/Page';
import { Button } from '_common/components/Button';
import { useResource } from '_common/utils/useResource';
import { getCodatCreditCards, postCodatCreditCard } from 'accounting/services';
import { Dropdown, MenuItem } from '_common/components/Dropdown';
import { Icon } from '_common/components/Icon';
import { Drawer } from '_common/components/Drawer';
import { EditCardNameForm } from 'accounting/components/EditCardNameForm';
import { CancelConfirmationButton } from 'accounting/components/CancelConfirmationButton';
import { canManageCards } from 'allocations/utils/permissions';
import { wrapAction } from '_common/utils/wrapAction';

import { useBusiness } from '../../../app/containers/Main/context';

import css from './AddCreditCardForm.css';

interface AddCreditCardFormProps {
  onNext: () => void;
  onCancel: () => void;
}

export function AddCreditCardForm(props: Readonly<AddCreditCardFormProps>) {
  const { onNext } = props;
  const { permissions } = useBusiness();
  const [creditCards] = useResource(getCodatCreditCards);
  const [selectedCardName, setSelectedCardName] = createSignal<string>('');
  const [canEditNewCard, setCanEditNewCard] = createSignal<boolean>(false);
  const [editingNewCardName, setEditingNewCardName] = createSignal<boolean>(false);
  const [loading, postCC] = wrapAction(postCodatCreditCard);

  const onClick = async () => {
    onNext();
  };

  const onClickNext = async () => {
    try {
      await postCC({
        accountName: selectedCardName(),
        accountNumber: 'clearspend-credit',
        accountType: 'Credit',
        currency: 'USD',
        institution: 'ClearSpend',
      });
      onNext();
    } catch {
      // TODO: handle error
    }
  };

  return (
    <div class={css.root}>
      <Page title={<Text message="Set Up your Quickbooks Integration" />} class={css.pageWrapper}>
        <div class={css.formWrapper}>
          <div class={css.innerWrap}>
            <h2 class={css.addCardFormTitle}>
              <Text message="Credit Card Account" />
            </h2>
            <Text message="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />
          </div>
          <div class={css.innerWrap}>
            <Text message="Select card" />
            <Dropdown
              id="credit-card-dropdown"
              position="bottom-right"
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
                      <MenuItem
                        name={card.accountName}
                        onClick={() => {
                          setSelectedCardName(card.accountName);
                          setCanEditNewCard(false);
                        }}
                      >
                        <Text message={card.accountName} />
                      </MenuItem>
                    )}
                  </For>
                </>
              }
            >
              <Button
                id="select-card-button"
                size="lg"
                class={css.dropdown}
                icon={{ name: 'chevron-down', pos: 'right' }}
              >
                <Text message={selectedCardName()} />
              </Button>
            </Dropdown>
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
        </div>
        <Drawer
          open={editingNewCardName()}
          title={<Text message="New Employee" />}
          onClose={() => setEditingNewCardName(false)}
        >
          <EditCardNameForm
            oldCardName={selectedCardName}
            onSave={(data: string) => {
              setSelectedCardName(data);
              setEditingNewCardName(false);
            }}
          />
        </Drawer>
      </Page>
      <div class={css.footer}>
        <CancelConfirmationButton onCancel={props.onCancel} />
        <Button onClick={onClick} class={css.nextButton}>
          <Text message="Skip Setup" />
        </Button>
        <Button onClick={onClickNext} type="primary" loading={loading()} class={css.nextButton}>
          <Text message="Next" />
        </Button>
      </div>
    </div>
  );
}
