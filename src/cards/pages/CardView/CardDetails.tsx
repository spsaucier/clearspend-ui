/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { type Stripe, loadStripe } from '@stripe/stripe-js';
import { type Accessor, createEffect, Show, createSignal } from 'solid-js';

import { revealCardKey } from 'cards/services';
import type { Card as CardType, User } from 'generated/capital';
import { useResource } from '_common/utils/useResource';
import { Loading } from 'app/components/Loading';

import { AddressView } from '../../../_common/components/AddressView/AddressView';

import css from './CardDetails.css';

interface CardDetailsProps {
  card: Accessor<CardType | undefined>;
  user: Accessor<Readonly<User> | null>;
  onClose: () => void;
}

const STYLE = {
  base: {
    color: '#666',
    fontSize: '14px',
    lineHeight: '24px',
  },
};

interface Nonce {
  nonce: string;
}

interface IssuingCard {
  issuingCard: {
    cardholder: {
      name: string;
    };
  };
}

interface StripeCS extends Stripe {
  createEphemeralKeyNonce: ({ issuingCard }: { issuingCard: string }) => Nonce;
  retrieveIssuingCard: (
    cardId: string,
    { ephemeralKeySecret, nonce }: { ephemeralKeySecret: string; nonce: string },
  ) => IssuingCard;
}

export default function CardDetails(props: CardDetailsProps) {
  const [loading, setLoading] = createSignal(true);
  const [nonceResult, setNonceResult] = createSignal<Nonce>();
  const [stripe, setStripe] = createSignal<StripeCS | null>();
  const [cardKey, , , setCardKeyParams, getCardKey] = useResource(revealCardKey, undefined, false);

  createEffect(async () => {
    setStripe(
      (await loadStripe(
        'pk_test_51K4bTGGAnZyEKADzAHWpsUzRhpZKBUdFOWgBfdfSw302hniCVohvChc3THqrUdVN7tHxqpu8JNz3ABuN35OBuYtu00m8x9cVd3',
        { betas: ['issuing_elements_2'] },
      )) as StripeCS,
    );
    // eslint-disable-next-line no-console
    console.log(stripe());
  });

  createEffect(async () => {
    if (stripe()) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const elements = stripe()?.elements() as any;

      setNonceResult(
        await stripe()?.createEphemeralKeyNonce({
          issuingCard: props.card()?.externalRef!,
        }),
      );
      setCardKeyParams({ cardId: props.card()?.cardId, nonce: nonceResult()?.nonce });

      await getCardKey();
      const ephemeralKey = cardKey()?.ephemeralKey;

      await stripe()?.retrieveIssuingCard(props.card()?.externalRef!, {
        ephemeralKeySecret: ephemeralKey!,
        nonce: nonceResult()?.nonce!,
      });

      const number = elements.create('issuingCardNumberDisplay', {
        issuingCard: props.card()?.externalRef,
        style: STYLE,
      });
      const expiry = elements.create('issuingCardExpiryDisplay', {
        issuingCard: props.card()?.externalRef,
        style: STYLE,
      });
      const cvc = elements.create('issuingCardCvcDisplay', {
        issuingCard: props.card()?.externalRef,
        style: STYLE,
      });

      setLoading(false);
      number?.mount('#card-number');
      expiry?.mount('#card-expiry');
      cvc?.mount('#card-cvc');
    }
  });

  return (
    <Show
      when={!loading()}
      fallback={
        <div class={css.root}>
          <Loading />
        </div>
      }
    >
      <div class={css.root}>
        <div>
          {props.user()?.firstName} {props.user()?.lastName}
        </div>
        <div>{props.card()?.cardLine4}</div>
        <div id="card-number" />
        <div>
          <div>Expiration:</div>
          <div id="card-expiry" />
        </div>
        <div>
          <div>CVV:</div>
          <div id="card-cvc" />
        </div>
        <Show when={props.card()?.address?.streetLine1}>
          <AddressView address={props.card()?.address || {}} />
        </Show>
      </div>
    </Show>
  );
}
