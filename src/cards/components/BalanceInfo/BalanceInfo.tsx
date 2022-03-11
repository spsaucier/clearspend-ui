import { Text } from 'solid-i18n';

import { Popover } from '_common/components/Popover';
import { Icon } from '_common/components/Icon';

import css from './BalanceInfo.css';

export function BalanceInfo() {
  return (
    <Popover
      balloon
      trigger="hover"
      position="bottom-center"
      class={css.root}
      content={
        <>
          <Text message="Available balance" class={css.header!} />
          <Text message="Amount shown is the balance available to this card, minus any pending transaction holds. Actual spending power may be limited by daily, monthly, or single-transaction limits set by your company." />
        </>
      }
    >
      {(childProps) => (
        <span {...childProps}>
          <Icon name="information" class={css.icon} />
        </span>
      )}
    </Popover>
  );
}
