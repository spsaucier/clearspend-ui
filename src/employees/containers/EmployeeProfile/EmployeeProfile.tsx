import { Switch, Match, For } from 'solid-js';

import { useResource } from '_common/utils/useResource';
import { Button } from '_common/components/Button';
import { LoadingError } from 'app/components/LoadingError';
import { Loading } from 'app/components/Loading';
import type { UUIDString } from 'app/types/common';
import { CardPreview } from 'cards/components/CardPreview';

import { getUser, getUserCards } from '../../services';
import { formatName } from '../../utils/formatName';

import css from './EmployeeProfile.css';

interface EmployeeProfileProps {
  uid: UUIDString;
}

export function EmployeeProfile(props: Readonly<EmployeeProfileProps>) {
  const [user, status, , , reload] = useResource(getUser, props.uid);
  const [cards, cardsStatus, , , reloadCards] = useResource(getUserCards, props.uid);

  return (
    <div>
      <Switch>
        <Match when={status().error}>
          <LoadingError onReload={reload} />
        </Match>
        <Match when={status().loading && !user()}>
          <Loading />
        </Match>
        <Match when={user()}>
          {(data) => (
            <>
              <div class={css.data}>{formatName(data)}</div>
              <div class={css.data}>{data.email}</div>
              <Switch>
                <Match when={cardsStatus().error}>
                  <LoadingError onReload={reloadCards} />
                </Match>
                <Match when={cardsStatus().loading && !cards()}>
                  <Loading />
                </Match>
                <Match when={cards()?.length}>
                  <div class={css.cards}>
                    <h4 class={css.cardsTitle}>Cards</h4>
                    <div class={css.cardsList}>
                      <For each={cards()!}>{(card) => <CardPreview data={card.card} />}</For>
                    </div>
                  </div>
                </Match>
              </Switch>
              <Button wide type="primary" icon="edit" disabled class={css.edit}>
                Edit Employee
              </Button>
            </>
          )}
        </Match>
      </Switch>
    </div>
  );
}
