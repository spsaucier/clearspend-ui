import { useNavigate } from 'solid-app-router';
import { Text } from 'solid-i18n';
import { createEffect } from 'solid-js';

import { useResource } from '_common/utils/useResource';
import { Button } from '_common/components/Button';
import { Data } from 'app/components/Data';
import type { UUIDString } from 'app/types/common';
import { formatName } from 'employees/utils/formatName';
import { getUser } from 'employees/services';

import { Card } from '../../components/Card';
import { getCard } from '../../services';

import css from './CardPreview.css';

interface CardPreviewProps {
  cardID: UUIDString;
}

export function CardPreview(props: Readonly<CardPreviewProps>) {
  const navigate = useNavigate();
  const [card, status, , , reload] = useResource(getCard, props.cardID);
  const [user, , , setUserID] = useResource(getUser, undefined, false);

  createEffect(() => {
    const data = card();
    if (data) setUserID(data.userId);
  });

  return (
    <div class={css.root}>
      <Data data={card()} loading={status().loading} error={status().error} onReload={reload}>
        <div>
          <Card
            type={card()!.type}
            name={user() ? formatName(user()!) : ''}
            number={card()!.lastFour}
            balance={0}
            class={css.card}
          />
        </div>
        <Button wide type="primary" onClick={() => navigate(`/cards/view/${card()!.cardId}`)}>
          <Text message="View all card details" />
        </Button>
      </Data>
    </div>
  );
}
