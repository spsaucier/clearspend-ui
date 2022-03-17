import { Text } from 'solid-i18n';

import { ReviewingImage } from 'onboarding/components/ReviewingImage';

import css from './LoadingPage.css';

export function LoadingPage() {
  return (
    <div class={css.root}>
      <div class={css.imageWrapper}>
        <ReviewingImage />
      </div>
      <div class={css.ellipsis}>
        <Text message="Submitting & verifying your info" />
      </div>
    </div>
  );
}
