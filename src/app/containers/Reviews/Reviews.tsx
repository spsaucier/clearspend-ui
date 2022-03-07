import { Text } from 'solid-i18n';
import { useScript } from 'solid-use-script';

import { Icon } from '_common/components/Icon';

import image from './assets/image.svg';
import avatar from './assets/ava.png';

import css from './Reviews.css';

const REVIEWS_JS = 'https://embed.typeform.com/next/embed.js';

export function Reviews() {
  const [loadingReviewJS, errorReviewJS] = useScript(REVIEWS_JS);

  return (
    <div class={css.root}>
      <div class={css.content}>
        <img src={image} alt="" width="146" height="129" class={css.image} />
        <h3 class={css.title}>
          <Text message="Heard on the streets" />
        </h3>
        <Text
          message="Since we don’t have any real reviews yet, we thought we’d share the ones from our pets..."
          class={css.text!}
        />
        <div>
          <p class={css.quote}>
            <i>It’s kinda nice to see how much peanut butters we’re buying... but what about treats for me?!</i>
          </p>
          <div class={css.author}>
            <img src={avatar} class={css.avatar} />
            <span>Oscar, Texas</span>
          </div>
        </div>
      </div>
      <Text
        message="Want to see real reviews? Why not <link>drop one here</link>"
        link={(text) => (
          <button
            data-tf-popup="fX6t0i1E"
            data-tf-size="70"
            data-tf-iframe-props="title=ClearSpend Reviews"
            data-tf-medium="snippet"
            disabled={loadingReviewJS() || Boolean(errorReviewJS())}
            class={css.button}
          >
            <strong>{text}</strong>
            <Icon name="arrow-right" size="xs" class={css.icon} />
          </button>
        )}
        class={css.footer!}
      />
    </div>
  );
}
