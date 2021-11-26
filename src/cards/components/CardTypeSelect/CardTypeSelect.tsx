import { createMemo } from 'solid-js';
import { Text } from 'solid-i18n';

import { Checkbox, CheckboxGroup, Tick } from '_common/components/Checkbox';
import { join } from '_common/utils/join';

import { Card } from '../Card';
import { CardType } from '../../types';

import css from './CardTypeSelect.css';

interface CardTypeSelectProps {
  value: readonly CardType[];
  balance?: number;
  name?: string;
  class?: string;
  onChange?: (value: CardType[]) => void;
}

export function CardTypeSelect(props: Readonly<CardTypeSelectProps>) {
  const balance = createMemo(() => props.balance || 0);

  return (
    <CheckboxGroup
      empty
      name="card-type"
      value={props.value as string[]}
      class={join(css.root, props.class)}
      onChange={(val) => props.onChange?.(val as CardType[])}
    >
      <Checkbox value={CardType.VIRTUAL} class={css.item}>
        <div class={css.content}>
          <Card type={CardType.VIRTUAL} name={props.name} number="1234" balance={balance()} class={css.card} />
          <div class={css.type}>
            <Tick class={css.control} />
            <Text message="Virtual card" />
          </div>
          <Text message="Available immediately" class={css.note!} />
          <Text
            message="Virtual cards can be accessed through the ClearSpend mobile app or added to the Apple or Android wallet."
            class={css.description!}
          />
        </div>
      </Checkbox>
      <Checkbox value={CardType.PLASTIC} class={css.item}>
        <div class={css.content}>
          <Card type={CardType.PLASTIC} name={props.name} number="1234" balance={balance()} class={css.card} />
          <div class={css.type}>
            <Tick class={css.control} />
            <Text message="Physical card" />
          </div>
          <Text message="Arrives in 1-2 weeks" class={css.note!} />
          <Text
            message="Physical cards will arrive in the mail. They have a chip and support contactless payment."
            class={css.description!}
          />
        </div>
      </Checkbox>
    </CheckboxGroup>
  );
}
