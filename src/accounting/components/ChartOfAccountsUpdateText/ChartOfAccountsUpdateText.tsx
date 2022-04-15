import { Text } from 'solid-i18n';
import { Match, Switch } from 'solid-js';

import type { BusinessNotification } from '../ChartOfAccountsData/types';

import css from './ChartOfAccountsUpdateText.css';


interface ChartOfAccountsUpdateTextProps {
  notification: BusinessNotification;
}

export function ChartOfAccountsUpdateText(props: ChartOfAccountsUpdateTextProps) {
  return (
    <div class={css.root}>
      <Switch>
        <Match when={props.notification.type === 'CHART_OF_ACCOUNTS_CREATED'}>
          <div class={css.message}>
            <Text
              message={`${props.notification.data.newValue.split('.').slice(-1)[0]} has been added to Quickbooks.`}
            />
            <div class={css.subtext}>
              <Text
                message={
                  'To sync transactions to this account, you need to assign an expense category in your Accounting Settings.'
                }
              />
            </div>
          </div>
        </Match>
        <Match when={props.notification.type === 'CHART_OF_ACCOUNTS_DELETED'}>
          <div class={css.message}>
            <Text
              message={`${props.notification.data.oldValue.split('.').slice(-1)[0]} has been removed from Quickbooks.`}
            />
          </div>
        </Match>
        <Match when={props.notification.type === 'CHART_OF_ACCOUNTS_RENAMED'}>
          <Text
            message={`${props.notification.data.oldValue.split('.').slice(-1)[0]} has changed to ${
              props.notification.data.newValue.split('.').slice(-1)[0]
            } in Quickbooks.`}
          />
        </Match>
      </Switch>
    </div>
  );
}
