import { createSignal, For, Setter, Show } from 'solid-js';

import { deleteReceipt, getActivityById } from 'app/services/activity';
import { Button } from '_common/components/Button';
import { Icon } from '_common/components/Icon';
import { wrapAction } from '_common/utils/wrapAction';
import type { AccountActivityResponse } from 'generated/capital';

import css from './ReceiptsView.css';

export function ReceiptsView(props: {
  receipts: Readonly<ReceiptVideModel[]>;
  accountActivityId: string;
  onEmpty: () => void;
  onDelete: Setter<AccountActivityResponse | null>;
}) {
  const [currentReceiptIndex, setCurrentReceiptIndex] = createSignal<number>(0);
  const [visibleReceipts, setVisibleReceipts] = createSignal<ReceiptVideModel[]>([...props.receipts]);

  const [deleting, deleteReceiptAction] = wrapAction(deleteReceipt);

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

  const deleteSelectedReceipt = async (e: MouseEvent) => {
    e.stopPropagation();
    const deletedReceipt = visibleReceipts()[currentReceiptIndex()]; // temp
    const deleteResult = await deleteReceiptAction(visibleReceipts()[currentReceiptIndex()]?.receiptId!);
    // eslint-disable-next-line no-console
    console.log({ deleteResult, deleting: deleting() });
    const remainingReceipts = visibleReceipts().filter((r) => r.receiptId !== deletedReceipt?.receiptId);
    const updatedTransaction = await getActivityById(props.accountActivityId);

    setVisibleReceipts(remainingReceipts);
    props.onDelete(updatedTransaction);
    if (remainingReceipts.length === 0) {
      props.onEmpty();
    } else {
      setCurrentReceiptIndex(0);
    }
  };

  return (
    <div>
      <div class={css.top}>
        <span>
          {currentReceiptIndex() + 1} of {visibleReceipts().length}
        </span>
        <span class={css.close}>
          Close <Icon name="cancel" />
        </span>
      </div>
      <div class={css.receiptMiniImageWrapper}>
        <For each={visibleReceipts()}>
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
          <img src={visibleReceipts()[currentReceiptIndex()]?.uri!} />
          <Show when={currentReceiptIndex() + 1 < visibleReceipts().length}>
            <div onClick={nextReceipt}>
              <Icon name="arrow-right" />
            </div>
          </Show>
        </div>
        <div class={css.bottom}>
          <Button icon="download" size="lg">
            Download
          </Button>
          <Button icon="trash" size="lg" class={css.delete} onClick={deleteSelectedReceipt} loading={deleting()}>
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
