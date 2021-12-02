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
          <Text message="Available balance details" class={css.header!} />
          <Text message="Balances are determined by how much is remaining for the card's limit OR the allocation balance." />
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
