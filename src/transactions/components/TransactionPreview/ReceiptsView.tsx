import { createSignal, Show } from 'solid-js';

import { deleteReceipt } from 'app/services/activity';
import { Button } from '_common/components/Button';
import { Icon } from '_common/components/Icon';

import css from './ReceiptsView.css';

export function ReceiptsView(props: { receipts: Readonly<ReceiptVideModel[]> }) {
  const [currentReceipt] = createSignal<ReceiptVideModel | undefined>(props.receipts[0]);

  return (
    <div>
      <div class={css.top}>
        <span>1 of {props.receipts.length}</span>
        <span class={css.close}>
          Close <Icon name="cancel" />
        </span>
      </div>
      {/* TODO: Support multiple receipts selecton when API returns more than 1 per transaction */}
      {/* <For each={props.receipts}>
        {(receipt) => {
          return (
            <div class={css.receiptImageWrapper}>
              <img src={receipt.uri} />
            </div>
          );
        }}
      </For> */}
      <Show when={currentReceipt()}>
        <>
          <div class={css.receiptImageWrapper}>
            <img src={currentReceipt()!.uri} />
          </div>
          <div class={css.bottom}>
            <Button icon="download" size="lg">
              Download
            </Button>
            <Button
              icon="trash"
              size="lg"
              class={css.delete}
              onClick={() => deleteReceipt(currentReceipt()!.receiptId)}
            >
              Delete
            </Button>
          </div>
        </>
      </Show>
    </div>
  );
}

export interface ReceiptVideModel {
  receiptId: string;
  uri: string;
}
