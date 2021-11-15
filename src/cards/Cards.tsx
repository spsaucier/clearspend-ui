import { Dynamic } from 'solid-js/web';
import { useNavigate } from 'solid-app-router';

import { useMediaContext } from '_common/api/media/context';
import { Button } from '_common/components/Button';
import { Page } from 'app/components/Page';

import { CardsList } from './components/CardsList';
import { CardsTable } from './components/CardsTable';
import CARDS from './cards.json';
import type { SearchCardResponse } from './types';

const DATA = {
  number: 0,
  size: 10,
  totalElements: CARDS.length,
  content: CARDS as unknown as SearchCardResponse['content'],
} as SearchCardResponse;

export default function Cards() {
  const navigate = useNavigate();
  const media = useMediaContext();

  return (
    <Page
      title="Cards"
      actions={
        <Button type="primary" size="lg" icon="add" onClick={() => navigate('/cards/edit')}>
          New card
        </Button>
      }
    >
      <Dynamic component={media.large ? CardsTable : CardsList} data={DATA} />
    </Page>
  );
}
