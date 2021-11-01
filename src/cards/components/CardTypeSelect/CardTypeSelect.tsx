import { CheckboxGroup, Checkbox, Tick } from '_common/components/Checkbox';
import { join } from '_common/utils/join';

import { CardType } from '../../types';

import virtual from './assets/virtual.png';
import plastic from './assets/plastic.png';

import css from './CardTypeSelect.css';

interface CardTypeSelectProps {
  value: readonly CardType[];
  class?: string;
  onChange?: (value: CardType[]) => void;
}

export function CardTypeSelect(props: Readonly<CardTypeSelectProps>) {
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
          <img src={virtual} alt="Virtual card" width={230} height={146} />
          <div class={css.type}>
            <Tick class={css.control} />
            Virtual card
          </div>
          <div class={css.note}>Available immediately</div>
          <div class={css.description}>
            Virtual cards can be accessed through the ClearSpend mobile app or added to the Apple or Android wallet.
          </div>
        </div>
      </Checkbox>
      <Checkbox value={CardType.PLASTIC} class={css.item}>
        <div class={css.content}>
          <img src={plastic} alt="Physical card" width={230} height={146} />
          <div class={css.type}>
            <Tick class={css.control} />
            Physical card
          </div>
          <div class={css.note}>Arrives in 1-2 weeks</div>
          <div class={css.description}>
            Physical cards will arrive in the mail. They have a chip and support contactless payment.
          </div>
        </div>
      </Checkbox>
    </CheckboxGroup>
  );
}
