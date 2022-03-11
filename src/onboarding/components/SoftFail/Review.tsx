import { Text } from 'solid-i18n';
import { createEffect, createSignal, onCleanup, Show } from 'solid-js';

import { Description } from 'signup/components/Description';

import { ReviewingImage } from '../ReviewingImage';

import css from './Review.css';

interface ReviewDetails {
  ownerEmail: string;
  refetch: () => Promise<unknown>;
}

const REFETCH_MS_CHECK_APPLICATION_STATUS = 10000; // 10 seconds
const MAX_REFETCH_MS_CHECK_APPLICATION_STATUS = 60000; // 60 seconds

export function Review(props: Readonly<ReviewDetails>) {
  const [totalWaitTime, setTotalWaitTime] = createSignal<number>(0);

  let refetchInterval: number;
  createEffect(() => {
    refetchInterval = setInterval(() => {
      setTotalWaitTime(totalWaitTime() + REFETCH_MS_CHECK_APPLICATION_STATUS);
      if (totalWaitTime() < MAX_REFETCH_MS_CHECK_APPLICATION_STATUS) {
        props.refetch();
      }
    }, REFETCH_MS_CHECK_APPLICATION_STATUS);
  });

  onCleanup(() => {
    clearInterval(refetchInterval);
  });

  return (
    <div class={css.content}>
      <Show when={totalWaitTime() < MAX_REFETCH_MS_CHECK_APPLICATION_STATUS}>
        <ReviewingImage class={css.image} />
        <Text message={`Hang tight, we’re reviewing your documents`} />
      </Show>
      <Show when={!(totalWaitTime() < MAX_REFETCH_MS_CHECK_APPLICATION_STATUS)}>
        <Text message={`We need some more time`} class={css.title as string} />
        <Description class={css.text}>We are reviewing documents and will get back to you soon.</Description>
        <Description class={css.text}>
          Once we finish reviewing your documents, we will email <b>{props.ownerEmail}</b> with next steps for
          completing your application.
        </Description>
        <Description class={css.text}>
          While we're reviewing everything, if you have any questions please reach out to us (phone, email, drift chat).
        </Description>
      </Show>
    </div>
  );
}
