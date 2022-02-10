import { Text } from 'solid-i18n';

import { useNav } from '_common/api/router';
import { Button } from '_common/components/Button';

import css from './Landing.css';

export function Landing() {
  const navigate = useNav();

  return (
    <div class={css.root}>
      <div class={css.card}>
        <h3 class={css.cardTitle}>
          <Text message="Issue your first card" />
        </h3>
        <p class={css.cardMessage}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent imperdiet fermentum vulputate.
        </p>
        <Button size="lg" icon="card-add-new" class={css.cardAction} onClick={() => navigate('/cards/edit')}>
          <Text message="Issue a card" />
        </Button>
      </div>
      <div class={css.card}>
        <h3 class={css.cardTitle}>
          <Text message="Onboard your employees" />
        </h3>
        <p class={css.cardMessage}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent imperdiet fermentum vulputate.
        </p>
        <Button size="lg" icon="user" class={css.cardAction} onClick={() => navigate('/employees/edit')}>
          <Text message="Onboard your employees" />
        </Button>
      </div>
      <div class={css.card}>
        <h3 class={css.cardTitle}>
          <Text message="Create an allocation for your team" />
        </h3>
        <p class={css.cardMessage}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent imperdiet fermentum vulputate.
        </p>
        <Button size="lg" icon="amount" class={css.cardAction} onClick={() => navigate('/allocations/edit')}>
          <Text message="Create allocation" />
        </Button>
      </div>
    </div>
  );
}
