import { join } from '_common/utils/join';
import { Tag } from '_common/components/Tag';
import { Icon } from '_common/components/Icon';

import css from './TransactionCompact.css';

interface TransactionCompactProps {
  class?: string;
}

export function TransactionCompact(props: Readonly<TransactionCompactProps>) {
  return (
    <div class={join(css.root, props.class)}>
      <div class={css.icon} />
      <div class={css.main}>
        <div class={css.category}>Whole Foods</div>
        <div class={css.date}>May 17, 2021</div>
      </div>
      <div class={css.side}>
        <Tag size="sm" type="success">
          <span class={css.amount}>
            <Icon name="confirm" size="sm" />
            $77.92
          </span>
        </Tag>
        <div class={css.time}>2:39 PM</div>
      </div>
    </div>
  );
}
