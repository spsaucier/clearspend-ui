import { For } from 'solid-js';

import { OnboardingStep } from '../../types';

import css from './SideSteps.css';

const STEPS = [
  { step: OnboardingStep.kyb, title: 'Business details' },
  { step: OnboardingStep.kyc, title: 'Business leadership' },
  { step: OnboardingStep.account, title: 'Add bank account' },
  { step: OnboardingStep.money, title: 'Transfer money' },
];

interface SideStepsProps {
  step: OnboardingStep;
}

export function SideSteps(props: Readonly<SideStepsProps>) {
  return (
    <ul class={css.root}>
      <For each={STEPS}>
        {(step) => (
          <li class={css.item} classList={{ [css.active!]: step.step === props.step }}>
            <span class={css.step}>{step.step + 1}</span>
            {step.title}
          </li>
        )}
      </For>
    </ul>
  );
}
