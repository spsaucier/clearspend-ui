import { mergeProps, For } from 'solid-js';

import { OnboardingStep } from 'app/types/businesses';

import css from './SideSteps.css';

const STEPS = [
  { step: ['NONE'], title: 'Business details' },
  { step: [OnboardingStep.BUSINESS_OWNERS], title: 'Business leadership' },
  { step: [OnboardingStep.SOFT_FAIL, OnboardingStep.REVIEW], title: 'Application review' },
  { step: [OnboardingStep.LINK_ACCOUNT], title: 'Add bank account' },
  { step: [OnboardingStep.TRANSFER_MONEY], title: 'Transfer money' },
];

interface SideStepsProps {
  step: OnboardingStep | undefined;
}

export function SideSteps(props: Readonly<SideStepsProps>) {
  const merged = mergeProps({ step: 'NONE' }, props);

  return (
    <ul class={css.root}>
      <For each={STEPS}>
        {(step, idx) => (
          <li class={css.item} classList={{ [css.active!]: step.step.includes(merged.step) }}>
            <span class={css.step}>0{idx() + 1}</span>
            {step.title}
          </li>
        )}
      </For>
    </ul>
  );
}
