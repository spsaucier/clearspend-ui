import { Text } from 'solid-i18n';
import { createEffect, onCleanup } from 'solid-js';

import { Description } from 'signup/components/Description';
import { Spin } from '_common/components/Spin';

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
      <div class={css.header}>We are reviewing documents.</div>
      <Description>
        <Text
          message={
            'Once we finish reviewing your documents, we will email ' +
            props.ownerEmail +
            ' with next steps for completing your application.'
          }
        />
      </Description>
      <Spin size={'large'} />
    </div>
  );
}
