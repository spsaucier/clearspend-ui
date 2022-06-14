import { Text } from 'solid-i18n';
import { JSXElement, Show } from 'solid-js';

import { Radio, RadioGroup } from '_common/components/Radio';
import { join } from '_common/utils/join';

import { Card } from '../Card';
import { CardType, LegacyIssueCardRequest } from '../../types';

import css from './CardTypeSelect.css';

interface CardTypeSelectProps {
  value: LegacyIssueCardRequest['cardType'] | '';
  name?: JSXElement;
  class?: string;
  onChange?: (value: CardType) => void;
  existingPhysical?: false | string;
}

export function CardTypeSelect(props: Readonly<CardTypeSelectProps>) {
  return (
    <RadioGroup
      empty
      name="card-type"
      value={props.value as string}
      class={join(css.root, props.class)}
      onChange={(val) => props.onChange?.(val as CardType)}
    >
      <Radio value={CardType.VIRTUAL} class={css.item}>
        <div class={css.content}>
          <Card type={CardType.VIRTUAL} number="1234" name={props.name} class={css.card} />
          <Show
            when={!props.existingPhysical}
            fallback={
              <div class={css.type}>
                <Text message="Issue a new virtual card" />
              </div>
            }
          >
            <>
              <div class={css.type}>
                <Text message="Virtual card" />
              </div>
              <Text message="Available immediately" class={css.note!} />
            </>
          </Show>
          <Text
            message="Virtual cards can be accessed through the ClearSpend mobile app or added to the Apple or Android wallet."
            class={css.description!}
          />
        </div>
      </Radio>
      <Radio value={props.existingPhysical ? 'ADD_TO_PHYSICAL' : CardType.PHYSICAL} class={css.item}>
        <div class={css.content}>
          <Card type={CardType.PHYSICAL} number={props.existingPhysical || '1234'} name={props.name} class={css.card} />
          <Show
            when={!props.existingPhysical}
            fallback={
              <>
                <div class={css.type}>
                  <Text message="Allow existing physical card to use new allocation" />
                </div>
                <Text
                  message="The employee will be able to assign their existing physical card to a different allocation."
                  class={css.description!}
                />
              </>
            }
          >
            <>
              <div class={css.type}>
                <Text message="Physical card" />
              </div>
              <Text message="Arrives in 1-2 weeks" class={css.note!} />
              <Text
                message="Physical cards will arrive in the mail. They have a chip and support contactless payment."
                class={css.description!}
              />
            </>
          </Show>
        </div>
      </Radio>
    </RadioGroup>
  );
}
