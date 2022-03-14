import { Switch, Match } from 'solid-js';
import { Text } from 'solid-i18n';

import css from './BankTransferNotice.css';

interface BankTransferNoticeProps {
  withdraw: boolean;
  class?: string;
}

export function BankTransferNotice(props: Readonly<BankTransferNoticeProps>) {
  return (
    <div class={props.class}>
      <h4 class={css.title}>
        <Text message="Bank transfer notice" />
      </h4>
      <p class={css.message}>
        <Switch>
          <Match when={props.withdraw}>
            <Text
              message={
                'You have selected your bank account as the funding destination. ' +
                'By clicking Update Balance, you authorize ClearSpend to transfer funds from ClearSpend ' +
                'to credit the bank account specified for the amount shown above. Once authorized, ' +
                'this funds transfer cannot be canceled. ' +
                "Credits posted to your bank account are subject to hold per your bank's policies."
              }
            />
          </Match>
          <Match when={!props.withdraw}>
            <Text
              message={
                'You have selected your bank account as the funding source. ' +
                'By clicking Update Balance, you authorize ClearSpend to debit the bank account specified ' +
                'for the amount shown above. Once authorized, this funds transfer cannot be canceled. ' +
                'Please allow up to 5 business days for this transfer to be credited to your ClearSpend account.'
              }
            />
          </Match>
        </Switch>
      </p>
    </div>
  );
}
