import { Show, For } from 'solid-js';
import { Text } from 'solid-i18n';

import { useResource } from '_common/utils/useResource';
import { Button } from '_common/components/Button';
import { Data } from 'app/components/Data';
import type { UUIDString } from 'app/types/common';
import { CardPreview } from 'cards/components/CardPreview';

import { getUser, getUserCards } from '../../services';
import { formatName } from '../../utils/formatName';

import css from './EmployeePreview.css';

interface EmployeePreviewProps {
  uid: UUIDString;
}

export function EmployeePreview(props: Readonly<EmployeePreviewProps>) {
  const [user, status, , , reload] = useResource(getUser, props.uid);
  const [cards, cardsStatus, , , reloadCards] = useResource(getUserCards, props.uid);

  return (
    <div class={css.root}>
      <Data data={user()} loading={status().loading} error={status().error} onReload={reload}>
        <div>
          <h4 class={css.name}>{formatName(user()!)}</h4>
          <div class={css.data}>{user()!.email}</div>
          <div class={css.data}>{user()!.phone}</div>
          <Data data={cards()} loading={cardsStatus().loading} error={cardsStatus().error} onReload={reloadCards}>
            <Show when={cards()?.length}>
              <div class={css.cards}>
                <h4 class={css.cardsTitle}>Cards</h4>
                <div class={css.cardsList}>
                  <For each={cards()!}>{(card) => <CardPreview data={card.card} />}</For>
                </div>
              </div>
            </Show>
          </Data>
        </div>
        <Button wide type="primary">
          <Text message="View full profile" />
        </Button>
      </Data>
    </div>
  );
}
