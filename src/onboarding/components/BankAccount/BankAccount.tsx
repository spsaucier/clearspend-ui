import { Icon } from '_common/components/Icon';
import { Tag } from '_common/components/Tag';
import { join } from '_common/utils/join';

import css from './BankAccount.css';

interface BankAccountProps {
  selected?: boolean;
  data: Readonly<PlaidBankAccount>;
  class?: string;
  onSelect: (id: string) => void;
}

export function BankAccount(props: Readonly<BankAccountProps>) {
  return (
    <div
      class={join(css.root, props.class)}
      classList={{ [css.selected!]: props.selected }}
      onClick={() => props.onSelect(props.data.id)}
    >
      <Icon name="payment-bank" class={css.icon} />
      <div>
        <div class={css.header}>
          <span class={css.name}>{props.data.name}</span>
          <Tag label={props.data.type} size="xs" class={css.type} />
        </div>
        <div class={css.number}>••••{props.data.mask}</div>
      </div>
    </div>
  );
}
