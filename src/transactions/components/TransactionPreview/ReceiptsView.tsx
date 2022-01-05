import { For } from 'solid-js';

import { Button } from '_common/components/Button';
import { Icon } from '_common/components/Icon';

import css from './ReceiptsView.css';

export function ReceiptsView(props: { receipts: Readonly<string[]> }) {
  return (
    <div>
      <div class={css.top}>
        <span>1 of {props.receipts.length}</span>
        <span class={css.close}>
          Close <Icon name="cancel" />
        </span>
      </div>
      <For each={props.receipts}>
        {(receipt) => {
          return (
            <div class={css.receiptImageWrapper}>
              <img src={receipt} />
            </div>
          );
        }}
      </For>
      <div class={css.bottom}>
        <Button icon="download" size="lg">
          Download
        </Button>
        <Button icon="trash" size="lg" class={css.delete}>
          Delete
        </Button>
      </div>
    </div>
  );
}
