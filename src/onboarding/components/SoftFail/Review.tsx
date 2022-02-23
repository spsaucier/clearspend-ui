import { Text } from 'solid-i18n';
import { createEffect, onCleanup } from 'solid-js';

import { ReviewingImage } from '../ReviewingImage';

import css from './Review.css';

interface ReviewDetails {
  ownerEmail: String;
  refetch: (onComplete: number) => Promise<unknown>;
}

const REFETCH_MS_CHECK_APPLICATION_STATUS = 10000; // 10 seconds

export function Review(props: Readonly<ReviewDetails>) {
  let refetchInterval: number;
  createEffect(() => {
    refetchInterval = setInterval(props.refetch, REFETCH_MS_CHECK_APPLICATION_STATUS);
  });

  onCleanup(() => {
    clearInterval(refetchInterval);
  });

  return (
    <div class={css.content}>
      <ReviewingImage class={css.image} />
      <Text message={`Hang tight, we’re reviewing your documents`} />
    </div>
  );
}
