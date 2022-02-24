import { createSignal, createEffect } from 'solid-js';
import type { Accessor } from 'solid-js';

import type { Stripe } from '_common/api/stripe';
import { Icon, IconName } from '_common/components/Icon';
import { join } from '_common/utils/join';
import { wait } from '_common/utils/wait';

import css from './StripeElement.css';

type ElementType = 'number' | 'expiry' | 'cvc';

const SUCCESS_COPY_DISPLAY_TIME = 2000;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ELEMENT_TYPES: Readonly<Record<ElementType, any>> = {
  number: 'issuingCardNumberDisplay',
  expiry: 'issuingCardExpiryDisplay',
  cvc: 'issuingCardCvcDisplay',
};

const ELEMENT_STYLES: Readonly<Record<ElementType, string | undefined>> = {
  number: css.number,
  expiry: css.expiry,
  cvc: css.cvc,
};

interface StripeElementProps {
  type: 'number' | 'expiry' | 'cvc';
  cardRef: string;
  stripe: Accessor<Stripe | null>;
  class?: string;
}

export function StripeElement(props: Readonly<StripeElementProps>) {
  let dataFrame!: HTMLDivElement;
  let copyFrame!: HTMLDivElement;

  const [icon, setIcon] = createSignal<keyof typeof IconName>('copy');

  createEffect(() => {
    // NOTE: it's important to use single instance of elements
    const elements = props.stripe()?.elements();
    if (!elements) return;

    elements
      .create(ELEMENT_TYPES[props.type], {
        issuingCard: props.cardRef,
        style: {
          base: {
            fontVariant: 'tabular-nums',
            fontSize: props.type === 'number' ? '20px' : '14px',
            lineHeight: props.type === 'number' ? '24px' : '16px',
          },
        },
      })
      .mount(dataFrame);

    const copyButton = elements.create('issuingCardCopyButton', {
      toCopy: props.type,
      style: { base: { lineHeight: '24px' } },
    });

    copyButton.mount(copyFrame);

    copyButton.on('click', async () => {
      setIcon('confirm-circle-filled');
      await wait(SUCCESS_COPY_DISPLAY_TIME);
      setIcon('copy');
    });
  });

  return (
    <div class={join(css.root, props.class)}>
      <div ref={dataFrame} class={join(ELEMENT_STYLES[props.type])} />
      <div class={css.copy}>
        <Icon name={icon()} />
        <div ref={copyFrame} class={css.copyFrame} />
      </div>
    </div>
  );
}
