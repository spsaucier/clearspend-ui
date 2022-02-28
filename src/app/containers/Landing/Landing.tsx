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
          <Text message="Onboard your employees" />
        </h3>
        <p class={css.cardMessage}>
          <Text message="Give employees access! Create and manage your team member accounts here." />
        </p>
        <Button size="lg" icon="user" class={css.cardAction} onClick={() => navigate('/employees/edit')}>
          <Text message="Onboard your employees" />
        </Button>
      </div>
      <div class={css.card}>
        <h3 class={css.cardTitle}>
          <Text message="Set up allocations" />
        </h3>
        <p class={css.cardMessage}>
          <Text message="Create and fund budgets for specific business purposes." />
        </p>
        <Button size="lg" icon="amount" class={css.cardAction} onClick={() => navigate('/allocations/edit')}>
          <Text message="Create allocation" />
        </Button>
      </div>
      <div class={css.card}>
        <h3 class={css.cardTitle}>
          <Text message="Issue your first card" />
        </h3>
        <p class={css.cardMessage}>
          <Text message="It’s time to set up your first ClearSpend card." />
        </p>
        <Button size="lg" icon="card-add-new" class={css.cardAction} onClick={() => navigate('/cards/edit')}>
          <Text message="Issue a card" />
        </Button>
      </div>
    </div>
  );
}
