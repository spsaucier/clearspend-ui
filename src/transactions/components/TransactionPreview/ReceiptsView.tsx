import { createSignal, For, Setter, Show } from 'solid-js';

import { deleteReceipt, getActivityById } from 'app/services/activity';
import { Button } from '_common/components/Button';
import { Icon } from '_common/components/Icon';
import { wrapAction } from '_common/utils/wrapAction';
import type { AccountActivityResponse } from 'generated/capital';
import { HttpStatus } from '_common/api/fetch/types';

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
    const deletedReceipt = visibleReceipts()[currentReceiptIndex()];
    const remainingReceipts = visibleReceipts().filter((r) => r.receiptId !== deletedReceipt?.receiptId);
    const deleteActionResponse = await deleteReceiptAction(deletedReceipt?.receiptId!);
    if (deleteActionResponse.status === HttpStatus.OK) {
      setVisibleReceipts(remainingReceipts);
      const updatedTransaction = await getActivityById(props.accountActivityId);
      props.onDelete(updatedTransaction);

      if (remainingReceipts.length === 0) {
        props.onEmpty();
      } else {
        setCurrentReceiptIndex(0);
      }
    }
  };

  return (
    <div class={css.root}>
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
                <img src={receipt.uri} classList={{ [css.current!]: currentReceiptIndex() === index() }} />
              </div>
            );
          }}
        </For>
      </div>
      <>
        <div class={css.receiptImageWrapper}>
          <Show when={currentReceiptIndex() > 0}>
            <div onClick={previousReceipt} class={css.prevArrow}>
              <Icon name="arrow-left" />
            </div>
          </Show>
          <img src={visibleReceipts()[currentReceiptIndex()]?.uri!} />
          <Show when={currentReceiptIndex() + 1 < visibleReceipts().length}>
            <div onClick={nextReceipt} class={css.nextArrow}>
              <Icon name="arrow-right" />
            </div>
          </Show>
        </div>
        <div class={css.bottom}>
          <a
            onClick={(e) => e.stopPropagation()}
            href={visibleReceipts()[currentReceiptIndex()]?.uri}
            download={`${visibleReceipts()[currentReceiptIndex()]?.receiptId}.png`}
          >
            <Button icon="download" size="lg">
              Download
            </Button>
          </a>
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
