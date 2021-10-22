import { Button } from '_common/components/Button';

import css from './Landing.css';

export function Landing() {
  return (
    <div class={css.root}>
      <div class={css.card}>
        <h3 class={css.cardTitle}>Issue your first card</h3>
        <p class={css.cardMessage}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent imperdiet fermentum vulputate.
        </p>
        <Button type="primary" size="lg" icon="card" class={css.cardAction}>
          Issue a card
        </Button>
      </div>
      <div class={css.card}>
        <h3 class={css.cardTitle}>Onboard your employees</h3>
        <p class={css.cardMessage}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent imperdiet fermentum vulputate.
        </p>
        <Button type="primary" size="lg" icon="card" class={css.cardAction}>
          Onboard your employees
        </Button>
      </div>
      <div class={css.card}>
        <h3 class={css.cardTitle}>Create an allocation for your team</h3>
        <p class={css.cardMessage}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent imperdiet fermentum vulputate.
        </p>
        <Button type="primary" size="lg" icon="card" class={css.cardAction}>
          Create allocation
        </Button>
      </div>
    </div>
  );
}
