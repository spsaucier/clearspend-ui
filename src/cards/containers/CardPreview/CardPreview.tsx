import { useNavigate } from 'solid-app-router';
import { Text } from 'solid-i18n';

import { useResource } from '_common/utils/useResource';
import { Button } from '_common/components/Button';
import { Data } from 'app/components/Data';
import type { UUIDString } from 'app/types/common';

import { Card } from '../../components/Card';
import { getCard } from '../../services';

import css from './CardPreview.css';

interface CardPreviewProps {
  cardID: UUIDString;
}

export function CardPreview(props: Readonly<CardPreviewProps>) {
  const navigate = useNavigate();
  const [card, status, , , reload] = useResource(getCard, props.cardID);

  return (
    <div class={css.root}>
      <Data data={card()} loading={status().loading} error={status().error} onReload={reload}>
        <div>
          <Card type={card()!.type} name="[Some Name]" number={card()!.lastFour} balance={0} class={css.card} />
        </div>
        <Button wide type="primary" onClick={() => navigate(`/cards/view/${card()!.cardId}`)}>
          <Text message="View all card details" />
        </Button>
      </Data>
    </div>
  );
}
