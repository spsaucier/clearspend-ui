import { Icon } from '_common/components/Icon';
import { Tag } from '_common/components/Tag';

import css from './BankAccount.css';

export function BankAccount() {
  return (
    <div class={css.root}>
      <Icon name="payment-bank" class={css.icon} />
      <div>
        <div class={css.header}>
          <span class={css.name}>My bank account</span>
          <Tag label="Free" size="xs" class={css.type} />
        </div>
        <div class={css.number}>••••372</div>
      </div>
    </div>
  );
}
