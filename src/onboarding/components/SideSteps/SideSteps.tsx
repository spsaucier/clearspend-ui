import { For } from 'solid-js';
import { useLocation } from 'solid-app-router';

import css from './SideSteps.css';

const STEPS = [
  { step: 1, title: 'Business details', url: '/onboarding/kyb' },
  { step: 2, title: 'Business leadership', url: '/onboarding/kyc' },
  { step: 3, title: 'Add bank account', url: '/onboarding/account' },
  { step: 4, title: 'Transfer money', url: '/onboarding/money' },
];

export function SideSteps() {
  const location = useLocation();

  return (
    <ul class={css.root}>
      <For each={STEPS}>
        {(step) => (
          <li class={css.item} classList={{ [css.active!]: step.url === location.pathname }}>
            <span class={css.step}>{step.step}</span>
            {step.title}
          </li>
        )}
      </For>
    </ul>
  );
}
