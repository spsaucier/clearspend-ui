import { batch, For, Show } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { Divider } from '_common/components/Divider';
import { Select, Option, AddButton } from '_common/components/Select';
import type { CodatBankAccount } from 'generated/capital';

export const NEW_CREDIT_CARD_ID = 'NEW_CARD';

interface AddCreditCardFormProps {
  items: readonly Required<Readonly<CodatBankAccount>>[];
  value: string | undefined;
  onCreate?: (card: Required<CodatBankAccount>) => void;
  onChange: (id: string) => void;
}

export function CreditCardSelect(props: AddCreditCardFormProps) {
  const i18n = useI18n();

  return (
    <Select
      name="credit-card-select"
      value={props.value}
      placeholder={String(i18n.t('Choose a card'))}
      popupPrefix={
        <Show when={props.onCreate}>
          <AddButton
            id="create-new-card"
            onClick={() => {
              batch(() => {
                props.onCreate!({ id: NEW_CREDIT_CARD_ID, accountName: 'ClearSpend Card' });
                props.onChange(NEW_CREDIT_CARD_ID);
              });
            }}
          >
            <Text message="Create new card" />
          </AddButton>
          <Divider />
        </Show>
      }
      onChange={props.onChange}
    >
      <For each={props.items}>{(card) => <Option value={card.id}>{card.accountName}</Option>}</For>
    </Select>
  );
}
