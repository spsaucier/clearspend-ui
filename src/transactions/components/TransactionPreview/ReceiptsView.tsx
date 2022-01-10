import { createSignal, For, Show } from 'solid-js';

import { deleteReceipt } from 'app/services/activity';
import { Button } from '_common/components/Button';
import { Icon } from '_common/components/Icon';

import css from './ReceiptsView.css';

export function ReceiptsView(props: { receipts: Readonly<ReceiptVideModel[]> }) {
  const [currentReceiptIndex, setCurrentReceiptIndex] = createSignal<number>(0);

  const selectReceiptAtIndex = (e: MouseEvent, index: number) => {
    e.stopPropagation();
    setCurrentReceiptIndex(index);
  };

  const nextReceipt = (e: MouseEvent) => {
    e.stopPropagation();
    setCurrentReceiptIndex(currentReceiptIndex() + 1);
  };

  const previousReceipt = (e: MouseEvent) => {
    e.stopPropagation();
    setCurrentReceiptIndex(currentReceiptIndex() - 1);
  };

  return (
    <div>
      <div class={css.top}>
        <span>
          {currentReceiptIndex() + 1} of {props.receipts.length}
        </span>
        <span class={css.close}>
          Close <Icon name="cancel" />
        </span>
      </div>
      <div class={css.receiptMiniImageWrapper}>
        <For each={props.receipts}>
          {(receipt, index) => {
            return (
              <div onClick={(e) => selectReceiptAtIndex(e, index())}>
                {index}
                <img src={receipt.uri} classList={{ [css.current!]: currentReceiptIndex() === index() }} />
              </div>
            );
          }}
        </For>
      </div>
      <>
        <div class={css.receiptImageWrapper}>
          <Show when={currentReceiptIndex() > 0}>
            <div onClick={previousReceipt}>
              <Icon name="arrow-left" />
            </div>
          </Show>
          <img src={props.receipts[currentReceiptIndex()]?.uri!} />
          <Show when={currentReceiptIndex() + 1 < props.receipts.length}>
            <div onClick={nextReceipt}>
              <Icon name="arrow-right" />
            </div>
          </Show>
        </div>
        <div class={css.bottom}>
          <Button icon="download" size="lg">
            Download
          </Button>
          <Button
            icon="trash"
            size="lg"
            class={css.delete}
            onClick={() => deleteReceipt(props.receipts[currentReceiptIndex()]?.receiptId!)}
          >
            Delete
          </Button>
        </div>
      </>
    </div>
  );
}

export interface ReceiptVideModel {
  receiptId: string;
  uri: string;
}
