import { Match, Switch } from 'solid-js';
import { Text } from 'solid-i18n';

import { CardType as Type } from '../../types';

interface CardTypeProps {
  type: Type;
  class?: string;
}

export function CardType(props: Readonly<CardTypeProps>) {
  return (
    <span class={props.class}>
      <Switch>
        <Match when={props.type === Type.VIRTUAL}>
          <Text message="Virtual card" />
        </Match>
        <Match when={props.type === Type.PLASTIC}>
          <Text message="Physical card" />
        </Match>
      </Switch>
    </span>
  );
}
