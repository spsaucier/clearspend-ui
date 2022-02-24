import { loadStripe } from '@stripe/stripe-js';
import type {
  Stripe as BaseStripe,
  StripeConstructorOptions,
  StripeElements,
  StripeElementsOptions,
  StripeAffirmMessageElement,
  StripeElementClasses,
  StripeElementStyle,
} from '@stripe/stripe-js';

export type IssuingCardElement = Readonly<Omit<StripeAffirmMessageElement, 'on'>> & {
  on(event: string, handler: () => void): void;
};

export interface IssuingCardElementOptions {
  issuingCard: string;
  classes?: StripeElementClasses;
  style?: StripeElementStyle;
}

export interface CopyButtonElementOptions {
  toCopy: string;
  classes?: StripeElementClasses;
  style?: StripeElementStyle;
}

export type StripeIssuingCardElements = {
  create(type: 'issuingCardNumberDisplay', options: Readonly<IssuingCardElementOptions>): IssuingCardElement;
  create(type: 'issuingCardExpiryDisplay', options: Readonly<IssuingCardElementOptions>): IssuingCardElement;
  create(type: 'issuingCardCvcDisplay', options: Readonly<IssuingCardElementOptions>): IssuingCardElement;
  create(type: 'issuingCardCopyButton', options: Readonly<CopyButtonElementOptions>): IssuingCardElement;
};

export interface EphemeralKeyNonceOptions {
  issuingCard: string;
}

export interface EphemeralKeyNonce {
  nonce: string;
}

export interface RetrieveCardOptions {
  nonce: string;
  ephemeralKeySecret: string;
}

export interface Address {
  city: string;
  country: string;
  line1: string;
  line2: string | null;
  postal_code: string;
  state: string;
}

export interface Billing {
  address: Readonly<Address>;
}

export interface Metadata {
  user_id: string;
  stripe_account_id: string;
  business_id: string;
}

export interface Cardholder {
  id: string;
  object: string;
  billing: Readonly<Billing>;
  company: unknown;
  created: number;
  email: string;
  individual: unknown;
  livemode: boolean;
  metadata: Readonly<Metadata>;
  name: string;
  phone_number: string;
  requirements: unknown;
  spending_controls: unknown;
  status: string;
  type: string;
}

export interface IssuingCardResp {
  id: string;
  object: string;
  brand: string;
  cancellation_reason: unknown;
  cardholder: Readonly<Cardholder>;
  created: number;
  currency: string;
  exp_month: number;
  exp_year: number;
  last4: string;
  livemode: boolean;
  metadata: unknown;
  replaced_by: unknown;
  replacement_for: unknown;
  replacement_reason: unknown;
  shipping: unknown;
  spending_controls: unknown;
  status: string;
  type: string;
  wallets: unknown;
}

export interface Stripe extends BaseStripe {
  elements(options?: Readonly<StripeElementsOptions>): Readonly<StripeElements & StripeIssuingCardElements>;
  createEphemeralKeyNonce(options: Readonly<Partial<EphemeralKeyNonceOptions>>): Promise<Readonly<EphemeralKeyNonce>>;
  retrieveIssuingCard(cardId: string, options: Readonly<RetrieveCardOptions>): Promise<Readonly<IssuingCardResp>>;
}

export async function initStripe(pubKey: string, options?: StripeConstructorOptions) {
  return (await loadStripe(pubKey, options)) as Readonly<Stripe> | null;
}
