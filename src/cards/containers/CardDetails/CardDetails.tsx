import { createMemo, createSignal, createEffect, batch, Show, Switch, Match } from 'solid-js';
import { Text } from 'solid-i18n';

import type { Card as CardInterface, User } from 'generated/capital';
import { initStripe, type Stripe } from '_common/api/stripe';
import { AddressView } from '_common/components/AddressView';
import { getNoop } from '_common/utils/getNoop';
import { LoadingError } from 'app/components/LoadingError';
import { Loading } from 'app/components/Loading';
import { useBusiness } from 'app/containers/Main/context';
import { formatName } from 'employees/utils/formatName';

import { Card } from '../../components/Card';
import { revealCardKey } from '../../services';
import type { CardType } from '../../types';

import { StripeElement } from './StripeElement';

import css from './CardDetails.css';

interface CardDetailsProps {
  card: Readonly<CardInterface>;
  user: Readonly<User>;
  onClose: () => void;
}

export function CardDetails(props: CardDetailsProps) {
  const { business } = useBusiness();

  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<unknown>();
  const [stripeObj, setStripeObj] = createSignal<Stripe | null>(null);

  const init = () => {
    setError();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    initStripe((window as CSWindow).clearspend_env?.STRIPE_PUB_KEY || process.env.STRIPE_PUB_KEY, {
      betas: ['issuing_elements_2'],
      stripeAccount: (window as CSWindow).clearspend_env?.STRIPE_ACCOUNT || process.env.STRIPE_ACCOUNT,
    })
      .then((stripe) => {
        batch(() => {
          setStripeObj(stripe);
          setError();
        });
      })
      .catch((e) => {
        setError(e);
      });
  };

  const retrieve = async () => {
    const stripe = stripeObj();
    if (!stripe) return;

    try {
      const cardRef = props.card.externalRef!;
      const nonce = (await stripe.createEphemeralKeyNonce({ issuingCard: cardRef })).nonce;
      const ephemeralKeySecret = (await revealCardKey({ cardId: props.card.cardId, nonce })).ephemeralKey!;
      // NOTE: It's important to retrieve card data (otherwise, the secure data cannot be shown)
      await stripe.retrieveIssuingCard(cardRef, { nonce, ephemeralKeySecret });
      setLoading(false);
    } catch (err: unknown) {
      setError(err);
    }
  };

  init();
  createEffect(() => retrieve().catch(getNoop()));

  const address = createMemo(() => (props.card.address?.streetLine1 ? props.card.address : business().address!));

  return (
    <Switch>
      <Match when={error()}>
        <LoadingError onReload={async () => init()} />
      </Match>
      <Match when={loading()}>
        <Loading />
      </Match>
      <Match when={stripeObj() && !loading()}>
        <div>
          <div class={css.cardWrapper}>
            <Card type={(props.card.type || 'VIRTUAL') as CardType} class={css.card} />
            <div class={css.cardDetails}>
              <div class={css.cardholder}>{formatName(props.user)}</div>
              <StripeElement type="number" cardRef={props.card.externalRef!} stripe={stripeObj} />
              <div class={css.data}>
                <div>
                  <div class={css.label}>VALID THRU</div>
                  <StripeElement type="expiry" cardRef={props.card.externalRef!} stripe={stripeObj} />
                </div>
                <div>
                  <div class={css.label}>CVV</div>
                  <StripeElement type="cvc" cardRef={props.card.externalRef!} stripe={stripeObj} />
                </div>
              </div>
            </div>
          </div>
          <Show when={address()}>
            <div class={css.addressContainer}>
              <h4 class={css.title}>
                <Text message="Billing Address" />
              </h4>
              <AddressView address={address()} class={css.address} />
            </div>
          </Show>
        </div>
      </Match>
    </Switch>
  );
}
