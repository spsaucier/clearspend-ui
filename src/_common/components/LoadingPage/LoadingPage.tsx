import { ReviewingImage } from 'onboarding/components/ReviewingImage';

import { RotatingText } from '../RotatingText/RotatingText';

import css from './LoadingPage.css';

export function LoadingPage() {
  return (
    <div class={css.root}>
      <div class={css.imageWrapper}>
        <ReviewingImage />
      </div>
      <div class={css.textWrapper}>
        <RotatingText class={css.text} />
      </div>
    </div>
  );
}
