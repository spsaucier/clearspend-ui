/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { type Stripe, loadStripe } from '@stripe/stripe-js';
import { type Accessor, createEffect, Show, createSignal } from 'solid-js';
import { Text } from 'solid-i18n';

import { revealCardKey } from 'cards/services';
import type { Card as CardInterface, User } from 'generated/capital';
import { useResource } from '_common/utils/useResource';
import { Loading } from 'app/components/Loading';
import { Card } from 'cards/components/Card';
import type { CardType } from 'cards/types';

import { AddressView } from '../../../_common/components/AddressView/AddressView';

import css from './CardDetails.css';

interface CardDetailsProps {
  card: Accessor<CardInterface | undefined>;
  user: Accessor<Readonly<User> | null>;
  onClose: () => void;
}

const NUMBER_STYLE = {
  base: {
    fontSize: '20px',
    lineHeight: 2,
    fontVariant: 'tabular-nums',
  },
};
const STYLE = {
  base: {
    fontSize: '16px',
    textAlign: 'left',
    fontVariant: 'tabular-nums',
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

      const cardResult = await stripe()?.retrieveIssuingCard(props.card()?.externalRef!, {
        ephemeralKeySecret: ephemeralKey!,
        nonce: nonceResult()?.nonce!,
      });

      const nameEl = document.getElementById('cardholder-name');
      const number = elements.create('issuingCardNumberDisplay', {
        issuingCard: props.card()?.externalRef,
        style: NUMBER_STYLE,
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
      if (nameEl) {
        nameEl.textContent = cardResult?.issuingCard.cardholder.name || '';
      }
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
        <div class={css.cardBack}>
          <div class={css.cardDetails}>
            <div>
              {props.user()?.firstName} {props.user()?.lastName}
            </div>
            <div class={css.cardNumber} id="card-number"></div>
            <div class={css.expiryCvcWrapper}>
              <div class={css.expiryWrapper}>
                <div class={css.expText}>VALID UNTIL</div>
                <div class={css.cardExpiry} id="card-expiry"></div>
              </div>
              <div class={css.cvcWrapper}>
                <div class={css.cvvText}>CVV</div>
                <div class={css.cardCvc} id="card-cvc"></div>
              </div>
            </div>
          </div>
        </div>
        <Card type={(props.card()?.type || 'VIRTUAL') as CardType} />
        <Show when={props.card()?.address?.streetLine1}>
          <div class={css.addressContainer}>
            <Text message="Billing Address" />
            <AddressView address={props.card()?.address || {}} addressClass={css.address} />
          </div>
        </Show>
      </div>
    </Show>
  );
}
