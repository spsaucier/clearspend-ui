import { Show, createSignal, JSXElement } from 'solid-js';
import { Text } from 'solid-i18n';

import { join } from '_common/utils/join';
import { Icon } from '_common/components/Icon';
import { formatRoutingNumber } from '_common/formatters/routingNumber';
import { formatAccountNumber } from 'cards/utils/formatAccountNumber';
import { useBusiness } from 'app/containers/Main/context';

import css from './InternalBankAccount.css';

interface InternalBankAccountProps {
  heading?: JSXElement;
  fallbackText?: JSXElement;
  class?: string;
  numberLinesOnly?: boolean;
}

export function InternalBankAccount(props: Readonly<InternalBankAccountProps>) {
  const { business } = useBusiness();
  const [showAccountNumber, setShowAccountNumber] = createSignal(false);
  return (
    <div class={join(!props.numberLinesOnly && css.box, css.root, props.class)}>
      <Show when={props.heading}>
        <h4 class={css.title}>{props.heading}</h4>
      </Show>
      <Show
        when={business().accountNumber}
        fallback={
          <div class={css.row}>
            <Icon size="sm" name="information" class={join(css.icon, css.red)} />
            <div class={css.darkContent}>
              {props.fallbackText || (
                <Text message="We are still setting up your account. You will receive an email notification when your account is ready." />
              )}
            </div>
          </div>
        }
      >
        <div class={css.row}>
          <Icon size="sm" name="payment-bank" class={join(css.icon, css.darkContent)} />
          <div class={css.text}>
            <Text message="Account number: " />
            <Show
              when={showAccountNumber()}
              fallback={
                <span onClick={() => setShowAccountNumber(true)} class={css.highlight}>
                  {formatAccountNumber(business().accountNumber || '')}{' '}
                  <Icon size="sm" class={css.highlight} name="view" />
                </span>
              }
            >
              <div class={css.darkContent}>{business().accountNumber}</div>
            </Show>
          </div>
        </div>
        <div class={css.row}>
          <Icon size="sm" name="channel-subscription" class={join(css.icon, css.darkContent)} />
          <div class={css.text}>
            <Text message="Routing number: " />
            <span class={css.darkContent}>{formatRoutingNumber(business().routingNumber || '')}</span>
          </div>
        </div>
      </Show>
    </div>
  );
}
